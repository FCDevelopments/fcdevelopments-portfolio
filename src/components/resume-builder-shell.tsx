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
  analyzeExperienceLevel,
  PageRecommendation,
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
  "education & certifications", "education and certifications",
  "education",
  "certifications", "certificates",
] as const;

/**
 * Clean LaTeX-style hyphenation artifacts: "envi- ronment" → "environment"
 */
function cleanHyphenation(text: string): string {
  return text.replace(/(\w)- (\w)/g, '$1$2');
}

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
 *  Handles PDF line-wrapping by joining continuation lines first.
 *
 *  A "continuation" line is one that logically belongs to the previous bullet
 *  rather than starting a new one.  We detect this conservatively:
 *    1. The previous bullet-stripped line starts with a bullet marker and
 *       the current line does NOT — it is more content of that bullet.
 *    2. The current line starts with a lowercase letter (mid-sentence wrap).
 *    3. The previous line does not end sentence-terminally (.!?:), suggesting
 *       the sentence wasn't finished.
 *
 *  We do NOT join if the current line looks like a new bullet (starts with -•)
 *  or if the previous line ended cleanly.
 */
function parseBullets(block: string): string[] {
  const rawLines = block.split("\n");

  /* Classify each line: is it a bullet marker line or continuation content? */
  interface LineInfo { isBullet: boolean; text: string; }
  const classified: LineInfo[] = rawLines.map((l) => {
    const trimmed = l.trim();
    const isBullet = /^[-•●◦▸▹▶►]/.test(trimmed);
    const text = trimmed.replace(/^[-•●◦▸▹▶►]\s*/, "").trim();
    return { isBullet, text };
  }).filter((li) => li.text.length > 0);

  /* Merge continuation lines into their parent bullet */
  const merged: string[] = [];
  for (const li of classified) {
    if (!merged.length) {
      merged.push(li.text);
      continue;
    }
    const prev = merged[merged.length - 1];
    const prevEndsClean = /[.!?)]$/.test(prev);
    const currIsLower = /^[a-z]/.test(li.text);

    if (!li.isBullet && (currIsLower || !prevEndsClean)) {
      /* Continuation of previous bullet */
      merged[merged.length - 1] += " " + li.text;
    } else {
      merged.push(li.text);
    }
  }

  /* Keep only substantive bullets, cap at 8 per entry */
  return merged.filter((l) => l.length > 10).slice(0, 8);
}

/**
 * Parse experience entries inside the "experience" section.
 * Expects patterns like:
 *   Company — City, ST          (company line with em-dash location)
 *   Title | Mon YYYY – Mon YYYY (title + date line)
 *   - bullet …
 *
 * Also handles:
 *   Company Name                (plain company name)
 *   Job Title    Mon YYYY – Present
 *   - bullet …
 */
