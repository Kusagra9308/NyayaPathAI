import React, { useState } from 'react';
import { HeartHandshake, Bot, Send, User, CheckCircle2, Copy, Download, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';

export const GrievanceFormFiller = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste 🙏 I am your Conversational Form-Filler Agent. What public grievance or government service issue are you facing today? (E.g., "Electricity bill overcharged", "EPF withdrawal pending", "Sanitation issue in neighborhood")'
    }
  ]);

  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);

  const [grievanceData, setGrievanceData] = useState({
    category: '',
    department: '',
    incidentDate: '',
    details: '',
    referenceNo: '',
    desiredResolution: ''
  });

  const [completedDraft, setCompletedDraft] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsg = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      processBotStep(userText, step);
    }, 600);
  };

  const processBotStep = (userText, currentStep) => {
    let reply = '';
    let nextStep = currentStep + 1;

    if (currentStep === 1) {
      setGrievanceData(prev => ({ ...prev, category: userText, details: userText }));
      reply = `I understand your issue relates to "${userText}". To route this to CPGRAMS correctly, which government department or authority is involved? (E.g. Electricity Board, Municipal Corp, EPFO, Railways, Postal)`;
    } else if (currentStep === 2) {
      setGrievanceData(prev => ({ ...prev, department: userText }));
      reply = `Got it. Department: "${userText}". Do you have any prior application number, bill number, or reference ID regarding this issue? (If none, type "No")`;
    } else if (currentStep === 3) {
      setGrievanceData(prev => ({ ...prev, referenceNo: userText }));
      reply = `Thank you. Finally, what exact resolution are you seeking from the competent authority? (E.g., "Refund of ₹3,500 overcharge", "Disbursement of pending pension", "Immediate road repair")`;
    } else if (currentStep === 4) {
      setGrievanceData(prev => ({ ...prev, desiredResolution: userText }));
      reply = `Perfect! I have compiled your complete CPGRAMS Public Grievance Document. You can copy the structured draft below or download as PDF.`;
      
      const draft = generateCpgramsDraft({
        ...grievanceData,
        desiredResolution: userText
      });
      setCompletedDraft(draft);
    }

    setStep(nextStep);
    setMessages(prev => [
      ...prev,
      { id: (Date.now() + 1).toString(), sender: 'bot', text: reply }
    ]);
  };

  const generateCpgramsDraft = (data) => {
    return `PUBLIC GRIEVANCE REGISTRATION FORM (CPGRAMS COMPLIANT)

PORTAL: Centralized Public Grievance Redress and Monitoring System (pgportal.gov.in)

1. GRIEVANCE CATEGORY / SUBJECT:
   ${data.category}

2. MINISTRY / DEPARTMENT / COMPETENT AUTHORITY:
   ${data.department}

3. REFERENCE / COMPLAINT / BILL NUMBER (IF ANY):
   ${data.referenceNo}

4. DETAILED STATEMENT OF GRIEVANCE:
   The undersigned citizen is registering a formal grievance regarding ${data.details}. Despite previous representations, the matter remains unresolved, causing undue administrative hardship.

5. DESIRED RESOLUTION SOUGHT:
   ${data.desiredResolution}

6. CITIZEN DECLARATION:
   I hereby affirm that the facts stated above are true to the best of my knowledge and belief. I request the Public Grievance Officer to take immediate cognizance and resolve this grievance within the statutory 30-day timeline mandated by CPGRAMS guidelines.
`;
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

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: 'Namaste 🙏 I am your Conversational Form-Filler Agent. What public grievance or government service issue are you facing today?'
      }
    ]);
    setStep(1);
    setCompletedDraft(null);
    setGrievanceData({
      category: '',
      department: '',
      incidentDate: '',
      details: '',
      referenceNo: '',
      desiredResolution: ''
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* Conversational Chat Column */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[620px] shadow-2xl">
        
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Conversational Form-Filler</h3>
              <p className="text-xs text-slate-400">Step-by-Step Grievance Interviewer</p>
            </div>
          </div>

          <button
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
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-slate-800">
          <input
            type="text"
            value={input}
            disabled={step > 4}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step > 4 ? 'Form interview complete! Download your draft on right.' : 'Type your answer...'}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={step > 4 || !input.trim()}
            className="p-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Auto-Populated Output Column */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[620px] shadow-2xl">
        {completedDraft ? (
          <div className="space-y-4 flex flex-col h-full justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Auto-Populated CPGRAMS Form
                </span>
                <button
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-[420px] overflow-y-auto leading-relaxed">
                {completedDraft}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              💡 Direct Link: Submit this populated text on <strong>pgportal.gov.in</strong> under Public Grievance section.
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-6 text-slate-500">
            <HeartHandshake className="w-12 h-12 text-slate-700" />
            <h4 className="font-bold text-slate-300 text-sm">Waiting for Interview Completion</h4>
            <p className="text-xs max-w-xs">Answer the bot's questions on the left. Your formal CPGRAMS public grievance draft will auto-populate here in real time.</p>
          </div>
        )}
      </div>

    </div>
  );
};
