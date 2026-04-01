export type ResumeSectionKey =
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "certifications";

export type ResumeTemplateId = "classic" | "compact" | "modern";

export type ContactInfo = {
  fullName: string;
  targetTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  location: string;
  title: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type ProjectEntry = {
  id: string;
  name: string;
  stack: string;
  link: string;
  bullets: string[];
};

export type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string[];
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type ResumeData = {
  contact: ContactInfo;
  summary: string;
  skills: {
    languages: string[];
    tools: string[];
    strengths: string[];
  };
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  sectionOrder: ResumeSectionKey[];
};

export const defaultResumeData: ResumeData = {
  contact: {
    fullName: "Your Name",
    targetTitle: "Target Role | Specialty | Focus Area",
    email: "name@example.com",
    phone: "(555) 123-4567",
    location: "City, State",
    linkedin: "linkedin.com/in/your-profile",
    github: "github.com/your-profile",
    website: "yourportfolio.com",
  },
  summary:
    "Results-driven [your field] professional with [X] years of experience in [core skill areas]. Track record of [specific achievement type — e.g. reducing ticket resolution time, improving onboarding workflows, building automation tools]. Combines hands-on [domain] expertise with [secondary strength] to deliver measurable outcomes in fast-paced environments.",
  skills: {
    languages: ["Python", "JavaScript", "SQL"],
    tools: ["Zendesk", "Okta", "Azure AD", "ServiceNow", "Google Workspace"],
    strengths: ["Troubleshooting", "Workflow Automation", "Documentation", "Process Improvement"],
  },
  experience: [
    {
      id: "exp-1",
      company: "Company Name",
      location: "City, State",
      title: "Job Title",
      startDate: "Jan 2024",
      endDate: "Present",
      bullets: [
        "Built or improved [system/workflow/tool], reducing [pain point] by [X%] and saving [team/dept] [N] hours per [week/month].",
        "Managed [scope — e.g. 50+ endpoints, 200+ accounts, 100+ tickets/day] with [outcome — e.g. 99% uptime, 0 security incidents, 30% faster resolution].",
        "Led or contributed to [initiative/project] that [measurable business outcome].",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Project Name",
      stack: "Tools / Stack Used",
      link: "",
      bullets: [
        "Built [what it is] to solve [specific problem] for [target user/team/business].",
        "Implemented [key technical detail or approach] that enabled [specific capability or outcome].",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "School Name",
      degree: "Degree or Credential",
      location: "City, State",
      startDate: "",
      endDate: "",
      details: [
        "Relevant coursework, honors, certifications, or concentration area.",
      ],
    },
  ],
  certifications: [],
  sectionOrder: ["summary", "experience", "projects", "education", "skills", "certifications"],
};

/* ─────────── Static preset fallbacks (shown when no resume is loaded) ─────────── */

export const rolePresetOptions = [
  {
    id: "it-support",
    label: "IT Support",
    summaryHint: "Prioritize troubleshooting, ticket volume, support platforms, and user training.",
  },
  {
    id: "it-admin",
    label: "IT Admin / Systems Support",
    summaryHint: "Emphasize device administration, SaaS workflows, operational tooling, and automation.",
  },
  {
    id: "iam",
    label: "IAM / Identity Support",
    summaryHint: "Lead with Okta, Azure AD, provisioning, lifecycle management, and security-conscious operations.",
  },
];

/* ─────────── Smart role recommendation engine ─────────── */

export type RoleRecommendation = {
  id: string;
  label: string;
  tagline: string;           // pipe-separated title line for the resume header
  confidence: number;        // 0–100
  summaryHint: string;
  matchedSignals: string[];  // what we matched on (shown as chips)
};

type RoleRule = {
  id: string;
  label: string;
  tagline: string;
  summaryHint: string;
  /** Each signal is [keyword, weight]. All keywords are lowercase. */
  signals: [string, number][];
  /** Minimum total weight to surface this recommendation. */
  threshold: number;
};

const ROLE_RULES: RoleRule[] = [
  /* ═══════════════════════════════════════════════════════════════
     IT & TECHNOLOGY
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "it-support", label: "IT Support Specialist",
    tagline: "IT Support | Technical Support | Help Desk",
    summaryHint: "Prioritize troubleshooting, ticket volume, support platforms, and user training.",
    signals: [["help desk",15],["it support",15],["technical support",12],["l1",8],["l2",10],["l3",10],["ticket",10],["zendesk",8],["servicenow",8],["troubleshoot",10],["hardware",6],["printer",5],["onboarding",6],["offboarding",6],["user training",8],["support engineer",12],["desktop support",12],["device provisioning",8],["mdm",6]], threshold: 30,
  },
  {
    id: "it-admin", label: "Junior IT Administrator",
    tagline: "IT Administrator | Systems Administrator | IT Operations",
    summaryHint: "Emphasize device management, SaaS administration, MDM, operational tooling, and automation.",
    signals: [["it administrator",18],["sysadmin",15],["systems administrator",15],["mdm",10],["mam",10],["active directory",10],["azure ad",10],["group policy",8],["dns",6],["dhcp",6],["device wip",8],["unifi",8],["nvr",6],["surveillance",5],["admin",8],["it operations",10],["infrastructure",8]], threshold: 30,
  },
  {
    id: "iam", label: "IAM Analyst",
    tagline: "IAM Analyst | Identity & Access Management | Security Operations",
    summaryHint: "Lead with Okta, Azure AD, provisioning, lifecycle management, and security-conscious operations.",
    signals: [["okta",15],["azure ad",12],["identity",10],["iam",18],["provisioning",10],["sso",10],["mfa",10],["rbac",10],["access management",12],["lifecycle",8],["compliance",6],["security",6],["saml",8],["scim",8],["zero trust",10]], threshold: 25,
  },
  {
    id: "desktop-support", label: "Desktop Support Technician",
    tagline: "Desktop Support | End-User Support | Field Technician",
    summaryHint: "Focus on hardware repair, imaging, in-person support, and end-user troubleshooting.",
    signals: [["desktop support",15],["hardware",10],["imaging",10],["mdt",8],["sccm",10],["windows 10",6],["windows 11",6],["printer",8],["repair",8],["deploy",6],["field",8],["onsite",10],["technician",10],["end-user",8]], threshold: 25,
  },
  {
    id: "frontend-dev", label: "Frontend Developer",
    tagline: "Frontend Developer | UI Engineer | Web Developer",
    summaryHint: "Highlight JavaScript/TypeScript, React or similar frameworks, responsive design, and UI/UX sensibility.",
    signals: [["react",15],["vue",12],["angular",12],["next.js",12],["nextjs",12],["frontend",15],["html",6],["css",6],["tailwind",10],["typescript",10],["javascript",8],["responsive",8],["ui",6],["ux",6],["component",8],["figma",6],["web developer",12]], threshold: 30,
  },
  {
    id: "fullstack-dev", label: "Full-Stack Developer",
    tagline: "Full-Stack Developer | Software Engineer | Web Application Developer",
    summaryHint: "Show breadth across frontend frameworks, backend APIs, databases, and deployment pipelines.",
    signals: [["full stack",18],["fullstack",18],["react",8],["node",10],["express",8],["api",8],["rest",6],["graphql",8],["postgresql",8],["mongodb",8],["database",6],["docker",8],["aws",6],["deploy",6],["python",6],["javascript",6],["typescript",8],["backend",10],["server",5]], threshold: 30,
  },
  {
    id: "backend-dev", label: "Backend Developer",
    tagline: "Backend Developer | Software Engineer | API Developer",
    summaryHint: "Emphasize server-side languages, API design, database optimization, and cloud infrastructure.",
    signals: [["backend",15],["api",10],["rest",8],["graphql",10],["microservice",12],["python",8],["java",8],["node",8],["postgresql",10],["mysql",8],["redis",8],["docker",8],["kubernetes",10],["aws",8],["gcp",8],["cloud",6],["sql",6]], threshold: 30,
  },
  {
    id: "software-engineer", label: "Software Engineer",
    tagline: "Software Engineer | Developer | Application Engineer",
    summaryHint: "Balance coding proficiency, system design thinking, and collaborative development practices.",
    signals: [["software engineer",18],["developer",10],["git",6],["python",8],["java",8],["c++",8],["algorithm",8],["data structure",8],["testing",6],["ci/cd",8],["agile",6],["scrum",6],["code review",8],["architecture",6]], threshold: 25,
  },
  {
    id: "data-analyst", label: "Data Analyst",
    tagline: "Data Analyst | Business Analyst | Analytics Engineer",
    summaryHint: "Lead with SQL, data visualization, reporting tools, and translating data into business insights.",
    signals: [["data analyst",18],["analytics",12],["sql",10],["tableau",12],["power bi",12],["excel",6],["python",6],["pandas",10],["reporting",8],["dashboard",10],["visualization",8],["etl",8],["business intelligence",10]], threshold: 25,
  },
  {
    id: "devops", label: "DevOps Engineer",
    tagline: "DevOps Engineer | Site Reliability Engineer | Platform Engineer",
    summaryHint: "Highlight CI/CD, infrastructure-as-code, containerization, monitoring, and cloud platform expertise.",
    signals: [["devops",18],["ci/cd",12],["docker",10],["kubernetes",12],["terraform",12],["ansible",10],["jenkins",8],["github actions",8],["aws",8],["gcp",8],["azure",8],["monitoring",8],["prometheus",8],["grafana",8],["linux",6],["sre",15],["reliability",8],["infrastructure",8]], threshold: 30,
  },
  {
    id: "network-admin", label: "Network Administrator",
    tagline: "Network Administrator | Network Engineer | Infrastructure Specialist",
    summaryHint: "Focus on switches, routers, firewalls, VLANs, VPN, and network monitoring tools.",
    signals: [["network",12],["cisco",12],["switch",8],["router",10],["firewall",10],["vlan",10],["vpn",8],["tcp/ip",8],["dns",8],["dhcp",8],["unifi",6],["wireshark",8],["pfsense",8],["meraki",8],["ccna",12]], threshold: 25,
  },
  {
    id: "security-analyst", label: "Security Analyst",
    tagline: "Security Analyst | Cybersecurity Analyst | SOC Analyst",
    summaryHint: "Lead with SIEM, incident response, vulnerability management, compliance, and security frameworks.",
    signals: [["cybersecurity",15],["security analyst",18],["siem",12],["soc",12],["incident response",10],["vulnerability",10],["penetration",10],["encryption",8],["e2ee",8],["tokenization",8],["compliance",8],["nist",10],["iso 27001",10],["firewall",6],["ids",8],["ips",8]], threshold: 25,
  },
  {
    id: "project-coordinator", label: "Project Coordinator",
    tagline: "Project Coordinator | Project Manager | Operations Coordinator",
    summaryHint: "Highlight cross-team coordination, documentation, workflow improvement, and stakeholder communication.",
    signals: [["project manager",15],["project coordinator",15],["scrum",8],["agile",8],["jira",10],["confluence",8],["documentation",8],["stakeholder",8],["workflow",8],["process improvement",10],["coordination",8],["timeline",6]], threshold: 25,
  },
  {
    id: "qa-engineer", label: "QA Engineer",
    tagline: "QA Engineer | Test Engineer | Quality Assurance Analyst",
    summaryHint: "Focus on test planning, automation frameworks, regression testing, and defect management.",
    signals: [["qa",15],["quality assurance",15],["testing",10],["selenium",12],["cypress",12],["jest",8],["test automation",12],["regression",8],["bug",6],["defect",6],["test case",10],["manual testing",8]], threshold: 25,
  },
  {
    id: "ml-engineer", label: "ML / AI Engineer",
    tagline: "Machine Learning Engineer | AI Engineer | Data Scientist",
    summaryHint: "Highlight model training, ML frameworks, data pipelines, and real-world AI application deployment.",
    signals: [["machine learning",15],["deep learning",12],["tensorflow",12],["pytorch",12],["ai",8],["ml",10],["neural network",10],["nlp",10],["computer vision",10],["scikit",8],["model",6],["training",5],["inference",8],["openai",8],["langchain",10],["llm",10]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     HEALTHCARE & MEDICAL
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "registered-nurse", label: "Registered Nurse (RN)",
    tagline: "Registered Nurse | RN | Clinical Nurse",
    summaryHint: "Lead with patient care experience, clinical skills, certifications (BLS, ACLS), and EMR proficiency.",
    signals: [["registered nurse",18],["rn",12],["nursing",15],["patient care",12],["clinical",10],["bls",8],["acls",8],["icu",10],["er",8],["emergency room",10],["medication administration",10],["vital signs",8],["charting",6],["epic",8],["cerner",8],["hipaa",6],["triage",10],["bedside",8],["discharge",6]], threshold: 25,
  },
  {
    id: "licensed-nurse", label: "Licensed Vocational Nurse (LVN)",
    tagline: "Licensed Vocational Nurse | LVN | LPN | Patient Care",
    summaryHint: "Highlight direct patient care, medication administration, wound care, and team collaboration under RN supervision.",
    signals: [["lvn",15],["lpn",15],["licensed vocational",15],["licensed practical",15],["wound care",10],["medication",8],["patient",8],["vital signs",8],["nursing home",8],["long-term care",8],["assisted living",8],["catheter",6],["iv",6]], threshold: 25,
  },
  {
    id: "cna", label: "Certified Nursing Assistant (CNA)",
    tagline: "Certified Nursing Assistant | CNA | Patient Care Technician",
    summaryHint: "Focus on daily patient care, ADL assistance, vitals monitoring, and compassionate bedside manner.",
    signals: [["cna",15],["nursing assistant",15],["patient care technician",12],["adl",10],["activities of daily living",10],["bathing",6],["feeding",6],["vital signs",8],["bedside",8],["long-term care",8],["assisted living",8],["hospice",8]], threshold: 20,
  },
  {
    id: "medical-assistant", label: "Medical Assistant",
    tagline: "Medical Assistant | Clinical Assistant | Healthcare Support",
    summaryHint: "Highlight clinical skills (phlebotomy, vitals, injections), EHR proficiency, and front-office coordination.",
    signals: [["medical assistant",18],["phlebotomy",12],["vitals",8],["injections",8],["ehr",10],["emr",8],["front office",8],["scheduling",6],["intake",8],["insurance verification",8],["referrals",6],["specimen",6],["autoclave",6]], threshold: 25,
  },
  {
    id: "pharmacy-tech", label: "Pharmacy Technician",
    tagline: "Pharmacy Technician | Pharmacy Associate | Dispensing Technician",
    summaryHint: "Focus on prescription processing, medication dispensing, inventory management, and pharmacy software.",
    signals: [["pharmacy technician",18],["pharmacy tech",15],["prescription",12],["dispensing",10],["medication",8],["compounding",10],["inventory",6],["insurance claims",8],["rxconnect",6],["controlled substance",8],["pharmacist",6],["pill count",6]], threshold: 25,
  },
  {
    id: "dental-hygienist", label: "Dental Hygienist",
    tagline: "Dental Hygienist | RDH | Oral Health Professional",
    summaryHint: "Emphasize prophylaxis, periodontal assessments, patient education, and radiograph proficiency.",
    signals: [["dental hygienist",18],["rdh",15],["prophylaxis",12],["periodontal",10],["scaling",8],["root planing",8],["x-ray",6],["radiograph",8],["fluoride",6],["sealant",6],["patient education",8],["dental",10],["oral health",8]], threshold: 25,
  },
  {
    id: "dental-assistant", label: "Dental Assistant",
    tagline: "Dental Assistant | Dental Office Assistant | Chair-Side Assistant",
    summaryHint: "Highlight chair-side assisting, sterilization protocols, dental software, x-ray certification, and patient communication.",
    signals: [["dental assistant",18],["dental",12],["chair-side",10],["sterilization",10],["autoclave",8],["x-ray",8],["radiograph",6],["impression",8],["dental records",8],["four-handed",8],["suction",6],["dental office",10],["patient",6],["scheduling",5],["front office",5],["dentrix",8],["eaglesoft",8]], threshold: 25,
  },
  {
    id: "physical-therapist", label: "Physical Therapist / PTA",
    tagline: "Physical Therapist | PTA | Rehabilitation Specialist",
    summaryHint: "Highlight treatment plans, therapeutic exercise programs, patient outcomes, and clinical documentation.",
    signals: [["physical therapy",15],["physical therapist",18],["pta",12],["rehabilitation",12],["therapeutic exercise",10],["range of motion",8],["gait training",8],["manual therapy",8],["orthopedic",8],["outpatient",6],["inpatient",6],["treatment plan",8]], threshold: 25,
  },
  {
    id: "medical-coder", label: "Medical Coder / Biller",
    tagline: "Medical Coder | Medical Biller | Health Information Specialist",
    summaryHint: "Lead with ICD-10, CPT coding accuracy, claims processing, denial management, and compliance.",
    signals: [["medical coder",18],["medical billing",15],["icd-10",12],["cpt",12],["hcpcs",8],["claims",10],["denial management",8],["revenue cycle",10],["coding",8],["ehr",6],["insurance",6],["reimbursement",8],["cpc",10],["aapc",8]], threshold: 25,
  },
  {
    id: "emt-paramedic", label: "EMT / Paramedic",
    tagline: "EMT | Paramedic | Emergency Medical Technician",
    summaryHint: "Emphasize emergency response, patient stabilization, ambulance operations, and certifications.",
    signals: [["emt",15],["paramedic",15],["emergency medical",12],["ambulance",10],["patient stabilization",8],["cpr",8],["aed",6],["trauma",10],["911",6],["first responder",10],["intubation",8],["iv access",8],["nremt",10]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     FINANCE, ACCOUNTING & INSURANCE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "accountant", label: "Accountant",
    tagline: "Accountant | Staff Accountant | Financial Analyst",
    summaryHint: "Highlight GAAP knowledge, reconciliations, financial reporting, and accounting software proficiency.",
    signals: [["accountant",18],["accounting",15],["gaap",12],["reconciliation",10],["general ledger",10],["journal entries",10],["accounts payable",8],["accounts receivable",8],["quickbooks",8],["sage",6],["month-end close",10],["financial statements",10],["cpa",12],["audit",8]], threshold: 25,
  },
  {
    id: "bookkeeper", label: "Bookkeeper",
    tagline: "Bookkeeper | Accounting Clerk | Accounts Specialist",
    summaryHint: "Focus on AP/AR processing, bank reconciliation, payroll support, and accurate record-keeping.",
    signals: [["bookkeeper",18],["bookkeeping",15],["accounts payable",10],["accounts receivable",10],["bank reconciliation",10],["quickbooks",10],["payroll",8],["invoicing",8],["data entry",6],["vendor payments",8],["general ledger",6]], threshold: 25,
  },
  {
    id: "financial-analyst", label: "Financial Analyst",
    tagline: "Financial Analyst | FP&A Analyst | Business Finance Analyst",
    summaryHint: "Lead with financial modeling, forecasting, variance analysis, and executive reporting.",
    signals: [["financial analyst",18],["fp&a",15],["financial modeling",12],["forecasting",10],["budgeting",10],["variance analysis",10],["excel",6],["pivot table",6],["dcf",8],["roi",6],["p&l",8],["revenue",6],["ebitda",8],["bloomberg",8]], threshold: 25,
  },
  {
    id: "bank-teller", label: "Bank Teller",
    tagline: "Bank Teller | Financial Services Representative | Banking Associate",
    summaryHint: "Emphasize cash handling accuracy, customer service, regulatory compliance, and cross-selling.",
    signals: [["bank teller",18],["teller",12],["cash handling",12],["deposits",8],["withdrawals",8],["vault",6],["bank",8],["financial services",8],["cross-sell",8],["customer service",6],["currency",6],["balancing",8]], threshold: 25,
  },
  {
    id: "insurance-agent", label: "Insurance Agent",
    tagline: "Insurance Agent | Licensed Insurance Producer | Insurance Advisor",
    summaryHint: "Highlight policy sales, client retention, claims knowledge, and insurance product expertise.",
    signals: [["insurance agent",18],["insurance",12],["policy",10],["premium",8],["underwriting",10],["claims",8],["coverage",8],["deductible",6],["liability",6],["licensed",6],["renewal",8],["quote",6],["auto insurance",8],["life insurance",8],["health insurance",8]], threshold: 25,
  },
  {
    id: "loan-officer", label: "Loan Officer",
    tagline: "Loan Officer | Mortgage Loan Originator | Lending Specialist",
    summaryHint: "Focus on loan origination, underwriting guidelines, client qualification, and closing rates.",
    signals: [["loan officer",18],["mortgage",12],["loan originator",12],["underwriting",10],["pre-approval",8],["closing",8],["fha",8],["va loan",8],["conventional",6],["refinance",8],["lending",10],["credit analysis",8],["nmls",10]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     SALES & MARKETING
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "sales-rep", label: "Sales Representative",
    tagline: "Sales Representative | Account Executive | Business Development",
    summaryHint: "Lead with revenue numbers, quota attainment, pipeline management, and closing skills.",
    signals: [["sales representative",15],["account executive",15],["business development",12],["quota",12],["revenue",10],["pipeline",10],["cold call",8],["prospecting",10],["crm",8],["salesforce",10],["hubspot",8],["close rate",8],["b2b",6],["b2c",6],["territory",8]], threshold: 25,
  },
  {
    id: "retail-sales", label: "Retail Sales Associate",
    tagline: "Retail Sales Associate | Store Associate | Customer Service Representative",
    summaryHint: "Highlight sales targets, customer engagement, product knowledge, and visual merchandising.",
    signals: [["retail",12],["sales associate",15],["store",8],["pos",8],["point of sale",8],["cash register",8],["merchandising",10],["upsell",8],["inventory",6],["loss prevention",6],["customer service",8],["fitting room",5],["stock",6],["floor",5]], threshold: 25,
  },
  {
    id: "marketing-coordinator", label: "Marketing Coordinator",
    tagline: "Marketing Coordinator | Marketing Specialist | Digital Marketing",
    summaryHint: "Emphasize campaign management, content creation, social media, analytics, and brand consistency.",
    signals: [["marketing coordinator",15],["marketing specialist",15],["digital marketing",12],["social media",10],["content creation",10],["campaign",10],["google analytics",8],["seo",10],["email marketing",8],["mailchimp",6],["canva",6],["brand",6],["copywriting",8],["ppc",8],["ads",6]], threshold: 25,
  },
  {
    id: "social-media-manager", label: "Social Media Manager",
    tagline: "Social Media Manager | Content Strategist | Community Manager",
    summaryHint: "Highlight platform growth, engagement metrics, content calendars, and influencer partnerships.",
    signals: [["social media manager",18],["social media",12],["instagram",8],["tiktok",8],["facebook",6],["linkedin",6],["content calendar",10],["engagement",10],["followers",8],["influencer",8],["community management",10],["hashtag",5],["reels",6],["analytics",6]], threshold: 25,
  },
  {
    id: "real-estate-agent", label: "Real Estate Agent",
    tagline: "Real Estate Agent | Realtor | Real Estate Specialist",
    summaryHint: "Lead with transaction volume, listings closed, client relationships, and market expertise.",
    signals: [["real estate",15],["realtor",15],["listing",10],["buyer",6],["seller",6],["closing",8],["mls",10],["open house",8],["escrow",8],["property",8],["commission",6],["home sale",8],["zillow",6],["showing",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     SKILLED TRADES & MAINTENANCE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "electrician", label: "Electrician",
    tagline: "Electrician | Electrical Technician | Journeyman Electrician",
    summaryHint: "Highlight wiring, NEC code compliance, panel installation, troubleshooting, and safety certifications.",
    signals: [["electrician",18],["electrical",12],["wiring",10],["nec",10],["conduit",8],["circuit breaker",8],["panel",8],["voltage",8],["220v",6],["110v",6],["journeyman",10],["apprentice",6],["osha",6],["blueprint",6],["transformer",8]], threshold: 25,
  },
  {
    id: "plumber", label: "Plumber",
    tagline: "Plumber | Plumbing Technician | Pipe Fitter",
    summaryHint: "Focus on pipe installation, fixture repair, code compliance, water heater experience, and customer service.",
    signals: [["plumber",18],["plumbing",15],["pipe",10],["fixture",8],["drain",8],["sewer",8],["water heater",8],["soldering",6],["pvc",6],["copper",6],["leak",6],["backflow",8],["rough-in",8],["code compliance",8],["journeyman",8]], threshold: 25,
  },
  {
    id: "hvac-tech", label: "HVAC Technician",
    tagline: "HVAC Technician | HVAC Installer | Heating & Cooling Specialist",
    summaryHint: "Lead with system installation, refrigerant handling, PM routines, and EPA certification.",
    signals: [["hvac",18],["heating",10],["cooling",10],["air conditioning",10],["refrigerant",10],["compressor",8],["ductwork",8],["thermostat",6],["epa 608",10],["furnace",8],["heat pump",8],["preventive maintenance",8],["r-410a",6]], threshold: 25,
  },
  {
    id: "carpenter", label: "Carpenter",
    tagline: "Carpenter | Finish Carpenter | Framing Carpenter",
    summaryHint: "Highlight framing, finish work, blueprint reading, material estimation, and jobsite safety.",
    signals: [["carpenter",18],["carpentry",15],["framing",10],["finish work",10],["trim",8],["cabinet",8],["drywall",6],["blueprint",8],["lumber",6],["woodworking",8],["nail gun",5],["saw",5],["molding",6],["renovation",8]], threshold: 25,
  },
  {
    id: "welder", label: "Welder",
    tagline: "Welder | Fabricator | Welding Technician",
    summaryHint: "Focus on welding certifications (MIG, TIG, stick), blueprint reading, and fabrication experience.",
    signals: [["welder",18],["welding",15],["mig",10],["tig",10],["stick welding",8],["fabrication",10],["blueprint",6],["torch",6],["grinding",5],["steel",6],["aluminum",6],["aws",8],["structural",6],["pipe welding",8]], threshold: 25,
  },
  {
    id: "handyman", label: "Maintenance Technician / Handyman",
    tagline: "Maintenance Technician | Handyman | Facilities Maintenance",
    summaryHint: "Emphasize broad repair skills, preventive maintenance, work order management, and tenant/client satisfaction.",
    signals: [["handyman",15],["maintenance technician",15],["facilities maintenance",12],["work order",10],["preventive maintenance",10],["repair",8],["plumbing",6],["electrical",6],["drywall",6],["painting",6],["appliance",6],["tenant",6],["property management",8],["hvac",5]], threshold: 25,
  },
  {
    id: "mechanic", label: "Automotive Mechanic / Technician",
    tagline: "Automotive Technician | Mechanic | Service Technician",
    summaryHint: "Highlight ASE certifications, diagnostic skills, brake/engine/transmission work, and customer trust.",
    signals: [["mechanic",15],["automotive technician",15],["ase",12],["brake",8],["engine",8],["transmission",8],["diagnostic",10],["oil change",5],["alignment",6],["tire",6],["obd",8],["scan tool",6],["suspension",6],["exhaust",5],["hybrid",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     TRANSPORTATION & LOGISTICS
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "truck-driver", label: "Truck Driver",
    tagline: "CDL Driver | Truck Driver | OTR Driver",
    summaryHint: "Lead with CDL class, miles driven safely, on-time delivery rate, and DOT compliance.",
    signals: [["cdl",15],["truck driver",18],["otr",12],["class a",10],["class b",8],["tractor trailer",8],["dot",10],["logbook",8],["eld",8],["hazmat",8],["tanker",6],["flatbed",6],["miles",6],["delivery driver",8],["freight",8],["long haul",8]], threshold: 25,
  },
  {
    id: "delivery-driver", label: "Delivery Driver",
    tagline: "Delivery Driver | Route Driver | Courier",
    summaryHint: "Highlight delivery volume, on-time rates, route optimization, and customer interaction.",
    signals: [["delivery driver",18],["courier",12],["route",10],["last mile",10],["packages",8],["on-time delivery",10],["amazon",6],["fedex",6],["ups",6],["doordash",6],["instacart",6],["gps",5],["clean driving record",8],["customer service",6]], threshold: 25,
  },
  {
    id: "warehouse", label: "Warehouse Associate",
    tagline: "Warehouse Associate | Fulfillment Specialist | Shipping & Receiving",
    summaryHint: "Focus on order accuracy, forklift certification, inventory systems, and throughput efficiency.",
    signals: [["warehouse",15],["forklift",12],["shipping",8],["receiving",8],["inventory",10],["pick and pack",10],["pallet",6],["rf scanner",8],["wms",10],["fulfillment",10],["loading dock",6],["order accuracy",8],["osha",6]], threshold: 25,
  },
  {
    id: "logistics-coordinator", label: "Logistics Coordinator",
    tagline: "Logistics Coordinator | Supply Chain Coordinator | Dispatch Coordinator",
    summaryHint: "Emphasize shipment tracking, carrier coordination, freight cost optimization, and ERP experience.",
    signals: [["logistics",15],["supply chain",12],["dispatch",10],["freight",10],["carrier",8],["shipment",10],["tracking",6],["erp",8],["sap",8],["procurement",8],["customs",6],["import",6],["export",6],["3pl",8]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     EDUCATION & CHILDCARE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "teacher", label: "Teacher",
    tagline: "Teacher | Educator | Classroom Instructor",
    summaryHint: "Highlight grade level, subject expertise, differentiated instruction, test score improvements, and classroom management.",
    signals: [["teacher",15],["educator",12],["classroom",10],["lesson plan",12],["curriculum",10],["differentiated instruction",10],["iep",8],["assessment",8],["state standards",8],["common core",6],["student",8],["grading",6],["parent conference",6],["credential",8],["k-12",8]], threshold: 25,
  },
  {
    id: "substitute-teacher", label: "Substitute Teacher",
    tagline: "Substitute Teacher | Guest Teacher | Instructional Support",
    summaryHint: "Focus on classroom adaptability, lesson plan execution, behavior management, and reliability across schools.",
    signals: [["substitute teacher",18],["substitute",12],["guest teacher",10],["classroom management",10],["lesson plan",8],["k-12",6],["attendance",6],["school district",8],["behavior management",8]], threshold: 20,
  },
  {
    id: "tutor", label: "Tutor / Academic Coach",
    tagline: "Tutor | Academic Coach | Learning Specialist",
    summaryHint: "Emphasize subject expertise, student progress tracking, test prep results, and adaptive teaching methods.",
    signals: [["tutor",15],["tutoring",12],["academic coach",10],["test prep",10],["sat",6],["act",6],["gre",6],["student progress",8],["one-on-one",6],["small group",6],["math tutor",8],["reading",6],["homework help",6]], threshold: 20,
  },
  {
    id: "childcare", label: "Childcare Provider",
    tagline: "Childcare Provider | Preschool Teacher | Daycare Teacher",
    summaryHint: "Highlight age-appropriate activities, safety protocols, developmental milestones, and parent communication.",
    signals: [["childcare",15],["preschool",12],["daycare",12],["early childhood",12],["toddler",8],["infant",8],["diaper",5],["nap",5],["developmental milestone",8],["circle time",6],["playground",5],["parent communication",8],["child development",10]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     FOOD SERVICE & HOSPITALITY
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "restaurant-server", label: "Server / Waitstaff",
    tagline: "Server | Waitstaff | Food Service Professional",
    summaryHint: "Highlight table management, upselling, guest satisfaction scores, and fast-paced multitasking.",
    signals: [["server",12],["waitress",10],["waiter",10],["waitstaff",12],["table",6],["menu",6],["upsell",8],["food service",10],["restaurant",10],["tip",5],["pos system",8],["guest satisfaction",8],["dining",6],["fine dining",8]], threshold: 25,
  },
  {
    id: "cook-chef", label: "Cook / Line Cook / Chef",
    tagline: "Line Cook | Cook | Prep Cook | Culinary Professional",
    summaryHint: "Focus on station management, menu execution, food safety certifications, and kitchen efficiency.",
    signals: [["cook",12],["line cook",15],["chef",12],["prep cook",10],["kitchen",10],["food prep",8],["grill",6],["saute",6],["servsafe",10],["food safety",8],["recipe",6],["plating",6],["sous chef",10],["culinary",8]], threshold: 25,
  },
  {
    id: "bartender", label: "Bartender",
    tagline: "Bartender | Mixologist | Bar Manager",
    summaryHint: "Highlight cocktail knowledge, speed of service, inventory management, and responsible alcohol service.",
    signals: [["bartender",18],["mixologist",12],["cocktail",10],["bar",8],["liquor",6],["beer",5],["wine",5],["tips",5],["pour",6],["happy hour",5],["inventory",6],["responsible service",8],["tips certification",8]], threshold: 20,
  },
  {
    id: "hotel-front-desk", label: "Hotel Front Desk Agent",
    tagline: "Front Desk Agent | Guest Services | Hotel Receptionist",
    summaryHint: "Emphasize check-in/out efficiency, reservation management, guest complaint resolution, and PMS software.",
    signals: [["front desk",12],["hotel",12],["guest services",10],["check-in",8],["reservation",10],["opera",8],["pms",8],["concierge",8],["hospitality",10],["housekeeping",6],["room service",6],["guest complaint",8]], threshold: 25,
  },
  {
    id: "barista", label: "Barista",
    tagline: "Barista | Cafe Associate | Coffee Specialist",
    summaryHint: "Focus on drink preparation speed, customer service, latte art, and maintaining health standards.",
    signals: [["barista",18],["coffee",10],["espresso",10],["latte",8],["starbucks",6],["cafe",8],["brew",6],["grind",5],["milk foam",5],["drive-thru",6],["food safety",6],["customer service",6]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     ADMINISTRATIVE & OFFICE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "admin-assistant", label: "Administrative Assistant",
    tagline: "Administrative Assistant | Executive Assistant | Office Coordinator",
    summaryHint: "Highlight calendar management, correspondence, filing systems, and executive support.",
    signals: [["administrative assistant",18],["executive assistant",15],["office coordinator",12],["calendar management",10],["scheduling",8],["correspondence",8],["filing",6],["travel arrangements",8],["meeting minutes",8],["microsoft office",8],["outlook",6],["reception",6],["typing",5]], threshold: 25,
  },
  {
    id: "receptionist", label: "Receptionist",
    tagline: "Receptionist | Front Desk Coordinator | Office Receptionist",
    summaryHint: "Focus on greeting visitors, multi-line phone management, scheduling, and professional first impressions.",
    signals: [["receptionist",18],["front desk",10],["phone",6],["multi-line",8],["greeting",6],["visitor",6],["lobby",5],["switchboard",6],["scheduling",6],["sign-in",5],["office",6]], threshold: 20,
  },
  {
    id: "hr-coordinator", label: "HR Coordinator",
    tagline: "HR Coordinator | Human Resources Generalist | People Operations",
    summaryHint: "Highlight onboarding, benefits administration, employee relations, HRIS systems, and compliance.",
    signals: [["human resources",15],["hr coordinator",15],["hr generalist",12],["onboarding",8],["benefits administration",10],["employee relations",10],["hris",10],["workday",8],["adp",8],["payroll",8],["recruiting",8],["offer letter",6],["compliance",6],["termination",6]], threshold: 25,
  },
  {
    id: "recruiter", label: "Recruiter",
    tagline: "Recruiter | Talent Acquisition Specialist | Staffing Coordinator",
    summaryHint: "Lead with placements made, time-to-fill metrics, sourcing strategies, and ATS proficiency.",
    signals: [["recruiter",18],["talent acquisition",15],["staffing",10],["sourcing",10],["ats",8],["greenhouse",8],["lever",8],["interview",8],["candidate",8],["job posting",6],["linkedin recruiter",8],["offer",6],["placement",10],["headhunt",6]], threshold: 25,
  },
  {
    id: "office-manager", label: "Office Manager",
    tagline: "Office Manager | Operations Manager | Business Office Manager",
    summaryHint: "Emphasize vendor management, budget tracking, facilities coordination, and team leadership.",
    signals: [["office manager",18],["office management",12],["vendor management",10],["supply ordering",8],["budget",8],["facilities",8],["team lead",6],["onboarding",6],["scheduling",6],["process improvement",8],["operations",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     CUSTOMER SERVICE & CALL CENTER
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "customer-service-rep", label: "Customer Service Representative",
    tagline: "Customer Service Representative | Client Support | Contact Center Agent",
    summaryHint: "Highlight call volume, CSAT scores, first-call resolution, and empathetic communication.",
    signals: [["customer service representative",15],["customer service",12],["call center",12],["contact center",10],["inbound",8],["outbound",6],["csat",10],["first call resolution",10],["aht",8],["hold time",6],["escalation",6],["crm",6],["phone support",8],["chat support",8]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     CONSTRUCTION & LABOR
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "construction-worker", label: "Construction Worker",
    tagline: "Construction Worker | Laborer | Construction Helper",
    summaryHint: "Focus on physical capability, OSHA certifications, equipment operation, and jobsite safety.",
    signals: [["construction",15],["laborer",12],["concrete",8],["demolition",8],["scaffolding",8],["osha",10],["osha 10",8],["osha 30",8],["forklift",6],["heavy lifting",6],["jobsite",8],["blueprint",6],["hard hat",5],["jackhammer",5],["foundation",6]], threshold: 25,
  },
  {
    id: "construction-manager", label: "Construction Manager",
    tagline: "Construction Manager | Site Superintendent | General Contractor",
    summaryHint: "Lead with project budgets, crew sizes managed, on-time completion rates, and subcontractor coordination.",
    signals: [["construction manager",18],["superintendent",12],["general contractor",12],["subcontractor",10],["project budget",8],["rfi",8],["submittal",8],["punch list",8],["schedule",6],["crew",8],["procore",8],["change order",8],["inspection",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     CLEANING & JANITORIAL
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "janitor", label: "Custodian / Janitor",
    tagline: "Custodian | Janitor | Facilities Cleaner",
    summaryHint: "Highlight cleaning standards, chemical handling safety, equipment proficiency, and floor care.",
    signals: [["custodian",15],["janitor",15],["janitorial",12],["cleaning",10],["floor care",8],["buffer",6],["mop",5],["sanitize",8],["disinfect",8],["trash",5],["restroom",6],["commercial cleaning",8],["chemical safety",8]], threshold: 20,
  },
  {
    id: "housekeeper", label: "Housekeeper",
    tagline: "Housekeeper | Room Attendant | Housekeeping Supervisor",
    summaryHint: "Emphasize rooms cleaned per shift, guest satisfaction, linen management, and attention to detail.",
    signals: [["housekeeper",15],["housekeeping",15],["room attendant",12],["linen",8],["laundry",6],["turnover",6],["hotel",6],["beds",5],["deep clean",8],["inspection",6],["amenities",5],["guest room",8]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     LEGAL
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "paralegal", label: "Paralegal / Legal Assistant",
    tagline: "Paralegal | Legal Assistant | Litigation Support",
    summaryHint: "Highlight case management, legal research, document drafting, and e-discovery proficiency.",
    signals: [["paralegal",18],["legal assistant",15],["litigation",10],["case management",10],["legal research",10],["westlaw",8],["lexisnexis",8],["discovery",8],["e-discovery",8],["deposition",8],["filing",6],["contract",6],["pleading",8],["court",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     GRAPHIC DESIGN & CREATIVE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "graphic-designer", label: "Graphic Designer",
    tagline: "Graphic Designer | Visual Designer | Creative Designer",
    summaryHint: "Lead with design tools, brand identity projects, print/digital deliverables, and client collaboration.",
    signals: [["graphic designer",18],["graphic design",15],["photoshop",12],["illustrator",12],["indesign",10],["figma",8],["branding",10],["logo",8],["typography",8],["layout",8],["print design",8],["packaging",6],["creative suite",8],["adobe",8]], threshold: 25,
  },
  {
    id: "ux-designer", label: "UX / UI Designer",
    tagline: "UX Designer | UI Designer | Product Designer",
    summaryHint: "Highlight user research, wireframing, prototyping, usability testing, and design system contributions.",
    signals: [["ux designer",18],["ui designer",15],["product designer",12],["wireframe",10],["prototype",10],["figma",10],["sketch",8],["user research",10],["usability testing",10],["design system",8],["user flow",8],["information architecture",8]], threshold: 25,
  },
  {
    id: "photographer", label: "Photographer / Videographer",
    tagline: "Photographer | Videographer | Content Creator",
    summaryHint: "Focus on shooting experience, editing proficiency, client portfolio, and equipment expertise.",
    signals: [["photographer",15],["videographer",12],["photography",12],["video production",10],["lightroom",10],["premiere pro",10],["final cut",8],["camera",8],["dslr",6],["lighting",8],["editing",8],["drone",6],["wedding",6],["portrait",6],["commercial shoot",8]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     FITNESS & WELLNESS
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "personal-trainer", label: "Personal Trainer",
    tagline: "Personal Trainer | Fitness Coach | Certified Trainer",
    summaryHint: "Highlight certifications (NASM, ACE, CSCS), client retention, program design, and results achieved.",
    signals: [["personal trainer",18],["fitness",12],["nasm",10],["ace certified",10],["cscs",8],["workout",6],["strength training",8],["weight loss",6],["nutrition",6],["client retention",8],["exercise program",8],["gym",6],["bootcamp",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     SECURITY & PROTECTIVE SERVICES
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "security-guard", label: "Security Guard / Officer",
    tagline: "Security Guard | Security Officer | Loss Prevention Specialist",
    summaryHint: "Focus on patrol duties, incident reports, access control, and surveillance monitoring.",
    signals: [["security guard",18],["security officer",15],["loss prevention",12],["patrol",10],["surveillance",8],["access control",10],["incident report",10],["cctv",8],["guard card",8],["badge",5],["visitor management",6],["alarm",6],["crowd control",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     BEAUTY & PERSONAL CARE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "cosmetologist", label: "Cosmetologist / Hair Stylist",
    tagline: "Cosmetologist | Hair Stylist | Licensed Beautician",
    summaryHint: "Highlight clientele size, service menu, product sales, and salon/suite experience.",
    signals: [["cosmetologist",18],["hair stylist",15],["hairstylist",12],["salon",10],["color",6],["highlights",8],["balayage",8],["cut",5],["blowout",6],["client retention",8],["cosmetology license",10],["booth rental",6],["product sales",8]], threshold: 25,
  },
  {
    id: "esthetician", label: "Esthetician",
    tagline: "Esthetician | Skincare Specialist | Licensed Esthetician",
    summaryHint: "Emphasize facial treatments, skincare protocols, client consultations, and product knowledge.",
    signals: [["esthetician",18],["skincare",12],["facial",10],["chemical peel",8],["microdermabrasion",8],["waxing",6],["extractions",6],["skin analysis",8],["spa",8],["dermaplaning",8],["licensed esthetician",10]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     SOCIAL WORK & COUNSELING
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "social-worker", label: "Social Worker",
    tagline: "Social Worker | Case Manager | Clinical Social Worker",
    summaryHint: "Highlight caseload management, client advocacy, crisis intervention, and community resource navigation.",
    signals: [["social worker",18],["case manager",12],["lcsw",12],["msw",10],["caseload",10],["client advocacy",8],["crisis intervention",10],["mental health",8],["substance abuse",8],["dss",6],["child welfare",8],["foster care",8],["intake",6],["treatment plan",8]], threshold: 25,
  },
  {
    id: "counselor", label: "Counselor / Therapist",
    tagline: "Counselor | Therapist | Licensed Professional Counselor",
    summaryHint: "Lead with therapeutic modalities, client populations, licensure, and outcome tracking.",
    signals: [["counselor",15],["therapist",15],["lpc",12],["lmft",10],["cbt",10],["dbt",8],["emdr",8],["therapy",10],["mental health",8],["anxiety",6],["depression",6],["trauma",6],["psychotherapy",8],["group therapy",8]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     AGRICULTURE & LANDSCAPING
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "landscaper", label: "Landscaper / Groundskeeper",
    tagline: "Landscaper | Groundskeeper | Lawn Care Specialist",
    summaryHint: "Focus on mowing, irrigation, hardscaping, plant knowledge, and crew leadership.",
    signals: [["landscaper",18],["landscaping",15],["groundskeeper",12],["mowing",8],["irrigation",10],["hardscape",8],["mulch",5],["tree trimming",8],["lawn care",10],["sod",5],["pesticide",6],["fertilizer",6],["sprinkler",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     MANUFACTURING & PRODUCTION
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "machine-operator", label: "Machine Operator",
    tagline: "Machine Operator | CNC Operator | Production Operator",
    summaryHint: "Highlight equipment operated, production targets met, quality control, and safety record.",
    signals: [["machine operator",18],["cnc",12],["lathe",8],["mill",8],["press operator",8],["production",10],["assembly",8],["quality control",8],["qc",6],["inspection",6],["tolerance",6],["blueprint",6],["shift",5],["lean manufacturing",8]], threshold: 25,
  },
  {
    id: "quality-inspector", label: "Quality Inspector",
    tagline: "Quality Inspector | QC Inspector | Quality Assurance Technician",
    summaryHint: "Focus on inspection methods, defect rates reduced, ISO standards, and measurement tools.",
    signals: [["quality inspector",18],["qc inspector",12],["quality assurance",10],["inspection",10],["caliper",8],["micrometer",8],["gauge",6],["iso 9001",10],["spc",8],["defect",8],["specification",6],["cmm",8],["first article",8]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     ENGINEERING (NON-SOFTWARE)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "mechanical-engineer", label: "Mechanical Engineer",
    tagline: "Mechanical Engineer | Design Engineer | Product Engineer",
    summaryHint: "Highlight CAD proficiency, product design, FEA/CFD analysis, and manufacturing collaboration.",
    signals: [["mechanical engineer",18],["solidworks",12],["autocad",10],["catia",8],["fea",10],["cfd",8],["gd&t",10],["tolerance",6],["prototype",8],["3d printing",6],["manufacturing",6],["bill of materials",8],["pe license",8]], threshold: 25,
  },
  {
    id: "civil-engineer", label: "Civil Engineer",
    tagline: "Civil Engineer | Structural Engineer | Site Engineer",
    summaryHint: "Focus on site design, permitting, AutoCAD Civil 3D, and project management.",
    signals: [["civil engineer",18],["structural",10],["autocad civil 3d",10],["grading",8],["drainage",8],["permit",8],["surveying",8],["geotechnical",8],["revit",6],["stormwater",8],["concrete design",8],["dot",6],["bridge",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     RETAIL MANAGEMENT
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "store-manager", label: "Store Manager",
    tagline: "Store Manager | Assistant Manager | Retail Manager",
    summaryHint: "Lead with P&L responsibility, team size, shrink reduction, and year-over-year sales growth.",
    signals: [["store manager",18],["assistant manager",12],["retail manager",12],["p&l",10],["shrink",8],["inventory management",8],["visual merchandising",8],["district",6],["team lead",8],["loss prevention",6],["kpi",8],["scheduling",6],["staffing",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     MISCELLANEOUS
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "event-coordinator", label: "Event Coordinator",
    tagline: "Event Coordinator | Event Planner | Conference Organizer",
    summaryHint: "Highlight events managed, budgets, vendor negotiations, and attendee satisfaction.",
    signals: [["event coordinator",18],["event planner",15],["event management",12],["conference",8],["venue",8],["catering",6],["vendor",8],["budget",6],["attendee",8],["registration",6],["logistics",6],["setup",5],["breakdown",5]], threshold: 25,
  },
  {
    id: "property-manager", label: "Property Manager",
    tagline: "Property Manager | Community Manager | Leasing Consultant",
    summaryHint: "Focus on occupancy rates, rent collection, maintenance coordination, and tenant relations.",
    signals: [["property manager",18],["leasing",12],["tenant",10],["occupancy",10],["rent collection",10],["maintenance request",8],["eviction",6],["hoa",6],["apartment",6],["yardi",8],["appfolio",8],["property management",12],["move-in",6],["move-out",6]], threshold: 25,
  },
  {
    id: "veterinary-tech", label: "Veterinary Technician",
    tagline: "Veterinary Technician | Vet Tech | Veterinary Assistant",
    summaryHint: "Highlight animal handling, lab work, anesthesia monitoring, and client education.",
    signals: [["veterinary technician",18],["vet tech",15],["veterinary assistant",12],["animal",8],["dog",5],["cat",5],["anesthesia",8],["blood draw",8],["dental cleaning",6],["x-ray",6],["kennel",5],["surgery assist",8],["vaccination",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     RETAIL & CASHIER
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "cashier", label: "Cashier",
    tagline: "Cashier | Checkout Associate | Front-End Cashier",
    summaryHint: "Highlight transaction speed, cash handling accuracy, customer interaction, and loss prevention awareness.",
    signals: [["cashier",18],["cash handling",12],["register",10],["pos",10],["point of sale",10],["checkout",10],["change",5],["scan",5],["bag",5],["transaction",8],["customer service",6],["receipt",5],["self-checkout",6],["drawer",6]], threshold: 20,
  },
  {
    id: "stocker", label: "Stock Clerk / Stocker",
    tagline: "Stock Clerk | Stocker | Inventory Associate | Shelf Stocker",
    summaryHint: "Focus on stocking speed, planogram compliance, inventory accuracy, and physical stamina.",
    signals: [["stocker",18],["stock clerk",15],["stocking",12],["shelf",8],["planogram",10],["inventory",8],["unload",8],["pallet",6],["backroom",6],["merchandise",6],["freight",6],["overnight",5],["replenishment",8],["overstock",6]], threshold: 20,
  },
  {
    id: "retail-keyholder", label: "Retail Keyholder / Lead",
    tagline: "Keyholder | Shift Lead | Team Lead | Senior Associate",
    summaryHint: "Emphasize opening/closing responsibilities, team supervision, cash reconciliation, and customer escalation handling.",
    signals: [["keyholder",18],["shift lead",15],["team lead",12],["opening",6],["closing",6],["cash reconciliation",10],["deposit",6],["escalation",6],["supervisor",8],["retail",6],["scheduling",6],["training",5],["loss prevention",6]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     FAST FOOD & QUICK SERVICE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "fast-food", label: "Fast Food Worker",
    tagline: "Fast Food Worker | Crew Member | Team Member",
    summaryHint: "Highlight speed of service, order accuracy, food safety compliance, and multitasking under pressure.",
    signals: [["fast food",15],["crew member",15],["team member",10],["drive-thru",12],["drive through",10],["fryer",6],["grill",6],["order",6],["food prep",8],["food safety",8],["mcdonald",6],["burger",5],["sandwich",5],["rush",5],["speed of service",8],["counter",6]], threshold: 20,
  },
  {
    id: "dishwasher", label: "Dishwasher / Kitchen Utility",
    tagline: "Dishwasher | Kitchen Utility | Sanitation Worker",
    summaryHint: "Focus on sanitation standards, dish throughput, kitchen support, and reliability during peak service.",
    signals: [["dishwasher",18],["dish",10],["sanitation",10],["kitchen utility",12],["bus",6],["clean",6],["sanitize",8],["pot",5],["pan",5],["restaurant",5],["commercial kitchen",8],["food safety",6],["industrial dishwasher",8]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     MANUFACTURING & FACTORY
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "assembly-worker", label: "Assembly Line Worker",
    tagline: "Assembly Worker | Production Associate | Manufacturing Associate",
    summaryHint: "Highlight production rate, quality standards, team coordination, and safety record on the line.",
    signals: [["assembly",15],["assembly line",18],["production associate",15],["manufacturing",10],["line worker",12],["conveyor",8],["station",5],["parts",6],["component",6],["build",5],["quota",6],["lean",6],["shift",5],["quality",6],["inspection",5]], threshold: 20,
  },
  {
    id: "forklift-operator", label: "Forklift Operator",
    tagline: "Forklift Operator | Material Handler | Reach Truck Operator",
    summaryHint: "Lead with certification type, load capacity experience, safety record, and warehouse operations.",
    signals: [["forklift",18],["forklift operator",18],["material handler",15],["reach truck",10],["pallet jack",8],["order picker",8],["cherry picker",6],["loading dock",8],["warehouse",6],["osha",6],["sit-down",6],["stand-up",6],["propane",5],["electric",5],["certification",6]], threshold: 20,
  },
  {
    id: "production-supervisor", label: "Production Supervisor",
    tagline: "Production Supervisor | Manufacturing Supervisor | Shift Supervisor",
    summaryHint: "Focus on team size managed, production targets met, downtime reduction, and safety compliance.",
    signals: [["production supervisor",18],["manufacturing supervisor",15],["shift supervisor",12],["production line",10],["crew",8],["output",8],["downtime",8],["efficiency",6],["lean manufacturing",8],["5s",6],["kaizen",8],["shift",5],["headcount",6],["osha",5]], threshold: 25,
  },
  {
    id: "packager", label: "Packer / Packager",
    tagline: "Packer | Packager | Packaging Associate | Shipping Associate",
    summaryHint: "Highlight packing speed, accuracy, labeling compliance, and ability to meet daily quotas.",
    signals: [["packer",18],["packager",15],["packaging",12],["pack",8],["label",6],["box",5],["tape",5],["shrink wrap",6],["palletize",8],["shipping",6],["order",5],["quota",6],["fulfillment",6],["e-commerce",6]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     HEALTHCARE — ADDITIONAL
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "home-health-aide", label: "Home Health Aide",
    tagline: "Home Health Aide | HHA | Personal Care Aide | Caregiver",
    summaryHint: "Highlight ADL assistance, medication reminders, companionship, mobility support, and reliable transportation.",
    signals: [["home health aide",18],["hha",15],["caregiver",12],["personal care aide",12],["home care",12],["adl",8],["bathing",6],["dressing",6],["feeding",6],["mobility",8],["companionship",6],["medication reminder",8],["elderly",6],["senior care",8],["in-home",8]], threshold: 20,
  },
  {
    id: "phlebotomist", label: "Phlebotomist",
    tagline: "Phlebotomist | Blood Draw Technician | Lab Phlebotomist",
    summaryHint: "Focus on venipuncture success rate, patient comfort, specimen handling, and lab protocols.",
    signals: [["phlebotomist",18],["phlebotomy",15],["blood draw",12],["venipuncture",12],["specimen",10],["capillary",8],["butterfly needle",8],["vacutainer",8],["lab",6],["centrifuge",6],["patient",6],["vein",6],["tourniquet",6]], threshold: 20,
  },
  {
    id: "medical-receptionist", label: "Medical Receptionist",
    tagline: "Medical Receptionist | Front Desk Medical | Patient Services Representative",
    summaryHint: "Highlight patient scheduling, insurance verification, EHR navigation, and HIPAA compliance.",
    signals: [["medical receptionist",18],["front desk",8],["patient scheduling",12],["insurance verification",10],["copay",8],["referral",6],["ehr",8],["emr",6],["hipaa",8],["check-in",8],["appointment",8],["medical office",10],["phone",5],["fax",5]], threshold: 25,
  },
  {
    id: "occupational-therapist", label: "Occupational Therapist / OTA",
    tagline: "Occupational Therapist | OT | OTA | Rehabilitation Specialist",
    summaryHint: "Highlight functional assessments, adaptive equipment training, treatment plans, and patient outcomes.",
    signals: [["occupational therapy",15],["occupational therapist",18],["ota",12],["adaptive equipment",10],["functional assessment",10],["adl",8],["fine motor",8],["splint",6],["hand therapy",8],["pediatric",6],["geriatric",6],["treatment plan",8],["rehabilitation",8]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     GIG ECONOMY & DRIVING
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "rideshare-driver", label: "Rideshare / Gig Driver",
    tagline: "Rideshare Driver | Uber Driver | Lyft Driver | Gig Worker",
    summaryHint: "Highlight ride count, rating, customer service, navigation skills, and vehicle maintenance.",
    signals: [["rideshare",15],["uber",12],["lyft",12],["gig",8],["driver",8],["ride",6],["passenger",8],["rating",6],["navigation",6],["clean driving record",8],["customer service",6],["flexible schedule",6],["independent contractor",8]], threshold: 20,
  },
  {
    id: "bus-driver", label: "Bus Driver / Transit Operator",
    tagline: "Bus Driver | Transit Operator | School Bus Driver | Shuttle Driver",
    summaryHint: "Lead with CDL, passenger count, safety record, route knowledge, and ADA compliance.",
    signals: [["bus driver",18],["transit operator",15],["school bus",12],["shuttle driver",10],["cdl",8],["passenger",10],["route",8],["ada",6],["pre-trip inspection",8],["dot",6],["clean driving record",8],["fixed route",6],["charter",5]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     CHILDCARE & DOMESTIC
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "nanny", label: "Nanny / Babysitter",
    tagline: "Nanny | Babysitter | Childcare Provider | Au Pair",
    summaryHint: "Highlight ages cared for, activities planned, CPR/First Aid certification, and family communication.",
    signals: [["nanny",18],["babysitter",15],["babysitting",12],["au pair",10],["infant",8],["toddler",8],["child",6],["diaper",5],["bottle",5],["bedtime",5],["playtime",6],["homework help",6],["school pickup",6],["meal prep",6],["cpr certified",8],["first aid",6]], threshold: 20,
  },
  {
    id: "pet-groomer", label: "Pet Groomer / Dog Groomer",
    tagline: "Pet Groomer | Dog Groomer | Animal Groomer | Grooming Stylist",
    summaryHint: "Focus on breeds handled, grooming techniques, safety handling, and client retention.",
    signals: [["pet groomer",18],["dog groomer",15],["grooming",12],["groomer",12],["bathing",6],["clipping",8],["nail trim",8],["de-shedding",6],["breed standard",8],["scissor",6],["clipper",6],["kennel",5],["pet",6],["animal handling",8]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     DATA ENTRY & OFFICE SUPPORT
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "data-entry", label: "Data Entry Clerk",
    tagline: "Data Entry Clerk | Data Entry Specialist | Typist",
    summaryHint: "Highlight typing speed (WPM), accuracy rate, database proficiency, and volume processed.",
    signals: [["data entry",18],["data entry clerk",18],["typing",10],["wpm",10],["keystrokes",8],["database",8],["spreadsheet",6],["excel",6],["data processing",10],["accuracy",8],["10-key",8],["alphanumeric",6],["transcription",8],["form",5]], threshold: 20,
  },
  {
    id: "virtual-assistant", label: "Virtual Assistant",
    tagline: "Virtual Assistant | Remote Administrative Support | Executive VA",
    summaryHint: "Highlight task management, calendar coordination, email management, and tool proficiency.",
    signals: [["virtual assistant",18],["remote assistant",12],["va ",8],["calendar management",10],["email management",10],["scheduling",8],["travel booking",6],["inbox",6],["task management",8],["asana",6],["trello",6],["notion",6],["slack",5],["zoom",5]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     TRADES — ADDITIONAL
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "painter", label: "Painter",
    tagline: "Painter | House Painter | Commercial Painter | Paint Contractor",
    summaryHint: "Highlight surface preparation, coating types, spray equipment, and project completion speed.",
    signals: [["painter",18],["painting",15],["house painter",12],["commercial painter",10],["spray",8],["roller",6],["brush",5],["primer",6],["latex",5],["stain",6],["surface prep",8],["drywall repair",6],["tape",5],["drop cloth",5],["exterior",6],["interior",6]], threshold: 20,
  },
  {
    id: "roofer", label: "Roofer",
    tagline: "Roofer | Roofing Technician | Roofing Installer",
    summaryHint: "Focus on roofing systems installed, safety certifications, weather resilience, and crew collaboration.",
    signals: [["roofer",18],["roofing",15],["shingle",10],["tile roof",8],["flat roof",8],["tpo",8],["flashing",8],["leak repair",8],["gutter",6],["tear-off",6],["underlayment",6],["fall protection",8],["ladder",5],["osha",6]], threshold: 20,
  },
  {
    id: "tiler", label: "Tile Installer / Setter",
    tagline: "Tile Installer | Tile Setter | Flooring Installer",
    summaryHint: "Highlight tile types, layout patterns, mortar mixing, waterproofing, and precision cutting.",
    signals: [["tile installer",18],["tile setter",15],["tiler",12],["ceramic",8],["porcelain",8],["backsplash",8],["mortar",8],["grout",8],["thinset",8],["waterproofing",6],["schluter",6],["wet saw",8],["flooring",6],["level",5]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     AVIATION & TRAVEL
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "flight-attendant", label: "Flight Attendant",
    tagline: "Flight Attendant | Cabin Crew | In-Flight Service",
    summaryHint: "Highlight safety training, customer service at altitude, conflict resolution, and multilingual abilities.",
    signals: [["flight attendant",18],["cabin crew",15],["in-flight",10],["airline",10],["safety demonstration",8],["turbulence",5],["boarding",6],["beverage service",6],["emergency evacuation",8],["faa",8],["cpr",6],["first aid",6],["passenger",6],["galley",6]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     GOVERNMENT & PUBLIC SERVICE
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "mail-carrier", label: "Mail Carrier / Postal Worker",
    tagline: "Mail Carrier | Postal Worker | Letter Carrier | USPS",
    summaryHint: "Highlight route efficiency, delivery accuracy, weather reliability, and physical stamina.",
    signals: [["mail carrier",18],["postal worker",15],["letter carrier",12],["usps",12],["post office",10],["mail",8],["delivery",6],["route",8],["package",6],["certified mail",6],["po box",5],["sorting",6],["postal exam",8],["walking route",6]], threshold: 20,
  },
  {
    id: "firefighter", label: "Firefighter",
    tagline: "Firefighter | Fire Captain | Fire Engineer | Wildland Firefighter",
    summaryHint: "Lead with certifications, apparatus operation, rescue training, and fitness standards.",
    signals: [["firefighter",18],["fire department",12],["fire engine",8],["ladder",6],["hose",6],["nfpa",10],["emt",6],["rescue",8],["hazmat",8],["wildland",8],["structure fire",8],["turnout gear",6],["scba",8],["fire academy",8],["cpat",8]], threshold: 20,
  },
  {
    id: "police-officer", label: "Police Officer",
    tagline: "Police Officer | Law Enforcement | Patrol Officer | Deputy",
    summaryHint: "Highlight patrol experience, community policing, report writing, and de-escalation training.",
    signals: [["police officer",18],["law enforcement",15],["patrol",10],["deputy",10],["peace officer",10],["post certified",8],["report writing",8],["traffic stop",6],["arrest",6],["investigation",8],["community policing",8],["de-escalation",8],["firearm",6],["body camera",6]], threshold: 25,
  },

  /* ═══════════════════════════════════════════════════════════════
     WELLNESS & ALTERNATIVE HEALTH
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "massage-therapist", label: "Massage Therapist",
    tagline: "Massage Therapist | LMT | Licensed Massage Therapist",
    summaryHint: "Highlight modalities (deep tissue, Swedish, sports), client retention, and licensure.",
    signals: [["massage therapist",18],["lmt",15],["massage",12],["deep tissue",10],["swedish",8],["sports massage",8],["trigger point",8],["prenatal",6],["hot stone",6],["relaxation",5],["client retention",8],["spa",6],["wellness",5],["bodywork",8]], threshold: 20,
  },
  {
    id: "yoga-instructor", label: "Yoga / Pilates Instructor",
    tagline: "Yoga Instructor | Pilates Instructor | Group Fitness Instructor",
    summaryHint: "Focus on certifications (RYT-200/500), class sizes, student retention, and specialized populations.",
    signals: [["yoga instructor",18],["yoga",12],["pilates",12],["ryt",10],["group fitness",10],["class",6],["flow",5],["vinyasa",8],["hatha",6],["power yoga",6],["meditation",6],["mindfulness",5],["studio",6],["mat",5],["reformer",8]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     CONTENT & MEDIA
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "content-creator", label: "Content Creator / Influencer",
    tagline: "Content Creator | Influencer | YouTuber | Streamer",
    summaryHint: "Highlight audience size, engagement rates, brand partnerships, and content production skills.",
    signals: [["content creator",18],["influencer",12],["youtuber",10],["streamer",10],["tiktok",8],["youtube",8],["instagram",6],["subscriber",8],["follower",6],["brand deal",8],["sponsorship",8],["editing",6],["thumbnail",5],["monetization",6],["engagement rate",8]], threshold: 20,
  },
  {
    id: "copywriter", label: "Copywriter / Content Writer",
    tagline: "Copywriter | Content Writer | Technical Writer | Blog Writer",
    summaryHint: "Lead with content types, industries served, SEO knowledge, and measurable engagement results.",
    signals: [["copywriter",18],["content writer",15],["technical writer",12],["blog",8],["article",6],["seo",8],["copy",8],["headline",6],["cta",6],["landing page",8],["email copy",8],["tone of voice",6],["ap style",6],["grammar",5],["proofread",6]], threshold: 20,
  },

  /* ═══════════════════════════════════════════════════════════════
     NONPROFIT & COMMUNITY
     ═══════════════════════════════════════════════════════════════ */
  {
    id: "nonprofit-coordinator", label: "Nonprofit Coordinator",
    tagline: "Program Coordinator | Nonprofit Associate | Community Organizer",
    summaryHint: "Highlight program management, fundraising support, volunteer coordination, and community impact.",
    signals: [["nonprofit",15],["program coordinator",15],["community organizer",12],["grant",10],["fundraising",10],["volunteer",10],["outreach",8],["donor",8],["501c3",6],["mission",5],["advocacy",8],["community engagement",8],["event planning",6],["stakeholder",6]], threshold: 25,
  },
];

/**
 * Analyse parsed resume data and return ranked role recommendations.
 * Pure function — no side effects, runs instantly.
 */
export function recommendRoles(data: ResumeData): RoleRecommendation[] {
  /* Build a single searchable corpus from all resume text */
  const parts: string[] = [
    data.summary,
    data.contact.targetTitle,
    ...data.skills.languages,
    ...data.skills.tools,
    ...data.skills.strengths,
    ...data.experience.flatMap((e) => [e.title, e.company, ...e.bullets]),
    ...data.projects.flatMap((p) => [p.name, p.stack, ...p.bullets]),
    ...data.education.flatMap((e) => [e.degree, e.school, ...e.details]),
    ...data.certifications.map((c) => c.name),
  ];
  const corpus = parts.join(" ").toLowerCase();

  const results: RoleRecommendation[] = [];

  for (const rule of ROLE_RULES) {
    let score = 0;
    const matched: string[] = [];

    for (const [keyword, weight] of rule.signals) {
      if (corpus.includes(keyword)) {
        score += weight;
        matched.push(keyword);
      }
    }

    if (score >= rule.threshold) {
      /* Normalise confidence to 0-100 (cap at highest plausible score) */
      const maxPossible = rule.signals.reduce((s, [, w]) => s + w, 0);
      const confidence = Math.min(100, Math.round((score / maxPossible) * 100));

      results.push({
        id: rule.id,
        label: rule.label,
        tagline: rule.tagline,
        confidence,
        summaryHint: rule.summaryHint,
        matchedSignals: matched.slice(0, 6),
      });
    }
  }

  /* Sort by confidence descending, return top 6 */
  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
}

/* ─────────── Transferable skills for a custom desired role ─────────── */

/**
 * Universal soft/transferable skill categories.
 * Each maps a readable label to keywords that signal the skill in any resume.
 */
const UNIVERSAL_TRANSFERS: [string, string[]][] = [
  ["Communication", ["communication", "present", "training", "mentoring", "documentation", "written", "verbal", "public speaking", "customer service", "client"]],
  ["Leadership", ["lead", "leadership", "supervised", "managed team", "mentor", "coordinated team", "directed", "oversaw"]],
  ["Problem-Solving", ["troubleshoot", "resolved", "diagnosed", "problem-solving", "root cause", "debug", "investigated", "solution"]],
  ["Organization", ["organized", "scheduling", "calendar", "prioriti", "multi-task", "filing", "coordination", "workflow"]],
  ["Detail-Oriented", ["detail-oriented", "accuracy", "quality control", "audit", "compliance", "inspection", "verification", "reviewed"]],
  ["Teamwork", ["team", "collaborate", "cross-functional", "interdepartmental", "partnered", "group"]],
  ["Customer Focus", ["customer", "client", "patient", "guest", "tenant", "stakeholder", "satisfaction", "retention"]],
  ["Technical Literacy", ["software", "computer", "microsoft", "excel", "google", "system", "database", "platform", "digital"]],
  ["Time Management", ["deadline", "time management", "fast-paced", "high-volume", "efficiency", "throughput", "turnaround"]],
  ["Adaptability", ["adapt", "flexible", "cross-trained", "multiple", "diverse", "versatile", "transition"]],
  ["Project Management", ["project", "milestone", "deliverable", "scope", "budget", "timeline", "planning", "roadmap"]],
  ["Data & Reporting", ["report", "analytics", "data", "metrics", "dashboard", "kpi", "spreadsheet", "excel", "tracking"]],
  ["Safety & Compliance", ["osha", "safety", "compliance", "regulation", "hipaa", "protocol", "procedure", "standard"]],
  ["Sales & Persuasion", ["sales", "upsell", "revenue", "quota", "negotiat", "close", "pitch", "convert"]],
  ["Training & Mentoring", ["train", "mentor", "onboard", "coach", "instruct", "taught", "facilitat", "workshop"]],
];

export type TransferableResult = {
  /** The matched or best-guess target role (null if no match) */
  matchedRole: RoleRule | null;
  /** Skills from the resume that directly match the target role */
  directMatches: string[];
  /** Universal transferable skills detected in the resume */
  transferableSkills: { label: string; evidence: string[] }[];
  /** Suggested tagline for the resume header */
  suggestedTagline: string;
  /** Coaching hint for the summary */
  summaryHint: string;
  /** Skills the target role values that the user should consider developing */
  gapSkills: string[];
};

/**
 * Given a user-typed desired role and their resume data,
 * find transferable skills and direct matches.
 */
export function analyzeTransferableSkills(
  desiredRole: string,
  data: ResumeData
): TransferableResult {
  const desired = desiredRole.toLowerCase().trim();
  if (!desired) {
    return { matchedRole: null, directMatches: [], transferableSkills: [], suggestedTagline: "", summaryHint: "", gapSkills: [] };
  }

  /* Build the resume corpus */
  const parts: string[] = [
    data.summary,
    data.contact.targetTitle,
    ...data.skills.languages,
    ...data.skills.tools,
    ...data.skills.strengths,
    ...data.experience.flatMap((e) => [e.title, e.company, ...e.bullets]),
    ...data.projects.flatMap((p) => [p.name, p.stack, ...p.bullets]),
    ...data.education.flatMap((e) => [e.degree, e.school, ...e.details]),
    ...data.certifications.map((c) => c.name),
  ];
  const corpus = parts.join(" ").toLowerCase();

  /* ── 1. Find the best-matching role rule ── */
  let bestRule: RoleRule | null = null;
  let bestScore = 0;

  for (const rule of ROLE_RULES) {
    let score = 0;
    const ruleText = `${rule.id} ${rule.label} ${rule.tagline}`.toLowerCase();

    /* Exact full-phrase match is strongest */
    if (ruleText.includes(desired)) {
      score += 100;
    }

    /* Check label specifically — "dental assistant" should match label "Dental Assistant" */
    if (rule.label.toLowerCase().includes(desired)) {
      score += 80;
    }
    if (desired.includes(rule.label.toLowerCase())) {
      score += 80;
    }

    /* Multi-word bigram matching: check consecutive word pairs from the desired role */
    const desiredWords = desired.split(/\s+/).filter(w => w.length > 2);
    for (let i = 0; i < desiredWords.length - 1; i++) {
      const bigram = desiredWords[i] + " " + desiredWords[i + 1];
      if (ruleText.includes(bigram)) score += 25;
    }

    /* Single word matches (weaker, only for words > 3 chars to avoid noise) */
    for (const word of desiredWords) {
      if (word.length > 3 && ruleText.includes(word)) score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  /* Only accept a match if there was meaningful overlap */
  if (bestScore < 5) bestRule = null;

  /* ── 2. Find direct matches (resume keywords that the target role values) ── */
  const directMatches: string[] = [];
  const gapSkills: string[] = [];

  if (bestRule) {
    for (const [keyword] of bestRule.signals) {
      if (corpus.includes(keyword)) {
        directMatches.push(keyword);
      } else {
        gapSkills.push(keyword);
      }
    }
  }

  /* ── 3. Scan for universal transferable skills ── */
  const transferableSkills: { label: string; evidence: string[] }[] = [];
  for (const [label, keywords] of UNIVERSAL_TRANSFERS) {
    const evidence: string[] = [];
    for (const kw of keywords) {
      if (corpus.includes(kw)) evidence.push(kw);
    }
    if (evidence.length >= 2) {
      transferableSkills.push({ label, evidence: evidence.slice(0, 3) });
    }
  }

  /* ── 4. Build suggested tagline & summary hint ── */
  const suggestedTagline = bestRule
    ? bestRule.tagline
    : `${desiredRole} | Career Transition | Motivated Professional`;

  const topTransferable = transferableSkills.slice(0, 3).map((t) => t.label).join(", ");
  const summaryHint = bestRule
    ? `Transitioning into ${bestRule.label}: highlight your ${topTransferable || "transferable experience"} and emphasize ${directMatches.slice(0, 3).join(", ") || "related skills"}.`
    : `Targeting ${desiredRole}: lead with ${topTransferable || "your strongest transferable skills"} and express clear motivation for the career change.`;

  /* Only show top gap skills that are readable (not abbreviations) */
  const readableGaps = gapSkills
    .filter((g) => g.length > 3 && !/^[a-z]{1,3}$/i.test(g))
    .slice(0, 6);

  return {
    matchedRole: bestRule,
    directMatches: directMatches.slice(0, 8),
    transferableSkills: transferableSkills.slice(0, 6),
    suggestedTagline,
    summaryHint,
    gapSkills: readableGaps,
  };
}

export const templateOptions: { id: ResumeTemplateId; label: string; description: string }[] = [
  {
    id: "classic",
    label: "Classic ATS",
    description: "Single-column, straightforward, and safest for most applicants.",
  },
  {
    id: "compact",
    label: "Compact ATS",
    description: "Tighter spacing for users trying to keep a stronger one-page layout.",
  },
  {
    id: "modern",
    label: "Modern Professional",
    description: "Still ATS-aware, but with slightly stronger visual hierarchy.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   Experience-Level Detection & Page Recommendation
   ═══════════════════════════════════════════════════════════════ */

export type ExperienceLevel = "entry" | "mid" | "senior" | "executive";

export interface PageRecommendation {
  level: ExperienceLevel;
  levelLabel: string;
  recommendedPages: 1 | 2;
  reason: string;
  contentScore: number; // 0-100, how "full" the resume is
  tips: string[];
}

/**
 * Estimate total years of experience from date ranges in experience entries.
 * Handles "Present"/"Current" as today's date.
 */
function estimateYearsOfExperience(experience: ExperienceEntry[]): number {
  const monthNames = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  let totalMonths = 0;

  for (const entry of experience) {
    const parseDate = (s: string): Date | null => {
      if (!s) return null;
      const lower = s.toLowerCase().trim();
      if (lower === "present" || lower === "current") return new Date();
      // Try "Mon YYYY" or "YYYY"
      const parts = lower.split(/[\s,]+/);
      let month = 0, year = 0;
      for (const p of parts) {
        const mi = monthNames.findIndex(m => p.startsWith(m));
        if (mi >= 0) month = mi;
        const yi = parseInt(p);
        if (yi > 1900 && yi < 2100) year = yi;
      }
      if (year) return new Date(year, month);
      return null;
    };

    const start = parseDate(entry.startDate);
    const end = parseDate(entry.endDate);
    if (start && end) {
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
      if (diff > 0) totalMonths += diff;
    }
  }
  return Math.round(totalMonths / 12 * 10) / 10;
}

/**
 * Count total meaningful content items across the resume.
 */
function countContentItems(data: ResumeData): number {
  let count = 0;
  // Experience bullets
  for (const exp of data.experience) {
    count += exp.bullets.filter(b => b.trim().length > 10).length;
  }
  // Project bullets
  for (const proj of data.projects) {
    count += proj.bullets.filter(b => b.trim().length > 10).length;
  }
  // Education details
  for (const edu of data.education) {
    count += edu.details.filter(d => d.trim().length > 5).length;
  }
  // Certifications
  count += data.certifications.filter(c => c.name.trim()).length;
  // Skills (each category counts as 1 if populated)
  if (data.skills.languages.filter(Boolean).length) count += 1;
  if (data.skills.tools.filter(Boolean).length) count += 1;
  if (data.skills.strengths.filter(Boolean).length) count += 1;
  // Summary
  if (data.summary.trim().length > 20) count += 1;
  return count;
}

export function analyzeExperienceLevel(data: ResumeData): PageRecommendation {
  const years = estimateYearsOfExperience(data.experience);
  const expCount = data.experience.filter(e => e.company.trim()).length;
  const totalBullets = data.experience.reduce((s, e) => s + e.bullets.filter(b => b.trim().length > 10).length, 0);
  const projCount = data.projects.filter(p => p.name.trim()).length;
  const certCount = data.certifications.filter(c => c.name.trim()).length;
  const contentItems = countContentItems(data);

  // Content score: rough estimate of how much content there is (0-100)
  const contentScore = Math.min(100, Math.round(
    (expCount * 12) + (totalBullets * 3) + (projCount * 8) + (certCount * 5) + (data.summary.trim().length > 50 ? 5 : 0)
  ));

  // Determine level
  let level: ExperienceLevel;
  let levelLabel: string;
  if (years >= 12 || expCount >= 6) {
    level = "executive";
    levelLabel = "Executive / Senior Leadership";
  } else if (years >= 6 || expCount >= 4) {
    level = "senior";
    levelLabel = "Senior Professional";
  } else if (years >= 2 || expCount >= 2) {
    level = "mid";
    levelLabel = "Mid-Level Professional";
  } else {
    level = "entry";
    levelLabel = "Entry Level / Early Career";
  }

  // Page recommendation logic
  let recommendedPages: 1 | 2 = 1;
  let reason = "";
  const tips: string[] = [];

  if (level === "entry") {
    recommendedPages = 1;
    reason = "With early-career experience, a focused one-page resume makes the strongest impression. Recruiters spend ~7 seconds on initial review — make every line count.";
    if (totalBullets < 6) tips.push("Aim for 3-5 strong, quantified bullet points per role.");
    if (projCount === 0) tips.push("Add personal or academic projects to fill space and demonstrate initiative.");
    if (certCount === 0) tips.push("Include relevant certifications or coursework to strengthen your profile.");
  } else if (level === "mid") {
    if (contentScore >= 55 && totalBullets >= 10) {
      recommendedPages = 2;
      reason = "You have solid experience worth showcasing. A two-page resume lets you tell the full story without cutting impactful achievements.";
    } else {
      recommendedPages = 1;
      reason = "Your experience fits well on one page. Keep it tight — expand to two pages when you have more quantified achievements to show.";
      if (totalBullets < 8) tips.push("Add more quantified achievements (numbers, percentages, dollar amounts) to justify a second page.");
    }
  } else if (level === "senior") {
    recommendedPages = 2;
    reason = "With significant experience, a two-page resume is expected. Highlight leadership impact, team size, and business outcomes.";
    if (totalBullets < 12) tips.push("Senior resumes should have 4-6 bullets per role emphasizing leadership and measurable outcomes.");
    tips.push("Consider leading bullets with scope indicators: team size, budget, revenue impact.");
  } else {
    recommendedPages = 2;
    reason = "Executive resumes should be two pages. Focus on strategic impact, P&L ownership, organizational transformation, and board-level contributions.";
    tips.push("Lead with an executive summary rather than a generic objective.");
    tips.push("Emphasize business outcomes: revenue growth, cost reduction, team scaling, market expansion.");
  }

  return { level, levelLabel, recommendedPages, reason, contentScore, tips };
}

