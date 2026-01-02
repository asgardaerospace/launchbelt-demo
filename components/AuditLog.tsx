
import React, { useEffect, useState, useMemo } from 'react';
import { 
  History, Shield, Download, Filter, Search, Clock, 
  ArrowLeft, FileText, Lock, ShieldCheck, ShieldAlert,
  Activity, ExternalLink, User, Globe, Server, Info,
  ChevronRight, ArrowRight, Database, Box
} from 'lucide-react';
import { getAuditLogs } from '../services/auditService';
import { AuditEntry, AuditEventCategory, AuditResult, Role } from '../types';

type AuditView = 'GLOBAL' | 'DETAIL' | 'OBJECT' | 'SECURITY';

const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [activeView, setActiveView] = useState<AuditView>('GLOBAL');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [targetObjectId, setTargetObjectId] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AuditEventCategory | 'ALL'>('ALL');

  useEffect(() => {
    const fetchLogs = () => setLogs(getAuditLogs());
    fetchLogs();
    
    window.addEventListener('audit-log-updated', fetchLogs);
    return () => window.removeEventListener('audit-log-updated', fetchLogs);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.objectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [logs, searchQuery, categoryFilter]);

  const securityLogs = useMemo(() => {
    return logs.filter(log => log.category === 'SECURITY');
  }, [logs]);

  const objectHistoryLogs = useMemo(() => {
    if (!targetObjectId) return [];
    return logs.filter(log => log.objectId === targetObjectId);
  }, [logs, targetObjectId]);

  const navigateToDetail = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setActiveView('DETAIL');
  };

  const navigateToObjectHistory = (id: string) => {
    setTargetObjectId(id);
    setActiveView('OBJECT');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'GLOBAL':
        return <GlobalTimeline logs={filteredLogs} onRowClick={navigateToDetail} />;
      case 'DETAIL':
        return selectedEntry ? (
          <EventDetail 
            entry={selectedEntry} 
            onBack={() => setActiveView('GLOBAL')} 
            onViewHistory={navigateToObjectHistory}
          />
        ) : null;
      case 'OBJECT':
        return targetObjectId ? (
          <ObjectHistory 
            logs={objectHistoryLogs} 
            objectId={targetObjectId}
            onBack={() => setActiveView('GLOBAL')}
            onSelectEvent={navigateToDetail}
          />
        ) : null;
      case 'SECURITY':
        return <SecurityAudit logs={securityLogs} onRowClick={navigateToDetail} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 italic">
            <History className="w-8 h-8 text-blue-500" />
            Audit System of Record
          </h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Forensic Immutable Transaction Ledger</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-lg">
          {[
            { id: 'GLOBAL', label: 'Global Timeline' },
            { id: 'SECURITY', label: 'Access & Security' },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as AuditView)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${
                (activeView === view.id || (view.id === 'GLOBAL' && (activeView === 'DETAIL' || activeView === 'OBJECT'))) 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {(activeView === 'GLOBAL' || activeView === 'SECURITY') && (
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-3xl backdrop-blur-md mx-2">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by user, object ID, or action..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm w-full outline-none focus:ring-0 placeholder:text-slate-600 font-medium"
            />
          </div>
          <div className="flex gap-3">
             <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 rounded-xl px-4 py-2 outline-none uppercase tracking-widest"
             >
                <option value="ALL">All Categories</option>
                <option value="WORK_PACKAGE">Work Packages</option>
                <option value="RFQ">RFQs</option>
                <option value="BUILD">Builds</option>
                <option value="CERTIFICATION">Certs</option>
                <option value="NCR">NCRs</option>
                <option value="SECURITY">Security</option>
             </select>
             <button className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xl shadow-white/5">
                <Download className="w-4 h-4" />
                Export Ledger
             </button>
          </div>
        </div>
      )}

      <div className="mx-2">
        {renderContent()}
      </div>
    </div>
  );
};

// --- FRAME 1: GLOBAL TIMELINE ---
const GlobalTimeline: React.FC<{ logs: AuditEntry[], onRowClick: (e: AuditEntry) => void }> = ({ logs, onRowClick }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-800/30 border-b border-slate-800">
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timestamp (UTC)</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Type / Object</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Subject / User</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Compliance</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Result</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {logs.map((log) => (
          <tr key={log.id} onClick={() => onRowClick(log)} className="hover:bg-slate-800/30 transition-all cursor-pointer group">
            <td className="px-8 py-6 mono text-xs text-slate-500 font-medium">
              {new Date(log.timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
            </td>
            <td className="px-8 py-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter mb-0.5">{log.category}</span>
                  <span className="text-xs font-bold text-blue-400 mono">{log.objectId}</span>
               </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{log.action.replace(/_/g, ' ')}</span>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                   <img src={`https://picsum.photos/seed/${log.user}/32/32`} alt="" className="opacity-60" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-200">{log.user}</span>
                   <span className="text-[9px] font-bold text-slate-600 uppercase">{log.role}</span>
                </div>
              </div>
            </td>
            <td className="px-8 py-6">
               {log.complianceFlag && (
                 <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter ${
                   log.complianceFlag === 'ITAR' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                 }`}>
                   {log.complianceFlag}
                 </span>
               )}
            </td>
            <td className="px-8 py-6 text-right">
              <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${
                log.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                log.result === 'DENIED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {log.result}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- FRAME 2: EVENT DETAIL ---
const EventDetail: React.FC<{ entry: AuditEntry, onBack: () => void, onViewHistory: (id: string) => void }> = ({ entry, onBack, onViewHistory }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-sm transition-colors group">
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
      Back to Ledger
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
           <div className="flex justify-between items-start mb-12 border-b border-slate-800 pb-8 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-xl">
                       <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-1">Transaction Log Entry</p>
                       <h3 className="text-3xl font-bold text-white mono tracking-tighter">{entry.id}</h3>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {new Date(entry.timestamp).toUTCString()}</span>
                    <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> {entry.ipAddress || 'SYSTEM_NODE'}</span>
                 </div>
              </div>
              <div className="text-right">
                 <span className={`text-xs font-bold px-4 py-2 rounded-2xl border uppercase tracking-[0.2em] shadow-lg ${
                    entry.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                 }`}>
                    {entry.result}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-12 relative z-10">
              <div className="space-y-10">
                 <div>
                    <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                       <User className="w-3 h-3" /> Actor Information
                    </h4>
                    <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl group">
                       <p className="text-lg font-bold text-white">{entry.user}</p>
                       <p className="text-xs font-bold text-slate-500 uppercase mt-1 tracking-tighter">{entry.role}</p>
                       <p className="text-[9px] text-slate-700 font-bold uppercase mt-3 italic">ID: USER_AUTH_LB_9221</p>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                       {/* Fix: Box icon is now correctly imported and used */}
                       <Box className="w-3 h-3" /> Affected Object
                    </h4>
                    <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl group hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => onViewHistory(entry.objectId)}>
                       <div className="flex justify-between items-start">
                          <div>
                             <p className="text-lg font-bold text-white mono">{entry.objectId}</p>
                             <p className="text-xs font-bold text-slate-500 uppercase mt-1 tracking-tighter">{entry.objectType} RESOURCE</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
                       </div>
                       <p className="text-[10px] text-blue-500 font-bold uppercase mt-4 flex items-center gap-2 group-hover:underline italic">View Object Provenance <ArrowRight className="w-3 h-3" /></p>
                    </div>
                 </div>
              </div>
              <div className="space-y-10">
                 <div>
                    <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                       <Info className="w-3 h-3" /> Action Detail
                    </h4>
                    <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl">
                       <p className="text-sm font-bold text-slate-200 uppercase leading-relaxed">{entry.action.replace(/_/g, ' ')}</p>
                       <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">{entry.details || 'Operational record of system event.'}</p>
                       {entry.reason && (
                         <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                            <p className="text-[10px] font-bold text-red-400 uppercase mb-1 italic">Reason for Failure/Denial</p>
                            <p className="text-xs text-slate-400">{entry.reason}</p>
                         </div>
                       )}
                    </div>
                 </div>
                 {entry.changeSummary && (
                   <div>
                      <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                         <Activity className="w-3 h-3" /> Delta Snapshot
                      </h4>
                      <div className="space-y-3">
                         <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-2xl">
                            <span className="text-[9px] font-bold text-slate-600 uppercase block mb-1">State Pre-Transaction</span>
                            <p className="text-xs text-slate-400 font-medium italic">{entry.changeSummary.before}</p>
                         </div>
                         <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                            <span className="text-[9px] font-bold text-emerald-500 uppercase block mb-1">State Post-Transaction</span>
                            <p className="text-xs text-slate-200 font-bold italic">{entry.changeSummary.after}</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-8">
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8 block italic">Ledger Actions</h4>
            <div className="space-y-4">
               <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3">
                  <Download className="w-4 h-4" /> Export Sealed PDF
               </button>
               <button className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-[10px] uppercase tracking-widest border border-slate-700 transition-all">Verify Immutable Signature</button>
            </div>
            <div className="mt-10 pt-10 border-t border-slate-800 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                     <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-white uppercase tracking-tight">Status: Sealed</p>
                     <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter mt-0.5">Hash Verified via L5 Chain</p>
                  </div>
               </div>
               <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-800 pl-4">
                  This transaction is locked. Any alteration to the server-side audit table will invalidate the node certificate.
               </p>
            </div>
         </div>
      </div>
    </div>
  </div>
);

// --- FRAME 3: OBJECT HISTORY ---
const ObjectHistory: React.FC<{ logs: AuditEntry[], objectId: string, onBack: () => void, onSelectEvent: (e: AuditEntry) => void }> = ({ logs, objectId, onBack, onSelectEvent }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-3xl opacity-20 pointer-events-none" />
       <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Global Ledger
          </button>
          <div className="flex items-center gap-3 mb-3">
             <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 uppercase tracking-widest">OBJECT PROVENANCE</span>
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Immutable History</span>
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic">{objectId}</h2>
       </div>
       <div className="flex gap-4">
          <button className="px-8 py-4 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-2xl transition-all uppercase tracking-widest text-[10px] shadow-xl">Export Full History</button>
       </div>
    </div>

    <div className="space-y-12 pl-12 relative">
       <div className="absolute left-[23px] top-4 bottom-4 w-px bg-slate-800" />
       {logs.map((log, idx) => (
         <div key={log.id} className="relative flex gap-12 group cursor-pointer" onClick={() => onSelectEvent(log)}>
            <div className="absolute -left-12 top-0 mt-2">
               <div className={`w-3 h-3 rounded-full border-4 ring-8 ring-slate-950 transition-all ${
                 log.result === 'SUCCESS' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400'
               } group-hover:scale-125`} />
            </div>
            <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-[32px] group-hover:border-blue-500/30 transition-all shadow-xl">
               <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                  <div>
                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1 italic">{new Date(log.timestamp).toUTCString()}</p>
                     <h4 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{log.action.replace(/_/g, ' ')}</h4>
                  </div>
                  <div className="text-right">
                     <p className="text-xs font-bold text-slate-200">{log.user}</p>
                     <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{log.role}</p>
                  </div>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">{log.details || 'Standard operational event recorded for object state transition.'}</p>
               {log.changeSummary && (
                 <div className="mt-6 p-4 bg-slate-800/30 border border-slate-800 rounded-2xl flex items-center justify-between group/delta">
                    <div className="flex items-center gap-4">
                       <Activity className="w-4 h-4 text-blue-500" />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">State Transition Recorded</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-800 group-hover/delta:text-blue-500 transition-colors" />
                 </div>
               )}
            </div>
         </div>
       ))}
    </div>
  </div>
);

// --- FRAME 4: SECURITY & ACCESS AUDIT ---
const SecurityAudit: React.FC<{ logs: AuditEntry[], onRowClick: (e: AuditEntry) => void }> = ({ logs, onRowClick }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-500">
    <div className="p-8 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
       <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3 italic">
          <Lock className="w-5 h-5 text-red-500" /> Access Control Telemetry
       </h3>
       <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
             <div className="w-2 h-2 rounded-full bg-emerald-500" /> ALLOWED
             <div className="w-2 h-2 rounded-full bg-red-500 ml-4" /> DENIED
          </div>
       </div>
    </div>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-800/30 border-b border-slate-800">
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Event Time</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Identity / Role</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Target Resource</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Type</th>
          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Result / Reason</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {logs.map((log) => (
          <tr key={log.id} onClick={() => onRowClick(log)} className="hover:bg-red-500/5 transition-all cursor-pointer group">
            <td className="px-8 py-6 mono text-xs text-slate-500">
              {new Date(log.timestamp).toISOString().split('T')[1].replace('Z','')}
            </td>
            <td className="px-8 py-6">
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg border ${log.result === 'DENIED' ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                     <User className={`w-3.5 h-3.5 ${log.result === 'DENIED' ? 'text-red-400' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">{log.user}</p>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{log.role}</p>
                  </div>
               </div>
            </td>
            <td className="px-8 py-6">
               <div className="flex items-center gap-3">
                  <Database className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-xs font-bold text-blue-400 mono">{log.objectId}</span>
                  {log.complianceFlag && <span className="text-[8px] px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-black">{log.complianceFlag}</span>}
               </div>
            </td>
            <td className="px-8 py-6 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.accessType || 'VIEW'}</span>
            </td>
            <td className="px-8 py-6 text-right">
               <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${log.result === 'DENIED' ? 'text-red-400 italic' : 'text-emerald-500'}`}>
                    {log.result === 'DENIED' ? 'Access Denied' : 'Allowed'}
                  </span>
                  {log.reason && <span className="text-[9px] text-slate-600 font-medium mt-1 leading-tight">{log.reason}</span>}
               </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AuditLog;
