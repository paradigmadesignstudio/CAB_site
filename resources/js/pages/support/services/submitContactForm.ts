import axios from "axios";
import { getAxiosValidationErrorMessage } from "@/lib/axiosErrorMessage";

interface SubmitContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface SubmitContactFormResponse {
  message: string;
}

export async function submitSupportContact(
  payload: SubmitContactFormPayload,
): Promise<SubmitContactFormResponse> {
  const { data } = await axios.post<SubmitContactFormResponse>("/suporte/contato", payload);

  return data;
}

export function getContactFormErrorMessage(error: unknown): string {
  return getAxiosValidationErrorMessage(
    error,
    "Não foi possível enviar sua mensagem. Tente novamente.",
  );
}
