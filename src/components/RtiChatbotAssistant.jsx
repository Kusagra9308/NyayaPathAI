import React, { useState, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Key, ArrowRight, Loader2, Trash2 } from 'lucide-react';
import { callGroqAi } from '../services/groqApi';
import { detectMinistryForQuery } from '../utils/rtiGenerator';

const DEFAULT_MESSAGES = [
  {
    id: '1',
    sender: 'bot',
    text: 'Namaste! I am your NyayaPath AI Assistant 🤖. Tell me your civic problem in plain words (e.g., "Ration card delayed", "Road repair incomplete", "PF money not credited"). I will ask you 1-2 quick questions and draft the exact RTI query & match the Ministry for you!'
  }
];

export const RtiChatbotAssistant = ({ onApplyDraft }) => {
  const [groqApiKey, setGroqApiKey] = useState(
    localStorage.getItem('GROQ_API_KEY') || import.meta.env.VITE_GROQ_API_KEY || ''
  );
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(groqApiKey);

  // Client-side persistent chat memory
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('NYAYAPATH_GROQ_CHAT_MEMORY');
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch (e) {
      return DEFAULT_MESSAGES;
    }
  });

  const [draftedResult, setDraftedResult] = useState(() => {
    try {
      const saved = localStorage.getItem('NYAYAPATH_GROQ_CHAT_DRAFT');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('NYAYAPATH_GROQ_CHAT_MEMORY', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Auto-save drafted result to localStorage
  useEffect(() => {
    if (draftedResult) {
      try {
        localStorage.setItem('NYAYAPATH_GROQ_CHAT_DRAFT', JSON.stringify(draftedResult));
      } catch (e) {}
    }
  }, [draftedResult]);

  const handleSaveKey = (e) => {
    if (e) e.preventDefault();
    localStorage.setItem('GROQ_API_KEY', tempKey.trim());
    setGroqApiKey(tempKey.trim());
    setShowKeyModal(false);
  };

  const handleClearMemory = () => {
    localStorage.removeItem('NYAYAPATH_GROQ_CHAT_MEMORY');
    localStorage.removeItem('NYAYAPATH_GROQ_CHAT_DRAFT');
    setMessages(DEFAULT_MESSAGES);
    setDraftedResult(null);
  };

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
      const conversationHistory = [...messages, userMsg].map(m => `${m.sender === 'user' ? 'Citizen' : 'AI Assistant'}: ${m.text}`).join('\n');
      
      const systemPrompt = `You are NyayaPath AI, an expert Indian legal assistant. 
Goal: Interview the citizen to construct a precise, legally structured RTI query under Section 6(1) of RTI Act 2005.
Guidelines:
1. If details are missing (location, date, ref number), ask 1 short follow-up question.
2. If enough details are provided, output a final JSON block with "draftQuery" and "detectedMinistry".
Format JSON at the end if ready:
\`\`\`json
{
  "ready": true,
  "draftQuery": "...",
  "detectedMinistry": "..."
}
\`\`\``;

      const aiResponseText = await callGroqAi({
        apiKey: groqApiKey,
        prompt: conversationHistory,
        systemPrompt,
        model: 'groq/compound-mini'
      });

      let currentDraftResult = null;

      const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)\s*```/) || aiResponseText.match(/\{[\s\S]*"ready"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          if (parsed.ready && parsed.draftQuery) {
            currentDraftResult = {
              queryText: parsed.draftQuery,
              ministry: parsed.detectedMinistry || detectMinistryForQuery(parsed.draftQuery)
            };
            setDraftedResult(currentDraftResult);
          }
        } catch (e) {}
      }

      const cleanAiReply = aiResponseText.replace(/```json[\s\S]*?```/g, '').trim();

      if (!currentDraftResult && !draftedResult) {
        const autoMinistry = detectMinistryForQuery(userText);
        currentDraftResult = {
          queryText: `What is the current official processing status, reasons for delay, and names of officers responsible regarding: "${userText}"? Please provide certified copies of all file notings.`,
          ministry: autoMinistry
        };
        setDraftedResult(currentDraftResult);
      }

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: cleanAiReply || 'I have drafted your RTI query!' }
      ]);
    } catch (err) {
      console.error('Chatbot Error:', err);
      
      const autoMinistry = detectMinistryForQuery(userText);
      const fallbackDraft = `What is the current official processing status, reasons for delay, and names of officers responsible regarding: "${userText}"? Please provide certified copies of all file notings.`;
      
      setDraftedResult({
        queryText: fallbackDraft,
        ministry: autoMinistry
      });

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `I have analyzed your query! Auto-Matched Ministry: "${autoMinistry}". Click "Apply to Form" below to populate your application.`
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

  const handleApply = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!draftedResult) return;
    onApplyDraft(draftedResult.queryText, draftedResult.ministry);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              AI Query Assistant <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <p className="text-[10px] text-slate-400">Powered by NyayaPath Legal Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearMemory}
            title="Clear Chat Memory"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-all text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowKeyModal(!showKeyModal)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
              groqApiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3 h-3" />
            {groqApiKey ? 'AI Engine Active ✓' : 'AI API Key'}
          </button>
        </div>
      </div>

      {/* API Key Drawer/Input */}
      {showKeyModal && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 animate-fade-in">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Key className="w-3 h-3 text-orange-400" /> Enter Custom AI API Key
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="API Key..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
            <button
              type="button"
              onClick={handleSaveKey}
              className="px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-lg hover:bg-orange-600"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Chat messages box */}
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 max-h-56 overflow-y-auto space-y-2.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              m.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-orange-400'
            }`}>
              {m.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
            </div>

            <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed max-w-[85%] ${
              m.sender === 'user'
                ? 'bg-orange-500/10 border border-orange-500/30 text-white rounded-tr-none'
                : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> NyayaPath AI is thinking...
          </div>
        )}
      </div>

      {/* Chat input container */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Assistant to help draft your RTI query..."
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Apply Drafted Result Button */}
      {draftedResult && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400">RTI Draft &amp; Ministry Ready</span>
            <p className="text-[11px] text-slate-300 font-medium truncate max-w-xs">{draftedResult.ministry}</p>
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-md transition-all flex-shrink-0"
          >
            <span>Apply to Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
