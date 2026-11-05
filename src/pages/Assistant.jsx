import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Send, Shield, Loader2, User, Bot, Sparkles } from "lucide-react";

import ReactMarkdown from "react-markdown";
import { db, isBase44Configured } from "@/api/base44Client";
import { answerLocally } from "@/lib/localCyberService";

const suggestedQuestions = [
  "Is this website safe? https://example.com",
  "Is this phone number a scam? +1-555-0123",
  "How do I recognize a phishing email?",
  "What are the signs of a fake website?",
  "Should I trust QR codes from strangers?",
  "Explain common WhatsApp scam tactics",
];

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm **CyberGuard AI**, your cybersecurity assistant. I can help you identify scams, analyze suspicious content, and provide security recommendations.\n\nHow can I help you stay safe today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      if (!isBase44Configured) {
        setMessages(prev => [...prev, { role: "assistant", content: answerLocally(userMessage) }]);
        return;
      }
      const conversationContext = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
      
      const response = await db.integrations.Core.InvokeLLM({
        prompt: `You are CyberGuard AI, an expert cybersecurity assistant. You help users identify scams, phishing attempts, malicious content, and provide actionable security advice. Be concise but thorough. Use markdown formatting for clarity. Always err on the side of caution — if something seems suspicious, warn the user.

Previous conversation:
${conversationContext}

User's question: ${userMessage}

Provide a helpful, security-focused response:`,
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: answerLocally(userMessage) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 flex-shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">AI-Powered Cybersecurity Chat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">CyberGuard AI Assistant</h1>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin pr-2">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 text-white"
                  : "glass text-slate-200"
              }`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown className="text-sm prose prose-sm prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-slate-400 text-sm">Analyzing...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex-shrink-0 mb-4">
            <p className="text-slate-500 text-xs mb-2 text-center">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 rounded-lg glass text-slate-400 text-xs hover:text-cyan-400 hover:border-cyan-500/20 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0 glass rounded-2xl p-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about cybersecurity threats..."
              className="flex-1 bg-transparent text-white placeholder:text-slate-600 text-sm px-4 py-3 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
