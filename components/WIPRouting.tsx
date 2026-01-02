
import React, { useState, useMemo } from 'react';
import { 
  Zap, Activity, Box, MapPin, ArrowRight, Clock, 
  AlertTriangle, CheckCircle2, ChevronRight, Filter, 
  Search, ShieldAlert, Hammer, Layers, FlaskConical,
  Truck, Target, Gauge, ArrowUpRight, BarChart3,
  Calendar, TrendingUp, ChevronDown, ChevronUp,
  Sparkles
} from 'lucide-react';

// --- TYPES ---
type WipStatus = 'FLOWING' | 'WAITING' | 'BLOCKED';
type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM';

interface RoutingStep {
  process: string;
  plannedDays: number;
  expectedDays: number;
  status: 'COMPLETE' | 'ACTIVE' | 'QUEUED' | 'DELAYED';
  reason?: string;
}

interface WipItem {
  id: string;
  woId: string;
  name: string;
  program: string;
  currentOp: string;
  timeInStep: string;
  nextOp: string;
  blockingReason?: string;
  priority: Priority;
  expectedCompletion: string;
  status: WipStatus;
  gate: string;
  progress: number;
  routingForecast: RoutingStep[];
}

// --- CONSTANTS ---
const GATES = [
  'Receiving / Incoming',
  'Machining',
  'Composite Layup',
  'Curing / Autoclave',
  'Finishing',
  'Integration',
  'Test',
  'Ready for Release'
];

// --- SEEDED DATA: ASGARD FORGE AUSTIN ---
const MOCK_WIP: WipItem[] = [
  { 
    id: 'SN-7721-01', woId: 'WO-9921', name: 'Main Thrust Plate', program: 'Falcon-Heavy', gate: 'Integration', currentOp: 'Avionics Install', timeInStep: '4h', nextOp: 'System Test', priority: 'HIGH', expectedCompletion: 'Today 18:00', status: 'FLOWING', progress: 65,
    routingForecast: [
      { process: 'Machining', plannedDays: 10, expectedDays: 10, status: 'COMPLETE' },
      { process: 'Finishing', plannedDays: 4, expectedDays: 4, status: 'COMPLETE' },
      { process: 'Integration', plannedDays: 5, expectedDays: 5, status: 'ACTIVE' },
      { process: 'Test', plannedDays: 3, expectedDays: 3, status: 'QUEUED' },
      { process: 'Release', plannedDays: 1, expectedDays: 1, status: 'QUEUED' }
    ]
  },
  { 
    id: 'SN-8802-05', woId: 'WO-8804', name: 'Ablative Shield S1', program: 'Starship', gate: 'Receiving / Incoming', currentOp: 'Material Inspection', timeInStep: '3d', nextOp: 'Layup Alpha', blockingReason: 'Delayed Alloy SHIP-0994', priority: 'CRITICAL', expectedCompletion: 'Nov 22', status: 'BLOCKED', progress: 5,
    routingForecast: [
      { process: 'Receiving', plannedDays: 1, expectedDays: 4, status: 'ACTIVE', reason: 'Supply Chain Constraint' },
      { process: 'Layup', plannedDays: 6, expectedDays: 6, status: 'QUEUED' },
      { process: 'Autoclave', plannedDays: 2, expectedDays: 2, status: 'QUEUED' },
      { process: 'Finishing', plannedDays: 3, expectedDays: 3, status: 'QUEUED' },
      { process: 'Release', plannedDays: 1, expectedDays: 1, status: 'QUEUED' }
    ]
  },
  { 
    id: 'SN-9922-01', woId: 'WO-9922', name: 'Support Strut P', program: 'Falcon-Heavy', gate: 'Machining', currentOp: '5-Axis Finishing', timeInStep: '14h', nextOp: 'Anodize', priority: 'MEDIUM', expectedCompletion: 'Yesterday (Overdue)', status: 'WAITING', progress: 40,
    routingForecast: [
      { process: 'Machining', plannedDays: 8, expectedDays: 11, status: 'ACTIVE', reason: 'Tooling Backlog' },
      { process: 'Finishing', plannedDays: 3, expectedDays: 3, status: 'QUEUED' },
      { process: 'Test', plannedDays: 2, expectedDays: 2, status: 'QUEUED' },
      { process: 'Release', plannedDays: 1, expectedDays: 1, status: 'QUEUED' }
    ]
  },
  { 
    id: 'SN-9011-42', woId: 'WO-9012', name: 'Cooling Manifold', program: 'NightOwl', gate: 'Test', currentOp: 'Pressure Proof', timeInStep: '2h', nextOp: 'Ready', priority: 'HIGH', expectedCompletion: 'Today 15:30', status: 'FLOWING', progress: 95,
    routingForecast: [
      { process: 'Machining', plannedDays: 5, expectedDays: 5, status: 'COMPLETE' },
      { process: 'Test', plannedDays: 2, expectedDays: 2, status: 'ACTIVE' },
      { process: 'Release', plannedDays: 1, expectedDays: 1, status: 'QUEUED' }
    ]
  },
  { 
    id: 'SN-2047-12', woId: 'WO-2047', name: 'Payload Bracket', program: 'NightOwl', gate: 'Composite Layup', currentOp: 'Ply Deposition', timeInStep: '8h', nextOp: 'Autoclave 01', priority: 'MEDIUM', expectedCompletion: 'Nov 19', status: 'FLOWING', progress: 12,
    routingForecast: [
      { process: 'Layup', plannedDays: 4, expectedDays: 4, status: 'ACTIVE' },
      { process: 'Curing', plannedDays: 2, expectedDays: 2, status: 'QUEUED' },
      { process: 'Machining', plannedDays: 3, expectedDays: 3, status: 'QUEUED' },
      { process: 'Release', plannedDays: 1, expectedDays: 1, status: 'QUEUED' }
    ]
  },
];

