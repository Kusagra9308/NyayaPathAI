import React, { useState } from 'react';
import { FileText, Sparkles, Download, Copy, Check, Info, Building2, HelpCircle } from 'lucide-react';
import { generateRtiDraft, downloadRtiPdf } from '../utils/rtiGenerator';

export const RtiDraftingAgent = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    address: '',
    phone: '',
    email: '',
    state: 'Delhi (NCT)',
    city: 'New Delhi',
    queryText: '',
    specificDetails: '',
    bplStatus: false,
    bplCardNo: ''
  });

  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const sampleQueries = [
    'Why is the road repair in Ward 12 delayed for 8 months?',
    'What is the current processing status of my Ration Card application?',
    'Provide certified water quality test reports for my locality over last 3 months',
    'Details of funds allocated and spent on street light maintenance in my area'
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.queryText.trim()) return;
    const draft = generateRtiDraft(formData);
    setGeneratedDraft(draft);
  };

  const handleCopy = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft.fullText);
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
            <Sparkles className="w-3.5 h-3.5" /> Plain Language to Legal RTI Converter
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Right to Information (RTI) Drafting Agent
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Convert any plain-English or vernacular query into a formally formatted RTI Application under Section 6(1) of the RTI Act 2005. Automatically routes your query to the designated Public Information Officer (PIO) and formats statutory questions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" /> Enter Application Details
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              
              {/* Applicant Name & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
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
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Green Enclave, Sector 12"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Plain Language Query Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300">What information do you want to ask? *</label>
                  <span className="text-[11px] text-orange-400">Plain English / Hindi</span>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue in simple words. E.g., The road construction near Ward 12 has been incomplete for 8 months. I want to know contractor name, budget sanctioned, and reason for delay."
                  value={formData.queryText}
                  onChange={(e) => setFormData({ ...formData, queryText: e.target.value })}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
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
                      onClick={() => setFormData({ ...formData, queryText: sample })}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-left"
                    >
                      {sample}
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
                  Below Poverty Line (BPL) Applicant (Exempt from ₹10 Fee)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-500 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-5 h-5" /> Generate Section 6(1) RTI Draft
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
                    <span className="text-[11px] uppercase tracking-wider font-bold text-orange-400">Target Department</span>
                    <h4 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      {generatedDraft.department}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy Text'}
                    </button>
                    <button
                      onClick={() => downloadRtiPdf(generatedDraft, formData)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>

                {/* RTI Text Content Box */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-[480px] overflow-y-auto leading-relaxed shadow-inner">
                  {generatedDraft.fullText}
                </div>
              </div>

              {/* Informative Submission Guide */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" /> How to Submit Your Application
                </div>
                <p className="text-amber-300/80">
                  1. Download PDF or print this draft.<br />
                  2. Attach ₹10 Court Fee Stamp or Indian Postal Order (IPO) payable to PIO.<br />
                  3. Send via Speed Post to the PIO address or submit online at <strong>rtionline.gov.in</strong>.
                </p>
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
                  Fill out your query on the left form and click "Generate Section 6(1) RTI Draft" to auto-route and format your application.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
