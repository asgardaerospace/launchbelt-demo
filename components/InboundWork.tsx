
import React, { useState } from 'react';
import { 
  Truck, Box, Search, Calendar, ChevronRight, 
  ArrowLeft, ShieldCheck, FileCheck, History, 
  MapPin, Clock, AlertTriangle, CheckCircle2,
  Package, ExternalLink, Zap, Target
} from 'lucide-react';

interface InboundWorkProps {
  initialView?: 'LIST' | 'DETAIL';
  initialShipId?: string;
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
}

const MOCK_INBOUND = [
  { id: 'SHIP-1002', supplier: 'Pacific North Precision', item: 'Actuators v2', linkedWO: 'WO-9921', status: 'IN_TRANSIT', eta: 'Today 14:00', certStatus: 'COMPLETE', risk: 'LOW' },
  { id: 'SHIP-1005', supplier: 'Titanium Alloys Ltd.', item: 'Fastener Kit', linkedWO: 'WO-9922', status: 'PENDING', eta: 'Tomorrow', certStatus: 'MISSING', risk: 'LOW' },
  { id: 'SHIP-0994', supplier: 'Silicon Valley Additive', item: 'Heat Panels', linkedWO: 'WO-8804', status: 'DELAYED', eta: 'Nov 24', certStatus: 'PENDING', risk: 'HIGH' },
  { id: 'SHIP-2041', supplier: 'Mid-Continent Aero', item: 'Structural Strut', linkedWO: 'WO-2047', status: 'IN_TRANSIT', eta: 'Nov 18', certStatus: 'COMPLETE', risk: 'LOW' },
  { id: 'SHIP-1100', supplier: 'Redstone Propulsion', item: 'Thruster Mount', linkedWO: 'WO-1122', status: 'ARRIVED', eta: 'Done', certStatus: 'COMPLETE', risk: 'LOW' },
];

