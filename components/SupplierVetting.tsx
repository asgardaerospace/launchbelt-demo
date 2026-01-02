
import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Search, CheckCircle2, XCircle, AlertCircle, FileCheck } from 'lucide-react';
import { Supplier, Role } from '../types';
import { logAction } from '../services/auditService';
import { getCurrentUser } from '../services/authService';

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP-101', name: 'Precision Machining Co.', vettedStatus: 'APPROVED', certifications: ['AS9100', 'ISO9001'], performanceScore: 98, contactEmail: 'ops@precision.com', onboardingDate: '2023-01-15' },
  { id: 'SUP-202', name: 'Titanium Alloys Ltd.', vettedStatus: 'PENDING', certifications: ['ISO9001'], performanceScore: 0, contactEmail: 'sales@titanium.co.uk', onboardingDate: '2023-11-01' },
  { id: 'SUP-303', name: 'Composite Tech Inc.', vettedStatus: 'SUSPENDED', certifications: ['AS9100'], performanceScore: 72, contactEmail: 'quality@comptech.io', onboardingDate: '2022-06-20' },
];

const SupplierVetting: React.FC<{ role: Role }> = ({ role }) => {
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const user = getCurrentUser(role);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT' | 'SUSPEND') => {
    const statusMap: Record<string, Supplier['vettedStatus']> = {
      APPROVE: 'APPROVED',
      REJECT: 'REJECTED',
      SUSPEND: 'SUSPENDED'
    };

    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, vettedStatus: statusMap[action] } : s));
    await logAction(user.email, `SUPPLIER_VET_${action}`, id, `Status updated to ${statusMap[action]}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Network Vetting</h2>
          <p className="text-slate-400 text-sm">Secure onboarding and certification management for the supplier ecosystem.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-6">
              <div className={`p-3 rounded-xl ${
                s.vettedStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 
                s.vettedStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{s.name}</h3>
                  <span className="mono text-[10px] text-slate-500 font-bold">{s.id}</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-slate-500 font-medium">{s.contactEmail}</span>
                  <div className="flex gap-1">
                    {s.certifications.map(c => (
                      <span key={c} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Status</span>
                <span className={`text-xs font-bold ${
                  s.vettedStatus === 'APPROVED' ? 'text-emerald-400' : 
                  s.vettedStatus === 'PENDING' ? 'text-amber-400' : 'text-red-400'
                }`}>{s.vettedStatus}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {s.vettedStatus === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => handleAction(s.id, 'APPROVE')}
                      className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/20 transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleAction(s.id, 'REJECT')}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                {s.vettedStatus === 'APPROVED' && (
                   <button 
                   onClick={() => handleAction(s.id, 'SUSPEND')}
                   className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition-all"
                 >
                   <AlertCircle className="w-5 h-5" />
                 </button>
                )}
                <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700">
                  <FileCheck className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierVetting;
