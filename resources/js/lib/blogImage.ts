export function isBlogImageUrl(image: string): boolean {
  return (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/")
  );
}
