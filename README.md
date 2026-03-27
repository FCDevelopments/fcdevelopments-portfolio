# FCDevelopments Portfolio

Personal portfolio and resume builder for Fabian Castaneda (FCDevelopments).

**Live site:** _(coming soon — deploying to Vercel)_

---

## What this is

A privacy-first, ATS-optimized resume builder and developer portfolio built with Next.js + TypeScript + Tailwind CSS.

No accounts. No data storage. No tracking. Everything runs in your browser.

---

## Features

### Resume Builder
- Upload a PDF or TXT resume — the app extracts contact info, experience, projects, education, and skills automatically
- Smart role recommendations based on parsed resume content
- Transferable skills analyzer — enter any target role and see what skills carry over
- Job description tailoring — paste a JD and see keyword overlap
- Multiple ATS-friendly templates (Classic, Modern, Compact, Minimal)
- Export to PDF via browser print
- Save/restore resume state as JSON
- Privacy modes: session-only or download-before-leaving reminder

### Portfolio Pages
- Home — projects, skills, and intro
- Projects — public IT/automation tools and apps
- About — background and focus areas
- Resume Builder — the full builder tool
- Privacy policy

---

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF parsing:** pdf.js (CDN, client-side only)
- **Deployment:** Vercel

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying

This project is configured for Vercel. To deploy:

1. Push this repo to GitHub
2. Sign into [Vercel](https://vercel.com) and import the repository
3. Keep default Next.js build settings
4. Deploy

---

## Privacy model

- Resume data is never sent to a server
- PDF parsing runs entirely in the browser via pdf.js
- No analytics, no tracking scripts
- Users are advised to export their data before closing the tab

---

## Projects featured

| Project | Description | Link |
|---|---|---|
| SupportOps Copilot | Automated ticket categorization + manager reporting | [GitHub](https://github.com/FCDevelopments/supportops-copilot) |
| IT Onboarding Automation | Role-based lifecycle checklist generator | [GitHub](https://github.com/FCDevelopments/it-onboarding-checklist-automation) |
| Ticket Log Parser + SLA Report | SLA-risk visibility from raw ticket exports | [GitHub](https://github.com/FCDevelopments/ticket-log-parser-sla-report) |
| Zendesk CSV Cleanup | Clean messy exports + surface macro opportunities | [GitHub](https://github.com/FCDevelopments/zendesk-csv-cleanup-macro-helper) |
| REST API → CSV/JSON Template | Reusable starter for REST API data pipelines | [GitHub](https://github.com/FCDevelopments/rest-api-to-csv-json-template) |

---

## Status

Active development. Resume builder is functional. Vercel deployment pending.
