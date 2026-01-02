
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  FlaskConical, 
  Clock, 
  ChevronRight, 
  X, 
  Download, 
  History, 
  ClipboardList, 
  Search,
  Lock,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  User,
  ExternalLink,
  Activity,
  FileCheck,
  Zap,
  Box,
  Target,
  MapPin,
  Hammer
} from 'lucide-react';
import { 
  Certification, 
  CertificationStatus, 
  CertTemplate, 
  Role, 
  GateStatus 
} from '../types';

// Synchronized mock data for Dashboard count integrity (7 IN_PROGRESS)
const MOCK_CERTS: Certification[] = [
  { 
    id: 'C1', 
    workPackageId: 'WP-7721', 
    partNumber: '7721-001', 
    serialNumber: 'SN-001', 
    revision: 'B', 
    types: ['AS9100'], 
    location: 'Forge - Central', 
    currentGate: 'FAI', 
    status: 'IN_PROGRESS', 
    owner: 'R. Vance', 
    eta: 'Today 17:00', 
    gates: [
      { id: 'g1', name: 'Material Verification', order: 1, requirements: ['MTR Approval', 'Chemical Assay'], status: GateStatus.COMPLETED, artifacts: ['MTR_S1.pdf'] },
      { id: 'g2', name: 'Dimensional Check', order: 2, requirements: ['CMM Program Validated'], status: GateStatus.COMPLETED, artifacts: ['CMM_Rpt_001.csv'] },
      { id: 'g3', name: 'Non-Destructive Testing', order: 3, requirements: ['Ultrasonic Scan'], status: GateStatus.IN_PROGRESS, artifacts: [] },
      { id: 'g4', name: 'Final Release Audit', order: 4, requirements: ['QA Final Sign-off'], status: GateStatus.PENDING, artifacts: [] }
    ], 
    artifacts: [
       { name: 'Material_MTR_LBX.pdf', type: 'Certificate', status: 'APPROVED' },
       { name: 'CMM_Measurement_Log.csv', type: 'Measurement', status: 'APPROVED' }
    ] 
  },
  { id: 'C2', workPackageId: 'WP-7721', partNumber: '7721-001', serialNumber: 'SN-002', revision: 'B', types: ['AS9100'], location: 'Apex', currentGate: 'Process Cert', status: 'HOLD', owner: 'J. Smith', eta: 'Nov 15', blockingReason: 'Calibration', daysBlocked: 4, gates: [], artifacts: [] },
  { id: 'C3', workPackageId: 'WP-8802', partNumber: '8802-105', serialNumber: 'SN-402', revision: 'A', types: ['Composite'], location: 'Asgard Forge', currentGate: 'Final', status: 'CERTIFIED', owner: 'S. Connor', eta: 'Done', dateCertified: 'Oct 30', releaseStatus: 'RELEASED', gates: [], artifacts: [] },
  { id: 'C4', workPackageId: 'WP-9011', partNumber: '9011-042', serialNumber: 'SN-901', revision: 'C', types: ['AS9100'], location: 'Great Lakes', currentGate: 'Post-Processing', status: 'IN_PROGRESS', owner: 'M. Chen', eta: 'Nov 22', gates: [], artifacts: [
    { name: 'Heat_Treat_Log.pdf', type: 'Special Process', status: 'APPROVED' }
  ] },
  { id: 'C5', workPackageId: 'WP-2047', partNumber: '2047-010', serialNumber: 'SN-201', revision: 'A', types: ['NDI'], location: 'Pacific North', currentGate: 'Ultrasonic', status: 'IN_PROGRESS', owner: 'R. Vance', eta: 'Nov 18', gates: [], artifacts: [] },
  { id: 'C6', workPackageId: 'WP-1122', partNumber: '1122-005', serialNumber: 'SN-112', revision: 'D', types: ['AS9100'], location: 'Apex', currentGate: 'Load Test', status: 'IN_PROGRESS', owner: 'J. Smith', eta: 'Nov 25', gates: [], artifacts: [] },
  { id: 'C7', workPackageId: 'WP-5566', partNumber: '5566-088', serialNumber: 'SN-556', revision: 'B', types: ['ITAR'], location: 'Great Lakes', currentGate: 'Weld Insp', status: 'IN_PROGRESS', owner: 'M. Chen', eta: 'Nov 19', gates: [], artifacts: [] },
  { id: 'C8', workPackageId: 'WP-7721', partNumber: '7721-003', serialNumber: 'SN-003', revision: 'B', types: ['AS9100'], location: 'Pacific North', currentGate: 'FAI', status: 'IN_PROGRESS', owner: 'R. Vance', eta: 'Nov 20', gates: [], artifacts: [] },
  { id: 'C9', workPackageId: 'WP-8802', partNumber: '8802-106', serialNumber: 'SN-403', revision: 'A', types: ['Composite'], location: 'Asgard Forge', currentGate: 'Cure Log', status: 'IN_PROGRESS', owner: 'S. Connor', eta: 'Nov 21', gates: [], artifacts: [] },
  { id: 'C10', workPackageId: 'WP-4433', partNumber: '4433-012', serialNumber: 'SN-443', revision: 'A', types: ['AS9100'], location: 'Apex', currentGate: 'Design Rev', status: 'HOLD', owner: 'Quality Lead', eta: 'TBD', blockingReason: 'Spec Gap', daysBlocked: 2, gates: [], artifacts: [] },
  { id: 'C11', workPackageId: 'WP-9011', partNumber: '9011-043', serialNumber: 'SN-902', revision: 'C', types: ['NDI'], location: 'Great Lakes', currentGate: 'X-Ray', status: 'CERTIFIED', owner: 'M. Chen', eta: 'Done', dateCertified: 'Nov 10', releaseStatus: 'RELEASED', gates: [], artifacts: [] },
  { id: 'C12', workPackageId: 'WP-3321', partNumber: '3321-001', serialNumber: 'SN-332', revision: 'B', types: ['ITAR'], location: 'Pacific North', currentGate: 'ITAR Release', status: 'CERTIFIED', owner: 'R. Vance', eta: 'Done', dateCertified: 'Nov 12', releaseStatus: 'PENDING', gates: [], artifacts: [] },
];

