
import React, { useState, useEffect } from 'react';
import { 
  Box, ShieldCheck, Activity, ChevronRight,
  CheckCircle2, Zap, AlertTriangle, Layers,
  Thermometer, FlaskConical, Target, Image as ImageIcon,
  Info
} from 'lucide-react';
import { logAction } from '../services/auditService';
import HelpModal from './HelpModal';

interface AdditiveStep {
  title: string;
  icon: any;
  desc: string;
  imageUrl: string;
  checks: string[];
}

interface AdditiveStationProps {
  job?: any;
  onComplete: (details: any) => void;
  onFlagIssue: () => void;
}

const AdditiveStation: React.FC<AdditiveStationProps> = ({ job, onComplete, onFlagIssue }) => {
  const [phase, setPhase] = useState<'SETUP' | 'RUNNING' | 'FINISHED'>('SETUP');
  const [setupStep, setSetupStep] = useState(0);
  const [buildPercent, setBuildPercent] = useState(0);
  const [completedChecks, setCompletedChecks] = useState<Set<string>>(new Set());
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const setupSteps: AdditiveStep[] = [
    { 
      title: 'Material Load', 
      icon: Box, 
      desc: 'Verify Powder Lot: TI64-LBX-992 and load reservoir to 100%.',
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
      checks: ['Lot ID TI64-LBX-992 confirmed', 'Hopper cleaned of cross-contaminants', 'Fill level at MAX indicator']
    },
    { 
      title: 'Batch Verification', 
      icon: ShieldCheck, 
      desc: 'Scan build plate serial and verify build file cryptographic hash.',
      imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
      checks: ['Plate SN-9981-L verified', 'Build File LB-PROD-A92 synced', 'Optical window cleaned']
    },
    { 
      title: 'Atmosphere Prep', 
      icon: Thermometer, 
      desc: 'Initiate Argon purge and verify O2 levels < 100ppm.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      checks: ['Argon supply verified > 2000 PSI', 'Chamber seal integrity check passed', 'O2 Sensor calibration nominal']
    },
    { 
      title: 'Optical Alignment', 
      icon: Zap, 
      desc: 'Confirm laser centering and optical integrity through scan field test.',
      imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1794ed9?auto=format&fit=crop&q=80&w=800',
      checks: ['F-Theta lens debris audit complete', 'Laser focal depth verified', 'Scan path test nominal']
    }
  ];

  useEffect(() => {
    let interval: any;
    if (phase === 'RUNNING') {
      interval = setInterval(() => {
        setBuildPercent(prev => {
          if (prev >= 100) {
            setPhase('FINISHED');
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const currentStep = setupSteps[setupStep];
  const currentStepChecksDone = currentStep.checks.every(c => completedChecks.has(`${setupStep}-${c}`));

  const toggleCheck = (check: string) => {
    const key = `${setupStep}-${check}`;
    const next = new Set(completedChecks);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCompletedChecks(next);
  };

  const handleNext = async () => {
    if (setupStep === setupSteps.length - 1) {
      setPhase('RUNNING');
      await logAction('AM-OP-02', 'ADDITIVE_BUILD_STARTED', job?.wo || 'WO-9012', `SLS Build Initialized`);
    } else {
      setSetupStep(prev => prev + 1);
    }
  };

  const handleFinish = async () => {
    await logAction('AM-OP-02', 'ADDITIVE_BUILD_COMPLETE', job?.wo || 'WO-9012', `SLS Build Finalized`);
    onComplete({
      wo: job?.wo,
      part: job?.part,
      op: job?.op,
      station: 'Additive Center Alpha',
      nextOp: 'Stress Relief Heat Treat',
      nextStation: 'Autoclave Station'
    });
  };

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="h-16 flex justify-between items-center bg-slate-900/50 border-b border-slate-800 px-6 shrink-0">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Layers className="w-5 h-5" />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-widest">{job?.wo || 'WO-9012'}</span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">{job?.part || '9011-042'}</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">{job?.op || 'SLS Core Build'}</h2>
           </div>
        </div>
        <div className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
          phase === 'RUNNING' ? 'bg-primary/10 border-primary text-primary animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
          {phase} Status
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {phase === 'SETUP' ? (
          <>
            <div className="w-3/5 p-4 relative">
              <div className="h-full w-full rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                <img src={currentStep.imageUrl} className="w-full h-full object-cover opacity-90" alt={currentStep.title} />
              </div>
              <div className="absolute top-8 left-8 px-4 py-1.5 bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg border border-white/10">Setup Visualization</div>
            </div>
            <div className="w-2/5 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{currentStep.title}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-4 border-primary/40 pl-4">"{currentStep.desc}"</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Protocol Checklist</p>
                  {currentStep.checks.map(check => (
                    <button 
                      key={check}
                      onClick={() => toggleCheck(check)}
                      className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${
                        completedChecks.has(`${setupStep}-${check}`) 
                          ? 'bg-emerald-500/10 border-emerald-500/40' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        completedChecks.has(`${setupStep}-${check}`) ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-950 border-slate-700'
                      }`}>
                        {completedChecks.has(`${setupStep}-${check}`) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <span className={`text-[11px] font-bold uppercase italic tracking-tight leading-none ${completedChecks.has(`${setupStep}-${check}`) ? 'text-emerald-400' : 'text-slate-500'}`}>{check}</span>
                    </button>
                  ))}
               </div>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-center gap-20 p-10">
             <div className="relative w-80 h-80 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                   <circle className="text-slate-900" strokeWidth="12" stroke="currentColor" fill="transparent" r="140" cx="160" cy="160" />
                   <circle 
                      className="text-primary transition-all duration-500 ease-out" 
                      strokeWidth="12" 
                      strokeDasharray={2 * Math.PI * 140}
                      strokeDashoffset={2 * Math.PI * 140 * (1 - buildPercent / 100)}
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="140" cx="160" cy="160" 
                   />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <p className="text-7xl font-black text-white italic tracking-tighter leading-none">{buildPercent}%</p>
                   <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Build Active</p>
                </div>
             </div>
             <div className="grid grid-cols-1 gap-4 w-64">
                {[
                  { label: 'Chamber Temp', val: '45.2°C', icon: Thermometer },
                  { label: 'O2 Levels', val: '12 ppm', icon: FlaskConical },
                  { label: 'Laser Power', val: '245W', icon: Zap },
                ].map(stat => (
                  <div key={stat.label} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-xl">
                     <stat.icon className="w-6 h-6 text-primary" />
                     <div>
                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest italic leading-none">{stat.label}</p>
                        <p className="text-xl font-bold text-white uppercase italic mt-1">{stat.val}</p>
                     </div>
                  </div>
                ))}
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
        {phase === 'SETUP' ? (
          <button 
            onClick={handleNext}
            disabled={!currentStepChecksDone}
            className={`h-14 px-12 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-4 ${
              currentStepChecksDone ? 'bg-primary text-white shadow-primary/30' : 'bg-slate-800 text-slate-600 opacity-50'
            }`}
          >
            Confirm Step <ChevronRight className="w-4 h-4" />
          </button>
        ) : phase === 'FINISHED' ? (
          <button 
            onClick={handleFinish}
            className="h-14 px-12 bg-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl animate-pulse"
          >
            Release build
          </button>
        ) : (
          <div className="h-14 px-10 flex items-center justify-center bg-slate-800 text-slate-600 font-black uppercase tracking-widest italic text-[10px]">
            System Operational
          </div>
        )}
      </div>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        context={{
          wo: job?.wo || 'WO-UNKNOWN',
          part: job?.part || 'Part-UNKNOWN',
          station: 'Additive Center Alpha',
          op: phase === 'SETUP' ? currentStep.title : 'Build Execution'
        }}
      />
    </div>
  );
};

export default AdditiveStation;