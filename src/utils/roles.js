export const ADMIN_ROLES = ["admin", "super-admin"];

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

export const getDashboardPath = (role) => {
  if (isAdminRole(role)) return "/admin-dashboard";
  if (role === "teacher") return "/teacher-dashboard";
  if (role === "parent") return "/parent-dashboard";
  return "/student-dashboard";
};
