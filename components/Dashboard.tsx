
import React from 'react';
import { 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Clock,
  User,
  LayoutGrid,
  Activity,
  MapPin,
  ClipboardList,
  Target
} from 'lucide-react';
import { Role } from '../types';

interface DashboardProps {
  role: Role;
  onNavigate: (view: string, params?: any) => void;
}

type ActionType = 
  | 'APPROVE_CERT_GATE' 
  | 'UPLOAD_ARTIFACT' 
  | 'CLOSE_NCR' 
  | 'RESOLVE_PART_HOLD' 
  | 'REVIEW_LATE_PART' 
  | 'RELEASE_RFQ' 
  | 'COMPLIANCE_FIX' 
  | 'INTEGRATION_BLOCKER';

interface HighPriorityAction {
  type: ActionType;
  desc: string;
  refType: 'Work Package' | 'Part Instance' | 'Certification Item' | 'NCR' | 'Facility';
  refId: string;
  owner: string;
  due: string;
  severity: 'CRITICAL' | 'HIGH' | 'MED';
  destinationDesc: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role, onNavigate }) => {
  const metrics = [
    { 
      label: 'Active Programs', 
      val: '05', 
      filter: 'Status = In Execution',
      desc: 'Programs in production execution', 
      color: 'text-white',
      action: () => onNavigate('Work Packages', { filter: 'IN_EXECUTION' })
    },
    { 
      label: 'Programs At Risk', 
      val: '02', 
      filter: 'Risk = High / Critical',
      desc: 'Critical schedule or quality drift', 
      color: 'text-red-500',
      action: () => onNavigate('Work Packages', { filter: 'AT_RISK' })
    },
    { 
      label: 'Parts In Build', 
      val: '248', 
      filter: 'Status = In Work / Inspection',
      desc: 'Active WIP across network nodes', 
      color: 'text-primary',
      action: () => onNavigate('Network Control Tower', { mode: 'ACTIVE_BUILDS' })
    },
    { 
      label: 'Certs In Progress', 
      val: '07', 
      filter: 'Status = In Progress',
      desc: 'Quality gates awaiting sign-off', 
      color: 'text-primary',
      action: () => onNavigate('Quality & Certs', { subView: 'IN_PROGRESS' })
    },
  ];

  const highPriorityActions: HighPriorityAction[] = [
    {
      type: 'APPROVE_CERT_GATE',
      desc: 'Approve Final Dimensional Gate',
      refType: 'Certification Item',
      refId: 'C1',
      owner: 'R. Vance',
      due: 'Today',
      severity: 'CRITICAL',
      destinationDesc: 'Navigate to Certification Execution: Next Required Actions'
    },
    {
      type: 'UPLOAD_ARTIFACT',
      desc: 'Missing NDI Ultrasonic Scan Results',
      refType: 'Certification Item',
      refId: 'C4',
      owner: 'M. Chen',
      due: 'Today',
      severity: 'HIGH',
      destinationDesc: 'Navigate to Certification Execution: Artifacts Manifest'
    },
    {
      type: 'RELEASE_RFQ',
      desc: 'Release Sourcing Request: Batch B',
      refType: 'Work Package',
      refId: 'WP-7721',
      owner: 'S. Connor',
      due: 'Tomorrow',
      severity: 'HIGH',
      destinationDesc: 'Navigate to Work Package Detail: RFQs Tab'
    },
    {
      type: 'COMPLIANCE_FIX',
      desc: 'Address ITAR Metadata Conflict',
      refType: 'Work Package',
      refId: 'WP-8802',
      owner: 'J. Holden',
      due: 'Nov 20',
      severity: 'MED',
      destinationDesc: 'Navigate to Work Package Detail: Compliance Tab'
    },
    {
      type: 'INTEGRATION_BLOCKER',
      desc: 'Propulsion Mount Delivery Delay',
      refType: 'Facility',
      refId: 'Asgard Forge - Central',
      owner: 'Tower Intel',
      due: 'Immediate',
      severity: 'CRITICAL',
      destinationDesc: 'Navigate to Network Control Tower: Focus Asgard Forge'
    }
  ];

  const handleActionClick = (action: HighPriorityAction) => {
    switch (action.type) {
      case 'APPROVE_CERT_GATE':
        onNavigate('Quality & Certs', { subView: 'IN_PROGRESS', certId: action.refId, viewMode: 'EXECUTION', focus: 'ACTIONS' });
        break;
      case 'UPLOAD_ARTIFACT':
        onNavigate('Quality & Certs', { subView: 'IN_PROGRESS', certId: action.refId, viewMode: 'EXECUTION', focus: 'ARTIFACTS' });
        break;
      case 'RELEASE_RFQ':
        onNavigate('Work Package Detail', { pkgId: action.refId, tab: 'RFQs' });
        break;
      case 'COMPLIANCE_FIX':
        onNavigate('Work Package Detail', { pkgId: action.refId, tab: 'Compliance & Certs' });
        break;
      case 'INTEGRATION_BLOCKER':
        onNavigate('Network Control Tower', { tab: 'Network Map', highlightId: 'FORGE-TX' });
        break;
      default:
        console.warn('Unhandled action type:', action.type);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Executive Command Briefing</h1>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Operational Status: NOMINAL • SYNC: 0.8s AGO</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-xl">
           <Activity className="w-4 h-4 animate-pulse" />
           LIVE NETWORK FEED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {metrics.map((m) => (
          <button 
            key={m.label} 
            onClick={m.action}
            className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] hover:border-primary/40 hover:bg-primary/5 transition-all text-left group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>
            <div className="mb-4">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{m.label}</p>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter mt-0.5">{m.filter}</p>
            </div>
            <p className={`text-6xl font-bold ${m.color} tracking-tighter leading-none mb-4`}>{m.val}</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter leading-relaxed">{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
        <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden h-full">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Sparkles className="w-48 h-48 text-primary" />
           </div>
           
           <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <Sparkles className="w-6 h-6 text-primary" />
                 </div>
                 <h2 className="text-xl font-bold text-white uppercase italic tracking-tight">AI Operational Summary</h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest block mb-1">Confidence</span>
                    <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">HIGH (0.94)</span>
                 </div>
                 <div className="px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-500 rounded-lg uppercase">AI-generated</div>
              </div>
           </div>

           <div className="space-y-6 relative z-10">
              <div className="flex gap-4 group">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                 <p className="text-sm text-slate-300 font-medium leading-relaxed italic">Network is operating at <span className="text-white font-bold">88% nominal capacity</span>; throughput remains stable.</p>
              </div>
              <div className="flex gap-4 group">
                 <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0" />
                 <p className="text-sm text-slate-300 font-medium leading-relaxed italic">Detected critical path <span className="text-white font-bold">anodizing bottleneck</span> in Western region affecting 3 work packages.</p>
              </div>
              <div className="flex gap-4 group">
                 <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                 <p className="text-sm text-slate-300 font-medium leading-relaxed italic"><span className="text-white font-bold">Asgard Forge Central</span> confirmed ready for NightOwl integration at <span className="text-primary font-bold">Level L-4</span>.</p>
              </div>
              <div className="flex gap-4 group">
                 <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                 <p className="text-sm text-slate-300 font-medium leading-relaxed italic"><span className="text-white font-bold">ITAR compliance posture</span> is 100% nominal across all active parts in build.</p>
              </div>
              <div className="flex gap-4 group">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                 <p className="text-sm text-slate-300 font-medium leading-relaxed italic"><span className="text-white font-bold">Immediate Focus:</span> Prioritize certification closeout for <span className="text-primary font-bold">WP-7721</span> to unlock assembly.</p>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl h-full flex flex-col">
            <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
               <h2 className="text-xl font-bold text-white uppercase italic tracking-tight flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  High-Priority Actions
               </h2>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Urgent Execution Sign-offs</span>
            </div>
            <div className="divide-y divide-slate-800 overflow-y-auto custom-scrollbar flex-1 max-h-[440px]">
               {highPriorityActions.map((action, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => handleActionClick(action)}
                   title={action.destinationDesc}
                   className="p-6 hover:bg-slate-800/30 transition-all cursor-pointer flex items-center justify-between group"
                 >
                    <div className="flex items-center gap-6">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          action.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                          action.severity === 'HIGH' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                          'bg-primary/10 border-primary/30 text-primary'
                       }`}>
                          <Zap className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-none mb-2">{action.desc}</p>
                          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">
                             <span className="flex items-center gap-1.5"><LayoutGrid className="w-3 h-3" /> {action.refType}: {action.refId}</span>
                             <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {action.owner}</span>
                             <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Due {action.due}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className={`text-[8px] font-black px-3 py-1 rounded border uppercase tracking-widest ${
                          action.severity === 'CRITICAL' ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20' :
                          action.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-primary/10 text-primary border-primary/30'
                       }`}>
                          {action.severity}
                       </span>
                       <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
