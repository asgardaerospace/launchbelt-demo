
import { Role, Permission } from '../types';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    'VIEW_AUDIT_LOGS', 'MANAGE_TENANTS', 'PUBLISH_TDP', 'REVIEW_DEVIATIONS',
    'ISSUE_RFQ', 'AWARD_CONTRACT', 'APPROVE_SUPPLIER', 'APPROVE_QUALITY_GATE', 'MANAGE_NCR'
  ],
  [Role.ENGINEERING]: ['PUBLISH_TDP', 'REVIEW_DEVIATIONS', 'APPROVE_QUALITY_GATE'],
  [Role.SUPPLY_CHAIN]: ['ISSUE_RFQ', 'AWARD_CONTRACT', 'APPROVE_SUPPLIER'],
  [Role.QUALITY]: ['APPROVE_QUALITY_GATE', 'MANAGE_NCR', 'REVIEW_DEVIATIONS'],
  [Role.SUPPLIER_USER]: ['SUBMIT_QUOTE']
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const getCurrentUser = (role: Role) => {
  return {
    email: `alex.${role.toLowerCase()}@launchbelt.io`,
    role,
    tenantId: 'LB-PRIMARY-01'
  };
};
