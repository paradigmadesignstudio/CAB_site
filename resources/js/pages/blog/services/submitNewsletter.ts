import axios from "axios";
import { getAxiosValidationErrorMessage } from "@/lib/axiosErrorMessage";

interface SubmitNewsletterPayload {
  name: string;
  email: string;
  phone?: string;
  tipo: string;
}

interface SubmitNewsletterResponse {
  message: string;
}

export async function submitBlogNewsletter(
  payload: SubmitNewsletterPayload,
): Promise<SubmitNewsletterResponse> {
  const { data } = await axios.post<SubmitNewsletterResponse>("/blog/newsletter", payload);

  return data;
}

export function getNewsletterErrorMessage(error: unknown): string {
  return getAxiosValidationErrorMessage(
    error,
    "Não foi possível enviar seus dados. Tente novamente.",
  );
}
