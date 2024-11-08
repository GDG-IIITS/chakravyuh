export function normalizeToHttps(url: string): string {
  // prepend https:// if either of http:// or https:// protocols not present
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url.replace(/^(http:\/\/)?/, '')}`;
  }
  return url;
}
