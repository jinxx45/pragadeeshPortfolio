export const profile = {
  name: "Pragadeeshvaran S",
  role: "Full stack & AI engineer",
  location: "Chennai, India",
  email: "pragadeeshh45@gmail.com",
  phone: "+919384978015",
  phoneLabel: "+91 93849 78015",
  linkedin: "https://www.linkedin.com/in/pragadeeshvarans/",
  github: "https://github.com/jinxx45",
  intro:
    "I build agents that do real work. I built a LangGraph support agent that reads runbooks and fixes problems for 5,000+ people, backed by Java and Python microservices.",
};

export const experience = [
  {
    company: "Workday",
    role: "SDE 2, Full Stack & AI Engineer",
    period: "Apr 2026 – now",
    place: "Chennai",
    points: [
      "Built a LangGraph ReAct agent in Python and FastAPI with RAG over Confluence runbooks (OpenSearch, Claude on AWS Bedrock). It diagnoses issues and runs the documented fix, resolving about half of all support requests with 80% CSAT.",
      "Took the repetitive Slack triage off the SRE team. New issues go to engineers, and every new runbook teaches the agent another fix. Feedback, evals and traces live in LangSmith.",
      "Wrote MCP servers for 8 microservices, exposing 40+ tools that agents call directly.",
      "Moved a whole React codebase from JavaScript to TypeScript in under two months with no major regressions, and shipped the app as a Chrome extension.",
    ],
  },
  {
    company: "NIQ",
    role: "Full Stack Developer",
    period: "Feb 2022 – Mar 2026",
    place: "Chennai",
    points: [
      "Designed REST APIs in Java and Spring Boot that handle 50,000+ requests a minute at 99.8% uptime for 10,000+ users.",
      "Cut PL/SQL query times in half and frontend load times by a quarter.",
      "Raised JUnit coverage by 40%, which noticeably reduced production bugs.",
    ],
  },
  {
    company: "Physifit",
    role: "Freelance Developer",
    period: "Jun 2020",
    place: "Remote",
    points: [
      "Built an appointment app in React and Spring Boot with Stripe payments and Twilio reminders that cut no-shows by 15%.",
    ],
  },
];

export const projects = [
  {
    name: "Split Genie",
    stack: "LangGraph, React, Postgres",
    status: "Live",
    href: "https://split-rupya.onrender.com",
    text: "A bill-splitting app driven by a LangGraph agent, built mobile-first.",
    next: "In progress: a Spring Boot MCP server so Claude Desktop and Cursor can add expenses and settle up, plus an eval pipeline for the agent.",
  },
  {
    name: "AI Trip Planner",
    stack: "Java, Spring AI, LangGraph4j, React",
    status: "In progress",
    href: "https://github.com/jinxx45/travel-tracker",
    text: "Turning my Travel Tracker into a planner: an agent turns saved places into day-by-day itineraries using maps and weather tools, and asks before saving anything.",
  },
];

export const skills = [
  {
    group: "AI & agents",
    note: "What I use to build agents that people rely on.",
    items: ["LangGraph", "LangGraph4j", "LangChain", "LangSmith", "Spring AI", "MCP", "RAG", "ReAct agents", "LLM evals", "Prompt engineering", "Claude on Bedrock", "OpenSearch vector search"],
  },
  {
    group: "Backend",
    note: "Services that stay up under load.",
    items: ["Java", "Spring Boot", "Spring Data JPA", "Spring Batch", "Python", "FastAPI", "Kafka", "Event-driven systems", "Microservices", "REST APIs", "EhCache", "Elasticsearch", "Node.js", "JUnit", "Mockito"],
  },
  {
    group: "Frontend",
    note: "Interfaces people use every day.",
    items: ["TypeScript", "React", "Angular", "Next.js", "Redux", "Tailwind CSS", "Chrome extensions"],
  },
  {
    group: "Data",
    note: "Relational first, NoSQL when it fits.",
    items: ["PostgreSQL", "MySQL", "Oracle SQL", "PL/SQL", "MongoDB", "DynamoDB", "AWS RDS"],
  },
  {
    group: "Cloud & DevOps",
    note: "Shipping and running it.",
    items: ["AWS (EC2, S3, DynamoDB, Bedrock)", "GCP", "Azure", "Docker", "Kubernetes", "Helm", "Jenkins", "Maven", "Git", "CI/CD", "Grafana", "ELK", "Micrometer", "OpenTelemetry"],
  },
];

export const facts = [
  ["Role", "SDE 2, Full Stack & AI Engineer at Workday"],
  ["Focus", "AI agents, MCP servers, microservices"],
  ["Stack", "Java, Spring Boot, Python, FastAPI, LangGraph, LangSmith, TypeScript, React, Angular"],
  ["Experience", "Nearly 5 years"],
  ["Location", "Chennai, India"],
];
