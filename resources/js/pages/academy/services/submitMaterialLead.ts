import axios from "axios";
import { getAxiosValidationErrorMessage } from "@/lib/axiosErrorMessage";

interface SubmitMaterialLeadPayload {
  name: string;
  phone: string;
  email: string;
  material_slug: string;
}

interface SubmitMaterialLeadResponse {
  message: string;
  downloadUrl: string;
}

export async function submitMaterialLead(
  payload: SubmitMaterialLeadPayload,
): Promise<SubmitMaterialLeadResponse> {
  const { data } = await axios.post<SubmitMaterialLeadResponse>(
    "/academia-cab/materiais/lead",
    payload,
  );

  return data;
}

export function getMaterialLeadErrorMessage(error: unknown): string {
  return getAxiosValidationErrorMessage(
    error,
    "Não foi possível liberar o download. Tente novamente.",
  );
}

export function triggerFileDownload(url: string): void {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
