
export enum Role {
  ENGINEERING = 'ENGINEERING',
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',
  QUALITY = 'QUALITY',
  SUPPLIER_USER = 'SUPPLIER_USER',
  ADMIN = 'ADMIN'
}

export enum Module {
  COMMAND = 'COMMAND',
  FORGE = 'FORGE',
  EXECUTE = 'EXECUTE',
  ATLAS = 'ATLAS'
}

export type Permission = 
  | 'VIEW_AUDIT_LOGS' 
  | 'MANAGE_TENANTS' 
  | 'PUBLISH_TDP' 
  | 'REVIEW_DEVIATIONS'
  | 'ISSUE_RFQ' 
  | 'AWARD_CONTRACT' 
  | 'APPROVE_SUPPLIER' 
  | 'SUBMIT_QUOTE'
  | 'APPROVE_QUALITY_GATE'
  | 'MANAGE_NCR';

export enum WorkPackageStatus {
  DRAFT = 'DRAFT',
  SCOPED = 'SCOPED',
  COMPLIANCE_CLEARED = 'COMPLIANCE_CLEARED',
  READY_FOR_RFQ = 'READY_FOR_RFQ',
  RELEASED = 'RELEASED',
  PUBLISHED = 'PUBLISHED',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED'
}

export enum RFQStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  AWARDED = 'AWARDED'
}

export enum GateStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  HOLD = 'HOLD'
}

export interface Part {
  id: string;
  partNumber: string;
  revision: string;
  name: string;
  quantityRequired: number;
  processRequired?: string;
  certType?: string;
}

export interface PartInstance {
  serialNumber: string;
  partId: string;
  currentFacility: string;
  status: GateStatus;
  currentGateId: string;
  history: ChainOfCustodyEvent[];
}

export interface ChainOfCustodyEvent {
  timestamp: string;
  location: string;
  action: string;
  actor: string;
}

export interface BuildGate {
  id: string;
  name: string;
  order: number;
  requirements: string[];
  status: GateStatus;
  approvedBy?: string;
  artifacts: string[];
}

export interface TechnicalDataPackage {
  id: string;
  version: string;
  files: Array<{ name: string; size: string; type: string }>;
  lastModified: string;
  baselineLocked?: boolean;
}

export interface WorkPackage {
  id: string;
  title: string;
  program: string;
  owner: string;
  status: WorkPackageStatus;
  tdp: TechnicalDataPackage;
  description: string;
  createdAt: string;
  parts: Part[];
  criticality?: 'LOW' | 'MEDIUM' | 'HIGH' | 'MISSION_CRITICAL';
  deliveryWindow?: string;
  destinationHub?: string;
}

export interface RFQ {
  id: string;
  workPackageId: string;
  title: string;
  status: RFQStatus;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  responses: RFQResponse[];
}

export interface RFQResponse {
  id: string;
  supplierId: string;
  supplierName: string;
  quoteAmount: number;
  leadTimeWeeks: number;
  technicalScore: number;
  status: 'PENDING' | 'REJECTED' | 'AWARDED';
  lineItems: Array<{ partNumber: string; unitPrice: number; quantity: number }>;
  nreCost: number;
  capacityCommitment: string;
  deviations: string[];
}

export interface NCR {
  id: string;
  instanceId: string;
  partNumber: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'HOLD' | 'CLOSED';
  disposition?: 'REWORK' | 'SCRAP' | 'USE_AS_IS';
}

export type AuditEventCategory = 'WORK_PACKAGE' | 'RFQ' | 'BUILD' | 'CERTIFICATION' | 'NCR' | 'SECURITY';
export type AuditObjectType = 'WP' | 'RFQ' | 'PART' | 'CERT' | 'USER' | 'SYSTEM';
export type AuditResult = 'SUCCESS' | 'FAILURE' | 'DENIED' | 'FLAGGED';

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  category: AuditEventCategory;
  objectType: AuditObjectType;
  objectId: string;
  action: string;
  result: AuditResult;
  tenantId: string;
  details?: string;
  changeSummary?: { before: string; after: string };
  complianceFlag?: 'ITAR' | 'CUI' | null;
  accessType?: 'VIEW' | 'DOWNLOAD' | 'UPLOAD' | 'EXECUTE';
  reason?: string;
  ipAddress?: string;
  resourceId?: string;
}

export type FacilityType = 'SUPPLIER' | 'ASGARD_FORGE';
export type FacilityStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  location: { 
    lat: number; 
    lng: number; 
    city: string; 
    state: string;
  };
  status: FacilityStatus;
  wipCount: number;
  otdScore: number;
  fpyScore: number;
  processFamilies: string[];
  certifications: string[];
  securityPosture: 'ITAR' | 'CUI' | 'PUBLIC';
  capacityUtilization: number;
  capacityOutlook: Array<{ timeframe: string; availability: number }>;
  activeConstraints: string[];
  equipment: Equipment[];
  // Execution data for readiness and risk
  blockingNcrCount: number;
  expiringCertCount: number;
  latePartCount: number;
  hasQualityHolds: boolean;
  historicalOtdScore: number;
}

export interface Equipment {
  name: string;
  envelope: string;
  quantity: number;
}

export interface WipFlow {
  id: string;
  from: string;
  to: string;
  quantity: number;
  status: 'ON_SCHEDULE' | 'AT_RISK' | 'DELAYED';
  workPackageId: string;
}

export interface Supplier {
  id: string;
  name: string;
  vettedStatus: 'APPROVED' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  certifications: string[];
  performanceScore: number;
  contactEmail: string;
  onboardingDate: string;
}

export type CertificationStatus = 'IN_PROGRESS' | 'HOLD' | 'CERTIFIED' | 'FAILED';
export type ReleaseStatus = 'RELEASED' | 'PENDING' | 'REJECTED';

export interface Certification {
  id: string;
  workPackageId: string;
  partNumber: string;
  serialNumber: string;
  revision: string;
  types: string[]; 
  location: string;
  currentGate: string;
  status: CertificationStatus;
  owner: string;
  eta: string;
  blockingReason?: string;
  daysBlocked?: number;
  dateCertified?: string;
  releaseStatus?: ReleaseStatus;
  gates: BuildGate[];
  artifacts: Array<{ name: string; type: string; status: 'APPROVED' | 'PENDING' | 'MISSING' }>;
}

export interface CertTemplate {
  id: string;
  partType: string;
  requiredCerts: string[];
  requiredArtifacts: string[];
  approvalRoles: Role[];
  locationConstraint: 'SUPPLIER_ONLY' | 'FORGE_ONLY' | 'ANY';
}
