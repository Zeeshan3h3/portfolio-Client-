import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const links = [
    { label: 'About', href: '#hero' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* Scroll Progress Bar */}
            <motion.div
                style={{
                    scaleX,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, #00d4ff, #7a5cff, #00ffcc)',
                    transformOrigin: '0%',
                    zIndex: 1000,
                    boxShadow: '0 0 12px rgba(0,212,255,0.6)',
                }}
            />

            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    paddingTop: scrolled ? '12px' : '20px',
                    paddingBottom: scrolled ? '12px' : '20px',
                    /* Always frosted/transparent */
                    background: scrolled
                        ? 'rgba(3, 7, 18, 0.75)'
                        : 'rgba(3, 7, 18, 0.35)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: scrolled ? '1px solid rgba(0,212,255,0.12)' : '1px solid transparent',
                    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.35)' : 'none',
                }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#hero" className="text-xl font-bold tracking-widest">
                        <span style={{ color: '#00d4ff' }}>MD</span>
                        <span style={{ color: '#f0f4ff' }}> ZEESHAN</span>
                    </a>

                    {/* Desktop Links */}
                    <ul className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="relative text-sm font-medium transition-colors group"
                                    style={{ color: '#b8c4e0' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#f0f4ff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#b8c4e0'}
                                >
                                    {link.label}
                                    <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                                        style={{ background: 'linear-gradient(90deg, #00d4ff, #7a5cff)', boxShadow: '0 0 6px rgba(0,212,255,0.6)' }} />
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Hire Me CTA */}
                    <a
                        href="#contact"
                        className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full relative overflow-hidden group"
                        style={{
                            background: 'linear-gradient(135deg, #00d4ff, #7a5cff)',
                            boxShadow: '0 0 18px rgba(0,212,255,0.35)',
                            color: '#fff',
                            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.65), 0 0 60px rgba(122,92,255,0.3)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 18px rgba(0,212,255,0.35)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }} />
                        <span className="relative z-10">Hire Me</span>
                    </a>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block h-0.5 w-6 transition-transform`}
                            style={{ background: '#f0f4ff', transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
                        <span className={`block h-0.5 w-6`}
                            style={{ background: '#f0f4ff', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
                        <span className={`block h-0.5 w-6 transition-transform`}
                            style={{ background: '#f0f4ff', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-2 mx-4 rounded-2xl p-6"
                        style={{
                            background: 'rgba(3, 7, 18, 0.88)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid rgba(0,212,255,0.15)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        }}
                    >
                        <ul className="flex flex-col gap-4">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        style={{ color: '#b8c4e0' }}
                                        className="font-medium transition-colors"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a
                                    href="#contact"
                                    className="block w-full text-center py-2 px-4 rounded-full font-semibold"
                                    style={{ background: 'linear-gradient(135deg, #00d4ff, #7a5cff)', color: '#fff' }}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Hire Me
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </motion.nav>
        </>
    );
};

export default Navbar;
