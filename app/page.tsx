
'use client';

import React, { useState, useEffect } from 'react';
import { Role, Module } from '@/types';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import WorkPackages from '@/components/WorkPackages';
import WorkPackageDetail from '@/components/WorkPackageDetail';
import RFQList from '@/components/RFQList';
import RFQDetail from '@/components/RFQDetail';
import QualityCerts from '@/components/QualityCerts';
import AuditLog from '@/components/AuditLog';
import NetworkOps from '@/components/NetworkOps';
import SystemOps from '@/components/SystemOps';
import RFQWorkflowWizard from '@/components/RFQWorkflowWizard';
import WorkPackageWizard from '@/components/WorkPackageWizard';
import ModuleSelector from '@/components/ModuleSelector';
import LandingPage from '@/components/LandingPage';
import CostSchedule from '@/components/CostSchedule';
import FacilityThroughput from '@/components/FacilityThroughput';
// Forge Components
import ForgeDashboard from '@/components/ForgeDashboard';
import WorkOrders from '@/components/WorkOrders';
import WIPRouting from '@/components/WIPRouting';
import InboundWork from '@/components/InboundWork';
import IntegrationTest from '@/components/IntegrationTest';
import SupplyChain from '@/components/SupplyChain';
import ShippingRelease from '@/components/ShippingRelease';
import EquipmentCapacity from '@/components/EquipmentCapacity';
// Execute Components
import KioskHome from '@/components/KioskHome';
import CNCStation from '@/components/CNCStation';
import AdditiveStation from '@/components/AdditiveStation';
import AutoclaveStation from '@/components/AutoclaveStation';
import CertificationStation from '@/components/CertificationStation';
import JobComplete from '@/components/JobComplete';
import QualityIssueWorkflow from '@/components/QualityIssueWorkflow';
// Atlas Components
import AtlasMissionIntake from '@/components/AtlasMissionIntake';
import AtlasSolutionReadiness from '@/components/AtlasSolutionReadiness';
import AtlasOrderRequests from '@/components/AtlasOrderRequests';
import AtlasExecutionVisibility from '@/components/AtlasExecutionVisibility';

export interface NavigationState {
  view: string;
  params?: any;
}

