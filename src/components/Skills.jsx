import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const skillGroups = [
    {
        category: 'Programming',
        code: 'SYS::PROG',
        icon: '⌨',
        accent: '#00d4ff',
        bg: 'rgba(0,212,255,0.05)',
        border: 'rgba(0,212,255,0.18)',
        glow: 'rgba(0,212,255,0.2)',
        skills: [
            { name: 'Python', level: 40 },
            { name: 'HTML / CSS', level: 60 },
            { name: 'JavaScript', level: 35 },
            { name: 'React', level: 30 },
        ],
    },
    {
        category: 'Creative & Video',
        code: 'SYS::CREATE',
        icon: '◈',
        accent: '#00ffcc',
        bg: 'rgba(0,255,204,0.05)',
        border: 'rgba(0,255,204,0.18)',
        glow: 'rgba(0,255,204,0.2)',
        skills: [
            { name: 'DaVinci Resolve', level: 80 },
            { name: 'Premiere Pro', level: 75 },
            { name: 'YouTube Content', level: 85 },
            { name: 'Scriptwriting', level: 70 },
        ],
    },
    {
        category: 'Soft Skills',
        code: 'SYS::SOFT',
        icon: '⟡',
        accent: '#7a5cff',
        bg: 'rgba(122,92,255,0.05)',
        border: 'rgba(122,92,255,0.18)',
        glow: 'rgba(122,92,255,0.2)',
        skills: [
            { name: 'Problem Solving', level: 90 },
            { name: 'Communication', level: 85 },
            { name: 'Analytical Thinking', level: 88 },
            { name: 'Leadership', level: 75 },
        ],
    },
];

function TiltCard({ group, inView, delay, floatDelay }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 });
        setGlowPos({ x: `${x * 100}%`, y: `${y * 100}%` });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
            onMouseEnter={() => setHovered(true)}
            style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? '-8px' : '0'})`,
                transition: tilt.x === 0 ? 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' : 'none',
                /* Glassmorphism */
                background: 'rgba(8, 8, 28, 0.55)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${hovered ? group.accent + '55' : group.border}`,
                boxShadow: hovered
                    ? `0 20px 60px ${group.glow}, 0 0 0 1px ${group.accent}20, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                animation: `anti-gravity-float ${5 + floatDelay}s ease-in-out infinite`,
                animationDelay: `${floatDelay * 0.7}s`,
            }}
            className="relative rounded-2xl p-7 overflow-hidden"
        >
            {/* Mouse glow */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(260px circle at ${glowPos.x} ${glowPos.y}, ${group.accent}14, transparent 70%)` }} />

            {/* Top accent strip */}
            <div className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${group.accent}90, transparent)` }} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${group.accent}18`, color: group.accent, border: `1px solid ${group.accent}35` }}>
                    {group.icon}
                </span>
                <div>
                    <p className="text-[9px] font-mono tracking-widest mb-0.5" style={{ color: `${group.accent}90` }}>{group.code}</p>
                    <h3 className="text-base font-bold" style={{ color: '#f0f4ff' }}>{group.category}</h3>
                </div>
            </div>

            {/* Skills bars */}
            <div className="space-y-4">
                {group.skills.map((skill, i) => (
                    <div key={skill.name}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-medium font-mono" style={{ color: '#d1d9f0' }}>{skill.name}</span>
                            <span className="font-mono font-semibold" style={{ color: group.accent }}>{skill.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            {inView && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1.3, ease: 'easeOut', delay: delay + i * 0.1 + 0.35 }}
                                    className="h-full rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${group.accent}99, ${group.accent})`,
                                        boxShadow: `0 0 10px ${group.accent}70`,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

const Skills = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="skills" className="py-28 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full z-0"
                style={{ background: 'radial-gradient(ellipse, rgba(122,92,255,0.08) 0%, transparent 70%)', filter: 'blur(120px)' }} />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="text-[10px] font-mono tracking-[0.4em] uppercase mb-2"
                        style={{ color: 'rgba(0,255,204,0.6)' }}
                    >
                        ◈ Module 02
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                        transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-6xl font-black leading-none"
                        style={{ color: '#f0f4ff' }}
                    >
                        SKILL
                        <br />
                        <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #00ffcc, #00d4ff)' }}>
                            Matrix
                        </span>
                    </motion.h2>
                    <div className="flex items-center gap-3 justify-center mt-6">
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.5))' }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: '#00ffcc', boxShadow: '0 0 10px rgba(0,255,204,0.7)' }} />
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(270deg, transparent, rgba(0,255,204,0.5))' }} />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {skillGroups.map((group, i) => (
                        <TiltCard key={group.category} group={group} inView={inView} delay={i * 0.15} floatDelay={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
