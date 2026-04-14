import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Particles = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 1000;

    const [positions, scales] = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            scales[i] = Math.random();
        }
        return [positions, scales];
    }, [particleCount]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#00d4ff" sizeAttenuation transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </points>
    );
};

export const CTASection = () => {
  return (
    <section className="h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background Particles Canvas */}
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <Particles />
            </Canvas>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 pointer-events-none">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-black/50 backdrop-blur-xl p-12 rounded-3xl border border-[#00d4ff]/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] pointer-events-auto"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>Ready to Optimize?</h2>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg hover:text-[#00d4ff] transition-colors">Join the smart cities already reducing overhead by 35%.</p>
                <Link to="/login" className="inline-block px-10 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-lg transition-all w-full sm:w-auto tracking-wider shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:-translate-y-1">
                    Deploy AI System
                </Link>
            </motion.div>
        </div>
    </section>
  );
};
