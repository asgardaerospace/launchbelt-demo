
import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  TrendingUp, 
  Filter, 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  Database, 
  Activity, 
  ShieldCheck, 
  Hammer, 
  Calendar,
  Layers,
  ArrowUpRight,
  User,
  ExternalLink,
  History,
  Box,
  Zap,
  BarChart3,
  Target,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  DollarSign,
  // Fix: Added missing Info icon import
  Info
} from 'lucide-react';
import { logAction } from '../services/auditService';

// --- TYPES ---
type MaterialStatus = 'Healthy' | 'At Risk' | 'Gating';

interface Material {
  id: string;
  name: string;
  category: string;
  specification: string;
  qtyOnHand: number;
  unit: string;
  daysOfSupply: number;
  status: MaterialStatus;
  nextDelivery: string;
  gatedWorkOrders: string[];
  avgDailyDemand: number;
  suppliers: Array<{ name: string; leadTime: string; lastPrice: string; approved: boolean }>;
}

interface ResolutionOption {
  id: string;
  type: 'ALTERNATE' | 'EXPEDITE' | 'REALLOCATE';
  source: string;
  qty: number;
  leadTime: string;
  cost: string;
  rationale: string;
}

// --- SEEDED DATA: ASGARD FORGE AUSTIN ---
const MOCK_MATERIALS: Material[] = [
  { 
    id: 'MAT-AL-001', name: '6061-T6 Billet', category: 'Aluminum Stock', specification: 'AMS 4027', 
    qtyOnHand: 4200, unit: 'lbs', daysOfSupply: 24, status: 'Healthy', nextDelivery: 'Nov 24', 
    gatedWorkOrders: [], avgDailyDemand: 175,
    suppliers: [{ name: 'Precision Alloys', leadTime: '2 weeks', lastPrice: '$4.20/lb', approved: true }]
  },
  { 
    id: 'MAT-FAST-012', name: 'Titanium Hex Bolt', category: 'Fasteners', specification: 'NAS1351', 
    qtyOnHand: 45, unit: 'units', daysOfSupply: 3, status: 'Gating', nextDelivery: 'Nov 18 (Expedited)', 
    gatedWorkOrders: ['WO-9921', 'WO-9922'], avgDailyDemand: 15,
    suppliers: [{ name: 'Global Aerospace Parts', leadTime: '4 weeks', lastPrice: '$12.50/ea', approved: true }]
  },
  { 
    id: 'MAT-COMP-099', name: 'Carbon Fiber Prepreg', category: 'Composite Materials', specification: 'BMS 8-276', 
    qtyOnHand: 1200, unit: 'sqft', daysOfSupply: 12, status: 'At Risk', nextDelivery: 'Nov 20', 
    gatedWorkOrders: ['WO-8804'], avgDailyDemand: 100,
    suppliers: [{ name: 'Composite Master', leadTime: '6 weeks', lastPrice: '$85.00/sqft', approved: true }]
  },
  { 
    id: 'MAT-RES-201', name: 'Structural Epoxy Resin', category: 'Resins and Adhesives', specification: 'MIL-A-83377', 
    qtyOnHand: 40, unit: 'gallons', daysOfSupply: 32, status: 'Healthy', nextDelivery: 'Dec 05', 
    gatedWorkOrders: [], avgDailyDemand: 1.2,
    suppliers: [{ name: 'Chemical Ops', leadTime: '3 weeks', lastPrice: '$210/gal', approved: true }]
  },
  { 
    id: 'MAT-SEAL-890', name: 'Pro-Seal 890 B-2', category: 'Sealants and Potting Compounds', specification: 'AMS-S-8802', 
    qtyOnHand: 12, unit: 'kits', daysOfSupply: 4, status: 'Gating', nextDelivery: 'Today 14:00', 
    gatedWorkOrders: ['WO-8804'], avgDailyDemand: 3,
    suppliers: [{ name: 'AeroSeal Co.', leadTime: '1 week', lastPrice: '$145/kit', approved: true }]
  }
];

const CATEGORIES = [
  'Fasteners', 'Aluminum Stock', 'Composite Materials', 'Resins and Adhesives',
  'Sealants and Potting Compounds', 'Wiring and Harness Materials', 'Electrical Components',
  'Coatings and Finishing Materials', 'Consumables and Shop Supplies'
];

interface SupplyChainProps {
  onNavigate?: (view: string, params?: any) => void;
}

