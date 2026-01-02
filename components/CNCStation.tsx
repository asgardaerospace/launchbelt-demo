
import React, { useState } from 'react';
import { 
  Hammer, Wrench, ShieldCheck, 
  AlertTriangle, Activity, ChevronRight,
  CheckCircle2, Target, Image as ImageIcon,
  // Fix: Removed drill import as it was unused and could cause errors if not present in lucide-react
  Info
} from 'lucide-react';
import { logAction } from '../services/auditService';
import HelpModal from './HelpModal';

interface CNCStep {
  title: string;
  desc: string;
  tooling: string;
  imageUrl?: string;
  checks: string[];
}

interface CNCStationProps {
  job?: any;
  onComplete: (details: any) => void;
  onFlagIssue: () => void;
}

const CNCStation: React.FC<CNCStationProps> = ({ job, onComplete, onFlagIssue }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [completedChecks, setCompletedChecks] = useState<Set<string>>(new Set());
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const steps: CNCStep[] = [
    { 
      title: 'Fixture Alignment', 
      desc: 'Verify 3-point fixture seating and clamp torque values.', 
      tooling: 'Torque Wrench (35 Nm)',
      imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800',
      checks: ['Fixture cleaned of chips', 'Clamps seated at Datums A/B', 'Torque verified (35 Nm)']
    },
    { 
      title: 'Tool 04 Loading', 
      desc: 'Verify HSK-63 interface cleanliness and load 12mm Finish Mill.', 
      tooling: 'HSK-63 Finish Mill 12mm',
      imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
      checks: ['Spindle taper cleaned', 'Tool ID 04 verified', 'Tool offset measured and synced']
    },
    { 
      title: 'Initial Cycle Start', 
      desc: 'Initiate LB-PROD cycle. Monitor spindle load on UI.', 
      tooling: 'Machine Console',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      checks: ['Coolant levels nominal', 'Door safety lock engaged', 'Cycle Start confirmed']
    },
    { 
      title: 'Surface Profile Audit', 
      desc: 'Verify surface finish at Z-45.0 coordinate before final pass.', 
      tooling: 'Surface Profilometer',
      imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', 
      checks: ['X/Y variance within 0.005"', 'Ra value < 3.2', 'Zero visual scoring']
    },
    { 
      title: 'Release & Deburr', 
      desc: 'Unclamp part and perform final manual edge break.', 
      tooling: 'Ceramic Deburr Tool',
      imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
      checks: ['Edges broken per spec', 'Part cleaned of debris', 'Traveler signed']
    }
  ];

  const currentStep = steps[currentStepIdx];
  const allChecksDone = currentStep.checks.every(c => completedChecks.has(`${currentStepIdx}-${c}`));

  const toggleCheck = (check: string) => {
    const key = `${currentStepIdx}-${check}`;
    const next = new Set(completedChecks);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCompletedChecks(next);
  };

  const handleNext = async () => {
    if (currentStepIdx === steps.length - 1) {
      setIsFinishing(true);
      await logAction('OP-A1', 'CNC_JOB_COMPLETED', job?.wo || 'WO-UNKNOWN', `Finished ${job?.op || 'CNC OP'}`);
      setTimeout(() => onComplete({
        wo: job?.wo,
        part: job?.part,
        op: job?.op,
        station: 'CNC Station Alpha',
        nextOp: 'Certification',
        nextStation: 'Certification Station'
      }), 1000);
    } else {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const progress = ((currentStepIdx + 1) / steps.length) * 100;

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      {/* Region A: Situational Header (Pinned) */}
      <div className="h-16 flex justify-between items-center bg-slate-900/50 border-b border-slate-800 px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Hammer className="w-5 h-5" />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-widest">{job?.wo || 'WO-9921'}</span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">{job?.part || 'Part: 7721-001'}</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">{job?.op || 'Finish Machining'}</h2>
           </div>
        </div>
        <div className="flex flex-col items-end gap-1">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Progress: {currentStepIdx + 1}/{steps.length}</p>
           <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
           </div>
        </div>
      </div>

      {/* Region B: Cockpit Workspace (Split-Pane, No Global Scroll) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Visual Guide Pane (Left) */}
        <div className="w-3/5 border-r border-slate-800 p-4 bg-slate-950/20 relative">
          <div className="h-full w-full rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
            {currentStep.imageUrl ? (
              <img src={currentStep.imageUrl} className="w-full h-full object-cover opacity-90" alt={currentStep.title} />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-700">
                <ImageIcon className="w-12 h-12" />
                <p className="text-xs font-black uppercase tracking-widest">Guide Pending</p>
              </div>
            )}
          </div>
          <div className="absolute top-8 left-8 px-4 py-1.5 bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg border border-white/10 shadow-2xl">
            Step {currentStepIdx + 1} Schematic
          </div>
        </div>

        {/* Interaction Pane (Right) */}
        <div className="w-2/5 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{currentStep.title}</h3>
             <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"{currentStep.desc}"</p>
             </div>
             <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[8px]">
                <Wrench className="w-3 h-3 text-primary" /> Tooling: {currentStep.tooling}
             </div>
          </div>

          <div className="space-y-2">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Verification Checklist</p>
             {currentStep.checks.map(check => (
               <button 
                 key={check}
                 onClick={() => toggleCheck(check)}
                 className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${
                   completedChecks.has(`${currentStepIdx}-${check}`) 
                     ? 'bg-emerald-500/10 border-emerald-500/40' 
                     : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                 }`}
               >
                 <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                   completedChecks.has(`${currentStepIdx}-${check}`) ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-950 border-slate-700'
                 }`}>
                   {completedChecks.has(`${currentStepIdx}-${check}`) && <CheckCircle2 className="w-4 h-4 text-white" />}
                 </div>
                 <span className={`text-[11px] font-bold uppercase italic tracking-tight leading-none ${completedChecks.has(`${currentStepIdx}-${check}`) ? 'text-emerald-400' : 'text-slate-500'}`}>{check}</span>
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Region C: Action Bar (Pinned) */}
      <div className="h-24 bg-slate-900/50 border-t border-slate-800 px-6 flex justify-between items-center shrink-0 z-10">
        <div className="flex gap-3">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="h-14 px-6 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-700 transition-all flex items-center gap-2"
          >
            <Info className="w-4 h-4" /> Help
          </button>
          <button 
            onClick={onFlagIssue}
            className="h-14 px-6 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-red-500/20 transition-all flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Flag Issue
          </button>
        </div>
        <button 
          onClick={handleNext}
          disabled={!allChecksDone || isFinishing}
          className={`h-14 px-10 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
            allChecksDone && !isFinishing 
              ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/30' 
              : 'bg-slate-800 text-slate-600 opacity-50'
          }`}
        >
          {isFinishing ? (
            <Activity className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {currentStepIdx === steps.length - 1 ? 'Release Work Order' : 'Next Step'}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        context={{
          wo: job?.wo || 'WO-UNKNOWN',
          part: job?.part || 'Part-UNKNOWN',
          station: 'CNC Station Alpha',
          op: currentStep.title
        }}
      />
    </div>
  );
};

export default CNCStation;