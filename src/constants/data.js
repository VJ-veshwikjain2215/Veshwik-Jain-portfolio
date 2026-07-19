// ---------------------------------------------------------------
// Every piece of copy on the site lives here. Edit this file to
// re-skin the portfolio with your own information — nothing else
// needs to change.
// ---------------------------------------------------------------
import civicIssueImg from "../assets/civic-issue.png";
import rupeeRakshakImg from "../assets/RupeeRakshak.png";
export const profile = {
  name: "Veshwik Jain",
  roles: [
    "Engineering Student",
    "Java Developer",
    "Backend Developer",
    "Problem Solver",
  ],
  tagline:
    "I build backend systems that don't fall over — and I actually enjoy the part where you argue with a NullPointerException at 1am.",
  location: "Indore, India",
  email: "Veshwikjain07@gmail.com",
  phone: "+91 6269169840",
  resumeUrl: "/resume.pdf",
  social: {
    github: "https://github.com/VJ-veshwikjain2215",
    linkedin: "https://www.linkedin.com/in/veshwik-jain/",
    email: "mailto:Veshwikjain07@gmail.com",
  },
};

export const about = {
  summary: [
    "I'm a second-year engineering student who got hooked on backend development the first time a REST API I wrote actually returned the right JSON on the first try. Since then I've spent most of my free time in Java and Spring Boot, figuring out how the pieces underneath a web app fit together.",
    "I like systems that are boring in the best way: predictable, well-tested, and easy for the next person to understand. Outside of coursework, I'm usually deep in a side project, reading up on database internals, or arguing with myself about whether a service really needs another microservice.",
  ],
  interests: [
    "Backend architecture",
    "Database management",
    "Java programming",
    "Open-source contribution",
  ],
  goals:
    "Short term, I'm aiming for a backend or full-stack engineering role where I can work on systems at real scale. Longer term, I want to be the engineer people trust to design the data layer, not just consume it.",
  timeline: [
    {
      year: "2024",
      title: "Joined college and discovered backend development",
      place: "Self-taught, small projects",
      detail:
        "Started learning Java and Spring Boot through small projects, and realized I enjoy building the systems that power web applications.",
    },
    {
      year: "2025",
      title: "Joined GitHub",
      place: "GitHub",
      detail:
        "joined github to learn more about open-source contribution and to collaborate with other developers on backend projects.",
    },
    {
      year: "2026 — Present",
      title: "Internship-ready",
      place: "Currently seeking",
      detail:
        "Looking for a backend or full-stack internship to apply what I've built in a production setting.",
    },
  ],
};

export const skillCategories = [
  {
    label: "Programming Languages",
    path: "~/skills/languages",
    skills: ["C/C++", "Java", "JavaScript", "HTML", "CSS"],
  },
  {
    label: "Frameworks & Libraries",
    path: "~/skills/frameworks",
    skills: ["Spring Boot", "REST APIs", "React", "Node.js"],
  },
  {
    label: "Databases",
    path: "~/skills/databases",
    skills: ["MySQL", "DBMS"],
  },
  {
    label: "Tools",
    path: "~/skills/tools",
    skills: ["Git", "GitHub", "VS Code"],
  },
  {
    label: "Operating Systems",
    path: "~/skills/systems",
    skills: ["Linux", "Windows"],
  },
];

