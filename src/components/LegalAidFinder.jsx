import React, { useState } from 'react';
import { Scale, Sparkles, Download, Copy, Check, Info, ShieldCheck, ExternalLink, Bot, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { NALSA_ELIGIBILITY_CATEGORIES, checkNalsaEligibility, generateDlsaApplicationText } from '../utils/legalAidData';
import { callGroqAi } from '../services/groqApi';

export const LegalAidFinder = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    email: '',
    gender: 'Female',
    age: '28',
    applicantAddress: '',
    state: 'Maharashtra',
    district: 'Mumbai',
    category: 'woman_child',
    annualIncome: 120000,
    caseDetails: ''
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [generatedApplication, setGeneratedApplication] = useState(null);
  const [copied, setCopied] = useState(false);

  const eligibility = checkNalsaEligibility(formData.category, formData.annualIncome);

  const handleRefineCaseWithAi = async () => {
    let sourceText = formData.caseDetails.trim();
    if (!sourceText) {
      sourceText = "Landlord evicted me illegally without returning security deposit of Rs 25,000 despite 30 days notice.";
      setFormData(prev => ({ ...prev, caseDetails: sourceText }));
    }

    if (aiLoading) return;
    setAiLoading(true);

    try {
      const systemPrompt = `You are NyayaPath AI, an expert NALSA Legal Aid Advocate. 
Refine the citizen's legal issue into a clear, structured summary paragraph for assignment of a free DLSA advocate under Section 12 of NALSA Act 1987. Citing relevant statutory provisions.`;

      const prompt = `Legal Problem: "${sourceText}". Category: "${formData.category}". District: "${formData.district}".`;

      const refined = await callGroqAi({
        prompt,
        systemPrompt,
        model: 'groq/compound-mini'
      });

      if (refined) {
        setFormData(prev => ({
          ...prev,
          caseDetails: refined.trim()
        }));
      }
    } catch (e) {
      console.warn('AI Case Refine fallback active:', e);
      const catObj = NALSA_ELIGIBILITY_CATEGORIES.find(c => c.id === formData.category);
      const fallbackRefined = `The Applicant requires urgent legal representation regarding: "${sourceText}". The matter involves statutory infringement under ${catObj?.section || 'NALSA Act 1987'}, requiring formal legal notice, representation in competent court, and recovery of rightful dues.`;
      setFormData(prev => ({
        ...prev,
        caseDetails: fallbackRefined
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const appText = generateDlsaApplicationText(formData, eligibility);
    setGeneratedApplication(appText);
  };

  const handleCopy = () => {
    if (!generatedApplication) return;
    navigator.clipboard.writeText(generatedApplication);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!generatedApplication) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('DISTRICT LEGAL SERVICES AUTHORITY (DLSA) APPLICATION', 15, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(generatedApplication, 180);
    doc.text(lines, 15, 28);
    doc.save(`DLSA_Free_Legal_Aid_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Section 12 NALSA Act 1987 • 100% Free Assigned Lawyer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Free Legal Aid &amp; NALSA Advocate Finder
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Evaluates your statutory entitlement for a <strong>100% Free Court-Assigned Lawyer</strong> under Section 12 of NALSA Act 1987 and auto-drafts your application to the District Legal Services Authority (DLSA).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" /> Applicant Profile &amp; Eligibility
              </h3>
              <a
                href="https://nalsa.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>nalsa.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              
              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Statutory Entitlement Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {NALSA_ELIGIBILITY_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">{c.label} ({c.section})</option>
                  ))}
                </select>
              </div>

              {/* Income & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Annual Family Income (₹)</label>
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">District / City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Statutory Eligibility Result Badge */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                eligibility.eligible
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                    {eligibility.eligible ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                    Statutory Verdict:
                  </span>
                  <span className="text-xs font-bold font-mono">
                    {eligibility.eligible ? '🟢 100% FREE LAWYER ENTITLED' : '🟡 LEGAL CLINIC COUNSEL'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{eligibility.reason}</p>
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
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Case Details & AI Refiner */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Describe Your Legal Case / Dispute *</label>
                  <button
                    type="button"
                    onClick={handleRefineCaseWithAi}
                    disabled={aiLoading}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold hover:bg-purple-500/20 disabled:opacity-40 flex items-center gap-1 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    {aiLoading ? 'AI Summarizer Thinking...' : '🤖 Refine Case with AI'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Describe your legal matter in simple words. E.g., Landlord evicted me illegally without returning security deposit, or Employer terminated me without paying 3 months salary."
                  value={formData.caseDetails}
                  onChange={(e) => setFormData({ ...formData, caseDetails: e.target.value })}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-5 h-5" /> Generate DLSA Legal Aid Application
              </button>

            </form>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {generatedApplication ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col h-full justify-between">
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      DLSA Portal &amp; Court Front-Office Ready
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Free Legal Aid Advocate Application
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy Application'}
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
                  {generatedApplication}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> How to Submit Application to DLSA:
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                  <li>Visit the <strong>District Legal Services Authority (DLSA) Front Office</strong> inside your local District Court Complex.</li>
                  <li>Hand over this printed PDF along with ID proof (Aadhaar/Voter ID) and income certificate if applicable.</li>
                  <li>A panel advocate will be assigned to your case at <strong>100% Zero Cost</strong>.</li>
                </ul>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200">No Application Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Fill in your profile and case details on the left to evaluate Section 12 NALSA eligibility and generate your free lawyer assignment application.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
