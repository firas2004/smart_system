import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const EnergyGrid = React.memo(() => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color("#020817") },
      color2: { value: new THREE.Color("#00d4ff") }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() { 
          vUv = uv; 
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
          // Grid pattern
          vec2 grid = abs(fract(vUv * 50.0 - 0.5) - 0.5) / fwidth(vUv * 50.0);
          float line = min(grid.x, grid.y);
          float gridAlpha = 1.0 - min(line, 1.0);
          
          // Radial fade
          float dist = length(vPosition.xy);
          float fade = smoothstep(30.0, 0.0, dist);
          
          // Pulse wave
          float pulse = abs(sin(dist * 0.5 - time * 2.0));
          float waveAlpha = pulse * 0.4;
          
          vec3 finalColor = mix(color1, color2, (gridAlpha + waveAlpha) * fade * 0.6);
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: true,
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[0, -0.01, 0]}>
      {/* Custom Shader Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>
    </group>
  );
});
