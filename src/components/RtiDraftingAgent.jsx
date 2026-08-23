import React, { useState } from 'react';
import { FileText, Sparkles, Download, Copy, Check, Info, Building2, HelpCircle, ShieldCheck, ExternalLink, Bot } from 'lucide-react';
import { generateRtiDraft, downloadRtiPdf, OFFICIAL_MINISTRIES, detectMinistryForQuery } from '../utils/rtiGenerator';
import { RtiChatbotAssistant } from './RtiChatbotAssistant';

export const RtiDraftingAgent = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    address: '',
    phone: '',
    email: '',
    state: 'Delhi (NCT)',
    city: 'New Delhi',
    selectedMinistry: 'Department of Food & Public Distribution',
    queryText: '',
    specificDetails: '',
    bplStatus: false,
    bplCardNo: ''
  });

  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const sampleQueries = [
    { text: 'What is the current processing status of my Ration Card application?', ministry: 'Department of Food & Public Distribution' },
    { text: 'Why is the road repair in Ward 12 delayed for 8 months?', ministry: 'Ministry of Road Transport & Highways' },
    { text: 'Provide certified water quality test reports for my locality over last 3 months', ministry: 'Ministry of Housing & Urban Affairs' },
    { text: 'Details of EPF disbursement and pension delay for my PF Account', ministry: 'Ministry of Labour & Employment' }
  ];

  const handleQueryChange = (text) => {
    const autoMinistry = detectMinistryForQuery(text);
    setFormData(prev => ({
      ...prev,
      queryText: text,
      selectedMinistry: autoMinistry
    }));
  };

  const handleSelectSample = (sample) => {
    setFormData(prev => ({
      ...prev,
      queryText: sample.text,
      selectedMinistry: sample.ministry
    }));
  };

  const handleApplyDraftFromChatbot = (queryText, ministry) => {
    setFormData(prev => ({
      ...prev,
      queryText: queryText,
      selectedMinistry: ministry || detectMinistryForQuery(queryText)
    }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.queryText.trim()) return;
    const draft = generateRtiDraft(formData);
    setGeneratedDraft(draft);
  };

  const handleCopy = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft.portalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Official rtionline.gov.in Compliant Format
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Right to Information (RTI) Drafting Agent
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Formats your plain-language query into the exact 3,000-character, section-formatted text required by the <strong>rtionline.gov.in</strong> portal (DoPT, Govt of India).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" /> RTI Application Details
              </h3>
              <a
                href="https://rtionline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1"
              >
                <span>rtionline.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              
              {/* Ministry / Public Authority Select */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-orange-400" /> Ministry / Public Authority *
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold">Auto-Matched</span>
                </div>
                <select
                  value={formData.selectedMinistry}
                  onChange={(e) => setFormData({ ...formData, selectedMinistry: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {OFFICIAL_MINISTRIES.map((m, idx) => (
                    <option key={idx} value={m} className="bg-slate-900">{m}</option>
                  ))}
                </select>
              </div>

              {/* Applicant Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kushagra Chauhan"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">State / UT</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">District / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Bhusawal"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Address for Correspondence</label>
                <input
                  type="text"
                  placeholder="e.g. D-308, Mission Road, Krishna Colony"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Plain Language Query Input Header */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300">What information do you want to ask? *</label>
                  <button
                    type="button"
                    onClick={() => setShowAiAssistant(!showAiAssistant)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold hover:bg-orange-500/20 flex items-center gap-1 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    {showAiAssistant ? 'Hide AI Assistant' : '🤖 Ask AI Assistant'}
                  </button>
                </div>

                {/* AI Mini Chatbot Assistant */}
                {showAiAssistant && (
                  <RtiChatbotAssistant onApplyDraft={handleApplyDraftFromChatbot} />
                )}

                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue in simple words. E.g., What is the current processing status of my Ration Card application?"
                  value={formData.queryText}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              {/* Sample Prompts */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-orange-400" /> Try example questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleQueries.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-left"
                    >
                      {sample.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* BPL Exemption Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bplCheck"
                  checked={formData.bplStatus}
                  onChange={(e) => setFormData({ ...formData, bplStatus: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <label htmlFor="bplCheck" className="text-xs font-medium text-slate-300 cursor-pointer">
                  Is Applicant Below Poverty Line (BPL)? (Exempt from ₹10 Fee)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-500 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-5 h-5" /> Generate rtionline.gov.in Text
              </button>

            </form>
          </div>
        </div>

        {/* Generated Draft Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {generatedDraft ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col h-full justify-between">
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        rtionline.gov.in Compliant
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {generatedDraft.charCount} / 3000 Chars
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4 text-orange-400" />
                      {generatedDraft.department}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy for Portal'}
                    </button>
                    <button
                      onClick={() => downloadRtiPdf(generatedDraft, formData)}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" /> PDF
                    </button>
                  </div>
                </div>

                {/* Clean Section-Formatted RTI Text Content Box */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-[440px] overflow-y-auto leading-relaxed shadow-inner">
                  {generatedDraft.portalText}
                </div>
              </div>

              {/* Informative rtionline.gov.in Rules Checklist */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Official Portal Filling Rules (rtionline.gov.in):
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                  <li>Paste copied text into <strong>"Text for RTI Request application"</strong> column on portal.</li>
                  <li>Characters allowed: <code>A-Z, a-z, 0-9, and , . - _ ( ) / @ : & ? \ %</code> (Auto-sanitized above).</li>
                  <li>If uploading attachment PDF, filename MUST be <strong>under 12 alphanumeric characters with NO spaces</strong> (e.g. <code>RTI_1234.pdf</code>).</li>
                  <li>Do NOT upload Aadhaar Card or PAN Card (except BPL certificate if applicable).</li>
                </ul>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200">No Draft Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Select your target Ministry and type your question on the left. The agent will format a 3,000-character compliant text ready for <strong>rtionline.gov.in</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
