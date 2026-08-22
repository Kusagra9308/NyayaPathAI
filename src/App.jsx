import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ServiceHub } from './components/ServiceHub';
import { RtiDraftingAgent } from './components/RtiDraftingAgent';
import { RightsNavigator } from './components/RightsNavigator';
import { LegalAidFinder } from './components/LegalAidFinder';
import { ConsumerCourtEngine } from './components/ConsumerCourtEngine';
import { SchemeEligibilityReader } from './components/SchemeEligibilityReader';
import { GrievanceFormFiller } from './components/GrievanceFormFiller';
import { ShieldCheck, ExternalLink, ArrowLeft } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'rti' | 'rights' | 'legal_aid' | 'consumer_court' | 'schemes' | 'grievance'

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Breadcrumb bar when inside a specific service */}
        {activeTab !== 'hub' && (
          <div className="mb-6 flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
            <button
              onClick={() => setActiveTab('hub')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span>Executive Suite Hub</span>
            </button>

            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              NyayaPath AI • Civic &amp; Legal Action Intelligence Suite
            </span>
          </div>
        )}

        {activeTab === 'hub' && <ServiceHub onSelectService={(id) => setActiveTab(id)} />}
        {activeTab === 'rti' && <RtiDraftingAgent />}
        {activeTab === 'rights' && <RightsNavigator />}
        {activeTab === 'legal_aid' && <LegalAidFinder />}
        {activeTab === 'consumer_court' && <ConsumerCourtEngine />}
        {activeTab === 'schemes' && <SchemeEligibilityReader />}
        {activeTab === 'grievance' && <GrievanceFormFiller />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>NyayaPath AI • Civic Tech &amp; Legal Empowerment System</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://rti.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>RTI Online Portal</span>
              <ExternalLink className="w-3 h-3 text-orange-400" />
            </a>
            <span>•</span>
            <a
              href="https://nalsa.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>NALSA Portal</span>
              <ExternalLink className="w-3 h-3 text-purple-400" />
            </a>
            <span>•</span>
            <a
              href="https://edaakhil.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>e-Daakhil Portal</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>
            <span>•</span>
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>CPGRAMS Portal</span>
              <ExternalLink className="w-3 h-3 text-orange-400" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
