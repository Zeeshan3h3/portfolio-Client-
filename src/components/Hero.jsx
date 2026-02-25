import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const roles = ['Programmer', 'Content Creator', 'JEE Mentor', 'Video Editor'];

/* ── Icosahedron wireframe + ring + core ── */
function HolographicOrb() {
    const outerRef = useRef();
    const innerRef = useRef();
    const ringRef = useRef();
    const ring2Ref = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (outerRef.current) {
            outerRef.current.rotation.x = t * 0.18;
            outerRef.current.rotation.y = t * 0.3;
        }
        if (innerRef.current) {
            innerRef.current.rotation.y = -t * 0.25;
            innerRef.current.rotation.z = t * 0.12;
        }
        if (ringRef.current) {
            ringRef.current.rotation.z = t * 0.1;
            ringRef.current.rotation.x = 0.4;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.z = -t * 0.07;
            ring2Ref.current.rotation.y = 0.8;
        }
    });

    return (
        <>
            {/* Outer icosahedron wireframe */}
            <mesh ref={outerRef}>
                <icosahedronGeometry args={[2.1, 1]} />
                <meshStandardMaterial color="#030712" transparent opacity={0.04} />
                <Edges scale={1.001} threshold={5} color="#00d4ff" />
            </mesh>

            {/* Inner dodecahedron */}
            <mesh ref={innerRef}>
                <dodecahedronGeometry args={[1.3, 0]} />
                <meshStandardMaterial color="#000" transparent opacity={0} />
                <Edges color="#7a5cff" threshold={1} />
            </mesh>

            {/* Orbit ring 1 */}
            <mesh ref={ringRef}>
                <torusGeometry args={[2.6, 0.015, 8, 80]} />
                <meshStandardMaterial
                    color="#00d4ff"
                    emissive="#00d4ff"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Orbit ring 2 */}
            <mesh ref={ring2Ref}>
                <torusGeometry args={[3.1, 0.01, 8, 80]} />
                <meshStandardMaterial
                    color="#7a5cff"
                    emissive="#7a5cff"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.45}
                />
            </mesh>

            {/* Glowing core */}
            <mesh>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial
                    color="#00d4ff"
                    emissive="#00d4ff"
                    emissiveIntensity={4}
                    transparent
                    opacity={0.95}
                />
            </mesh>
        </>
    );
}

/* ── Orbiting particle dots around profile ── */
function OrbitingParticles({ count = 18 }) {
    const ref = useRef();
    const positions = useRef(
        Array.from({ length: count }, (_, i) => ({
            angle: (i / count) * Math.PI * 2,
            radius: 1.6 + Math.random() * 0.6,
            speed: 0.008 + Math.random() * 0.012,
            yOff: (Math.random() - 0.5) * 0.6,
        }))
    );

    useFrame(() => {
        positions.current.forEach((p, i) => {
            p.angle += p.speed;
            const el = ref.current?.children[i];
            if (el) {
                el.style.left = `calc(50% + ${Math.cos(p.angle) * p.radius * 50}px)`;
                el.style.top = `calc(50% + ${Math.sin(p.angle) * p.radius * 30}px)`;
            }
        });
    });

    return null; // handled via CSS in the component below
}