const SupplyChain: React.FC<SupplyChainProps> = ({ onNavigate }) => {
  const [view, setView] = useState<'OVERVIEW' | 'CATEGORY' | 'DETAIL' | 'RESOLVE_BLOCKERS'>('OVERVIEW');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  const activeMaterial = useMemo(() => 
    MOCK_MATERIALS.find(m => m.id === selectedMaterialId)
  , [selectedMaterialId]);

  const metrics = useMemo(() => ({
    healthy: MOCK_MATERIALS.filter(m => m.status === 'Healthy').length,
    atRisk: MOCK_MATERIALS.filter(m => m.status === 'At Risk').length,
    gating: MOCK_MATERIALS.filter(m => m.status === 'Gating').length,
    pending: 4 
  }), []);

  const renderContent = () => {
    switch (view) {
      case 'OVERVIEW':
        return <SupplyChainOverview 
          onSelectCategory={(cat) => { setSelectedCategory(cat); setView('CATEGORY'); }}
          onResolveBlockers={() => setView('RESOLVE_BLOCKERS')}
          metrics={metrics}
        />;
      case 'CATEGORY':
        return <MaterialCategoryView 
          category={selectedCategory!} 
          onBack={() => setView('OVERVIEW')} 
          onSelectMaterial={(id) => { setSelectedMaterialId(id); setView('DETAIL'); }}
        />;
      case 'DETAIL':
        return activeMaterial ? (
          <MaterialDetailView 
            material={activeMaterial} 
            onBack={() => setView('CATEGORY')}
            onNavigateWO={(woId) => onNavigate?.('Work Orders', { view: 'DETAIL', woId })}
            onResolve={() => setView('RESOLVE_BLOCKERS')}
          />
        ) : null;
      case 'RESOLVE_BLOCKERS':
        return <ResolveBlockersView 
          onBack={() => setView('OVERVIEW')} 
          onNavigateWO={(woId) => onNavigate?.('Work Orders', { view: 'DETAIL', woId })}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Forge-Owned</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Supply Chain Capability</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Material Demand & Flow Telemetry • Node: Austin</p>
        </div>
      </div>

      <div className="mx-2">
        {renderContent()}
      </div>
    </div>
  );
};

// --- VIEW: OVERVIEW ---
const SupplyChainOverview: React.FC<{ 
  onSelectCategory: (cat: string) => void,
  onResolveBlockers: () => void,
  metrics: any
}> = ({ onSelectCategory, onResolveBlockers, metrics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div className="lg:col-span-3 space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Healthy State', val: metrics.healthy, color: 'text-emerald-400', icon: CheckCircle2 },
          { label: 'At Risk', val: metrics.atRisk, color: 'text-amber-400', icon: AlertTriangle },
          { label: 'Gating WOs', val: metrics.gating, color: 'text-red-500', icon: Hammer },
          { label: 'In Transit', val: metrics.pending, color: 'text-primary', icon: Truck },
        ].map(m => (
          <button key={m.label} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] text-left hover:border-primary/40 transition-all group shadow-xl">
             <m.icon className={`w-5 h-5 ${m.color} mb-4`} />
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic leading-none mb-1">{m.label}</p>
             <p className={`text-4xl font-bold ${m.color} tracking-tighter`}>{m.val}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => {
          const catMaterials = MOCK_MATERIALS.filter(m => m.category === cat);
          const isGating = catMaterials.some(m => m.status === 'Gating');
          const isAtRisk = catMaterials.some(m => m.status === 'At Risk');
          const avgSupply = catMaterials.length > 0 ? Math.round(catMaterials.reduce((acc, m) => acc + m.daysOfSupply, 0) / catMaterials.length) : 0;
          
          return (
            <button 
              key={cat} 
              onClick={() => onSelectCategory(cat)}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] text-left hover:border-primary/50 transition-all group shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase italic tracking-tight mb-4 leading-tight group-hover:text-primary transition-colors">{cat}</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Days of Supply</span>
                  <span className={avgSupply < 7 ? 'text-red-400' : avgSupply < 14 ? 'text-amber-400' : 'text-emerald-400'}>{avgSupply}d Avg</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-slate-800">
                  <span className="text-slate-500">SKUs Active</span>
                  <span className="text-white font-black">{catMaterials.length} Items</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] pt-2">
                   {isGating ? (
                     <span className="text-red-500 flex items-center gap-2 animate-pulse"><AlertTriangle className="w-3" /> GATING WOs</span>
                   ) : isAtRisk ? (
                     <span className="text-amber-500 flex items-center gap-2"><Clock className="w-3" /> DEPLETION RISK</span>
                   ) : (
                     <span className="text-emerald-500">READY FOR OPS</span>
                   )}
                   <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>

    <div className="space-y-6">
       <div className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles className="w-24 h-24 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-3 uppercase italic tracking-tighter border-b border-slate-800 pb-6 relative z-10">
             <Sparkles className="w-6 h-6 text-primary" />
             AI Supply Brief
          </h3>
          <div className="space-y-8 relative z-10">
             <div className="flex gap-4">
                <div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <p className="text-xs text-slate-300 font-bold leading-relaxed italic">
                  <span className="text-white font-black">Fastener Crisis:</span> NAS1351 Titanium bolts are critical gating for WO-9921. Recommend immediate alternate source approval.
                </p>
             </div>
             <div className="flex gap-4">
                <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <p className="text-xs text-slate-300 font-bold leading-relaxed italic">
                  <span className="text-white font-black">Cold Chain Alert:</span> Composite Prepreg (MAT-COMP-099) tracking 12 days supply. Logistics node Great Lakes reports 2-day weather delay.
                </p>
             </div>
             <div className="pt-6 border-t border-slate-800">
                <button onClick={onResolveBlockers} className="w-full py-4 bg-primary/10 border border-primary/20 text-primary font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all">Resolve Material Blockers</button>
             </div>
          </div>
       </div>
    </div>
  </div>
);

// --- VIEW: CATEGORY ---
const MaterialCategoryView: React.FC<{
  category: string,
  onBack: () => void,
  onSelectMaterial: (id: string) => void
}> = ({ category, onBack, onSelectMaterial }) => {
  const [filterGated, setFilterGated] = useState(false);
  const materials = useMemo(() => {
    let list = MOCK_MATERIALS.filter(m => m.category === category);
    if (filterGated) list = list.filter(m => m.status === 'Gating');
    return list;
  }, [category, filterGated]);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </button>
          <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic">{category}</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setFilterGated(!filterGated)}
            className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filterGated ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            Filter Gating Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {materials.map(m => (
          <button 
            key={m.id} 
            onClick={() => onSelectMaterial(m.id)}
            className={`bg-slate-900 border p-8 rounded-[40px] text-left transition-all relative group shadow-2xl ${
              m.status === 'Gating' ? 'border-red-500/40 hover:border-red-500' : 'border-slate-800 hover:border-primary/40'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-2xl ${
                 m.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                 m.status === 'Gating' ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10 animate-pulse' :
                 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
               }`}>
                  <Package className="w-6 h-6" />
               </div>
               <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                 m.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                 m.status === 'Gating' ? 'bg-red-500 text-white border-red-400 shadow-xl' :
                 'bg-amber-500/10 text-amber-400 border-amber-500/30'
               }`}>{m.status}</span>
            </div>
            
            <h4 className="text-xl font-bold text-white uppercase tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors">{m.name}</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 italic">{m.specification}</p>
            
            <div className="space-y-4 pt-6 border-t border-slate-800">
               <div className="flex justify-between items-center text-xs font-black uppercase">
                  <span className="text-slate-500">On Hand</span>
                  <span className="text-white">{m.qtyOnHand.toLocaleString()} {m.unit}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="text-slate-500">Days of Supply</span>
                  <span className={m.daysOfSupply < 7 ? 'text-red-400' : 'text-primary'}>{m.daysOfSupply} Days</span>
               </div>
               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${m.daysOfSupply < 7 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (m.daysOfSupply / 30) * 100)}%` }} />
               </div>
               <div className="flex justify-between items-center pt-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Next Inbound: {m.nextDelivery}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
               </div>
            </div>
          </button>
        ))}
        {materials.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-900/50 border border-slate-800 rounded-[48px] border-dashed">
             <Database className="w-12 h-12 text-slate-700 mx-auto mb-4" />
             <p className="text-slate-500 font-bold uppercase tracking-[0.2em]">No materials matched filters in this node</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- VIEW: DETAIL ---
const MaterialDetailView: React.FC<{
  material: Material,
  onBack: () => void,
  onNavigateWO: (id: string) => void,
  onResolve: () => void
}> = ({ material, onBack, onNavigateWO, onResolve }) => {
  const [activeSubTab, setActiveSubTab] = useState('Consumption');

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col gap-6 px-2">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Category Feed
          </button>

          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex items-center gap-12">
                <div className={`p-12 bg-slate-950/60 rounded-[48px] border border-slate-800 shadow-2xl relative group ${material.status === 'Gating' ? 'border-red-500/30' : ''}`}>
                   <Package className={`w-16 h-16 ${material.status === 'Gating' ? 'text-red-500' : 'text-primary'} group-hover:scale-110 transition-transform duration-500`} />
                   {material.status === 'Gating' && (
                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-white" />
                     </div>
                   )}
                </div>
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">{material.category}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{material.specification}</span>
                   </div>
                   <h3 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{material.name}</h3>
                   <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                      <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Node: {material.id}</span>
                      <span className={`flex items-center gap-2 ${material.status === 'Gating' ? 'text-red-400' : 'text-emerald-400'}`}>
                        <Target className="w-4 h-4 text-primary" /> Supply: {material.daysOfSupply} Days Remaining
                      </span>
                      <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Demand: {material.avgDailyDemand} {material.unit}/day</span>
                   </div>
                </div>
             </div>
             <div className="relative z-10 space-y-4 lg:border-l lg:border-slate-800 lg:pl-12">
                {material.status === 'Gating' && (
                  <button onClick={onResolve} className="w-full px-12 py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-[28px] uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-95">Resolve Blocker</button>
                )}
                <button className="w-full px-12 py-5 bg-white text-slate-900 font-black rounded-[28px] uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-95 hover:bg-slate-100">Reorder Now</button>
                <button className="w-full px-12 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-[28px] uppercase tracking-[0.2em] text-xs border border-slate-700 transition-all">Approve Alternate</button>
             </div>
          </div>
       </div>

       <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto bg-slate-950/50 sticky top-16 z-20 backdrop-blur-md px-2">
        {['Consumption', 'Inventory Timeline', 'Supplier Info'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex items-center gap-2 px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap italic ${
              activeSubTab === tab 
              ? 'text-primary border-primary bg-primary/5' 
              : 'text-slate-600 border-transparent hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
          <div className="lg:col-span-2 space-y-8">
             {activeSubTab === 'Consumption' && (
               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                  <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                     <Hammer className="w-6 h-6 text-primary" /> Active Consumption Requests
                  </h4>
                  <div className="space-y-4">
                     {material.gatedWorkOrders.length > 0 ? (
                       material.gatedWorkOrders.map(wo => (
                        <div key={wo} onClick={() => onNavigateWO(wo)} className="p-8 bg-red-500/5 border border-red-500/20 rounded-[32px] flex justify-between items-center group cursor-pointer hover:bg-red-500/10 transition-all shadow-xl">
                            <div className="flex items-center gap-8">
                               <div className="p-4 bg-red-500/10 rounded-2xl text-red-400 animate-pulse border border-red-500/20 shadow-lg shadow-red-500/10">
                                 <AlertTriangle className="w-8 h-8" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1 italic">Production Gated</p>
                                  <h5 className="text-3xl font-bold text-white uppercase italic tracking-tighter group-hover:text-red-400 transition-colors">{wo}</h5>
                                  <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-widest">Target Integration: Hub Austin</p>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                               <div className="hidden md:block">
                                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1 italic text-right">Required Date</p>
                                  <p className="text-sm font-bold text-white uppercase italic">Nov 18, 2023</p>
                               </div>
                               <ChevronRight className="w-8 h-8 text-red-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                       ))
                     ) : (
                       <div className="py-20 text-center space-y-4">
                          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-40" />
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">No active production blocks for this material</p>
                       </div>
                     )}
                  </div>
               </section>
             )}

             {activeSubTab === 'Inventory Timeline' && (
               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                  <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                     <TrendingUp className="w-6 h-6 text-primary" /> Depletion Matrix (30 Day)
                  </h4>
                  <div className="h-64 flex items-end gap-2 px-4">
                    {[95, 88, 80, 75, 62, 55, 48, 30, 22, 12, 100, 92].map((h, i) => (
                      <div key={i} className="flex-1 relative group">
                         <div 
                          className={`w-full rounded-t-lg transition-all duration-700 ${i === 9 ? 'bg-red-500/40 border-red-500' : i > 9 ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-primary/20 border-primary/20'} border`} 
                          style={{ height: `${h}%` }} 
                         />
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-[8px] font-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {i === 10 ? 'INBOUND ARRIVAL' : `${h}%`}
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8 text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 border-t border-slate-800 pt-6">
                    <span>TODAY</span>
                    <span>DAY 10</span>
                    <span className="text-emerald-500">INBOUND (24th)</span>
                    <span>DAY 30</span>
                  </div>
               </section>
             )}

             {activeSubTab === 'Supplier Info' && (
               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                  <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                     <ShieldCheck className="w-6 h-6 text-primary" /> Vetted Node Directory
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {material.suppliers.map(s => (
                      <div key={s.name} className="p-8 bg-slate-800/40 border border-slate-800 rounded-[32px] space-y-6 group hover:border-primary/40 transition-all">
                        <div className="flex justify-between items-start">
                           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 font-black text-slate-500 text-lg uppercase group-hover:text-primary transition-colors">{s.name[0]}</div>
                           {s.approved && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                        </div>
                        <div>
                           <h5 className="text-lg font-bold text-white uppercase tracking-tight mb-1">{s.name}</h5>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lead Time: {s.leadTime}</p>
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Last Quote</span>
                           <span className="text-sm font-bold text-white uppercase italic">{s.lastPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </section>
             )}
          </div>

          <div className="space-y-8">
             <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-24 h-24 text-primary" /></div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                   <Sparkles className="w-4 h-4 text-primary" /> AI Sourcing Intel
                </h4>
                <div className="space-y-8">
                   <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4 shadow-inner">
                      <p className="text-xs text-slate-300 font-bold leading-relaxed italic">"Detected <span className="text-red-400">supply disruption</span> at Tier-1 source for {material.name}. Secondary source 'Global Aerospace' has 4500 units available for immediate dispatch."</p>
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Expedite Secondary PO</button>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-6 block">Supply Forecast</p>
                      <div className="flex justify-between items-center text-xs font-black uppercase italic">
                         <span className="text-slate-400">Projected Run-out</span>
                         <span className="text-red-400">3.2 Days</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 animate-pulse" style={{ width: '15%' }} />
                      </div>
                   </div>
                </div>
             </section>

             <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-dark" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                   <Clock className="w-4 h-4 text-primary" /> Node Event Log
                </h3>
                <div className="space-y-8 pl-4 border-l border-slate-800">
                   {[
                     { event: 'Inventory Sync', date: '08:42 AM', user: 'SYSTEM' },
                     { event: 'Partial Receipt SHIP-0922', date: 'Yesterday', user: 'Receiving' },
                     { event: 'Threshold Alert: RED', date: 'Nov 12', user: 'Supply Intel' }
                   ].map((log, i) => (
                     <div key={i} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
                        <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">{log.event}</p>
                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter italic">{log.date} • {log.user}</p>
                     </div>
                   ))}
                </div>
             </section>
          </div>
       </div>
    </div>
  );
};

// --- VIEW: RESOLVE BLOCKERS ---
const ResolveBlockersView: React.FC<{ onBack: () => void, onNavigateWO: (id: string) => void }> = ({ onBack, onNavigateWO }) => {
  const blockingMaterials = MOCK_MATERIALS.filter(m => m.status === 'Gating' || m.status === 'At Risk');
  const [selectedBlocker, setSelectedBlocker] = useState<Material | null>(blockingMaterials[0] || null);
  const [selectedOption, setSelectedOption] = useState<ResolutionOption | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const options: ResolutionOption[] = [
    { id: 'opt-1', type: 'ALTERNATE', source: 'Pacific Alloys (Secondary)', qty: 500, leadTime: '3 Days', cost: '$14,500', rationale: 'AI matching confirms spec equivalence. Secondary node has local stock ready for courier.' },
    { id: 'opt-2', type: 'EXPEDITE', source: 'Apex Machining (Hub Internal)', qty: 150, leadTime: 'Today', cost: '$4,200', rationale: 'Internal reallocation from R&D inventory. High cost due to program priority shift.' },
    { id: 'opt-3', type: 'REALLOCATE', source: 'WP-1122 Surplus', qty: 25, leadTime: 'Immediate', cost: '$0', rationale: 'Direct transfer from finished build with material surplus. No external cost.' }
  ];

  const handleConfirm = async () => {
    if (!selectedBlocker || !selectedOption) return;
    setIsResolving(true);
    
    // Simulate API/Update
    await new Promise(r => setTimeout(r, 1500));
    
    await logAction(
      'alex.forge@launchbelt.io', 
      'MATERIAL_RESOLUTION_CONFIRMED', 
      selectedBlocker.id, 
      `Mitigated blocker using ${selectedOption.type} from ${selectedOption.source}. Rationale: ${selectedOption.rationale}`
    );
    
    setIsResolving(false);
    onBack();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Hub
        </button>
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic flex items-center gap-4">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          Resolve Material Blockers
        </h2>
      </div>

      {/* 1. BLOCKING MATERIALS SUMMARY */}
      <div className="space-y-4 px-2">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">Active Production Blockers</h3>
        <div className="grid grid-cols-1 gap-4">
          {blockingMaterials.map(m => (
            <div 
              key={m.id} 
              className={`bg-slate-900 border p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 transition-all shadow-2xl relative overflow-hidden ${
                selectedBlocker?.id === m.id ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-800'
              }`}
            >
              {selectedBlocker?.id === m.id && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
              )}
              <div className="flex items-center gap-8 flex-1">
                 <div className={`p-5 rounded-3xl ${m.status === 'Gating' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'} border border-current/20 shadow-xl`}>
                    <Package className="w-10 h-10" />
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="mono text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.id}</span>
                       <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter ${
                         m.status === 'Gating' ? 'bg-red-500 text-white border-red-400' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                       }`}>{m.status}</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white uppercase italic tracking-tighter leading-none">{m.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{m.specification} • {m.category}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-[2]">
                 <div className="text-center md:text-left">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest block mb-1 italic">Impacted WOs</span>
                    <div className="flex -space-x-2">
                       {m.gatedWorkOrders.map(wo => (
                         <div key={wo} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black text-primary" title={wo}>{wo.slice(-2)}</div>
                       ))}
                       {m.gatedWorkOrders.length === 0 && <span className="text-xs font-bold text-slate-700 italic">None</span>}
                    </div>
                 </div>
                 <div className="text-center md:text-left">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest block mb-1 italic">Supply State</span>
                    <p className={`text-sm font-bold ${m.daysOfSupply < 5 ? 'text-red-400' : 'text-slate-300'}`}>{m.daysOfSupply} Days Left</p>
                 </div>
                 <div className="text-center md:text-left">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest block mb-1 italic">Required By</span>
                    <p className="text-sm font-bold text-white italic">Nov 20, 2023</p>
                 </div>
                 <div className="flex items-center justify-center md:justify-end">
                    <button 
                      onClick={() => { setSelectedBlocker(m); setSelectedOption(null); }}
                      className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        selectedBlocker?.id === m.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {selectedBlocker?.id === m.id ? 'ACTIVE RESOLVER' : 'RESOLVE BLOCKER'}
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RESOLUTION WORKSPACE */}
      {selectedBlocker && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-2 animate-in slide-in-from-top-6 duration-700">
           {/* Left Col: Context */}
           <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl flex flex-col space-y-8">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4 italic flex items-center gap-2">
                    <Info className="w-3 h-3" /> Blocker Context
                 </h4>
                 <div className="space-y-6">
                    <div>
                       <span className="text-[9px] text-slate-600 font-black uppercase block mb-1">Production Usage</span>
                       <p className="text-xs text-slate-300 leading-relaxed font-medium">Critical structural fasteners for Avionics Assembly. Required for all L5 classified payloads in current shift.</p>
                    </div>
                    <div className="p-5 bg-slate-950/50 rounded-3xl border border-slate-800 border-dashed">
                       <span className="text-[9px] text-slate-600 font-black uppercase block mb-3">Gate Dependency</span>
                       <div className="flex gap-4">
                          <Hammer className="w-5 h-5 text-red-400" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Prevents integration of <span className="text-white">WO-9921</span> and <span className="text-white">WO-9922</span>. Estimated 24h before full floor stall.</p>
                       </div>
                    </div>
                    <div>
                       <span className="text-[9px] text-slate-600 font-black uppercase block mb-3">Cert Requirements</span>
                       <div className="flex flex-wrap gap-2">
                          {['AS9100', 'MTR Verify', 'L5 Posture'].map(c => (
                            <span key={c} className="px-2 py-1 bg-slate-800 text-slate-500 rounded border border-slate-700 text-[8px] font-black uppercase tracking-tighter">{c}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Center Col: Options */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-2 px-4">
                 <Sparkles className="w-5 h-5 text-primary" />
                 <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">AI Resolution Pathways</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {options.map(opt => (
                   <button 
                    key={opt.id} 
                    onClick={() => setSelectedOption(opt)}
                    className={`bg-slate-900 border p-8 rounded-[40px] text-left transition-all relative group shadow-2xl ${
                      selectedOption?.id === opt.id ? 'border-primary ring-8 ring-primary/5 bg-primary/5' : 'border-slate-800 hover:border-slate-600'
                    }`}
                   >
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1 italic">{opt.type}</span>
                            <h5 className="text-2xl font-bold text-white uppercase italic tracking-tighter leading-none">{opt.source}</h5>
                         </div>
                         <div className={`p-4 rounded-2xl border transition-all ${
                           selectedOption?.id === opt.id ? 'bg-primary text-white border-white/20' : 'bg-slate-800 border-slate-700 text-slate-500'
                         }`}>
                            {opt.type === 'ALTERNATE' ? <Truck className="w-6 h-6" /> : opt.type === 'EXPEDITE' ? <Zap className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                         </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-8 pt-6 border-t border-slate-800/50">
                         <div>
                            <span className="text-[9px] text-slate-600 font-bold uppercase block mb-1 tracking-widest italic">Quantity</span>
                            <p className="text-sm font-black text-white uppercase">{opt.qty} units</p>
                         </div>
                         <div>
                            <span className="text-[9px] text-slate-600 font-bold uppercase block mb-1 tracking-widest italic">Lead Time</span>
                            <p className="text-sm font-black text-primary uppercase italic">{opt.leadTime}</p>
                         </div>
                         <div>
                            <span className="text-[9px] text-slate-600 font-bold uppercase block mb-1 tracking-widest italic">Delta Cost</span>
                            <p className="text-sm font-black text-slate-300 uppercase">{opt.cost}</p>
                         </div>
                      </div>

                      <div className="p-5 bg-slate-950/60 rounded-[32px] border border-slate-800 border-dashed group-hover:border-primary/30 transition-all">
                         <div className="flex gap-4">
                            <Sparkles className="w-5 h-5 text-primary shrink-0" />
                            <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">"{opt.rationale}"</p>
                         </div>
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           {/* Right Col: Live Impact */}
           <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl flex flex-col">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4 mb-8 italic">Mitigation Forecast</h4>
              
              <div className="flex-1 space-y-10">
                 {selectedOption ? (
                   <>
                     <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-inner">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase">
                              <span className="text-slate-600">Material In-House</span>
                              <span className="text-emerald-400">Nov 18 (Target)</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '85%' }} />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest block italic">Impact on Active WOs</span>
                           {selectedBlocker.gatedWorkOrders.map(wo => (
                             <div key={wo} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700">
                                <span className="text-xs font-black text-white">{wo}</span>
                                <div className="flex items-center gap-2 text-emerald-400">
                                   <TrendingUp className="w-3 h-3" />
                                   <span className="text-[9px] font-black uppercase italic tracking-tighter">On Schedule</span>
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="pt-6 border-t border-slate-800 space-y-3">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase italic">
                              <span className="text-slate-600">Total Delta Cost</span>
                              <span className="text-red-400">{selectedOption.cost}</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-black uppercase italic">
                              <span className="text-slate-600">Risk Reduction</span>
                              <span className="text-emerald-400">-92% Volatility</span>
                           </div>
                        </div>
                     </div>
                   </>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-6">
                      <Target className="w-12 h-12 text-slate-700 mb-4" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Select a resolution option to view live production impact.</p>
                   </div>
                 )}
              </div>

              <div className="pt-10">
                 <button 
                  disabled={!selectedOption || isResolving}
                  onClick={handleConfirm}
                  className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 ${
                    selectedOption && !isResolving 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-500 scale-105' 
                      : 'bg-slate-800 text-slate-600'
                  }`}
                 >
                    {isResolving ? (
                      <>
                         <Activity className="w-5 h-5 animate-spin" /> EXECUTING HASH LOCK...
                      </>
                    ) : (
                      <>
                         <ShieldCheck className="w-5 h-5" /> Confirm Resolution
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChain;
