/**
 * Departments used across the careers module. Keep this as the single source
 * of truth so vacancy forms and admin filters always offer the same options.
 */
export const DEPARTMENTS = [
  "HR",
  "ICT",
  "PROCUREMENT",
  "AUDIT",
  "MONITORING AND EVALUATION",
  "OPERATIONS",
  "MANAGING DIRECTOR's Office",
  "CORPORATE SERVICES",
  "ADMIN",
  "FINANCE",
  "COMMERCIAL SERVICES",
  "PR",
  "SECURITY",
] as const

export type Department = (typeof DEPARTMENTS)[number]

/**
 * Options for a department picker. When editing an existing vacancy that has a
 * legacy/free-text department, include it so the current value stays visible.
 */
export function getDepartmentOptions(current?: string | null): string[] {
  const options: string[] = [...DEPARTMENTS]
  const value = current?.trim()
  if (value && !options.includes(value)) options.unshift(value)
  return options
}
