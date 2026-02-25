import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const projects = [
    {
        num: '01',
        title: 'YouTube Channel',
        description: 'Guidance and strategy for JEE Exams. Providing resources and mentorship to thousands of students across India through in-depth content.',
        tags: ['Content Creation', 'Mentorship', 'Education'],
        link: 'https://www.youtube.com/channel/UCkiJbacU_72kjE6z_w4aPAA',
        linkText: 'Visit Channel',
        accent: '#ff6b6b',
        glow: 'rgba(255,107,107,0.2)',
    },
    {
        num: '02',
        title: 'JEE Mentorship Program',
        description: 'Active mentoring offering personalized guidance, mock test analysis, and battle-tested strategies for JEE aspirants.',
        tags: ['Leadership', 'Communication', 'Planning'],
        link: '#',
        linkText: 'Ongoing',
        accent: '#00d4ff',
        glow: 'rgba(0,212,255,0.2)',
    },
    {
        num: '03',
        title: 'Portfolio Website',
        description: 'A premium MERN-stack portfolio with Three.js 3D scenes, Framer Motion scroll animations, anti-gravity space UI, and Node.js backend.',
        tags: ['React', 'Three.js', 'Node', 'MongoDB'],
        link: '#',
        linkText: 'You Are Here',
        accent: '#00ffcc',
        glow: 'rgba(0,255,204,0.2)',
    },
    {
        num: '04',
        title: 'Editing Internship',
        description: 'Paid video editing internship utilizing DaVinci Resolve and Adobe Premiere Pro for professional-grade production work.',
        tags: ['DaVinci Resolve', 'Premiere Pro', 'Video Editing'],
        link: '#',
        linkText: 'Ongoing',
        accent: '#b794ff',
        glow: 'rgba(183,148,255,0.2)',
    },
];

function ProjectCard({ project, index, inView }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 });
        setGlowPos({ x: `${x * 100}%`, y: `${y * 100}%` });
    };

    const directions = [
        { initial: { opacity: 0, x: -70, filter: 'blur(8px)' } },
        { initial: { opacity: 0, x: 70, filter: 'blur(8px)' } },
        { initial: { opacity: 0, x: -70, filter: 'blur(8px)' } },
        { initial: { opacity: 0, x: 70, filter: 'blur(8px)' } },
    ];

    return (
        <motion.div
            initial={directions[index].initial}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
            onMouseEnter={() => setHovered(true)}
            className="relative group rounded-2xl p-7 overflow-hidden cursor-pointer"
            style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? '-8px' : '0'})`,
                transition: tilt.x === 0 ? 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' : 'none',
                /* Glassmorphism */
                background: 'rgba(8, 8, 28, 0.55)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${hovered ? project.accent + '55' : project.accent + '25'}`,
                boxShadow: hovered
                    ? `0 20px 60px ${project.glow}, 0 0 0 1px ${project.accent}18, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                animation: `anti-gravity-float ${6 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.8}s`,
            }}
        >
            {/* Mouse follow spotlight */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(300px circle at ${glowPos.x} ${glowPos.y}, ${project.accent}12, transparent 70%)` }} />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${project.accent}90, transparent)` }} />

            {/* Left accent bar on hover */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-[2px] origin-top"
                style={{ background: `linear-gradient(to bottom, ${project.accent}, transparent)` }}
                initial={{ scaleY: 0 }}
                whileHover={{ scaleY: 1 }}
                transition={{ duration: 0.4 }}
            />

            {/* Large faint number */}
            <span className="absolute top-3 right-5 text-6xl font-black select-none leading-none"
                style={{ color: `${project.accent}10` }}>
                {project.num}
            </span>

            {/* Status dot */}
            <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: project.accent, boxShadow: `0 0 8px ${project.accent}` }} />
                <span className="text-[9px] font-mono tracking-widest uppercase font-semibold"
                    style={{ color: project.accent }}>
                    {project.linkText === 'Ongoing' ? 'LIVE' : project.linkText === 'You Are Here' ? 'CURRENT' : 'ACTIVE'}
                </span>
            </div>

            <h3 className="text-lg font-bold mb-3 pr-12" style={{ color: '#f0f4ff' }}>{project.title}</h3>
            <p className="text-sm leading-relaxed mb-5 font-mono" style={{ color: '#94a3c0' }}>{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg border"
                        style={{
                            background: `${project.accent}12`,
                            borderColor: `${project.accent}35`,
                            color: project.accent,
                        }}>
                        {tag}
                    </span>
                ))}
            </div>

            <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold group/link transition-colors"
                style={{ color: `${project.accent}80` }}
                onMouseEnter={(e) => e.currentTarget.style.color = project.accent}
                onMouseLeave={(e) => e.currentTarget.style.color = `${project.accent}80`}
            >
                {`> ${project.linkText}`}
                <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </motion.div>
    );
}

const Projects = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <section id="projects" className="py-28 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full z-0"
                style={{ background: 'radial-gradient(ellipse, rgba(0,255,204,0.06) 0%, transparent 70%)', filter: 'blur(120px)' }} />
            <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full z-0"
                style={{ background: 'radial-gradient(ellipse, rgba(122,92,255,0.06) 0%, transparent 70%)', filter: 'blur(120px)' }} />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="text-[10px] font-mono tracking-[0.4em] uppercase mb-2"
                        style={{ color: 'rgba(183,148,255,0.7)' }}
                    >
                        ◈ Module 03
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                        transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-6xl font-black leading-none"
                        style={{ color: '#f0f4ff' }}
                    >
                        PROJECT
                        <br />
                        <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #b794ff, #00d4ff)' }}>
                            Archive
                        </span>
                    </motion.h2>
                    <div className="flex items-center gap-3 justify-center mt-6">
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(183,148,255,0.5))' }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: '#b794ff', boxShadow: '0 0 10px rgba(183,148,255,0.7)' }} />
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(270deg, transparent, rgba(183,148,255,0.5))' }} />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {projects.map((project, i) => (
                        <ProjectCard key={project.num} project={project} index={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
