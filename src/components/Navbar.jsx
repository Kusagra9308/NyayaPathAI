import React from 'react';
import { Landmark, FileText, Scale, HeartHandshake, ShieldCheck, Languages } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, lang, setLang }) => {
  const tabs = [
    { id: 'rti', label: 'RTI Drafting Agent', icon: FileText, badge: 'Section 6(1)' },
    { id: 'rights', label: 'Rights Navigator', icon: Scale, badge: 'Legal Advice' },
    { id: 'schemes', label: 'Scheme Eligibility', icon: Landmark, badge: 'Welfare' },
    { id: 'grievance', label: 'Form-Filler Agent', icon: HeartHandshake, badge: 'CPGRAMS' },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand logo & tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Landmark className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                NyayaPath <span className="text-orange-500">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Civic Tech
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Translating Bureaucracy &amp; Legal Complexity into Guided Action
            </p>
          </div>
        </div>

        {/* Language selector & Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
            <Languages className="w-4 h-4 text-orange-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">English (English)</option>
              <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
              <option value="mr" className="bg-slate-900">मराठी (Marathi)</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Verified Legal Patterns
          </div>
        </div>
      </div>

      {/* Navigation Module Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
