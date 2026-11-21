export const INCLUDED_TRAININGS_BENEFIT_LABEL = "Treinamentos online gratuitos incluídos";

export function isIncludedTrainingsBenefitRow(label: string): boolean {
  return /treinamentos.*gratuitos.*inclu[ií]dos/i.test(label);
}

export function formatIncludedTrainingsCount(count: number, leadingPlus = false): string {
  return `${leadingPlus ? "+" : ""}${count} treinamentos`;
}

export function buildIncludedTrainingsBenefitCells(
  planSummary: Array<{ count: number }>,
): { p1: string; p2: string; p3: string } | null {
  if (planSummary.length < 3) {
    return null;
  }

  return {
    p1: formatIncludedTrainingsCount(planSummary[0].count),
    p2: formatIncludedTrainingsCount(planSummary[1].count),
    p3: formatIncludedTrainingsCount(planSummary[2].count, true),
  };
}
