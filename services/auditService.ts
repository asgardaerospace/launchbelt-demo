
import { AuditEntry, Role } from '../types';

const MOCK_LOGS: AuditEntry[] = [
  {
    id: 'TXN-882194',
    timestamp: '2023-11-20T14:32:01Z',
    user: 'Sarah Connor',
    role: Role.ENGINEERING,
    category: 'WORK_PACKAGE',
    objectType: 'WP',
    objectId: 'WP-7721',
    action: 'LOCK_BASELINE',
    result: 'SUCCESS',
    tenantId: 'LB-PRIMARY-01',
    details: 'Technical Data Package baseline locked for production release.',
    complianceFlag: 'ITAR',
    changeSummary: { before: 'Status: DRAFT', after: 'Status: RELEASED' },
    ipAddress: '192.168.1.45'
  },
  {
    id: 'TXN-882195',
    timestamp: '2023-11-20T15:10:12Z',
    user: 'James Holden',
    role: Role.SUPPLY_CHAIN,
    category: 'RFQ',
    objectType: 'RFQ',
    objectId: 'RFQ-8812',
    action: 'ISSUE_RFQ',
    result: 'SUCCESS',
    tenantId: 'LB-PRIMARY-01',
    details: 'RFQ issued to 3 vetted network nodes.',
    complianceFlag: 'CUI',
    ipAddress: '192.168.1.92'
  },
  {
    id: 'TXN-882196',
    timestamp: '2023-11-20T16:05:44Z',
    user: 'Alex Rivera',
    role: Role.ADMIN,
    category: 'SECURITY',
    objectType: 'SYSTEM',
    objectId: 'SYS-AUTH',
    action: 'LOGIN',
    result: 'SUCCESS',
    tenantId: 'LB-PRIMARY-01',
    ipAddress: '10.0.4.12'
  },
  {
    id: 'TXN-882197',
    timestamp: '2023-11-20T16:20:00Z',
    user: 'Unauthorized_User',
    role: Role.SUPPLIER_USER,
    category: 'SECURITY',
    objectType: 'WP',
    objectId: 'WP-7721',
    action: 'DOWNLOAD_TDP',
    result: 'DENIED',
    tenantId: 'LB-PRIMARY-01',
    reason: 'Insufficient clearance for ITAR resource.',
    accessType: 'DOWNLOAD',
    complianceFlag: 'ITAR',
    ipAddress: '172.16.254.1'
  },
  {
    id: 'TXN-882198',
    timestamp: '2023-11-19T09:00:00Z',
    user: 'Quality_Lead',
    role: Role.QUALITY,
    category: 'CERTIFICATION',
    objectType: 'CERT',
    objectId: 'CERT-2023-003',
    action: 'APPROVE_CERT',
    result: 'SUCCESS',
    tenantId: 'LB-PRIMARY-01',
    details: 'Final quality certification approved for composite shielding.',
    complianceFlag: 'CUI'
  },
  {
    id: 'TXN-882199',
    timestamp: '2023-11-18T11:45:30Z',
    user: 'R. Vance',
    role: Role.QUALITY,
    category: 'NCR',
    objectType: 'PART',
    objectId: 'SN-002',
    action: 'OPEN_NCR',
    result: 'FLAGGED',
    tenantId: 'LB-PRIMARY-01',
    details: 'Non-conformance report opened: CMM calibration out of date.',
    reason: 'Tolerance Breach',
    ipAddress: '192.168.5.12'
  }
];

const _logs: AuditEntry[] = [...MOCK_LOGS];

export const logAction = async (user: string, action: string, resource: string, details?: string) => {
  const entry: AuditEntry = {
    id: 'TXN-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    timestamp: new Date().toISOString(),
    user,
    role: Role.ADMIN, // Default for simple logging call
    category: 'SECURITY',
    objectType: 'SYSTEM',
    objectId: resource,
    action,
    result: 'SUCCESS',
    tenantId: 'LB-PRIMARY-01',
    details
  };
  
  _logs.unshift(entry);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('audit-log-updated', { detail: entry }));
  }
  return entry;
};

export const getAuditLogs = () => [..._logs];
