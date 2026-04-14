import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ======== ARCHETYPE 1: THE SHARD ========
export const ShardTower = React.memo(({ position, height, width, depth }: any) => {
    const ringRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (ringRef.current) ringRef.current.rotation.y = clock.elapsedTime * 0.5;
    });

    const boxGeo = useMemo(() => {
        const geo = new THREE.BoxGeometry(width, height, depth);
        geo.scale(1, 1, 0.8);
        return geo;
    }, [width, height, depth]);

    const edges = useMemo(() => new THREE.EdgesGeometry(boxGeo), [boxGeo]);

    return (
        <group position={position}>
            {/* Base Shard */}
            <mesh position={[0, height / 2, 0]} geometry={boxGeo} castShadow receiveShadow>
                <meshPhysicalMaterial transmission={0.3} roughness={0.05} metalness={0.9} color="#00d4ff" emissive="#003d5c" emissiveIntensity={0.4} />
            </mesh>
            <lineSegments geometry={edges} position={[0, height / 2, 0]}>
                <lineBasicMaterial color="#00ffff" linewidth={2} />
            </lineSegments>

            {/* Pyramid Top */}
            <mesh position={[0, height + width / 2, 0]} castShadow>
                <coneGeometry args={[width / 1.5, width, 4]} />
                <meshStandardMaterial color="#00d4ff" emissive="#003d5c" emissiveIntensity={0.5} roughness={0.1} />
            </mesh>

            {/* Glowing Orbit Ring */}
            <mesh ref={ringRef} position={[0, height * 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[width * 1.5, width * 1.6, 32]} />
                <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
        </group>
    );
});

