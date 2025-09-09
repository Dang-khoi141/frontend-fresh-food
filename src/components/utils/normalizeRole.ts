export function normalizeRole(role?: string): string | undefined {
  if (!role) return undefined;
  return role.trim().toLowerCase();
}
