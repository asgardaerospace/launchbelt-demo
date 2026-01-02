
import React from 'react';
import { Shield, Zap, Box, Globe, ChevronRight } from 'lucide-react';
import { Module } from '../types';
import LaunchbeltLogo from './LaunchbeltLogo';

interface ModuleSelectorProps {
  onSelect: (module: Module) => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ onSelect }) => {
  const modules = [
    {
      id: Module.COMMAND,
      name: 'Launchbelt Command',
      subtitle: 'Program control, work packages, RFQs, and network orchestration',
      icon: Box,
      color: 'blue',
      themeClass: 'from-blue-600/20 to-slate-900 border-blue-500/30 text-blue-400'
    },
    {
      id: Module.FORGE,
      name: 'Launchbelt Forge',
      subtitle: 'Facility operations, WIP, certifications, integration, and release',
      icon: Zap,
      color: 'red',
      themeClass: 'from-red-600/20 to-slate-900 border-red-500/30 text-red-400'
    },
    {
      id: Module.EXECUTE,
      name: 'Launchbelt Execute',
      subtitle: 'Kiosk-level workstation execution for operators',
      icon: Shield,
      color: 'green',
      themeClass: 'from-emerald-600/20 to-slate-900 border-emerald-500/30 text-emerald-400'
    },
    {
      id: Module.ATLAS,
      name: 'Launchbelt Atlas',
      subtitle: 'DoD mission intake, procurement, and order visibility',
      icon: Globe,
      color: 'orange',
      themeClass: 'from-orange-600/20 to-slate-900 border-orange-500/30 text-orange-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
            <LaunchbeltLogo className="w-24 h-24 relative z-10 brightness-125" glowColor="rgba(59, 130, 246, 0.4)" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter uppercase italic">Choose Your Module</h1>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.open('https://docs.launchbelt.io/modules', '_blank'); }}
            className="inline-block text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider group"
          >
            New to Launchbelt? <span className="underline decoration-primary/30 group-hover:decoration-primary underline-offset-4">Review module documentation before entering a workflow →</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`group relative overflow-hidden bg-gradient-to-br ${m.themeClass} border p-10 rounded-[48px] text-left transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-100 shadow-xl`}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-5 rounded-3xl bg-slate-900 border border-current opacity-80`}>
                    <m.icon className="w-8 h-8" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-600 group-hover:translate-x-2 transition-transform" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white uppercase italic tracking-tight mb-2">{m.name}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
                    {m.subtitle}
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <m.icon className="w-48 h-48" />
              </div>
            </button>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest italic">
            Authorized Personnel Only • NIST 800-171 Compliance Enforced
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelector;
