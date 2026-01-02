
import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, CheckCircle, TrendingUp, AlertTriangle, 
  Users, DollarSign, Clock, ShieldCheck, ChevronDown, ListFilter
} from 'lucide-react';
import { RFQ, RFQResponse, Role } from '../types';

interface RFQDetailProps {
  rfq: RFQ;
  userRole: Role;
  onBack: () => void;
}

const MOCK_RESPONSES: RFQResponse[] = [
  {
    id: 'QR-001',
    supplierId: 'SUP-101',
    supplierName: 'Apex Machining - Austin',
    quoteAmount: 42500,
    leadTimeWeeks: 6,
    technicalScore: 92,
    status: 'PENDING',
    lineItems: [
      { partNumber: '7721-001', unitPrice: 8500, quantity: 4 },
      { partNumber: '7721-002', unitPrice: 531.25, quantity: 16 }
    ],
    nreCost: 2500,
    capacityCommitment: '85% available Q4',
    deviations: ['Request material switch to 6061-T6']
  },
  {
    id: 'QR-002',
    supplierId: 'SUP-202',
    supplierName: 'Titanium Alloys Ltd.',
    quoteAmount: 48900,
    leadTimeWeeks: 4,
    technicalScore: 88,
    status: 'PENDING',
    lineItems: [
      { partNumber: '7721-001', unitPrice: 9500, quantity: 4 },
      { partNumber: '7721-002', unitPrice: 681.25, quantity: 16 }
    ],
    nreCost: 0,
    capacityCommitment: 'Full capacity committed',
    deviations: []
  }
];

const RFQDetail: React.FC<RFQDetailProps> = ({ rfq, userRole, onBack }) => {
  const [activeTab, setActiveTab] = useState('Comparison');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-semibold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to RFQs
        </button>

        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="mono text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase font-bold tracking-widest">{rfq.id}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">RFQ / RFP</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{rfq.title}</h1>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2 text-emerald-400"><Users className="w-4 h-4" /> {MOCK_RESPONSES.length} Responses</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Due {rfq.dueDate}</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">{rfq.status}</span>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold border border-slate-700 transition-all">Close RFQ</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Side-by-Side Comparison */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> Multi-Source Quote Analysis</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg border border-slate-700"><ListFilter className="w-3 h-3" /> Filter</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-800/10 border-b border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Supplier Detail</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Bid</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Lead Time</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tech Score</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Selection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {MOCK_RESPONSES.map(res => (
                      <tr key={res.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400">
                              {res.supplierName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{res.supplierName}</p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{res.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="text-sm font-bold text-white flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-400" />{res.quoteAmount.toLocaleString()}</div>
                           <p className="text-[10px] text-slate-500 mt-1">NRE: ${res.nreCost}</p>
                        </td>
                        <td className="px-6 py-6">
                           <div className="text-sm font-bold text-white">{res.leadTimeWeeks} Weeks</div>
                           <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${(8/res.leadTimeWeeks)*100}%` }} />
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${res.technicalScore > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{res.technicalScore}%</span>
                              <ShieldCheck className={`w-4 h-4 ${res.technicalScore > 90 ? 'text-emerald-400' : 'text-slate-700'}`} />
                           </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/10">Award Contract</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                 <h4 className="font-bold text-white mb-6 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Exceptions & Deviations</h4>
                 <div className="space-y-4">
                    {MOCK_RESPONSES.map(res => (
                       <div key={res.id} className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{res.supplierName}</p>
                          {res.deviations.length > 0 ? (
                            res.deviations.map(dev => (
                              <div key={dev} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-xs text-slate-400 font-medium">
                                 {dev}
                              </div>
                            ))
                          ) : <p className="text-xs text-slate-600 italic">No deviations reported.</p>}
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                 <h4 className="font-bold text-white mb-6 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Award Justification</h4>
                 <textarea 
                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
                  placeholder="Summarize engineering and supply chain justification for the selected source..."
                 />
                 <button className="mt-4 w-full py-3 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-xl text-sm transition-all">Sign & Commit Selection</button>
              </div>
           </div>
        </div>

        {/* Right Column: RFQ Specs Summary */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl sticky top-8">
              <h4 className="text-sm font-bold text-slate-300 mb-6 pb-2 border-b border-slate-800">RFQ Parameters</h4>
              <div className="space-y-6">
                 <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Target Package</span>
                    <p className="text-sm font-bold text-white">{rfq.workPackageId}</p>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">ITAR Restrictions</span>
                    <div className="mt-1 flex items-center gap-2 text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-1 rounded">
                       <ShieldCheck className="w-3.5 h-3.5" /> RESTRICTED ACCESS
                    </div>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Network Capacity Required</span>
                    <p className="text-sm font-bold text-slate-200">High (Q4 Delivery Critical)</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RFQDetail;
