
import React, { useState, useMemo } from 'react';
import { 
  Hammer, Search, Filter, MoreHorizontal, ChevronRight, 
  ArrowLeft, FileText, LayoutGrid, Layers, FlaskConical, 
  ShieldCheck, History, User, Clock, AlertTriangle, Package,
  Zap, CheckCircle2, ListFilter, Target, MapPin, Sparkles,
  TrendingUp, Activity, ClipboardList, Gauge, ArrowUpRight,
  // Add missing AlertCircle import
  AlertCircle
} from 'lucide-react';

interface WorkOrdersProps {
  initialView?: 'LIST' | 'DETAIL';
  initialWoId?: string;
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
}

// --- EXTENDED MOCK DATA ---
const MOCK_ORDERS = [
  { 
    id: 'WO-9921', wp: 'WP-7721', assembly: 'Main Plate Assembly', priority: 'HIGH', status: 'IN_WORK', 
    quotedDate: 'Nov 20', expectedDate: 'Nov 20', delta: 0, owner: 'D. Miller', 
    percentComplete: 65, currentGate: 'Integration Alpha', gatesRemaining: 3,
    nextAction: { label: 'Complete Fastener Torque Test', owner: 'D. Miller', reason: 'Critical path assembly step', due: 'Today 16:00', confidence: 0.98, type: 'EXECUTION' },
    parts: [
      { pn: '7721-001', desc: 'Main Thrust Plate', source: 'Forge', qty: 4, cert: 'COMPLETE', shipStatus: 'STAGED', eta: 'N/A', impact: 'CRITICAL', gating: false },
      { pn: '7721-F-12', desc: 'Titanium Fastener Kit', source: 'Supplier', supplier: 'Pacific North', qty: 48, cert: 'COMPLETE', shipStatus: 'ARRIVED', eta: 'Done', impact: 'HIGH', gating: false },
      { pn: '7721-ACT-V2', desc: 'Servo Actuators', source: 'Supplier', supplier: 'Global Parts', qty: 4, cert: 'PENDING', shipStatus: 'IN_TRANSIT', eta: 'Today 14:00', impact: 'CRITICAL', gating: true }
    ],
    integrationPlan: { bay: 'Bay 04', team: 'Blue-Delta', ready: false, missing: ['Servo Actuators'], gates: [
      { name: 'Mechanical Fit', status: 'COMPLETE', owner: 'Miller', duration: '4h' },
      { name: 'Avionics Interconnect', status: 'IN_PROGRESS', owner: 'Miller', duration: '6h' },
      { name: 'System Calibration', status: 'PENDING', owner: 'Vance', duration: '8h' }
    ]},
    testPlan: [
      { id: 'T1', name: 'Load Stress Test', equipment: 'HV Test Rig 1', status: 'NOT_STARTED', result: 'N/A' },
      { id: 'T2', name: 'Thermal Variance', equipment: 'Environmental Chamber Alpha', status: 'NOT_STARTED', result: 'N/A' }
    ]
  },
  { 
    id: 'WO-8804', wp: 'WP-8802', assembly: 'Shield Layer 1 (Ablative)', priority: 'CRITICAL', status: 'HOLD', 
    quotedDate: 'Nov 18', expectedDate: 'Nov 22', delta: 4, owner: 'A. Chen', 
    percentComplete: 20, currentGate: 'Material Receipt', gatesRemaining: 6,
    nextAction: { label: 'Resolve Shipment Delay SHIP-0994', owner: 'Supply Intel', reason: 'Gating part missing', due: 'Nov 18', confidence: 0.82, type: 'INBOUND' },
    parts: [
      { pn: '8802-C-105', desc: 'Carbon-Carbon Panel', source: 'Supplier', supplier: 'Silicon Valley Additive', qty: 12, cert: 'PENDING', shipStatus: 'DELAYED', eta: 'Nov 21', impact: 'CRITICAL', gating: true },
      { pn: '8802-RES-01', desc: 'High-Temp Resin', source: 'Forge', qty: 5, cert: 'COMPLETE', shipStatus: 'STAGED', eta: 'N/A', impact: 'MED', gating: false }
    ],
    integrationPlan: { bay: 'Cleanroom A', team: 'Composite-Alpha', ready: false, missing: ['Carbon-Carbon Panel'], gates: [] },
    testPlan: []
  },
  { 
    id: 'WO-9922', wp: 'WP-7721', assembly: 'Support Strut (Port)', priority: 'MED', status: 'READY', 
    quotedDate: 'Nov 15', expectedDate: 'Nov 18', delta: 3, owner: 'K. Vance', 
    percentComplete: 40, currentGate: 'Final Machining', gatesRemaining: 2,
    nextAction: { label: 'Initiate 5-Axis Mill Setup', owner: 'K. Vance', reason: 'Equipment Maintenance Cleared', due: 'Today 13:00', confidence: 0.95, type: 'EQUIPMENT' },
    parts: [], integrationPlan: { bay: 'Machining Hub', team: 'CNC-S2', ready: true, missing: [], gates: [] }, testPlan: []
  },
  { id: 'WO-9012', wp: 'WP-9011', assembly: 'Manifold Additive', priority: 'HIGH', status: 'COMPLETED', quotedDate: 'Nov 08', expectedDate: 'Nov 08', delta: 0, owner: 'S. Connor', percentComplete: 100, currentGate: 'Released', gatesRemaining: 0, parts: [], integrationPlan: { bay: 'N/A', team: 'N/A', ready: true, missing: [], gates: [] }, testPlan: [] },
  { id: 'WO-2047', wp: 'WP-2047', assembly: 'Payload Hub Structural', priority: 'MED', status: 'IN_WORK', quotedDate: 'Nov 24', expectedDate: 'Nov 24', delta: 0, owner: 'R. Rivera', percentComplete: 12, currentGate: 'Setup', gatesRemaining: 8, parts: [], integrationPlan: { bay: 'Bay 02', team: 'Blue-Gamma', ready: true, missing: [], gates: [] }, testPlan: [] },
  { id: 'WO-1122', wp: 'WP-1122', assembly: 'Landing Support Grid', priority: 'CRITICAL', status: 'IN_WORK', quotedDate: 'Nov 16', expectedDate: 'Nov 16', delta: 0, owner: 'M. Chen', percentComplete: 85, currentGate: 'Final Inspection', gatesRemaining: 1, parts: [], integrationPlan: { bay: 'Bay 01', team: 'Heavy-Fab', ready: true, missing: [], gates: [] }, testPlan: [] },
];

