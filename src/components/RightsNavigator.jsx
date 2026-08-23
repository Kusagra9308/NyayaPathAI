import React, { useState } from 'react';
import { DISPUTE_CATEGORIES, generateLegalNoticeText } from '../utils/rightsData';
import { Scale, Home, ShoppingBag, Briefcase, ShieldAlert, ArrowRight, CheckCircle2, FileCheck, Copy, Check, ExternalLink, ShieldCheck, AlertCircle, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export const RightsNavigator = () => {
  const [selectedCatId, setSelectedCatId] = useState('tenant');
  
  const [disputeAmount, setDisputeAmount] = useState(25000);
  const [delayMonths, setDelayMonths] = useState(2);
  const [hasWrittenProof, setHasWrittenProof] = useState(true);
  const [hasNoticeSent, setHasNoticeSent] = useState(false);
  const [senderName, setSenderName] = useState('Kushagra Chauhan');
  const [receiverName, setReceiverName] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');

  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('dossier'); // 'dossier' | 'notice' | 'evidence'

  const activeCategory = DISPUTE_CATEGORIES.find(c => c.id === selectedCatId) || DISPUTE_CATEGORIES[0];

  // calculate strength of the case 
  const calculateCaseStrength = () => {
    let score = 50;
    if (hasWrittenProof) score += 35;
    if (delayMonths >= 1) score += 10;
    if (hasNoticeSent) score += 5;
    return Math.min(95, score);
  };

  const caseStrength = calculateCaseStrength();

  // generate notice
  const generatedNotice = generateLegalNoticeText(
    selectedCatId,
    senderName,
    'Address provided',
    receiverName || 'Opposite Party',
    receiverAddress || 'Registered Office Address',
    disputeAmount.toString(),
    `Refusal to resolve ${activeCategory.title} regarding dispute of Rs. ${disputeAmount} pending for ${delayMonths} month(s).`
  );

  const handleDownloadNoticePdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PRE-LITIGATION LEGAL DEMAND NOTICE', 15, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(generatedNotice, 180);
    doc.text(lines, 15, 32);
    doc.save(`Legal_Notice_${selectedCatId}_${Date.now()}.pdf`);
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Home': return <Home className="w-5 h-5 text-orange-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-sky-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default: return <Scale className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      // header
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Visual Legal Rights Studio
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interactive Citizen Legal Dossier &amp; Rights Navigator
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Select your dispute category below to view scraped statutory laws, evaluate your case strength, and generate pre-litigation legal notices instantly.
          </p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DISPUTE_CATEGORIES.map((cat) => {
          const isSelected = selectedCatId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {getCategoryIcon(cat.icon)}
                </div>
                {isSelected && (
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">
                    Selected
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{cat.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{cat.description}</p>
              </div>
            </button>
          );
        })}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-400" /> Dispute Parameters Studio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Adjust sliders to evaluate your legal strength</p>
            </div>

           
            <div className="space-y-4">
        
              <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">Dispute / Claim Amount</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">₹{disputeAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="500000"
                  step="1000"
                  value={disputeAmount}
                  onChange={(e) => setDisputeAmount(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              
              <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">Delay / Non-Resolution Duration</span>
                  <span className="font-mono font-bold text-orange-400 text-sm">{delayMonths} Month(s)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={delayMonths}
                  onChange={(e) => setDelayMonths(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evidence Availability:</span>
                
                <label className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300 font-medium">Written Proof (WhatsApp, Email, Receipts)</span>
                  <input
                    type="checkbox"
                    checked={hasWrittenProof}
                    onChange={(e) => setHasWrittenProof(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300 font-medium">Prior Written Warning / Notice Sent</span>
                  <input
                    type="checkbox"
                    checked={hasNoticeSent}
                    onChange={(e) => setHasNoticeSent(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 rounded"
                  />
                </label>
              </div>

              
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Opposite Party Info (For Notice):</span>
                <input
                  type="text"
                  placeholder="Opposite Party Name (e.g. Landlord Name / Company)"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Opposite Party Address"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

            </div>

          </div>
        </div>

        
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              
             
              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="#1E293B" strokeWidth="5" fill="transparent" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#10B981"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray="138"
                      strokeDashoffset={138 - (138 * caseStrength) / 100}
                    />
                  </svg>
                  <span className="absolute font-bold text-xs text-emerald-400">{caseStrength}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Case Strength Meter</span>
                  <h4 className="font-bold text-white text-sm">
                    {caseStrength >= 80 ? '🟢 Strong Legal Grounds' : '🟡 Moderate Evidence'}
                  </h4>
                </div>
              </div>

              {/* Subtab Switcher */}
              <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveSubTab('dossier')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSubTab === 'dossier' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Legal Rights
                </button>
                <button
                  onClick={() => setActiveSubTab('notice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSubTab === 'notice' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pre-Litigation Notice
                </button>
              </div>

            </div>

           
            {activeSubTab === 'dossier' && (
              <div className="space-y-6 animate-fade-in">
                
              
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" /> Statutory Law Scraped Reference
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{activeCategory.relevantLaw}</span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed font-sans space-y-1">
                    {activeCategory.rightsSummary.map((r, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Action Roadmap */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Step-by-Step Resolution Roadmap:</h4>
                  <div className="space-y-2.5">
                    {activeCategory.actionSteps.map((step) => (
                      <div key={step.step} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 font-mono font-bold text-xs flex items-center justify-center border border-orange-500/20 flex-shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div>
                          <h5 className="font-bold text-white text-xs">{step.title}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                
                <div className="pt-2 border-t border-slate-800">
                  <a
                    href={activeCategory.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <span>File Grievance on Official Portal ({activeCategory.portalName})</span>
                    <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                  </a>
                </div>

              </div>
            )}

      
            {activeSubTab === 'notice' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-emerald-400">15-Day Pre-Litigation Legal Notice Draft</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedNotice);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownloadNoticePdf}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-[380px] overflow-y-auto leading-relaxed shadow-inner">
                  {generatedNotice}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
