import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingMeshProps {
  position: [number, number, number];
  height: number;
  width: number;
  depth: number;
}

export const BuildingMesh = ({ position, height, width, depth }: BuildingMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Randomly toggle windows
  const [windowsActive, setWindowsActive] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setWindowsActive(prev => !prev);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position}>
      {/* Main Building Block */}
      <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color="#0a1628" 
          emissive="#00d4ff" 
          emissiveIntensity={0.15} 
          roughness={0.8} 
          metalness={0.2}
        />
      </mesh>
      
      {/* Glowing Window Panels (simplified representation) */}
      <mesh position={[0, height / 2, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.8, height * 0.8]} />
        <meshBasicMaterial 
          color={windowsActive ? "#facc15" : "#111111"} 
          transparent={true}
          opacity={windowsActive ? 0.8 : 0.1}
          wireframe={true}
        />
      </mesh>
      <mesh position={[0, height / 2, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.8, height * 0.8]} />
        <meshBasicMaterial 
          color={windowsActive ? "#facc15" : "#111111"} 
          transparent={true}
          opacity={windowsActive ? 0.8 : 0.1}
          wireframe={true}
        />
      </mesh>
      <mesh position={[width / 2 + 0.01, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.8, height * 0.8]} />
        <meshBasicMaterial 
          color={windowsActive ? "#facc15" : "#111111"} 
          transparent={true}
          opacity={windowsActive ? 0.8 : 0.1}
          wireframe={true}
        />
      </mesh>
      <mesh position={[-width / 2 - 0.01, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.8, height * 0.8]} />
        <meshBasicMaterial 
          color={windowsActive ? "#facc15" : "#111111"} 
          transparent={true}
          opacity={windowsActive ? 0.8 : 0.1}
          wireframe={true}
        />
      </mesh>
    </group>
  );
};
