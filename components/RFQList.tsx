
import React from 'react';
import { RFQ, RFQStatus } from '../types';
import { Plus, Clock, CheckCircle, AlertTriangle, ChevronRight, Filter, Search } from 'lucide-react';

interface RFQListProps {
  onSelectRFQ: (rfq: RFQ) => void;
  onCreateNew?: () => void;
}

const MOCK_RFQS: RFQ[] = [
  {
    id: 'RFQ-8812',
    workPackageId: 'WP-7721',
    title: 'Precision Machining RFQ - Batch A',
    status: RFQStatus.ACTIVE,
    dueDate: '2023-12-15',
    priority: 'HIGH',
    responses: []
  },
  {
    id: 'RFQ-9921',
    workPackageId: 'WP-8802',
    title: 'Carbon Composite Shielding RFP',
    status: RFQStatus.AWARDED,
    dueDate: '2023-11-20',
    priority: 'CRITICAL',
    responses: []
  }
];

const RFQList: React.FC<RFQListProps> = ({ onSelectRFQ, onCreateNew }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">RFQs / RFPs</h2>
          <p className="text-slate-400 text-sm font-medium">Manage sourcing, quoting, and supplier selection workflows.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Create New RFQ
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">RFQ ID</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Program / Work Package</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Due Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Recipients</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_RFQS.map(rfq => (
              <tr 
                key={rfq.id}
                onClick={() => onSelectRFQ(rfq)}
                className="hover:bg-slate-800/30 transition-all cursor-pointer group"
              >
                <td className="px-6 py-6">
                  <span className="mono font-bold text-blue-400 text-sm">{rfq.id}</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{rfq.title}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">WP: {rfq.workPackageId}</p>
                </td>
                <td className="px-6 py-6">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
                    <Clock className="w-3 h-3" /> {rfq.dueDate}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter ${
                    rfq.status === RFQStatus.AWARDED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>{rfq.status}</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end -space-x-2">
                    {[1,2,3].map(i => (
                      <img key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 shadow-xl" src={`https://picsum.photos/seed/sup${i}/24/24`} alt="Supplier" />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RFQList;
