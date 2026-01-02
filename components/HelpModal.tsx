
import React, { useState } from 'react';
import { 
  X, User, Trash2, FileSearch, ShieldAlert, 
  CheckCircle2, ChevronRight, ArrowLeft, 
  Wrench, Activity, AlertTriangle, Clock
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    wo: string;
    part: string;
    station: string;
    op: string;
  };
}

type HelpView = 'MENU' | 'CLEANUP' | 'TRAVELER' | 'CONFIRM';

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, context }) => {
  const [view, setView] = useState<HelpView>('MENU');
  const [confirmMessage, setConfirmMessage] = useState('');

  if (!isOpen) return null;

  const handleAction = (msg: string) => {
    setConfirmMessage(msg);
    setView('CONFIRM');
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={() => handleAction('Floor Supervisor has been notified. Estimated response: < 3 mins.')}
        className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-3xl text-left flex items-center gap-6 group transition-all"
      >
        <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white uppercase italic tracking-tight">Call Floor Supervisor</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Direct alert to area lead</p>
        </div>
      </button>

      <button 
        onClick={() => setView('CLEANUP')}
        className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-3xl text-left flex items-center gap-6 group transition-all"
      >
        <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
          <Trash2 className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white uppercase italic tracking-tight">Request Cleanup</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Spill or FOD risk remediation</p>
        </div>
      </button>

      <button 
        onClick={() => setView('TRAVELER')}
        className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-3xl text-left flex items-center gap-6 group transition-all"
      >
        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
          <FileSearch className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white uppercase italic tracking-tight">Review Travelers</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Read-only digital baseline</p>
        </div>
      </button>

      <button 
        onClick={() => handleAction('QA Engineering notified of assist request for current operation.')}
        className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-3xl text-left flex items-center gap-6 group transition-all"
      >
        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white uppercase italic tracking-tight">Request QA Assist</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Buy-off or deviation review</p>
        </div>
      </button>

      <button 
        onClick={() => handleAction('Maintenance ticket created for Station Node. System flagged for review.')}
        className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-3xl text-left flex items-center gap-6 group transition-all"
      >
        <div className="p-4 bg-red-500/10 rounded-2xl text-red-400 group-hover:scale-110 transition-transform">
          <Wrench className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white uppercase italic tracking-tight">Report Equipment Issue</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Mechanical or software fault</p>
        </div>
      </button>
    </div>
  );

  const renderCleanup = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <button onClick={() => setView('MENU')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors mb-4">
        <ArrowLeft className="w-3 h-3" /> Back to Menu
      </button>
      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Select Cleanup Reason</h3>
      <div className="grid grid-cols-1 gap-3">
        {['Chemical Spill / Leak', 'Metal Debris / Chips', 'FOD Risk (Foreign Object)', 'Personal Area Sanitation', 'Other'].map(r => (
          <button 
            key={r}
            onClick={() => handleAction(`Cleanup team dispatched for: ${r}`)}
            className="w-full p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-left font-bold text-white uppercase tracking-widest text-xs flex justify-between items-center group transition-all"
          >
            {r}
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-all" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderTraveler = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <button onClick={() => setView('MENU')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to Menu
      </button>
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 max-h-[400px] overflow-y-auto custom-scrollbar space-y-8">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-end">
          <div>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Active Traveler Baseline</p>
            <h4 className="text-2xl font-bold text-white uppercase tracking-tighter mt-1 italic">{context.wo}</h4>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase">{context.part}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Configuration Release Verified</span>
          </div>
          <div>
            <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Current Protocol</p>
            <p className="text-sm text-slate-300 font-medium italic">"{context.op}"</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[8px] text-slate-600 font-black uppercase block mb-1 italic">Process Spec</span>
              <p className="text-xs font-bold text-white uppercase italic">ASGARD-PROD-24-TX</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[8px] text-slate-600 font-black uppercase block mb-1 italic">Revision</span>
              <p className="text-xs font-bold text-white uppercase">Rev B.102</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2">Recent Chain of Custody</h5>
          {[
            { time: 'Today 08:12', user: 'SYSTEM', act: 'Job Scanned at Kiosk' },
            { time: 'Yesterday', user: 'Receiving', act: 'Material Release Approved' },
            { time: 'Nov 12', user: 'Sarah Connor', act: 'Work Package Baseline Locked' },
          ].map((h, i) => (
            <div key={i} className="flex gap-4 group">
              <Clock className="w-3.5 h-3.5 text-slate-700" />
              <div>
                <p className="text-[10px] text-slate-200 font-bold italic">{h.act}</p>
                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">{h.time} • {h.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="text-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      <div className="space-y-3">
        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Request Logged</h3>
        <p className="text-sm text-slate-400 font-medium italic max-w-xs mx-auto">"{confirmMessage}"</p>
      </div>
      <button 
        onClick={() => { setView('MENU'); onClose(); }}
        className="px-12 py-5 bg-white text-slate-900 font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all"
      >
        Return to Step
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-slate-800 flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Need Help?</h2>
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
              <span>{context.station}</span>
              <div className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-primary">{context.wo}</span>
              <div className="w-1 h-1 rounded-full bg-slate-800" />
              <span>{context.part}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-10">
          {view === 'MENU' && renderMenu()}
          {view === 'CLEANUP' && renderCleanup()}
          {view === 'TRAVELER' && renderTraveler()}
          {view === 'CONFIRM' && renderConfirm()}
        </div>

        {/* Footer */}
        {view !== 'CONFIRM' && (
          <div className="p-8 border-t border-slate-800 flex justify-center">
            <button onClick={onClose} className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.3em] transition-all">
              Cancel & Resume Production
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpModal;
