import axios from "axios";
import type { TrainingGroup } from "@/pages/plans/components/training-types";

interface TrainingsTableGroupsResponse {
  groups: TrainingGroup[];
}

export async function fetchTrainingsTableGroups(): Promise<TrainingGroup[]> {
  const { data } = await axios.get<TrainingsTableGroupsResponse>("/planos/treinamentos");

  return data.groups;
}