const InboundWork: React.FC<InboundWorkProps> = ({ initialView = 'LIST', initialShipId, onNavigate, onBack }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>(initialView);
  const [selectedShipId, setSelectedShipId] = useState<string | null>(initialShipId || null);

  const selectedShip = MOCK_INBOUND.find(s => s.id === selectedShipId);

  if (view === 'DETAIL' && selectedShip) {
    return <InboundDetail ship={selectedShip} onBack={() => { setView('LIST'); onBack(); }} onNavigate={onNavigate} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Network-Provided</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Inbound Supplier Work</h2>
        <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Upstream Dependencies & Forge Receipt Logic</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl mx-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Supplier</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Part / Lot</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Linked WO</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Expected Arrival</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cert Packet</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Risk</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_INBOUND.map(s => (
              <tr 
                key={s.id} 
                onClick={() => { setSelectedShipId(s.id); setView('DETAIL'); }}
                className="hover:bg-slate-800/30 transition-all cursor-pointer group"
              >
                <td className="px-8 py-6 font-bold text-white uppercase text-xs tracking-tight group-hover:text-primary transition-colors">{s.supplier}</td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-slate-200 uppercase leading-none mb-1">{s.item}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter italic">{s.id}</p>
                </td>
                <td className="px-8 py-6 mono text-xs font-bold text-primary">{s.linkedWO}</td>
                <td className="px-8 py-6 italic text-xs font-bold text-slate-400">{s.eta}</td>
                <td className="px-8 py-6">
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${
                     s.certStatus === 'COMPLETE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                     s.certStatus === 'MISSING' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                     'bg-amber-500/10 text-amber-400 border-amber-500/30'
                   }`}>{s.certStatus}</span>
                </td>
                <td className="px-8 py-6 text-center">
                   <div className={`w-2 h-2 rounded-full mx-auto ${
                     s.risk === 'HIGH' ? 'bg-red-500' : 'bg-emerald-500'
                   } shadow-xl`} />
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${
                    s.status === 'ARRIVED' ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl' :
                    s.status === 'DELAYED' ? 'bg-red-500 text-white border-red-400' :
                    'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>{s.status.replace('_', ' ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InboundDetail: React.FC<{ ship: any, onBack: () => void, onNavigate: any }> = ({ ship, onBack, onNavigate }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
       <div className="flex flex-col gap-6 px-2">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Inbound Feed
          </button>

          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex items-center gap-12">
                <div className="p-12 bg-slate-950/60 rounded-[48px] border border-slate-800 shadow-2xl relative group">
                   <Truck className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                </div>
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">Network-Provided</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{ship.supplier}</span>
                   </div>
                   <h3 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{ship.item}</h3>
                   <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Manifest: {ship.id}</span>
                      <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Linked WO: {ship.linkedWO}</span>
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> ETA: {ship.eta}</span>
                   </div>
                </div>
             </div>
             <div className="relative z-10 space-y-4 lg:border-l lg:border-slate-800 lg:pl-12">
                <button 
                  disabled={ship.certStatus !== 'COMPLETE' || ship.status !== 'ARRIVED'}
                  className="w-full px-12 py-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-[28px] uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-600/30 transition-all active:scale-95"
                >
                   Accept into Forge Receipt
                </button>
                {ship.certStatus === 'MISSING' && (
                  <button 
                    onClick={() => onNavigate('Quality and Certifications', { subView: 'IN_PROGRESS' })}
                    className="w-full px-12 py-6 bg-red-600/10 border border-red-500/30 text-red-400 font-black rounded-[28px] uppercase tracking-[0.2em] text-xs transition-all hover:bg-red-500/20"
                  >
                     Execute Certification Workflow
                  </button>
                )}
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
          <div className="lg:col-span-2 space-y-8">
             <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                   <History className="w-6 h-6 text-primary" />
                   Network Timeline (Read-Only)
                </h4>
                <div className="space-y-12 pl-10 relative">
                   <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800" />
                   {[
                     { date: 'Nov 02', event: 'Supplier WP Released', detail: 'TDP v1.2 secured by Pacific North', complete: true },
                     { date: 'Nov 05', event: 'First Article Certified', detail: 'FAI report approved by Quality Lead', complete: true },
                     { date: 'Nov 10', event: 'Lot Batch 001 Dispatched', detail: 'Tracking UPS-9912821-LBX', complete: true },
                     { date: 'Today', event: 'Estimated Arrival', detail: 'Arriving at Forge Central Receiving', complete: false }
                   ].map((t, idx) => (
                     <div key={idx} className="relative group">
                        <div className={`absolute -left-[30px] top-0 w-5 h-5 rounded-full border-4 bg-slate-950 transition-all ${
                          t.complete ? 'border-emerald-500 ring-8 ring-emerald-500/5' : 'border-slate-800 ring-8 ring-transparent group-hover:border-primary'
                        }`} />
                        <div>
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">{t.date}</p>
                           <p className={`text-lg font-bold uppercase tracking-tight ${t.complete ? 'text-white' : 'text-slate-500'}`}>{t.event}</p>
                           <p className="text-xs text-slate-500 font-medium italic mt-1">{t.detail}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>
          <div className="space-y-8">
             <section className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Digital Cert Packet</h4>
                <div className="space-y-4">
                   {[
                     { name: 'MTR_Steel_A1.pdf', status: 'APPROVED' },
                     { name: 'CMM_Dimensional.csv', status: 'APPROVED' },
                     { name: 'FAI_Form_1.pdf', status: 'PENDING' },
                   ].map(a => (
                     <div key={a.name} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all">
                        <div className="flex items-center gap-3">
                           <FileCheck className={`w-4 h-4 ${a.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}`} />
                           <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{a.name}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                     </div>
                   ))}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="text-slate-500">Integrity Check</span>
                      <span className="text-emerald-400">HASH VERIFIED</span>
                   </div>
                </div>
             </section>
          </div>
       </div>
    </div>
  );
};

export default InboundWork;
