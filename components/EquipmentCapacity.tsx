
import React, { useState, useMemo } from 'react';
import { 
  Cpu, Wrench, Settings, Zap, Thermometer, Activity, 
  Gauge, Drill, Maximize, ArrowLeft, Clock, History,
  ShieldCheck, AlertTriangle, ChevronRight, LayoutGrid,
  Layers, Package, Target, Hammer, BarChart3, FlaskConical,
  Truck, Search, Filter, Info, Box, Sparkles, Settings2,
  CheckCircle2, ArrowUpRight, TrendingUp, Calendar, ChevronDown, 
  ChevronUp, Lock, Fingerprint, ShieldAlert, FileText, User
} from 'lucide-react';

type MachineStatus = 'Running' | 'Idle' | 'Setup' | 'Down' | 'Maintenance' | 'Planned';

interface Machine {
  id: string;
  name: string;
  type: string;
  group: string;
  status: MachineStatus;
  utilizationToday: number;
  utilization7d: number;
  currentWO?: string;
  queue: string[];
  nextAvailable: string;
  maintenanceDue: string;
  alerts: string[];
  constraints: {
    envelope: string;
    tooling: string;
    cert: string;
  };
}

const MOCK_FLEET: Machine[] = [
  // COMPOSITES
  { id: 'COMP-CLEAN-01', name: 'Cleanroom Cell Alpha', type: 'Layup Cell', group: 'Composites and Curing', status: 'Running', utilizationToday: 85, utilization7d: 78, currentWO: 'WO-8804', queue: ['WO-8805', 'WO-8806'], nextAvailable: 'Today 18:00', maintenanceDue: 'Nov 30', alerts: [], constraints: { envelope: '20x20 ft', tooling: 'Laser Projector Sync', cert: 'L5 Classified' } },
  { id: 'COMP-CLEAN-02', name: 'Cleanroom Cell Beta', type: 'Layup Cell', group: 'Composites and Curing', status: 'Idle', utilizationToday: 42, utilization7d: 65, queue: [], nextAvailable: 'Now', maintenanceDue: 'Dec 05', alerts: [], constraints: { envelope: '20x20 ft', tooling: 'Standard', cert: 'ITAR Restricted' } },
  { id: 'COMP-VAC-01', name: 'Central Vacuum Pump', type: 'Utility', group: 'Composites and Curing', status: 'Running', utilizationToday: 95, utilization7d: 92, queue: [], nextAvailable: 'Continuous', maintenanceDue: 'Nov 18', alerts: ['High Temp Warning'], constraints: { envelope: 'N/A', tooling: 'N/A', cert: 'NIST Standard' } },
  { id: 'COMP-OVEN-01', name: 'Walk-in Curing Oven', type: 'Thermal', group: 'Composites and Curing', status: 'Running', utilizationToday: 72, utilization7d: 80, currentWO: 'WO-7712', queue: [], nextAvailable: 'Tomorrow 08:00', maintenanceDue: 'Dec 12', alerts: [], constraints: { envelope: '10x10x20 ft', tooling: 'Multi-zone TC', cert: 'Aerospace Class' } },
  { id: 'COMP-AUTO-01', name: 'Mid-size Autoclave', type: 'Thermal/Pressure', group: 'Composites and Curing', status: 'Maintenance', utilizationToday: 0, utilization7d: 88, queue: [], nextAvailable: 'Nov 17', maintenanceDue: 'Today', alerts: ['Annual Certification In-Progress'], constraints: { envelope: '8 ft Dia x 15 ft', tooling: 'Vacuum/Pressure Ports', cert: 'Pressure Vessel Certified' } },
  { id: 'COMP-AFP-01', name: 'AFP Layup Head', type: 'Robotic', group: 'Composites and Curing', status: 'Setup', utilizationToday: 15, utilization7d: 45, currentWO: 'WO-2047-PRO', queue: [], nextAvailable: 'Today 14:00', maintenanceDue: 'Dec 20', alerts: [], constraints: { envelope: '6-Axis Reach', tooling: '1/4" Tow', cert: 'Precision Robotic' } },
  
  // CNC
  { id: 'CNC-3AX-01', name: 'VMC Alpha 3-Axis', type: 'CNC Mill', group: 'CNC Machining and Trimming', status: 'Running', utilizationToday: 92, utilization7d: 88, currentWO: 'WO-9922', queue: ['WO-9923'], nextAvailable: 'Tomorrow', maintenanceDue: 'Nov 28', alerts: [], constraints: { envelope: '40x20x20 in', tooling: 'Standard CAT40', cert: 'AS9100' } },
  { id: 'CNC-3AX-02', name: 'VMC Beta 3-Axis', type: 'CNC Mill', group: 'CNC Machining and Trimming', status: 'Idle', utilizationToday: 10, utilization7d: 55, queue: [], nextAvailable: 'Now', maintenanceDue: 'Dec 15', alerts: [], constraints: { envelope: '40x20x20 in', tooling: 'Standard CAT40', cert: 'AS9100' } },
  { id: 'CNC-5AX-01', name: 'Hermle High-Speed 5-Axis', type: 'CNC Mill', group: 'CNC Machining and Trimming', status: 'Down', utilizationToday: 0, utilization7d: 40, queue: [], nextAvailable: 'TBD', maintenanceDue: 'Critical', alerts: ['Spindle Vibration Critical'], constraints: { envelope: '32 in Swing', tooling: 'HSK-63A', cert: 'Precision High-Speed' } },
  { id: 'CNC-TURN-01', name: 'CNC Lathe Gen 2', type: 'CNC Turner', group: 'CNC Machining and Trimming', status: 'Running', utilizationToday: 68, utilization7d: 72, currentWO: 'WO-1122-R', queue: [], nextAvailable: 'Today 17:00', maintenanceDue: 'Nov 25', alerts: [], constraints: { envelope: '15 in Max Dia', tooling: 'Live Tooling', cert: 'AS9100' } },
  
  // SHEET METAL
  { id: 'SM-LASER-01', name: 'Fiber Laser 5x10', type: 'Laser Cutter', group: 'Sheet Metal and Plate Fabrication', status: 'Running', utilizationToday: 98, utilization7d: 94, currentWO: 'WO-5566-PL', queue: ['WO-5567', 'WO-5568', 'WO-5569'], nextAvailable: 'Nov 19', maintenanceDue: 'Dec 01', alerts: [], constraints: { envelope: '5x10 ft Bed', tooling: 'Oxygen/Nitrogen Assist', cert: 'Precision Cutting' } },
  { id: 'SM-WATER-01', name: 'Abrasive Waterjet', type: 'Waterjet', group: 'Sheet Metal and Plate Fabrication', status: 'Running', utilizationToday: 45, utilization7d: 52, currentWO: 'WO-3321-BS', queue: [], nextAvailable: 'Today 16:00', maintenanceDue: 'Nov 20', alerts: [], constraints: { envelope: '5x10 ft Bed', tooling: 'Abrasive Feed', cert: 'Cold Cutting' } },
  { id: 'SM-BRAKE-01', name: 'CNC Press Brake 200T', type: 'Bender', group: 'Sheet Metal and Plate Fabrication', status: 'Idle', utilizationToday: 22, utilization7d: 40, queue: [], nextAvailable: 'Now', maintenanceDue: 'Jan 10', alerts: [], constraints: { envelope: '12 ft Length', tooling: 'Standard Multi-V', cert: 'Precision Forming' } },
  
  // ADDITIVE
  { id: 'AM-FDM-01', name: 'Industrial FDM Printer', type: 'Additive', group: 'Additive Manufacturing', status: 'Running', utilizationToday: 100, utilization7d: 98, currentWO: 'WO-9012', queue: ['WO-9013'], nextAvailable: 'Tomorrow 10:00', maintenanceDue: 'Dec 01', alerts: [], constraints: { envelope: '24x24x36 in', tooling: 'Dual Extrusion', cert: 'PEEK/Ultem Certified' } },
  { id: 'AM-SLS-01', name: 'Polymer SLS System', type: 'Additive', group: 'Additive Manufacturing', status: 'Idle', utilizationToday: 0, utilization7d: 85, queue: [], nextAvailable: 'Now', maintenanceDue: 'Nov 22', alerts: [], constraints: { envelope: '15x15x15 in', tooling: 'Nylon 12', cert: 'Isotropic Strength' } },
  { id: 'AM-METAL-01', name: 'Phase 3 Metal Additive', type: 'Additive', group: 'Additive Manufacturing', status: 'Planned', utilizationToday: 0, utilization7d: 0, queue: [], nextAvailable: 'Q3 2024', maintenanceDue: 'N/A', alerts: [], constraints: { envelope: '10x10x12 in', tooling: 'Ti64/316L', cert: 'ITAR Planned' } },

  // METROLOGY
  { id: 'MET-CMM-01', name: 'Zeiss Bridge CMM', type: 'Inspection', group: 'Metrology and Inspection', status: 'Running', utilizationToday: 75, utilization7d: 82, currentWO: 'CERT-001', queue: ['CERT-002', 'CERT-003'], nextAvailable: 'Today 19:00', maintenanceDue: 'Dec 15', alerts: [], constraints: { envelope: '40x60x30 in', tooling: 'Star Probe Kit', cert: 'ISO 17025 Calibrated' } },
  { id: 'MET-ARM-01', name: 'Portable CMM Arm', type: 'Inspection', group: 'Metrology and Inspection', status: 'Idle', utilizationToday: 15, utilization7d: 30, queue: [], nextAvailable: 'Now', maintenanceDue: 'Nov 30', alerts: [], constraints: { envelope: '8 ft Radius', tooling: 'Laser Scanner', cert: 'Field Certified' } },
  { id: 'MET-TRACK-01', name: 'Phase 2 Laser Tracker', type: 'Inspection', group: 'Metrology and Inspection', status: 'Planned', utilizationToday: 0, utilization7d: 0, queue: [], nextAvailable: 'Q1 2024', maintenanceDue: 'N/A', alerts: [], constraints: { envelope: '100 ft Radius', tooling: 'SMR Kit', cert: 'Large Volumne Certified' } },

  // ELECTRICAL
  { id: 'ELEC-CUT-01', name: 'Wire Cut & Strip System', type: 'Avionics', group: 'Electrical, Harness, and Avionics Integration', status: 'Running', utilizationToday: 55, utilization7d: 62, currentWO: 'WO-9011-HAR', queue: [], nextAvailable: 'Today 16:30', maintenanceDue: 'Jan 05', alerts: [], constraints: { envelope: '30 AWG to 8 AWG', tooling: 'Multi-blade', cert: 'Standard Wire' } },
  { id: 'ELEC-TEST-01', name: 'HV Cable Tester', type: 'Test', group: 'Electrical, Harness, and Avionics Integration', status: 'Idle', utilizationToday: 0, utilization7d: 25, queue: [], nextAvailable: 'Now', maintenanceDue: 'Dec 22', alerts: [], constraints: { envelope: '1500V DC', tooling: 'Universal Adapters', cert: 'High Voltage Certified' } },
  { id: 'ELEC-ESD-01', name: 'ESD Bench Cluster 1-8', type: 'Assembly', group: 'Electrical, Harness, and Avionics Integration', status: 'Running', utilizationToday: 100, utilization7d: 95, currentWO: 'NightOwl Avionics Stack', queue: [], nextAvailable: 'Continuous', maintenanceDue: 'Monthly', alerts: [], constraints: { envelope: 'ESD-Safe Workstation', tooling: 'Micro-soldering', cert: 'IPC-A-610' } },
];

