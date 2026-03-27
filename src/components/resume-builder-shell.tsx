"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResumePreview } from "@/src/components/resume-preview";
import {
  CertificationEntry,
  defaultResumeData,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeData,
  ResumeTemplateId,
  RoleRecommendation,
  TransferableResult,
  analyzeTransferableSkills,
  recommendRoles,
  rolePresetOptions,
  templateOptions,
} from "@/src/lib/resume-data";

/* ─────────────── pdf.js loader ─────────────── */

let _pdfjsPromise: Promise<any> | null = null;

function loadPdfJs(): Promise<any> {
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = new Promise((resolve, reject) => {
    /* Check if already loaded */
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(lib);
      } else {
        reject(new Error("pdf.js failed to initialize"));
      }
    };
    script.onerror = () => {
      _pdfjsPromise = null;
      reject(new Error("Failed to load pdf.js from CDN"));
    };
    document.head.appendChild(script);
  });
  return _pdfjsPromise;
}

/* ─────────────── helpers ─────────────── */

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function updateAt<T>(arr: T[], index: number, fn: (item: T) => T): T[] {
  return arr.map((item, i) => (i === index ? fn(item) : item));
}

function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

function splitCsv(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function newExp(): ExperienceEntry {
  return { id: `exp-${Date.now()}`, company: "", location: "", title: "", startDate: "", endDate: "", bullets: ["", ""] };
}
function newProject(): ProjectEntry {
  return { id: `proj-${Date.now()}`, name: "", stack: "", link: "", bullets: [""] };
}
function newEdu(): EducationEntry {
  return { id: `edu-${Date.now()}`, school: "", degree: "", location: "", startDate: "", endDate: "", details: [""] };
}
function newCert(): CertificationEntry {
  return { id: `cert-${Date.now()}`, name: "", issuer: "", year: "" };
}

/* ─────────────── parsing ─────────────── */

/** Recognised section headings – order matters for fallback matching. */
const SECTION_HEADINGS = [
  "professional summary", "summary", "objective", "profile",
  "core skills", "technical skills", "skills",
  "professional experience", "work experience", "experience",
  "projects",
  "leadership",
  "education",
  "certifications", "certificates",
] as const;

/**
 * Split raw resume text into a map of { sectionName → content }.
 * Works with UPPERCASE headings (e.g. "PROFESSIONAL EXPERIENCE"),
 * Title Case, or lowercase.  The key stored in the map is always
 * the lowercase version of the matched heading.
 */
function splitSections(raw: string): Map<string, string> {
  const lines = raw.split("\n");
  const sections = new Map<string, string>();
  let currentKey = "__header__"; // everything before the first heading
  const buf: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase().replace(/[:\-–—]+$/, "").trim();
    const matchedHeading = SECTION_HEADINGS.find((h) => lower === h);
    if (matchedHeading) {
      sections.set(currentKey, buf.join("\n").trim());
      buf.length = 0;
      currentKey = matchedHeading;
    } else {
      buf.push(line);
    }
  }
  sections.set(currentKey, buf.join("\n").trim());
  return sections;
}

/** Pull bullet-point lines from a block (lines starting with - or •).
 *  Handles PDF line-wrapping by joining continuation lines first. */
function parseBullets(block: string): string[] {
  const raw = block
    .split("\n")
    .map((l) => l.replace(/^\s*[-•●]\s*/, "").trim())
    .filter(Boolean);

  /* First pass: join continuation lines.
     A line is a continuation if:
     - it starts with a lowercase letter, OR
     - the previous line ends without sentence-ending punctuation (.!?)
       (i.e. the previous line was mid-sentence when PDF wrapped) */
  const joined = raw.reduce<string[]>((acc, line) => {
    if (!acc.length) { acc.push(line); return acc; }
    const prev = acc[acc.length - 1];
    const prevEndsClean = /[.!?)\d%]$/.test(prev.trim());
    const isLowerStart = /^[a-z]/.test(line);
    if (isLowerStart || (!prevEndsClean && !line.startsWith("http"))) {
      acc[acc.length - 1] += " " + line;
    } else {
      acc.push(line);
    }
    return acc;
  }, []);

  /* Second pass: keep only substantive bullets */
  return joined.filter((l) => l.length > 15).slice(0, 6);
}

/**
 * Parse experience entries inside the "experience" section.
 * Expects patterns like:
 *   Company — City, ST
 *   Title | Mon YYYY - Mon YYYY
 *   - bullet …
 */
