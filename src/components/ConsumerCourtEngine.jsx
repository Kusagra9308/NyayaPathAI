import React, { useState } from 'react';
import { Gavel, Sparkles, Download, Copy, Check, Info, Building2, HelpCircle, ShieldCheck, ExternalLink, Bot, DollarSign, FileCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import { CONSUMER_DISPUTE_TYPES, generateConsumerPetitionText } from '../utils/consumerCourtData';
import { callGroqAi } from '../services/groqApi';

export const ConsumerCourtEngine = () => {
  const [formData, setFormData] = useState({
    complainantName: '',
    complainantPhone: '',
    complainantEmail: '',
    complainantAddress: '',
    state: 'Maharashtra',
    district: 'Mumbai',
    oppositePartyName: '',
    oppositePartyAddress: '',
    disputeType: 'e_commerce',
    invoiceNo: '',
    purchaseDate: '',
    productPrice: 15000,
    agonyCompensation: 10000,
    litigationCosts: 5000,
    factsSummary: ''
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [generatedPetition, setGeneratedPetition] = useState(null);
  const [copied, setCopied] = useState(false);

  const totalClaim = Number(formData.productPrice || 0) + Number(formData.agonyCompensation || 0) + Number(formData.litigationCosts || 0);

  const handleRefineWithAi = async () => {
    let sourceText = formData.factsSummary.trim();
    if (!sourceText) {
      sourceText = `Purchased product worth Rs. ${formData.productPrice} from ${formData.oppositePartyName || 'Opposite Party'}. Item stopped working within warranty period and seller refused 100% refund.`;
      setFormData(prev => ({ ...prev, factsSummary: sourceText }));
    }

    if (aiLoading) return;
    setAiLoading(true);

    try {
      const systemPrompt = `You are NyayaPath AI, an expert Consumer Law advocate under Consumer Protection Act 2019. 
Refine the citizen's factual statement into a formal, legally structured petition paragraph suitable for e-Daakhil (edaakhil.nic.in). Cite relevant provisions of Consumer Protection Act 2019.`;

      const prompt = `Facts: "${sourceText}". Claim Amount: Rs. ${formData.productPrice}. Opposite Party: "${formData.oppositePartyName || 'Opposite Party'}".`;

      const refined = await callGroqAi({
        prompt,
        systemPrompt,
        model: 'groq/compound-mini'
      });

      if (refined) {
        setFormData(prev => ({
          ...prev,
          factsSummary: refined.trim()
        }));
      }
    } catch (e) {
      console.warn('AI Refine fallback active:', e);
      const fallbackRefined = `The Complainant purchased goods/services for Rs. ${formData.productPrice}/- from the Opposite Party. The Opposite Party committed statutory deficiency of service under Section 2(11) of the Consumer Protection Act 2019 by failing to resolve the grievance: "${sourceText}".`;
      setFormData(prev => ({
        ...prev,
        factsSummary: fallbackRefined
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const petitionText = generateConsumerPetitionText(formData);
    setGeneratedPetition(petitionText);
  };

  const handleCopy = () => {
    if (!generatedPetition) return;
    navigator.clipboard.writeText(generatedPetition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!generatedPetition) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION', 15, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(generatedPetition, 180);
    doc.text(lines, 15, 28);
    doc.save(`eDaakhil_Consumer_Petition_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Consumer Protection Act 2019 • edaakhil.nic.in
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Consumer Court e-Daakhil Petition Engine
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Formats your consumer grievance into an official Section 35 Complaint Petition ready for online filing on <strong>e-Daakhil (edaakhil.nic.in)</strong> with itemized quantum claims.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
       
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" /> Complaint Details &amp; Quantum Claim
              </h3>
              <a
                href="https://edaakhil.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>edaakhil.nic.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              
             // find dispute category
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Dispute Type / Category *</label>
                <select
                  value={formData.disputeType}
                  onChange={(e) => setFormData({ ...formData, disputeType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {CONSUMER_DISPUTE_TYPES.map((dt) => (
                    <option key={dt.id} value={dt.id} className="bg-slate-900">{dt.title}</option>
                  ))}
                </select>
              </div>

             // complaint details
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Complainant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kushagra Chauhan"
                    value={formData.complainantName}
                    onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.complainantPhone}
                    onChange={(e) => setFormData({ ...formData, complainantPhone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

             // opposite party details 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Opposite Party / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABC E-Commerce Pvt Ltd"
                    value={formData.oppositePartyName}
                    onChange={(e) => setFormData({ ...formData, oppositePartyName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Invoice / Order Ref No.</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-998822"
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Itemized Monetary Claim Breakdown:
                </span>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold">Product Refund (₹)</label>
                    <input
                      type="number"
                      value={formData.productPrice}
                      onChange={(e) => setFormData({ ...formData, productPrice: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold">Mental Agony (₹)</label>
                    <input
                      type="number"
                      value={formData.agonyCompensation}
                      onChange={(e) => setFormData({ ...formData, agonyCompensation: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold">Litigation Cost (₹)</label>
                    <input
                      type="number"
                      value={formData.litigationCosts}
                      onChange={(e) => setFormData({ ...formData, litigationCosts: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-300 font-bold">Total Claim Target:</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">₹{totalClaim.toLocaleString('en-IN')}</span>
                </div>
              </div>

              // ai refiner 
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Statement of Facts &amp; Deficiency Summary *</label>
                  <button
                    type="button"
                    onClick={handleRefineWithAi}
                    disabled={aiLoading}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/20 disabled:opacity-40 flex items-center gap-1 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    {aiLoading ? 'AI Legal Refiner Thinking...' : '🤖 Refine Facts with AI'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Describe what went wrong. E.g. Purchased smartphone worth Rs. 15,000 on 12th Jan. Device turned off automatically within 3 days. Service center refused repair despite 1-year warranty."
                  value={formData.factsSummary}
                  onChange={(e) => setFormData({ ...formData, factsSummary: e.target.value })}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-500 text-white font-extrabold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-5 h-5" /> Generate e-Daakhil Petition Draft
              </button>

            </form>
          </div>
        </div>

       // output 
        <div className="lg:col-span-6 space-y-6">
          {generatedPetition ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col h-full justify-between">
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      edaakhil.nic.in Compliant
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Section 35 Consumer Complaint Petition
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy Petition'}
                    </button>
                    <button
                      onClick={handleDownloadPdf}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" /> PDF
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-[440px] overflow-y-auto leading-relaxed shadow-inner">
                  {generatedPetition}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Submission Checklist for e-Daakhil Portal:
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                  <li>Log in to <strong>edaakhil.nic.in</strong> with Aadhaar / Mobile OTP.</li>
                  <li>Paste copied text under <strong>"Complaint Petition &amp; Relief Claimed"</strong> tab.</li>
                  <li>Attach scanned copies of Invoice / Cash Memo &amp; WhatsApp / Email proof as PDF.</li>
                </ul>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                <Gavel className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200">No Petition Drafted Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Fill in your dispute details, itemized monetary claim, and facts on the left to generate an official Consumer Petition for <strong>edaakhil.nic.in</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
