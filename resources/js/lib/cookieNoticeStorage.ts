const STORAGE_KEY = "cab:cookie-notice-acknowledged";

export function hasAcknowledgedCookieNotice(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function acknowledgeCookieNotice(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Navegador sem storage (modo privado restrito): ignora silenciosamente.
  }
}
