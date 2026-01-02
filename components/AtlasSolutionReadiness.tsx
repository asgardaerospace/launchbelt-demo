
import React, { useState, useMemo } from 'react';
import { Target, Shield, Box, Zap, ChevronRight, ArrowLeft, CheckCircle2, Clock, MapPin, Sparkles, Database, Info, ShoppingCart, Rocket, Activity, FlaskConical, Hammer, FileText, Satellite, Cpu, Radio, Send, Drone, LayoutGrid, Filter, MessageSquare, ShieldCheck, ClipboardCheck, User } from 'lucide-react';
import { logAction } from '../services/auditService';

interface AtlasSolutionReadinessProps {
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
  initialSolutionId?: string;
}

const CATEGORIES = ['All Systems', 'Satellites', 'Payloads', 'Communications Systems', 'Launch Systems', 'UAS', 'Ground Systems'];

const SOLUTIONS = [
  // --- SATELLITES ---
  { 
    id: 'SOL-SAT-01', name: 'Tactical ISR Microsat', supplier: 'Orbital Dynamics Inc.', category: 'Satellites', role: 'High-Res Imaging', status: 'Approved for Deployment', 
    delivery: '60-90 Days', price: '$12M - $18M', readiness: 'APPROVED', 
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    desc: 'Rapidly deployable microsatellite platform optimized for sub-meter resolution optical imaging in contested LEO orbits.',
    specs: ['Mass: 180kg', 'Propulsion: Cold Gas', 'Encryption: AES-256 L5', 'Design Life: 3-5 Years'],
    infrastructure: 'Integration: Asgard Forge Austin • Machining: Apex Aerospace • Coating: Great Lakes'
  },
  { 
    id: 'SOL-SAT-02', name: 'Vanguard strategic GEO Bus', supplier: 'NovaSpace Systems', category: 'Satellites', role: 'Strategic Comms', status: 'In Testing', 
    delivery: '180 Days', price: '$120M - $150M', readiness: 'TESTING',
    img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
    desc: 'Heavy-class geostationary bus designed for 15-year strategic mission life and high-power payloads.',
    specs: ['Station Keeping: Electric', 'Mass: 3500kg', 'Power: 12kW BOL', 'Shielding: Deep Space Hardened'],
    infrastructure: 'Integration: Asgard Forge Central • Primary Struct: Titan Launch'
  },
  { 
    id: 'SOL-SAT-03', name: 'SwiftCube Modular Platform', supplier: 'Cubix Aerospace', category: 'Satellites', role: 'Modular LEO Bus', status: 'Approved for Deployment', 
    delivery: '45 Days', price: '$2M - $5M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800',
    desc: 'Industry-standard 6U/12U modular satellite bus for rapid experimentation and payload hosting.',
    specs: ['Standard Form Factor', 'Plug-and-Play Avionics', 'Radiated Power: 40W', 'Payload Volume: 4U'],
    infrastructure: 'Integration: Asgard Forge Boulder • Fab: Silicon Valley Additive'
  },
  { 
    id: 'SOL-SAT-04', name: 'Aeolus Weather Constellation', supplier: 'TerraMetrika', category: 'Satellites', role: 'Hyperspectral Sensing', status: 'In Testing', 
    delivery: '120 Days', price: '$15M - $22M', readiness: 'TESTING',
    img: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&q=80&w=800',
    desc: 'Next-gen meteorological platform for real-time atmospheric profiling and environmental intelligence.',
    specs: ['Bands: 128 Spectral', 'Resolution: 1.2m', 'Data: Ka-Band High Speed', 'Orbit: Sun-Sync'],
    infrastructure: 'Integration: Asgard Forge Austin • Optics: OpticFlow Labs'
  },

  // --- PAYLOADS ---
  { 
    id: 'SOL-PAY-01', name: 'Spectra-9 Multi-Sensor Suite', supplier: 'OpticFlow Labs', category: 'Payloads', role: 'Optical Intelligence', status: 'Approved for Deployment', 
    delivery: '120 Days', price: '$4M - $6M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    desc: 'High-resolution multispectral sensor suite optimized for agricultural monitoring and defense reconnaissance.',
    specs: ['9 Spectral Bands', 'Resolution: 0.5m GSD', 'Data Rate: 2.5 Gbps', 'SWaP Optimized'],
    infrastructure: 'Integration: Asgard Forge Austin • Optical Fab: Great Lakes'
  },
  { 
    id: 'SOL-PAY-02', name: 'SAR-X All-Weather Radar', supplier: 'Waveform Dynamics', category: 'Payloads', role: 'All-Weather ISR', status: 'Approved for Deployment', 
    delivery: '180 Days', price: '$15M - $22M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=800',
    desc: 'Synthetic Aperture Radar system capable of day/night and all-weather imaging through cloud cover.',
    specs: ['X-Band Operation', 'Resolution: 0.25m', 'Swath Width: 10km', 'Dual Polarization'],
    infrastructure: 'Integration: Asgard Forge Boulder • Antennas: Desert Heat Composites'
  },
  { 
    id: 'SOL-PAY-03', name: 'SigInt Array V2 Collector', supplier: 'CyberSignal Defense', category: 'Payloads', role: 'Signals Intel', status: 'In Testing', 
    delivery: '150 Days', price: '$9M - $11M', readiness: 'TESTING',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    desc: 'Advanced software-defined radio array for wide-spectrum signal detection and localization.',
    specs: ['Frequency: 10MHz-40GHz', 'BW: 1GHz', 'Onboard FPGA Processing', 'L5 Encryption'],
    infrastructure: 'Integration: Asgard Forge Dayton • PCB: North Star Sensors'
  },
  { 
    id: 'SOL-PAY-04', name: 'Lumina Laser Terminal', supplier: 'PhotonLink', category: 'Payloads', role: 'Optical Crosslink', status: 'Approved for Deployment', 
    delivery: '90 Days', price: '$3.5M - $5M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    desc: 'Inter-satellite optical communications terminal for terabit-scale data mesh networks.',
    specs: ['Rate: 10 Gbps', 'Range: 5000km', 'Point Accuracy: <2 urad', 'Mass: 12kg'],
    infrastructure: 'Integration: Asgard Forge Boulder • Precision Gimbals: Apex'
  },

  // --- GROUND SYSTEMS ---
  { 
    id: 'SOL-GRD-01', name: 'Mobile Command Node MCN-1', supplier: 'TerraLink Defense', category: 'Ground Systems', role: 'Tactical Command', status: 'Approved for Deployment', 
    delivery: '90 Days', price: '$2.5M - $4M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=800',
    desc: 'Ruggedized mobile operations center with integrated SATCOM and multi-domain data fusion.',
    specs: ['Deployment: < 15 mins', 'Power: Hybrid Electric', 'Seats: 4 Operators', 'Hardening: EMI/EMP'],
    infrastructure: 'Integration: Asgard Forge Austin • Structural: Redstone Propulsion'
  },
  { 
    id: 'SOL-GRD-02', name: 'Deployable Phased Array Unit', supplier: 'SignalReach Systems', category: 'Ground Systems', role: 'Global Linkage', status: 'In Testing', 
    delivery: '120 Days', price: '$1.8M - $3M', readiness: 'TESTING',
    img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
    desc: 'Modular, rapidly deployable antenna array for high-throughput tactical communications.',
    specs: ['Frequencies: X, Ku, Ka', 'Array Gain: 45dB', 'Tracking: Electronic Beam Steering', 'Weight: 80kg'],
    infrastructure: 'Integration: Asgard Forge Dayton • RF Components: North Star Sensors'
  },
  { 
    id: 'SOL-GRD-03', name: 'Horizon Ground Suite', supplier: 'Horizon Ops', category: 'Ground Systems', role: 'Mission Control', status: 'Approved for Deployment', 
    delivery: '60 Days', price: '$5M - $8M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    desc: 'Enterprise-grade ground software and hardware suite for multi-constellation management.',
    specs: ['Cloud Native Architecture', 'Standard: CCSDS Compliant', 'Automated Pass Planning', 'AI Anomaly Detection'],
    infrastructure: 'Integration: Asgard Forge Austin • Hardware: Apex Aerospace'
  },

  // --- UAS ---
  { 
    id: 'SOL-UAS-01', name: 'SkyHawk Tactical ISR V4', supplier: 'SkyHawk Systems', category: 'UAS', role: 'Tactical ISR', status: 'In Testing', 
    delivery: '30 Days', price: '$1.2M - $2M', readiness: 'TESTING',
    img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    desc: 'Low-observable tactical UAS for persistent surveillance in contested airspaces.',
    specs: ['Range: 500km', 'Endurance: 12h', 'Sensors: Multi-spectral', 'Encryption: L5 Secure'],
    infrastructure: 'Integration: Asgard Forge Boulder • Fab: Lonestar Heavy'
  },
  { 
    id: 'SOL-UAS-02', name: 'Kestrel Maritime Patrol', supplier: 'Avian Defense', category: 'UAS', role: 'Maritime Domain Awareness', status: 'Approved for Deployment', 
    delivery: '60 Days', price: '$4M - $7M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?auto=format&fit=crop&q=80&w=800',
    desc: 'Extended endurance UAS optimized for maritime domain awareness and search and rescue.',
    specs: ['Range: 2500km', 'Endurance: 24h', 'SATCOM Integrated', 'Automatic Takeoff/Landing'],
    infrastructure: 'Integration: Asgard Forge Austin • Fab: Mid-Continent Aero'
  },
  { 
    id: 'SOL-UAS-03', name: 'Wraith Penetrator', supplier: 'ShadowDrones Inc.', category: 'UAS', role: 'Covert Surveillance', status: 'In Testing', 
    delivery: '240 Days', price: '$18M - $25M', readiness: 'TESTING',
    img: 'https://images.unsplash.com/photo-1524143878510-e3b8d6312402?auto=format&fit=crop&q=80&w=800',
    desc: 'Extreme low-observable stealth platform for high-risk penetration and ISR missions.',
    specs: ['LO Signature: X-Band Optimized', 'Endurance: 8h', 'Internal Weapon Bay', 'AI Nav (GPS Denied)'],
    infrastructure: 'Integration: Asgard Forge Boulder • Composite: Desert Heat Composites'
  },
  { 
    id: 'SOL-UAS-04', name: 'Atlas Cargo VTOL', supplier: 'HeavyLift Aero', category: 'UAS', role: 'Autonomous Logistics', status: 'Approved for Deployment', 
    delivery: '90 Days', price: '$5M - $8M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1473960154305-994341ff710f?auto=format&fit=crop&q=80&w=800',
    desc: 'Heavy-lift VTOL platform for autonomous tactical resupply in forward-deployed environments.',
    specs: ['Payload: 500kg', 'Range: 800km', 'Fuel: Hybrid Electric', 'Loading: Automated Internal'],
    infrastructure: 'Integration: Asgard Forge Dayton • Structural: Redstone Propulsion'
  },

  // --- COMMUNICATIONS SYSTEMS ---
  { 
    id: 'SOL-COM-01', name: 'Persistent Relay Node', supplier: 'Vertex Systems', category: 'Communications Systems', role: 'Multi-Band Relay', status: 'Approved for Deployment', 
    delivery: '180+ Days', price: '$45M - $60M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80&w=800',
    desc: 'High-bandwidth communications bus capable of multi-node crosslinking and resilient relay in MEO/GEO domains.',
    specs: ['Mass: 2200kg', 'Propulsion: Hall Effect', 'Throughput: 40 Gbps', 'Hardening: Strategic RAD-HARD'],
    infrastructure: 'Integration: Asgard Forge Boulder • Test: Asgard Forge Central • Primary Fab: Lonestar Heavy'
  },

  // --- LAUNCH SYSTEMS ---
  { 
    id: 'SOL-LCH-01', name: 'Heavy Lift Alpha-7', supplier: 'Titan Launch', category: 'Launch Systems', role: 'Orbital Insertion', status: 'Approved for Deployment', 
    delivery: 'Planned Slots Available', price: '$62M - $85M', readiness: 'APPROVED',
    img: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
    desc: 'High-capacity orbital insertion vehicle for heavy national security payloads.',
    specs: ['Payload to LEO: 25t', 'Fairing: 5m Class', 'Reuse: Boostback Recovery', 'Nodes: Vandenberg, Cape'],
    infrastructure: 'Integration: Asgard Forge Central • Primary Struct: Apex Aerospace'
  }
];

