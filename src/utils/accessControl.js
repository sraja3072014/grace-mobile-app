export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  PASTOR: 'PASTOR',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER'
};

export const PERMISSIONS = {
  MANAGE_MEMBERS: [ROLES.SUPER_ADMIN, ROLES.PASTOR],
  VIEW_FINANCE_DESK: [ROLES.SUPER_ADMIN, ROLES.PASTOR],
  VIEW_GIVING_PORTAL: [ROLES.SUPER_ADMIN, ROLES.PASTOR, ROLES.LEADER, ROLES.MEMBER],
  CONVERT_VISITOR: [ROLES.SUPER_ADMIN, ROLES.PASTOR, ROLES.LEADER]
};

const TAB_PERMISSIONS = {
  finance: 'VIEW_GIVING_PORTAL',
  members: 'VIEW_GIVING_PORTAL',
  visitors: 'CONVERT_VISITOR'
};

const RESTRICTED_SUB_TABS = {
  finance: 'VIEW_FINANCE_DESK',
  payroll: 'VIEW_FINANCE_DESK',
  income: 'VIEW_FINANCE_DESK',
  expense: 'VIEW_FINANCE_DESK',
  staff: 'MANAGE_MEMBERS'
};

export function hasPermission(role, permission) {
  return Boolean(PERMISSIONS[permission]?.includes(role));
}

export function canAccessTab(role, tabId) {
  const permission = TAB_PERMISSIONS[tabId];
  return permission ? hasPermission(role, permission) : true;
}

export function isRestrictedSubTab(role, subTabId) {
  const permission = RESTRICTED_SUB_TABS[subTabId];
  return permission ? !hasPermission(role, permission) : false;
}