const MOCK_TEMPLATES: CertTemplate[] = [
  { id: 'T-CNC-01', partType: 'CNC Precision Part', requiredCerts: ['AS9100', 'ITAR'], requiredArtifacts: ['MTR', 'CMM Report', 'FAIR'], approvalRoles: [Role.QUALITY, Role.ENGINEERING], locationConstraint: 'ANY' },
  { id: 'T-CMP-02', partType: 'Composite Shielding', requiredCerts: ['Composite Cert', 'ITAR'], requiredArtifacts: ['Material Batch', 'Cure Log', 'Ultrasonic'], approvalRoles: [Role.QUALITY], locationConstraint: 'FORGE_ONLY' }
];

type QualitySubView = 'IN_PROGRESS' | 'HOLDS' | 'REGISTRY' | 'TEMPLATES';

interface QualityCertsProps {
  initialSubView?: QualitySubView;
  initialCertId?: string;
  initialViewMode?: 'LIST' | 'EXECUTION' | 'RECORD';
  focusArea?: 'ACTIONS' | 'ARTIFACTS';
}

const QualityCerts: React.FC<QualityCertsProps> = ({ initialSubView, initialCertId, initialViewMode, focusArea }) => {
  const [activeSubView, setActiveSubView] = useState<QualitySubView>(initialSubView || 'IN_PROGRESS');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [viewState, setViewState] = useState<'LIST' | 'EXECUTION' | 'RECORD'>(initialViewMode || 'LIST');

  useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
    if (initialCertId) {
      const found = MOCK_CERTS.find(c => c.id === initialCertId);
      if (found) {
        setSelectedCert(found);
        setViewState(initialViewMode || (found.status === 'CERTIFIED' ? 'RECORD' : 'EXECUTION'));
      }
    } else if (!initialCertId && !initialViewMode) {
        setViewState('LIST');
    }
  }, [initialSubView, initialCertId, initialViewMode]);

  const handleRowClick = (cert: Certification) => {
    setSelectedCert(cert);
    if (cert.status === 'CERTIFIED') {
      setViewState('RECORD');
    } else {
      setViewState('EXECUTION');
    }
  };

  const renderContent = () => {
    switch (activeSubView) {
      case 'IN_PROGRESS': return <CertTable data={MOCK_CERTS.filter(c => c.status === 'IN_PROGRESS')} onRowClick={handleRowClick} />;
      case 'HOLDS': return <HoldsTable data={MOCK_CERTS.filter(c => c.status === 'HOLD')} onRowClick={handleRowClick} />;
      case 'REGISTRY': return <RegistryTable data={MOCK_CERTS.filter(c => c.status === 'CERTIFIED')} onRowClick={handleRowClick} />;
      case 'TEMPLATES': return <TemplatesTable data={MOCK_TEMPLATES} />;
    }
  };

  if (viewState === 'EXECUTION' && selectedCert) {
    return <CertificationExecutionView cert={selectedCert} onBack={() => setViewState('LIST')} focusArea={focusArea} />;
  }

  if (viewState === 'RECORD' && selectedCert) {
    return <CertificationRecord cert={selectedCert} onBack={() => setViewState('LIST')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 italic">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Quality & Certifications
          </h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Operational Certification Tracking & Registry</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-2xl">
          {[
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'HOLDS', label: 'Queue & Holds' },
            { id: 'REGISTRY', label: 'Registry' },
            { id: 'TEMPLATES', label: 'Templates' },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveSubView(view.id as QualitySubView)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeSubView === view.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mx-2">
        <div className="p-6 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-tighter text-sm italic">
            {activeSubView === 'IN_PROGRESS' && `Active Certifications Backlog (${MOCK_CERTS.filter(c => c.status === 'IN_PROGRESS').length} items)`}
            {activeSubView === 'HOLDS' && "Blocked or At-Risk Certifications"}
            {activeSubView === 'REGISTRY' && "Certified and Released Parts Archive"}
            {activeSubView === 'TEMPLATES' && "Certification Protocols and Requirements"}
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search serials, parts..." 
                className="bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 hover:bg-slate-700">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

const CertTable: React.FC<{ data: Certification[], onRowClick: (c: Certification) => void }> = ({ data, onRowClick }) => (
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-800/30 border-b border-slate-800">
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">WP / Part</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Serial/Lot</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Type(s)</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Gate</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Proj. Finish</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-800">
      {data.map(c => (
        <tr key={c.id} onClick={() => onRowClick(c)} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
          <td className="px-6 py-6">
            <p className="text-xs font-bold text-white group-hover:text-primary uppercase">{c.partNumber}</p>
            <p className="text-[10px] text-slate-500 mono font-bold">{c.workPackageId}</p>
          </td>
          <td className="px-6 py-6 mono text-xs text-slate-300 font-bold uppercase">{c.serialNumber}</td>
          <td className="px-6 py-6 text-center">
            <div className="flex gap-1 flex-wrap justify-center">
              {c.types.map(t => <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-slate-400 border border-slate-700 uppercase tracking-tighter">{t}</span>)}
            </div>
          </td>
          <td className="px-6 py-6 text-xs font-bold text-slate-400 italic uppercase tracking-tighter">{c.location}</td>
          <td className="px-6 py-6">
             <p className="text-xs font-bold text-primary italic uppercase tracking-tight">{c.currentGate}</p>
          </td>
          <td className="px-6 py-6 text-xs font-bold text-slate-400 text-right">{c.eta}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const HoldsTable: React.FC<{ data: Certification[], onRowClick: (c: Certification) => void }> = ({ data, onRowClick }) => (
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-800/30 border-b border-slate-800">
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Part / Serial</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cert Type</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Blocking Reason</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Owner</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Days Blocked</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-800">
      {data.map(c => (
        <tr key={c.id} onClick={() => onRowClick(c)} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
          <td className="px-6 py-6">
            <p className="text-xs font-bold text-white uppercase">{c.partNumber}</p>
            <p className="text-[10px] text-slate-500 mono font-bold uppercase">{c.serialNumber}</p>
          </td>
          <td className="px-6 py-6 text-xs text-slate-400 uppercase tracking-tighter">{c.types.join(', ')}</td>
          <td className="px-6 py-6">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-400/5 px-3 py-1.5 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-4 h-4" />
              {c.blockingReason}
            </div>
          </td>
          <td className="px-6 py-6 text-xs text-slate-500 italic font-bold uppercase">{c.location}</td>
          <td className="px-6 py-6 text-xs text-slate-500 font-bold">{c.owner}</td>
          <td className="px-6 py-6 text-right">
            <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 shadow-lg shadow-red-500/5">{c.daysBlocked}d</span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const RegistryTable: React.FC<{ data: Certification[], onRowClick: (c: Certification) => void }> = ({ data, onRowClick }) => (
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-800/30 border-b border-slate-800">
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Part / Serial</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Revision</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Work Package</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cert Types</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cert Location</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Date Certified</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Release</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-800">
      {data.map(c => (
        <tr key={c.id} onClick={() => onRowClick(c)} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
          <td className="px-6 py-4">
            <p className="text-xs font-bold text-white uppercase">{c.partNumber}</p>
            <p className="text-[10px] text-slate-500 mono uppercase">{c.serialNumber}</p>
          </td>
          <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase">{c.revision}</td>
          <td className="px-6 py-4 text-[10px] font-bold text-slate-500 mono uppercase tracking-widest">{c.workPackageId}</td>
          <td className="px-6 py-4">
            <div className="flex gap-1 flex-wrap">
              {c.types.map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 uppercase">{t}</span>)}
            </div>
          </td>
          <td className="px-6 py-4 text-xs text-slate-500 italic font-bold uppercase">{c.location}</td>
          <td className="px-6 py-4 text-xs text-slate-400 font-bold">{c.dateCertified}</td>
          <td className="px-6 py-4 text-right">
            <span className={`px-3 py-1 rounded text-[10px] font-bold shadow-lg uppercase tracking-widest ${
              c.releaseStatus === 'RELEASED' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>{c.releaseStatus || 'PENDING'}</span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const TemplatesTable: React.FC<{ data: CertTemplate[] }> = ({ data }) => (
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-800/30 border-b border-slate-800">
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Template ID</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Part Type</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Required Certs</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Artifacts</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Approval Roles</th>
        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Rule</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-800">
      {data.map(t => (
        <tr key={t.id} className="hover:bg-slate-800/20 transition-colors group">
          <td className="px-6 py-4 mono text-xs font-bold text-primary uppercase">{t.id}</td>
          <td className="px-6 py-4 text-xs font-bold text-white uppercase">{t.partType}</td>
          <td className="px-6 py-4">
            <div className="flex flex-wrap gap-1">
              {t.requiredCerts.map(c => <span key={c} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 uppercase tracking-tighter">{c}</span>)}
            </div>
          </td>
          <td className="px-6 py-4 text-[10px] text-slate-500 font-bold uppercase">{t.requiredArtifacts.join(', ')}</td>
          <td className="px-6 py-4">
            <div className="flex -space-x-2">
              {t.approvalRoles.map(r => (
                <div key={r} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-400" title={r}>
                  {r.charAt(0)}
                </div>
              ))}
            </div>
          </td>
          <td className="px-6 py-4 text-right mono text-[10px] font-bold text-slate-500 uppercase">{t.locationConstraint}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const CertificationExecutionView: React.FC<{ cert: Certification, onBack: () => void, focusArea?: 'ACTIONS' | 'ARTIFACTS' }> = ({ cert, onBack, focusArea }) => {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-right duration-500">
       <div className="flex flex-col gap-6 px-2">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Certifications Registry
          </button>

          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex items-center gap-10">
                <div className={`p-12 bg-primary/10 rounded-[48px] border border-primary/20 shadow-2xl shadow-primary/10 ${cert.status === 'HOLD' ? 'bg-red-500/10 border-red-500/20' : ''}`}>
                   <ShieldCheck className={`w-16 h-16 ${cert.status === 'HOLD' ? 'text-red-400' : 'text-primary'}`} />
                </div>
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest shadow-xl">{cert.workPackageId} • Rev {cert.revision}</span>
                      <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                         <MapPin className="w-4 h-4 text-primary" /> {cert.location}
                      </div>
                   </div>
                   <h2 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{cert.partNumber}</h2>
                   <div className="flex items-center gap-6">
                      <p className="text-2xl font-black text-slate-500 mono tracking-tighter uppercase italic">LOT: {cert.serialNumber}</p>
                      <div className={`px-4 py-1.5 rounded-xl text-[11px] font-black border uppercase tracking-[0.2em] shadow-2xl ${
                         cert.status === 'HOLD' ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-primary text-white border-white/20'
                      }`}>{cert.status}</div>
                   </div>
                </div>
             </div>

             <div className="relative z-10 text-right lg:border-l lg:border-slate-800 lg:pl-12 h-full flex flex-col justify-center">
                <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest block mb-3 italic">Est. Closeout Window</span>
                <p className={`text-5xl font-black tracking-tighter italic ${cert.status === 'HOLD' ? 'text-red-400' : 'text-white'}`}>{cert.eta}</p>
                <div className="mt-4 flex items-center justify-end gap-2 text-emerald-400 font-black text-xs uppercase italic tracking-widest">
                   <Sparkles className="w-4 h-4" /> 0.94 Confidence
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
          <div className="lg:col-span-2 space-y-8">
             {/* NEXT REQUIRED ACTIONS */}
             <section className={`bg-slate-900 border rounded-[48px] p-10 shadow-2xl transition-all duration-700 ${focusArea === 'ACTIONS' ? 'border-primary ring-8 ring-primary/10' : 'border-slate-800'}`}>
                <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-tighter italic">
                      <Clock className="w-6 h-6 text-primary" /> 
                      Next Required Actions
                   </h3>
                   {focusArea === 'ACTIONS' && <span className="text-[10px] font-black text-primary animate-pulse uppercase tracking-[0.2em]">Focused Entry</span>}
                </div>
                <div className="space-y-4">
                   {[
                      { action: 'Upload NDI Ultrasonic Scan Results', owner: 'M. Chen (Testing Lab)', due: 'Today 17:00', block: true, status: 'PENDING' },
                      { action: 'Review Material Assay Anomaly', owner: 'R. Vance (Quality)', due: 'Tomorrow 09:00', block: false, status: 'IN_REVIEW' },
                      { action: 'Calibrate CMM Bridge System', owner: 'Facility Lead', due: 'Nov 18', block: true, status: 'HOLD' }
                   ].map((act, i) => (
                      <div key={i} className={`p-6 rounded-[32px] border flex justify-between items-center transition-all hover:border-slate-600 cursor-pointer ${
                         act.block ? 'bg-red-500/5 border-red-500/10 shadow-inner' : 'bg-slate-800/30 border-slate-800'
                      }`}>
                         <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl border ${act.block ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                               {act.block ? <AlertTriangle className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-200 tracking-tight uppercase leading-tight mb-1">{act.action}</p>
                               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-tighter italic">
                                  <span>{act.owner}</span> • <span>Due {act.due}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-xl border uppercase tracking-widest ${
                               act.status === 'HOLD' ? 'bg-red-500 text-white shadow-xl' : 'bg-slate-900 text-slate-500 border-slate-700'
                            }`}>{act.status}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* TIMELINE GATE SEQUENCE */}
             <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Target className="w-48 h-48 text-primary" /></div>
                <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3 relative z-10">
                   <Hammer className="w-6 h-6 text-primary" />
                   Certification Gate Sequence
                </h4>
                <div className="space-y-12 pl-10 relative z-10">
                   <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800" />
                   {(cert.gates || []).map((g, idx) => (
                     <div key={idx} className="relative group">
                        <div className={`absolute -left-[30px] top-0 w-5 h-5 rounded-full border-4 transition-all ${
                          g.status === GateStatus.COMPLETED ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 
                          g.status === GateStatus.IN_PROGRESS ? 'bg-primary border-primary ring-8 ring-primary/10 animate-pulse shadow-[0_0_12px_rgba(var(--primary-color-rgb),0.5)]' :
                          'bg-slate-950 border-slate-800'
                        }`} />
                        <div>
                           <p className={`text-xl font-bold uppercase tracking-tight leading-none mb-2 ${g.status === GateStatus.COMPLETED ? 'text-white' : 'text-slate-500'}`}>{g.name}</p>
                           <div className="flex gap-2">
                             {g.requirements.map(req => (
                               <span key={req} className="text-[9px] font-black px-2 py-0.5 bg-slate-800 text-slate-600 rounded uppercase tracking-tighter italic border border-slate-700">{req}</span>
                             ))}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>
          
          <div className="space-y-8">
             {/* AI EXECUTION SUMMARY */}
             <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-24 h-24 text-primary" /></div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                   <Sparkles className="w-4 h-4 text-primary" /> AI Execution Logic
                </h4>
                <div className="space-y-6">
                   <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                      <p className="text-xs text-slate-300 font-bold leading-relaxed italic">"Detected <span className="text-red-400">calibration mismatch</span> for Node Alpha CMM. This is the primary blocker for Gate 3 completion."</p>
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Initiate Calibration Review</button>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Assessment</p>
                      <div className="flex justify-between items-center text-xs font-bold uppercase italic">
                         <span className="text-slate-400">Schedule Drift</span>
                         <span className="text-red-400">+1.5 Days</span>
                      </div>
                   </div>
                </div>
             </section>

             {/* ARTIFACT CHECKLIST */}
             <section className={`bg-slate-900 border rounded-[48px] p-10 shadow-2xl transition-all duration-700 ${focusArea === 'ARTIFACTS' ? 'border-primary ring-8 ring-primary/10' : 'border-slate-800'}`}>
                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 border-b border-slate-800 pb-4 italic">Artifact Manifest</h4>
                <div className="space-y-4">
                   {cert.artifacts.map(art => (
                     <div key={art.name} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-all">
                        <div className="flex items-center gap-4">
                           <FileCheck className="w-5 h-5 text-emerald-400" />
                           <div>
                              <p className="text-sm font-bold text-slate-200 uppercase leading-tight">{art.name}</p>
                              <p className="text-[9px] text-slate-600 font-black uppercase italic">{art.type}</p>
                           </div>
                        </div>
                        <button className="p-2 text-slate-600 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
                     </div>
                   ))}
                   <div className="border-2 border-dashed border-slate-800 rounded-[32px] p-12 flex flex-col items-center justify-center gap-6 bg-slate-950/20 hover:border-primary/50 transition-all cursor-pointer group">
                      <Zap className="w-10 h-10 text-slate-700 group-hover:text-primary group-hover:scale-110 transition-all" />
                      <div className="text-center">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Awaiting NDI Report</p>
                         <p className="text-[8px] text-slate-700 font-bold uppercase">Drag and drop file to upload</p>
                      </div>
                   </div>
                </div>
             </section>

             {/* AUTHORITY CONTROLS */}
             <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-dark" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                   <Lock className="w-4 h-4 text-primary" /> Node Authority
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <button className="py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/30 disabled:opacity-20" disabled={cert.status === 'HOLD'}>Approve Cert</button>
                   <button className="py-5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 font-black rounded-3xl text-[10px] uppercase tracking-widest border border-slate-700 transition-all">Flag/Hold</button>
                </div>
                <button className="w-full py-5 bg-slate-100 hover:bg-white text-slate-900 font-black rounded-3xl text-[10px] uppercase tracking-widest transition-all shadow-2xl active:scale-95">Complete Current Gate</button>
             </section>
          </div>
       </div>
    </div>
  );
};

const CertificationRecord: React.FC<{ cert: Certification, onBack: () => void }> = ({ cert, onBack }) => (
  <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8 pb-20 px-2">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors border border-slate-800">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Digital Proof Packet</h2>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Immutable Compliance Asset Record</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 border border-slate-800 p-16 rounded-[64px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16">
             <ShieldCheck className="w-48 h-48 text-emerald-500 opacity-5" />
          </div>
          <div className="flex justify-between items-start mb-20 relative z-10">
            <div className="space-y-10">
              <span className="px-6 py-3 bg-emerald-500 text-white text-[11px] font-black rounded-full uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30">Audit-Verified Certification</span>
              <div className="space-y-2">
                <h3 className="text-7xl font-bold text-white tracking-tighter uppercase leading-none italic">{cert.partNumber}</h3>
                <p className="text-3xl font-black text-slate-500 mono tracking-tighter uppercase italic opacity-60">LOT: {cert.serialNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-200 italic tracking-tighter">{cert.dateCertified || 'N/A'}</p>
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-3 italic">Released By Quality Ops</p>
            </div>
          </div>
          <div className="p-10 bg-slate-950/40 rounded-[48px] border border-slate-800 border-dashed relative z-10">
             <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] mb-6 italic">Certification Hash Matrix</p>
             <p className="mono text-[10px] text-slate-500 break-all leading-relaxed">LB-CERT-TXN-001-A9F2...E881-Z-99</p>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500/20" />
           <h4 className="text-sm font-bold text-white mb-10 border-b border-slate-800 pb-6 uppercase tracking-tighter italic flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-emerald-400" />
              Record Actions
           </h4>
           <div className="space-y-4">
              <button className="w-full py-6 bg-primary hover:bg-primary-dark text-white font-black rounded-[32px] text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95">
                 <Download className="w-5 h-5" /> Export Certified Packet
              </button>
              <button className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black rounded-[32px] text-[11px] uppercase tracking-[0.2em] border border-slate-700 transition-all">Verify Immutable Link</button>
           </div>
           <div className="mt-12 pt-10 border-t border-slate-800">
              <div className="flex items-center gap-4 text-slate-600">
                 <ShieldCheck className="w-5 h-5" />
                 <p className="text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">This record is secured by the Launchbelt Network Ledger.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export default QualityCerts;
