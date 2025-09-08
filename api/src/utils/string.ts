export function toUname(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/[\s_]/g, '');
}

export function splitRoomSessionId(roomSessionId: string) {
  const parts = roomSessionId.split('-');
  if (parts.length === 1) {
    return [parts[0], null];
  }
  return parts;
}

export function getYear(email: string): string {
  return email.split('@')[0].slice(-2);
}

export function getUg(year: string): number {
  return 5 - (parseInt(year) - 21);
}