function parseExperienceEntries(block: string): ExperienceEntry[] {
  const dateRe =
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})/i;

  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  /**
   * Detect "entry start" lines.  A line is a new entry header when:
   *  (a) It contains a company–location separator (em-dash with content on both sides)
   *      AND does not itself contain a date range, OR
   *  (b) The NEXT non-bullet line contains a date range (title-line pattern), OR
   *  (c) The CURRENT line contains a date range preceded by a title fragment
   *      (single-line "Title | Dates" pattern).
   *
   * We deliberately do NOT auto-include i===0 to avoid treating the first
   * bullet as an entry header when the section starts with a bullet list.
   */
  const entryStarts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("-") || line.startsWith("•") || line.startsWith("●")) continue;

    const nextLine = lines[i + 1] || "";
    const hasCompanySep = /\s[—–]\s/.test(line) && !dateRe.test(line);
    const nextHasDate = dateRe.test(nextLine);

    /* Pattern (a): "Company — Location" */
    if (hasCompanySep) {
      entryStarts.push(i);
      continue;
    }
    /* Pattern (b): current line is plain company name, next is title+date */
    if (nextHasDate && !line.startsWith("-") && !line.startsWith("•")) {
      /* Make sure this isn't already a date line itself */
      if (!dateRe.test(line)) {
        entryStarts.push(i);
        continue;
      }
    }
    /* Pattern (c): single-line "Title | Mon YYYY – Present" (inline date) */
    if (dateRe.test(line) && /[|]/.test(line)) {
      /* Only mark as entry start if it's not immediately after another entry start */
      const lastStart = entryStarts[entryStarts.length - 1];
      if (lastStart === undefined || i - lastStart > 1) {
        entryStarts.push(i);
      }
    }
  }

  /* If no entry starts found, bail */

  /* Fallback: if no structural headings were detected, treat each non-bullet
     cluster as a potential entry start (prevents returning empty on unusual formats) */
  if (!entryStarts.length) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.startsWith("-") && !line.startsWith("•") && line.length > 5) {
        entryStarts.push(i);
        /* Skip until next bullet cluster */
        while (i + 1 < lines.length && !lines[i + 1].startsWith("-") && !lines[i + 1].startsWith("•")) i++;
      }
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
    const companyParts = companyLine.split(/\s[—–]\s/);
    const company = companyParts[0]?.trim() || companyLine;
    const location = companyParts[1]?.trim() || "";

    /* Find title & date in the next non-bullet lines */
    let title = "";
    let startDate = "";
    let endDate = "";
    let titleDateLineIdx = -1;
    for (let j = 1; j < Math.min(4, chunk.length); j++) {
      const cl = chunk[j];
      if (cl.startsWith("-") || cl.startsWith("•")) break;
      const dm = cl.match(dateRe);
      if (dm) {
        titleDateLineIdx = j;
        const [s, ed] = dm[0].split(/\s*[-–—]\s*/);
        startDate = s?.trim() || "";
        endDate = ed?.trim() || "";
        /* title is text BEFORE the date only */
        const dateIdx = cl.indexOf(dm[0]);
        const beforeDate = cl.substring(0, dateIdx).replace(/[|]/g, "").trim();
        if (beforeDate) title = beforeDate;
      } else if (!title && !cl.startsWith("-")) {
        title = cl.replace(/[|]/g, "").trim();
      }
    }

    /* ── Extract bullets ── */
    /* Strategy 1: traditional line-separated bullets */
    let bulletLines = chunk.filter((l) => l.startsWith("-") || l.startsWith("•"));

    /* Strategy 2: inline bullets separated by " - " within paragraph text (LaTeX PDFs) */
    if (bulletLines.length === 0) {
      /* The title/date line and subsequent lines may contain inline bullets.
         Pattern: "Title | Date - Bullet1 sentence. - Bullet2 sentence." */
      const inlineSource: string[] = [];
      for (let j = titleDateLineIdx >= 0 ? titleDateLineIdx : 1; j < chunk.length; j++) {
        const cl = chunk[j];
        if (cl === companyLine) continue;
        inlineSource.push(cl);
      }
      const joined = inlineSource.join(" ");

      /* Split on " - " that appears after a date or after a sentence ending (.!?) */
      const afterDate = dateRe.test(joined)
        ? joined.replace(dateRe, (m) => m + "|||SPLIT|||").split("|||SPLIT|||").pop() || ""
        : joined;

      /* Split on " - " pattern: must be preceded by end-of-sentence or start */
      const inlineBullets = afterDate
        .split(/\s+-\s+/)
        .map((s) => s.replace(/^[-•]\s*/, "").trim())
        .filter((s) => s.length > 15);

      if (inlineBullets.length > 0) {
        bulletLines = inlineBullets.map(b => "- " + b);
      }
    }

    const bulletBlock = bulletLines.join("\n");
    const bullets = parseBullets(bulletBlock);

    /* Clean title: remove any trailing inline bullet content that got mixed in */
    let cleanTitle = title;
    if (cleanTitle.includes(" - ") && cleanTitle.length > 35) {
      cleanTitle = cleanTitle.split(/\s+-\s+/)[0]?.trim() || cleanTitle;
    }

    entries.push({
      id: `pe-${Date.now()}-${e}`,
      company,
      location,
      title: cleanTitle || "Role",
      startDate,
      endDate,
      bullets: bullets.length ? bullets : [""],
    });
  }

  /* Deduplicate: if two consecutive entries have the same company+title, keep only the first */
  const deduped: ExperienceEntry[] = [];
  for (const entry of entries) {
    const isDupe = deduped.some(
      (existing) => existing.company === entry.company && existing.title === entry.title
    );
    if (!isDupe) deduped.push(entry);
  }
  return deduped;
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
  const text = cleanHyphenation(raw.replace(/\r/g, "")).trim();
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
    !/\[.*\]/i.test(l) &&
    !/support|engineer|developer|administrator|help desk/i.test(l)
  );
  if (nameLine) contact.fullName = nameLine;
  if (emailMatch && !/placeholder/i.test(emailMatch[0])) contact.email = emailMatch[0];
  if (phoneMatch && !/placeholder/i.test(phoneMatch[0])) contact.phone = phoneMatch[0];
  if (linkedinMatch) contact.linkedin = linkedinMatch[0];
  if (githubMatch) contact.github = githubMatch[0];
  if (locationMatch) contact.location = locationMatch[1];

  /* Strip bracket placeholders from all contact fields */
  for (const key of Object.keys(contact) as (keyof typeof contact)[]) {
    const val = contact[key];
    if (/^\[.*placeholder.*\]$/i.test(val) || /^\[.*url.*\]$/i.test(val) || /^\[.*state.*\]$/i.test(val)) {
      contact[key] = "";
    }
  }

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
  const skillsRawBlock =
    sections.get("technical skills") ||
    sections.get("core skills") ||
    sections.get("skills") ||
    "";

  /* Work line-by-line for skills so we can handle multi-line labeled sections */
  const skillsLines = skillsRawBlock.split("\n").map((l) => l.trim()).filter(Boolean);

  /* Detect labeled sub-sections: "Languages: ..." / "Tools: ..." / "Strengths: ..." etc. */
  let parsedLanguages: string[] | null = null;
  let parsedTools: string[] | null = null;
  let parsedStrengths: string[] | null = null;

  for (const line of skillsLines) {
    const langLabelMatch = line.match(/^(?:programming\s+)?languages?\s*:\s*(.+)/i);
    const toolLabelMatch = line.match(/^(?:platforms?|tools?|systems?|software|technologies)(?:[\s,&]+(?:tools?|systems?|software|platforms?))?\s*:\s*(.+)/i);
    const strengthLabelMatch = line.match(/^(?:core\s+)?strengths?\s*:\s*(.+)/i);
    const softLabelMatch = line.match(/^(?:soft\s+skills?|other\s+skills?)\s*:\s*(.+)/i);

    if (langLabelMatch) {
      parsedLanguages = langLabelMatch[1].split(/[,|]/).map((s) => s.trim()).filter(Boolean);
    } else if (toolLabelMatch) {
      parsedTools = toolLabelMatch[1].split(/[,|]/).map((s) => s.trim()).filter(Boolean);
    } else if (strengthLabelMatch || softLabelMatch) {
      const raw = (strengthLabelMatch?.[1] ?? softLabelMatch?.[1]) || "";
      parsedStrengths = raw.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
    }
  }

  const languages = parsedLanguages ?? current.skills.languages;
  const tools = parsedTools ?? current.skills.tools;

  /* If no labeled sub-sections, treat the whole block as pipe/comma-separated strengths
     (common for "CORE SKILLS" style blocks) */
  const strengths: string[] = (() => {
    if (parsedStrengths) return parsedStrengths;
    if (parsedLanguages || parsedTools) return current.skills.strengths;
    if (!skillsRawBlock.trim()) return current.skills.strengths;
    /* Strip any remaining label prefixes before splitting */
    const stripped = skillsRawBlock.replace(/^[A-Za-z\s&]+:\s*/gm, "");
    const items = stripped
      .split(/[|,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 60 && !/^\d+$/.test(s));
    return items.length ? items : current.skills.strengths;
  })();

  /* ── Experience ── */
  const expBlock =
    sections.get("professional experience") ||
    sections.get("work experience") ||
    sections.get("experience") ||
    "";
  let experience = expBlock ? parseExperienceEntries(expBlock) : current.experience;

  /* Also parse LEADERSHIP as additional experience entries */
  const leaderBlock = sections.get("leadership") || "";
  if (leaderBlock) {
    const leaderEntries = parseExperienceEntries(leaderBlock);
    if (leaderEntries.length) {
      experience = [...experience, ...leaderEntries];
    }
  }

  /* ── Projects ── */
  const projBlock = sections.get("projects") || "";
  const projects = projBlock ? parseProjectEntries(projBlock) : current.projects;

  /* ── Education ── */
  const eduBlock =
    sections.get("education") ||
    sections.get("education & certifications") ||
    sections.get("education and certifications") ||
    "";

  /* Separate certifications that may be embedded in an "Education & Certifications" section */
  let parsedCertifications: CertificationEntry[] = current.certifications;

  const education: EducationEntry[] = (() => {
    if (!eduBlock) return current.education;
    const eduLines = eduBlock.split("\n").map((l) => l.trim()).filter(Boolean);

    /* Detect certifications sub-block: lines after "Certifications:" or "Certifications" heading */
    const certStartIdx = eduLines.findIndex((l) => /^certifications?:?$/i.test(l));
    let certLines: string[] = [];
    let educationLines = eduLines;

    if (certStartIdx >= 0) {
      certLines = eduLines.slice(certStartIdx + 1);
      educationLines = eduLines.slice(0, certStartIdx);

      /* Parse certifications from sub-block */
      const certEntries: CertificationEntry[] = certLines
        .filter((l) => l.length > 3 && !l.startsWith("-") === false || l.replace(/^[-•]\s*/, "").length > 3)
        .map((l) => {
          const text = l.replace(/^[-•●]\s*/, "").trim();
          if (!text) return null;
          /* Try to extract year: "Cert Name (2023)" or "Cert Name – 2023" */
          const yearMatch = text.match(/[\(—–]\s*(\d{4})\s*\)?$/);
          const year = yearMatch?.[1] || "";
          const name = text.replace(/[\s(—–]+\d{4}\s*\)?$/, "").trim();
          /* Try to extract issuer: "Name — Issuer" or "Name, Issuer" */
          const issuerMatch = name.match(/^(.+?)\s*[—–,]\s*(.+)$/);
          return {
            id: `cert-parsed-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: issuerMatch ? issuerMatch[1].trim() : name,
            issuer: issuerMatch ? issuerMatch[2].trim() : "",
            year,
          } as CertificationEntry;
        })
        .filter((c): c is CertificationEntry => c !== null && c.name.length > 2);

      if (certEntries.length) parsedCertifications = certEntries;
    }

    /* Also check dedicated certifications block from sections */
    const certBlock = sections.get("certifications") || sections.get("certificates") || "";
    if (certBlock) {
      const certEntries: CertificationEntry[] = certBlock
        .split("\n")
        .map((l) => l.trim().replace(/^[-•●]\s*/, ""))
        .filter((l) => l.length > 3)
        .map((text) => {
          const yearMatch = text.match(/[\(—–]\s*(\d{4})\s*\)?$/);
          const year = yearMatch?.[1] || "";
          const name = text.replace(/[\s(—–]+\d{4}\s*\)?$/, "").trim();
          const issuerMatch = name.match(/^(.+?)\s*[—–,]\s*(.+)$/);
          return {
            id: `cert-parsed-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: issuerMatch ? issuerMatch[1].trim() : name,
            issuer: issuerMatch ? issuerMatch[2].trim() : "",
            year,
          };
        })
        .filter((c) => c.name.length > 2);
      if (certEntries.length) parsedCertifications = certEntries;
    }

    if (!educationLines.length) return current.education;

    /* Try to find school, degree, dates on first few lines */
    const schoolLine = educationLines.find((l) => /college|university|school|institute|academy/i.test(l)) || educationLines[0] || "";
    const dateReParsed = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})/i;
    const yearOnlyRe = /(?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|Present|Current)/i;
    const dateM = (eduBlock.match(dateReParsed) || eduBlock.match(yearOnlyRe))?.[0];

    const degreeParts = schoolLine.split(/\s*[|—–-]\s*/);
    const school = degreeParts[0]?.trim() || "";
    const degreeFromSplit = degreeParts.find((p) => /associate|bachelor|master|gpa|degree|science|arts|a\.?a\.?|b\.?s\.?|b\.?a\.?/i.test(p))?.trim() || "";
    const degreeLine = educationLines.find((l) => l !== schoolLine && /associate|bachelor|master|gpa|degree|science|arts|a\.?a\.?|b\.?s\.?|b\.?a\.?/i.test(l));
    const degree = degreeFromSplit || degreeLine || degreeParts[1]?.trim() || "";

    const courseworkLine = educationLines.find((l) => /coursework/i.test(l));
    const usedLines = new Set([schoolLine, degreeLine, courseworkLine].filter(Boolean));
    const datePrefixTrim = dateM ? (dateM.split(/[-–—]/)[0] ?? "").trim() : "";
    const extraLines = educationLines.filter((l) => !usedLines.has(l) && !(datePrefixTrim && l.includes(datePrefixTrim)));
    const detailCandidates: (string | undefined)[] = [courseworkLine, ...extraLines];
    const details: string[] = detailCandidates
      .filter((x): x is string => typeof x === "string" && x.length > 3)
      .slice(0, 4);

    let startDate = "";
    let endDate = "";
    if (dateM) {
      const parts = dateM.split(/\s*[-–—]\s*/);
      startDate = parts[0]?.trim() || "";
      endDate = parts[1]?.trim() || "";
    }

    return [{
      id: `pe-edu-${Date.now()}`,
      school,
      degree,
      location: "",
      startDate,
      endDate,
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
    certifications: parsedCertifications,
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
  const [twoPage, setTwoPage] = useState(false);
  const [pageRec, setPageRec] = useState<PageRecommendation | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyChanges = useCallback(() => {
    setPreview(clone(draft));
    const rec = analyzeExperienceLevel(draft);
    setPageRec(rec);
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

  const atsAnalysis = useMemo(() => {
    if (!jobDescription.trim()) return null;
    const jd = jobDescription.toLowerCase();

    /* Build full resume corpus for matching */
    const resumeCorpus = [
      draft.contact.targetTitle,
      draft.summary,
      ...draft.skills.languages,
      ...draft.skills.tools,
      ...draft.skills.strengths,
      ...draft.experience.flatMap((e) => [e.title, e.company, ...e.bullets]),
      ...draft.projects.flatMap((p) => [p.name, p.stack, ...p.bullets]),
      ...draft.certifications.map((c) => c.name),
    ].filter(Boolean).join(" ").toLowerCase();

    /* Skill pool for keyword matching */
    const pool = [...draft.skills.languages, ...draft.skills.tools, ...draft.skills.strengths, draft.contact.targetTitle].filter(Boolean);
    const matched = [...new Set(pool.filter((k) => jd.includes(k.toLowerCase())))];

    /* Extract meaningful words from JD (4+ chars, not stopwords) */
    const stopwords = new Set(["with","that","this","from","have","your","will","their","they","what","when","were","also","into","each","more","than","about","after","before","other","which","where","there","these","those","through","between","during","within","without","against","across","while","some","such","been","over","under","both","either","among","being","having","should","would","could","shall","must","need","doing","done","make","made","take","taken","give","given","able","like","well","best","good","strong","work","working","team","teams","business"]);
    const jdWords = jd.match(/\b[a-z]{4,}\b/g) || [];
    const jdWordFreq = new Map<string, number>();
    for (const w of jdWords) {
      if (!stopwords.has(w)) jdWordFreq.set(w, (jdWordFreq.get(w) || 0) + 1);
    }

    /* Find JD keywords missing from resume (appear 2+ times in JD, not in resume corpus) */
    const missingKeywords = [...jdWordFreq.entries()]
      .filter(([word, freq]) => freq >= 2 && !resumeCorpus.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    /* Simple score: matched / total unique skill keywords in resume */
    const score = pool.length > 0 ? Math.round((matched.length / Math.max(pool.length, 1)) * 100) : 0;

    return { matched, missingKeywords, score };
  }, [jobDescription, draft]);

  const matchedKeywords = atsAnalysis?.matched ?? [];

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
    const parsed = parseResumeText(rawText, clone(draft));
    runSmartRoles(parsed);
    setDraft(parsed);
    /* Auto-apply to preview */
    setPreview(clone(parsed));
    const rec = analyzeExperienceLevel(parsed);
    setPageRec(rec);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2400);
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
          /**
           * Reconstruct line breaks from Y-coordinate gaps.
           *
           * Key insight: PDF text items within the SAME visual line can have
           * slightly different Y values due to sub-pixel rendering, baseline
           * shifts for superscripts, etc.  We only insert a newline when the
           * Y delta is large enough to indicate a *real* new line.  A
           * threshold of ~5–6 PDF units (~2 pt) is safe for most resumes;
           * we also skip emitting a newline when the previous token ended
           * with a word character (it's a same-word split across two spans).
           */
          const items = content.items as { str?: string; transform?: number[] }[];
          let lastY: number | null = null;
          const parts: string[] = [];
          for (const item of items) {
            const str = item.str || "";
            const y = item.transform?.[5] ?? null;

            if (lastY !== null && y !== null) {
              const delta = Math.abs(lastY - y);
              if (delta > 5) {
                /* Real new line — but avoid double-newlines */
                if (parts.length && parts[parts.length - 1] !== "\n") {
                  parts.push("\n");
                }
              } else if (delta > 0.5) {
                /* Sub-pixel shift on same line — may be a word boundary */
                const prev = parts[parts.length - 1] || "";
                if (prev && !prev.endsWith(" ") && str && !str.startsWith(" ")) {
                  parts.push(" ");
                }
              }
            }
            parts.push(str);
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
    const currentDraft = clone(draft);
    const parsed = parseResumeText(text, currentDraft);
    runSmartRoles(parsed);
    setDraft(parsed);
    /* Auto-apply to preview immediately */
    setPreview(clone(parsed));
    const rec = analyzeExperienceLevel(parsed);
    setPageRec(rec);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2400);
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
            <p className="eyebrow">Import</p>
            <h2>Upload your resume</h2>
            <label className="upload-box">
              <span className="font-semibold text-[var(--foreground)]">Drop a PDF or TXT file here</span>
              <span style={{ fontSize: "0.78rem" }}>or click to browse</span>
              <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleFileUpload} />
            </label>
            <textarea className="builder-textarea" value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Or paste resume text here…" />
            <div className="action-row mt-3">
              <button className="button-primary" type="button" onClick={handleImportText}>Import text</button>
              <button className="button-secondary" type="button" onClick={() => { setDraft(clone(defaultResumeData)); setRawText(""); }}>Reset</button>
            </div>
          </div>

          <div className="builder-card">
            <p className="eyebrow">Target Role</p>
            <h2>{smartRoles.length ? "Recommended roles" : "Choose a direction"}</h2>
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
            <p className="eyebrow">Template</p>
            <h2>Style</h2>
            <select className="builder-input" value={template} onChange={(e) => setTemplate(e.target.value as ResumeTemplateId)}>
              {templateOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <p className="muted-copy mt-2">{templateOptions.find((o) => o.id === template)?.description}</p>
          </div>

          <div className="builder-card">
            <p className="eyebrow">Privacy</p>
            <h2>Data handling</h2>
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
            <p className="eyebrow">ATS Check</p>
            <h2>Job description match</h2>
            <textarea className="builder-textarea" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste a job description to see keyword overlap, match score, and gaps…" />
            {atsAnalysis ? (
              <div className="ats-results">
                {/* Score bar */}
                <div className="ats-score-row">
                  <span className="ats-score-label">Keyword match score</span>
                  <span className={`ats-score-value ${atsAnalysis.score >= 70 ? "ats-score-good" : atsAnalysis.score >= 40 ? "ats-score-ok" : "ats-score-low"}`}>
                    {atsAnalysis.score}%
                  </span>
                </div>
                <div className="ats-score-bar-track">
                  <div
                    className={`ats-score-bar-fill ${atsAnalysis.score >= 70 ? "ats-fill-good" : atsAnalysis.score >= 40 ? "ats-fill-ok" : "ats-fill-low"}`}
                    style={{ width: `${Math.min(atsAnalysis.score, 100)}%` }}
                  />
                </div>

                {/* Matched keywords */}
                {atsAnalysis.matched.length > 0 && (
                  <div className="ats-group">
                    <p className="ats-group-label">✓ Found in your resume</p>
                    <div className="transfer-chips">
                      {atsAnalysis.matched.map((k) => (
                        <span key={k} className="signal-chip signal-chip-match">{k}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing keywords */}
                {atsAnalysis.missingKeywords.length > 0 && (
                  <div className="ats-group">
                    <p className="ats-group-label">⚠ Consider adding these terms</p>
                    <div className="transfer-chips">
                      {atsAnalysis.missingKeywords.map((k) => (
                        <span key={k} className="signal-chip signal-chip-gap">{k}</span>
                      ))}
                    </div>
                    <p className="muted-copy mt-2" style={{ fontSize: "0.73rem" }}>
                      These words appear frequently in the JD but not in your resume.
                    </p>
                  </div>
                )}

                {atsAnalysis.matched.length === 0 && (
                  <p className="muted-copy mt-2">No skill keyword matches yet — check that your skills section is populated.</p>
                )}
              </div>
            ) : (
              <div className="builder-inline-note">
                Paste a job description above to see your keyword match score, matched skills, and gaps.
              </div>
            )}
          </div>

        </section>

        {/* ── MAIN EDITOR ── */}
        <section className="builder-main">

          <div className="builder-card">
            <div className="section-head-row">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>Edit &amp; Preview</h2>
              </div>
              <div className="action-row">
                <ApplyButton onClick={applyChanges} />
                <button className="button-secondary" type="button" onClick={handleExport}>Export PDF</button>
              </div>
            </div>
            <div className="draft-state-banner mt-3">
              <strong>{preview.contact.fullName}</strong> — {preview.contact.targetTitle || "No role selected"}
            </div>

            {/* Experience-level & page recommendation */}
            {pageRec && (
              <div className="mt-4 rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand)]/5 p-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/25">
                    {pageRec.levelLabel}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    Content density: <strong className="text-[var(--foreground)]">{pageRec.contentScore}/100</strong>
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{pageRec.reason}</p>
                {pageRec.tips.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {pageRec.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-[var(--muted)] flex gap-2">
                        <span className="text-[var(--brand)] shrink-0">→</span> {tip}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Resume pages:</span>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${!twoPage ? "bg-[var(--brand)] text-[var(--background)]" : "bg-white/5 text-[var(--muted)] border border-white/10"}`}
                    onClick={() => setTwoPage(false)}
                  >
                    1 Page
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${twoPage ? "bg-[var(--brand)] text-[var(--background)]" : "bg-white/5 text-[var(--muted)] border border-white/10"}`}
                    onClick={() => setTwoPage(true)}
                  >
                    2 Pages
                  </button>
                  {pageRec.recommendedPages === 2 && !twoPage && (
                    <span className="text-xs text-[var(--brand)] font-medium">← Recommended for your level</span>
                  )}
                  {pageRec.recommendedPages === 1 && twoPage && (
                    <span className="text-xs text-[var(--brand)] font-medium">← 1 page recommended for your level</span>
                  )}
                </div>
              </div>
            )}
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
            {/* Summary writing coach */}
            <div className="summary-coach mt-2">
              <p className="summary-coach-label">✦ Strong summary formula</p>
              <p className="summary-coach-text">
                <strong>[Title/field] professional</strong> with <strong>[X] years</strong> of experience in <strong>[2–3 core areas]</strong>.
                Track record of <strong>[specific result type]</strong>. Combines <strong>[skill 1]</strong> with <strong>[skill 2]</strong> to deliver <strong>[outcome]</strong> in <strong>[environment type]</strong>.
              </p>
              <p className="summary-coach-tip">Keep it to 2–3 sentences. Role-specific, not generic. Lead with your strongest identity.</p>
            </div>
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
                      <textarea
                        className="builder-textarea compact"
                        value={bullet}
                        onChange={(e) => setExpBullet(ei, bi, e.target.value)}
                        placeholder={
                          bi === 0
                            ? "Start with an action verb + quantify: 'Reduced ticket resolution time by 30% by building…'"
                            : bi === 1
                            ? "Include scope: 'Managed 50+ endpoints / 200+ accounts / 100+ daily tickets…'"
                            : "Add business impact: 'Saving 10+ hours/month', 'improving X by Y%', 'supporting N users…'"
                        }
                      />
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
              <p className="muted-copy">Ready? Apply to update the preview below.</p>
              <div className="action-row">
                <ApplyButton onClick={applyChanges} />
                <button className="button-secondary" type="button" onClick={handleExport}>Export PDF</button>
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <ResumePreview data={preview} template={template} twoPage={twoPage} />

        </section>
      </div>
    </>
  );
}
