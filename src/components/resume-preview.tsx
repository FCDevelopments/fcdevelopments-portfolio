import { ResumeData, ResumeTemplateId } from "@/src/lib/resume-data";

function formatList(items: string[]) {
  return items.filter(Boolean).join(" • ");
}

export function ResumePreview({
  data,
  template = "classic",
}: {
  data: ResumeData;
  template?: ResumeTemplateId;
}) {
  return (
    <div className={`resume-sheet resume-template-${template}`}>
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{data.contact.fullName || "Your Name"}</h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">{data.contact.targetTitle}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {[data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(" | ")}
        </p>
        <p className="text-sm leading-6 text-slate-600">
          {[data.contact.linkedin, data.contact.github, data.contact.website].filter(Boolean).join(" | ")}
        </p>
      </header>

      <section className="resume-section">
        <h2>Professional Summary</h2>
        <p>{data.summary}</p>
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        {data.experience.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <div className="resume-entry-head">
              <div>
                <h3>{entry.title}</h3>
                <p className="resume-entry-subtitle">
                  {entry.company} | {entry.location}
                </p>
              </div>
              <p className="resume-entry-dates">
                {entry.startDate} - {entry.endDate}
              </p>
            </div>
            <ul>
              {entry.bullets.filter(Boolean).map((bullet, index) => (
                <li key={`${entry.id}-${index}`}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Projects</h2>
        {data.projects.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <div className="resume-entry-head">
              <div>
                <h3>{entry.name}</h3>
                <p className="resume-entry-subtitle">{entry.stack}</p>
              </div>
              {entry.link ? <p className="resume-entry-dates">{entry.link}</p> : null}
            </div>
            <ul>
              {entry.bullets.filter(Boolean).map((bullet, index) => (
                <li key={`${entry.id}-${index}`}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Education</h2>
        {data.education.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <div className="resume-entry-head">
              <div>
                <h3>{entry.school}</h3>
                <p className="resume-entry-subtitle">
                  {entry.degree} | {entry.location}
                </p>
              </div>
              <p className="resume-entry-dates">
                {entry.startDate} - {entry.endDate}
              </p>
            </div>
            {entry.details.filter(Boolean).length ? (
              <ul>
                {entry.details.filter(Boolean).map((detail, index) => (
                  <li key={`${entry.id}-detail-${index}`}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Technical Skills</h2>
        <p>
          <strong>Languages:</strong> {formatList(data.skills.languages)}
        </p>
        <p>
          <strong>Platforms & Tools:</strong> {formatList(data.skills.tools)}
        </p>
        <p>
          <strong>Strengths:</strong> {formatList(data.skills.strengths)}
        </p>
      </section>

      {data.certifications.length ? (
        <section className="resume-section">
          <h2>Certifications</h2>
          <ul>
            {data.certifications.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.name}</strong> — {entry.issuer} {entry.year ? `(${entry.year})` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