const WIPRouting: React.FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [activeGateFilter, setActiveGateFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWOs, setExpandedWOs] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedWOs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedWOs(next);
  };

  // --- COMPUTATIONS ---
  const filteredWip = useMemo(() => {
    return MOCK_WIP.filter(item => {
      const matchesSearch = item.woId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.program.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'ALL' || 
                          (filterType === 'BLOCKED' && item.status === 'BLOCKED') ||
                          (filterType === 'PROCESSING' && item.status === 'FLOWING') ||
                          (filterType === 'QUEUED' && item.status === 'WAITING');

      const matchesGate = !activeGateFilter || item.gate === activeGateFilter;
      
      return matchesSearch && matchesType && matchesGate;
    });
  }, [searchQuery, filterType, activeGateFilter]);

  const metrics = useMemo(() => {
    const total = MOCK_WIP.length;
    const processing = MOCK_WIP.filter(i => i.status === 'FLOWING').length;
    const queued = MOCK_WIP.filter(i => i.status === 'WAITING').length;
    const blocked = MOCK_WIP.filter(i => i.status === 'BLOCKED').length;
    
    const gateStats = GATES.map(gate => ({
      gate,
      congested: MOCK_WIP.filter(i => i.gate === gate && (i.status === 'WAITING' || i.status === 'BLOCKED')).length
    }));
    const bottleneck = gateStats.sort((a, b) => b.congested - a.congested)[0].gate;

    return { total, processing, queued, blocked, bottleneck };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 overflow-y-auto max-h-[calc(100vh-80px)] vertical-scroll custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Forge-Owned</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">WIP & Routing Control Board</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Vertical Flow Architecture • Node: Austin</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:ring-1 focus:ring-primary w-64 shadow-xl" 
                placeholder="Filter WIP, WO, Program..." 
              />
           </div>
        </div>
      </div>

      {/* --- 1. FLOW HEALTH SUMMARY --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-2 shrink-0">
        {[
          { label: 'Total WIP Units', val: metrics.total, type: 'ALL', color: 'text-white' },
          { label: 'Actively Processing', val: metrics.processing, type: 'PROCESSING', color: 'text-emerald-400' },
          { label: 'WIP Queued', val: metrics.queued, type: 'QUEUED', color: 'text-amber-400' },
          { label: 'WIP Blocked', val: metrics.blocked, type: 'BLOCKED', color: 'text-red-500' },
          { label: 'Bottleneck Process', val: metrics.bottleneck.split(' ')[0], type: 'ALL', color: 'text-primary' },
          { label: 'Avg Queue Time', val: '4.2h', type: 'ALL', color: 'text-slate-400' },
        ].map(m => (
          <button 
            key={m.label} 
            onClick={() => { setFilterType(m.type); setActiveGateFilter(null); }}
            className={`bg-slate-900 border p-6 rounded-[32px] text-left transition-all group shadow-xl relative overflow-hidden ${
              filterType === m.type && !activeGateFilter ? 'border-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic leading-none">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color} tracking-tighter leading-none`}>{m.val}</p>
          </button>
        ))}
      </div>

      {/* --- 2. PROCESS CAPACITY PANELS --- */}
      <div className="space-y-4 px-2">
         <div className="flex items-center gap-3 mb-6">
            <Gauge className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Process Capacity Panels</h3>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GATES.map(gate => {
              const gateWip = MOCK_WIP.filter(i => i.gate === gate);
              const flowing = gateWip.filter(i => i.status === 'FLOWING').length;
              const queued = gateWip.filter(i => i.status !== 'FLOWING').length;
              const isCongested = queued > 1;
              const isBlocked = gateWip.some(i => i.status === 'BLOCKED');
              
              const statusColor = isBlocked ? 'text-red-500' : isCongested ? 'text-amber-500' : 'text-emerald-500';
              const borderColor = isBlocked ? 'border-red-500/30' : isCongested ? 'border-amber-500/30' : 'border-slate-800';

              return (
                <button 
                  key={gate}
                  onClick={() => { setActiveGateFilter(gate); setFilterType('ALL'); }}
                  className={`bg-slate-900 border ${borderColor} p-6 rounded-3xl text-left transition-all hover:bg-slate-800 group relative ${
                    activeGateFilter === gate ? 'ring-2 ring-primary ring-offset-4 ring-offset-slate-950' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest max-w-[120px]">{gate}</h4>
                    <div className={`w-2 h-2 rounded-full ${statusColor.replace('text', 'bg')} ${isBlocked ? 'animate-pulse' : ''}`} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">Process</p>
                        <p className="text-xl font-bold text-white">{flowing}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">Queued</p>
                        <p className={`text-xl font-bold ${queued > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{queued}</p>
                     </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                     <span className="text-slate-600 italic">Avg Time: 1.2h</span>
                     {isBlocked && <span className="text-red-400">Gated</span>}
                  </div>
                </button>
              );
            })}
         </div>
      </div>

      {/* --- 3. ACTIVE WIP LIST --- */}
      <div className="space-y-6 px-2">
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
               <Activity className="w-5 h-5 text-primary" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">
                  Active WIP Execution List
                  {activeGateFilter && <span className="ml-2 text-primary">| {activeGateFilter}</span>}
               </h3>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing {filteredWip.length} items</p>
         </div>

         <div className="space-y-4">
            {filteredWip.map(item => (
              <div 
                key={item.id}
                className={`bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl transition-all ${
                  expandedWOs.has(item.id) ? 'border-primary/30' : 'hover:border-slate-700'
                }`}
              >
                {/* WIP Row */}
                <div className="p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                   <div className="flex items-center gap-8">
                      <div className={`p-4 rounded-2xl border transition-all ${
                        item.status === 'BLOCKED' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        item.status === 'WAITING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                         <Box className="w-8 h-8" />
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                            <span className="mono text-xs font-black text-primary uppercase">{item.woId}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter ${
                              item.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}>{item.priority}</span>
                         </div>
                         <h4 className="text-2xl font-bold text-white uppercase italic tracking-tighter leading-none mb-2">{item.name}</h4>
                         <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /> {item.gate}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary" /> {item.timeInStep} in Step</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-10 w-full lg:w-auto">
                      <div className="flex-1 lg:w-48">
                         <div className="flex justify-between items-center mb-2 text-[9px] font-black uppercase tracking-widest">
                            <span className="text-slate-600 italic">Expected Completion</span>
                            <span className={item.status === 'WAITING' ? 'text-amber-400' : 'text-slate-400'}>{item.expectedCompletion}</span>
                         </div>
                         <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${item.status === 'BLOCKED' ? 'bg-red-500' : item.status === 'WAITING' ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${item.progress}%` }} />
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <button 
                            onClick={() => toggleExpand(item.id)}
                            className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                         >
                            {expandedWOs.has(item.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            Routing
                         </button>
                         <button 
                            onClick={() => onNavigate('Work Orders', { view: 'DETAIL', woId: item.woId })}
                            className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary hover:bg-primary/20 transition-all"
                         >
                            <ArrowUpRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>

                {item.blockingReason && (
                   <div className="px-8 pb-4">
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4">
                         <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                         <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Blocking Reason: {item.blockingReason}</p>
                      </div>
                   </div>
                )}

                {/* --- 4. ROUTING FORECAST (VERTICAL) --- */}
                {expandedWOs.has(item.id) && (
                   <div className="px-8 pb-10 pt-4 border-t border-slate-800 bg-slate-950/30 animate-in slide-in-from-top duration-300">
                      <div className="flex items-center gap-3 mb-8">
                         <TrendingUp className="w-4 h-4 text-primary" />
                         <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Execution Routing Forecast</h5>
                      </div>
                      
                      <div className="space-y-6 pl-6 relative">
                         <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-800" />
                         {item.routingForecast.map((step, idx) => (
                           <div key={idx} className="relative group">
                              <div className={`absolute -left-[14px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                                step.status === 'COMPLETE' ? 'bg-emerald-500 border-emerald-400' :
                                step.status === 'ACTIVE' ? 'bg-primary border-primary ring-4 ring-primary/10 animate-pulse' :
                                step.status === 'DELAYED' ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/20' :
                                'bg-slate-900 border-slate-800'
                              }`} />
                              <div className="flex items-start justify-between">
                                 <div>
                                    <p className={`text-sm font-bold uppercase tracking-tight ${step.status === 'COMPLETE' ? 'text-slate-500' : 'text-white'}`}>{step.process}</p>
                                    <div className="flex items-center gap-4 mt-1 text-[9px] font-black uppercase tracking-tighter">
                                       <span className={step.status === 'COMPLETE' ? 'text-slate-700' : 'text-slate-500'}>Status: {step.status}</span>
                                       {step.reason && <span className="text-red-500 flex items-center gap-1"><AlertTriangle className="w-2 h-2" /> {step.reason}</span>}
                                    </div>
                                 </div>
                                 <div className="text-right flex items-center gap-6">
                                    <div className="space-y-1">
                                       <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest italic leading-none">Planned</p>
                                       <p className="text-xs font-black text-slate-500">{step.plannedDays}d</p>
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest italic leading-none">Expected</p>
                                       <p className={`text-xs font-black ${step.expectedDays > step.plannedDays ? 'text-red-400' : 'text-slate-300'}`}>{step.expectedDays}d</p>
                                    </div>
                                    {step.expectedDays > step.plannedDays && (
                                       <div className="px-2 py-1 bg-red-500/10 rounded-lg text-[9px] font-black text-red-500 uppercase italic">
                                          +{step.expectedDays - step.plannedDays}d Delta
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="mt-10 p-6 bg-slate-900 border border-slate-800 rounded-3xl flex justify-between items-center shadow-inner">
                         <div className="flex items-center gap-6">
                            {/* Added Sparkles to imports */}
                            <Sparkles className="w-5 h-5 text-primary" />
                            <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Delivery Projection</p>
                               <p className="text-sm font-bold text-white uppercase italic">Impact on final release: <span className="text-red-400">+2.5 Days</span></p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Confidence Rating</p>
                            <p className="text-xs font-bold text-emerald-400 uppercase italic">High (0.91)</p>
                         </div>
                      </div>
                   </div>
                )}
              </div>
            ))}
            
            {filteredWip.length === 0 && (
               <div className="py-32 text-center bg-slate-900 border border-slate-800 rounded-[48px] border-dashed">
                  <Activity className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] italic">No active WIP items matching node filters</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default WIPRouting;
