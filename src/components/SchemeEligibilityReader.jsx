import React, { useState } from 'react';
import { evaluateSchemeEligibility } from '../utils/schemeData';
import { Landmark, Sparkles, CheckCircle, AlertTriangle, ExternalLink, FileCheck2, User, DollarSign, Briefcase } from 'lucide-react';

export const SchemeEligibilityReader = () => {
  const [citizenProfile, setCitizenProfile] = useState({
    age: 32,
    incomeLakhs: 2.2,
    occupation: 'worker',
    gender: 'female',
    hasPuccaHouse: false,
    hasLand: false
  });

  const evaluatedSchemes = evaluateSchemeEligibility(citizenProfile);

  return (
    <div className="space-y-8 animate-fade-in">
      
     
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Plain Language Welfare Reader
            </div>
            <h2 className="text-2xl font-extrabold text-white">Government Welfare Scheme Eligibility Reader</h2>
            <p className="text-xs text-slate-400">Enter basic citizen profile to instantly match eligibility against Central &amp; State government welfare portals.</p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3 text-orange-400" /> Age (Years)
            </label>
            <input
              type="number"
              value={citizenProfile.age}
              onChange={(e) => setCitizenProfile({ ...citizenProfile, age: Number(e.target.value) })}
              className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Income (Lakhs/yr)
            </label>
            <input
              type="number"
              step="0.1"
              value={citizenProfile.incomeLakhs}
              onChange={(e) => setCitizenProfile({ ...citizenProfile, incomeLakhs: Number(e.target.value) })}
              className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-sky-400" /> Primary Sector
            </label>
            <select
              value={citizenProfile.occupation}
              onChange={(e) => setCitizenProfile({ ...citizenProfile, occupation: e.target.value })}
              className="w-full bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="worker" className="bg-slate-900">Unorganised Worker / Labour</option>
              <option value="farmer" className="bg-slate-900">Farmer / Agriculture</option>
              <option value="vendor" className="bg-slate-900">Street Vendor / Self-Employed</option>
              <option value="salaried" className="bg-slate-900">Private Salaried / Employee</option>
              <option value="homemaker" className="bg-slate-900">Homemaker / Student</option>
            </select>
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400">Gender</label>
            <select
              value={citizenProfile.gender}
              onChange={(e) => setCitizenProfile({ ...citizenProfile, gender: e.target.value })}
              className="w-full bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="female" className="bg-slate-900">Female</option>
              <option value="male" className="bg-slate-900">Male</option>
              <option value="transgender" className="bg-slate-900">Transgender</option>
            </select>
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">Pucca House</label>
            <input
              type="checkbox"
              checked={citizenProfile.hasPuccaHouse}
              onChange={(e) => setCitizenProfile({ ...citizenProfile, hasPuccaHouse: e.target.checked })}
              className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">Agri Land</label>
            <input
              type="checkbox"
              checked={citizenProfile.hasLand}
              onChange={(e) => setCitizenProfile({ ...citizenProfile, hasLand: e.target.checked })}
              className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Landmark className="w-5 h-5 text-orange-400" /> Matched Government Schemes ({evaluatedSchemes.filter(s => s.isEligible).length} Highly Eligible)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evaluatedSchemes.map(({ scheme, isEligible, score, reasons }) => (
            <div
              key={scheme.id}
              className={`bg-slate-900 border rounded-3xl p-6 space-y-5 shadow-xl transition-all flex flex-col justify-between ${
                isEligible
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {scheme.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{scheme.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{scheme.ministry}</p>
                  </div>

                  {isEligible ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1 flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" /> High Match ({score}%)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs font-bold flex items-center gap-1 flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" /> Low Match
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                  {scheme.brief}
                </p>

                
                <div className="bg-orange-500/5 p-3 rounded-2xl border border-orange-500/20 text-xs space-y-1">
                  <span className="font-bold text-orange-400 text-[11px] uppercase tracking-wider">Entitlement Benefit:</span>
                  <p className="text-orange-200 font-semibold">{scheme.benefits}</p>
                </div>

               
                {reasons.length > 0 && (
                  <div className="bg-rose-950/20 border border-rose-800/30 rounded-2xl p-3 text-xs text-rose-300 space-y-1">
                    <span className="font-bold text-rose-400 text-[11px]">Criteria Note:</span>
                    {reasons.map((r, i) => (
                      <p key={i}>• {r}</p>
                    ))}
                  </div>
                )}

                
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> Mandatory Document Checklist:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.documentsRequired.map((doc, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              
              <div className="pt-3 border-t border-slate-800/80">
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
                >
                  <span>Apply on Official Portal ({scheme.portalUrl.replace('https://', '')})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
