
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShieldCheck, 
  Network, 
  History, 
  Settings,
  Bell,
  Search,
  LogOut,
  Box,
  RefreshCw,
  Hammer,
  Zap,
  Truck,
  ClipboardList,
  Scan,
  Cpu,
  Layers,
  Thermometer,
  Shield,
  Globe,
  CheckCircle2,
  ShoppingCart,
  Eye,
  Settings2,
  Wrench,
  Gauge,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Role, Module } from '../types';
import LaunchbeltLogo from './LaunchbeltLogo';

interface LayoutProps {
  children: React.ReactNode;
  userRole: Role;
  currentModule: Module;
  onChangeModule: () => void;
  setUserRole: (role: Role) => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, currentModule, onChangeModule, setUserRole, onNavigate, activeView }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  // Module-specific menu configurations
  const moduleMenus: Record<Module, any[]> = {
    [Module.COMMAND]: [
      { icon: LayoutDashboard, label: 'Dashboard' },
      { icon: BarChart3, label: 'Cost & Schedule' },
      { icon: Package, label: 'Work Packages' },
      { icon: FileText, label: 'RFQs / RFPs' },
      { icon: ShieldCheck, label: 'Quality & Certs' },
      { icon: Network, label: 'Network Control Tower' },
      { icon: History, label: 'Audit Logs' },
      { icon: Settings, label: 'System Ops' },
    ],
    [Module.FORGE]: [
      { icon: LayoutDashboard, label: 'Forge Dashboard' },
      { icon: TrendingUp, label: 'Throughput' },
      { icon: Hammer, label: 'Work Orders' },
      { icon: Zap, label: 'WIP and Routing' },
      { icon: Truck, label: 'Inbound Supplier Work' },
      { icon: Gauge, label: 'Equipment & Capacity' },
      { icon: Layers, label: 'Integration and Test' },
      { icon: ShieldCheck, label: 'Quality & Certs' },
      { icon: ShoppingCart, label: 'Supply Chain' },
      { icon: Truck, label: 'Shipping and Release' },
      { icon: History, label: 'Audit Logs' },
    ],
    [Module.EXECUTE]: [
      { icon: Scan, label: 'Kiosk Home' },
      { icon: Cpu, label: 'CNC Station' },
      { icon: Zap, label: 'Additive Station' },
      { icon: Thermometer, label: 'Autoclave Station' },
      { icon: Shield, label: 'Certification Station' },
    ],
    [Module.ATLAS]: [
      { icon: Globe, label: 'Mission Intake' },
      { icon: CheckCircle2, label: 'Approved Solutions' },
      { icon: ClipboardList, label: 'RFPs & RFQs' },
      { icon: Eye, label: 'Execution Visibility' },
    ],
  };

  const menuItems = moduleMenus[currentModule];

  return (
    <div className="flex min-h-screen bg-transparent text-slate-200 overflow-x-hidden">
      {/* Sidebar */}
      <aside 
        style={{ 
          backgroundColor: 'var(--nav-bg, rgba(15, 23, 42, 0.8))',
          borderColor: 'var(--nav-border, rgba(30, 41, 59, 1))'
        }}
        className={`backdrop-blur-xl border-r transition-all duration-300 flex flex-col sticky top-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="p-6 flex flex-col gap-4">
          <button 
            onClick={onChangeModule}
            className="flex items-center gap-2 text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors mb-2 group"
          >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            {isSidebarOpen && "Change Module"}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <LaunchbeltLogo className="w-10 h-10 relative z-10" glowColor="var(--primary-color)" />
            </div>
            
            {isSidebarOpen && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="font-bold text-lg tracking-tight text-white leading-none uppercase italic">Launchbelt</span>
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1.5 opacity-80">
                  {currentModule} OPS
                </span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item.label)}
              className={`flex items-center w-full gap-4 px-3 py-3 rounded-xl transition-all group ${
                activeView === item.label 
                ? 'bg-primary/20 text-primary border border-primary/40 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-primary/10 border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.label ? 'text-primary' : 'group-hover:text-primary'}`} />
              {isSidebarOpen && <span className="font-medium text-sm text-left">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div 
          style={{ borderColor: 'var(--nav-border, rgba(30, 41, 59, 1))' }}
          className="p-4 border-t"
        >
          <button className="flex items-center w-full gap-4 px-3 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {/* Header */}
        <header 
          style={{ 
            backgroundColor: 'var(--nav-bg, rgba(15, 23, 42, 0.3))',
            borderColor: 'var(--nav-border, rgba(30, 41, 59, 0.5))'
          }}
          className="h-16 border-b px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-50"
        >
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={`Search within ${currentModule}...`} 
              className="bg-transparent border-none text-sm w-full outline-none focus:ring-0 placeholder:text-slate-600 font-medium"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              L5 Protocol Active
            </div>
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-slate-900" />
            </button>
            <div 
              style={{ borderColor: 'var(--nav-border, rgba(30, 41, 59, 1))' }}
              className="flex items-center gap-3 pl-4 border-l"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white italic">A. Rivera</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{userRole}</p>
              </div>
              <img src={`https://picsum.photos/seed/${currentModule}/40/40`} className="w-9 h-9 rounded-full border border-primary/20" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
