
import React, { useState } from 'react';
import { Scan, HelpCircle, Activity, Zap, Box, ShieldCheck, ChevronRight } from 'lucide-react';

interface KioskHomeProps {
  onScan: (context: any) => void;
}

const KioskHome: React.FC<KioskHomeProps> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Logic: Mock scan result determines the station and job context
      const mockResults = [
        { station: 'CNC Station', part: '7721-001', wo: 'WO-9921', op: 'Finish Milling' },
        { station: 'Additive Station', part: '9011-042', wo: 'WO-9012', op: 'SLS Build' },
        { station: 'Certification Station', part: '8802-105', wo: 'WO-8804', op: 'NDI Inspection' },
        { station: 'Autoclave Station', part: '8802-C-105', wo: 'WO-8804', op: 'Cure Cycle' }
      ];
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      onScan(result);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-transparent overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-700">
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
            Launchbelt <span className="text-primary">Execute</span>
          </h1>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-[0.3em] text-sm">
              <Box className="w-4 h-4" /> Node: Austin-Forge
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-sm">
              <Activity className="w-4 h-4" /> SHIFT 01 ACTIVE
            </div>
          </div>
        </div>

        <button 
          onClick={simulateScan}
          disabled={isScanning}
          className={`group relative flex flex-col items-center justify-center w-[500px] h-[500px] rounded-[100px] border-4 transition-all duration-500 shrink-0 ${
            isScanning 
              ? 'bg-primary/20 border-primary shadow-[0_0_100px_rgba(var(--primary-color-rgb),0.4)] animate-pulse' 
              : 'bg-slate-900/50 border-slate-800 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_60px_rgba(var(--primary-color-rgb),0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-10 transition-opacity blur-[80px]" />
          
          {isScanning ? (
            <div className="space-y-8 flex flex-col items-center">
              <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-2xl font-black text-primary uppercase tracking-[0.4em] italic">Initializing Context...</p>
            </div>
          ) : (
            <>
              <div className="bg-primary/10 p-12 rounded-[50px] mb-8 border border-primary/20 group-hover:scale-110 transition-transform">
                <Scan className="w-24 h-24 text-primary" />
              </div>
              <p className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Scan to Begin</p>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Ready for Traveler or Hardware ID</p>
            </>
          )}
        </button>

        <div className="flex gap-6">
          <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 border border-slate-800 rounded-[32px] text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-white hover:border-slate-700 transition-all">
            <HelpCircle className="w-5 h-5" /> Request Help
          </button>
          <button 
            onClick={simulateScan}
            className="flex items-center gap-3 px-10 py-5 bg-slate-900 border border-slate-800 rounded-[32px] text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-white hover:border-slate-700 transition-all"
          >
            <Zap className="w-5 h-5 text-amber-500" /> Enter Demo Mode
          </button>
        </div>

        <div className="pt-8 text-center pb-8">
           <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] italic leading-relaxed">
              Authorized Personnel Only • Secure Session: LB-KIO-A92
           </p>
        </div>
      </div>
    </div>
  );
};

export default KioskHome;