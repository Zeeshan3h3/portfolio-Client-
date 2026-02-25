import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const contactInfo = [
    {
        icon: '✉️',
        label: 'Email',
        value: 'mdzeeshan08886@gmail.com',
        href: 'mailto:mdzeeshan08886@gmail.com',
        accent: '#00d4ff',
    },
    {
        icon: '📞',
        label: 'Phone',
        value: '+91 9088260058',
        href: 'tel:+919088260058',
        accent: '#00ffcc',
    },
    {
        icon: '💼',
        label: 'LinkedIn',
        value: 'Visit Profile →',
        href: 'https://www.linkedin.com/in/tipz-gaming-1431262a5/',
        accent: '#b794ff',
    },
];

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setStatus('✅ Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('❌ Failed to send. Please try again.');
            }
        } catch {
            setStatus('❌ Error sending. Please email directly.');
        }
    };

    /* Shared glass input style */
    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: '12px',
        color: '#f0f4ff',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    };
    const labelStyle = {
        display: 'block',
        fontSize: '10px',
        fontFamily: 'monospace',
        fontWeight: 600,
        color: '#6a7a9a',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '8px',
    };

    const onFocus = (e) => {
        e.target.style.borderColor = 'rgba(0,212,255,0.5)';
        e.target.style.boxShadow = '0 0 18px rgba(0,212,255,0.12)';
    };
    const onBlur = (e) => {
        e.target.style.borderColor = 'rgba(0,212,255,0.2)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <section id="contact" className="py-24 relative">
            {/* Nebula glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full z-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, rgba(122,92,255,0.03) 40%, transparent 70%)', filter: 'blur(120px)' }} />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <p className="text-[10px] font-mono tracking-[0.4em] uppercase mb-2"
                        style={{ color: 'rgba(0,212,255,0.6)' }}>
                        ◈ Module 04
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: '#f0f4ff' }}>
                        Let&apos;s{' '}
                        <span className="bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7a5cff)' }}>
                            Connect
                        </span>
                    </h2>
                    <p className="mt-4 max-w-md mx-auto" style={{ color: '#94a3c0' }}>
                        Have a project in mind, want to collaborate, or just say hi?
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
                    {/* Info column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, filter: 'blur(6px)' }}
                        animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:w-2/5 flex flex-col gap-4"
                    >
                        {contactInfo.map((info) => (
                            <a
                                key={info.label}
                                href={info.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center gap-4 rounded-2xl p-5"
                                style={{
                                    background: 'rgba(8, 8, 28, 0.58)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: `1px solid ${info.accent}28`,
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                                    transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.borderColor = `${info.accent}55`;
                                    e.currentTarget.style.boxShadow = `0 15px 40px ${info.accent}18, inset 0 1px 0 rgba(255,255,255,0.07)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = `${info.accent}28`;
                                    e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)';
                                }}
                            >
                                <span className="text-2xl">{info.icon}</span>
                                <div>
                                    <p style={labelStyle}>{info.label}</p>
                                    <p className="text-sm font-semibold" style={{ color: '#d1d9f0' }}>{info.value}</p>
                                </div>
                            </a>
                        ))}

                        {/* Quote card */}
                        <div className="mt-auto p-5 rounded-2xl"
                            style={{
                                background: 'rgba(8, 8, 28, 0.45)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                            }}>
                            <p className="italic text-sm leading-relaxed" style={{ color: '#8ca0c0' }}>
                                &ldquo;I believe in rational thinking and systematic problem-solving. Let&apos;s build something together.&rdquo;
                            </p>
                            <p className="text-xs mt-2 font-mono font-semibold" style={{ color: '#00d4ff' }}>— MD ZEESHAN</p>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, filter: 'blur(6px)' }}
                        animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:w-3/5 rounded-2xl p-8 relative"
                        style={{
                            background: 'rgba(8, 8, 28, 0.58)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid rgba(0,212,255,0.15)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                        }}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-8 right-8 h-[1px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)' }} />

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label style={labelStyle}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        style={inputStyle}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                        style={inputStyle}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Your message here..."
                                    style={{ ...inputStyle, resize: 'none' }}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                            </div>

                            {/* Space energy submit */}
                            <button
                                type="submit"
                                className="w-full py-4 font-bold rounded-xl relative overflow-hidden group"
                                style={{
                                    background: 'linear-gradient(135deg, #00d4ff, #7a5cff)',
                                    boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                                    color: '#fff',
                                    transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.6), 0 0 80px rgba(122,92,255,0.3)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                                <span className="relative z-10">Send Message 🚀</span>
                            </button>

                            {status && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-sm font-medium font-mono"
                                    style={{ color: '#00ffcc' }}
                                >
                                    {status}
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
