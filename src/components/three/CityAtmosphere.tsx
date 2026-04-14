import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const CityAtmosphere = React.memo(() => {
    // Inverse sky dome
    const skyShader = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            colorBottom: { value: new THREE.Color("#020817") },
            colorTop: { value: new THREE.Color("#0a0a2e") }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 colorTop;
            uniform vec3 colorBottom;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition).y;
                gl_FragColor = vec4(mix(colorBottom, colorTop, max(pow(max(h, 0.0), 0.6), 0.0)), 1.0);
            }
        `,
        side: THREE.BackSide,
    }), []);

    // Stars Particles
    const starCount = 150;
    const starsRef = useRef<THREE.Points>(null);
    const starGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const opacities = new Float32Array(starCount);
        for(let i=0; i<starCount; i++) {
            // Random point on sphere upper hemisphere
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(1 - v); // Top half only
            const r = 40; // Sky radius
            
            positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i*3+1] = r * Math.cos(phi);
            positions[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
            opacities[i] = Math.random();
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
        return geo;
    }, [starCount]);

    const starMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
            attribute float aOpacity;
            varying float vOpacity;
            void main() {
                vOpacity = aOpacity;
                gl_PointSize = 2.0;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying float vOpacity;
            void main() {
                float pulse = 0.5 + 0.5 * sin(time * 2.0 + vOpacity * 10.0);
                gl_FragColor = vec4(1.0, 1.0, 1.0, pulse * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    }), []);

    useFrame(({ clock }) => {
        if (starMaterial) starMaterial.uniforms.time.value = clock.elapsedTime;
    });

    return (
        <group>
            {/* Sky Dome */}
            <mesh>
                <sphereGeometry args={[50, 32, 15]} />
                <primitive object={skyShader} attach="material" />
            </mesh>
            {/* Stars */}
            <points geometry={starGeometry} material={starMaterial} />
        </group>
    );
});