function parseExperienceEntries(block: string): ExperienceEntry[] {
  const dateRe =
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})/i;

  /* Split on lines that look like a company name (non-bullet, non-date heading lines).
     Heuristic: a line that contains " — " or is followed by a date line. */
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  /* Detect "entry start" lines: either has " — " (company pattern) or
     is immediately followed by a date-containing line. */
  const entryStarts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("-") || line.startsWith("•")) continue;
    const nextLine = lines[i + 1] || "";
    const hasCompanySep = /\s[—–-]\s/.test(line) && !dateRe.test(line);
    const nextHasDate = dateRe.test(nextLine) || /\|/.test(nextLine);
    if (hasCompanySep || (i === 0 && !line.startsWith("-"))) {
      entryStarts.push(i);
    } else if (nextHasDate && !line.startsWith("-") && !line.startsWith("•")) {
      entryStarts.push(i);
    }
  }

  if (!entryStarts.length) return [];

  const entries: ExperienceEntry[] = [];
  for (let e = 0; e < entryStarts.length; e++) {
    const start = entryStarts[e];
    const end = e + 1 < entryStarts.length ? entryStarts[e + 1] : lines.length;
    const chunk = lines.slice(start, end);

    /* First line = company, second line = title | dates */
    const companyLine = chunk[0] || "";
    const companyParts = companyLine.split(/\s[—–-]\s/);
    const company = companyParts[0]?.trim() || companyLine;
    const location = companyParts[1]?.trim() || "";

    /* Find title & date in the next non-bullet lines */
    let title = "";
    let startDate = "";
    let endDate = "";
    for (let j = 1; j < Math.min(4, chunk.length); j++) {
      const cl = chunk[j];
      if (cl.startsWith("-") || cl.startsWith("•")) break;
      const dm = cl.match(dateRe);
      if (dm) {
        const [s, ed] = dm[0].split(/\s*[-–—]\s*/);
        startDate = s?.trim() || "";
        endDate = ed?.trim() || "";
        /* title is everything before the date, or on a pipe */
        const titlePart = cl.replace(dm[0], "").replace(/[|]/g, "").trim();
        if (titlePart) title = titlePart;
      } else if (!title && !cl.startsWith("-")) {
        title = cl.replace(/[|]/g, "").trim();
      }
    }

    const bulletBlock = chunk.filter((l) => l.startsWith("-") || l.startsWith("•")).join("\n");
    const bullets = parseBullets(bulletBlock);

    entries.push({
      id: `pe-${Date.now()}-${e}`,
      company,
      location,
      title: title || "Role",
      startDate,
      endDate,
      bullets: bullets.length ? bullets : [""],
    });
  }

  return entries;
}

/** Parse project entries from the projects section. */
function parseProjectEntries(block: string): ProjectEntry[] {
  const dateOnlyRe =
    /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})\s*$/i;

  /* First pass: join continuation lines and filter date-only lines */
  const raw = block.split("\n").map((l) => l.trim()).filter(Boolean);
  const joined: string[] = [];
  for (const line of raw) {
    if (dateOnlyRe.test(line)) {
      /* Append date to previous heading if exists */
      if (joined.length) joined[joined.length - 1] += " | " + line;
      continue;
    }
    if (joined.length && /^[a-z]/.test(line) && !line.startsWith("http")) {
      joined[joined.length - 1] += " " + line;
    } else {
      joined.push(line);
    }
  }

  /* Split into groups: each group starts with a project heading
     (contains | or — separator, suggesting "Name | Tech" or "Name — Subtitle") */
  const groups: string[][] = [];
  for (const line of joined) {
    const isBullet = line.startsWith("-") || line.startsWith("•");
    const isHeading = !isBullet && (/[|—]/.test(line) || (groups.length === 0 && !isBullet));
    if (isHeading) {
      groups.push([line]);
    } else if (groups.length) {
      groups[groups.length - 1].push(line);
    }
  }

  return groups.map((g, i) => {
    const heading = g[0] || `Project ${i + 1}`;
    /* Try to extract stack from heading:  "Name | Tech1, Tech2 |" or "Name — Tech" */
    const stackMatch = heading.match(/[|]\s*([^|]+(?:,\s*\w+)*)\s*[|]?/);
    const name = heading.split(/\s*[|]\s*/)[0]?.trim() || heading;
    const stack = stackMatch?.[1]?.trim() || "";
    const bullets = parseBullets(g.slice(1).join("\n"));
    return { id: `pp-${Date.now()}-${i}`, name, stack, link: "", bullets: bullets.length ? bullets : [""] };
  }).slice(0, 5);
}

