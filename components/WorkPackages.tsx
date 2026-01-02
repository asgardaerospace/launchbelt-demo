
import React, { useMemo } from 'react';
import { 
  FileBox, 
  ExternalLink, 
  Plus, 
  CheckCircle, 
  Clock,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import { WorkPackage, WorkPackageStatus } from '../types';

const MOCK_PACKAGES: WorkPackage[] = [
  {
    id: 'WP-7721',
    title: 'Thrust Vector Actuator Assembly',
    program: 'Falcon-Heavy-V2',
    owner: 'Sarah Connor',
    status: WorkPackageStatus.RELEASED,
    description: 'Precision machined actuator components with AS9100 Rev D certification requirements.',
    createdAt: '2023-10-12',
    tdp: {
      id: 'TDP-001',
      version: '1.2',
      files: [{ name: 'Actuator_v1.2.step', size: '42MB', type: 'STEP' }, { name: 'Specs_Final.pdf', size: '2MB', type: 'PDF' }],
      lastModified: '2023-11-01',
      baselineLocked: true
    },
    parts: [{ id: 'P1', partNumber: '7721-001', revision: 'B', name: 'Main Plate', quantityRequired: 4 }],
    criticality: 'MISSION_CRITICAL',
    destinationHub: 'Asgard Forge - Central'
  },
  {
    id: 'WP-8802',
    title: 'External Shielding Plate (Composite)',
    program: 'Starship-Cargo',
    owner: 'James Holden',
    status: WorkPackageStatus.READY_FOR_RFQ,
    description: 'Ablative carbon-carbon shielding panels. Critical ITAR controlled data.',
    createdAt: '2023-11-05',
    tdp: { id: 'TDP-002', version: '0.9', files: [{ name: 'HeatShield_Draft.pdf', size: '15MB', type: 'PDF' }], lastModified: '2023-11-05' },
    parts: [],
    criticality: 'HIGH',
    destinationHub: 'Asgard Forge - Rocky Mountain'
  },
  {
    id: 'WP-9011',
    title: 'Avionics Cooling Manifold',
    program: 'NightOwl-V4',
    owner: 'R. Rivera',
    status: WorkPackageStatus.RELEASED,
    description: 'Additive metal printed cooling channels with 5-axis post-processing.',
    createdAt: '2023-11-08',
    tdp: { id: 'TDP-003', version: '2.1', files: [], lastModified: '2023-11-10' },
    parts: [],
    criticality: 'HIGH',
    destinationHub: 'Asgard Forge - Central'
  },
  {
    id: 'WP-2047',
    title: 'UAS Payload Mount Bracket',
    program: 'NightOwl-V3',
    owner: 'Sarah Connor',
    status: WorkPackageStatus.RELEASED,
    description: 'Structural component for sensor payload integration. Precision milling.',
    createdAt: '2023-11-10',
    tdp: { id: 'TDP-2047', version: 'C', files: [], lastModified: '' },
    parts: [],
    criticality: 'MEDIUM'
  },
  {
    id: 'WP-1122',
    title: 'Landing Gear Strut Support',
    program: 'Falcon-Heavy-V2',
    owner: 'Sarah Connor',
    status: WorkPackageStatus.RELEASED,
    description: 'Heavy fabrication for primary landing structures.',
    createdAt: '2023-10-20',
    tdp: { id: 'TDP-1122', version: '1.0', files: [], lastModified: '' },
    parts: [],
    criticality: 'MISSION_CRITICAL'
  },
  {
    id: 'WP-5566',
    title: 'Fuel Tank Reinforcement Grid',
    program: 'Starship-Cargo',
    owner: 'James Holden',
    status: WorkPackageStatus.RELEASED,
    description: 'Grid structures for pressure vessel stability.',
    createdAt: '2023-11-12',
    tdp: { id: 'TDP-5566', version: 'A', files: [], lastModified: '' },
    parts: [],
    criticality: 'MEDIUM'
  },
  {
    id: 'WP-4433',
    title: 'Solar Panel Deploy Linkage',
    program: 'Voyager-Explorer',
    owner: 'Alex Chen',
    status: WorkPackageStatus.DRAFT,
    description: 'Lightweight titanium linkages for solar array deployment.',
    createdAt: '2023-11-15',
    tdp: { id: 'TDP-4433', version: 'Draft', files: [], lastModified: '' },
    parts: [],
    criticality: 'MEDIUM'
  },
  {
    id: 'WP-3321',
    title: 'Camera Housing (Optics)',
    program: 'NightOwl-V4',
    owner: 'R. Rivera',
    status: WorkPackageStatus.SCOPED,
    description: 'High-precision housing for thermal imaging core.',
    createdAt: '2023-11-14',
    tdp: { id: 'TDP-3321', version: '0.1', files: [], lastModified: '' },
    parts: [],
    criticality: 'HIGH'
  }
];

interface WorkPackagesProps {
  onSelectPackage?: (pkg: WorkPackage) => void;
  onCreateNew?: () => void;
  initialFilter?: string;
}

const WorkPackages: React.FC<WorkPackagesProps> = ({ onSelectPackage, onCreateNew, initialFilter }) => {
  const filteredPackages = useMemo(() => {
    if (initialFilter === 'IN_EXECUTION') {
      return MOCK_PACKAGES.filter(p => p.status === WorkPackageStatus.RELEASED);
    }
    if (initialFilter === 'AT_RISK') {
      return MOCK_PACKAGES.filter(p => p.criticality === 'MISSION_CRITICAL');
    }
    return MOCK_PACKAGES;
  }, [initialFilter]);

  const getStatusColor = (status: WorkPackageStatus) => {
    switch (status) {
      case WorkPackageStatus.RELEASED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case WorkPackageStatus.READY_FOR_RFQ: return 'bg-primary/10 text-primary border-primary/20';
      case WorkPackageStatus.COMPLIANCE_CLEARED: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case WorkPackageStatus.SCOPED: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Technical Work Packages</h2>
          <p className="text-slate-400 text-sm font-medium">
            {initialFilter === 'IN_EXECUTION' ? 'Filtering: In Execution Only' : 
             initialFilter === 'AT_RISK' ? 'Filtering: Critical / High Risk Only' :
             'Manufacturing baselines and procurement release gates.'}
          </p>
        </div>
        <div className="flex gap-3">
          {initialFilter && (
             <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                <Filter className="w-3.5 h-3.5" /> Clear Filters ({filteredPackages.length})
             </button>
          )}
          <button 
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            Create New Work Package
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-2">
        {filteredPackages.map((pkg) => (
          <div 
            key={pkg.id} 
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-primary/50 transition-all flex flex-col group cursor-pointer shadow-2xl"
            onClick={() => onSelectPackage?.(pkg)}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 tracking-tighter uppercase">{pkg.id}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{pkg.program}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                    {pkg.title}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest ${getStatusColor(pkg.status)}`}>
                  {pkg.status.replace(/_/g, ' ')}
                </div>
              </div>
              
              <p className="text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                {pkg.description}
              </p>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                <div className="space-y-1">
                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Criticality</span>
                   <span className={`text-[10px] font-bold uppercase ${pkg.criticality === 'MISSION_CRITICAL' ? 'text-red-400' : 'text-slate-300'}`}>{pkg.criticality || 'Standard'}</span>
                </div>
                <div className="space-y-1">
                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">TDP Baseline</span>
                   <span className="text-[10px] font-bold text-slate-300 uppercase">Rev {pkg.tdp.version}</span>
                </div>
                <div className="space-y-1">
                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Destination</span>
                   <span className="text-[10px] font-bold text-slate-300 uppercase truncate block">{pkg.destinationHub?.split(' - ')[1] || 'TBD'}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-5 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-2">
                    {[1,2].map(i => (
                      <img key={i} className="w-6 h-6 rounded-full border-2 border-slate-900" src={`https://picsum.photos/seed/${pkg.id + i}/24/24`} alt="Owner" />
                    ))}
                 </div>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Updated 2d ago</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}

        <div 
          onClick={onCreateNew}
          className="border-2 border-dashed border-slate-800 rounded-[40px] p-12 flex flex-col items-center justify-center gap-6 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
        >
          <div className="bg-slate-900 p-6 rounded-full border border-slate-800 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all">
            <Plus className="w-10 h-10 text-slate-600 group-hover:text-primary" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Generate New Work Package</p>
            <p className="text-[10px] text-slate-600 font-medium uppercase">Initiate Scoping Wizard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPackages;
