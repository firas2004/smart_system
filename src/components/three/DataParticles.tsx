import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const DataParticles = React.memo(() => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 800;

    const [positions,  colors, velocities] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const c = new Float32Array(count * 3);
        const v = new Float32Array(count);
        
        const colorCyan = new THREE.Color('#00d4ff');
        const colorYellow = new THREE.Color('#facc15');

        for (let i = 0; i < count; i++) {
            p[i*3] = (Math.random() - 0.5) * 30; // x spread
            p[i*3+1] = Math.random() * 20; // y height
            p[i*3+2] = (Math.random() - 0.5) * 30; // z spread
            
            const col = Math.random() > 0.3 ? colorCyan : colorYellow;
            c[i*3] = col.r; c[i*3+1] = col.g; c[i*3+2] = col.b;
            
            v[i] = 0.5 + Math.random() * 2.0; // speed
        }
        return [p, c, v];
    }, [count]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;
        const geom = pointsRef.current.geometry;
        const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
        const p = posAttr.array;
        
        // Only update every frame (capped inside useFrame inherent to fiber, but we can do it directly)
        for(let i=0; i<count; i++) {
            p[i*3+1] += velocities[i] * delta;
            // Reset to bottom
            if (p[i*3+1] > 20) {
                p[i*3+1] = 0;
            }
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
});
