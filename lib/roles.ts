import {
  Crown,
  Eye,
  PencilLine,
  Pen,
  Shield,
  ShieldCheck,
  ShieldHalf,
  User as UserIcon,
  type LucideIcon
} from "lucide-react";
import type { Role } from "@/types";

export type RoleInfo = {
  id: Role;
  label: string;
  short: string;
  level: number;
  group: "audience" | "editorial" | "admin";
  icon: LucideIcon;
  tone: string;
  capabilities: string[];
};

export const ROLES: RoleInfo[] = [
  {
    id: "guest",
    label: "Guest",
    short: "Browse without an account",
    level: 0,
    group: "audience",
    icon: Eye,
    tone: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    capabilities: ["Browse news", "Search articles", "View categories"]
  },
  {
    id: "user",
    label: "Reader",
    short: "Personalized reader",
    level: 10,
    group: "audience",
    icon: UserIcon,
    tone: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
    capabilities: [
      "Save articles & collections",
      "Follow topics and publishers",
      "Receive personalized alerts",
      "Comment & like"
    ]
  },
  {
    id: "premium",
    label: "Premium",
    short: "Ad-free with advanced AI",
    level: 20,
    group: "audience",
    icon: Crown,
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    capabilities: [
      "Ad-free experience",
      "Unlimited bookmarks",
      "Advanced AI insights",
      "Voice library access"
    ]
  },
  {
    id: "reporter",
    label: "Reporter",
    short: "Submits stories for review",
    level: 30,
    group: "editorial",
    icon: Pen,
    tone: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    capabilities: [
      "Draft and submit stories",
      "Upload images and source links",
      "Track submission status",
      "Receive editor feedback"
    ]
  },
  {
    id: "editor",
    label: "Editor",
    short: "Reviews and publishes",
    level: 40,
    group: "editorial",
    icon: PencilLine,
    tone: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
    capabilities: [
      "Review reporter submissions",
      "Verify content and fact-check",
      "Manage featured stories",
      "Approve or reject drafts"
    ]
  },
  {
    id: "sub-admin",
    label: "Sub Admin",
    short: "Scoped administrative access",
    level: 60,
    group: "admin",
    icon: ShieldHalf,
    tone: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
    capabilities: [
      "Moderate comments & reports",
      "Manage assigned categories",
      "View limited analytics",
      "Suspend / unsuspend readers"
    ]
  },
  {
    id: "admin",
    label: "Admin",
    short: "Full content & user management",
    level: 80,
    group: "admin",
    icon: Shield,
    tone: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
    capabilities: [
      "Manage all users & roles",
      "Manage publishers & categories",
      "Full analytics dashboard",
      "Audit logs and reports"
    ]
  },
  {
    id: "super-admin",
    label: "Super Admin",
    short: "Highest privileges, system config",
    level: 100,
    group: "admin",
    icon: ShieldCheck,
    tone: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-200",
    capabilities: [
      "Everything Admin can do",
      "Promote / demote any role (including Admin)",
      "System configuration & feature flags",
      "Billing and platform-wide controls"
    ]
  }
];

export const getRole = (id: Role): RoleInfo =>
  ROLES.find((r) => r.id === id) ?? ROLES[0];

export const isAdminRole = (id: Role) =>
  id === "admin" || id === "sub-admin" || id === "super-admin";

export const isEditorialRole = (id: Role) =>
  id === "reporter" || id === "editor";

export const canModerate = (id: Role) => isAdminRole(id) || id === "editor";