// ======== ARCHETYPE 2: HELIX TOWER ========
export const HelixTower = React.memo(({ position, height, width }: any) => {
    const sphereRef = useRef<THREE.PointLight>(null);
    useFrame(({ clock }) => {
        if (sphereRef.current) sphereRef.current.intensity = 1 + Math.sin(clock.elapsedTime * 2) * 0.5;
    });

    return (
        <group position={position}>
            {/* Core */}
            <mesh position={[0, height / 2, 0]} castShadow>
                <cylinderGeometry args={[width * 0.4, width * 0.6, height, 16]} />
                <meshStandardMaterial color="#1a0a3d" emissive="#7c3aed" emissiveIntensity={0.2} roughness={0.5} />
            </mesh>

            {/* Rings */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
                <mesh key={i} position={[0, height * ratio, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[width * 0.65, 0.05, 8, 24]} />
                    <meshBasicMaterial color="#facc15" />
                </mesh>
            ))}

            {/* Top Glowing Sphere */}
            <mesh position={[0, height + 0.3, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#facc15" />
                <pointLight ref={sphereRef} color="#facc15" distance={5} />
            </mesh>
        </group>
    );
});

// ======== ARCHETYPE 3: DIAMOND BLOCK ========
export const DiamondBlock = React.memo(({ position, height, width, depth }: any) => {
    // Striped Shader Material
    const stripeMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: new THREE.Color("#0a1628") },
            color2: { value: new THREE.Color("#00d4ff") },
            scale: { value: height * 2.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
            uniform vec3 color1; uniform vec3 color2; uniform float scale; varying vec2 vUv;
            void main() { gl_FragColor = vec4(mix(color1, color2, step(0.5, fract(vUv.y * scale))), 1.0); }
        `
    }), [height]);

    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, height * 0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[width, height * 0.8, depth]} />
                <primitive object={stripeMaterial} attach="material" />
            </mesh>
            {/* Middle Diamond */}
            <mesh position={[0, height * 0.8, 0]} scale={[1, 0.3, 1]}>
                <octahedronGeometry args={[width * 0.8]} />
                <meshStandardMaterial color="#00d4ff" metalness={1} roughness={0} />
            </mesh>
            {/* Offset Top */}
            <mesh position={[0, height * 0.95, 0]} rotation={[0, Math.PI / 12, 0]} castShadow>
                <boxGeometry args={[width * 0.8, height * 0.3, depth * 0.8]} />
                <meshStandardMaterial color="#0a1628" emissive="#00d4ff" emissiveIntensity={0.2} metalness={0.8} />
            </mesh>
            {/* Antenna */}
            <mesh position={[0, height * 1.1 + 0.5, 0]}>
                <cylinderGeometry args={[0.02, 0.05, 1, 8]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    );
});

// ======== ARCHETYPE 4: BRUTALIST GIANT ========
export const BrutalistGiant = React.memo(({ position, height, width }: any) => {
    const linesRef = useRef<THREE.LineSegments>(null);
    useFrame(() => {
        if (linesRef.current && Math.random() < 0.05) {
            (linesRef.current.material as THREE.LineBasicMaterial).opacity = Math.random() > 0.5 ? 1 : 0.2;
        }
    });

    const segments = 5;
    const stepHeight = height / segments;

    return (
        <group position={position}>
            {Array.from({ length: segments }).map((_, i) => {
                const sWidth = width * (1 - i * 0.15);
                const cy = i * stepHeight + stepHeight / 2;
                return (
                    <group key={`brut-${i}`} position={[0, cy, 0]} rotation={[0, i * 0.14, 0]}>
                        <mesh castShadow receiveShadow>
                            <boxGeometry args={[sWidth, stepHeight, sWidth]} />
                            <meshStandardMaterial color="#0d2137" roughness={0.2} metalness={0.8} />
                        </mesh>
                        <mesh position={[0, stepHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[sWidth * 0.6, 0.05, 4, 4]} />
                            <meshBasicMaterial color="#facc15" />
                        </mesh>
                    </group>
                );
            })}
            <mesh position={[0, height + 1, 0]}>
                <cylinderGeometry args={[0.05, 0.1, 2, 8]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <pointLight position={[0, height + 2, 0]} color="#ff0000" intensity={2} distance={3} />
        </group>
    );
});

// ======== ARCHETYPE 5: GLASS PRISM ========
export const GlassPrism = React.memo(({ position, height, width, depth }: any) => {
    const bridgeRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (bridgeRef.current) {
            (bridgeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 3) * 0.7;
        }
    });

    return (
        <group position={position}>
            <mesh position={[-width * 0.6, height / 2, 0]} rotation={[0, 0, -0.2]} castShadow>
                <boxGeometry args={[width * 0.6, height * 1.05, depth]} />
                <meshPhysicalMaterial color="#0a1628" reflectivity={1.0} roughness={0.0} metalness={0.7} />
            </mesh>
            <mesh position={[width * 0.6, height / 2, 0]} rotation={[0, 0, 0.2]} castShadow>
                <boxGeometry args={[width * 0.6, height * 1.05, depth]} />
                <meshPhysicalMaterial color="#0a1628" reflectivity={1.0} roughness={0.0} metalness={0.7} />
            </mesh>
            {/* Bridge */}
            <mesh ref={bridgeRef} position={[0, height * 0.9, 0]}>
                <boxGeometry args={[width * 1.8, height * 0.15, depth * 0.8]} />
                <meshStandardMaterial color="#0a1628" emissive="#00d4ff" emissiveIntensity={0.8} />
            </mesh>
        </group>
    );
});

// ======== ARCHETYPE 6: BLOB TOWER ========
export const BlobTower = React.memo(({ position, height }: any) => {
    const scanRef = useRef<THREE.Mesh>(null);
    const haloRef = useRef<THREE.Points>(null);

    const lathePoints = useMemo(() => {
        return [
            new THREE.Vector2(0.3, 0), new THREE.Vector2(0.8, height * 0.15),
            new THREE.Vector2(1.2, height * 0.4), new THREE.Vector2(0.9, height * 0.6),
            new THREE.Vector2(1.4, height * 0.85), new THREE.Vector2(0.4, height)
        ];
    }, [height]);

    useFrame(({ clock }) => {
        if (scanRef.current) {
            const h = (clock.elapsedTime * 2) % height;
            scanRef.current.position.y = h;
        }
        if (haloRef.current) {
            haloRef.current.rotation.y = clock.elapsedTime * 0.2;
        }
    });

    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <latheGeometry args={[lathePoints, 32]} />
                <meshPhysicalMaterial color="#001a0a" emissive="#00ff88" emissiveIntensity={0.3} transmission={0.2} roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh ref={scanRef} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2, 32]} />
                <meshBasicMaterial color="#00ff88" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
});
