import React, { useState } from 'react';
import { DISPUTE_CATEGORIES, generateLegalNoticeText } from '../utils/rightsData';
import { Scale, Home, ShoppingBag, Briefcase, ShieldAlert, ArrowRight, CheckCircle2, FileCheck, Copy, Check, ExternalLink } from 'lucide-react';

export const RightsNavigator = () => {
  const [selectedCatId, setSelectedCatId] = useState('tenant');
  const [showNoticeGenerator, setShowNoticeGenerator] = useState(false);

  const [noticeForm, setNoticeForm] = useState({
    senderName: '',
    senderAddress: '',
    receiverName: '',
    receiverAddress: '',
    amountClaimed: '25000',
    incidentDetails: ''
  });

  const [generatedNotice, setGeneratedNotice] = useState(null);
  const [copied, setCopied] = useState(false);

  const activeCategory = DISPUTE_CATEGORIES.find(c => c.id === selectedCatId) || DISPUTE_CATEGORIES[0];

  const handleGenerateNotice = (e) => {
    e.preventDefault();
    const noticeText = generateLegalNoticeText(
      selectedCatId,
      noticeForm.senderName,
      noticeForm.senderAddress,
      noticeForm.receiverName,
      noticeForm.receiverAddress,
      noticeForm.amountClaimed,
      noticeForm.incidentDetails || activeCategory.description
    );
    setGeneratedNotice(noticeText);
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
      
      {/* Category selector grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DISPUTE_CATEGORIES.map((cat) => {
          const isSelected = selectedCatId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                setGeneratedNotice(null);
              }}
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
                    Active Mode
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

      {/* Active Category Rights Detail Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        
        {/* Header banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Legal Protection Guide</span>
              <span className="text-xs font-mono text-slate-400">• {activeCategory.relevantLaw}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{activeCategory.title}</h2>
          </div>

          <a
            href={activeCategory.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 inline-flex items-center gap-2 transition-all self-start md:self-center"
          >
            <span>Official Portal ({activeCategory.portalName})</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </a>
        </div>

        {/* Rights Summary List */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Your Statutory Rights (Plain English):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCategory.rightsSummary.map((right, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-medium leading-relaxed">{right}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Steps */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Guided Action Plan:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeCategory.actionSteps.map((step) => (
              <div key={step.step} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-orange-500/10 text-orange-400 font-mono font-bold text-xs flex items-center justify-center border border-orange-500/20">
                    0{step.step}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
                <h5 className="font-bold text-white text-sm pt-1">{step.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Notice Generator Trigger */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-sm">Need to send a formal warning to the opposing party?</h4>
            <p className="text-xs text-slate-400">Generate a legally structured Pre-Litigation Demand Notice in 1 minute.</p>
          </div>
          <button
            onClick={() => setShowNoticeGenerator(!showNoticeGenerator)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all flex-shrink-0"
          >
            <FileCheck className="w-4 h-4" /> {showNoticeGenerator ? 'Hide Generator' : 'Generate Pre-Litigation Legal Notice'}
          </button>
        </div>

        {/* Notice Generator Form & Output */}
        {showNoticeGenerator && (
          <div className="pt-4 border-t border-slate-800/80 space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-orange-400" /> Pre-Litigation Legal Demand Notice Generator
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <form onSubmit={handleGenerateNotice} className="lg:col-span-6 space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Your Full Name (Sender)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anish Sharma"
                      value={noticeForm.senderName}
                      onChange={(e) => setNoticeForm({ ...noticeForm, senderName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Opposite Party Name (Receiver)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Housing Owner / Company Name"
                      value={noticeForm.receiverName}
                      onChange={(e) => setNoticeForm({ ...noticeForm, receiverName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Amount Claimed (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25000"
                      value={noticeForm.amountClaimed}
                      onChange={(e) => setNoticeForm({ ...noticeForm, amountClaimed: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Receiver Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Registered Office / Owner Address"
                      value={noticeForm.receiverAddress}
                      onChange={(e) => setNoticeForm({ ...noticeForm, receiverAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Incident &amp; Dispute Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe why the amount is owed or what statutory right was violated..."
                    value={noticeForm.incidentDetails}
                    onChange={(e) => setNoticeForm({ ...noticeForm, incidentDetails: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Generate Pre-Litigation Legal Notice Text
                </button>
              </form>

              {/* Generated Legal Notice Output */}
              <div className="lg:col-span-6 space-y-3">
                {generatedNotice ? (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">Generated Notice Draft</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedNotice);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1 hover:bg-slate-800"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-80 overflow-y-auto p-3 bg-slate-900 rounded-xl leading-relaxed">
                      {generatedNotice}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-8 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center min-h-[220px]">
                    Fill in the details on the left form to preview your 15-day pre-litigation legal notice draft.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
