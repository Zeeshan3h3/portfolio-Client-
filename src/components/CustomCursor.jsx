import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const TRAIL_LENGTH = 10;

const CustomCursor = () => {
    const canvasRef = useRef(null);
    const trailRef = useRef([]);
    const dotRef = useRef(null);
    const rafRef = useRef(null);
    const posRef = useRef({ x: -100, y: -100 });
    const hoveringRef = useRef(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const ringScale = useMotionValue(1);

    const springX = useSpring(cursorX, { damping: 28, stiffness: 180 });
    const springY = useSpring(cursorY, { damping: 28, stiffness: 180 });
    const springScale = useSpring(ringScale, { damping: 20, stiffness: 200 });

    // Canvas trail animation
    const animateTrail = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        trailRef.current.forEach((p, i) => {
            const alpha = ((i + 1) / TRAIL_LENGTH) * 0.45;
            const radius = (i / TRAIL_LENGTH) * 3 + 1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.fill();
        });

        rafRef.current = requestAnimationFrame(animateTrail);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', resize);
        rafRef.current = requestAnimationFrame(animateTrail);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafRef.current);
        };
    }, [animateTrail]);

    useEffect(() => {
        const move = (e) => {
            posRef.current = { x: e.clientX, y: e.clientY };
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Update dot position instantly
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }

            // Update trail
            trailRef.current.unshift({ x: e.clientX, y: e.clientY });
            if (trailRef.current.length > TRAIL_LENGTH) {
                trailRef.current.pop();
            }
        };

        const onEnter = (e) => {
            const tag = e.target.tagName.toLowerCase();
            if (['a', 'button', 'input', 'textarea'].includes(tag) || e.target.closest('a, button')) {
                hoveringRef.current = true;
                ringScale.set(2.2);
                if (dotRef.current) dotRef.current.style.opacity = '0';
            }
        };

        const onLeave = () => {
            hoveringRef.current = false;
            ringScale.set(1);
            if (dotRef.current) dotRef.current.style.opacity = '1';
        };

        window.addEventListener('mousemove', move, { passive: true });
        document.addEventListener('mouseover', onEnter);
        document.addEventListener('mouseout', onLeave);

        return () => {
            window.removeEventListener('mousemove', move);
            document.removeEventListener('mouseover', onEnter);
            document.removeEventListener('mouseout', onLeave);
        };
    }, [cursorX, cursorY, ringScale]);

    return (
        <>
            {/* Particle trail canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 9996,
                    mixBlendMode: 'screen',
                }}
            />

            {/* Glowing dot */}
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#00d4ff',
                    boxShadow: '0 0 10px rgba(0,212,255,0.9), 0 0 20px rgba(0,212,255,0.5)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                    transition: 'opacity 0.2s ease',
                }}
            />

            {/* Lagging ring */}
            <motion.div
                style={{
                    position: 'fixed',
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(122,92,255,0.7)',
                    boxShadow: '0 0 12px rgba(122,92,255,0.3), inset 0 0 8px rgba(122,92,255,0.1)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    x: springX,
                    y: springY,
                    scale: springScale,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </>
    );
};

export default CustomCursor;
