
import React, { useState, useMemo } from 'react';
import { 
  Truck, CheckCircle2, Box, ArrowRight, Download, 
  ShieldCheck, AlertTriangle, Clock, User, ClipboardList,
  Search, Filter, ChevronRight, ArrowLeft, History,
  FileText, ExternalLink, Zap, Target, Hammer, 
  Lock, CheckCircle, Package, Activity, MapPin,
  TrendingUp, Fingerprint
} from 'lucide-react';
import { logAction } from '../services/auditService';

// --- TYPES ---
type ReleaseStatus = 'READY' | 'BLOCKED' | 'AWAITING_APPROVAL' | 'SHIPPED' | 'APPROVED';

interface ReleaseItem {
  id: string; // Release ID
  woId: string;
  name: string;
  program: string;
  destination: string;
  certStatus: 'COMPLETE' | 'PENDING' | 'MISSING';
  authority: string;
  expectedShipDate: string;
  shipmentType: 'GROUND' | 'AIR' | 'COURIER';
  status: ReleaseStatus;
  blockingReason?: string;
  blockType?: 'CERT' | 'NCR' | 'TEST' | 'ARTIFACT';
  owner: string;
  unblockDate?: string;
  deliveryImpact: string;
  traceability: { pn: string; sn: string; supplier: string; lot: string }[];
}

interface Shipment {
  id: string;
  releaseId: string;
  woId: string;
  items: string[];
  destination: string;
  carrier: string;
  mode: string;
  scheduledPickup: string;
  trackingNumber: string;
  events: { time: string; location: string; event: string }[];
}

// --- SEEDED DATA ---
const MOCK_RELEASES: ReleaseItem[] = [
  {
    id: 'REL-7721-01', woId: 'WO-9921', name: 'Main Plate Assembly', program: 'Falcon-Heavy', destination: 'Kennedy Space Center, FL',
    certStatus: 'COMPLETE', authority: 'Quality Lead (Vance)', expectedShipDate: 'Today 16:00', shipmentType: 'AIR',
    status: 'READY', owner: 'D. Miller', deliveryImpact: 'None',
    traceability: [
      { pn: '7721-001', sn: 'SN-001', supplier: 'Forge Internal', lot: 'L-922' },
      { pn: '7721-ACT', sn: 'SN-ACT-99', supplier: 'Pacific North', lot: 'L-881' }
    ]
  },
  {
    id: 'REL-8804-02', woId: 'WO-8804', name: 'Shield Layer 1 (Ablative)', program: 'Starship', destination: 'Starbase, TX',
    certStatus: 'PENDING', authority: 'Engineering (Holden)', expectedShipDate: 'Nov 22', shipmentType: 'GROUND',
    status: 'BLOCKED', blockingReason: 'Missing NDI Ultrasonic Scan', blockType: 'CERT', owner: 'M. Chen',
    unblockDate: 'Tomorrow', deliveryImpact: '+2 Days',
    traceability: []
  },
  {
    id: 'REL-1122-01', woId: 'WO-1122', name: 'Landing Gear Strut Support', program: 'Falcon-Heavy', destination: 'Vandenberg, CA',
    certStatus: 'COMPLETE', authority: 'Production Admin', expectedShipDate: 'Today 14:00', shipmentType: 'COURIER',
    status: 'AWAITING_APPROVAL', owner: 'S. Connor', deliveryImpact: 'None',
    traceability: [
      { pn: '1122-005', sn: 'SN-112', supplier: 'Forge Internal', lot: 'L-112' }
    ]
  }
];

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SHIP-LB-99210', releaseId: 'REL-9012-A', woId: 'WO-9012', items: ['Cooling Manifold (01)'], 
    destination: 'Boca Chica, TX', carrier: 'SpaceX Logistics', mode: 'Ground Express', 
    scheduledPickup: 'Nov 14, 08:00', trackingNumber: 'LB-9012-99881',
    events: [
      { time: 'Nov 14 08:12', location: 'Forge Central', event: 'Picked up by carrier' },
      { time: 'Nov 14 14:22', location: 'Houston Hub', event: 'In-transit: En route to destination' }
    ]
  }
];