const CATEGORIES = [
  'Composites and Curing',
  'CNC Machining and Trimming',
  'Sheet Metal and Plate Fabrication',
  'Additive Manufacturing',
  'Metrology and Inspection',
  'Electrical, Harness, and Avionics Integration',
  'Environmental Test and Pre-Compliance',
  'Finishing and Surface Preparation',
  'Facilities, Utilities, and Material Handling'
];

interface EquipmentCapacityProps {
  initialView?: 'OVERVIEW' | 'DETAIL' | 'MAINTENANCE';
  initialMachineId?: string;
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
}

const EquipmentCapacity: React.FC<EquipmentCapacityProps> = ({ initialView = 'OVERVIEW', initialMachineId, onNavigate, onBack }) => {
  const [view, setView] = useState<'OVERVIEW' | 'DETAIL' | 'MAINTENANCE'>(initialView);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(initialMachineId || null);

  const activeFleet = useMemo(() => MOCK_FLEET.filter(m => m.status !== 'Planned'), []);
  
  const metrics = useMemo(() => {
    const totalOnline = activeFleet.filter(m => m.status === 'Running').length;
    const avgUtil = Math.round(activeFleet.reduce((acc, m) => acc + m.utilizationToday, 0) / activeFleet.length);
    const queuedJobs = activeFleet.reduce((acc, m) => acc + m.queue.length, 0);
    const constrained = activeFleet.filter(m => m.status === 'Down' || m.status === 'Maintenance').length;
    return { totalOnline, avgUtil, queuedJobs, constrained };
  }, [activeFleet]);

  const selectedMachine = useMemo(() => MOCK_FLEET.find(m => m.id === selectedMachineId), [selectedMachineId]);

  const renderContent = () => {
    switch (view) {
      case 'OVERVIEW':
        return <FleetOverview fleet={MOCK_FLEET} onSelectMachine={(id) => { setSelectedMachineId(id); setView('DETAIL'); }} metrics={metrics} />;
      case 'DETAIL':
        return selectedMachine ? <MachineDetail machine={selectedMachine} onBack={() => setView('OVERVIEW')} onNavigateWO={(woId) => onNavigate('Work Orders', { view: 'DETAIL', woId })} /> : null;
      case 'MAINTENANCE':
        return <MaintenanceView fleet={MOCK_FLEET} onSelectMachine={(id) => { setSelectedMachineId(id); setView('DETAIL'); }} onBack={() => setView('OVERVIEW')} onNavigateWO={(woId) => onNavigate('Work Orders', { view: 'DETAIL', woId })} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Forge-Owned</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Asgard Forge: Austin Fleet</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Facility Node Telemetry & Capacity Management</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-2xl">
          {[
            { id: 'OVERVIEW', label: 'Fleet Overview', icon: LayoutGrid },
            { id: 'MAINTENANCE', label: 'Maintenance', icon: Wrench },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id as any)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${
                view === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-2">
        {renderContent()}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: FLEET OVERVIEW ---
const FleetOverview: React.FC<{ fleet: Machine[], onSelectMachine: (id: string) => void, metrics: any }> = ({ fleet, onSelectMachine, metrics }) => (
  <div className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {[
         { label: 'Machines Online', val: metrics.totalOnline, desc: 'Actively Running Status', color: 'text-white' },
         { label: 'Facility Utilization', val: `${metrics.avgUtil}%`, desc: 'Today\'s Total Fleet Workload', color: 'text-primary' },
         { label: 'Queued Jobs', val: metrics.queuedJobs, desc: 'Next Sequence Backlog', color: 'text-white' },
         { label: 'Active Constraints', val: metrics.constrained, desc: 'Nodes Down or in Maint.', color: 'text-red-500' },
       ].map(m => (
         <div key={m.label} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <Cpu className="w-12 h-12 text-primary" />
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">{m.label}</p>
            <p className={`text-5xl font-bold ${m.color} tracking-tighter leading-none mb-4`}>{m.val}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{m.desc}</p>
         </div>
       ))}
    </div>

    {CATEGORIES.map(cat => {
      const machines = fleet.filter(m => m.group === cat);
      if (machines.length === 0) return null;
      return (
        <section key={cat} className="space-y-6">
           <h3 className="text-xl font-bold text-white uppercase italic tracking-tight border-b border-slate-800 pb-4 flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" /> {cat}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {machines.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => m.status !== 'Planned' && onSelectMachine(m.id)}
                  className={`bg-slate-900 border p-6 rounded-3xl text-left transition-all relative group shadow-xl ${
                    m.status === 'Planned' ? 'border-slate-800 opacity-40 cursor-default' : 'border-slate-800 hover:border-primary/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                     <div className={`p-3 rounded-xl ${
                       m.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                       m.status === 'Down' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                       m.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                       'bg-slate-800 text-slate-500 border border-slate-700'
                     }`}>
                        <Cpu className="w-5 h-5" />
                     </div>
                     <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                       m.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                       m.status === 'Down' ? 'bg-red-500 text-white border-red-400 shadow-lg' :
                       m.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                       'bg-slate-800 text-slate-500 border-slate-700'
                     }`}>{m.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{m.name}</h4>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-4 italic">{m.id}</p>
                  
                  {m.status !== 'Planned' ? (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                          <span className="text-slate-500">Utilization</span>
                          <span className="text-primary">{m.utilizationToday}%</span>
                       </div>
                       <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${m.utilizationToday}%` }} />
                       </div>
                       <div className="flex justify-between items-center pt-2 text-[8px] font-black text-slate-600 uppercase tracking-widest border-t border-slate-800">
                          <span>Next Slot: {m.nextAvailable}</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-700 font-black uppercase italic mt-4">Node Offline: Phase Expansion Queued</p>
                  )}
                </button>
              ))}
           </div>
        </section>
      );
    })}
  </div>
);

// --- SUB-COMPONENT: MACHINE DETAIL ---
const MachineDetail: React.FC<{ machine: Machine, onBack: () => void, onNavigateWO: (id: string) => void }> = ({ machine, onBack, onNavigateWO }) => {
  const [activeTab, setActiveTab] = useState('Queue');

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
         <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Overview
       </button>

       <div className="bg-slate-900 border border-slate-800 p-12 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex items-center gap-12">
             <div className="p-12 bg-slate-950/60 rounded-[48px] border border-slate-800 shadow-2xl relative group">
                <Cpu className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse ${
                  machine.status === 'Running' ? 'bg-emerald-500' : machine.status === 'Down' ? 'bg-red-500' : 'bg-amber-500'
                }`}>
                   <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
             </div>
             <div>
                <div className="flex items-center gap-4 mb-4">
                   <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">Machine Online</span>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{machine.type}</span>
                </div>
                <h3 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{machine.name}</h3>
                <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                   <span className="flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /> Node: {machine.id}</span>
                   <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Status: {machine.status.toUpperCase()}</span>
                   <span className="flex items-center gap-2 text-emerald-400"><Gauge className="w-4 h-4" /> Util: {machine.utilizationToday}%</span>
                </div>
             </div>
          </div>
          <div className="relative z-10 text-right lg:border-l lg:border-slate-800 lg:pl-12 h-full flex flex-col justify-center">
             <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest block mb-3 italic">Next Cycle Ready</span>
             <p className="text-5xl font-black tracking-tighter italic text-white">{machine.nextAvailable}</p>
             <div className="mt-4 flex items-center justify-end gap-2 text-primary font-black text-xs uppercase italic tracking-widest">
                <Sparkles className="w-4 h-4" /> 0.98 Telemetry Health
             </div>
          </div>
       </div>

       {/* Sub Navigation */}
       <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto bg-slate-950/50 sticky top-16 z-20 backdrop-blur-md px-2">
        {['Queue', 'Performance', 'Maintenance', 'Constraints'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap italic ${
              activeTab === tab 
              ? 'text-primary border-primary bg-primary/5' 
              : 'text-slate-600 border-transparent hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
         {activeTab === 'Queue' && <QueueTab machine={machine} onNavigateWO={onNavigateWO} />}
         {activeTab === 'Performance' && <PerformanceTab machine={machine} />}
         {activeTab === 'Maintenance' && <MaintenanceTab machine={machine} />}
         {activeTab === 'Constraints' && <ConstraintsTab machine={machine} />}
      </div>
    </div>
  );
};

// --- TAB: QUEUE ---
const QueueTab = ({ machine, onNavigateWO }: { machine: Machine, onNavigateWO: any }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 animate-in fade-in duration-500">
    <div className="lg:col-span-2 space-y-8">
       <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl">
          <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
             <History className="w-6 h-6 text-primary" /> Active Job Stream
          </h4>
          <div className="space-y-6">
             {machine.currentWO && (
               <div onClick={() => onNavigateWO(machine.currentWO!)} className="p-8 bg-primary/5 border border-primary/20 rounded-[32px] flex justify-between items-center group cursor-pointer hover:bg-primary/10 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="p-4 bg-primary/10 rounded-2xl text-primary animate-pulse"><Activity className="w-8 h-8" /></div>
                     <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Current Execution</p>
                        <h5 className="text-2xl font-bold text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{machine.currentWO}</h5>
                     </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-all" />
               </div>
             )}
             {machine.queue.length > 0 ? machine.queue.map(q => (
               <div key={q} onClick={() => onNavigateWO(q)} className="p-8 bg-slate-800/40 border border-slate-800 rounded-[32px] flex justify-between items-center group cursor-pointer hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="p-4 bg-slate-900 rounded-2xl text-slate-600"><Clock className="w-8 h-8" /></div>
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Next in Queue</p>
                        <h5 className="text-2xl font-bold text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{q}</h5>
                     </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
               </div>
             )) : (
              <div className="p-10 text-center border-2 border-dashed border-slate-800 rounded-[32px] opacity-30">
                <Box className="w-12 h-12 mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No additional jobs queued</p>
              </div>
             )}
          </div>
       </section>
    </div>
    <div className="space-y-6">
       <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 block italic">Queue Insights</h4>
          <div className="space-y-6">
             <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-slate-400">Total Queue Depth</span>
                <span className="text-white">{machine.queue.length + (machine.currentWO ? 1 : 0)} Jobs</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-slate-400">Estimated Run-time</span>
                <span className="text-primary">{machine.queue.length * 4}h 15m</span>
             </div>
          </div>
       </div>
    </div>
  </div>
);

// --- TAB: PERFORMANCE ---
const PerformanceTab = ({ machine }: { machine: Machine }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 text-center space-y-12 shadow-2xl relative overflow-hidden animate-in fade-in duration-500 px-2">
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
     <div className="flex flex-col items-center gap-6">
       <div className="w-24 h-24 bg-primary/10 rounded-[40px] border border-primary/20 flex items-center justify-center shadow-xl">
          <BarChart3 className="w-12 h-12 text-primary" />
       </div>
       <div className="space-y-2">
          <h4 className="text-4xl font-bold text-white tracking-tighter uppercase italic">OEE Performance Stream</h4>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">Real-time edge telemetry for Node: {machine.id}</p>
       </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="p-8 bg-slate-800/40 rounded-[32px] border border-slate-800 group hover:border-primary/30 transition-all">
           <span className="text-[10px] text-slate-500 font-black uppercase block mb-3 italic tracking-widest">Availability</span>
           <p className="text-4xl font-black text-white italic tracking-tighter">94.2%</p>
           <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-bold text-emerald-400 uppercase">
              <TrendingUp className="w-3 h-3" /> +1.2% Shift Trend
           </div>
        </div>
        <div className="p-8 bg-slate-800/40 rounded-[32px] border border-slate-800 group hover:border-primary/30 transition-all">
           <span className="text-[10px] text-slate-500 font-black uppercase block mb-3 italic tracking-widest">Quality (FPY)</span>
           <p className="text-4xl font-black text-white italic tracking-tighter">99.8%</p>
           <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-bold text-emerald-400 uppercase">
              <ShieldCheck className="w-3 h-3" /> Nominal
           </div>
        </div>
        <div className="p-8 bg-slate-800/40 rounded-[32px] border border-slate-800 group hover:border-primary/30 transition-all">
           <span className="text-[10px] text-slate-500 font-black uppercase block mb-3 italic tracking-widest">Performance</span>
           <p className="text-4xl font-black text-white italic tracking-tighter">{machine.utilization7d}%</p>
           <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-bold text-primary uppercase">
              <Clock className="w-3 h-3" /> 7d Moving Avg
           </div>
        </div>
     </div>

     <div className="max-w-4xl mx-auto p-10 bg-slate-950/50 rounded-[40px] border border-slate-800 border-dashed">
        <div className="flex items-center gap-4 mb-8">
           <Sparkles className="w-6 h-6 text-primary" />
           <p className="text-xs font-bold text-white uppercase tracking-widest italic">AI Throughput Insights</p>
        </div>
        <p className="text-sm text-slate-400 font-medium leading-relaxed italic text-left">
          "Current sensor data indicates {machine.name} is executing {machine.group.includes('CNC') ? 'milling cycles' : 'build protocols'} at 12% above nominal velocity. Cooling cycles for {machine.id} are tracking 0.2s faster than historical baseline. Capacity remaining for current shift: 4.2h."
        </p>
     </div>
  </div>
);

// --- TAB: MAINTENANCE ---
const MaintenanceTab = ({ machine }: { machine: Machine }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 animate-in fade-in duration-500">
     <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5"><Wrench className="w-48 h-48 text-amber-500" /></div>
        <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3 relative z-10">
           <ShieldAlert className="w-6 h-6 text-amber-500" /> Maintenance Status
        </h4>
        <div className="space-y-8 relative z-10">
           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700">
                 <span className="text-[10px] text-slate-500 font-black uppercase block mb-1 italic">Last Service</span>
                 <p className="text-xl font-bold text-white italic">Oct 12, 2023</p>
                 <p className="text-[9px] text-slate-600 font-bold uppercase mt-2">Interval: 1200h</p>
              </div>
              <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700">
                 <span className="text-[10px] text-slate-500 font-black uppercase block mb-1 italic">Next Due</span>
                 <p className="text-xl font-bold text-primary italic">{machine.maintenanceDue}</p>
                 <p className="text-[9px] text-slate-600 font-bold uppercase mt-2">Remaining: 142h</p>
              </div>
           </div>
           <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                 <span className="text-amber-500 italic">Predictive Wear Analysis</span>
                 <span className="text-white">96% Confident</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '82%' }} />
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">Spindle vibration harmonics suggest preventative maintenance window on {machine.maintenanceDue}.</p>
           </div>
        </div>
     </section>

     <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl">
        <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
           <History className="w-6 h-6 text-primary" /> Service History
        </h4>
        <div className="space-y-6">
           {[
             { date: 'Oct 12', act: 'Annual Recertification', tech: 'R. Davis', type: 'MAINT' },
             { date: 'Sep 05', act: 'Emergency Spindle Calibration', tech: 'S. Knight', type: 'FAULT' },
             { date: 'Aug 22', act: 'Filter & Lubricant Refresh', tech: 'M. Gomez', type: 'ROUTINE' }
           ].map((h, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-800/40 border border-slate-800 rounded-3xl group hover:border-slate-600 transition-all">
                 <div className="flex gap-6 items-center">
                    <p className="text-sm font-bold text-slate-500 italic">{h.date}</p>
                    <div>
                       <p className="text-sm font-bold text-white uppercase italic">{h.act}</p>
                       <p className="text-[9px] text-slate-600 font-black uppercase mt-1">Operator: {h.tech}</p>
                    </div>
                 </div>
                 <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${
                   h.type === 'FAULT' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-slate-900 text-slate-500 border-slate-700'
                 }`}>{h.type}</span>
              </div>
           ))}
        </div>
     </section>
  </div>
);

// --- TAB: CONSTRAINTS ---
const ConstraintsTab = ({ machine }: { machine: Machine }) => {
  // Safety check to prevent crashes if constraints object is missing
  const constraints = machine.constraints || { envelope: 'DATA_PENDING', tooling: 'DATA_PENDING', cert: 'DATA_PENDING' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 animate-in fade-in duration-500">
       <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5"><Maximize className="w-48 h-48 text-primary" /></div>
          <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3 relative z-10">
             <Maximize className="w-6 h-6 text-primary" /> Operational Envelope
          </h4>
          <div className="space-y-8 relative z-10">
             <div className="flex justify-between items-center border-b border-slate-800/50 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Effective Workspace</span>
                <span className="text-sm font-bold text-white italic">{constraints.envelope}</span>
             </div>
             <div className="flex justify-between items-center border-b border-slate-800/50 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tooling Capability</span>
                <span className="text-sm font-bold text-white italic">{constraints.tooling}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Node Classification</span>
                <span className="text-sm font-bold text-primary italic uppercase">{constraints.cert}</span>
             </div>
          </div>
       </section>

       <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Target className="w-24 h-24 text-primary" /></div>
          <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3 relative z-10">
             <ShieldCheck className="w-6 h-6 text-primary" /> Network Constraints
          </h4>
          <div className="space-y-8 relative z-10">
             <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 border-dashed space-y-4">
                <p className="text-[10px] text-slate-500 font-black uppercase italic border-b border-slate-800 pb-2">Active Floor Limitations</p>
                <div className="space-y-4 pt-2">
                   <div className="flex items-start gap-4">
                      <Lock className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-[10px] text-slate-300 font-medium leading-relaxed italic">Restricted to Level L-5 Classified manufacturing for programs with Flight heritage requirements.</p>
                   </div>
                   <div className="flex items-start gap-4">
                      <Box className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-[10px] text-slate-300 font-medium leading-relaxed italic">Material availability constraint: Gated on titanium hex-bolt arrival for upcoming batch.</p>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4 text-slate-500 font-black text-[9px] uppercase tracking-[0.3em] pl-2">
                <Fingerprint className="w-4 h-4 text-primary" /> NIST 800-171 COMPLIANT NODE
             </div>
          </div>
       </section>
    </div>
  );
};

// Fix: Added missing MaintenanceView component
const MaintenanceView: React.FC<{ 
  fleet: Machine[], 
  onSelectMachine: (id: string) => void, 
  onBack: () => void,
  onNavigateWO: (woId: string) => void 
}> = ({ fleet, onSelectMachine, onBack, onNavigateWO }) => {
  const maintenanceMachines = fleet.filter(m => m.status === 'Maintenance' || m.status === 'Down' || m.alerts.length > 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
           <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3 italic">
              <Wrench className="w-6 h-6 text-amber-500" /> Maintenance & Fault Log
           </h3>
        </div>
        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Machine Node</th>
                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Status</th>
                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Active Alerts</th>
                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Next Service</th>
                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-800">
              {maintenanceMachines.length > 0 ? (
                maintenanceMachines.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-all cursor-pointer group" onClick={() => onSelectMachine(m.id)}>
                    <td className="px-8 py-6">
                        <p className="text-sm font-bold text-white uppercase italic">{m.name}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter mt-1">{m.id}</p>
                    </td>
                    <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                          m.status === 'Down' ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20' : 
                          m.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>{m.status}</span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="space-y-1">
                          {m.alerts.map(a => (
                            <div key={a} className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase italic">
                              <AlertTriangle className="w-3 h-3" /> {a}
                            </div>
                          ))}
                          {m.alerts.length === 0 && <span className="text-xs text-slate-600 italic">No critical alerts</span>}
                        </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 italic uppercase tracking-tighter">{m.maintenanceDue}</td>
                    <td className="px-8 py-6 text-right">
                        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest italic">No active maintenance constraints</td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentCapacity;
