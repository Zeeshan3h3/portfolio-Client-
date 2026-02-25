import React from 'react';
import { motion } from 'framer-motion';

const socials = [
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/channel/UCkiJbacU_72kjE6z_w4aPAA',
        hoverColor: '#ef4444',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zm-13.9 9.4V8.4l6.3 3.6-6.3 3.6z" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/tipz-gaming-1431262a5/',
        hoverColor: '#00d4ff',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6C22 2.7 21.3 2 20.4 2zM8.9 18.9H6V9.4h2.9v9.5zM7.4 8.1c-.9 0-1.7-.7-1.7-1.7S6.5 4.7 7.4 4.7s1.7.7 1.7 1.7-.7 1.7-1.7 1.7zm11.5 10.8H16v-4.6c0-1.1 0-2.5-1.5-2.5S13 12.9 13 14.2v4.7h-2.9V9.4H13v1.3h.1c.4-.8 1.4-1.5 2.9-1.5 3.1 0 3.7 2 3.7 4.7v4.9h.2z" />
            </svg>
        ),
    },
];

const Footer = () => (
    <footer className="relative py-10" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(122,92,255,0.3), transparent)' }} />

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="text-center md:text-left">
                <p className="font-bold text-lg">
                    <span style={{ color: '#00d4ff' }}>MD</span>
                    <span className="text-white"> ZEESHAN</span>
                </p>
                <p className="text-gray-500 text-sm mt-1">
                    Made with <span style={{ color: '#ef4444' }}>♥</span> · All rights reserved © 2025
                </p>
            </div>

            {/* Hobbies */}
            <div className="flex items-center gap-2 text-xs text-gray-600">
                {['🎮 Gaming', '✍️ Writing', '🎵 Music'].map((h, i) => (
                    <React.Fragment key={h}>
                        <span>{h}</span>
                        {i < 2 && <span className="text-gray-700">·</span>}
                    </React.Fragment>
                ))}
            </div>

            {/* Socials + Back to top */}
            <div className="flex items-center gap-3">
                {socials.map((s) => (
                    <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:scale-110 transition-all"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        title={s.name}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = s.hoverColor;
                            e.currentTarget.style.borderColor = `${s.hoverColor}50`;
                            e.currentTarget.style.boxShadow = `0 0 15px ${s.hoverColor}40`;
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

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="ml-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
                        border: '1px solid rgba(0,212,255,0.3)',
                        background: 'rgba(0,212,255,0.08)',
                        color: '#00d4ff',
                    }}
                    title="Back to top"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0,212,255,0.15)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </footer>
);

export default Footer;