/* ── HUD counter ── */
function HudCounter({ label, value }) {
    const [displayed, setDisplayed] = useState(0);
    useEffect(() => {
        let f = 0;
        const step = () => {
            f += Math.ceil(value / 30);
            if (f >= value) { setDisplayed(value); return; }
            setDisplayed(f);
            requestAnimationFrame(step);
        };
        const t = setTimeout(step, 700);
        return () => clearTimeout(t);
    }, [value]);
    return (
        <div className="text-center">
            <p className="text-2xl font-bold tabular-nums" style={{ color: '#00d4ff' }}>{displayed.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{label}</p>
        </div>
    );
}

/* ══ HERO COMPONENT ══ */
const Hero = () => {
    const [roleIdx, setRoleIdx] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const profileRef = useRef(null);
    const containerRef = useRef(null);

    // Parallax scroll
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
    const yText = useTransform(scrollYProgress, [0, 1], [0, 130]);
    const yShape = useTransform(scrollYProgress, [0, 1], [0, -90]);
    const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
    const yTextSpring = useSpring(yText, { stiffness: 70, damping: 18 });
    const yShapeSpring = useSpring(yShape, { stiffness: 70, damping: 18 });

    // Typewriter
    useEffect(() => {
        const current = roles[roleIdx];
        let t;
        if (!deleting && displayed.length < current.length) {
            t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75);
        } else if (!deleting && displayed.length === current.length) {
            t = setTimeout(() => setDeleting(true), 2200);
        } else if (deleting && displayed.length > 0) {
            t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setRoleIdx((i) => (i + 1) % roles.length);
        }
        return () => clearTimeout(t);
    }, [displayed, deleting, roleIdx]);

    // 3D tilt on profile hover
    const handleProfileMove = useCallback((e) => {
        const rect = profileRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -12, y: x * 12 });
    }, []);

    const handleProfileLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

    return (
        <section ref={containerRef} id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">

            {/* Deep ambient nebula blobs */}
            <div className="absolute top-[-20%] left-[-15%] w-[800px] h-[800px] rounded-full z-0 animate-nebula"
                style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(100px)' }} />
            <div className="absolute bottom-[-20%] right-[-15%] w-[700px] h-[700px] rounded-full z-0 animate-nebula"
                style={{ animationDelay: '2s', background: 'radial-gradient(ellipse, rgba(122,92,255,0.07) 0%, transparent 70%)', filter: 'blur(100px)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full z-0"
                style={{ background: 'radial-gradient(ellipse, rgba(0,255,204,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />

            {/* HUD corner decorations */}
            <div className="absolute top-24 left-6 z-10 opacity-25">
                <div className="text-[10px] font-mono space-y-1" style={{ color: '#00d4ff' }}>
                    <div>SYS: ONLINE</div>
                    <div>LAT: 22.5726° N</div>
                    <div>LNG: 88.3639° E</div>
                </div>
            </div>
            <div className="absolute top-24 right-6 z-10 opacity-25 text-right">
                <div className="text-[10px] font-mono space-y-1" style={{ color: '#00ffcc' }}>
                    <div>STATUS: ACTIVE</div>
                    <div>BUILD: v3.0.0</div>
                    <div>UPTIME: ∞</div>
                </div>
            </div>

            {/* Scanning line */}
            <div className="absolute left-0 right-0 h-[1px] z-10 pointer-events-none overflow-hidden" style={{ top: '28%' }}>
                <motion.div
                    animate={{ x: ['-100%', '110%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 8 }}
                    className="h-full w-1/3"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-4">

                    {/* ── Left: Text ── */}
                    <motion.div
                        style={{ y: yTextSpring, opacity }}
                        className="flex-1 text-center md:text-left"
                    >
                        {/* Status badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
                            style={{
                                border: '1px solid rgba(0,255,204,0.3)',
                                background: 'rgba(0,255,204,0.05)',
                                color: '#00ffcc',
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00ffcc' }} />
                            <span className="text-xs font-semibold tracking-widest uppercase">Available for Opportunities</span>
                        </motion.div>

                        {/* Name with animated gradient + hologram flicker */}
                        <motion.h1
                            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl md:text-7xl font-black tracking-tight mb-3 leading-tight animate-hologram"
                        >
                            MD{' '}
                            <span className="relative inline-block">
                                <span
                                    className="bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage: 'linear-gradient(135deg, #00d4ff 0%, #7a5cff 50%, #00ffcc 100%)',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient-shift 4s ease infinite',
                                    }}
                                >
                                    ZEESHAN
                                </span>
                                {/* Underline glow */}
                                <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #00d4ff, #7a5cff, #00ffcc)', filter: 'blur(2px)' }} />
                            </span>
                        </motion.h1>

                        {/* Role typewriter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="flex items-center gap-2 justify-center md:justify-start mb-5"
                        >
                            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(0,212,255,0.5)' }}>Role:</span>
                            <h2 className="text-xl md:text-2xl font-bold font-mono" style={{ color: '#00ffcc' }}>
                                {displayed}
                                <span className="inline-block w-0.5 h-6 ml-0.5 animate-blink align-middle" style={{ background: '#00ffcc' }} />
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-500 italic text-base mb-8 max-w-md font-mono"
                        >
                            // "Rational Thinking Only"
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className="flex gap-8 justify-center md:justify-start mb-8 p-4 rounded-xl w-fit mx-auto md:mx-0"
                            style={{
                                border: '1px solid rgba(0,212,255,0.12)',
                                background: 'rgba(0,212,255,0.03)',
                                boxShadow: '0 0 20px rgba(0,212,255,0.05)',
                            }}
                        >
                            <HudCounter label="JEE Advanced Rank" value={9591} />
                            <div className="w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                            <HudCounter label="JEE Mains Rank" value={21571} />
                            <div className="w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                            <HudCounter label="YT Since" value={2022} />
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8"
                        >
                            {/* Primary – space energy */}
                            <a
                                href="#projects"
                                className="group relative px-8 py-3.5 text-white font-bold rounded-xl overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #00d4ff, #7a5cff)',
                                    boxShadow: '0 0 20px rgba(0,212,255,0.35), 0 0 40px rgba(122,92,255,0.15)',
                                    transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0,212,255,0.6), 0 0 70px rgba(122,92,255,0.3)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.35), 0 0 40px rgba(122,92,255,0.15)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                {/* Sweep shine */}
                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                                <span className="relative z-10 flex items-center gap-2">
                                    View My Work
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </a>

                            {/* Secondary – ghost border */}
                            <a
                                href="#contact"
                                className="px-8 py-3.5 font-bold rounded-xl transition-all duration-400 backdrop-blur-sm"
                                style={{
                                    border: '1px solid rgba(0,212,255,0.25)',
                                    color: '#fff',
                                    background: 'rgba(0,212,255,0.04)',
                                    transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)';
                                    e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)';
                                    e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Contact Me
                            </a>
                        </motion.div>

                        {/* Socials */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex gap-4 justify-center md:justify-start"
                        >
                            {[
                                {
                                    href: 'https://www.youtube.com/channel/UCkiJbacU_72kjE6z_w4aPAA',
                                    color: '#ef4444',
                                    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zm-13.9 9.4V8.4l6.3 3.6-6.3 3.6z" /></svg>,
                                    label: 'YouTube',
                                },
                                {
                                    href: 'https://www.linkedin.com/in/tipz-gaming-1431262a5/',
                                    color: '#00d4ff',
                                    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6C22 2.7 21.3 2 20.4 2zM8.9 18.9H6V9.4h2.9v9.5zM7.4 8.1c-.9 0-1.7-.7-1.7-1.7S6.5 4.7 7.4 4.7s1.7.7 1.7 1.7-.7 1.7-1.7 1.7zm11.5 10.8H16v-4.6c0-1.1 0-2.5-1.5-2.5S13 12.9 13 14.2v4.7h-2.9V9.4H13v1.3h.1c.4-.8 1.4-1.5 2.9-1.5 3.1 0 3.7 2 3.7 4.7v4.9h.2z" /></svg>,
                                    label: 'LinkedIn',
                                },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={s.label}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 transition-all hover:scale-110"
                                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = s.color;
                                        e.currentTarget.style.borderColor = `${s.color}50`;
                                        e.currentTarget.style.boxShadow = `0 0 15px ${s.color}40`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Profile ── */}
                    <motion.div
                        style={{ y: yShapeSpring, opacity }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-1 flex justify-center items-center relative"
                    >
                        <div
                            ref={profileRef}
                            onMouseMove={handleProfileMove}
                            onMouseLeave={handleProfileLeave}
                            className="relative w-72 h-72 md:w-[420px] md:h-[420px]"
                            style={{
                                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                                transition: tilt.x === 0 ? 'transform 0.8s cubic-bezier(0.22,1,0.36,1)' : 'none',
                            }}
                        >
                            {/* Outer orbit decorations */}
                            <div className="absolute inset-[-36px] rounded-full z-0"
                                style={{ border: '1px solid rgba(0,212,255,0.12)', animation: 'orbit-spin 30s linear infinite' }} />
                            <div className="absolute inset-[-56px] rounded-full z-0"
                                style={{ border: '1px solid rgba(122,92,255,0.08)', animation: 'orbit-spin 45s linear infinite reverse' }} />

                            {/* 3D Canvas (icosahedron behind profile) */}
                            <div className="absolute inset-[-70px] z-0 opacity-70">
                                <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }} dpr={[1, 2]}>
                                    <ambientLight intensity={0.3} />
                                    <pointLight position={[4, 4, 4]} intensity={3} color="#00d4ff" />
                                    <pointLight position={[-4, -4, 4]} intensity={2} color="#7a5cff" />
                                    <pointLight position={[0, 0, 6]} intensity={1} color="#00ffcc" />
                                    <HolographicOrb />
                                </Canvas>
                            </div>

                            {/* Rimlight glow backdrop */}
                            <div className="absolute inset-0 rounded-full z-0 animate-pulse-glow"
                                style={{
                                    background: 'radial-gradient(ellipse, rgba(0,212,255,0.2) 0%, rgba(122,92,255,0.15) 40%, transparent 70%)',
                                    filter: 'blur(20px)',
                                }} />

                            {/* Profile image */}
                            <img
                                src="/image.jpg"
                                alt="MD ZEESHAN"
                                className="w-full h-full object-cover rounded-full relative z-10 shadow-2xl"
                                style={{
                                    border: '2px solid rgba(0,212,255,0.25)',
                                    boxShadow: '0 0 40px rgba(0,212,255,0.2), 0 0 80px rgba(122,92,255,0.1), inset 0 0 30px rgba(0,212,255,0.05)',
                                }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400/030712/00d4ff?text=MZ'; }}
                            />

                            {/* Orbiting glow dots (CSS) */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full z-20"
                                    style={{
                                        background: i % 2 === 0 ? '#00d4ff' : '#7a5cff',
                                        boxShadow: `0 0 8px ${i % 2 === 0 ? '#00d4ff' : '#7a5cff'}`,
                                        animation: `orbit-spin ${8 + i * 2}s linear infinite${i % 2 ? ' reverse' : ''}`,
                                        transformOrigin: `${110 + i * 15}px center`,
                                        left: '50%',
                                        top: '50%',
                                        marginLeft: '-4px',
                                        marginTop: '-4px',
                                    }}
                                />
                            ))}

                            {/* Floating badge - JEE AIR */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                                className="absolute -bottom-5 -right-4 z-20 hud-border backdrop-blur-xl rounded-xl px-4 py-2 shadow-xl"
                                style={{
                                    background: 'rgba(3,7,18,0.92)',
                                    border: '1px solid rgba(0,212,255,0.2)',
                                    boxShadow: '0 0 20px rgba(0,212,255,0.1)',
                                }}
                            >
                                <p className="text-[10px] text-gray-500 font-mono">JEE_ADV</p>
                                <p className="text-sm font-bold font-mono" style={{ color: '#00d4ff' }}>AIR: 9591 🏆</p>
                            </motion.div>

                            {/* Floating badge - Institution */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
                                className="absolute -top-5 -left-4 z-20 hud-border backdrop-blur-xl rounded-xl px-4 py-2 shadow-xl"
                                style={{
                                    background: 'rgba(3,7,18,0.92)',
                                    border: '1px solid rgba(0,255,204,0.2)',
                                    boxShadow: '0 0 20px rgba(0,255,204,0.1)',
                                }}
                            >
                                <p className="text-[10px] text-gray-500 font-mono">INSTITUTION</p>
                                <p className="text-sm font-bold font-mono" style={{ color: '#00ffcc' }}>JU_IT 🎓</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden flex items-center"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                    <div className="animate-ticker flex gap-16 text-[10px] text-gray-600 font-mono whitespace-nowrap select-none">
                        {Array(6).fill(['⟡ PROGRAMMER', '⟡ CONTENT CREATOR', '⟡ JEE MENTOR', '⟡ VIDEO EDITOR', '⟡ JADAVPUR UNIVERSITY']).flat().map((t, i) => (
                            <span key={i}>{t}</span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: 'rgba(0,212,255,0.4)' }}>SCROLL</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="w-px h-10"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.6), transparent)' }}
                />
            </motion.div>
        </section>
    );
};

export default Hero;
