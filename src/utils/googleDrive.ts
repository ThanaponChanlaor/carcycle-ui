// Converts a Google Drive "share" link into a URL that actually renders as an
// <img> (the plain /file/d/.../view link returns an HTML page, not image bytes).
// Handles the share link formats Drive's "Get link" / "Copy link" buttons produce:
//   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//   https://drive.google.com/open?id=FILE_ID
//   https://drive.google.com/uc?id=FILE_ID&export=download
// Anything else (already-direct URLs, other hosts) is returned unchanged.
export function toDriveDirectImageUrl(url: string): string {
  const trimmed = url.trim()
  const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ?? trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (!match) return trimmed
  const fileId = match[1]
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
}
