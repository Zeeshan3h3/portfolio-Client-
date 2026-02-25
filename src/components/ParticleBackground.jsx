import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';

/* ─── Layer 2: Nebula clouds (additive blending, soft glow clusters) ─── */
function Nebula({ color, position, count = 150, spread = 7 }) {
    const ref = useRef();

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = Math.pow(Math.random(), 0.5) * spread;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            pos[i * 3] = position[0] + r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = position[1] + r * Math.sin(phi) * Math.sin(theta) * 0.5;
            pos[i * 3 + 2] = position[2] + r * Math.cos(phi) * 0.3;
        }
        return pos;
    }, [count, position, spread]);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.getElapsedTime();
        ref.current.rotation.z += 0.0002;
        ref.current.rotation.y = Math.sin(t * 0.04) * 0.06;
        // subtle breathing
        const s = 1 + Math.sin(t * 0.3) * 0.03;
        ref.current.scale.setScalar(s);
    });

    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return g;
    }, [positions]);

    return (
        <points ref={ref} geometry={geo}>
            <pointsMaterial
                color={color}
                size={0.45}
                sizeAttenuation
                transparent
                opacity={0.09}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/* ─── Layer 3: Anti-gravity particles (drift upward, mouse reactive) ─── */
function AntiGravityParticles({ count = 180, mouseRef }) {
    const ref = useRef();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 80 : count;

    const [positions, velocities, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount);
        const col = new Float32Array(particleCount * 3);
        const palette = [
            new THREE.Color('#00d4ff'),
            new THREE.Color('#7a5cff'),
            new THREE.Color('#00ffcc'),
            new THREE.Color('#ffffff'),
        ];
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
            vel[i] = 0.004 + Math.random() * 0.008;
            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return [pos, vel, col];
    }, [particleCount]);

    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return g;
    }, [positions, colors]);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const posArr = ref.current.geometry.attributes.position.array;
        const t = clock.getElapsedTime();
        const mx = mouseRef.current.x * 0.8;
        const my = mouseRef.current.y * 0.8;

        for (let i = 0; i < particleCount; i++) {
            // drift upward
            posArr[i * 3 + 1] += velocities[i];
            // subtle horizontal drift from mouse
            posArr[i * 3] += Math.sin(t * 0.3 + i) * 0.003 + mx * 0.001;
            // reset if too high
            if (posArr[i * 3 + 1] > 20) {
                posArr[i * 3 + 1] = -20;
                posArr[i * 3] = (Math.random() - 0.5) * 50;
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref} geometry={geo}>
            <pointsMaterial
                vertexColors
                size={0.06}
                sizeAttenuation
                transparent
                opacity={0.7}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/* ─── Layer 1: Deep star field (multi-depth, very subtle drift) ─── */
function StarField({ count = 700, depth = 50 }) {
    const ref = useRef();

    const [positions, colors, sizes] = useMemo(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const c = isMobile ? 400 : count;
        const pos = new Float32Array(c * 3);
        const col = new Float32Array(c * 3);
        const sz = new Float32Array(c);
        const palette = [
            new THREE.Color('#ffffff'),
            new THREE.Color('#93c5fd'),
            new THREE.Color('#c4b5fd'),
            new THREE.Color('#6ee7b7'),
        ];
        for (let i = 0; i < c; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 70;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * depth;
            const color = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
            sz[i] = Math.random() * 0.06 + 0.005;
        }
        return [pos, col, sz];
    }, [count, depth]);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.getElapsedTime();
        ref.current.rotation.y = t * 0.005;
        ref.current.rotation.x = Math.sin(t * 0.002) * 0.03;
    });

    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        return g;
    }, [positions, colors, sizes]);

    return (
        <points ref={ref} geometry={geo}>
            <pointsMaterial
                vertexColors
                size={0.07}
                sizeAttenuation
                transparent
                opacity={0.9}
                depthWrite={false}
            />
        </points>
    );
}