export default function Home() {
  const [hasEnteredDemo, setHasEnteredDemo] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);
  const [navStack, setNavStack] = useState<NavigationState[]>([{ view: 'Dashboard' }]);

  const currentNav = navStack[navStack.length - 1];

  useEffect(() => {
    if (currentModule) {
      const root = document.documentElement;
      const themeColors = {
        [Module.COMMAND]: { 
          main: '#3b82f6', 
          dark: '#2563eb', 
          glow: 'rgba(59, 130, 246, 0.15)', 
          bg: '#050b1a', 
          nav: 'rgba(59, 130, 246, 0.08)',
          border: 'rgba(59, 130, 246, 0.2)'
        },
        [Module.FORGE]: { 
          main: '#ef4444', 
          dark: '#dc2626', 
          glow: 'rgba(239, 68, 68, 0.15)', 
          bg: '#1a0505', 
          nav: 'rgba(239, 68, 68, 0.08)',
          border: 'rgba(239, 68, 68, 0.2)'
        },
        [Module.EXECUTE]: { 
          main: '#10b981', 
          dark: '#059669', 
          glow: 'rgba(16, 185, 129, 0.15)', 
          bg: '#051a0b', 
          nav: 'rgba(16, 185, 129, 0.08)',
          border: 'rgba(16, 185, 129, 0.2)'
        },
        [Module.ATLAS]: { 
          main: '#f97316', 
          dark: '#ea580c', 
          glow: 'rgba(249, 115, 22, 0.15)', 
          bg: '#1a0f05', 
          nav: 'rgba(249, 115, 22, 0.08)',
          border: 'rgba(249, 115, 22, 0.2)'
        },
      };
      
      const colors = themeColors[currentModule];
      root.style.setProperty('--primary-color', colors.main);
      root.style.setProperty('--primary-dark', colors.dark);
      root.style.setProperty('--primary-glow', colors.glow);
      root.style.setProperty('--module-bg', colors.bg);
      root.style.setProperty('--nav-bg', colors.nav);
      root.style.setProperty('--nav-border', colors.border);
      
      if (currentModule === Module.FORGE) root.style.setProperty('--primary-color-rgb', '239, 68, 68');
      else if (currentModule === Module.COMMAND) root.style.setProperty('--primary-color-rgb', '59, 130, 246');
      else if (currentModule === Module.EXECUTE) root.style.setProperty('--primary-color-rgb', '16, 185, 129');
      else if (currentModule === Module.ATLAS) root.style.setProperty('--primary-color-rgb', '249, 115, 22');
    } else {
      document.documentElement.style.setProperty('--module-bg', '#020617');
    }
  }, [currentModule]);

  const pushView = (view: string, params?: any) => {
    setNavStack([...navStack, { view, params }]);
  };

  const popView = () => {
    if (navStack.length > 1) {
      setNavStack(navStack.slice(0, -1));
    }
  };

  const resetTo = (view: string, params?: any) => {
    setNavStack([{ view, params }]);
  };

  const handleModuleSelect = (module: Module) => {
    setCurrentModule(module);
    const initialViews: Record<Module, string> = {
      [Module.COMMAND]: 'Dashboard',
      [Module.FORGE]: 'Forge Dashboard',
      [Module.EXECUTE]: 'Kiosk Home',
      [Module.ATLAS]: 'Mission Intake'
    };
    setNavStack([{ view: initialViews[module] }]);
  };

  const handleChangeModule = () => {
    setCurrentModule(null);
    setNavStack([{ view: 'Dashboard' }]);
  };

  if (!hasEnteredDemo) {
    return <LandingPage onEnter={() => setHasEnteredDemo(true)} />;
  }

  if (!currentModule) {
    return <ModuleSelector onSelect={handleModuleSelect} />;
  }

  const renderContent = () => {
    if (currentModule === Module.COMMAND) {
      switch (currentNav.view) {
        case 'Dashboard': return <Dashboard role={userRole} onNavigate={resetTo} />;
        case 'Cost & Schedule': return <CostSchedule />;
        case 'Work Packages': return <WorkPackages initialFilter={currentNav.params?.filter} onSelectPackage={(pkg) => pushView('Work Package Detail', { pkg })} onCreateNew={() => pushView('Work Package Wizard')} />;
        case 'Work Package Detail': return <WorkPackageDetail pkg={currentNav.params.pkg} pkgId={currentNav.params.pkgId} initialTab={currentNav.params.tab} userRole={userRole} onBack={popView} />;
        case 'Work Package Wizard': return <WorkPackageWizard onBack={popView} onFinish={() => resetTo('Work Packages')} />;
        case 'RFQs / RFPs': return <RFQList onSelectRFQ={(rfq) => pushView('RFQ Detail', { rfq })} onCreateNew={() => pushView('RFQ Workflow')} />;
        case 'RFQ Detail': return <RFQDetail rfq={currentNav.params.rfq} userRole={userRole} onBack={popView} />;
        case 'RFQ Workflow': return <RFQWorkflowWizard onBack={popView} onFinish={() => resetTo('RFQs / RFPs')} />;
        case 'Quality & Certs': return <QualityCerts initialSubView={currentNav.params?.subView} initialCertId={currentNav.params?.certId} initialViewMode={currentNav.params?.viewMode} focusArea={currentNav.params?.focus} />;
        case 'Network Control Tower': return <NetworkOps role={userRole} initialTab={currentNav.params?.tab} initialView={currentNav.params?.mode} initialFacilityId={currentNav.params?.facilityId} highlightId={currentNav.params?.highlightId} />;
        case 'Audit Logs': return <AuditLog />;
        case 'System Ops': return <SystemOps />;
        default: return <Dashboard role={userRole} onNavigate={resetTo} />;
      }
    }

    if (currentModule === Module.FORGE) {
      switch (currentNav.view) {
        case 'Forge Dashboard': return <ForgeDashboard onNavigate={pushView} />;
        case 'Throughput': return <FacilityThroughput />;
        case 'Work Orders': return <WorkOrders initialView={currentNav.params?.view} onNavigate={pushView} onBack={popView} initialWoId={currentNav.params?.woId} />;
        case 'WIP and Routing': return <WIPRouting onNavigate={pushView} />;
        case 'Inbound Supplier Work': return <InboundWork initialView={currentNav.params?.view} onNavigate={pushView} onBack={popView} initialShipId={currentNav.params?.shipId} />;
        case 'Equipment & Capacity': return <EquipmentCapacity initialView={currentNav.params?.view} initialMachineId={currentNav.params?.machineId} onNavigate={pushView} onBack={popView} />;
        case 'Integration and Test': return <IntegrationTest initialView={currentNav.params?.view} onNavigate={pushView} onBack={popView} initialWoId={currentNav.params?.woId} />;
        case 'Quality & Certs': return <QualityCerts initialSubView={currentNav.params?.subView} initialCertId={currentNav.params?.certId} initialViewMode={currentNav.params?.viewMode} focusArea={currentNav.params?.focus} />;
        case 'Supply Chain': return <SupplyChain onNavigate={pushView} />;
        case 'Shipping and Release': return <ShippingRelease onNavigate={pushView} />;
        case 'Audit Logs': return <AuditLog />;
        default: return <ForgeDashboard onNavigate={pushView} />;
      }
    }

    if (currentModule === Module.EXECUTE) {
      switch (currentNav.view) {
        case 'Kiosk Home': return <KioskHome onScan={(context) => resetTo(context.station, { context })} />;
        case 'CNC Station': return <CNCStation job={currentNav.params?.context} onComplete={(details) => resetTo('Job Complete', details)} onFlagIssue={() => pushView('Quality Issue', { context: currentNav.params?.context })} />;
        case 'Additive Station': return <AdditiveStation job={currentNav.params?.context} onComplete={(details) => resetTo('Job Complete', details)} onFlagIssue={() => pushView('Quality Issue', { context: currentNav.params?.context })} />;
        case 'Autoclave Station': return <AutoclaveStation job={currentNav.params?.context} onComplete={(details) => resetTo('Job Complete', details)} onFlagIssue={() => pushView('Quality Issue', { context: currentNav.params?.context })} />;
        case 'Certification Station': return <CertificationStation job={currentNav.params?.context} onComplete={(details) => resetTo('Job Complete', details)} onFlagIssue={() => pushView('Quality Issue', { context: currentNav.params?.context })} />;
        case 'Job Complete': return <JobComplete data={currentNav.params} onStartNext={(context) => resetTo(context.station, { context })} onReturnHome={() => resetTo('Kiosk Home')} />;
        case 'Quality Issue': return <QualityIssueWorkflow context={currentNav.params?.context} onCancel={popView} onFinish={() => resetTo('Kiosk Home')} />;
        default: return <KioskHome onScan={(context) => resetTo(context.station, { context })} />;
      }
    }

    if (currentModule === Module.ATLAS) {
      switch (currentNav.view) {
        case 'Mission Intake': return <AtlasMissionIntake onNavigate={pushView} />;
        case 'Approved Solutions': return <AtlasSolutionReadiness initialSolutionId={currentNav.params?.solutionId} onNavigate={pushView} onBack={popView} />;
        case 'RFPs & RFQs': return <AtlasOrderRequests initialSolution={currentNav.params?.solution} onNavigate={pushView} onBack={popView} />;
        case 'Execution Visibility': return <AtlasExecutionVisibility onNavigate={pushView} onBack={popView} />;
        default: return <AtlasMissionIntake onNavigate={pushView} />;
      }
    }

    return <Dashboard role={userRole} onNavigate={resetTo} />;
  };

  return (
    <div style={{ '--module-bg': '#020617' } as React.CSSProperties}>
      <Layout 
        userRole={userRole} 
        currentModule={currentModule!} 
        onChangeModule={handleChangeModule}
        setUserRole={setUserRole} 
        onNavigate={(view) => resetTo(view)}
        activeView={currentNav.view}
      >
        <div className="max-w-7xl mx-auto min-h-full">
          {renderContent()}
        </div>
      </Layout>
    </div>
  );
}
