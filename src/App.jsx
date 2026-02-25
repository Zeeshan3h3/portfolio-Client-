import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chat from './components/Chat';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';
import { motion, useScroll, useSpring } from 'framer-motion';

/* Cinematic section wrapper — blur→clear + rise into view */
function SectionReveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Glowing vertical scroll progress beam (right side) */
function ScrollBeam() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '160px',
        width: '2px',
        zIndex: 50,
        pointerEvents: 'none',
        background: 'rgba(0,212,255,0.08)',
        borderRadius: '4px',
      }}
    >
      <motion.div
        style={{
          scaleY,
          originY: 0,
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #00d4ff, #7a5cff)',
          borderRadius: '4px',
          boxShadow: '0 0 12px rgba(0,212,255,0.7)',
        }}
      />
    </div>
  );
}

function App() {
  return (
    <div
      className="min-h-screen font-sans text-white cursor-none"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #050a1f 0%, #030712 40%, #000000 100%)' }}
    >
      {/* Global 3D particle background */}
      <ParticleBackground />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Scroll progress beam */}
      <ScrollBeam />

      {/* Page content — sits above particles */}
      <div className="relative z-10">
        <Navbar />
        {/* Hero doesn't get SectionReveal — it has its own entry animations */}
        <Hero />
        <SectionReveal>
          <Education />
        </SectionReveal>
        <SectionReveal>
          <Skills />
        </SectionReveal>
        <SectionReveal>
          <Projects />
        </SectionReveal>
        <SectionReveal>
          <Contact />
        </SectionReveal>
        <SectionReveal>
          <Footer />
        </SectionReveal>
        <Chat />
      </div>
    </div>
  );
}

export default App;