const ShippingRelease: React.FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => {
  const [view, setView] = useState<'QUEUES' | 'PACKET' | 'EXECUTION'>('QUEUES');
  const [selectedRelease, setSelectedRelease] = useState<ReleaseItem | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [filter, setFilter] = useState<ReleaseStatus | 'ALL'>('ALL');

  const metrics = useMemo(() => ({
    ready: MOCK_RELEASES.filter(r => r.status === 'READY').length,
    blocked: MOCK_RELEASES.filter(r => r.status === 'BLOCKED').length,
    certsComplete: MOCK_RELEASES.filter(r => r.certStatus === 'COMPLETE').length,
    awaitingApproval: MOCK_RELEASES.filter(r => r.status === 'AWAITING_APPROVAL').length,
    scheduled: MOCK_SHIPMENTS.length
  }), []);

  const handleApprove = async (rel: ReleaseItem) => {
    await logAction('A. Rivera', 'RELEASE_APPROVED', rel.id, `Release authority approved for WO: ${rel.woId}. Final release packet sealed.`);
    // In a real app, update state. Here we just switch view to simulate
    setView('QUEUES');
    setSelectedRelease(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'QUEUES':
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* 1. READINESS SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Ready for Release', val: metrics.ready, type: 'READY', color: 'text-emerald-400' },
                { label: 'Items Blocked', val: metrics.blocked, type: 'BLOCKED', color: 'text-red-500' },
                { label: 'Cert Packets Complete', val: metrics.certsComplete, type: 'ALL', color: 'text-white' },
                { label: 'Awaiting Final Approval', val: metrics.awaitingApproval, type: 'AWAITING_APPROVAL', color: 'text-amber-400' },
                { label: 'Shipments (7d)', val: metrics.scheduled, type: 'ALL', color: 'text-primary' },
              ].map(m => (
                <button 
                  key={m.label} 
                  onClick={() => setFilter(m.type as any)}
                  className={`bg-slate-900 border p-6 rounded-[32px] text-left transition-all group shadow-xl relative overflow-hidden ${
                    filter === m.type ? 'border-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic leading-none">{m.label}</p>
                  <p className={`text-4xl font-bold ${m.color} tracking-tighter leading-none`}>{m.val}</p>
                </button>
              ))}
            </div>

            {/* 2. READY FOR RELEASE QUEUE */}
            {(filter === 'ALL' || filter === 'READY' || filter === 'AWAITING_APPROVAL') && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Ready for Release Authority</h3>
                </div>
                <div className="space-y-4">
                  {MOCK_RELEASES.filter(r => r.status === 'READY' || r.status === 'AWAITING_APPROVAL').map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-8 transition-all hover:border-primary/40 shadow-2xl group">
                       <div className="flex items-center gap-8 flex-1">
                          <div className="p-5 bg-emerald-500/10 rounded-3xl text-emerald-400 border border-emerald-500/20 shadow-xl">
                             <Package className="w-10 h-10" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-2">
                                <span className="mono text-[10px] font-black text-primary uppercase tracking-widest">{item.id}</span>
                                <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/30 uppercase tracking-widest">{item.status}</span>
                             </div>
                             <h4 className="text-2xl font-bold text-white uppercase italic tracking-tighter leading-none mb-2 group-hover:text-primary transition-colors">{item.name}</h4>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.program} • Dest: {item.destination}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-[2] border-l border-slate-800 pl-8">
                          <div>
                             <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Cert Packet</span>
                             <p className="text-xs font-bold text-emerald-400 uppercase italic flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> COMPLETE</p>
                          </div>
                          <div>
                             <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Release Auth</span>
                             <p className="text-xs font-bold text-white uppercase italic">{item.authority}</p>
                          </div>
                          <div>
                             <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Expected Ship</span>
                             <p className="text-xs font-bold text-slate-300 italic">{item.expectedShipDate}</p>
                          </div>
                          <div className="flex items-center justify-end gap-3">
                             <button 
                                onClick={() => { setSelectedRelease(item); setView('PACKET'); }}
                                className="px-6 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all"
                             >
                                Review Packet
                             </button>
                             <button 
                                onClick={() => handleApprove(item)}
                                className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-600/20 transition-all"
                             >
                                <ShieldCheck className="w-5 h-5" />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. BLOCKED FOR RELEASE QUEUE */}
            {(filter === 'ALL' || filter === 'BLOCKED') && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Blocked from Release</h3>
                </div>
                <div className="space-y-4">
                  {MOCK_RELEASES.filter(r => r.status === 'BLOCKED').map(item => (
                    <div key={item.id} className="bg-slate-900 border border-red-500/20 p-8 rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-8 transition-all hover:border-red-500/40 shadow-2xl group">
                       <div className="flex items-center gap-8 flex-1">
                          <div className="p-5 bg-red-500/10 rounded-3xl text-red-400 border border-red-500/20 animate-pulse">
                             <AlertTriangle className="w-10 h-10" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-2">
                                <span className="mono text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.id}</span>
                                <span className="text-[9px] font-black px-2 py-0.5 bg-red-500 text-white rounded border border-red-400 uppercase tracking-widest">GATED</span>
                             </div>
                             <h4 className="text-2xl font-bold text-white uppercase italic tracking-tighter leading-none mb-2 group-hover:text-red-400 transition-colors">{item.name}</h4>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.program} • WO: {item.woId}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-[2] border-l border-slate-800 pl-8">
                          <div className="col-span-2">
                             <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Blocking Reason</span>
                             <p className="text-sm font-bold text-red-400 italic leading-tight uppercase tracking-tight">{item.blockingReason}</p>
                             <p className="text-[8px] text-slate-600 font-bold mt-1 uppercase">Owner: {item.owner} • Est Unblock: {item.unblockDate}</p>
                          </div>
                          <div>
                             <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Impact</span>
                             <p className="text-sm font-bold text-red-500 uppercase italic">{item.deliveryImpact}</p>
                          </div>
                          <div className="flex items-center justify-end">
                             <button 
                                onClick={() => {
                                   if (item.blockType === 'CERT') onNavigate('Quality & Certs', { subView: 'IN_PROGRESS' });
                                   else onNavigate('Work Orders', { view: 'DETAIL', woId: item.woId });
                                }}
                                className="px-8 py-3 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all"
                             >
                                Resolve Blocker
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. SHIPMENT EXECUTION (LOGISTICS) */}
            {(filter === 'ALL') && (
              <section className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Shipment Execution</h3>
                 </div>
                 <div className="space-y-4">
                    {MOCK_SHIPMENTS.map(ship => (
                      <div key={ship.id} onClick={() => { setSelectedShipment(ship); setView('EXECUTION'); }} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-8 transition-all hover:border-primary/50 shadow-2xl cursor-pointer group">
                         <div className="flex items-center gap-8 flex-1">
                            <div className="p-5 bg-primary/10 rounded-3xl text-primary border border-primary/20">
                               <Truck className="w-10 h-10" />
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-2">
                                  <span className="mono text-[10px] font-black text-slate-500 uppercase tracking-widest">{ship.id}</span>
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/30 uppercase tracking-widest">DISPATCHED</span>
                               </div>
                               <h4 className="text-xl font-bold text-white uppercase italic tracking-tight leading-none mb-2 group-hover:text-primary transition-colors">{ship.carrier} • {ship.mode}</h4>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Destination: {ship.destination}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-12 border-l border-slate-800 pl-8 flex-1">
                            <div>
                               <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Items Manifested</span>
                               <p className="text-xs font-bold text-white uppercase italic">{ship.items.join(', ')}</p>
                            </div>
                            <div className="text-right ml-auto">
                               <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1 italic">Last Event</p>
                               <p className="text-xs font-bold text-emerald-400 uppercase italic">In-Transit: {ship.events[ship.events.length-1].location}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-white transition-all" />
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
            )}
          </div>
        );

      case 'PACKET':
        return selectedRelease && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 pb-20">
            <button onClick={() => setView('QUEUES')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Queues
            </button>

            <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
               <div className="relative z-10 flex items-center gap-12">
                  <div className="p-12 bg-slate-950/60 rounded-[48px] border border-slate-800 shadow-2xl relative group">
                     <FileText className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse">
                        <ShieldCheck className="w-4 h-4 text-white" />
                     </div>
                  </div>
                  <div>
                     <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">Release Authority Record</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Rev {selectedRelease.woId.split('-')[1]} • PROD-NOM</span>
                     </div>
                     <h3 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{selectedRelease.name}</h3>
                     <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                        <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Program: {selectedRelease.program}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Destination: {selectedRelease.destination}</span>
                     </div>
                  </div>
               </div>
               <div className="relative z-10 space-y-4 lg:border-l lg:border-slate-800 lg:pl-12">
                  <button 
                    onClick={() => handleApprove(selectedRelease)}
                    className="w-full px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[28px] uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-4 group active:scale-95"
                  >
                     <ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform" /> Approve for Release
                  </button>
                  <button className="w-full px-12 py-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-[28px] uppercase tracking-[0.2em] text-xs border border-slate-700 transition-all">Download Master Packet</button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  {/* RELEASE CHECKLIST */}
                  <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                     <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                        <ClipboardList className="w-6 h-6 text-primary" /> Final Release Checklist
                     </h4>
                     <div className="space-y-4">
                        {[
                           { label: 'Work Order Execution Confirmation', status: 'VERIFIED', icon: CheckCircle2 },
                           { label: 'As-Built Technical Baseline Validated', status: 'VERIFIED', icon: CheckCircle2 },
                           { label: 'NDI / System Proof Reports Attached', status: 'VERIFIED', icon: CheckCircle2 },
                           { label: 'ITAR / Compliance Posture Clear', status: 'VERIFIED', icon: CheckCircle2 },
                           { label: 'Integration Center Acceptance Hook', status: 'VERIFIED', icon: CheckCircle2 },
                        ].map((chk, i) => (
                           <div key={i} className="p-6 bg-slate-800/40 border border-slate-800 rounded-3xl flex justify-between items-center group hover:bg-slate-800 transition-all">
                              <div className="flex items-center gap-5">
                                 <chk.icon className="w-6 h-6 text-emerald-400" />
                                 <p className="text-sm font-bold text-slate-200 uppercase tracking-tight">{chk.label}</p>
                              </div>
                              <div className="text-right">
                                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">{chk.status}</span>
                                 <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">Hash: LBX-99-{i}X</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>

                  {/* TRACEABILITY SUMMARY */}
                  <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl overflow-hidden">
                     <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                        <Fingerprint className="w-6 h-6 text-primary" /> Multi-Source Traceability Matrix
                     </h4>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-800/20 border-b border-slate-800">
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Part Reference</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Serial / Lot</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Node Source</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-800">
                              {selectedRelease.traceability.map(t => (
                                 <tr key={t.sn} className="hover:bg-slate-800/30 transition-all">
                                    <td className="px-6 py-6 font-bold text-white text-xs uppercase tracking-tight">{t.pn}</td>
                                    <td className="px-6 py-6 text-center mono text-xs font-bold text-primary italic uppercase tracking-tighter">{t.sn} • {t.lot}</td>
                                    <td className="px-6 py-6 text-right text-[10px] font-black text-slate-400 uppercase italic tracking-widest">{t.supplier}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </section>
               </div>

               <div className="space-y-8">
                  {/* RELEASE AUTHORITY SIGNATURES */}
                  <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-dark" />
                     <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10 italic border-b border-slate-800 pb-6">Release Signatures</h4>
                     <div className="space-y-10">
                        {[
                           { role: 'Lead Inspector', name: 'R. Vance', time: 'Today 08:12', status: 'SIGNED' },
                           { role: 'Engineering Lead', name: 'S. Connor', time: 'Today 09:45', status: 'SIGNED' },
                           { role: 'System Release Authority', name: 'A. Rivera', time: 'PENDING', status: 'AWAITING' },
                        ].map((sig, i) => (
                           <div key={i} className="flex gap-6 group">
                              <div className="flex flex-col items-center">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    sig.status === 'SIGNED' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border border-slate-700 text-slate-600 group-hover:border-primary'
                                 }`}>
                                    {sig.status === 'SIGNED' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                 </div>
                                 {i < 2 && <div className="w-px flex-1 bg-slate-800 my-2" />}
                              </div>
                              <div className="pb-4">
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic leading-none mb-2">{sig.role}</p>
                                 <p className="text-lg font-bold text-white italic tracking-tight">{sig.name}</p>
                                 <p className={`text-[10px] font-black uppercase mt-1 ${sig.status === 'SIGNED' ? 'text-emerald-500' : 'text-slate-500'}`}>{sig.time}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>

                  {/* AI CONFORMANCE INSIGHT */}
                  <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="w-24 h-24 text-primary" /></div>
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                        <Activity className="w-4 h-4 text-primary" /> AI Packet Verification
                     </h4>
                     <div className="space-y-6">
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-4 shadow-inner">
                           <p className="text-xs text-slate-300 font-bold leading-relaxed italic">"Packet integrity verified. Digital twins for all manifested items are synced to Launchbelt Cloud. <span className="text-emerald-400">0% Traceability gaps</span> detected."</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase italic pt-4 border-t border-slate-800">
                           <span className="text-slate-600">Verification Confidence</span>
                           <span className="text-emerald-400">99.9%</span>
                        </div>
                     </div>
                  </section>
               </div>
            </div>
          </div>
        );

      case 'EXECUTION':
        return selectedShipment && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <button onClick={() => setView('QUEUES')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Queues
            </button>

            <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
               <div className="relative z-10 flex items-center gap-12">
                  <div className="p-12 bg-slate-950/60 rounded-[48px] border border-slate-800 shadow-2xl">
                     <Truck className="w-16 h-16 text-primary" />
                  </div>
                  <div>
                     <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">Logistics Execution</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{selectedShipment.id}</span>
                     </div>
                     <h3 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{selectedShipment.carrier}</h3>
                     <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                        <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Tracking: {selectedShipment.trackingNumber}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Destination: {selectedShipment.destination}</span>
                     </div>
                  </div>
               </div>
               <div className="relative z-10 space-y-4 lg:border-l lg:border-slate-800 lg:pl-12">
                  <button className="w-full px-12 py-6 bg-white text-slate-900 font-black rounded-[28px] uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                     <Download className="w-5 h-5" /> Print Packout List
                  </button>
                  <button 
                    onClick={() => logAction('A. Rivera', 'SHIPMENT_CONFIRMED', selectedShipment.id, `Confirmed delivery receipt for ${selectedShipment.woId}`)}
                    className="w-full px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[28px] uppercase tracking-[0.2em] text-xs shadow-2xl transition-all"
                  >
                     Confirm Delivery
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                  <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                     <History className="w-6 h-6 text-primary" /> Chain-of-Custody Timeline
                  </h4>
                  <div className="space-y-12 pl-10 relative">
                     <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800" />
                     {selectedShipment.events.map((evt, idx) => (
                        <div key={idx} className="relative group">
                           <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full border-4 border-emerald-500 bg-slate-950 transition-all ring-8 ring-emerald-500/5" />
                           <div>
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">{evt.time}</p>
                              <p className="text-lg font-bold uppercase tracking-tight text-white">{evt.event}</p>
                              <p className="text-xs text-slate-500 font-medium italic mt-1">{evt.location}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5"><Box className="w-48 h-48 text-primary" /></div>
                  <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3 relative z-10">
                     <Package className="w-6 h-6 text-primary" /> Manifested Components
                  </h4>
                  <div className="space-y-4 relative z-10">
                     {selectedShipment.items.map((item, i) => (
                        <div key={i} className="p-8 bg-slate-800/40 rounded-[32px] border border-slate-800 group hover:border-primary/40 transition-all flex justify-between items-center">
                           <div className="flex items-center gap-6">
                              <Box className="w-8 h-8 text-primary" />
                              <p className="text-lg font-bold text-white uppercase italic tracking-tighter">{item}</p>
                           </div>
                           <CheckCircle2 className="w-6 h-6 text-emerald-400 opacity-40 group-hover:opacity-100 transition-all" />
                        </div>
                     ))}
                  </div>
               </section>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 overflow-y-auto max-h-[calc(100vh-80px)] vertical-scroll custom-scrollbar">
      {view === 'QUEUES' && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Forge-Owned</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Shipping & Release Authority</h2>
            <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Final Logistics Gate • Configuration Seal</p>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:ring-1 focus:ring-primary w-64 shadow-xl" 
                  placeholder="Filter Release, WO, Program..." 
                />
             </div>
          </div>
        </div>
      )}

      <div className="mx-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default ShippingRelease;