const AtlasSolutionReadiness: React.FC<AtlasSolutionReadinessProps> = ({ onNavigate, onBack, initialSolutionId }) => {
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(initialSolutionId || null);
  const [activeCategory, setActiveCategory] = useState('All Systems');
  const [activeStatus, setActiveStatus] = useState<'ALL' | 'APPROVED' | 'TESTING'>('ALL');
  const [briefingWorkflow, setBriefingWorkflow] = useState<'NONE' | 'REQUEST' | 'SUCCESS' | 'CONSULT_REQUEST' | 'CONSULT_SUCCESS'>('NONE');
  const [submitting, setSubmitting] = useState(false);

  const filteredSolutions = useMemo(() => {
    return SOLUTIONS.filter(s => {
      const catMatch = activeCategory === 'All Systems' || s.category === activeCategory;
      const statusMatch = activeStatus === 'ALL' || s.readiness === activeStatus;
      return catMatch && statusMatch;
    });
  }, [activeCategory, activeStatus]);

  const selectedSolution = useMemo(() => SOLUTIONS.find(s => s.id === selectedSolutionId), [selectedSolutionId]);

  const handleRequestBriefing = async () => {
    setSubmitting(true);
    if (selectedSolution) {
       await logAction('SF-USER-09', 'TECHNICAL_BRIEFING_REQUESTED', selectedSolution.id, `Briefing requested with ${selectedSolution.supplier} for ${selectedSolution.name}.`);
    }
    setTimeout(() => {
      setSubmitting(false);
      setBriefingWorkflow('SUCCESS');
    }, 1500);
  };

  const handleRequestConsultation = async () => {
    setSubmitting(true);
    if (selectedSolution) {
      await logAction('SF-USER-09', 'SOLUTION_CONSULTATION_REQUESTED', selectedSolution.id, `Atlas Engineering Consultation requested for ${selectedSolution.name}.`);
    }
    setTimeout(() => {
      setSubmitting(false);
      setBriefingWorkflow('CONSULT_SUCCESS');
    }, 1200);
  };

  if (selectedSolution) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar pr-2">
         <div className="flex flex-col gap-6 px-2">
            <button onClick={() => { setSelectedSolutionId(null); setBriefingWorkflow('NONE'); }} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Capability Catalog
            </button>

            {briefingWorkflow === 'NONE' ? (
               <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
                  <div className="relative z-10 flex items-center gap-10">
                     <div className="p-2 w-32 h-32 rounded-[32px] overflow-hidden border border-primary/20 shadow-2xl">
                        <img src={selectedSolution.img} className="w-full h-full object-cover grayscale brightness-75" alt={selectedSolution.name} />
                     </div>
                     <div>
                        <div className="flex items-center gap-4 mb-4">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${selectedSolution.readiness === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{selectedSolution.status}</span>
                           <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{selectedSolution.supplier}</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{selectedSolution.name}</h2>
                        <div className="flex items-center gap-6 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                           <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Role: {selectedSolution.role}</span>
                           <span className="flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4" /> Manufactured via Launchbelt</span>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 space-y-4 lg:border-l lg:border-slate-800 lg:pl-12 flex flex-col">
                     <button 
                       onClick={() => onNavigate('RFPs & RFQs', { solution: selectedSolution })}
                       className="px-12 py-6 bg-primary hover:bg-primary-dark text-white font-black rounded-[32px] uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 transition-all scale-105 active:scale-100"
                     >
                        Issue RFQ Request with {selectedSolution.supplier.split(' ')[0]}
                     </button>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => setBriefingWorkflow('REQUEST')}
                            className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-[24px] uppercase tracking-[0.2em] text-[10px] border border-slate-700 transition-all"
                        >
                            Request Technical Briefing
                        </button>
                        <button 
                            onClick={() => setBriefingWorkflow('CONSULT_REQUEST')}
                            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-primary font-black rounded-[24px] uppercase tracking-[0.2em] text-[10px] border border-primary/20 transition-all"
                        >
                            Request Solution Consultation
                        </button>
                     </div>
                  </div>
               </div>
            ) : briefingWorkflow === 'REQUEST' ? (
               <div className="bg-slate-900 border border-primary/30 p-12 rounded-[64px] shadow-[0_0_80px_rgba(59,130,246,0.1)] relative overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="absolute top-0 right-0 p-12 opacity-5"><MessageSquare className="w-48 h-48 text-primary" /></div>
                  <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                     <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Initiate Technical Briefing</h3>
                           <p className="text-sm text-slate-500 font-medium">Requesting a secure discussion with solutions engineers at {selectedSolution.supplier}.</p>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Primary Discussion Areas</label>
                           <div className="grid grid-cols-2 gap-3">
                              {['Thermal Profile', 'Bandwidth Thresholds', 'Mass & Envelope', 'NIST Compliance', 'Supply Chain Continuity'].map(a => (
                                 <div key={a} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 group cursor-pointer hover:border-primary transition-all">
                                    <div className="w-4 h-4 rounded border border-slate-700 group-hover:bg-primary group-hover:border-primary transition-all" />
                                    {a}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="lg:w-96 space-y-6">
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Workflow Status</p>
                           <div className="flex items-center gap-3 text-sm font-bold text-white uppercase italic">
                              <Activity className="w-5 h-5 text-primary animate-pulse" /> Awaiting User Input
                           </div>
                           <p className="text-[10px] text-slate-500 leading-relaxed">System will auto-attach Mission Context and Clearance metadata to this request.</p>
                        </div>
                        <button 
                           onClick={handleRequestBriefing}
                           disabled={submitting}
                           className="w-full py-6 bg-primary text-white font-black rounded-3xl uppercase tracking-widest text-sm shadow-2xl transition-all hover:scale-105 active:scale-100 flex items-center justify-center gap-3"
                        >
                           {submitting ? <Activity className="animate-spin w-5 h-5" /> : <>Submit Request <Send className="w-4 h-4" /></>}
                        </button>
                        <button onClick={() => setBriefingWorkflow('NONE')} className="w-full py-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Cancel Request</button>
                     </div>
                  </div>
               </div>
            ) : briefingWorkflow === 'CONSULT_REQUEST' ? (
                <div className="bg-slate-900 border border-primary/30 p-12 rounded-[64px] shadow-[0_0_80px_rgba(249,115,22,0.1)] relative overflow-hidden animate-in zoom-in-95 duration-500">
                   <div className="absolute top-0 right-0 p-12 opacity-5"><Sparkles className="w-48 h-48 text-primary" /></div>
                   <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                      <div className="space-y-6 flex-1">
                         <div className="space-y-2">
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Atlas Solution Consultation</h3>
                            <p className="text-sm text-slate-500 font-medium">Requesting Atlas engineering support to validate <span className="text-primary">{selectedSolution.name}</span> for your mission.</p>
                         </div>
                         <div className="space-y-4 pt-4 border-t border-slate-800">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Help Requested With</label>
                            <div className="grid grid-cols-2 gap-3">
                               {['Mission Requirements Fit', 'System-Level Tradeoffs', 'Integration & Test Plan', 'Delivery Timeline & Risk', 'NIST 800-171 Posture'].map(a => (
                                  <div key={a} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 group cursor-pointer hover:border-primary transition-all">
                                     <div className="w-4 h-4 rounded border border-slate-700 group-hover:bg-primary group-hover:border-primary transition-all" />
                                     {a}
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="lg:w-96 space-y-6">
                         <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Internal Workflow</p>
                            <div className="flex items-center gap-3 text-sm font-bold text-white uppercase italic">
                               <User className="w-5 h-5 text-primary" /> Atlas Systems SSC
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">Your mission intake data will be used as the primary baseline for this session.</p>
                         </div>
                         <button 
                            onClick={handleRequestConsultation}
                            disabled={submitting}
                            className="w-full py-6 bg-primary text-white font-black rounded-3xl uppercase tracking-widest text-sm shadow-2xl transition-all hover:scale-105 active:scale-100 flex items-center justify-center gap-3"
                         >
                            {submitting ? <Activity className="animate-spin w-5 h-5" /> : <>Request Engineering Session <Send className="w-4 h-4" /></>}
                         </button>
                         <button onClick={() => setBriefingWorkflow('NONE')} className="w-full py-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Cancel Request</button>
                      </div>
                   </div>
                </div>
             ) : briefingWorkflow === 'SUCCESS' ? (
               <div className="bg-slate-900 border border-emerald-500/30 p-12 rounded-[64px] text-center space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/30 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl">
                     <ClipboardCheck className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Briefing Request Confirmed</h3>
                     <p className="text-lg text-slate-500 font-bold uppercase tracking-widest max-w-xl mx-auto">
                        Your request for a technical discussion on <span className="text-primary">{selectedSolution.name}</span> has been logged.
                     </p>
                  </div>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl max-w-md mx-auto text-left space-y-4">
                     <div className="flex items-start gap-4">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">The supplier node will review your mission profile and propose 03 time slots within <span className="text-white font-bold uppercase">24 business hours</span>.</p>
                     </div>
                  </div>
                  <button onClick={() => setBriefingWorkflow('NONE')} className="px-12 py-5 bg-white text-slate-900 font-black rounded-[28px] uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Return to Solution View</button>
               </div>
            ) : (
                <div className="bg-slate-900 border border-primary/30 p-12 rounded-[64px] text-center space-y-8 animate-in zoom-in-95 duration-500">
                   <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl">
                      <MessageSquare className="w-12 h-12 text-primary" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Consultation Logged</h3>
                      <p className="text-lg text-slate-500 font-bold uppercase tracking-widest max-w-xl mx-auto">
                         The Atlas solutions engineering team has received your request for <span className="text-primary">{selectedSolution.name}</span>.
                      </p>
                   </div>
                   <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl max-w-md mx-auto text-left space-y-4">
                      <div className="flex items-start gap-4">
                         <Activity className="w-5 h-5 text-primary shrink-0" />
                         <p className="text-xs text-slate-400 font-medium leading-relaxed italic">An Atlas systems engineer will reach out via secure channel within <span className="text-white font-bold uppercase">04 business hours</span> to schedule the validation session.</p>
                      </div>
                   </div>
                   <button onClick={() => setBriefingWorkflow('NONE')} className="px-12 py-5 bg-white text-slate-900 font-black rounded-[28px] uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Return to Solution View</button>
                </div>
             )}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
            <div className="lg:col-span-2 space-y-8">
               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                  <h3 className="text-xl font-bold text-white mb-10 border-b border-slate-800 pb-6 uppercase italic tracking-tighter flex items-center gap-3">
                     <Info className="w-6 h-6 text-primary" /> System Overview & Mission Fit
                  </h3>
                  <p className="text-lg text-slate-300 font-medium leading-relaxed italic mb-10">{selectedSolution.desc}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2">Technical Specs</p>
                        <ul className="space-y-4">
                           {selectedSolution.specs.map(s => (
                             <li key={s} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                                <Zap className="w-4 h-4 text-primary" /> {s}
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2">Readiness Data</p>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-xs font-bold uppercase">
                              <span className="text-slate-500">TRL / SRL</span>
                              <span className="text-emerald-400">Level 9</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-bold uppercase">
                              <span className="text-slate-500">Test Proof</span>
                              <span className="text-emerald-400">PASSED</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-bold uppercase">
                              <span className="text-slate-500">Estimated Delivery</span>
                              <span className="text-primary">{selectedSolution.delivery}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5"><Hammer className="w-48 h-48 text-primary" /></div>
                  <h3 className="text-xl font-bold text-white mb-10 border-b border-slate-800 pb-6 uppercase italic tracking-tighter flex items-center gap-3 relative z-10">
                     <Activity className="w-6 h-6 text-primary" /> Manufacturing Infrastructure
                  </h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic mb-8 relative z-10">
                    This system is integrated and verified via the Launchbelt Network. All physical production is executed at authorized nodes to ensure L5 security and delivery certainty.
                  </p>
                  <div className="p-8 bg-slate-950/60 rounded-[32px] border border-slate-800 border-dashed relative z-10">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-4 italic">Execution Path Visibility (Auth Node Austin)</p>
                     <p className="text-sm text-slate-400 font-medium leading-relaxed italic">{selectedSolution.infrastructure}</p>
                  </div>
               </section>
            </div>

            <div className="space-y-8">
               <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Satellite className="w-24 h-24 text-primary" /></div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic border-b border-slate-800 pb-6">Supplier Profile</h4>
                  <div className="flex items-center gap-6 mb-10">
                     <div className="w-16 h-16 rounded-[24px] bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-primary text-2xl uppercase">
                        {selectedSolution.supplier[0]}
                     </div>
                     <div>
                        <h5 className="text-xl font-bold text-white uppercase italic tracking-tight leading-none">{selectedSolution.supplier}</h5>
                        <p className="text-[10px] text-slate-500 font-black uppercase mt-1">Authorized Defense Vendor</p>
                     </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-slate-800">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                        <span className="text-slate-500">Performance OTD</span>
                        <span className="text-emerald-400">98.2%</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                        <span className="text-slate-500">Facility Clearances</span>
                        <span className="text-slate-300">TS/SCI Ready</span>
                     </div>
                  </div>
               </section>

               <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark" />
                  <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 italic">Procurement Summary</h4>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase italic">Unit Price Range</span>
                        <span className="text-emerald-400 font-bold text-lg italic">{selectedSolution.price}</span>
                     </div>
                     <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                        <p className="text-[9px] text-primary font-black uppercase tracking-widest italic mb-2">Contracts Supported</p>
                        <p className="text-xs text-slate-400 font-bold uppercase italic">OTA, IDIQ, Firm-Fixed-Price</p>
                     </div>
                  </div>
               </section>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-2 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar pr-2">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic">Approved Solutions</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Operational Capability Catalog • NIST 800-171 Verified</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-[32px] backdrop-blur-md">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-800 pr-6 pl-2 italic">
              <Filter className="w-4 h-4 text-primary" /> Capability Filters
           </div>
           <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                 <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary/40' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-700'
                  }`}
                 >
                   {cat}
                 </button>
              ))}
           </div>
           <div className="h-8 w-px bg-slate-800 mx-2" />
           <div className="flex gap-2">
              {[
                { id: 'ALL', label: 'All Status' },
                { id: 'APPROVED', label: 'Approved' },
                { id: 'TESTING', label: 'In Testing' }
              ].map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveStatus(s.id as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    activeStatus === s.id ? 'bg-slate-800 text-white border-slate-700' : 'bg-transparent text-slate-600 border-transparent hover:text-slate-400'
                  }`}
                >
                   {s.label}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredSolutions.map(s => (
           <button 
            key={s.id} 
            onClick={() => setSelectedSolutionId(s.id)}
            className="bg-slate-900 border border-slate-800 rounded-[56px] text-left hover:border-primary/50 transition-all group shadow-2xl relative overflow-hidden flex flex-col min-h-[480px]"
           >
              <div className="h-56 overflow-hidden relative">
                 <img src={s.img} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" alt={s.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                 <div className="absolute top-6 left-8 flex items-center gap-3">
                    <span className="text-[9px] font-black px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-700 text-primary uppercase tracking-widest italic">{s.category}</span>
                 </div>
                 <div className="absolute bottom-4 left-8">
                    <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase italic ${s.readiness === 'APPROVED' ? 'bg-emerald-500/80 text-white border-emerald-400' : 'bg-amber-500/80 text-white border-amber-400'}`}>{s.status}</span>
                 </div>
              </div>

              <div className="p-10 flex-1 flex flex-col">
                 <div className="mb-6">
                    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2 group-hover:text-primary transition-colors">{s.name}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.supplier}</p>
                 </div>
                 
                 <p className="text-xs text-slate-400 font-medium italic line-clamp-3 mb-8">{s.desc}</p>
                 
                 <div className="mt-auto space-y-6 pt-10 border-t border-slate-800 relative z-10">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                       <span className="text-slate-600">Lead Time Window</span>
                       <span className="text-primary">{s.delivery}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                       <span className="text-[9px] font-black text-slate-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest italic flex items-center gap-1.5 shadow-inner">
                          <CheckCircle2 className="w-3 h-3" /> Launchbelt MFG Support
                       </span>
                       <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                    </div>
                 </div>
              </div>
           </button>
         ))}
         {filteredSolutions.length === 0 && (
           <div className="col-span-full py-32 text-center bg-slate-900 border-2 border-dashed border-slate-800 rounded-[64px] space-y-4">
              <Satellite className="w-16 h-16 text-slate-800 mx-auto" />
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] italic">No systems matching the current filter criteria</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default AtlasSolutionReadiness;
