import axios from "axios";

interface LaravelValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

export function getAxiosValidationErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!axios.isAxiosError<LaravelValidationError>(error)) {
    return fallbackMessage;
  }

  const response = error.response?.data;

  if (response?.errors) {
    const firstField = Object.values(response.errors)[0];

    if (firstField?.[0]) {
      return firstField[0];
    }
  }

  if (response?.message) {
    return response.message;
  }

  return fallbackMessage;
}
