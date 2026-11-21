import {
  Award,
  BookOpen,
  Calculator,
  Calendar,
  Camera,
  Database,
  FileSignature,
  Headset,
  MapPin,
  Milestone,
  Settings2,
  ShieldCheck,
  Smartphone,
  Target,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Calculator,
  Calendar,
  Camera,
  Database,
  FileSignature,
  Headset,
  MapPin,
  Milestone,
  Settings2,
  ShieldCheck,
  Smartphone,
  Target,
  TrendingUp,
  Users,
  Wrench,
};

export function resolveLucideIcon(name: string, fallback: LucideIcon = Target): LucideIcon {
  return ICONS[name] ?? fallback;
}
