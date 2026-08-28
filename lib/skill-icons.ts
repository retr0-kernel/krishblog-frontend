import {
  Activity,
  BarChart3,
  Box,
  Cloud,
  Code2,
  Cog,
  Database,
  GitBranch,
  Globe,
  Layers,
  LayoutGrid,
  Rocket,
  Search,
  Server,
  Share2,
  Shield,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";

const skillIconMap: Record<string, LucideIcon> = {
  Go: Code2,
  JavaScript: Code2,
  TypeScript: Code2,
  SQL: Database,
  gRPC: Zap,
  REST: Globe,
  GraphQL: Share2,
  Ent: Box,
  Redis: Database,
  PostgreSQL: Database,
  ClickHouse: Database,
  Kong: Shield,
  Nginx: Server,
  Linux: Terminal,
  Docker: Box,
  Kubernetes: Layers,
  AWS: Cloud,
  ArgoCD: Rocket,
  Jenkins: GitBranch,
  GitLab: GitBranch,
  ELK: Search,
  Grafana: BarChart3,
  Machinery: Cog,
  Prometheus: Activity,
  "Distributed systems": Layers,
  Observability: Activity,
  "Load testing": Zap,
  "Next.js": LayoutGrid,
  Express: Server,
  Turborepo: Layers,
  Prisma: Database,
  Flask: Server,
  Solidity: Code2,
};

const categoryIconMap: Record<string, LucideIcon> = {
  Languages: Code2,
  "Backend & Infra": Server,
  "SRE & DevOps": Cloud,
  Other: Cog,
};

const iconClass = "h-3.5 w-3.5";

export function getSkillIcon(name: string) {
  const Icon = skillIconMap[name] ?? Code2;
  return createElement(Icon, { className: iconClass });
}

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIconMap[category] ?? Cog;
}
