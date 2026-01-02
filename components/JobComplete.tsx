
import React from 'react';
import { CheckCircle2, ArrowRight, Home, Zap, Package, Target } from 'lucide-react';

interface JobCompleteProps {
  data: any;
  onStartNext: (context: any) => void;
  onReturnHome: () => void;
}

const JobComplete: React.FC<JobCompleteProps> = ({ data, onStartNext, onReturnHome }) => {
  // Mock next job in queue
  const nextJob = { 
    station: data.station.includes('CNC') ? 'CNC Station' : data.station.includes('Additive') ? 'Additive Station' : 'Kiosk Home', 
    part: '7721-002', 
    wo: 'WO-9922', 
    op: 'Finish Milling B-Side' 
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-transparent p-6 text-center space-y-8 animate-in zoom-in-95 duration-700 overflow-hidden">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Job Complete</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.3em]">Operational Sequence Logged</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left relative overflow-hidden h-48">
          <div className="absolute top-0 right-0 p-4 opacity-5"><CheckCircle2 className="w-20 h-20 text-emerald-500" /></div>
          <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 italic mb-4">Session Recap</h3>
          <div className="space-y-2 relative z-10">
             <div>
                <p className="text-[8px] text-slate-600 font-black uppercase mb-0.5">Work Order</p>
                <p className="text-lg font-bold text-white uppercase">{data.wo}</p>
             </div>
             <div>
                <p className="text-[8px] text-slate-600 font-black uppercase mb-0.5">Op Finished</p>
                <p className="text-sm font-bold text-slate-400 uppercase italic truncate">{data.op}</p>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left relative overflow-hidden h-48">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-20 h-20 text-primary" /></div>
          <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 italic mb-4">Next in Queue</h3>
          <div className="space-y-2 relative z-10">
             <div>
                <p className="text-[8px] text-slate-600 font-black uppercase mb-0.5">Work Order</p>
                <p className="text-lg font-bold text-white uppercase">{nextJob.wo}</p>
             </div>
             <div>
                <p className="text-[8px] text-slate-600 font-black uppercase mb-0.5">Incoming Part</p>
                <p className="text-sm font-bold text-slate-400 uppercase italic">{nextJob.part}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 w-full max-w-4xl">
        <button 
          onClick={onReturnHome}
          className="flex-1 py-6 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-3"
        >
          <Home className="w-5 h-5" /> Home
        </button>
        <button 
          onClick={() => onStartNext(nextJob)}
          className="flex-[1.5] py-6 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-lg uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
        >
          Start Next Job <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default JobComplete;