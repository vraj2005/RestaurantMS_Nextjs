export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const decodeRoleFromToken = (token: string): string | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded?.data?.UserRole || null;
  } catch (err) {
    return null;
  }
};

export const getUserFromToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded?.data || null;
  } catch (err) {
    return null;
  }
};

export const hasRole = (allowedRoles: string[], userRole?: string): boolean => {
  if (!userRole) return false;
  return allowedRoles.map(r => r.toLowerCase()).includes(userRole.toLowerCase());
};
