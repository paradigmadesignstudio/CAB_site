import type { Plan } from "@/pages/plans/types";

export function planColumnShortLabel(plan: Pick<Plan, "name" | "columnLabel">): string {
  return plan.columnLabel ?? plan.name.replace(/^Plataforma\s+/i, "");
}

export function planGridColumnsClass(count: number): string {
  if (count <= 1) {
    return "md:grid-cols-1";
  }

  if (count === 2) {
    return "md:grid-cols-2";
  }

  // Tablet: 2 colunas; desktop largo: 3
  return "md:grid-cols-2 xl:grid-cols-3";
}
