import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const eduData = [
    {
        year: '2023 – Now',
        title: 'B.E. in Information Technology',
        institution: 'Jadavpur University',
        detail: "Currently Pursuing — India's Top Engineering College",
        icon: '🎓',
        accent: '#00d4ff',
        tag: 'ACTIVE',
        isActive: true,
    },
    {
        year: '2023',
        title: 'JEE Mains & Advanced',
        institution: 'Competitive Examinations',
        detail: 'Mains Rank: 21,571  ·  Advanced Rank: 9,591',
        icon: '🏆',
        accent: '#00ffcc',
        tag: 'CLEARED',
    },
    {
        year: '2021',
        title: 'Class 12 — CBSE',
        institution: 'Higher Secondary',
        detail: '84% — PCM Stream',
        icon: '📖',
        accent: '#7a5cff',
        tag: 'COMPLETED',
    },
    {
        year: '2019',
        title: 'Class 10 — CBSE',
        institution: 'Secondary School',
        detail: '86% — All Subjects',
        icon: '📚',
        accent: '#a78bfa',
        tag: 'COMPLETED',
    },
];

function EduCard({ item }) {
    return (
        <div
            className="hud-border relative rounded-xl p-5 group"
            style={{
                background: 'rgba(8, 8, 28, 0.58)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${item.accent}28`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = `${item.accent}55`;
                e.currentTarget.style.boxShadow = `0 20px 60px ${item.accent}18, 0 0 0 1px ${item.accent}18, inset 0 1px 0 rgba(255,255,255,0.06)`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = `${item.accent}28`;
                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)';
            }}
        >
            {/* Accent top bar */}
            <div className="absolute top-0 left-6 right-6 h-[1px] rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${item.accent}80, transparent)` }} />

            {/* Tag */}
            <span className="text-[9px] font-mono px-2 py-0.5 rounded border mb-3 inline-block font-semibold"
                style={{ color: item.accent, borderColor: `${item.accent}45`, background: `${item.accent}15` }}>
                {item.tag}
            </span>
            {item.isActive && (
                <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-mono" style={{ color: item.accent }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.accent }} />
                    LIVE
                </span>
            )}

            <h3 className="text-base font-bold mb-1 leading-snug" style={{ color: '#f0f4ff' }}>{item.title}</h3>
            <p className="text-sm font-semibold mb-2" style={{ color: item.accent }}>{item.institution}</p>
            <p className="text-xs font-mono" style={{ color: '#94a3c0' }}>{item.detail}</p>
        </div>
    );
}

function TimelineCard({ item, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const isLeft = index % 2 === 0;

    return (
        <div ref={ref} className="relative flex items-center mb-16">
            {/* Desktop alternating layout */}
            <div className="hidden md:flex w-full items-start gap-0">
                {/* Left slot */}
                <div className={`flex-1 pr-14 ${isLeft ? 'flex justify-end' : ''}`}>
                    {isLeft && (
                        <motion.div
                            initial={{ opacity: 0, x: -80, filter: 'blur(6px)' }}
                            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-sm"
                        >
                            <EduCard item={item} />
                        </motion.div>
                    )}
                </div>

                {/* Center — node */}
                <div className="flex-shrink-0 flex flex-col items-center relative">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.15 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl z-20 relative"
                        style={{
                            background: '#030712',
                            border: `2px solid ${item.accent}60`,
                            boxShadow: `0 0 20px ${item.accent}50, 0 0 40px ${item.accent}20`,
                            animation: 'anti-gravity-float 4s ease-in-out infinite',
                            animationDelay: `${index * 0.5}s`,
                        }}
                    >
                        {item.icon}
                        {/* Orbit ring around active */}
                        {item.isActive && (
                            <div className="absolute inset-[-8px] rounded-full"
                                style={{
                                    border: `1px solid ${item.accent}40`,
                                    animation: 'orbit-spin 4s linear infinite',
                                }} />
                        )}
                    </motion.div>
                    <span className="text-[10px] text-gray-600 font-mono mt-2 whitespace-nowrap">{item.year}</span>
                </div>

                {/* Right slot */}
                <div className={`flex-1 pl-14 ${!isLeft ? 'flex justify-start' : ''}`}>
                    {!isLeft && (
                        <motion.div
                            initial={{ opacity: 0, x: 80, filter: 'blur(6px)' }}
                            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-sm"
                        >
                            <EduCard item={item} />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Mobile */}
            <motion.div
                initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
                animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden w-full flex gap-4"
            >
                <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 mt-1"
                    style={{ color: item.accent, borderColor: `${item.accent}50`, background: '#030712' }}>
                    {item.icon}
                </div>
                <EduCard item={item} />
            </motion.div>
        </div>
    );
}

const Education = () => {
    const sectionRef = useRef(null);
    const headRef = useRef(null);
    const headInView = useInView(headRef, { once: true });
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const lineScaleY = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

    return (
        <section id="education" ref={sectionRef} className="py-28 relative overflow-hidden">
            {/* Nebula blob */}
            <div className="absolute top-0 left-0 w-[500px] h-[400px] rounded-full z-0"
                style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }} />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <motion.div
                    ref={headRef}
                    initial={{ opacity: 0 }}
                    animate={headInView ? { opacity: 1 } : {}}
                    className="text-center mb-20"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={headInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="text-[10px] font-mono tracking-[0.4em] uppercase mb-2"
                        style={{ color: 'rgba(0,212,255,0.5)' }}
                    >
                        ◈ Module 01
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                        animate={headInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                        transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-6xl font-black text-white leading-none"
                    >
                        EDUCATION
                        <br />
                        <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7a5cff)' }}>
                            Log
                        </span>
                    </motion.h2>
                    <div className="flex items-center gap-3 justify-center mt-6">
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5))' }} />
                        <div className="w-2 h-2 rounded-full animate-beam"
                            style={{ background: '#00d4ff' }} />
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(270deg, transparent, rgba(0,212,255,0.5))' }} />
                    </div>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-5xl mx-auto relative">
                    {/* Glowing vertical beam */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-0 overflow-hidden">
                        {/* Faint base line */}
                        <div className="w-full h-full" style={{ background: 'rgba(0,212,255,0.05)' }} />
                        {/* Scroll-driven glow beam */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 bottom-0"
                            style={{
                                scaleY: lineScaleY,
                                originY: 0,
                                background: 'linear-gradient(to bottom, #00d4ff, #7a5cff, #00ffcc)',
                                boxShadow: '0 0 12px rgba(0,212,255,0.6)',
                                filter: 'blur(0.5px)',
                            }}
                        />
                    </div>

                    {eduData.map((item, i) => (
                        <TimelineCard key={i} item={item} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
