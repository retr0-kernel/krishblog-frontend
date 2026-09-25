export type PortfolioNavLink = {
  label: string;
  href: string;
  id: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
};

export type ProjectEntry = {
  name: string;
  subtitle: string;
  stack: string[];
  description: string;
  href?: string;
};

export type OSSEntry = {
  repo: string;
  title: string;
  description: string;
  href?: string;
};

export type SkillGroup = {
  category: string;
  skills: string[];
};

export type EducationEntry = {
  school: string;
  degree: string;
  period: string;
  detail?: string;
};

export const portfolioNavLinks: PortfolioNavLink[] = [
  { label: "About", href: "/#about", id: "about" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Projects", href: "/#projects", id: "projects" },
  { label: "OSS", href: "/#oss", id: "oss" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "Writing", href: "/#writing", id: "writing" },
];

export const portfolio = {
  hero: {
    name: "Krish Srivastava",
    title: "Software Development Engineer I",
    company: "PhysicsWallah",
    tagline:
      "Building PhysicsWallah’s Internal Developer Platform — onboarding, workflows, reliability, and tooling for engineers at scale.",
    email: "krish22092003@gmail.com",
    phone: "+91-807-6001-830",
    resumeUrl: "/resume.pdf",
    resumeDownloadName: "Krish-Srivastava-Resume.pdf",
    photo: "/photo.png",
    socials: {
      github: "https://github.com/retr0-kernel",
      twitter: "https://x.com/KrizzSrivastava",
      linkedin: "https://www.linkedin.com/in/krish-srivastava",
    },
  },
  about: {
    paragraphs: [
      "I'm a software engineer focused on backend systems, internal platforms, and developer experience.",
      "At PhysicsWallah I work on the Internal Developer Platform in Go, GraphQL, and PostgreSQL — service onboarding, GitLab and Kafka integrations, RBAC, and self-service workflows so product teams can ship without platform bottlenecks.",
      "Recent work includes a modular workflow engine for platform ops, migrating load testing from JMeter to k6 with Jenkins automation for Vishwas Diwas scale, a MongoDB → Aerospike migration POC, and consolidating legacy APIs into dedicated microservices.",
      "I've also built AI-assisted incident investigation (Zenduty, Prometheus, Elastic APM, Kubernetes, RAG over Confluence, OpenAI SDK) and internal Go libraries such as a k6 → Postman converter, with plans to open-source more of this tooling.",
      "Outside of work I contribute upstream in Go (redis/go-redis, hashicorp/go-set) and write on this blog about what I build.",
    ],
  },
  experience: [
    {
      company: "PhysicsWallah",
      role: "Software Development Engineer I",
      period: "Mar 2025 – Present",
      location: "On-site",
      highlights: [
        "Internal Developer Platform (Go, GraphQL, PostgreSQL): service onboarding, GitLab, Kafka, RBAC, and self-service workflows for engineering teams",
        "Designed and shipped a modular workflow engine for platform operations and automation",
        "Led JMeter → k6 migration and Jenkins-based load-test pipelines for Vishwas Diwas traffic scale",
        "MongoDB → Aerospike migration POC; consolidated scattered APIs into a dedicated microservice",
        "AI-assisted incident investigation integrating Zenduty, Prometheus, Elastic APM, Kubernetes, RAG over Confluence, and the OpenAI SDK",
        "Authored internal Go libraries (k6 → Postman converter; additional tooling planned for OSS release)",
      ],
    },
  ] satisfies ExperienceEntry[],
  projects: [
    {
      name: "dht",
      subtitle: "Distributed Hash Table",
      stack: ["Go", "PostgreSQL", "React"],
      description:
        "Multi-tenant KV store with eventual and strong consistency, consistent hashing (150 vnodes, 3 replicas), WAL, rate limiting, TTL, and gateway + replicator microservices.",
      href: "https://github.com/retr0-kernel/dht",
    },
    {
      name: "OneClick",
      subtitle: "Payments platform",
      stack: ["Next.js", "Express", "Turborepo", "Prisma", "Docker"],
      description:
        "Dual-app payments system with P2P transfers and bank API integration, built as a Turborepo monorepo with Dockerized services.",
      href: "https://github.com/retr0-kernel/OneClick",
    },
    {
      name: "SmartVerify",
      subtitle: "Smart contract analysis",
      stack: ["Next.js", "Flask", "Solidity"],
      description:
        "Upload smart contracts and receive ML-powered vulnerability reports — bridging web UI, Python analysis, and on-chain code.",
      href: "https://github.com/retr0-kernel/SmartVerify",
    },
  ] satisfies ProjectEntry[],
  openSource: [
    {
      repo: "redis/go-redis",
      title: "Cluster routing optimizations",
      description:
        "Refactored cmdFirstKeyPos using cached COMMAND INFO; lock-free Peek(); fewer cluster routing lookups on hot paths.",
      href: "https://github.com/redis/go-redis/pull/3804",
    },
    {
      repo: "hashicorp/go-set",
      title: "TreeSet.EqualSliceSet",
      description:
        "Added sort-and-compare equality for slice sets vs RB-tree allocation — cleaner API for set comparisons in Go.",
      href: "https://github.com/hashicorp/go-set/pull/110",
    },
  ] satisfies OSSEntry[],
  skills: [
    { category: "Languages", skills: ["Go", "JavaScript", "TypeScript", "SQL"] },
    {
      category: "Backend & Infra",
      skills: ["gRPC", "REST", "GraphQL", "Ent", "Redis", "PostgreSQL", "ClickHouse", "Kong", "Nginx"],
    },
    {
      category: "SRE & DevOps",
      skills: ["Linux", "Docker", "Kubernetes", "AWS", "ArgoCD", "Jenkins", "GitLab", "ELK", "Grafana"],
    },
    {
      category: "Other",
      skills: ["Machinery", "Prometheus", "Distributed systems", "Observability", "Load testing"],
    },
  ] satisfies SkillGroup[],
  education: [
    {
      school: "SRM University, AP",
      degree: "B.Tech Computer Science & Engineering",
      period: "2021 – 2025",
      detail: "CGPA 7.99",
    },
  ] satisfies EducationEntry[],
};
