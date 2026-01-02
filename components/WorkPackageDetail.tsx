
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, LayoutGrid, ClipboardList, 
  Layers, ShieldCheck, FileBox, FlaskConical, ChevronRight,
  User, Calendar, ExternalLink, MoreHorizontal, AlertCircle,
  Network, Grid3X3, Zap, Box, MapPin, Activity, TrendingUp, AlertTriangle,
  History, Settings, FileSearch, Send
} from 'lucide-react';
import { WorkPackage, Role, Part, PartInstance, GateStatus, BuildGate, WorkPackageStatus } from '../types';

const MOCK_PACKAGES: WorkPackage[] = [
  {
    id: 'WP-7721',
    title: 'Thrust Vector Actuator Assembly',
    program: 'Falcon-Heavy-V2',
    owner: 'Sarah Connor',
    status: WorkPackageStatus.RELEASED,
    description: 'Precision machined actuator components with AS9100 Rev D certification requirements.',
    createdAt: '2023-10-12',
    tdp: {
      id: 'TDP-001',
      version: '1.2',
      files: [{ name: 'Actuator_v1.2.step', size: '42MB', type: 'STEP' }, { name: 'Specs_Final.pdf', size: '2MB', type: 'PDF' }],
      lastModified: '2023-11-01',
      baselineLocked: true
    },
    parts: [{ id: 'P1', partNumber: '7721-001', revision: 'B', name: 'Main Plate', quantityRequired: 4 }],
    criticality: 'MISSION_CRITICAL',
    destinationHub: 'Asgard Forge - Central'
  },
  {
    id: 'WP-8802',
    title: 'External Shielding Plate (Composite)',
    program: 'Starship-Cargo',
    owner: 'James Holden',
    status: WorkPackageStatus.READY_FOR_RFQ,
    description: 'Ablative carbon-carbon shielding panels. Critical ITAR controlled data.',
    createdAt: '2023-11-05',
    tdp: { id: 'TDP-002', version: '0.9', files: [{ name: 'HeatShield_Draft.pdf', size: '15MB', type: 'PDF' }], lastModified: '2023-11-05' },
    parts: [],
    criticality: 'HIGH',
    destinationHub: 'Asgard Forge - Rocky Mountain'
  }
];

const MOCK_PARTS: Part[] = [
  { id: 'P1', partNumber: '7721-001', revision: 'B', name: 'Main Thrust Plate', quantityRequired: 4, processRequired: '5-Axis Machining', certType: 'AS9100' },
  { id: 'P2', partNumber: '7721-002', revision: 'A', name: 'Mounting Brackets', quantityRequired: 16, processRequired: 'Anodize', certType: 'NADCAP' }
];

interface WorkPackageDetailProps {
  pkg?: WorkPackage;
  pkgId?: string;
  initialTab?: string;
  userRole: Role;
  onBack: () => void;
}

