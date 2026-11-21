export interface TrainingRow {
  id?: number;
  n: string;
  label: string;
  image?: string;
  imageMobile?: string | null;
  lessonCount?: number;
  languages?: string[];
  p1: boolean;
  p2: boolean;
  p3: boolean;
}

export interface TrainingGroup {
  category: string;
  rows: TrainingRow[];
}

export interface TrainingDetailItem extends TrainingRow {
  category: string;
}
