import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { FitnessPlan } from '../types/fitness';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

interface CoachPanelProps {
  plan: FitnessPlan;
  initialQuestion?: string;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({ plan, initialQuestion }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'coach',
      text: `Hey there! I'm Coach Buddy, your AI sports science and conditioning mentor. I've reviewed your active plan ("${plan.planTitle}"). How can I help fine-tune your workouts, form, or nutrition today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick question suggestions
  const suggestedQuestions = [
    'What should I eat 60 mins before Day 1?',
    'How do I warm up stiff hips before squats?',
    'What should I do if my gym is packed during Day 2?',
    'Can I add extra abs or cardio on rest days?',
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ask-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          plan,
        }),
      });

      if (!res.ok) {
        throw new Error('Coach is temporarily resting. Please try asking again.');
      }

      const data = await res.json();
      const coachMsg: Message = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'coach',
        text: data.reply || 'Let us keep up the consistent effort! Consistency beats intensity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to get answer from Coach.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col h-[750px] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">Coach Buddy AI</h3>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Plan Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Expert advice grounded in your current {plan.splitType} routine
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <div className="text-[11px] font-mono text-slate-400">Calibrated for</div>
          <div className="text-xs font-semibold text-slate-200">{plan.userProfile?.fitnessGoal || 'Hypertrophy'}</div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 border border-slate-700 text-emerald-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[10px] mt-1.5 font-mono ${
                  msg.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Coach Buddy is analyzing biomechanics and nutrition...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Try asking:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Coach Buddy about workouts, exercise tweaks, warmups, or macros..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
