import React from 'react';
import { FileText, Scale, Landmark, HeartHandshake, Gavel, UserCheck, ArrowRight, ShieldCheck, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export const ServiceHub = ({ onSelectService }) => {
  const services = [
    {
      id: 'rti',
      title: 'RTI Drafting Agent',
      subtitle: 'Section 6(1) RTI Act 2005',
      badge: 'rtionline.gov.in Compliant',
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      icon: FileText,
      description: 'Converts plain-language citizen questions into 3,000-character section-formatted applications with auto-matched Ministries for rtionline.gov.in.',
      features: [
        'rtionline.gov.in 3,000-char regex sanitizer',
        'Smart Ministry auto-matching',
        'Section line-break formatting',
        '1-Click PDF export'
      ],
      buttonText: 'Launch RTI Agent'
    },
    {
      id: 'legal_aid',
      title: 'Free Legal Aid & NALSA Finder',
      subtitle: 'Section 12 NALSA Act 1987',
      badge: '100% Free Court Lawyer',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      icon: UserCheck,
      description: 'Evaluates citizen statutory entitlement for a 100% Free Assigned Lawyer (Women, SC/ST, PWD, Laborers, Under-trials) and auto-drafts DLSA applications.',
      features: [
        'Statutory Section 12 NALSA eligibility check',
        'Auto-drafts DLSA assigned lawyer application',
        'AI Legal Case summarizer',
        'Direct DLSA court Complex PDF export'
      ],
      buttonText: 'Find Free Legal Aid'
    },
    {
      id: 'consumer_court',
      title: 'Consumer Court e-Daakhil Engine',
      subtitle: 'Section 35 Consumer Protection Act 2019',
      badge: 'edaakhil.nic.in Compliant',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      icon: Gavel,
      description: 'Formats consumer disputes (e-commerce refund refusal, defective product, builder delay) into formal Section 35 Complaint Petitions for online filing on edaakhil.nic.in.',
      features: [
        'Itemized Monetary Claim Breakdown',
        'Cause of Action & Jurisdiction drafting',
        'Verification Affidavit generator',
        'AI Fact Refiner & PDF export'
      ],
      buttonText: 'Generate e-Daakhil Petition'
    },
    {
      id: 'rights',
      title: 'Rights Navigator & Legal Studio',
      subtitle: 'Tenant, Consumer, Workplace & Cyber Rights',
      badge: 'Visual Legal Dossier',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: Scale,
      description: 'Interactive Legal Rights Studio with sliders, statutory law references, case strength progress meter, and 15-day pre-litigation demand notice generator.',
      features: [
        'Scraped statutory legal provisions',
        'Dynamic Case Strength Gauge',
        'Interactive dispute sliders',
        '15-Day Legal Demand Notice draft'
      ],
      buttonText: 'Explore Legal Rights Studio'
    },
    {
      id: 'schemes',
      title: 'Scheme Eligibility Reader',
      subtitle: 'Central & State Welfare Portal Evaluator',
      badge: 'Welfare Matcher',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      icon: Landmark,
      description: 'Matches citizen profile parameters (income, age, occupation) against Ayushman Bharat, PM-KISAN, e-Shram, and PM Awas Yojana with document checklists.',
      features: [
        'Instant citizen profile evaluator',
        'Document requirement checklists',
        'Official scheme portal links',
        'Direct application instructions'
      ],
      buttonText: 'Check Scheme Eligibility'
    },
    {
      id: 'grievance',
      title: 'Form-Filler Agent',
      subtitle: 'CPGRAMS Public Grievance Interviewer',
      badge: 'pgportal.gov.in Compliant',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      icon: HeartHandshake,
      description: 'AI Interviewer Agent that converses with citizens and auto-populates structured public grievances for registration on pgportal.gov.in.',
      features: [
        'Conversational AI Q&A interview',
        'Auto-populates CPGRAMS format',
        'Copy to clipboard & PDF export',
        'Direct CPGRAMS submission link'
      ],
      buttonText: 'File Public Grievance'
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in py-4">
      
      {/* Hero Executive Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> AI-Powered Civic &amp; Legal Action Intelligence
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Democratizing Legal Rights &amp; Government Transparency
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            NyayaPath AI translates bureaucratic complexity into clear, guided legal paths, portal-compliant drafts, and free statutory representation for every Indian citizen.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-3 gap-4 max-w-xl mx-auto border-t border-slate-800/80">
            <div>
              <span className="font-mono font-black text-xl text-orange-400">6</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Specialized AI Agents</p>
            </div>
            <div>
              <span className="font-mono font-black text-xl text-emerald-400">100%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Portal Compliant</p>
            </div>
            <div>
              <span className="font-mono font-black text-xl text-purple-400">₹0</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Free Citizen Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Executive Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.id}
              onClick={() => onSelectService(svc.id)}
              className="group bg-slate-900 border border-slate-800 hover:border-orange-500/60 rounded-3xl p-6 space-y-5 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Header bar */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border ${svc.badgeColor}`}>
                    {svc.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{svc.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {svc.description}
                </p>

                {/* Feature Pills */}
                <div className="space-y-1.5 pt-1">
                  {svc.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-400 group-hover:text-orange-300">
                <span>{svc.buttonText}</span>
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 group-hover:bg-orange-500 text-orange-400 group-hover:text-white flex items-center justify-center transition-all shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