const WorkOrders: React.FC<WorkOrdersProps> = ({ initialView = 'LIST', initialWoId, onNavigate, onBack }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>(initialView);
  const [selectedWoId, setSelectedWoId] = useState<string | null>(initialWoId || null);

  const selectedWo = MOCK_ORDERS.find(o => o.id === selectedWoId);

  if (view === 'DETAIL' && selectedWo) {
    return <WorkOrderDetail order={selectedWo} onBack={() => { setView('LIST'); onBack(); }} onNavigate={onNavigate} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Forge-Owned</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Forge Work Orders</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Asgard Forge Central • Production Execution Stream</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:ring-1 focus:ring-primary w-64" placeholder="Filter ID, WP, Owner..." />
           </div>
           <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20">+ Create Work Order</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl mx-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">WO ID</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Program / Assembly</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Priority</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Deliv. Delta</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Owner</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Progress</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_ORDERS.map(o => (
              <tr 
                key={o.id} 
                onClick={() => { setSelectedWoId(o.id); setView('DETAIL'); }}
                className="hover:bg-slate-800/30 transition-all cursor-pointer group"
              >
                <td className="px-8 py-6 mono text-sm font-bold text-primary group-hover:text-primary-dark">{o.id}</td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white uppercase group-hover:text-primary transition-colors leading-none mb-1">{o.assembly}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">WP: {o.wp}</p>
                </td>
                <td className="px-8 py-6 text-center">
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                     o.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                     o.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                     'bg-slate-800 text-slate-500 border-slate-700'
                   }`}>{o.priority}</span>
                </td>
                <td className="px-8 py-6 text-center">
                   {o.delta > 0 ? (
                     <span className="text-red-500 font-bold text-[10px] uppercase flex items-center justify-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +{o.delta}d
                     </span>
                   ) : <span className="text-emerald-500 font-bold text-[10px] uppercase">ON TRACK</span>}
                </td>
                <td className="px-8 py-6 text-center text-xs font-bold text-slate-400 uppercase italic tracking-tighter">{o.owner}</td>
                <td className="px-8 py-6 text-center">
                   <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${o.percentComplete}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{o.percentComplete}%</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${
                    o.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    o.status === 'HOLD' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
                    o.status === 'IN_WORK' ? 'bg-primary/10 text-primary border-primary/20' :
                    'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>{o.status.replace('_', ' ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: WORK ORDER DETAIL ---
const WorkOrderDetail: React.FC<{ order: any, onBack: () => void, onNavigate: any }> = ({ order, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = [
    { name: 'Overview', icon: FileText },
    { name: 'Parts Required', icon: LayoutGrid },
    { name: 'Integration Plan', icon: Layers },
    { name: 'Test Plan', icon: FlaskConical },
    { name: 'Quality Gates', icon: ShieldCheck },
    { name: 'Activity Log', icon: History },
  ];

  const handleNextAction = () => {
    if (!order.nextAction) return;
    const { type } = order.nextAction;
    if (type === 'EXECUTION') setActiveTab('Integration Plan');
    else if (type === 'INBOUND') onNavigate('Inbound Supplier Work');
    else if (type === 'EQUIPMENT') onNavigate('Equipment and Capacity');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 pb-20">
       <div className="flex flex-col gap-6 px-2">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Work Orders
          </button>

          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
             <div className="relative z-10 flex items-center gap-10">
                <div className={`p-10 rounded-[40px] border shadow-2xl ${order.status === 'HOLD' ? 'bg-red-500/10 border-red-500/30' : 'bg-primary/10 border-primary/30'}`}>
                   <Hammer className={`w-12 h-12 ${order.status === 'HOLD' ? 'text-red-400' : 'text-primary'}`} />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-3">
                      <span className="mono text-[11px] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 uppercase font-black tracking-widest">{order.id}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest italic">{order.wp}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest ${
                         order.status === 'HOLD' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>{order.status}</span>
                   </div>
                   <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">{order.assembly}</h2>
                   <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-6">
                      <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {order.owner}</div>
                      <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${order.priority === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-amber-500'}`} /> {order.priority} PRIORITY</div>
                   </div>
                </div>
             </div>
             <div className="relative z-10 grid grid-cols-2 gap-4 lg:border-l lg:border-slate-800 lg:pl-10 h-full">
                <div className="p-4 bg-slate-950/40 rounded-3xl border border-slate-800 text-center">
                   <span className="text-[9px] text-slate-600 font-black uppercase block mb-1">Quoted Delivery</span>
                   <p className="text-sm font-bold text-slate-400">{order.quotedDate}</p>
                </div>
                <div className={`p-4 rounded-3xl border text-center ${order.delta > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                   <span className="text-[9px] text-slate-600 font-black uppercase block mb-1">Expected (Forec.)</span>
                   <p className={`text-sm font-bold ${order.delta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{order.expectedDate}</p>
                </div>
                {order.delta > 0 && (
                   <div className="col-span-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL PATH DELAY: +{order.delta} DAYS
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* Sub Navigation */}
       <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto px-2 bg-slate-950/50 sticky top-16 z-20 backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap italic ${
              activeTab === tab.name
              ? 'text-primary border-primary bg-primary/5' 
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
                 {/* NEXT REQUIRED ACTION CARD */}
                 {order.nextAction && (
                    <section onClick={handleNextAction} className="bg-primary/5 border border-primary/20 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group cursor-pointer hover:bg-primary/10 transition-all">
                       <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Zap className="w-32 h-32 text-primary" />
                       </div>
                       <div className="flex justify-between items-start mb-8 relative z-10 border-b border-primary/20 pb-6">
                          <h3 className="text-xl font-black text-primary uppercase italic tracking-tighter flex items-center gap-3">
                             <Target className="w-6 h-6 animate-pulse" />
                             Next Required Action
                          </h3>
                          <span className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-lg uppercase tracking-widest flex items-center gap-2">
                             <Sparkles className="w-3 h-3" /> {Math.round(order.nextAction.confidence * 100)}% AI Confidence
                          </span>
                       </div>
                       <div className="flex items-center justify-between relative z-10">
                          <div className="space-y-4">
                             <p className="text-3xl font-bold text-white uppercase italic tracking-tighter group-hover:translate-x-1 transition-transform">{order.nextAction.label}</p>
                             <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {order.nextAction.owner}</span>
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Due {order.nextAction.due}</span>
                                <span className="flex items-center gap-2 text-red-400 font-bold italic underline"><AlertCircle className="w-4 h-4" /> {order.nextAction.reason}</span>
                             </div>
                          </div>
                          <ChevronRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-all" />
                       </div>
                    </section>
                 )}

                 <section className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                    <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-3 uppercase tracking-tighter italic">
                       Execution Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700 text-center">
                          <span className="text-[10px] text-slate-500 font-black uppercase block mb-2">Build Progress</span>
                          <p className="text-3xl font-bold text-white italic">{order.percentComplete}%</p>
                       </div>
                       <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700 text-center">
                          <span className="text-[10px] text-slate-500 font-black uppercase block mb-2">Current Gate</span>
                          <p className="text-lg font-bold text-primary italic uppercase tracking-tight">{order.currentGate}</p>
                       </div>
                       <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700 text-center">
                          <span className="text-[10px] text-slate-500 font-black uppercase block mb-2">Gates Remaining</span>
                          <p className="text-3xl font-bold text-slate-400 italic">{order.gatesRemaining}</p>
                       </div>
                    </div>
                    <div className="mt-10 p-8 bg-slate-950/60 rounded-3xl border border-slate-800 border-dashed relative group">
                       <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-12 h-12 text-primary" /></div>
                       <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 italic">AI Execution Summary</h4>
                       <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                          {order.delta > 0 
                            ? `"Detected 4-day critical path slide. Primary schedule driver is delayed receipt of ${order.parts[0]?.pn || 'inbound parts'} from ${order.parts[0]?.supplier || 'external source'}. Secondary risk: CNC Station 01 maintenance overlaps with expected recovery window."`
                            : `"Nominal throughput detected. Yield rate at 99.2%. Equipment and personnel availability confirm Nov 20 release target."`}
                       </p>
                    </div>
                 </section>
              </div>
              <div className="space-y-6">
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20" />
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 block italic">Production Telemetry</h4>
                    <div className="space-y-6">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-slate-400">FPY Confidence</span>
                          <span className="text-emerald-400">99.8%</span>
                       </div>
                       <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '99%' }} />
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-slate-400">Workstation Velocity</span>
                          <span className="text-primary">+12% over Nom</span>
                       </div>
                    </div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block italic">Assigned Node Authority</h4>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary">LB</div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Asgard Forge Austin</p>
                          <p className="text-[10px] text-slate-600 font-bold uppercase">Node ID: FORGE-TX-01</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
         {activeTab === 'Parts Required' && <PartsRequiredTab order={order} onNavigate={onNavigate} />}
         {activeTab === 'Integration Plan' && <IntegrationPlanTab order={order} onNavigate={onNavigate} />}
         {activeTab === 'Test Plan' && <TestPlanTab order={order} />}
         {activeTab === 'Quality Gates' && <QualityGatesTab order={order} />}
         {activeTab === 'Activity Log' && <ActivityLogTab order={order} />}
      </div>
    </div>
  );
};

// --- SUB-TABS COMPONENTS ---

const PartsRequiredTab = ({ order, onNavigate }: { order: any, onNavigate: any }) => (
   <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
         <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" /> Dependency Management Matrix
         </h3>
      </div>
      <table className="w-full text-left border-collapse">
         <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Part Number / Desc</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Source</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Qty</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Ship Status</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">ETA</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-right">Gate Impact</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-800">
            {order.parts?.map((p: any) => (
               <tr 
                 key={p.pn} 
                 className={`hover:bg-slate-800/30 transition-all cursor-pointer group ${p.gating ? 'bg-red-500/5' : ''}`}
                 onClick={() => p.source === 'Supplier' ? onNavigate('Inbound Supplier Work') : onNavigate('WIP and Routing')}
               >
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <span className="mono text-xs font-bold text-primary uppercase">{p.pn}</span>
                        {p.source === 'Supplier' && <span className="bg-indigo-500/10 text-indigo-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase tracking-tighter">Network-Provided</span>}
                     </div>
                     <p className="text-[10px] text-slate-300 font-bold uppercase mt-1 italic leading-none">{p.desc}</p>
                  </td>
                  <td className="px-8 py-6 text-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">
                     {p.supplier || 'INTERNAL'}
                  </td>
                  <td className="px-8 py-6 text-center font-black text-slate-300">{p.qty}</td>
                  <td className="px-8 py-6">
                     <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                        p.shipStatus === 'ARRIVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        p.shipStatus === 'DELAYED' ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse' :
                        'bg-slate-800 text-slate-500 border-slate-700'
                     }`}>{p.shipStatus}</span>
                  </td>
                  <td className="px-8 py-6 text-center italic text-xs font-bold text-slate-400">{p.eta}</td>
                  <td className="px-8 py-6 text-right">
                     <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${p.impact === 'CRITICAL' ? 'text-red-400' : 'text-slate-500'}`}>{p.impact}</span>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   </div>
);

const IntegrationPlanTab = ({ order, onNavigate }: { order: any, onNavigate: any }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     <div className="lg:col-span-2 space-y-8">
        <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
           <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
              <Layers className="w-6 h-6 text-primary" /> Integration Sequence
           </h4>
           <div className="space-y-10 pl-10 relative">
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800" />
              {order.integrationPlan.gates.map((g: any, idx: number) => (
                <div key={idx} className="relative group">
                   <div className={`absolute -left-[30px] top-0 w-5 h-5 rounded-full border-4 transition-all ${
                     g.status === 'COMPLETE' ? 'bg-emerald-500 border-emerald-400' : 
                     g.status === 'IN_PROGRESS' ? 'bg-primary border-primary ring-8 ring-primary/10 animate-pulse' :
                     'bg-slate-950 border-slate-800'
                   }`} />
                   <div>
                      <p className={`text-lg font-bold uppercase tracking-tight ${g.status === 'COMPLETE' ? 'text-white' : 'text-slate-500'}`}>{g.name}</p>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic mt-1">{g.status} • Est. {g.duration} • Assigned: {g.owner}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
     </div>
     <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 block italic">Readiness Summary</h4>
           <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                 <span className="text-slate-400">All Parts Present?</span>
                 <span className={order.integrationPlan.ready ? 'text-emerald-400' : 'text-red-400'}>{order.integrationPlan.ready ? 'YES' : 'NO'}</span>
              </div>
              {!order.integrationPlan.ready && (
                 <div className="space-y-3">
                    <span className="text-[9px] text-red-400 font-bold uppercase block">Missing Dependencies:</span>
                    {order.integrationPlan.missing.map((m: string) => (
                      <div key={m} className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-300 uppercase italic">
                         {m}
                      </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 block italic">Station Assignment</h4>
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div onClick={() => onNavigate('Equipment and Capacity')} className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-all text-primary shadow-xl">
                    <Gauge className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white uppercase italic">{order.integrationPlan.bay}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Team: {order.integrationPlan.team}</p>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </div>
);

const TestPlanTab = ({ order }: { order: any }) => (
   <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
         <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic flex items-center gap-3">
            <FlaskConical className="w-6 h-6 text-primary" /> System Proof & Verification
         </h3>
      </div>
      <table className="w-full text-left border-collapse">
         <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Test Objective</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Equipment Node</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Status</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-right">Proof Artifact</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-800">
            {order.testPlan.length === 0 ? (
               <tr><td colSpan={4} className="p-20 text-center text-slate-700 font-bold uppercase tracking-widest italic opacity-40">Test Protocol Initializing...</td></tr>
            ) : (
               order.testPlan.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-all">
                     <td className="px-8 py-8">
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{t.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic">LB-PROT-VER-922</p>
                     </td>
                     <td className="px-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {t.equipment}
                     </td>
                     <td className="px-8 py-8 text-center">
                        <span className="text-[10px] font-black px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 uppercase tracking-tighter italic">{t.status}</span>
                     </td>
                     <td className="px-8 py-8 text-right font-bold text-xs text-slate-700 uppercase italic">AWAITING EXECUTION</td>
                  </tr>
               ))
            )}
         </tbody>
      </table>
   </div>
);

const QualityGatesTab = ({ order }: { order: any }) => (
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
         <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
            <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-primary" /> Certificate Release Timeline
            </h4>
            <div className="space-y-12 pl-10 relative">
               <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800" />
               {['Incoming Receipt', 'First Article (FAI)', 'In-Process Audit', 'Final AS9100 Release'].map((g, idx) => (
                 <div key={idx} className="relative group">
                    <div className={`absolute -left-[30px] top-0 w-5 h-5 rounded-full border-4 transition-all ${
                      idx === 0 ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-950 border-slate-800'
                    }`} />
                    <div>
                       <p className={`text-lg font-bold uppercase tracking-tight ${idx === 0 ? 'text-white' : 'text-slate-600'}`}>{g}</p>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic mt-1">{idx === 0 ? 'APPROVED BY SYSTEM' : 'AWAITING SIGN-OFF'}</p>
                    </div>
                 </div>
               ))}
            </div>
         </section>
      </div>
      <div className="space-y-6">
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 block italic">NCR Summary</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-slate-400">Open Reports</span>
                  <span className="text-white">00</span>
               </div>
               <div className="py-10 text-center opacity-40">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-[10px] font-bold text-emerald-500 mt-4 uppercase">No Deviations Recorded</p>
               </div>
            </div>
         </div>
      </div>
   </div>
);

const ActivityLogTab = ({ order }: { order: any }) => (
   <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
         <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" /> Execution Provenance
         </h3>
         <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter: Execution</button>
         </div>
      </div>
      <div className="divide-y divide-slate-800">
         {[
           { time: 'Today 09:12', actor: 'D. Miller', action: 'GATE_COMPLETE', obj: 'Mechanical Fit', before: 'IN_WORK', after: 'COMPLETE' },
           { time: 'Today 08:00', actor: 'SYSTEM', action: 'STATUS_CHANGE', obj: 'Work Order', before: 'HOLD', after: 'IN_WORK' },
           { time: 'Yesterday', actor: 'Receiving', action: 'PART_RECEIPT', obj: '7721-F-12', before: 'TRANSIT', after: 'ARRIVED' },
         ].map((log, i) => (
            <div key={i} className="p-8 hover:bg-slate-800/30 transition-all flex justify-between items-center group">
               <div className="flex gap-10">
                  <div className="space-y-1">
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{log.time}</p>
                     <p className="text-sm font-bold text-white italic">{log.actor}</p>
                  </div>
                  <div>
                     <p className="text-xs font-black text-primary uppercase tracking-widest">{log.action}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{log.obj}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black uppercase">
                  <span className="text-slate-600">{log.before}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-700" />
                  <span className="text-emerald-400">{log.after}</span>
               </div>
            </div>
         ))}
      </div>
   </div>
);

export default WorkOrders;
