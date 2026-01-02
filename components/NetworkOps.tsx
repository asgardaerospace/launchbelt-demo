
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Network, Grid3X3, ShieldCheck, TrendingUp, Filter, 
  MapPin, Box, Zap, Clock, AlertTriangle, 
  ChevronRight, ArrowLeft, Server, Activity,
  Eye, EyeOff, Target, Hammer, AlertCircle,
  BarChart3, Info, Shield, Globe
} from 'lucide-react';
import { Facility, Role, WipFlow } from '../types';

// Geographic Utilities for US Projection (Continental US)
const LONG_MIN = -125.0;
const LONG_MAX = -66.0;
const LAT_MIN = 24.0;
const LAT_MAX = 50.0;

const geoToPercent = (lat: number, lng: number) => {
  const x = ((lng - LONG_MIN) / (LONG_MAX - LONG_MIN)) * 100;
  const y = 100 - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100;
  return { x, y };
};

// --- DATA SEEDING ---
const SEEDED_FACILITIES: Facility[] = [
  // ASGARD FORGE HUBS
  { id: 'FORGE-TX', name: 'Asgard Forge - Austin', type: 'ASGARD_FORGE', location: { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX' }, status: 'HEALTHY', wipCount: 88, otdScore: 99, fpyScore: 100, processFamilies: ['Integration', 'Test'], certifications: ['AS9100', 'ITAR'], securityPosture: 'ITAR', capacityUtilization: 45, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 0, hasQualityHolds: false, historicalOtdScore: 99 },
  { id: 'FORGE-CO', name: 'Asgard Forge - Boulder', type: 'ASGARD_FORGE', location: { lat: 40.0150, lng: -105.2705, city: 'Boulder', state: 'CO' }, status: 'HEALTHY', wipCount: 64, otdScore: 97, fpyScore: 99.8, processFamilies: ['Integration', 'NDI'], certifications: ['AS9100', 'ITAR'], securityPosture: 'ITAR', capacityUtilization: 35, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 0, hasQualityHolds: false, historicalOtdScore: 97 },
  { id: 'FORGE-GA', name: 'Asgard Forge - Athens', type: 'ASGARD_FORGE', location: { lat: 33.9519, lng: -83.3576, city: 'Athens', state: 'GA' }, status: 'HEALTHY', wipCount: 42, otdScore: 98, fpyScore: 99.5, processFamilies: ['Integration', 'Test'], certifications: ['AS9100', 'ITAR'], securityPosture: 'ITAR', capacityUtilization: 50, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 0, hasQualityHolds: false, historicalOtdScore: 98 },
  { id: 'FORGE-OH', name: 'Asgard Forge - Dayton', type: 'ASGARD_FORGE', location: { lat: 39.7589, lng: -84.1916, city: 'Dayton', state: 'OH' }, status: 'HEALTHY', wipCount: 55, otdScore: 99, fpyScore: 99.9, processFamilies: ['Integration', 'NDI'], certifications: ['AS9100', 'ITAR'], securityPosture: 'ITAR', capacityUtilization: 30, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 0, hasQualityHolds: false, historicalOtdScore: 99 },

  // SUPPLIER NODES
  { id: 'SUP-WA', name: 'Pacific North Precision', type: 'SUPPLIER', location: { lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA' }, status: 'HEALTHY', wipCount: 15, otdScore: 98, fpyScore: 99.1, processFamilies: ['CNC', 'NDI'], certifications: ['AS9100'], securityPosture: 'ITAR', capacityUtilization: 65, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 2, hasQualityHolds: false, historicalOtdScore: 98 },
  { id: 'SUP-CA', name: 'Silicon Valley Additive', type: 'SUPPLIER', location: { lat: 37.3382, lng: -121.8863, city: 'San Jose', state: 'CA' }, status: 'WARNING', wipCount: 34, otdScore: 82, fpyScore: 91.2, processFamilies: ['Additive', 'Coatings'], certifications: ['NADCAP'], securityPosture: 'CUI', capacityUtilization: 88, capacityOutlook: [], activeConstraints: ['Raw Material Logistics'], equipment: [], blockingNcrCount: 2, expiringCertCount: 1, latePartCount: 8, hasQualityHolds: true, historicalOtdScore: 82 },
  { id: 'SUP-AZ', name: 'Desert Heat Composites', type: 'SUPPLIER', location: { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' }, status: 'HEALTHY', wipCount: 12, otdScore: 96, fpyScore: 98.5, processFamilies: ['Autoclave', 'Composites'], certifications: ['AS9100'], securityPosture: 'ITAR', capacityUtilization: 42, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 0, hasQualityHolds: false, historicalOtdScore: 96 },
  { id: 'SUP-KS', name: 'Mid-Continent Aero', type: 'SUPPLIER', location: { lat: 37.6889, lng: -97.3361, city: 'Wichita', state: 'KS' }, status: 'HEALTHY', wipCount: 28, otdScore: 94, fpyScore: 96.5, processFamilies: ['CNC', 'Sheet Metal'], certifications: ['AS9100'], securityPosture: 'CUI', capacityUtilization: 72, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 1, hasQualityHolds: false, historicalOtdScore: 94 },
  { id: 'SUP-MN', name: 'North Star Sensors', type: 'SUPPLIER', location: { lat: 44.9778, lng: -93.2650, city: 'Minneapolis', state: 'MN' }, status: 'HEALTHY', wipCount: 10, otdScore: 99, fpyScore: 100, processFamilies: ['Electronics', 'Test'], certifications: ['ISO9001'], securityPosture: 'PUBLIC', capacityUtilization: 55, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 0, hasQualityHolds: false, historicalOtdScore: 99 },
  { id: 'SUP-AL', name: 'Redstone Propulsion', type: 'SUPPLIER', location: { lat: 34.7304, lng: -86.5861, city: 'Huntsville', state: 'AL' }, status: 'CRITICAL', wipCount: 22, otdScore: 71, fpyScore: 84.0, processFamilies: ['Propulsion', 'Integration'], certifications: ['AS9100', 'NADCAP'], securityPosture: 'ITAR', capacityUtilization: 95, capacityOutlook: [], activeConstraints: ['Personnel Shortage'], equipment: [], blockingNcrCount: 5, expiringCertCount: 3, latePartCount: 12, hasQualityHolds: true, historicalOtdScore: 71 },
  { id: 'SUP-FL', name: 'Cape Tech Logistics', type: 'SUPPLIER', location: { lat: 28.5383, lng: -81.3792, city: 'Orlando', state: 'FL' }, status: 'HEALTHY', wipCount: 18, otdScore: 95, fpyScore: 97.8, processFamilies: ['Coatings', 'Logistics'], certifications: ['AS9100'], securityPosture: 'ITAR', capacityUtilization: 60, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 0, hasQualityHolds: false, historicalOtdScore: 95 },
  { id: 'SUP-TX', name: 'Lonestar Heavy Fab', type: 'SUPPLIER', location: { lat: 32.7767, lng: -96.7970, city: 'Dallas', state: 'TX' }, status: 'HEALTHY', wipCount: 45, otdScore: 91, fpyScore: 94.2, processFamilies: ['CNC', 'Coatings'], certifications: ['AS9100'], securityPosture: 'CUI', capacityUtilization: 78, capacityOutlook: [], activeConstraints: [], equipment: [], blockingNcrCount: 0, expiringCertCount: 0, latePartCount: 3, hasQualityHolds: false, historicalOtdScore: 91 },
];

const SEEDED_FLOWS: WipFlow[] = [
  // INTO AUSTIN
  { id: 'F-TX-1', from: 'SUP-CA', to: 'FORGE-TX', quantity: 24, status: 'DELAYED', workPackageId: 'WP-8802' },
  { id: 'F-TX-2', from: 'SUP-AZ', to: 'FORGE-TX', quantity: 12, status: 'ON_SCHEDULE', workPackageId: 'WP-9011' },
  { id: 'F-TX-3', from: 'SUP-TX', to: 'FORGE-TX', quantity: 30, status: 'ON_SCHEDULE', workPackageId: 'WP-7721' },
  // INTO BOULDER
  { id: 'F-CO-1', from: 'SUP-WA', to: 'FORGE-CO', quantity: 15, status: 'ON_SCHEDULE', workPackageId: 'WP-2047' },
  { id: 'F-CO-2', from: 'SUP-KS', to: 'FORGE-CO', quantity: 22, status: 'AT_RISK', workPackageId: 'WP-1122' },
  { id: 'F-CO-3', from: 'SUP-MN', to: 'FORGE-CO', quantity: 8, status: 'ON_SCHEDULE', workPackageId: 'WP-3321' },
  // INTO ATHENS
  { id: 'F-GA-1', from: 'SUP-AL', to: 'FORGE-GA', quantity: 18, status: 'DELAYED', workPackageId: 'WP-5566' },
  { id: 'F-GA-2', from: 'SUP-FL', to: 'FORGE-GA', quantity: 25, status: 'ON_SCHEDULE', workPackageId: 'WP-4433' },
  { id: 'F-GA-3', from: 'SUP-TX', to: 'FORGE-GA', quantity: 12, status: 'AT_RISK', workPackageId: 'WP-2047' },
  // INTO DAYTON
  { id: 'F-OH-1', from: 'SUP-KS', to: 'FORGE-OH', quantity: 15, status: 'ON_SCHEDULE', workPackageId: 'WP-1122' },
  { id: 'F-OH-2', from: 'SUP-MN', to: 'FORGE-OH', quantity: 10, status: 'ON_SCHEDULE', workPackageId: 'WP-3321' },
  { id: 'F-OH-3', from: 'SUP-WA', to: 'FORGE-OH', quantity: 20, status: 'ON_SCHEDULE', workPackageId: 'WP-2047' },
];

const PROCESS_FAMILIES = ['CNC', 'Additive', 'Autoclave', 'Coatings', 'NDI', 'Integration'];

// --- COMPUTATION UTILS ---

const computeReadiness = (f: Facility): 'GREEN' | 'AMBER' | 'RED' => {
  if (f.capacityUtilization > 90 || f.blockingNcrCount > 0 || f.hasQualityHolds) return 'RED';
  if (f.capacityUtilization > 75 || f.expiringCertCount > 0) return 'AMBER';
  return 'GREEN';
};

const computeRisk = (f: Facility): 'LOW' | 'MED' | 'HIGH' => {
  const score = (f.latePartCount * 2) + (f.expiringCertCount * 5) + (f.blockingNcrCount * 10) + (100 - f.historicalOtdScore);
  if (score > 50) return 'HIGH';
  if (score > 20) return 'MED';
  return 'LOW';
};

// --- COMPONENTS ---

const NetworkOps: React.FC<{ role: Role }> = ({ role }) => {
  const [activeTab, setActiveTab] = useState('Network Map');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [showFlows, setShowFlows] = useState(true);
  const [showReadiness, setShowReadiness] = useState(true);
  const [showRisk, setShowRisk] = useState(false);
  const [filterProcess, setFilterProcess] = useState<string | null>(null);
  const [drilldownActive, setDrilldownActive] = useState(false);

  const selectedFacility = useMemo(() => 
    SEEDED_FACILITIES.find(f => f.id === selectedFacilityId) || null
  , [selectedFacilityId]);

  if (drilldownActive && selectedFacility) {
    return <ActiveBuildsList facility={selectedFacility} onBack={() => setDrilldownActive(false)} />;
  }

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 px-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 italic">
            <Network className="w-8 h-8 text-primary" />
            Network Control Tower
          </h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Geographic Manufacturing Orchestration</p>
        </div>
        
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-2xl">
          {[
            { id: 'Network Map', icon: Network, label: 'Tower Map' },
            { id: 'Capacity Grid', icon: Grid3X3, label: 'Capacity Grid' },
            { id: 'Facility Readiness', icon: ShieldCheck, label: 'Node Readiness' },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => { setActiveTab(view.id); setFilterProcess(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === view.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shrink-0 mx-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-r border-slate-800 pr-4 italic">
          <Filter className="w-4 h-4" /> Overlays
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowFlows(!showFlows)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
              showFlows ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {showFlows ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            SHOW FLOWS
          </button>
          <button 
            onClick={() => setShowReadiness(!showReadiness)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
              showReadiness ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {showReadiness ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            SHOW READINESS
          </button>
          <button 
            onClick={() => setShowRisk(!showRisk)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
              showRisk ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {showRisk ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            SHOW RISK
          </button>
        </div>

        {filterProcess && (
          <>
            <div className="h-8 w-px bg-slate-800 mx-2" />
            <button 
              onClick={() => setFilterProcess(null)}
              className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase flex items-center gap-2"
            >
              Filter: {filterProcess} <AlertCircle className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      <div className="flex-1 relative mx-2 mb-2 overflow-hidden bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl">
        {activeTab === 'Network Map' && (
          <NetworkMap 
            facilities={SEEDED_FACILITIES} 
            flows={SEEDED_FLOWS}
            showFlows={showFlows}
            showReadiness={showReadiness}
            showRisk={showRisk}
            filterProcess={filterProcess}
            onSelectFacility={setSelectedFacilityId}
            selectedFacilityId={selectedFacilityId}
          />
        )}
        {activeTab === 'Capacity Grid' && (
          <CapacityGrid 
            facilities={SEEDED_FACILITIES} 
            onCellClick={(fid, process) => {
              setFilterProcess(process);
              setSelectedFacilityId(fid);
              setActiveTab('Network Map');
            }} 
          />
        )}
        {activeTab === 'Facility Readiness' && <FacilityReadiness facilities={SEEDED_FACILITIES} />}
      </div>

      {selectedFacility && (
        <FacilitySidePanel 
          facility={selectedFacility} 
          onClose={() => setSelectedFacilityId(null)} 
          flows={SEEDED_FLOWS.filter(f => f.from === selectedFacility.id || f.to === selectedFacility.id)}
          onDrilldown={() => setDrilldownActive(true)}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const USMapBackground = () => (
  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-slate-400 fill-slate-800">
    <path d="M12,25 L15,22 L18,22 L22,18 L28,18 L32,15 L38,15 L45,18 L52,18 L58,15 L65,15 L72,18 L78,22 L82,28 L85,35 L88,45 L88,55 L85,65 L82,75 L75,82 L65,85 L55,88 L45,88 L35,85 L25,82 L18,75 L15,65 L12,55 L10,45 L10,35 Z" fill="none" strokeWidth="0.5" />
    <path d="M15,22 L85,22 M15,40 L85,40 M15,60 L85,60 M15,80 L85,80 M30,15 L30,85 M50,15 L50,85 M70,15 L70,85" strokeWidth="0.1" strokeDasharray="1,1" />
    {/* Simplified US Outline - Representational */}
    <path d="M15,22 Q50,10 85,22 L88,45 Q90,70 75,85 L45,90 Q20,88 12,55 Z" fill="rgba(15,23,42,0.5)" strokeWidth="0.5" />
  </svg>
);

const NetworkMap: React.FC<{
  facilities: Facility[], 
  flows: WipFlow[], 
  showFlows: boolean,
  showReadiness: boolean,
  showRisk: boolean,
  filterProcess: string | null,
  onSelectFacility: (id: string) => void,
  selectedFacilityId: string | null
}> = ({ facilities, flows, showFlows, showReadiness, showRisk, filterProcess, onSelectFacility, selectedFacilityId }) => {
  
  const filteredFacilities = useMemo(() => {
    if (!filterProcess) return facilities;
    return facilities.filter(f => f.processFamilies.includes(filterProcess));
  }, [facilities, filterProcess]);

  return (
    <div className="w-full h-full relative bg-slate-950/50 overflow-hidden">
      <USMapBackground />

      {/* SVG Overlay for Flows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker id="arrowhead-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orientation="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
          </marker>
          <marker id="arrowhead-amber" markerWidth="8" markerHeight="6" refX="8" refY="3" orientation="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
          <marker id="arrowhead-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orientation="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
          </marker>
        </defs>
        {showFlows && flows.map(flow => {
          const from = facilities.find(f => f.id === flow.from);
          const to = facilities.find(f => f.id === flow.to);
          if (!from || !to) return null;

          const p1 = geoToPercent(from.location.lat, from.location.lng);
          const p2 = geoToPercent(to.location.lat, to.location.lng);

          const color = flow.status === 'DELAYED' ? '#ef4444' : flow.status === 'AT_RISK' ? '#f59e0b' : '#10b981';
          const marker = flow.status === 'DELAYED' ? 'url(#arrowhead-red)' : flow.status === 'AT_RISK' ? 'url(#arrowhead-amber)' : 'url(#arrowhead-green)';
          const thickness = Math.max(1.5, flow.quantity / 6);

          return (
            <line 
              key={flow.id}
              x1={`${p1.x}%`} y1={`${p1.y}%`}
              x2={`${p2.x}%`} y2={`${p2.y}%`}
              stroke={color}
              strokeWidth={thickness}
              strokeOpacity="0.6"
              markerEnd={marker}
              strokeDasharray={flow.status === 'DELAYED' ? "4 4" : ""}
              className={flow.status === 'ON_SCHEDULE' ? "animate-pulse" : ""}
            />
          );
        })}
      </svg>

      {/* Facility Nodes */}
      <div className="absolute inset-0 z-20">
        {filteredFacilities.map(f => {
          const pos = geoToPercent(f.location.lat, f.location.lng);
          const readiness = computeReadiness(f);
          const risk = computeRisk(f);
          const isSelected = selectedFacilityId === f.id;
          const isForge = f.type === 'ASGARD_FORGE';

          const readinessColor = readiness === 'RED' ? 'border-red-500' : readiness === 'AMBER' ? 'border-amber-500' : 'border-emerald-500';
          const riskIconColor = risk === 'HIGH' ? 'text-red-500' : risk === 'MED' ? 'text-amber-500' : 'text-emerald-500';

          return (
            <div 
              key={f.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onSelectFacility(f.id)}
            >
              <div className={`relative flex items-center justify-center transition-all ${isSelected ? 'scale-150' : 'scale-100 hover:scale-125'}`}>
                {showReadiness && (
                  <div className={`absolute inset-[-6px] rounded-full border-2 border-dashed ${readinessColor} animate-[spin_15s_linear_infinite] opacity-80`} />
                )}
                <div className={`w-10 h-10 rotate-45 border-2 flex items-center justify-center transition-all shadow-2xl rounded-lg ${
                  isForge 
                    ? 'bg-blue-600 border-white ring-4 ring-blue-500/20' 
                    : 'bg-slate-900 border-slate-700 hover:border-primary hover:bg-primary/20'
                } ${isSelected ? 'bg-primary border-white ring-4 ring-primary/30' : ''}`}>
                  <div className="-rotate-45">
                     {isForge ? <Zap className="w-5 h-5 text-white" /> : <Server className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
                {showRisk && (
                  <div className={`absolute -top-6 -right-6 bg-slate-950 border border-slate-800 rounded-full w-10 h-10 flex items-center justify-center text-[7px] font-black ${riskIconColor} shadow-2xl z-30`}>
                    {risk}
                  </div>
                )}
              </div>
              <div className={`absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 border border-slate-800 p-2 rounded text-[9px] font-bold text-white whitespace-nowrap z-50 shadow-2xl ${isForge ? 'border-blue-500' : ''}`}>
                {f.name} • WIP {f.wipCount}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 z-30 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800 pb-3 italic">Control Tower Legend</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
            <div className="w-4 h-4 rotate-45 bg-blue-600 rounded border border-white" /> Asgard Forge Hub
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
            <div className="w-4 h-4 rotate-45 bg-slate-900 rounded border border-slate-700" /> Supplier Facility
          </div>
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-500">
               <div className="w-3 h-1 bg-emerald-500 rounded" /> On Schedule
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-amber-500">
               <div className="w-3 h-1 bg-amber-500 rounded" /> At Risk
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-red-500">
               <div className="w-3 h-1 bg-red-500 rounded" /> Delayed / Blocked
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CapacityGrid: React.FC<{ 
  facilities: Facility[], 
  onCellClick: (fid: string, process: string) => void 
}> = ({ facilities, onCellClick }) => (
  <div className="p-8 h-full overflow-auto custom-scrollbar bg-slate-900">
    <div className="flex items-center gap-3 mb-8">
      <Grid3X3 className="w-6 h-6 text-primary" />
      <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Process Family Capacity Matrix</h3>
    </div>
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="p-4 text-[10px] font-bold text-slate-500 uppercase text-left border border-slate-800">Facility Node</th>
          {PROCESS_FAMILIES.map(p => (
            <th key={p} className="p-4 text-[10px] font-bold text-slate-500 uppercase border border-slate-800 text-center">{p}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {facilities.map(f => (
          <tr key={f.id}>
            <td className="p-4 border border-slate-800 bg-slate-950/30">
               <p className="text-xs font-bold text-white uppercase">{f.name}</p>
               <p className="text-[9px] text-slate-600 font-bold uppercase">{f.id}</p>
            </td>
            {PROCESS_FAMILIES.map(p => {
              const hasProcess = f.processFamilies.includes(p);
              const util = hasProcess ? f.capacityUtilization : null;
              const bgColor = !hasProcess ? 'bg-slate-950/10' : util! > 90 ? 'bg-red-500/20 text-red-400' : util! > 75 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400';
              
              return (
                <td 
                  key={p} 
                  className={`p-4 border border-slate-800 text-center cursor-pointer hover:brightness-125 transition-all ${bgColor}`}
                  onClick={() => hasProcess && onCellClick(f.id, p)}
                >
                  {hasProcess ? `${util}%` : '--'}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FacilityReadiness: React.FC<{ facilities: Facility[] }> = ({ facilities }) => (
  <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto h-full custom-scrollbar">
    {facilities.map(f => {
      const readiness = computeReadiness(f);
      const color = readiness === 'RED' ? 'text-red-500' : readiness === 'AMBER' ? 'text-amber-500' : 'text-emerald-500';
      const bgColor = readiness === 'RED' ? 'bg-red-500/10' : readiness === 'AMBER' ? 'bg-amber-500/10' : 'bg-emerald-500/10';

      return (
        <div key={f.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] hover:border-primary transition-all group shadow-xl relative overflow-hidden">
          <div className={`absolute top-0 right-0 p-4 font-black text-[10px] ${color} uppercase tracking-[0.2em]`}>{readiness}</div>
          <h3 className="text-white font-bold uppercase mb-2 group-hover:text-primary transition-colors italic tracking-tight">{f.name}</h3>
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center text-[10px] font-bold">
               <span className="text-slate-500 uppercase">Utilization</span>
               <span className={color}>{f.capacityUtilization}%</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className={`h-full ${color.replace('text', 'bg')}`} style={{ width: `${f.capacityUtilization}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
               <div>
                  <p className="text-[9px] text-slate-600 font-bold uppercase">Blocking NCRs</p>
                  <p className={`text-sm font-bold ${f.blockingNcrCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>{f.blockingNcrCount}</p>
               </div>
               <div>
                  <p className="text-[9px] text-slate-600 font-bold uppercase">Expiring Certs</p>
                  <p className={`text-sm font-bold ${f.expiringCertCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{f.expiringCertCount}</p>
               </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const FacilitySidePanel: React.FC<{ 
  facility: Facility, 
  onClose: () => void, 
  flows: WipFlow[],
  onDrilldown: () => void
}> = ({ facility, onClose, flows, onDrilldown }) => {
  const readiness = computeReadiness(facility);
  const risk = computeRisk(facility);

  const readinessMeta = {
    RED: { text: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/30' },
    AMBER: { text: 'CONSTRAINED', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/30' },
    GREEN: { text: 'NOMINAL', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/30' }
  }[readiness];

  const riskMeta = {
    HIGH: { color: 'text-red-400' },
    MED: { color: 'text-amber-400' },
    LOW: { color: 'text-emerald-400' }
  }[risk];

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/10">
        <div className="flex items-center gap-5">
           <div className={`p-4 rounded-2xl ${readinessMeta.bg} ${readinessMeta.color} shadow-2xl border border-current/20`}>
              {facility.type === 'ASGARD_FORGE' ? <Zap className="w-7 h-7" /> : <Activity className="w-7 h-7" />}
           </div>
           <div>
              <h3 className="text-2xl font-bold text-white tracking-tight uppercase italic">{facility.name}</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-[0.3em]">{facility.location.city}, {facility.location.state} • {facility.id}</p>
           </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-600 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6 rotate-180" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
         <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-3xl border ${readinessMeta.bg} ${readinessMeta.border} text-center space-y-1 shadow-xl`}>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">READINESS</span>
               <p className={`text-xl font-black ${readinessMeta.color}`}>{readinessMeta.text}</p>
            </div>
            <div className={`p-6 rounded-3xl border bg-slate-950/40 border-slate-800 text-center space-y-1 shadow-xl`}>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">RISK LEVEL</span>
               <p className={`text-xl font-black ${riskMeta.color}`}>{risk}</p>
            </div>
         </div>

         <section className="space-y-6">
            <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic border-b border-slate-800 pb-3">Operational Snapshot</h4>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Active WIP</span>
                  <p className="text-2xl font-bold text-white">{facility.wipCount}</p>
               </div>
               <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Utilization</span>
                  <p className="text-2xl font-bold text-primary">{facility.capacityUtilization}%</p>
               </div>
               <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Late Parts</span>
                  <p className={`text-2xl font-bold ${facility.latePartCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>{facility.latePartCount}</p>
               </div>
               <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Quality Gate</span>
                  <p className={`text-sm font-bold mt-2 ${facility.hasQualityHolds ? 'text-red-400' : 'text-emerald-400'} uppercase`}>
                     {facility.hasQualityHolds ? 'HOLD ACTIVE' : 'CLEAR'}
                  </p>
               </div>
            </div>
         </section>

         <section className="space-y-6">
            <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic border-b border-slate-800 pb-3">Node Connectivity ({flows.length})</h4>
            <div className="space-y-3">
               {flows.length === 0 ? (
                 <p className="text-xs text-slate-600 font-bold uppercase italic">No active network telemetry</p>
               ) : (
                 flows.map(f => {
                   const isOutbound = f.from === facility.id;
                   const flowColor = f.status === 'DELAYED' ? 'text-red-400' : f.status === 'AT_RISK' ? 'text-amber-400' : 'text-emerald-400';
                   return (
                     <div key={f.id} className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700 flex justify-between items-center group hover:border-slate-500 transition-all shadow-lg">
                        <div className="flex items-center gap-4">
                           <div className={`p-2 rounded-lg bg-slate-900 border border-slate-700 ${isOutbound ? 'text-blue-400' : 'text-indigo-400'}`}>
                              {isOutbound ? <ArrowRightIcon className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white uppercase">{isOutbound ? `Destination: ${f.to}` : `Origin: ${f.from}`}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{f.workPackageId} • {f.quantity} Items</p>
                           </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border border-current/30 ${flowColor}`}>{f.status}</span>
                     </div>
                   );
                 })
               )}
            </div>
         </section>
      </div>

      <div className="p-8 border-t border-slate-800 bg-slate-800/20 flex flex-col gap-4">
         <button 
           onClick={onDrilldown}
           className="w-full py-6 bg-primary hover:bg-primary-dark text-white font-bold rounded-[24px] text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95"
         >
            <Hammer className="w-5 h-5" /> View Active Builds
         </button>
      </div>
    </div>
  );
};

const ActiveBuildsList: React.FC<{ facility: Facility, onBack: () => void }> = ({ facility, onBack }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 pb-20 px-2">
    <div className="flex items-center gap-6">
      <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-slate-700">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">{facility.name}</h2>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-widest">LIVE QUEUE</span>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Build Protocol: LB-FORGE-24-TX</p>
      </div>
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
      <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
         <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3 italic">
            <LayersIcon className="w-6 h-6 text-primary" /> Active Component Stream
         </h3>
         <div className="flex gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input className="bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-primary w-64" placeholder="Filter SN / Part..." />
            </div>
         </div>
      </div>
      <table className="w-full text-left border-collapse">
         <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
               <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Instance SN</th>
               <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Work Package</th>
               <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Process Node</th>
               <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Completion</th>
               <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Gate Status</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-800">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="hover:bg-slate-800/30 transition-all cursor-pointer group">
                 <td className="px-10 py-8">
                    <span className="mono font-bold text-white text-base tracking-tighter uppercase">SN-{facility.id}-{(1000 + i)}</span>
                 </td>
                 <td className="px-10 py-8">
                    <p className="text-sm font-bold text-primary uppercase">WP-7721-{(10+i)}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Payload Chassis Block</p>
                 </td>
                 <td className="px-10 py-8 text-center">
                    <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest">
                       {facility.processFamilies[0] || 'GENERAL'}
                    </span>
                 </td>
                 <td className="px-10 py-8">
                    <div className="flex items-center justify-center gap-4">
                       <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.5)]" style={{ width: `${30 + (i * 12)}%` }} />
                       </div>
                       <span className="text-[11px] font-black text-slate-400">{30 + (i * 12)}%</span>
                    </div>
                 </td>
                 <td className="px-10 py-8 text-right">
                    <span className="text-[10px] font-black text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl bg-emerald-500/5 uppercase tracking-widest">IN PRODUCTION</span>
                 </td>
              </tr>
            ))}
         </tbody>
      </table>
    </div>
  </div>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.83 6.18a2 2 0 0 0 0 3.64L11.17 13.82a2 2 0 0 0 1.66 0L21.17 9.82a2 2 0 0 0 0-3.64Z"/><path d="m2.83 14.18 8.34 4a2 2 0 0 0 1.66 0l8.34-4"/><path d="m2.83 10.18 8.34 4a2 2 0 0 0 1.66 0l8.34-4"/></svg>
);

export default NetworkOps;