/* ─── Shooting Stars ─── */
function ShootingStar({ delay = 0 }) {
    const lineRef = useRef();
    const headPos = useRef(new THREE.Vector3());
    const vel = useRef(new THREE.Vector3());
    const state = useRef({ active: false, timer: 0 });

    useEffect(() => {
        const spawn = () => {
            headPos.current.set(
                (Math.random() - 0.5) * 40,
                (Math.random() * 8) + 6,
                -5
            );
            const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
            vel.current.set(Math.cos(angle) * 0.6, -Math.sin(angle) * 0.6, 0);
            state.current.active = true;
            state.current.timer = 0;
        };
        const interval = setInterval(() => {
            if (!state.current.active) spawn();
        }, 4000 + delay + Math.random() * 5000);
        return () => clearInterval(interval);
    }, [delay]);

    const points = useMemo(() => Array.from({ length: 25 }, () => new THREE.Vector3(0, 0, 0)), []);
    const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    useFrame(() => {
        if (!state.current.active || !lineRef.current) return;
        headPos.current.add(vel.current);
        state.current.timer += 1;
        const posArr = lineRef.current.geometry.attributes.position.array;
        const trailLen = 25;
        for (let i = trailLen - 1; i > 0; i--) {
            posArr[i * 3] = posArr[(i - 1) * 3];
            posArr[i * 3 + 1] = posArr[(i - 1) * 3 + 1];
            posArr[i * 3 + 2] = posArr[(i - 1) * 3 + 2];
        }
        posArr[0] = headPos.current.x;
        posArr[1] = headPos.current.y;
        posArr[2] = headPos.current.z;
        lineRef.current.geometry.attributes.position.needsUpdate = true;
        if (state.current.timer > 50) state.current.active = false;
    });

    return (
        <line ref={lineRef}>
            <bufferGeometry {...lineGeo} />
            <lineBasicMaterial color="#a5f3fc" transparent opacity={0.85} />
        </line>
    );
}

/* ─── Layer 5: Floating low-poly asteroids (wireframe, very subtle) ─── */
function FloatingAsteroid({ position, speed, scale }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.getElapsedTime();
        ref.current.rotation.x = t * speed * 0.5;
        ref.current.rotation.y = t * speed;
        ref.current.rotation.z = t * speed * 0.3;
        ref.current.position.y = position[1] + Math.sin(t * 0.15 + position[0]) * 0.3;
    });
    return (
        <mesh ref={ref} position={position} scale={scale}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#030712" transparent opacity={0.01} />
            <Edges scale={1.001} threshold={1} color="#00d4ff" lineWidth={0.5} />
        </mesh>
    );
}

/* ─── Mouse-reactive camera ─── */
function MouseCamera({ mouseRef }) {
    const { camera } = useThree();
    useFrame(() => {
        camera.position.x += (mouseRef.current.x * 0.3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseRef.current.y * 0.2 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

/* ─── Full Scene ─── */
function Scene({ mouseRef }) {
    return (
        <>
            <MouseCamera mouseRef={mouseRef} />
            {/* Layer 1 – Star field */}
            <StarField count={750} depth={55} />

            {/* Layer 2 – Nebula clouds */}
            <Nebula color="#00d4ff" position={[-12, 5, -12]} spread={9} count={160} />
            <Nebula color="#7a5cff" position={[12, -4, -14]} spread={10} count={180} />
            <Nebula color="#00ffcc" position={[0, -7, -16]} spread={8} count={120} />
            <Nebula color="#7a5cff" position={[-8, -5, -18]} spread={7} count={100} />

            {/* Layer 3 – Anti-gravity particles */}
            <AntiGravityParticles count={180} mouseRef={mouseRef} />

            {/* Layer 5 – Floating asteroids pushed far back to avoid content overlap */}
            <FloatingAsteroid position={[22, 8, -38]} speed={0.002} scale={1.8} />
            <FloatingAsteroid position={[-24, -8, -42]} speed={0.0015} scale={1.4} />
            <FloatingAsteroid position={[-20, 10, -46]} speed={0.0018} scale={1.0} />

            {/* Shooting stars */}
            <ShootingStar delay={0} />
            <ShootingStar delay={3000} />
            <ShootingStar delay={7000} />
        </>
    );
}

const ParticleBackground = () => {
    const mouseRef = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        // Move the CSS grid opposite to mouse for parallax
        const gx = -mouseRef.current.x * 15;
        const gy = -mouseRef.current.y * 10;
        document.body.style.setProperty('--grid-x', `${gx}px`);
        document.body.style.setProperty('--grid-y', `${gy}px`);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 13], fov: 65 }}
                gl={{ antialias: false, alpha: true }}
                dpr={[1, 1.5]}
            >
                <Scene mouseRef={mouseRef} />
            </Canvas>
        </div>
    );
};

export default ParticleBackground;
