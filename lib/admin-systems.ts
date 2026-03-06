/**
 * Admin system definitions. Add new systems here to extend the admin dashboard
 * and the "Manage Admins" role list without changing guard or API logic.
 */
export interface AdminSystem {
  key: string
  label: string
  role: string
  path: string
  description?: string
}

export const ADMIN_SYSTEMS: AdminSystem[] = [
  {
    key: "hr",
    label: "HR System",
    role: "admin_hr",
    path: "/admin/hr",
    description: "Careers, vacancies, and job applications",
  },
  {
    key: "procurement",
    label: "Procurement System",
    role: "admin_prcmt",
    path: "/admin/procurement",
    description: "Tenders and supplier applications",
  },
  // Add future systems here, e.g.:
  // { key: "finance", label: "Finance System", role: "admin_finance", path: "/admin/finance", description: "..." },
]

/** Role that has access to all systems (super admin). */
export const SUPER_ADMIN_ROLE = "admin"

/** All roles that are "system admins" (limited to one system). Used for listing and assigning. */
export const SYSTEM_ADMIN_ROLES = ADMIN_SYSTEMS.map((s) => s.role)

export function getSystemByRole(role: string): AdminSystem | undefined {
  return ADMIN_SYSTEMS.find((s) => s.role === role)
}

export function getSystemByKey(key: string): AdminSystem | undefined {
  return ADMIN_SYSTEMS.find((s) => s.key === key)
}

export function isSystemAdminRole(role: string): boolean {
  return SYSTEM_ADMIN_ROLES.includes(role)
}
