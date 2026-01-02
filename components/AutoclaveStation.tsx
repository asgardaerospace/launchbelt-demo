
import React, { useState, useEffect } from 'react';
import { 
  Thermometer, Clock, Activity, ChevronRight,
  CheckCircle2, Zap, AlertTriangle, Lock,
  Power, TrendingUp, Info
} from 'lucide-react';
import { logAction } from '../services/auditService';
import HelpModal from './HelpModal';

interface ChecklistItem {
  key: string;
  title: string;
  desc: string;
  imageUrl: string;
  checks: string[];
}

interface AutoclaveStationProps {
  job?: any;
  onComplete: (details: any) => void;
  onFlagIssue: () => void;
}

const AutoclaveStation: React.FC<AutoclaveStationProps> = ({ job, onComplete, onFlagIssue }) => {
  const [phase, setPhase] = useState<'CHECKLIST' | 'ARMED' | 'CYCLING' | 'COOLING' | 'FINISHED'>('CHECKLIST');
  const [activeCheckIdx, setActiveCheckIdx] = useState(0);
  const [completedCheckKeys, setCompletedCheckKeys] = useState<Set<string>>(new Set());
  const [cycleTime, setCycleTime] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const checklistItems: ChecklistItem[] = [
    { 
      key: 'seal', 
      title: 'Main Vessel Seal', 
      desc: 'Verify O-ring seating and door contact points.', 
      imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
      checks: ['Seal cleaned of debris', 'O-ring lubed (per spec)', 'Safety latch confirmed']
    },
    { 
      key: 'vacuum', 
      title: 'Vacuum Line Routing', 
      desc: 'Verify bag integrity and line connection to manifold.', 
      imageUrl: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800',
      checks: ['Hose routing clear of pinch points', 'Vacuum drop test < 0.5 inHg', 'Plugs sealed']
    },
    { 
      key: 'tc', 
      title: 'TC Placement Matrix', 
      desc: 'Confirm 8-point thermocouple distribution on part surface.', 
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      checks: ['All 8 TCs secured with high-temp tape', 'TC identifiers match PLC layout', 'Zero wire interference']
    },
    { 
      key: 'manifest', 
      title: 'Build Manifest Lock', 
      desc: 'Scan part SN-8802-C-105 and lock configuration.', 
      imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
      checks: ['SN Tag verified', 'Cure recipe A-992 selected', 'Pre-cure photo captured']
    }
  ];

  useEffect(() => {
    let interval: any;
    if (phase === 'CYCLING') {
      interval = setInterval(() => {
        setCycleTime(prev => {
          if (prev >= 100) {
            setPhase('COOLING');
            return 100;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const currentItem = checklistItems[activeCheckIdx];
  const allChecksDone = checklistItems.every(item => completedCheckKeys.has(item.key));
  const currentStepChecksDone = currentItem.checks.every(c => completedCheckKeys.has(`${currentItem.key}-${c}`));

  const toggleSubCheck = (check: string) => {
    const key = `${currentItem.key}-${check}`;
    const next = new Set(completedCheckKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCompletedCheckKeys(next);
  };

  const handleNextCheck = () => {
    const next = new Set(completedCheckKeys);
    next.add(currentItem.key);
    setCompletedCheckKeys(next);
    if (activeCheckIdx < checklistItems.length - 1) setActiveCheckIdx(activeCheckIdx + 1);
    else setPhase('ARMED');
  };

  const startCycle = async () => {
    setPhase('CYCLING');
    await logAction('AUTO-OP-01', 'AUTOCLAVE_CYCLE_STARTED', job?.wo || 'WO-8804', 'L5 Shield Plate Cure Cycle');
  };

  const handleFinish = async () => {
    await logAction('AUTO-OP-01', 'AUTOCLAVE_CYCLE_COMPLETE', job?.wo || 'WO-8804', 'Cure artifact generated');
    onComplete({
      wo: job?.wo,
      part: job?.part,
      op: job?.op,
      station: 'Thermal Node 04',
      nextOp: 'Final Trim & NDI',
      nextStation: 'Certification Station'
    });
  };

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="h-16 flex justify-between items-center bg-slate-900/50 border-b border-slate-800 px-6 shrink-0">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Thermometer className="w-5 h-5" />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-widest">{job?.wo || 'WO-8804'}</span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">{job?.part || '8802-C-105'}</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">{job?.op || 'Composite Cure Protocol'}</h2>
           </div>
        </div>
        <div className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
          phase === 'CYCLING' ? 'bg-amber-600/10 border-amber-500 text-amber-500 animate-pulse' : 
          phase === 'COOLING' ? 'bg-blue-600/10 border-blue-500 text-blue-500' :
          'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
          {phase} Status
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {phase === 'CHECKLIST' || phase === 'ARMED' ? (
          <>
            <div className="w-3/5 p-4 relative">
              <div className="h-full w-full rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                <img src={currentItem.imageUrl} className="w-full h-full object-cover opacity-90" alt={currentItem.title} />
              </div>
              <div className="absolute top-8 left-8 px-4 py-1.5 bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg border border-white/10">Phase {activeCheckIdx + 1} Guide</div>
            </div>
            <div className="w-2/5 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{currentItem.title}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-4 border-primary/40 pl-4">"{currentItem.desc}"</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Safety Gate Checks</p>
                  {currentItem.checks.map(check => (
                    <button 
                      key={check}
                      onClick={() => toggleSubCheck(check)}
                      className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${
                        completedCheckKeys.has(`${currentItem.key}-${check}`) 
                          ? 'bg-emerald-500/10 border-emerald-500/40' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        completedCheckKeys.has(`${currentItem.key}-${check}`) ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-950 border-slate-700'
                      }`}>
                        {completedCheckKeys.has(`${currentItem.key}-${check}`) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <span className={`text-[11px] font-bold uppercase italic tracking-tight leading-none ${completedCheckKeys.has(`${currentItem.key}-${check}`) ? 'text-emerald-400' : 'text-slate-500'}`}>{check}</span>
                    </button>
                  ))}
               </div>
            </div>
          </>
        ) : phase === 'FINISHED' ? (
          <div className="w-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-2xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
             </div>
             <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Cycle Complete</h3>
             <p className="text-lg text-slate-500 uppercase tracking-widest font-black">Cure Artifact Attached to Job SN-8802-C-105</p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 gap-8 items-center p-8">
             <div className="space-y-10">
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
                      <span>Temperature Ramp</span>
                      <span className="text-amber-500">350°F Target</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <p className="text-6xl font-black text-white italic tracking-tighter">342°F</p>
                      <TrendingUp className="w-8 h-8 text-emerald-400" />
                   </div>
                </div>
                <div className="space-y-2 pt-10 border-t border-slate-800">
                   <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
                      <span>Vessel Pressure</span>
                      <span className="text-blue-500">90 PSI Target</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <p className="text-6xl font-black text-white italic tracking-tighter">89 PSI</p>
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                   </div>
                </div>
             </div>
             <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 italic leading-none">Session Progress</p>
                <p className="text-9xl font-black text-white italic tracking-tighter leading-none mb-4">{cycleTime}%</p>
                <p className="text-lg font-bold text-slate-400 uppercase italic">02:14:45 REMAINING</p>
             </div>
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="h-24 bg-slate-900/50 border-t border-slate-800 px-6 flex justify-between items-center shrink-0">
        <div className="flex gap-3">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="h-14 px-6 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-700 transition-all flex items-center gap-2"
          >
            <Info className="w-4 h-4" /> Help
          </button>
          <button 
            onClick={onFlagIssue}
            className="h-14 px-6 bg-red-600/10 text-red-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-red-500/20 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Flag Issue
          </button>
        </div>
        
        {phase === 'CHECKLIST' ? (
          <button 
            onClick={handleNextCheck}
            disabled={!currentStepChecksDone}
            className={`h-14 px-10 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-4 ${
              currentStepChecksDone ? 'bg-primary text-white shadow-primary/30' : 'bg-slate-800 text-slate-600 opacity-50'
            }`}
          >
            Confirm Step <ChevronRight className="w-4 h-4" />
          </button>
        ) : phase === 'ARMED' ? (
          <button 
            onClick={startCycle}
            className="h-14 px-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-lg uppercase tracking-[0.3em] shadow-2xl animate-pulse"
          >
            Run Cycle
          </button>
        ) : phase === 'COOLING' || cycleTime >= 100 ? (
          <button 
            onClick={() => setPhase('FINISHED')}
            className="h-14 px-12 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl"
          >
            Acknowledge Completion
          </button>
        ) : phase === 'FINISHED' ? (
          <button 
            onClick={handleFinish}
            className="h-14 px-12 bg-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl"
          >
            Start Next Sequence
          </button>
        ) : (
          <div className="h-14 px-10 flex items-center gap-2 bg-slate-800 text-slate-600 rounded-xl border border-slate-700 font-black uppercase text-[10px]">
            <Lock className="w-3 h-3 text-red-500" /> Cycle Gated
          </div>
        )}
      </div>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        context={{
          wo: job?.wo || 'WO-UNKNOWN',
          part: job?.part || 'Part-UNKNOWN',
          station: 'Thermal Node 04',
          op: phase === 'CHECKLIST' ? currentItem.title : 'Active Cure Cycle'
        }}
      />
    </div>
  );
};

export default AutoclaveStation;