export const projects = [

  {
    id: "RupeeRakshak",
    title: "RupeeRakshak",
    subtitle: " — AI-Powered Personal Finance Management Platform",
    description: ` Full-stack AI-powered personal finance platform designed to help users manage expenses, analyze spending habits,
                  and build financial stability. Features include secure Google OAuth authentication, CSV bank statement import,
                  automatic transaction categorization, interactive financial dashboard, monthly income vs. expense analytics,
                  AI-driven financial insights, emergency fund recommendations, future income prediction, financial health score,
                  risk analysis, and personalized budgeting suggestions.`,
    tech: ["React 18", "Vite 5", "Tailwind CSS", "Recharts", "Google OAuth", "Spring Boot 3.x (Java 21)", "Spring Security", "PostgreSQL", "JPA/Hibernate", "REST APIs", "Python FastAPI", "Docker", "Render", "Vercel"],
    github: "https://github.com/VJ-veshwikjain2215/rupeerakshak.git",
    demo: "",
    featured: true,
    image: "./assets/RupeeRakshak.png",
    screenshot: rupeeRakshakImg,
  },

  {
    id: "Civic Issue Reporter",
    title: "Civic Issue Reporter",
    subtitle: " — Smart Civic Complaint Management Platform",
    description: ` Full-stack civic issue reporting platform that enables citizens to report public infrastructure problems such as potholes,
                    garbage, water leakage, broken streetlights, and drainage issues. Features include secure user authentication, issue submission with
                    image upload and location details, real-time complaint tracking, status updates (Pending, In Progress, Resolved), role-based dashboards
                    for citizens and administrators, complaint categorization, search and filtering, and responsive UI for seamless access across devices.`,
    tech: ["React 18", "Vite 5", "Tailwind CSS", "Spring Boot 3.x (Java 21)", "Spring Security", "MySQL", "JWT Authentication", "RESTAPIs", "Maven"],
    github: "https://github.com/VJ-veshwikjain2215/Civic-Issue-Reporter",
      demo: "https://civic-issue-reporter-1-zxms.onrender.com/",
      featured: false,
      image: "./assets/Civic.png",
      screenshot: civicIssueImg,
  },

];

export const achievements = [
  {
    year: "2026",
    title: "Technocrats Innovation Challenge 2K26 — 36-Hour Hackathon",
    org: "Technocrats Institute of Technology (TIT), Bhopal",
    type: "Hackathon",
    detail:
      "Participated in a 36-hour nonstop hackathon with a 5-member team, building a platform to help women gig workers and freelancers track income, predict earnings, estimate taxes, and make data-driven financial decisions.",
  },
  {
    year: "2025",
    title: "Smart India Hackathon — Cleared Internal Round",
    org: "Government of India",
    type: "Hackathon",
    detail:
      "Built a backend for a Gamified Education platform as the lead developer of a 5-member team; reached the internal finals.",
  },
  {
    year: "2025",
    title: "Frontend Web Development Certification",
    org: "Code Cult",
    type: "Certification",
    detail:
      "Completed a frontend web development course and earned certification from Code Cult.",
  },
  {
    year: "2024",
    title: "C / C++ Programming Certification",
    org: "Universal Informatics",
    type: "Certification",
    detail:
      "Completed a certification course covering core C and C++ programming concepts, including data structures and memory management.",
},
];

export const contactInfo = {
  location: "Indore, Madhya Pradesh, India",
  email: profile.email,
  phone: profile.phone,
};


export const academicProgress = {
  intro:
    "SGPA, CGPA, and subjects for every semester — marksheets available to preview or download.",
  semesters: [
    {
      sem: 1,
      status: "Completed",
      sgpa: "6.19",
      cgpa: "6.19",
      subjects: ["Maths I", "Physics", "Basic Electrical", "C Programming", "Engineering Graphics"],
      marksheetUrl: "/marksheets/1st_sem.pdf",
    },
    {
      sem: 2,
      status: "Completed",
      sgpa: "5.86",
      cgpa: "6.04",
      subjects: ["Maths II", "Chemistry", "Data Structures", "OOP with Java", "Digital Electronics"],
      marksheetUrl: "/marksheets/2nd_sem.pdf",
    },
    {
      sem: 3,
      status: "Completed",
      sgpa: "6.00",
      cgpa: "6.02",
      subjects: ["DBMS", "OS", "Computer Networks", "Java Advanced", "Discrete Maths"],
      marksheetUrl: "/marksheets/3rd_sem.pdf",
    },
    {
      sem: 4,
      status: "Upcoming",
      sgpa: null,
      cgpa: null,
      subjects: [],
      marksheetUrl: "",
    },
  ],
};