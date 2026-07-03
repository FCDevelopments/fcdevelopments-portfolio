import { ResumeData, ResumeTemplateId } from "@/src/lib/resume-data";

function formatList(items: string[]) {
  return items.filter(Boolean).join(" • ");
}

export function ResumePreview({
  data,
  template = "classic",
  twoPage = false,
}: {
  data: ResumeData;
  template?: ResumeTemplateId;
  twoPage?: boolean;
}) {
  const sheetClass = `resume-sheet resume-template-${template}${twoPage ? " resume-two-page" : ""}`;

  const hasContact = data.contact.email || data.contact.phone || data.contact.location;
  const hasLinks = data.contact.linkedin || data.contact.github || data.contact.website;
  const hasProjects = data.projects.filter(p => p.name.trim() && p.name !== "Project Name").length > 0;
  const hasCerts = data.certifications.filter(c => c.name.trim()).length > 0;
  const hasSkills = data.skills.languages.filter(Boolean).length > 0 ||
                    data.skills.tools.filter(Boolean).length > 0 ||
                    data.skills.strengths.filter(Boolean).length > 0;

  return (
    <div className={sheetClass}>
      {/* ── HEADER ── */}
      <header className="resume-header">
        <h1 className="resume-name">{data.contact.fullName || "Your Name"}</h1>
        {data.contact.targetTitle && (
          <p className="resume-tagline">{data.contact.targetTitle}</p>
        )}
        {(hasContact || hasLinks) && (
          <p className="resume-contact-line">
            {[data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github, data.contact.website].filter(Boolean).join(" | ")}
          </p>
        )}
      </header>

      {/* ── SUMMARY ── */}
      {data.summary &&
        /* Hide generic/empty placeholder summaries — check for common placeholder markers */
        !/^\s*$/.test(data.summary) &&
        !/results-driven \[your field\]/i.test(data.summary) &&
        !/write a short, role-focused summary/i.test(data.summary) &&
        (
        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p className="resume-summary-text">{data.summary}</p>
        </section>
      )}

      {/* ── SKILLS ── */}
      {hasSkills && (
        <section className="resume-section">
          <h2>Technical Skills</h2>
          <div className="resume-skills-block">
            {data.skills.languages.filter(Boolean).length > 0 && (
              <p><strong>Languages:</strong> {formatList(data.skills.languages)}</p>
            )}
            {data.skills.tools.filter(Boolean).length > 0 && (
              <p><strong>Platforms &amp; Tools:</strong> {formatList(data.skills.tools)}</p>
            )}
            {data.skills.strengths.filter(Boolean).length > 0 && (
              <p><strong>Core Strengths:</strong> {formatList(data.skills.strengths)}</p>
            )}
          </div>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {data.experience.filter(e => e.title.trim() || e.company.trim()).length > 0 && (
        <section className="resume-section">
          <h2>Professional Experience</h2>
          {data.experience.filter(e => e.title.trim() || e.company.trim()).map((entry) => {
            /* Build the heading line: "Title — Company, Location" */
            const titlePart = entry.title.trim();
            const companyPart = entry.company.trim();
            const locationPart = entry.location.trim();
            const companyLocation = [companyPart, locationPart].filter(Boolean).join(", ");

            return (
              <article key={entry.id} className="resume-entry">
                <div className="resume-entry-head">
                  <div>
                    <h3>
                      {titlePart && <span className="resume-job-title">{titlePart}</span>}
                      {titlePart && companyLocation && <span className="resume-entry-sep"> — </span>}
                      {companyLocation && <span className="resume-company-name">{companyLocation}</span>}
                      {!titlePart && companyPart && <span className="resume-company-name">{companyLocation}</span>}
                    </h3>
                  </div>
                  {(entry.startDate || entry.endDate) && (
                    <p className="resume-entry-dates">
                      {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                {entry.bullets.filter(b => b.trim()).length > 0 && (
                  <ul className="resume-bullets">
                    {entry.bullets.filter(b => b.trim()).map((bullet, index) => (
                      <li key={`${entry.id}-b${index}`}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </section>
      )}

      {/* ── PROJECTS ── */}
      {hasProjects && (
        <section className="resume-section">
          <h2>Projects</h2>
          {data.projects.filter(p => p.name.trim() && p.name !== "Project Name").map((entry) => (
            <article key={entry.id} className="resume-entry">
              <div className="resume-entry-head">
                <div>
                  <h3>{entry.name}{entry.stack ? <>{" | "}<span className="resume-stack">{entry.stack}</span></> : null}</h3>
                </div>
                {entry.link && <p className="resume-entry-dates">{entry.link}</p>}
              </div>
              {entry.bullets.filter(b => b.trim()).length > 0 && (
                <ul className="resume-bullets">
                  {entry.bullets.filter(b => b.trim()).map((bullet, index) => (
                    <li key={`${entry.id}-${index}`}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ── EDUCATION ── */}
      {data.education.filter(e => e.school.trim() || e.degree.trim()).length > 0 && (
        <section className="resume-section">
          <h2>Education</h2>
          {data.education.filter(e => e.school.trim() || e.degree.trim()).map((entry) => (
            <article key={entry.id} className="resume-entry">
              <div className="resume-entry-head">
                <div>
                  <h3>
                    {entry.school.trim() && <span>{entry.school.trim()}</span>}
                    {entry.school.trim() && entry.degree.trim() && <span className="resume-entry-sep"> — </span>}
                    {entry.degree.trim() && <span className="resume-company-name">{entry.degree.trim()}</span>}
                  </h3>
                </div>
                {(entry.startDate || entry.endDate) && (
                  <p className="resume-entry-dates">
                    {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
                  </p>
                )}
              </div>
              {entry.details.filter(d => d.trim()).length > 0 && (
                <ul className="resume-bullets">
                  {entry.details.filter(d => d.trim()).map((detail, index) => (
                    <li key={`${entry.id}-detail-${index}`}>{detail}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {hasCerts && (
        <section className="resume-section">
          <h2>Certifications</h2>
          <ul className="resume-bullets">
            {data.certifications.filter(c => c.name.trim()).map((entry) => (
              <li key={entry.id}>
                <strong>{entry.name}</strong>{entry.issuer ? ` — ${entry.issuer}` : ""}{entry.year ? ` (${entry.year})` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
