import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, Info, RefreshCw } from 'lucide-react';
import { AI_SUGGESTED_QUESTIONS } from '../data/demoData';
import { AlertBanner } from '../components/UI';

const INITIAL_MESSAGE = {
  id: 'init',
  role: 'assistant',
  content: `Hello! I'm **CivicAssist AI**, your public service guide. I can help you with:

• 📄 Understanding government service procedures
• 📋 Required documents for applications
• 🏛 Finding the right department or portal
• 📝 How to file a grievance or complaint

**Please note:** I am a demo AI assistant and am not connected to any live government databases. My responses are for informational purposes only.

What would you like to know today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  sources: [],
};

const DEMO_RESPONSES = {
  'aadhaar': `## Aadhaar Card Services

**To apply for a new Aadhaar card:**
1. Visit your nearest Aadhaar Enrollment Center (find one at uidai.gov.in)
2. Fill the enrollment form
3. Provide biometrics (fingerprints + iris scan)
4. Submit proof of identity, address, and date of birth
5. Receive acknowledgment slip; card delivered in ~90 days

**Common documents accepted:**
- Identity: Passport, PAN, Voter ID
- Address: Utility bill, bank statement, rental agreement
- DOB: Birth certificate, PAN card, school certificate

**Online services:** You can update address/mobile/email at myaadhaar.uidai.gov.in

⚠️ *This information is for guidance only and may not reflect the latest UIDAI policies.*`,

  'passport': `## Passport Application Guide

**Fresh Passport (Normal):**
- Visit passportindia.gov.in → Register → Fill Form → Book PSK appointment
- Bring originals + photocopies of all documents
- Processing: 30–45 days | Fee: ₹1,500 (36pp) / ₹2,000 (60pp)

**Tatkal Passport:**
- Same process with Tatkal fee (+₹2,000)
- Processing: 3–7 days

**Required documents:**
- Proof of Identity (Aadhaar preferred)
- Proof of Address
- Proof of Date of Birth
- Recent passport-size photos

**Track status:** passportindia.gov.in/AppOnlineProject/statusTracker

⚠️ *Fees and processing times are approximate and subject to change.*`,

  'tax': `## Income Tax Return (ITR) Filing

**Steps to file ITR online:**
1. Login at incometax.gov.in using your PAN
2. Go to "File Income Tax Return"
3. Choose the assessment year
4. Select the correct ITR form (ITR-1 for salary income)
5. Fill in pre-filled data and add missing details
6. Add deductions (80C, 80D, HRA, etc.)
7. Verify using Aadhaar OTP, Net Banking, or DSC

**Common ITR Forms:**
- **ITR-1 (Sahaj):** Salary + one house + other income < ₹50L
- **ITR-2:** Multiple houses, capital gains
- **ITR-4 (Sugam):** Presumptive business income

**Refund:** Typically credited within 20–45 days of e-verification

⚠️ *Consult a tax professional for complex tax situations.*`,

  'default': `I understand you're asking about a government service. While I'm a demo assistant without live data access, here are some general steps to help you:

1. **Identify the department** responsible for this service (Central, State, or Municipal)
2. **Visit the official portal** — most central services are on india.gov.in
3. **Check document requirements** on the department's FAQ page
4. **Use DigiLocker** (digilocker.gov.in) to store and share verified documents
5. **Contact the helpline** if you face issues — each department has a toll-free number

For specific guidance, try the official UMANG app which aggregates 1,000+ government services.

⚠️ *For accurate and up-to-date information, always refer to official government websites.*`,
};

function getResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('aadhaar') || q.includes('uid') || q.includes('uidai')) return DEMO_RESPONSES.aadhaar;
  if (q.includes('passport') || q.includes('psk') || q.includes('visa')) return DEMO_RESPONSES.passport;
  if (q.includes('tax') || q.includes('itr') || q.includes('income')) return DEMO_RESPONSES.tax;
  return DEMO_RESPONSES.default;
}

function MessageBubble({ msg }) {
  const isAI = msg.role === 'assistant';

  // Simple markdown-like renderer
  const renderContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-slate-800 text-base mb-2 mt-3 first:mt-0">{line.replace('## ', '')}</h3>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-slate-700 my-1">{line.replace(/\*\*/g, '')}</p>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm text-slate-600 list-disc">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</li>;
      if (line.match(/^\d\./)) return <li key={i} className="ml-4 text-sm text-slate-600 list-decimal">{line.replace(/^\d\./, '').replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</li>;
      if (line.startsWith('•')) return <li key={i} className="ml-4 text-sm text-slate-600">{line.replace('• ', '')}</li>;
      if (line.startsWith('⚠️')) return <p key={i} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-2">{line}</p>;
      if (line === '') return <br key={i} />;
      // inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-sm text-slate-700 leading-relaxed">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'} animate-fade-in`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? 'bg-blue-600' : 'bg-slate-200'}`}>
        {isAI ? <Bot size={15} className="text-white" /> : <User size={15} className="text-slate-600" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isAI ? 'bg-white border border-slate-100 shadow-sm rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
        {isAI ? (
          <div className="space-y-0.5">{renderContent(msg.content)}</div>
        ) : (
          <p className="text-sm">{msg.content}</p>
        )}
        <p className={`text-[10px] mt-2 ${isAI ? 'text-slate-400' : 'text-blue-200'}`}>{msg.timestamp}</p>
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['uidai.gov.in', 'india.gov.in', 'passportindia.gov.in'],
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#0a1628] text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg">AI Assistant</h1>
                <p className="text-xs text-blue-300">Ask about any government service or procedure</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              id="chat-reset-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors"
            >
              <RefreshCw size={12} /> New Chat
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
        {/* Demo notice */}
        <AlertBanner type="warning">
          <strong>Demo AI:</strong> This assistant uses pre-written responses for common topics. It is <em>not</em> connected to any live AI or government database. Do not rely on this for official advice.
        </AlertBanner>

        {/* Suggested Questions */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Suggested Questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {AI_SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-lg transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about any government service..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <Info size={10} /> Responses are pre-scripted demos. Always verify with official government sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
