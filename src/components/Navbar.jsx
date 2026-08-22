import React, { useState } from 'react';
import { Landmark, FileText, Scale, HeartHandshake, Gavel, UserCheck, ChevronDown, LayoutGrid } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const services = [
    {
      id: 'rti',
      label: 'RTI Drafting Agent',
      icon: FileText,
      badge: 'Section 6(1) RTI Act',
      desc: '3,000-char compliant RTI application generator for rtionline.gov.in'
    },
    {
      id: 'rights',
      label: 'Rights Navigator',
      icon: Scale,
      badge: 'Statutory Legal Rights',
      desc: 'Interactive Legal Rights Studio, Case Strength Gauge & Notice Generator'
    },
    {
      id: 'legal_aid',
      label: 'Free Legal Aid & NALSA Advocate Finder',
      icon: UserCheck,
      badge: 'Section 12 NALSA Act',
      desc: 'Evaluates 100% Free Court Advocate eligibility and auto-drafts DLSA applications'
    },
    {
      id: 'consumer_court',
      label: 'Consumer Court e-Daakhil Engine',
      icon: Gavel,
      badge: 'edaakhil.nic.in',
      desc: 'Section 35 Consumer Complaint Petition generator under Consumer Protection Act 2019'
    },
    {
      id: 'schemes',
      label: 'Scheme Eligibility Reader',
      icon: Landmark,
      badge: 'Welfare Schemes',
      desc: 'Profile evaluator for Ayushman, PM-KISAN, e-Shram & PM Awas Yojana'
    },
    {
      id: 'grievance',
      label: 'Form-Filler Agent',
      icon: HeartHandshake,
      badge: 'CPGRAMS Portal',
      desc: 'AI Interviewer that populates public grievances for pgportal.gov.in'
    },
  ];

  const currentService = services.find(s => s.id === activeTab) || services[0];
  const CurrentIcon = currentService.icon;

  return (
    <header className="border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand logo & tagline */}
        <div
          onClick={() => setActiveTab('hub')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Landmark className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              NyayaPath <span className="text-orange-500">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Translating Bureaucracy &amp; Legal Complexity into Guided Action
            </p>
          </div>
        </div>

        {/* Dedicated Page Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <div className="p-1.5 rounded-xl bg-orange-500 text-white">
              <CurrentIcon className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Active Service</span>
              <span className="font-bold text-white text-xs">{currentService.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Page Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-88 bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl z-50 space-y-1.5 animate-fade-in max-h-96 overflow-y-auto">
              <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <LayoutGrid className="w-3.5 h-3.5 text-orange-400" /> Switch Service Page
                </span>
                <span className="text-[10px] text-orange-400 font-mono font-bold">6 Services</span>
              </div>

              {services.map((svc) => {
                const SvcIcon = svc.icon;
                const isSelected = activeTab === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setActiveTab(svc.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-950 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400'
                    }`}>
                      <SvcIcon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{svc.label}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{svc.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Page Navigation Indicator Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono text-[10px] text-orange-400 uppercase font-bold">Dedicated Page:</span>
            <span className="font-bold text-white text-xs">{currentService.label}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">{currentService.badge}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {services.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setActiveTab(svc.id)}
                title={svc.label}
                className={`h-2 rounded-full transition-all ${
                  activeTab === svc.id ? 'w-8 bg-orange-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    </header>
  );
};
