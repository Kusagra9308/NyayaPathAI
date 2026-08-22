import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Key, Check, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { callGroqAi } from '../services/groqApi';
import { detectMinistryForQuery } from '../utils/rtiGenerator';

export const RtiChatbotAssistant = ({ onApplyDraft }) => {
  const [groqApiKey, setGroqApiKey] = useState(
    localStorage.getItem('GROQ_API_KEY') || import.meta.env.VITE_GROQ_API_KEY || ''
  );
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(groqApiKey);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste! I am your Groq AI Assistant 🤖 (llama-3.3-70b-versatile). Tell me your civic problem in plain words (e.g., "Ration card delayed", "Road repair incomplete", "PF money not credited"). I will ask you 1-2 quick questions and draft the exact RTI query & match the Ministry for you!'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftedResult, setDraftedResult] = useState(null);

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('GROQ_API_KEY', tempKey.trim());
    setGroqApiKey(tempKey.trim());
    setShowKeyModal(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Groq API call using llama-3.3-70b-versatile
      const conversationHistory = [...messages, userMsg].map(m => `${m.sender === 'user' ? 'Citizen' : 'AI Assistant'}: ${m.text}`).join('\n');
      
      const systemPrompt = `You are NyayaPath AI, an expert Indian legal assistant powered by Groq (llama-3.3-70b-versatile). 
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
        systemPrompt
      });

      // Check if AI generated ready JSON
      const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)\s*```/) || aiResponseText.match(/\{[\s\S]*"ready"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          if (parsed.ready && parsed.draftQuery) {
            setDraftedResult({
              queryText: parsed.draftQuery,
              ministry: parsed.detectedMinistry || detectMinistryForQuery(parsed.draftQuery)
            });
          }
        } catch (e) {
          // Ignore JSON parse error
        }
      }

      const cleanAiReply = aiResponseText.replace(/```json[\s\S]*?```/g, '').trim();

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: cleanAiReply || 'Here is your drafted RTI query!' }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `⚠️ Groq API Note: ${err.message || 'Unable to connect to Groq'}.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
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
              Groq AI Query Assistant <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <p className="text-[10px] text-slate-400">Powered by Groq LLM (llama-3.3-70b-versatile)</p>
          </div>
        </div>

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
          {groqApiKey ? 'Groq Key Active ✓' : 'Add Groq Key'}
        </button>
      </div>

      {/* Groq Key Drawer/Input */}
      {showKeyModal && (
        <form onSubmit={handleSaveKey} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 animate-fade-in">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Key className="w-3 h-3 text-orange-400" /> Enter Custom Groq API Key (gsk_...)
            </label>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-orange-400 hover:underline"
            >
              Get Free Groq Key ↗
            </a>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="gsk_..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-lg hover:bg-orange-600"
            >
              Save Key
            </button>
          </div>
        </form>
      )}

      {/* Chat messages box */}
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 max-h-48 overflow-y-auto space-y-2.5">
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
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Groq LLM (llama-3.3-70b-versatile) is thinking...
          </div>
        )}
      </div>

      {/* Chat input box */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Groq AI to help draft your RTI query..."
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

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
