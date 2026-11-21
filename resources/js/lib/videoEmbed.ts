export function getVideoEmbedUrl(url: string): string | null {
  const trimmed = url.trim();

  if (!trimmed) {
    return null;
  }

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes("youtube.com/embed") || trimmed.includes("player.vimeo.com")) {
    return trimmed;
  }

  return null;
}

export function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url.trim());
}
