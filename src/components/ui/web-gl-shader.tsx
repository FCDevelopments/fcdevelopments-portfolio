"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Fullscreen RGB-wave fragment shader background.
 * Chromatic sine ridges on black — bright, high-contrast, always moving.
 * Defaults to filling its nearest positioned ancestor (absolute inset-0);
 * pass a className to change placement.
 */
export function WebGLShader({ className = "absolute inset-0 w-full h-full block" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.OrthographicCamera | null;
    renderer: THREE.WebGLRenderer | null;
    mesh: THREE.Mesh | null;
    uniforms: {
      resolution: { value: number[] };
      time: { value: number };
      xScale: { value: number };
      yScale: { value: number };
      distortion: { value: number };
    } | null;
    animationId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    // NOTE: the hero shader intentionally runs even under prefers-reduced-motion.
    // It's the site's signature visual; the CSS aurora only serves as a fallback
    // for GPUs that genuinely cannot render WebGL (handled below).

    const canvas = canvasRef.current;
    const { current: refs } = sceneRef;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      // Soft chromatic ridge. The core term prevents the 1/abs() singularity
      // from blowing out to a razor-thin, aliasing hot line — the wider/larger
      // the display, the worse that shimmer looked. A resolution-derived floor
      // keeps the ridge the same visual thickness on every screen size.
      float ridge(float py, float phase, float core) {
        return 0.05 / (abs(py + sin((phase + time) * xScale) * yScale) + core);
      }

      // Cheap hash for ordered-ish dithering.
      float hash(vec2 v) {
        return fract(sin(dot(v, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        // Normalize by HEIGHT only so vertical framing is identical across
        // aspect ratios (16:9 laptop, 21:9 ultrawide, portrait phone).
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        // Softening floor scales with pixel size (2/resolution.y) so the ridge
        // stays ~constant thickness whether rendered at 900px or 2160px tall.
        float core = 0.015 + 1.6 / resolution.y;

        vec3 col = vec3(
          ridge(p.y, rx, core),
          ridge(p.y, gx, core),
          ridge(p.y, bx, core)
        );

        // Dither: add ±1/255 of animated noise before the 8-bit write. This
        // breaks up color banding in the dark gradient falloffs — the stepped
        // blocks that read as "pixelation" on large UHD panels.
        float n = hash(gl_FragCoord.xy + fract(time)) - 0.5;
        col += n / 255.0;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return;
      const width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      const height = canvas.parentElement?.clientHeight ?? window.innerHeight;
      refs.renderer.setSize(width, height, false);
      // gl_FragCoord is in device pixels — uniform must use the real buffer size
      const buf = new THREE.Vector2();
      refs.renderer.getDrawingBufferSize(buf);
      refs.uniforms.resolution.value = [buf.x, buf.y];
    };

    const initScene = () => {
      refs.scene = new THREE.Scene();
      // Refuse software/blocklisted GPUs — the CSS fallback looks better than
      // a stuttering SwiftShader render or a frozen frame.
      refs.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: true,
      });
      // On large, low-DPR desktop panels (e.g. a 34" UHD at 100% scaling,
      // devicePixelRatio 1) supersample to 1.5x so the ridge stays smooth;
      // still cap at 2 so 4K/retina laptops don't overdraw.
      refs.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1.5), 2));
      refs.renderer.setClearColor(new THREE.Color(0x000000));

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
      };

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ];

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", positions);

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      });

      refs.mesh = new THREE.Mesh(geometry, material);
      refs.scene.add(refs.mesh);

      handleResize();
    };

    let frame = 0;
    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01;
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
        frame++;
        if (frame === 30) {
          // Sanity check: a failed shader compile renders silent black.
          // Sample a few pixels; if everything is zero, use the CSS fallback.
          const gl = refs.renderer.getContext();
          const px = new Uint8Array(4 * 16);
          gl.readPixels(0, Math.floor(gl.drawingBufferHeight / 2), 16, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
          if (!px.some((v, i) => i % 4 !== 3 && v > 0)) {
            setFailed(true);
            return;
          }
        }
      }
      refs.animationId = requestAnimationFrame(animate);
    };

    try {
      initScene();
    } catch {
      setFailed(true);
      return;
    }
    animate();
    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("resize", handleResize);
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose();
        }
      }
      refs.renderer?.dispose();
    };
  }, []);

  if (failed) {
    return <div className={`shader-fallback ${className}`} aria-hidden="true" />;
  }
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