function parseResumeText(raw: string, current: ResumeData): ResumeData {
  const text = raw.replace(/\r/g, "").trim();
  const sections = splitSections(text);
  const header = sections.get("__header__") || "";
  const headerLines = header.split("\n").map((l) => l.trim()).filter(Boolean);

  /* ── Contact ── */
  const contact = { ...current.contact };
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\+\d[\d\s().-]{8,}\d/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[A-Za-z0-9_-]+/i);
  const githubMatch = text.match(/github\.com\/[A-Za-z0-9_-]+/i);
  const locationMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2})\b/);

  /* First non-empty header line that doesn't look like a tagline/subtitle = name */
  const nameLine = headerLines.find((l) =>
    l.length < 50 && !/[|@]/.test(l) && !/placeholder/i.test(l) &&
    !/support|engineer|developer|administrator|help desk/i.test(l)
  );
  if (nameLine) contact.fullName = nameLine;
  if (emailMatch && !/placeholder/i.test(emailMatch[0])) contact.email = emailMatch[0];
  if (phoneMatch && !/placeholder/i.test(phoneMatch[0])) contact.phone = phoneMatch[0];
  if (linkedinMatch) contact.linkedin = linkedinMatch[0];
  if (githubMatch) contact.github = githubMatch[0];
  if (locationMatch) contact.location = locationMatch[1];

  /* Tagline / target title (line with pipes like "IT Support | Technical Support") */
  const tagline = headerLines.find((l) => l.includes("|") && !/@|\.com|placeholder/i.test(l));
  if (tagline) contact.targetTitle = tagline;

  /* ── Summary ── */
  const summaryBlock =
    sections.get("professional summary") ||
    sections.get("summary") ||
    sections.get("objective") ||
    sections.get("profile") ||
    "";
  const summary = summaryBlock.replace(/\n/g, " ").replace(/\s+/g, " ").trim() || current.summary;

  /* ── Skills ── */
  const skillsBlock =
    sections.get("technical skills") ||
    sections.get("core skills") ||
    sections.get("skills") ||
    "";
  const langMatch = skillsBlock.match(/(?:programming\s+languages?|languages?)\s*:\s*([^\n]+)/i);
  const toolMatch = skillsBlock.match(/(?:platforms?|tools?|systems?|software|technologies)[\s,&and]*(?:tools?|systems?|software|platforms?)?\s*:\s*([^\n]+)/i);
  const languages = langMatch
    ? langMatch[1].split(/,\s*/).map((s) => s.trim()).filter(Boolean)
    : current.skills.languages;
  const tools = toolMatch
    ? toolMatch[1].split(/,\s*/).map((s) => s.trim()).filter(Boolean)
    : current.skills.tools;

  /* If skills section is just pipe-separated keywords (CORE SKILLS style), split them */
  const strengths = (() => {
    if (langMatch || toolMatch) return current.skills.strengths;
    if (!skillsBlock) return current.skills.strengths;
    const items = skillsBlock.split(/[|,\n]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 60);
    return items.length ? items : current.skills.strengths;
  })();

  /* ── Experience ── */
  const expBlock =
    sections.get("professional experience") ||
    sections.get("work experience") ||
    sections.get("experience") ||
    "";
  const experience = expBlock ? parseExperienceEntries(expBlock) : current.experience;

  /* ── Projects ── */
  const projBlock = sections.get("projects") || "";
  const projects = projBlock ? parseProjectEntries(projBlock) : current.projects;

  /* ── Education ── */
  const eduBlock = sections.get("education") || "";
  const education: EducationEntry[] = (() => {
    if (!eduBlock) return current.education;
    const eduLines = eduBlock.split("\n").map((l) => l.trim()).filter(Boolean);
    /* Try to find school, degree, dates on first few lines */
    const schoolLine = eduLines.find((l) => /college|university|school|institute|academy/i.test(l)) || eduLines[0] || "";
    const dateM = eduBlock.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})/i);
    const degreeParts = schoolLine.split(/\s*[|—–-]\s*/);
    const school = degreeParts[0]?.trim() || "";
    const degreeFromSplit = degreeParts.find((p) => /associate|bachelor|master|gpa|degree|science|arts/i.test(p))?.trim() || "";
    const degreeLine = eduLines.find((l) => l !== schoolLine && /associate|bachelor|master|gpa|degree|science|arts/i.test(l));
    const degree = degreeFromSplit || degreeLine || degreeParts[1]?.trim() || "";

    const courseworkLine = eduLines.find((l) => /coursework/i.test(l));
    const details: string[] = [courseworkLine, ...eduLines.filter((l) => l !== schoolLine && l !== degreeLine && l !== courseworkLine && !dateM?.input?.includes(l))].filter((x): x is string => Boolean(x)).slice(0, 4);

    return [{
      id: `pe-edu-${Date.now()}`,
      school,
      degree,
      location: "",
      startDate: dateM ? dateM[0].split(/\s*[-–—]\s*/)[0]?.trim() || "" : "",
      endDate: dateM ? dateM[0].split(/\s*[-–—]\s*/)[1]?.trim() || "" : "",
      details: details.length ? details : [""],
    }];
  })();

  return {
    contact,
    summary,
    skills: { languages, tools, strengths },
    experience: experience.length ? experience : current.experience,
    projects: projects.length ? projects : current.projects,
    education: education.length ? education : current.education,
    certifications: current.certifications,
    sectionOrder: current.sectionOrder,
  };
}

/* ─────────────── toast ─────────────── */

