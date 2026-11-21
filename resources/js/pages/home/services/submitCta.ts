import axios from "axios";
import { getAxiosValidationErrorMessage } from "@/lib/axiosErrorMessage";

interface SubmitCtaPayload {
  name: string;
  phone: string;
  email: string;
}

interface SubmitCtaResponse {
  message: string;
}

export async function submitHomeCta(payload: SubmitCtaPayload): Promise<SubmitCtaResponse> {
  const { data } = await axios.post<SubmitCtaResponse>("/home/cta", payload);

  return data;
}

export function getCtaErrorMessage(error: unknown): string {
  return getAxiosValidationErrorMessage(
    error,
    "Não foi possível enviar seus dados. Tente novamente.",
  );
}
