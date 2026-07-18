import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, Sparkles, User, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Copilot: React.FC = () => {
  const { chatHistory, sendCopilotQuery } = useApp();
  const [textToSend, setTextToSend] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const prompts = [
    "How will the boundary layer drop tomorrow impact Anand Vihar?",
    "What is the most cost-effective policy to reduce Delhi's PM2.5 today?",
    "Which construction sites are currently violating dust suppression rules?",
    "Suggest a routing plan to divert logistics cargo around chemical corridors."
  ];

  const handleSend = async (queryText: string) => {
    if (!queryText.trim()) return;
    setSending(true);
    try {
      await sendCopilotQuery(queryText);
      setTextToSend("");
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1400px] mx-auto h-[calc(100vh-72px)] font-sans bg-[#0f172a] text-[#cbd5e1]">
      
      {/* Intro Header */}
      <div className="border-b border-[#334155] pb-4 flex-shrink-0">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-neutral-450 animate-pulse" />
          <span>Explainable Causal AI Decision Copilot</span>
        </h2>
        <p className="text-xs text-[#9ca3af] mt-0.5">Augmented decision intelligence referencing live meteorological carrying capacity telemetry.</p>
      </div>

      <div className="flex-grow flex gap-6 min-h-0 overflow-hidden">
        
        {/* Left Side: Template Queries */}
        <div className="w-80 border border-[#334155] bg-[#111827] rounded-lg p-5 flex flex-col gap-4 flex-shrink-0 overflow-y-auto shadow-sm select-none">
          <h3 className="text-[10px] uppercase font-bold text-[#9ca3af] tracking-wider">Causal Templates</h3>
          <div className="flex flex-col gap-2">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSend(prompt)}
                disabled={sending}
                className="text-left text-xs font-semibold text-[#cbd5e1] hover:text-white p-3 rounded-lg border border-[#334155] hover:border-slate-500 hover:bg-[#0f172a] transition-all cursor-pointer leading-normal disabled:opacity-55"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Chat Area */}
        <div className="flex-grow flex flex-col border border-[#334155] bg-[#111827] rounded-lg min-w-0 shadow-sm relative overflow-hidden">
          
          {/* Scrollable logs */}
          <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 min-h-0">
            {chatHistory.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={index} className={`flex gap-3 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  {/* Avatar icon */}
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border ${
                    isUser ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0f172a] border-[#334155] text-slate-350'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                  </div>

                  {/* Bubble text */}
                  <div className={`p-4 rounded-lg text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-[#2563eb] text-white shadow-sm font-semibold' 
                      : 'bg-[#0f172a] border border-[#334155] text-[#cbd5e1] shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            
            {sending && (
              <div className="flex gap-3 max-w-[85%] self-start animate-pulse">
                <div className="w-8 h-8 rounded bg-[#0f172a] border border-[#334155] flex items-center justify-center text-gray-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-lg text-xs bg-[#0f172a] border border-[#334155] text-[#cbd5e1] font-semibold">
                  Analyzing spatial graphs...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Message input wrapper */}
          <div className="p-4 border-t border-[#334155] bg-[#111827] flex gap-3 items-center flex-shrink-0">
            <textarea
              rows={1}
              value={textToSend}
              disabled={sending}
              placeholder="Ask Copilot for causal twin recommendations..."
              onChange={(e) => setTextToSend(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(textToSend);
                }
              }}
              className="flex-grow bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-all resize-none min-h-[48px]"
            />
            <button
              onClick={() => handleSend(textToSend)}
              disabled={sending || !textToSend.trim()}
              className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow transition-all flex-shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
export default Copilot;