function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        padding: "0.85rem 1.4rem",
        borderRadius: "1rem",
        background: "#121214",
        color: "#fff",
        fontSize: "0.97rem",
        fontWeight: 600,
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        transform: visible ? "translateY(0)" : "translateY(1.5rem)",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 400ms ease, transform 400ms ease",
      }}
    >
      ✓ Changes applied
    </div>
  );
}

/* ─────────────── apply button ─────────────── */

function ApplyButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="button-primary apply-button" type="button" onClick={onClick}>
      Apply changes
    </button>
  );
}

/* ─────────────── main component ─────────────── */

export function ResumeBuilderShell() {
  const [draft, setDraft] = useState<ResumeData>(() => clone(defaultResumeData));
  const [preview, setPreview] = useState<ResumeData>(() => clone(defaultResumeData));
  const [template, setTemplate] = useState<ResumeTemplateId>("classic");
  const [rawText, setRawText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [privacyMode, setPrivacyMode] = useState<"session" | "download-only">("session");
  const [showToast, setShowToast] = useState(false);
  const [smartRoles, setSmartRoles] = useState<RoleRecommendation[]>([]);
  const [customRole, setCustomRole] = useState("");
  const [transferResult, setTransferResult] = useState<TransferableResult | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyChanges = useCallback(() => {
    setPreview(clone(draft));
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2400);
  }, [draft]);

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  const skillsLine = useMemo(
    () => [...draft.skills.languages, ...draft.skills.tools.slice(0, 8)].join(" • "),
    [draft]
  );

  const matchedKeywords = useMemo(() => {
    if (!jobDescription.trim()) return [] as string[];
    const pool = [...draft.skills.languages, ...draft.skills.tools, ...draft.skills.strengths, draft.contact.targetTitle].filter(Boolean);
    return [...new Set(pool.filter((k) => jobDescription.toLowerCase().includes(k.toLowerCase())))];
  }, [jobDescription, draft]);

  /* contact */
  const setContact = (field: keyof ResumeData["contact"], value: string) =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, [field]: value } }));

  /* experience */
  const setExp = (i: number, field: keyof ExperienceEntry, value: string) =>
    setDraft((d) => ({ ...d, experience: updateAt(d.experience, i, (e) => ({ ...e, [field]: value })) }));
  const setExpBullet = (ei: number, bi: number, value: string) =>
    setDraft((d) => ({ ...d, experience: updateAt(d.experience, ei, (e) => ({ ...e, bullets: updateAt(e.bullets, bi, () => value) })) }));
  const addExpBullet = (i: number) =>
    setDraft((d) => ({ ...d, experience: updateAt(d.experience, i, (e) => ({ ...e, bullets: [...e.bullets, ""] })) }));
  const removeExpBullet = (ei: number, bi: number) =>
    setDraft((d) => ({ ...d, experience: updateAt(d.experience, ei, (e) => ({ ...e, bullets: removeAt(e.bullets, bi) })) }));
  const addExp = () => setDraft((d) => ({ ...d, experience: [...d.experience, newExp()] }));
  const removeExp = (i: number) => setDraft((d) => ({ ...d, experience: removeAt(d.experience, i) }));

  /* projects */
  const setProj = (i: number, field: keyof ProjectEntry, value: string) =>
    setDraft((d) => ({ ...d, projects: updateAt(d.projects, i, (e) => ({ ...e, [field]: value })) }));
  const setProjBullet = (ei: number, bi: number, value: string) =>
    setDraft((d) => ({ ...d, projects: updateAt(d.projects, ei, (e) => ({ ...e, bullets: updateAt(e.bullets, bi, () => value) })) }));
  const addProjBullet = (i: number) =>
    setDraft((d) => ({ ...d, projects: updateAt(d.projects, i, (e) => ({ ...e, bullets: [...e.bullets, ""] })) }));
  const removeProjBullet = (ei: number, bi: number) =>
    setDraft((d) => ({ ...d, projects: updateAt(d.projects, ei, (e) => ({ ...e, bullets: removeAt(e.bullets, bi) })) }));
  const addProj = () => setDraft((d) => ({ ...d, projects: [...d.projects, newProject()] }));
  const removeProj = (i: number) => setDraft((d) => ({ ...d, projects: removeAt(d.projects, i) }));

  /* education */
  const setEdu = (i: number, field: keyof EducationEntry, value: string) =>
    setDraft((d) => ({ ...d, education: updateAt(d.education, i, (e) => ({ ...e, [field]: value })) }));
  const setEduDetail = (ei: number, di: number, value: string) =>
    setDraft((d) => ({ ...d, education: updateAt(d.education, ei, (e) => ({ ...e, details: updateAt(e.details, di, () => value) })) }));
  const addEduDetail = (i: number) =>
    setDraft((d) => ({ ...d, education: updateAt(d.education, i, (e) => ({ ...e, details: [...e.details, ""] })) }));
  const removeEduDetail = (ei: number, di: number) =>
    setDraft((d) => ({ ...d, education: updateAt(d.education, ei, (e) => ({ ...e, details: removeAt(e.details, di) })) }));
  const addEdu = () => setDraft((d) => ({ ...d, education: [...d.education, newEdu()] }));
  const removeEdu = (i: number) => setDraft((d) => ({ ...d, education: removeAt(d.education, i) }));

  /* certifications */
  const setCert = (i: number, field: keyof CertificationEntry, value: string) =>
    setDraft((d) => ({ ...d, certifications: updateAt(d.certifications, i, (e) => ({ ...e, [field]: value })) }));
  const addCert = () => setDraft((d) => ({ ...d, certifications: [...d.certifications, newCert()] }));
  const removeCert = (i: number) => setDraft((d) => ({ ...d, certifications: removeAt(d.certifications, i) }));

  /* import — after parsing, generate smart role recommendations */
  const runSmartRoles = useCallback((parsed: ResumeData) => {
    const recs = recommendRoles(parsed);
    setSmartRoles(recs);
  }, []);

  const handleImportText = () => {
    if (!rawText.trim()) return;
    setDraft((d) => {
      const parsed = parseResumeText(rawText, d);
      runSmartRoles(parsed);
      return parsed;
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let text = "";

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      /* Extract text from PDF using pdf.js loaded from CDN */
      try {
        const pdfjsLib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          /* Reconstruct line breaks from Y-coordinate gaps */
          const items = content.items as { str?: string; transform?: number[] }[];
          let lastY: number | null = null;
          const parts: string[] = [];
          for (const item of items) {
            const y = item.transform?.[5] ?? null;
            if (lastY !== null && y !== null && Math.abs(lastY - y) > 2) {
              parts.push("\n");
            }
            parts.push(item.str || "");
            if (y !== null) lastY = y;
          }
          pages.push(parts.join(""));
        }
        text = pages.join("\n");
      } catch (err) {
        console.error("PDF parsing failed:", err);
        alert("Could not read this PDF. Try exporting it as plain text first, or paste the content directly.");
        return;
      }
    } else {
      /* Plain text / txt files */
      text = await file.text();
    }

    setRawText(text);
    setDraft((d) => {
      const parsed = parseResumeText(text, d);
      runSmartRoles(parsed);
      return parsed;
    });
  };

  const handleSaveJson = () => {
    const blob = new Blob([JSON.stringify(preview, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fcdevelopments-resume.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as ResumeData;
    setDraft(parsed);
  };

  const handleExport = () => window.print();

  /* ─────────────── render ─────────────── */
  return (
    <>
      <Toast visible={showToast} />
      <div className="builder-layout">

        {/* ── SIDEBAR ── */}
        <section className="builder-sidebar">

          <div className="builder-card">
            <p className="eyebrow">Step 1</p>
            <h2>Import or start from scratch</h2>
            <p className="muted-copy">Upload a TXT file or paste resume text. The system will extract your information into editable sections.</p>
            <label className="upload-box">
              <span className="font-semibold text-[var(--foreground)]">Upload resume</span>
              <span>Supports PDF and plain text files. We&apos;ll extract the content automatically.</span>
              <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleFileUpload} />
            </label>
            <textarea className="builder-textarea" value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Or paste resume text here…" />
            <div className="action-row mt-3">
              <button className="button-primary" type="button" onClick={handleImportText}>Import text</button>
              <button className="button-secondary" type="button" onClick={() => { setDraft(clone(defaultResumeData)); setRawText(""); }}>Reset starter</button>
            </div>
          </div>

          <div className="builder-card">
            <p className="eyebrow">Step 2</p>
            <h2>{smartRoles.length ? "Recommended roles" : "Role preset"}</h2>
            {smartRoles.length > 0 ? (
              <div className="smart-roles-grid">
                {smartRoles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="smart-role-card"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        contact: { ...d.contact, targetTitle: r.tagline },
                      }))
                    }
                  >
                    <span className="smart-role-label">{r.label}</span>
                    <span className="smart-role-confidence">{r.confidence}% match</span>
                    <span className="smart-role-signals">
                      {r.matchedSignals.slice(0, 4).map((s) => (
                        <span key={s} className="signal-chip">{s}</span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <select className="builder-input" defaultValue="" onChange={(e) => {
                const p = rolePresetOptions.find((r) => r.id === e.target.value);
                if (p) setDraft((d) => ({ ...d, contact: { ...d.contact, targetTitle: p.label } }));
              }}>
                <option value="" disabled>Upload a resume to get smart recommendations</option>
                {rolePresetOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            )}
            {smartRoles.length > 0 && (
              <p className="muted-copy mt-2">Based on your resume — click a role to apply it</p>
            )}

            {/* ── Custom desired role ── */}
            <div className="custom-role-section">
              <p className="custom-role-label">Or enter any role you&apos;d like to pursue</p>
              <div className="custom-role-row">
                <input
                  className="builder-input"
                  type="text"
                  placeholder="e.g. UX Designer, Dental Hygienist, Product Manager…"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const result = analyzeTransferableSkills(customRole, draft);
                      setTransferResult(result);
                      setDraft((d) => ({
                        ...d,
                        contact: { ...d.contact, targetTitle: result.suggestedTagline },
                      }));
                    }
                  }}
                />
                <button
                  className="button-primary"
                  type="button"
                  onClick={() => {
                    if (!customRole.trim()) return;
                    const result = analyzeTransferableSkills(customRole, draft);
                    setTransferResult(result);
                    setDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, targetTitle: result.suggestedTagline },
                    }));
                  }}
                >
                  Analyze
                </button>
              </div>
              <p className="muted-copy mt-1">Works even if the role is outside your current field — we&apos;ll find transferable skills</p>
            </div>

            {/* ── Transferable skills results ── */}
            {transferResult && (transferResult.directMatches.length > 0 || transferResult.transferableSkills.length > 0) && (
              <div className="transfer-results">
                <div className="transfer-header">
                  <span className="transfer-icon">✦</span>
                  <span className="transfer-title">
                    {transferResult.matchedRole
                      ? `Skills analysis for ${transferResult.matchedRole.label}`
                      : `Skills analysis for "${customRole}"`}
                  </span>
                </div>

                {transferResult.directMatches.length > 0 && (
                  <div className="transfer-group">
                    <p className="transfer-group-label">You already have these relevant skills</p>
                    <div className="transfer-chips">
                      {transferResult.directMatches.map((s) => (
                        <span key={s} className="signal-chip signal-chip-match">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {transferResult.transferableSkills.length > 0 && (
                  <div className="transfer-group">
                    <p className="transfer-group-label">Your transferable strengths</p>
                    <div className="transfer-skills-list">
                      {transferResult.transferableSkills.map((t) => (
                        <div key={t.label} className="transfer-skill-item">
                          <span className="transfer-skill-name">{t.label}</span>
                          <span className="transfer-skill-evidence">
                            {t.evidence.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {transferResult.gapSkills.length > 0 && (
                  <div className="transfer-group">
                    <p className="transfer-group-label">Skills to develop for this role</p>
                    <div className="transfer-chips">
                      {transferResult.gapSkills.map((s) => (
                        <span key={s} className="signal-chip signal-chip-gap">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="transfer-hint">{transferResult.summaryHint}</p>
              </div>
            )}
          </div>

          <div className="builder-card">
            <p className="eyebrow">Step 3</p>
            <h2>Template</h2>
            <select className="builder-input" value={template} onChange={(e) => setTemplate(e.target.value as ResumeTemplateId)}>
              {templateOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <p className="muted-copy mt-2">{templateOptions.find((o) => o.id === template)?.description}</p>
          </div>

          <div className="builder-card">
            <p className="eyebrow">Step 4</p>
            <h2>Privacy controls</h2>
            <div className="privacy-panel">
              <label className="privacy-option">
                <input type="radio" checked={privacyMode === "session"} onChange={() => setPrivacyMode("session")} />
                <span>Session mode: edits live only in this browser tab.</span>
              </label>
              <label className="privacy-option">
                <input type="radio" checked={privacyMode === "download-only"} onChange={() => setPrivacyMode("download-only")} />
                <span>Download-only: remind me to export before leaving.</span>
              </label>
              <div className="action-row mt-3">
                <button className="button-secondary" type="button" onClick={handleSaveJson}>Save backup JSON</button>
                <label className="button-secondary fake-button">
                  Import backup
                  <input type="file" accept="application/json,.json" onChange={handleImportJson} />
                </label>
              </div>
              <button className="button-secondary mt-2" type="button" onClick={() => { setDraft(clone(defaultResumeData)); setRawText(""); setJobDescription(""); }}>Clear all data</button>
            </div>
          </div>

          <div className="builder-card">
            <p className="eyebrow">Step 5</p>
            <h2>Job description tailoring</h2>
            <textarea className="builder-textarea" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste a job description to see keyword overlap…" />
            <div className="builder-inline-note">
              <strong>Keyword matches:</strong>{" "}
              {matchedKeywords.length ? matchedKeywords.join(" • ") : "No matches yet. Paste a job description."}
            </div>
          </div>

        </section>

        {/* ── MAIN EDITOR ── */}
        <section className="builder-main">

          <div className="builder-card">
            <div className="section-head-row">
              <div>
                <p className="eyebrow">Editing workspace</p>
                <h2>Edit • Apply • Export</h2>
              </div>
              <div className="action-row">
                <ApplyButton onClick={applyChanges} />
                <button className="button-secondary" type="button" onClick={handleExport}>Export / Print PDF</button>
              </div>
            </div>
            <div className="draft-state-banner mt-3">
              Edit any field below, then click <strong>Apply changes</strong> to update the live resume preview.
              <br />
              <strong>Preview shows:</strong> {preview.contact.fullName} — {preview.contact.targetTitle}
            </div>
            <div className="mt-4 rounded-2xl bg-[var(--surface-alt)] p-4 text-sm text-[var(--muted)]">
              <strong>Skills in draft:</strong> {skillsLine}
            </div>
          </div>

          {/* CONTACT */}
          <div className="builder-card">
            <h2>Contact info</h2>
            <div className="builder-form-grid two-column mt-3">
              <input className="builder-input" value={draft.contact.fullName} onChange={(e) => setContact("fullName", e.target.value)} placeholder="Full name" />
              <input className="builder-input" value={draft.contact.targetTitle} onChange={(e) => setContact("targetTitle", e.target.value)} placeholder="Target title / headline" />
              <input className="builder-input" value={draft.contact.email} onChange={(e) => setContact("email", e.target.value)} placeholder="Email" />
              <input className="builder-input" value={draft.contact.phone} onChange={(e) => setContact("phone", e.target.value)} placeholder="Phone" />
              <input className="builder-input" value={draft.contact.location} onChange={(e) => setContact("location", e.target.value)} placeholder="Location" />
              <input className="builder-input" value={draft.contact.linkedin} onChange={(e) => setContact("linkedin", e.target.value)} placeholder="LinkedIn" />
              <input className="builder-input" value={draft.contact.github} onChange={(e) => setContact("github", e.target.value)} placeholder="GitHub" />
              <input className="builder-input" value={draft.contact.website} onChange={(e) => setContact("website", e.target.value)} placeholder="Website" />
            </div>
            <textarea className="builder-textarea mt-3" value={draft.summary} onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))} placeholder="Professional summary…" />
          </div>

          {/* SKILLS */}
          <div className="builder-card">
            <h2>Skills</h2>
            <p className="muted-copy">Comma-separated values.</p>
            <div className="builder-form-grid mt-3">
              <textarea className="builder-textarea compact" value={draft.skills.languages.join(", ")} onChange={(e) => setDraft((d) => ({ ...d, skills: { ...d.skills, languages: splitCsv(e.target.value) } }))} placeholder="Languages (e.g. Python, JavaScript…)" />
              <textarea className="builder-textarea compact" value={draft.skills.tools.join(", ")} onChange={(e) => setDraft((d) => ({ ...d, skills: { ...d.skills, tools: splitCsv(e.target.value) } }))} placeholder="Platforms & tools (e.g. Okta, Zendesk…)" />
              <textarea className="builder-textarea compact" value={draft.skills.strengths.join(", ")} onChange={(e) => setDraft((d) => ({ ...d, skills: { ...d.skills, strengths: splitCsv(e.target.value) } }))} placeholder="Strengths (e.g. Troubleshooting, Documentation…)" />
            </div>
          </div>

          {/* EXPERIENCE */}
          <div className="builder-card">
            <div className="section-head-row">
              <h2>Experience</h2>
              <button className="button-secondary" type="button" onClick={addExp}>Add experience</button>
            </div>
            <div className="entry-stack">
              {draft.experience.map((entry, ei) => (
                <div key={entry.id} className="entry-card">
                  <div className="section-head-row small-gap">
                    <p className="entry-label">Entry {ei + 1}</p>
                    <button className="button-secondary danger-button" type="button" onClick={() => removeExp(ei)}>Remove</button>
                  </div>
                  <div className="builder-form-grid two-column">
                    <input className="builder-input" value={entry.title} onChange={(e) => setExp(ei, "title", e.target.value)} placeholder="Job title" />
                    <input className="builder-input" value={entry.company} onChange={(e) => setExp(ei, "company", e.target.value)} placeholder="Company" />
                    <input className="builder-input" value={entry.location} onChange={(e) => setExp(ei, "location", e.target.value)} placeholder="Location" />
                    <input className="builder-input" value={entry.startDate} onChange={(e) => setExp(ei, "startDate", e.target.value)} placeholder="Start date" />
                    <input className="builder-input" value={entry.endDate} onChange={(e) => setExp(ei, "endDate", e.target.value)} placeholder="End date" />
                  </div>
                  {entry.bullets.map((bullet, bi) => (
                    <div key={`${entry.id}-${bi}`} className="bullet-row">
                      <textarea className="builder-textarea compact" value={bullet} onChange={(e) => setExpBullet(ei, bi, e.target.value)} placeholder={`Bullet ${bi + 1}`} />
                      <button className="button-secondary danger-button" type="button" onClick={() => removeExpBullet(ei, bi)}>Remove</button>
                    </div>
                  ))}
                  <button className="button-secondary mt-2" type="button" onClick={() => addExpBullet(ei)}>Add bullet</button>
                </div>
              ))}
            </div>
          </div>

          {/* PROJECTS */}
          <div className="builder-card">
            <div className="section-head-row">
              <h2>Projects</h2>
              <button className="button-secondary" type="button" onClick={addProj}>Add project</button>
            </div>
            <div className="entry-stack">
              {draft.projects.map((entry, pi) => (
                <div key={entry.id} className="entry-card">
                  <div className="section-head-row small-gap">
                    <p className="entry-label">Project {pi + 1}</p>
                    <button className="button-secondary danger-button" type="button" onClick={() => removeProj(pi)}>Remove</button>
                  </div>
                  <div className="builder-form-grid two-column">
                    <input className="builder-input" value={entry.name} onChange={(e) => setProj(pi, "name", e.target.value)} placeholder="Project name" />
                    <input className="builder-input" value={entry.stack} onChange={(e) => setProj(pi, "stack", e.target.value)} placeholder="Stack / tools" />
                    <input className="builder-input full-span" value={entry.link} onChange={(e) => setProj(pi, "link", e.target.value)} placeholder="Link (optional)" />
                  </div>
                  {entry.bullets.map((bullet, bi) => (
                    <div key={`${entry.id}-${bi}`} className="bullet-row">
                      <textarea className="builder-textarea compact" value={bullet} onChange={(e) => setProjBullet(pi, bi, e.target.value)} placeholder={`Bullet ${bi + 1}`} />
                      <button className="button-secondary danger-button" type="button" onClick={() => removeProjBullet(pi, bi)}>Remove</button>
                    </div>
                  ))}
                  <button className="button-secondary mt-2" type="button" onClick={() => addProjBullet(pi)}>Add bullet</button>
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION */}
          <div className="builder-card">
            <div className="section-head-row">
              <h2>Education</h2>
              <button className="button-secondary" type="button" onClick={addEdu}>Add education</button>
            </div>
            <div className="entry-stack">
              {draft.education.map((entry, edi) => (
                <div key={entry.id} className="entry-card">
                  <div className="section-head-row small-gap">
                    <p className="entry-label">Education {edi + 1}</p>
                    <button className="button-secondary danger-button" type="button" onClick={() => removeEdu(edi)}>Remove</button>
                  </div>
                  <div className="builder-form-grid two-column">
                    <input className="builder-input" value={entry.school} onChange={(e) => setEdu(edi, "school", e.target.value)} placeholder="School" />
                    <input className="builder-input" value={entry.degree} onChange={(e) => setEdu(edi, "degree", e.target.value)} placeholder="Degree" />
                    <input className="builder-input" value={entry.location} onChange={(e) => setEdu(edi, "location", e.target.value)} placeholder="Location" />
                    <input className="builder-input" value={entry.startDate} onChange={(e) => setEdu(edi, "startDate", e.target.value)} placeholder="Start date" />
                    <input className="builder-input" value={entry.endDate} onChange={(e) => setEdu(edi, "endDate", e.target.value)} placeholder="End date" />
                  </div>
                  {entry.details.map((detail, di) => (
                    <div key={`${entry.id}-d-${di}`} className="bullet-row">
                      <textarea className="builder-textarea compact" value={detail} onChange={(e) => setEduDetail(edi, di, e.target.value)} placeholder={`Detail ${di + 1}`} />
                      <button className="button-secondary danger-button" type="button" onClick={() => removeEduDetail(edi, di)}>Remove</button>
                    </div>
                  ))}
                  <button className="button-secondary mt-2" type="button" onClick={() => addEduDetail(edi)}>Add detail</button>
                </div>
              ))}
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="builder-card">
            <div className="section-head-row">
              <h2>Certifications</h2>
              <button className="button-secondary" type="button" onClick={addCert}>Add certification</button>
            </div>
            <div className="entry-stack">
              {draft.certifications.map((entry, ci) => (
                <div key={entry.id} className="entry-card">
                  <div className="section-head-row small-gap">
                    <p className="entry-label">Certification {ci + 1}</p>
                    <button className="button-secondary danger-button" type="button" onClick={() => removeCert(ci)}>Remove</button>
                  </div>
                  <div className="builder-form-grid two-column">
                    <input className="builder-input" value={entry.name} onChange={(e) => setCert(ci, "name", e.target.value)} placeholder="Certification name" />
                    <input className="builder-input" value={entry.issuer} onChange={(e) => setCert(ci, "issuer", e.target.value)} placeholder="Issuer" />
                    <input className="builder-input" value={entry.year} onChange={(e) => setCert(ci, "year", e.target.value)} placeholder="Year" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECOND APPLY BUTTON */}
          <div className="builder-card">
            <div className="section-head-row">
              <p className="muted-copy">Happy with your changes? Apply them to the resume preview below.</p>
              <ApplyButton onClick={applyChanges} />
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <ResumePreview data={preview} template={template} />

        </section>
      </div>
    </>
  );
}
