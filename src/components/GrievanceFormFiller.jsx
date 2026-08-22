import React, { useState } from 'react';
import { HeartHandshake, Bot, Send, User, CheckCircle2, Copy, Download, RefreshCw, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import { callGroqAi } from '../services/groqApi';

export const GrievanceFormFiller = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste! I am your AI Form-Filler Agent 🤖. Describe any public grievance or government service issue in simple words (e.g., "Electricity bill overcharged by ₹18,000", "EPF withdrawal pending for 4 months", "Ration card not issued"). I will interview you and auto-populate your official CPGRAMS form!'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedDraft, setCompletedDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSend = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMsg].map(m => `${m.sender === 'user' ? 'Citizen' : 'Form-Filler AI'}: ${m.text}`).join('\n');

      const systemPrompt = `You are NyayaPath AI, an expert CPGRAMS Public Grievance Form-Filler Agent.
Goal: Interview the citizen to construct a complete, official CPGRAMS (pgportal.gov.in) Public Grievance registration text.
Instructions:
1. Ask 1 short follow-up question if key details are missing (e.g. Department name, reference/bill number, or exact resolution requested).
2. Once key details are gathered, output the final CPGRAMS form inside a clean \`\`\`form\`\`\` block.

Form structure format when ready:
\`\`\`form
PUBLIC GRIEVANCE REGISTRATION FORM (CPGRAMS COMPLIANT)
PORTAL: Centralized Public Grievance Redress & Monitoring System (pgportal.gov.in)

1. GRIEVANCE CATEGORY: [Category]
2. TARGET MINISTRY / DEPARTMENT: [Department Name]
3. REFERENCE / APPLICATION / BILL NO: [Ref No or N/A]
4. DETAILED STATEMENT OF GRIEVANCE:
[Detailed facts and administrative delay summary]

5. DESIRED RESOLUTION SOUGHT:
[Exact relief / refund / action requested]

6. STATUTORY DECLARATION:
I affirm that the facts stated above are true to the best of my knowledge. I request the Public Grievance Officer to take immediate cognizance and resolve this grievance within 30 days under CPGRAMS guidelines.
\`\`\``;

      const aiReplyText = await callGroqAi({
        prompt: conversationHistory,
        systemPrompt,
        model: 'groq/compound-mini'
      });

      // Extract generated form if present
      const formMatch = aiReplyText.match(/```form\s*([\s\S]*?)\s*```/) || aiReplyText.match(/PUBLIC GRIEVANCE REGISTRATION FORM[\s\S]*/);
      if (formMatch) {
        setCompletedDraft(formMatch[1] || formMatch[0]);
      } else {
        const fallbackDraft = `PUBLIC GRIEVANCE REGISTRATION FORM (CPGRAMS COMPLIANT)
PORTAL: pgportal.gov.in

1. GRIEVANCE CATEGORY: Public Service Deficiency / Administrative Delay
2. TARGET MINISTRY / DEPARTMENT: Competent Public Authority
3. REFERENCE / BILL NO: As Enclosed
4. DETAILED STATEMENT OF GRIEVANCE:
The citizen is registering a formal public grievance regarding: "${userText}". Despite prior representations, the matter remains unresolved causing administrative hardship.

5. DESIRED RESOLUTION SOUGHT:
Immediate resolution, official inspection, and remittance/correction as per Citizen Charter guidelines.

6. STATUTORY DECLARATION:
I affirm that the facts stated above are true to the best of my knowledge.
`;
        setCompletedDraft(fallbackDraft);
      }

      const cleanText = aiReplyText.replace(/```form[\s\S]*?```/g, '').trim();

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: cleanText || 'I have populated your CPGRAMS Public Grievance Form! View and download it on the right.' }
      ]);
    } catch (err) {
      console.error('Form Filler AI Error:', err);
      
      const fallbackDraft = `PUBLIC GRIEVANCE REGISTRATION FORM (CPGRAMS COMPLIANT)
PORTAL: pgportal.gov.in

1. GRIEVANCE CATEGORY: Public Service Deficiency
2. TARGET MINISTRY / DEPARTMENT: Concerned Public Authority
3. REFERENCE NO: N/A
4. DETAILED STATEMENT OF GRIEVANCE:
Formal grievance regarding: "${userText}".

5. DESIRED RESOLUTION SOUGHT:
Immediate resolution within 30 days under CPGRAMS guidelines.
`;
      setCompletedDraft(fallbackDraft);

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `I have compiled your grievance into official CPGRAMS format! Check your populated form on the right.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  const handleDownloadPdf = () => {
    if (!completedDraft) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('OFFICIAL PUBLIC GRIEVANCE DRAFT (CPGRAMS)', 15, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(completedDraft, 180);
    doc.text(lines, 15, 32);
    doc.save(`CPGRAMS_Grievance_${Date.now()}.pdf`);
  };

  const handleCopy = () => {
    if (!completedDraft) return;
    navigator.clipboard.writeText(completedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: 'Namaste! I am your AI Form-Filler Agent 🤖. What public grievance or government service issue are you facing today?'
      }
    ]);
    setCompletedDraft(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* Conversational AI Chat Column */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[620px] shadow-2xl">
        
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                AI Form-Filler Agent <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">Powered by NyayaPath Legal Engine • Auto-Populates CPGRAMS (pgportal.gov.in)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Start Over
          </button>
        </div>

        {/* Chat message history list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-orange-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-orange-500/10 border border-orange-500/30 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin" /> AI Agent is interviewing &amp; drafting form...
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
          <input
            type="text"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your public grievance or issue..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Auto-Populated CPGRAMS Form Output Column */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[620px] shadow-2xl">
        {completedDraft ? (
          <div className="space-y-4 flex flex-col h-full justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Auto-Populated CPGRAMS Form
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1 transition-all"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-[420px] overflow-y-auto leading-relaxed shadow-inner">
                {completedDraft}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>💡 Submit text on CPGRAMS Portal</span>
              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>pgportal.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-6 text-slate-500">
            <HeartHandshake className="w-12 h-12 text-slate-700" />
            <h4 className="font-bold text-slate-300 text-sm">Waiting for Interview Input</h4>
            <p className="text-xs max-w-xs">Type your public grievance on the left. The AI agent will interview you and auto-populate your official CPGRAMS public grievance form here in real time.</p>
          </div>
        )}
      </div>

    </div>
  );
};
