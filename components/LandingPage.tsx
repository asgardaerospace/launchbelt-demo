
import React from 'react';
import { ChevronRight, FileText, Mail, Shield, CheckCircle2, Database } from 'lucide-react';
import LaunchbeltLogo from './LaunchbeltLogo';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200 animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl w-full text-center space-y-12 relative z-10">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
            <LaunchbeltLogo className="w-32 h-32 relative z-10" glowColor="rgba(59, 130, 246, 0.4)" />
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              Launchbelt Platform Demo
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs italic">
              Integrated Aerospace Operations • Secure Execution
            </p>
          </div>
        </div>

        {/* Intro Paragraph */}
        <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[48px] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <p className="text-xl text-slate-300 font-medium leading-relaxed italic">
            Experience the future of aerospace manufacturing. This demo environment demonstrates the seamless connection between mission demand, advanced manufacturing orchestration, and real-time execution visibility across the Launchbelt network.
          </p>
        </div>

        {/* Trust/Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-3xl flex flex-col items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Account Required</p>
          </div>
          <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-3xl flex flex-col items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zero Permissions Required</p>
          </div>
          <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-3xl flex flex-col items-center gap-3">
            <Database className="w-6 h-6 text-blue-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Representative Data</p>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <button 
            onClick={onEnter}
            className="group px-16 py-7 bg-white text-slate-900 font-black rounded-[32px] text-xl uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            Enter Demo <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => window.open('https://asgardaerospace.com/launchbelt-demo-doc', '_blank')}
            className="group px-10 py-7 bg-slate-900 border border-slate-800 text-slate-300 font-black rounded-[32px] text-sm uppercase tracking-widest hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-3"
          >
            <FileText className="w-5 h-5 text-primary" /> View Documentation
          </button>
        </div>

        {/* Contact Footer */}
        <div className="pt-12 border-t border-slate-900 flex flex-col items-center gap-4">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Direct Inquiry Channel</p>
          <a 
            href="mailto:contact@asgardaerospace.com" 
            className="flex items-center gap-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800"
          >
            <Mail className="w-4 h-4" /> contact@asgardaerospace.com
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.5em] italic">
          ASGARD AEROSPACE • LAUNCHBELT OPERATIONS SYSTEM
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
