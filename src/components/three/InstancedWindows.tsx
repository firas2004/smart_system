import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const InstancedWindows = React.memo(({ count = 2000, bounds = 20 }: { count?: number, bounds?: number }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colors = useMemo(() => [
        new THREE.Color("#facc15"), // Yellow
        new THREE.Color("#00d4ff"), // Cyan
        new THREE.Color("#111111")  // Dark
    ], []);
    
    const colorArray = useMemo(() => new Float32Array(count * 3), [count]);

    // Initial positioning
    useEffect(() => {
        if (!meshRef.current) return;
        
        for (let i = 0; i < count; i++) {
            // Randomly attach to side of a hypothetical building
            const r = Math.random();
            let x = (Math.random() - 0.5) * bounds;
            let z = (Math.random() - 0.5) * bounds;
            let y = Math.random() * 8; // Max height 8
            
            dummy.position.set(x, y, z);
            
            // Orient outwards
            if (r > 0.5) {
                dummy.rotation.y = Math.PI / 2;
            } else {
                dummy.rotation.y = 0;
            }
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            // Assign base colors (mostly dark, some yellow, some cyan at top)
            let colorIdx = 2; // default dark
            if (y > 6.5) {
                colorIdx = 1; // Top 20% always cyan
            } else {
                const rand = Math.random();
                if (rand < 0.7) colorIdx = 0; // 70% yellow
                else if (rand < 0.9) colorIdx = 1; // 20% cyan
            }
            colors[colorIdx].toArray(colorArray, i * 3);
        }
        
        meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, bounds, dummy, colors, colorArray]);

    // Animate: randomly toggle some windows every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!meshRef.current) return;
            const geo = meshRef.current.geometry;
            const colorsAttr = geo.getAttribute('color') as THREE.InstancedBufferAttribute;
            
            // Pick 5-8 random windows to change
            const numChanges = 5 + Math.floor(Math.random() * 3);
            for (let j = 0; j < numChanges; j++) {
                const i = Math.floor(Math.random() * count);
                const rand = Math.random();
                let newColorIdx = rand > 0.5 ? 0 : 2; // toggle between yellow and dark
                colors[newColorIdx].toArray(colorsAttr.array, i * 3);
            }
            colorsAttr.needsUpdate = true;
        }, 2000);
        return () => clearInterval(interval);
    }, [count, colors]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={true}>
            <planeGeometry args={[0.08, 0.12]} />
            <meshBasicMaterial vertexColors={true} transparent opacity={0.9} side={THREE.DoubleSide} />
        </instancedMesh>
    );
});
