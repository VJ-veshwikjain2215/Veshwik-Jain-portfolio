// Toolkit entries are owner-confirmed skills or tools present in project code.
// These describe experience, not proficiency ratings or years of expertise.
export const toolkitCategories = [
  {
    id: "languages",
    title: "Languages",
    note: "The foundations I write with.",
    theme: "light",
    tools: ["Java", "JavaScript", "Kotlin"],
  },
  {
    id: "interface",
    title: "Interface",
    note: "Structure, style, and interaction.",
    theme: "dark",
    tools: ["React", "HTML", "CSS"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    note: "Application logic and connections.",
    theme: "light",
    tools: ["Spring Boot", "REST APIs", "Node.js", "Express"],
  },
  {
    id: "data",
    title: "Data",
    note: "Queries, persistence, and schema changes.",
    theme: "light",
    tools: ["SQL", "PostgreSQL", "JDBC", "Flyway"],
  },
  {
    id: "delivery",
    title: "Build & delivery",
    note: "Version, build, and check the work.",
    theme: "dark",
    tools: ["Git", "GitHub", "Maven", "GitHub Actions"],
  },
];

export const developmentOutcomes = [
  {
    id: "workflows",
    title: "Business workflows people can complete.",
    summary: "Turn day-to-day inputs into records people can find and review.",
    description:
      "I connect the steps around a real task: finding the right item, recording what happened, and returning to the result later.",
    deliverables: [
      "Searchable catalogs and forms with a clear next step.",
      "Saved observations, notes, and reviewable history.",
      "Filters and exports that make records useful beyond submission.",
    ],
    evidence: [
      {
        projectId: "CountCheck",
        detail:
          "Find a product, compare physical and recorded quantities, then review or export the observation.",
      },
      {
        projectId: "Civic Issue Reporter",
        detail:
          "Submit an issue with a photo and location, then follow its status through a reporting workflow.",
      },
    ],
  },
  {
    id: "interfaces",
    title: "Interfaces that make complex tasks clearer.",
    summary: "Put choices, feedback, and results where people need them.",
    description:
      "I build task-focused screens that explain the next action, keep results accessible, and work across screen sizes and input methods.",
    deliverables: [
      "Explicit modes and inputs instead of hidden assumptions.",
      "Readable results with practical copy and download actions.",
      "Responsive layouts and keyboard-accessible controls.",
    ],
    evidence: [
      {
        projectId: "Secure-Crypt",
        detail:
          "An educational workbench with explicit encryption modes, an input/result workspace, and copy and download actions.",
      },
      {
        title: "This portfolio",
        href: "/#projects",
        detail:
          "Responsive project browsing, section navigation, and motion that respects reduced-motion preferences.",
      },
    ],
  },
  {
    id: "recovery",
    title: "Account and form flows that handle mistakes.",
    summary: "Make validation, retries, and recovery part of the experience.",
    description:
      "I think through what happens when a request is repeated, an input is incomplete, or someone needs to regain access—not only the successful submission.",
    deliverables: [
      "Validation with actionable feedback before a task continues.",
      "Account-scoped records and submissions designed for safe retries.",
      "Recovery and verification steps with explicit user feedback.",
    ],
    evidence: [
      {
        projectId: "CountCheck",
        detail:
          "Private business workspaces, duplicate-safe count submissions, and one-time account recovery codes.",
      },
      {
        title: "Portfolio contact flow",
        href: "/contact",
        detail:
          "Email-code verification, field validation, and clear success or error feedback before a message is sent.",
      },
    ],
  },
];
