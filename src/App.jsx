import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RtiDraftingAgent } from './components/RtiDraftingAgent';
import { RightsNavigator } from './components/RightsNavigator';
import { SchemeEligibilityReader } from './components/SchemeEligibilityReader';
import { GrievanceFormFiller } from './components/GrievanceFormFiller';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('rti');
  const [lang, setLang] = useState('en');

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'rti' && <RtiDraftingAgent />}
        {activeTab === 'rights' && <RightsNavigator />}
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
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>CPGRAMS Portal</span>
              <ExternalLink className="w-3 h-3 text-orange-400" />
            </a>
            <span>•</span>
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>National Consumer Helpline</span>
              <ExternalLink className="w-3 h-3 text-orange-400" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
