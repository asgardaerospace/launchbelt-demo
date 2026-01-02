
import React from 'react';
import { Settings, Shield, Server, Users, Key, Database, ChevronRight, Activity } from 'lucide-react';

const SystemOps: React.FC = () => {
  const securitySections = [
    { title: 'Identity & Access', desc: 'RBAC claims, federated SSO, and token policies.', icon: Users },
    { title: 'Data Sovereignty', desc: 'Manage regional data pinning and multi-tenant isolation.', icon: Database },
    { title: 'Security Policies', desc: 'ITAR controls, classification levels, and encryption keys.', icon: Shield },
    { title: 'Infrastructure Health', desc: 'API latency, storage quotas, and network status.', icon: Server },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white">System Operations</h2>
        <p className="text-slate-400 text-sm font-medium">Platform orchestration, tenant security, and infrastructure monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securitySections.map(section => (
          <div key={section.title} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group hover:border-slate-700 transition-all cursor-pointer shadow-xl">
             <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-600/10 p-4 rounded-2xl group-hover:bg-blue-600/20 transition-all">
                   <section.icon className="w-8 h-8 text-blue-400" />
                </div>
                <Activity className="w-5 h-5 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">{section.desc}</p>
             <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                Manage Section
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
         <h3 className="text-lg font-bold text-white mb-6">Network Health Telemetry</h3>
         <div className="h-32 bg-slate-800/30 rounded-2xl border border-slate-800 border-dashed flex items-center justify-center">
            <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">Real-time Stream: OFFLINE IN SIMULATION</p>
         </div>
      </div>
    </div>
  );
};

export default SystemOps;