const WorkPackageDetail: React.FC<WorkPackageDetailProps> = ({ pkg, pkgId, initialTab, userRole, onBack }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'Overview');
  const [currentPkg, setCurrentPkg] = useState<WorkPackage | null>(pkg || null);

  useEffect(() => {
    if (pkgId && !currentPkg) {
      const found = MOCK_PACKAGES.find(p => p.id === pkgId);
      if (found) setCurrentPkg(found);
    }
  }, [pkgId, currentPkg]);

  const tabs = [
    { name: 'Overview', icon: FileText },
    { name: 'Parts Matrix', icon: LayoutGrid },
    { name: 'Compliance & Certs', icon: ShieldCheck },
    { name: 'RFQs', icon: Send },
    { name: 'Network Plan', icon: Network },
    { name: 'Activity Log', icon: History },
  ];

  const getStatusColor = (status: WorkPackageStatus) => {
    switch (status) {
      case WorkPackageStatus.RELEASED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case WorkPackageStatus.READY_FOR_RFQ: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-800 text-slate-500 border-slate-700';
    }
  };

  if (!currentPkg) return <div className="p-10 text-center text-slate-500">Loading package data...</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-semibold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Work Packages
        </button>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                 <span className="mono text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase font-bold tracking-widest">{currentPkg.id}</span>
                 <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusColor(currentPkg.status)}`}>
                    {currentPkg.status.replace(/_/g, ' ')}
                 </div>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tighter uppercase leading-tight">{currentPkg.title}</h1>
              <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4 italic">
                 <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {currentPkg.owner}</div>
                 <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {currentPkg.destinationHub || 'Unassigned'}</div>
                 <div className="flex items-center gap-2 text-red-400"><ShieldCheck className="w-3.5 h-3.5" /> ITAR RESTRICTED</div>
              </div>
           </div>
           <div className="relative z-10 flex gap-4 md:border-l md:border-slate-800 md:pl-10 h-full flex-col justify-center">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 transition-all border border-blue-400/30">Issue RFQ</button>
              <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-slate-700 transition-all">Audit TDP</button>
           </div>
        </div>
      </div>

      {/* Persistent Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto px-2 bg-slate-950/50 sticky top-16 z-20 backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-8 py-5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.name 
              ? 'text-blue-400 border-blue-400 bg-blue-400/5' 
              : 'text-slate-600 border-transparent hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-8 px-2">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-slate-900 border border-slate-800 rounded-[32px] p-10 shadow-xl relative overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-500" /> Operational Context
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium mb-12 italic">
                  {currentPkg.description}
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block tracking-widest">Delivery Target</span>
                      <p className="text-base font-bold text-slate-200">Dec 15, 2023 (Q4 Release)</p>
                   </div>
                   <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block tracking-widest">Security Posture</span>
                      <p className="text-base font-bold text-red-400">L5 NIST 800-171 Compliance Required</p>
                   </div>
                </div>
              </section>

              <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-10 shadow-xl">
                 <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-3 uppercase tracking-tighter">
                   <Zap className="w-6 h-6 text-blue-500" /> Readiness Summary
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl space-y-3">
                       <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">TDP Status</span>
                       <p className="text-lg font-bold text-white">Baseline Locked v{currentPkg.tdp.version}</p>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Cryptographic hash verified across 4 network nodes.</p>
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl space-y-3">
                       <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Sourcing Health</span>
                       <p className="text-lg font-bold text-white">Ready for Multi-Node RFQ</p>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed">3 Vetted Tier-1 suppliers matched for this process family.</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-xl">
                  <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-8 block italic">Technical Baseline</h4>
                  <div className="space-y-4">
                     {currentPkg.tdp.files.map(f => (
                       <div key={f.name} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-blue-600/10 transition-all">
                                <FileBox className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-white truncate max-w-[120px]">{f.name}</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase">{f.size} • {f.type}</p>
                             </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-700 group-hover:text-white" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Parts Matrix' && (
           <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tighter">BOM / Components</h3>
              </div>
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-800/20 border-b border-slate-800">
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Part Reference</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Required Process</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Qty</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Gate Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {MOCK_PARTS.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/20 transition-all">
                         <td className="px-10 py-8">
                            <p className="text-sm font-bold text-blue-400 mono tracking-tighter">{p.partNumber}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{p.name}</p>
                         </td>
                         <td className="px-10 py-8">
                            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 rounded-lg uppercase tracking-widest">{p.processRequired}</span>
                         </td>
                         <td className="px-10 py-8 text-center text-sm font-bold text-white">{p.quantityRequired}</td>
                         <td className="px-10 py-8 text-right font-bold text-xs text-slate-500 uppercase tracking-widest">Awaiting RFQ Release</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {activeTab === 'Compliance & Certs' && (
           <div className="flex items-center justify-center p-20 bg-slate-900 border border-slate-800 border-dashed rounded-[40px]">
              <div className="text-center space-y-4 max-w-sm">
                 <ShieldCheck className="w-16 h-16 text-slate-800 mx-auto" />
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Compliance Readiness Gate Active</p>
                 <p className="text-[10px] text-slate-700 leading-relaxed uppercase tracking-tighter font-black">Scanning Technical Baseline for ITAR conflicts...</p>
              </div>
           </div>
        )}

        {activeTab === 'RFQs' && (
           <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Procurement Sourcing</h3>
              <div className="space-y-6">
                 <div className="p-8 bg-slate-800/30 border border-slate-800 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <Send className="w-6 h-6 text-blue-500" />
                       <div>
                          <p className="text-base font-bold text-white uppercase">Initialize RFP Sourcing</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ready for 3 Vetted Network Nodes</p>
                       </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl">Issue RFP</button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default WorkPackageDetail;
