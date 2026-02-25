import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Quick suggestion chips ─── */
const SUGGESTIONS = [
    "What are Zeeshan's skills?",
    "Tell me about his JEE rank",
    "How to contact him?",
    "What projects has he done?",
];

/* ─── Typing indicator dots ─── */
function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            {[0, 0.18, 0.36].map((delay, i) => (
                <motion.span
                    key={i}
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#00d4ff' }}
                />
            ))}
        </div>
    );
}

/* ─── Single message bubble ─── */
function MessageBubble({ msg, isNew }) {
    const isAI = msg.role === 'ai';
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
        >
            {isAI && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #00d4ff, #7a5cff)', boxShadow: '0 0 12px rgba(0,212,255,0.4)' }}>
                    ⟡
                </div>
            )}
            <div
                className="max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={isAI ? {
                    background: 'rgba(0,212,255,0.07)',
                    border: '1px solid rgba(0,212,255,0.18)',
                    color: '#d1d9f0',
                    borderRadius: '4px 18px 18px 18px',
                    backdropFilter: 'blur(12px)',
                } : {
                    background: 'linear-gradient(135deg, #00d4ff22, #7a5cff22)',
                    border: '1px solid rgba(122,92,255,0.3)',
                    color: '#f0f4ff',
                    borderRadius: '18px 4px 18px 18px',
                }}
            >
                {msg.content}
            </div>
        </motion.div>
    );
}

/* ══ MAIN CHAT COMPONENT ══ */
const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hey! I'm Zeeshan's AI assistant 👋 Ask me anything about his education, skills, projects, or how to reach him!" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pulse, setPulse] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
    }, [isOpen]);

    // Periodic pulse on the button when closed
    useEffect(() => {
        if (isOpen) return;
        const t = setInterval(() => {
            setPulse(true);
            setTimeout(() => setPulse(false), 1200);
        }, 6000);
        return () => clearInterval(t);
    }, [isOpen]);

    const sendMessage = useCallback(async (text) => {
        const trimmed = text.trim();
        if (!trimmed || isTyping) return;

        const userMsg = { role: 'user', content: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Send history from the first user message onwards (Gemini needs history to start with 'user')
            const allMessages = messages.map(m => ({ role: m.role, content: m.content }));
            const firstUserIdx = allMessages.findIndex(m => m.role === 'user');
            const history = firstUserIdx > 0 ? allMessages.slice(firstUserIdx) : allMessages;
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, history }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "I can't connect to the server right now. Email Zeeshan directly at mdzeeshan08886@gmail.com 📧"
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [messages, isTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            {/* ── Toggle button ── */}
            <motion.button
                onClick={() => setIsOpen(o => !o)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                    background: isOpen
                        ? 'rgba(8,8,28,0.85)'
                        : 'linear-gradient(135deg, #00d4ff, #7a5cff)',
                    border: isOpen ? '1px solid rgba(0,212,255,0.4)' : 'none',
                    boxShadow: isOpen
                        ? '0 0 20px rgba(0,212,255,0.3)'
                        : '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(122,92,255,0.25)',
                }}
            >
                {/* Pulse ring */}
                {pulse && !isOpen && (
                    <motion.div
                        className="absolute inset-[-6px] rounded-full"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ background: 'rgba(0,212,255,0.3)' }}
                    />
                )}

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.svg
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-6 h-6"
                            style={{ color: '#00d4ff' }}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="chat"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-6 h-6 text-white"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* ── Chat window ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 20 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden"
                        style={{
                            width: 'min(360px, calc(100vw - 24px))',
                            height: 'clamp(420px, 65vh, 560px)',
                            background: 'rgba(5, 8, 20, 0.88)',
                            backdropFilter: 'blur(28px)',
                            WebkitBackdropFilter: 'blur(28px)',
                            border: '1px solid rgba(0,212,255,0.2)',
                            borderRadius: '20px',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08), 0 0 60px rgba(0,212,255,0.06)',
                        }}
                    >
                        {/* Top glow line */}
                        <div className="absolute top-0 left-8 right-8 h-[1px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6), rgba(122,92,255,0.4), transparent)' }} />

                        {/* ─ Header ─ */}
                        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
                            style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
                            {/* AI avatar */}
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm relative"
                                style={{ background: 'linear-gradient(135deg, #00d4ff, #7a5cff)', boxShadow: '0 0 16px rgba(0,212,255,0.5)' }}>
                                ⟡
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                                    style={{ background: '#00ffcc', borderColor: 'rgba(5,8,20,0.9)' }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold" style={{ color: '#f0f4ff' }}>Zeeshan AI</p>
                                <p className="text-[10px] font-mono" style={{ color: '#00ffcc' }}>
                                    ● Online · Portfolio Assistant
                                </p>
                            </div>
                            {/* Clear chat */}
                            <button
                                onClick={() => setMessages([{ role: 'ai', content: "Chat cleared! Ask me anything about Zeeshan 🚀" }])}
                                className="text-gray-600 hover:text-gray-400 transition-colors text-xs font-mono"
                                title="Clear chat"
                            >
                                clear
                            </button>
                        </div>

                        {/* ─ Messages ─ */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}>
                            {messages.map((msg, i) => (
                                <MessageBubble key={i} msg={msg} isNew={i === messages.length - 1} />
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-2"
                                >
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #00d4ff, #7a5cff)' }}>
                                        ⟡
                                    </div>
                                    <div style={{
                                        background: 'rgba(0,212,255,0.07)',
                                        border: '1px solid rgba(0,212,255,0.18)',
                                        borderRadius: '4px 18px 18px 18px',
                                    }}>
                                        <TypingDots />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─ Suggestion chips (only when no user messages yet) ─ */}
                        {messages.length === 1 && !isTyping && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="px-3 py-1 rounded-full text-[11px] font-mono transition-all hover:scale-105"
                                        style={{
                                            background: 'rgba(0,212,255,0.07)',
                                            border: '1px solid rgba(0,212,255,0.25)',
                                            color: '#7ecfee',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,212,255,0.14)';
                                            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
                                            e.currentTarget.style.color = '#00d4ff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,212,255,0.07)';
                                            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)';
                                            e.currentTarget.style.color = '#7ecfee';
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ─ Input ─ */}
                        <form onSubmit={handleSubmit}
                            className="px-4 pb-4 pt-3 flex gap-2 flex-shrink-0"
                            style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                disabled={isTyping}
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(0,212,255,0.18)',
                                    borderRadius: '12px',
                                    color: '#f0f4ff',
                                    fontSize: '13px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.25s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.18)'}
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, #00d4ff, #7a5cff)',
                                    boxShadow: '0 0 12px rgba(0,212,255,0.4)',
                                }}
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </motion.button>
                        </form>

                        {/* Bottom branding */}
                        <div className="pb-2 text-center">
                            <p className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.12)' }}>
                                Powered by Gemini AI
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chat;
