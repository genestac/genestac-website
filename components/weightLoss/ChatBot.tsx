"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! 👋 I'm here to help you. What is your name?",
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", condition: "" });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNewMessage(false);
      setShowGreeting(false);
    }
  }, [isOpen]);

  // Auto-show greeting after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowGreeting(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate typing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (step === 0) {
      setFormData((prev) => ({ ...prev, name: messageText }));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Nice to meet you, ${messageText}! Could you please provide your email address?` },
      ]);
      setStep(1);
      setIsLoading(false);
    } else if (step === 1) {
      setFormData((prev) => ({ ...prev, email: messageText }));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Thank you. What is your phone number?` },
      ]);
      setStep(2);
      setIsLoading(false);
    } else if (step === 2) {
      setFormData((prev) => ({ ...prev, phone: messageText }));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Do you have any specific medical conditions or diseases we should know about?` },
      ]);
      setStep(3);
      setIsLoading(false);
    } else if (step === 3) {
      const finalCondition = messageText;
      setFormData((prev) => ({ ...prev, condition: finalCondition }));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Submitting your information...` },
      ]);

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            condition: finalCondition,
            source: "chatbot",
          }),
        });

        if (res.ok) {
          setMessages((prev) => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = {
              role: "assistant",
              content: "Thank you for your reply! Our team will be in touch with you shortly. You can now ask me any questions you have about our programs!",
            };
            return newMsgs;
          });
        } else {
          throw new Error("Failed");
        }
      } catch (e) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = {
            role: "assistant",
            content: "Sorry, there was an error submitting your details. Please try again later.",
          };
          return newMsgs;
        });
      } finally {
        setStep(4);
        setIsLoading(false);
      }
    } else if (step >= 4) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            visitorId: formData.phone || "unknown",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply },
          ]);
        } else {
          throw new Error("Failed to get AI response");
        }
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I am having trouble connecting to the network right now." },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[9999] transition-all duration-500 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
        style={{ width: "min(380px, calc(100vw - 3rem))" }}
      >
        <div
          className="rounded-3xl overflow-hidden shadow-[0_25px_60px_-10px_rgba(12,74,110,0.35)] border border-slate-200/80 bg-white flex flex-col"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-900 to-brand-700 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-brand-900"></span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">
                  Genestac Assistant
                </p>
                <p className="text-brand-200 text-[10px] font-medium mt-0.5">
                  Always Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e2e8f0 transparent",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-brand-700 to-brand-900"
                      : "bg-slate-100 border border-slate-200"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-medium ${
                    msg.role === "assistant"
                      ? "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm"
                      : "bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-tr-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 shrink-0 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="px-4 pb-4 pt-2 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none font-medium disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trigger Area */}
      <div className="fixed bottom-12 right-6 z-[9999] flex flex-col items-end gap-3">
        {/* Doctor Avatar and Greeting */}
        {!isOpen && (
          <div className="relative flex items-end gap-3">
            {/* Auto-Greeting Bubble */}
            {showGreeting && (
              <div className="animate-float duration-1000 whitespace-nowrap pb-12">
                <div
                  className="bg-white text-slate-800 text-sm font-bold px-4 py-3 rounded-2xl rounded-br-sm shadow-[0_8px_30px_rgba(12,74,110,0.15)] border border-slate-100 flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="text-xl">👋</span> Hey, I am here to help you!
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGreeting(false);
                    }}
                    className="ml-2 w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div
              className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform shrink-0 bg-brand-100 relative"
              onClick={() => setIsOpen(true)}
            >
              <img
                src="/female-doctor-chat.png"
                alt="Support Doctor"
                className="w-full h-full object-cover"
              />
              {hasNewMessage && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[8px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative flex items-center justify-center cursor-pointer group hover:scale-105 active:scale-95 transition-all ${
            isOpen
              ? "w-14 h-14 rounded-2xl bg-slate-700 hover:bg-slate-800 shadow-[0_8px_30px_rgba(12,74,110,0.35)]"
              : "px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 shadow-glow btn-shine border border-brand-400/30"
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="flex items-center gap-2.5 text-white font-extrabold text-[15px] tracking-wide">
              <MessageCircle className="w-5 h-5 animate-pulse" />
              Chat with us
            </div>
          )}
        </button>
      </div>
    </>
  );
};
