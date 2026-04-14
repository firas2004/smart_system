import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// ═══════════════════════════════════════════════
// ANIMATED GROUND GRID
// ═══════════════════════════════════════════════
const AnimatedGrid = React.memo(() => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const gridShader = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec2 grid = fract(vUv * 30.0);
        float line = step(0.97, grid.x) + step(0.97, grid.y);
        float dist = length(vUv - 0.5);
        float fade = 1.0 - smoothstep(0.2, 0.5, dist);
        vec3 gridColor = vec3(0.0, 0.83, 1.0) * line * fade;
        float wave = sin(dist * 40.0 - uTime * 2.0) * 0.5 + 0.5;
        float waveMask = smoothstep(0.4, 0.0, dist) * wave * 0.3;
        gl_FragColor = vec4(gridColor + waveMask * vec3(0.0,0.5,1.0), line * fade * 0.8 + waveMask);
      }
    `,
  }), []);
  useFrame(({ clock }) => { if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime; });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <primitive object={gridShader} ref={matRef} attach="material" />
    </mesh>
  );
});

// ═══════════════════════════════════════════════
// BURJ KHALIFA STYLE — CENTER BACK
// ═══════════════════════════════════════════════
const BurjKhalifaTower = React.memo(({ position }: { position: [number,number,number] }) => {
  const beaconRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (beaconRef.current) beaconRef.current.intensity = 0.5 + Math.sin(clock.elapsedTime * 4) * 1.5;
  });

  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0a1628', roughness: 0.1, metalness: 0.95, emissive: '#001833' }), []);
  const podiumMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0d1f35', roughness: 0.3, metalness: 0.8 }), []);
  const spireGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.15, 4, 8), []);
  const section1Geo = useMemo(() => new THREE.BoxGeometry(2.2, 5, 2.2), []);
  const section2Geo = useMemo(() => new THREE.BoxGeometry(1.6, 4, 1.6), []);
  const section3Geo = useMemo(() => new THREE.BoxGeometry(1.0, 3.5, 1.0), []);
  const edges1 = useMemo(() => new THREE.EdgesGeometry(section1Geo), [section1Geo]);
  const edges2 = useMemo(() => new THREE.EdgesGeometry(section2Geo), [section2Geo]);
  const edges3 = useMemo(() => new THREE.EdgesGeometry(section3Geo), [section3Geo]);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#00d4ff' }), []);

  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} geometry={new THREE.BoxGeometry(3, 0.8, 3)} material={podiumMat} receiveShadow />
      <mesh position={[0, 3.3, 0]} geometry={section1Geo} material={steelMat} castShadow />
      <lineSegments geometry={edges1} material={edgeMat} position={[0, 3.3, 0]} />
      <mesh position={[0, 9.3, 0]} rotation={[0, Math.PI / 8, 0]} geometry={section2Geo} material={steelMat} castShadow />
      <lineSegments geometry={edges2} material={edgeMat} position={[0, 9.3, 0]} rotation={[0, Math.PI / 8, 0]} />
      <mesh position={[0, 13.55, 0]} rotation={[0, Math.PI / 4, 0]} geometry={section3Geo} material={steelMat} castShadow />
      <lineSegments geometry={edges3} material={edgeMat} position={[0, 13.55, 0]} rotation={[0, Math.PI / 4, 0]} />
      <mesh position={[0, 17.3, 0]} geometry={spireGeo} castShadow>
        <meshStandardMaterial color="#aaaaaa" metalness={1.0} roughness={0.0} />
      </mesh>
      <mesh position={[0, 19.4, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial emissive="#ff0000" emissiveIntensity={3} color="#ff0000" />
        <pointLight ref={beaconRef} color="#ff0000" distance={5} />
      </mesh>
    </group>
  );
});

// ═══════════════════════════════════════════════
// SHARD STYLE — left back
// ═══════════════════════════════════════════════
const ShardBuilding = React.memo(({ position }: { position: [number,number,number] }) => {
  const ledRef = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame(({ clock }) => {
    ledRef.current.forEach(m => { if (m) m.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 2) * 0.5; });
  });

  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#061525', metalness: 0.9, roughness: 0.05, transmission: 0.15, thickness: 0.5, emissive: '#004466', emissiveIntensity: 0.3 }), []);
  const sectionWidths = [1.8, 1.45, 1.1, 0.8, 0.5, 0.3];

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.6, 2]} />
        <meshStandardMaterial color="#0d1f35" roughness={0.3} metalness={0.8} />
      </mesh>
      {sectionWidths.map((w, i) => {
        const y = 0.6 + i * 2.5 + 1.25;
        const geo = new THREE.BoxGeometry(w, 2.5, w);
        return (
          <group key={i}>
            <mesh position={[0, y, 0]} geometry={geo} material={glassMat} castShadow />
            <lineSegments position={[0, y, 0]}>
              <edgesGeometry args={[geo]} />
              <lineBasicMaterial color="#00ffff" />
            </lineSegments>
            <mesh position={[0, y + 1.25, 0]}>
              <boxGeometry args={[w + 0.02, 0.05, w + 0.02]} />
              <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
            </mesh>
          </group>
        );
      })}
      <pointLight color="#00ffff" intensity={3} distance={8} position={[0, 0.6 + 6 * 2.5, 0]} />
    </group>
  );
});

// ═══════════════════════════════════════════════
// TWISTED CAYAN TOWER — right back
// ═══════════════════════════════════════════════
const TwistedTower = React.memo(({ position }: { position: [number,number,number] }) => {
  const floors = 20;
  return (
    <group position={position}>
      {Array.from({ length: floors }).map((_, i) => {
        const y = i * 0.65 + 0.2;
        const rotY = (i / floors) * Math.PI * 0.9;
        return (
          <group key={i} position={[0, y, 0]} rotation={[0, rotY, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.5, 0.6, 1.5]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#0a2040' : '#0d3060'} metalness={0.9} roughness={0.1} emissive={i % 2 === 0 ? '#001840' : '#002060'} emissiveIntensity={0.4} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.5, 0.6, 1.5)]} />
              <lineBasicMaterial color="#7c3aed" />
            </lineSegments>
          </group>
        );
      })}
      <pointLight color="#7c3aed" intensity={4} distance={10} position={[0, floors * 0.65 + 1, 0]} />
    </group>
  );
});

// ═══════════════════════════════════════════════
// DOUBLE HELIX CORPORATE TOWER
// ═══════════════════════════════════════════════
const HelixCorporate = React.memo(({ position }: { position: [number,number,number] }) => {
  const spiral1Ref = useRef<THREE.Group>(null);
  const spiral2Ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spiral1Ref.current) spiral1Ref.current.rotation.y += delta * 0.2;
    if (spiral2Ref.current) spiral2Ref.current.rotation.y -= delta * 0.2;
  });

  const towerH = 9;
  const spiralPoints = 40;

  return (
    <group position={position}>
      <mesh position={[0, towerH / 2, 0]}>
        <boxGeometry args={[1.2, towerH, 1.2]} />
        <meshStandardMaterial color="#050f1f" metalness={1.0} roughness={0.0} />
      </mesh>
      <lineSegments position={[0, towerH / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, towerH, 1.2)]} />
        <lineBasicMaterial color="#00d4ff" />
      </lineSegments>
      {Array.from({ length: Math.floor(towerH) }).map((_, i) => (
        <mesh key={i} position={[0, i * 1 + 0.5, 0]}>
          <boxGeometry args={[1.4, 0.06, 1.4]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} />
        </mesh>
      ))}
      {[0, Math.PI].map((offset, si) => (
        <group key={si} ref={si === 0 ? spiral1Ref : spiral2Ref}>
          {Array.from({ length: spiralPoints }).map((_, i) => {
            const t = i / spiralPoints;
            const x = Math.cos(t * Math.PI * 4 + offset) * 0.9;
            const z = Math.sin(t * Math.PI * 4 + offset) * 0.9;
            const y = t * towerH;
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshStandardMaterial emissive="#facc15" emissiveIntensity={2} color="#facc15" />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
});

// ═══════════════════════════════════════════════
// PIXEL VOXEL TOWER
// ═══════════════════════════════════════════════
const PixelTower = React.memo(({ position }: { position: [number,number,number] }) => {
  const colors = ['#002244', '#001133', '#003355'];
  const emissives = ['#00d4ff', '#facc15', '#7c3aed', '#000000'];

  const voxels = useMemo(() => {
    const cubes: { pos: [number,number,number]; color: string; emissive: string; emissiveIntensity: number }[] = [];
    for (let col = 0; col < 4; col++) {
      for (let depth = 0; depth < 4; depth++) {
        for (let row = 0; row < 15; row++) {
          if (Math.random() < 0.25) continue;
          cubes.push({
            pos: [col * 0.42 - 0.63 + (Math.random()-0.5)*0.05, row * 0.42, depth * 0.42 - 0.63 + (Math.random()-0.5)*0.05],
            color: colors[Math.floor(Math.random() * colors.length)],
            emissive: emissives[Math.floor(Math.random() * emissives.length)],
            emissiveIntensity: Math.random() * 1.5
          });
        }
      }
    }
    return cubes;
  }, []);

  return (
    <group position={position}>
      {voxels.map((v, i) => (
        <mesh key={i} position={v.pos} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color={v.color} emissive={v.emissive} emissiveIntensity={v.emissiveIntensity} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
});

// ═══════════════════════════════════════════════
// STACKED PLATES — Zaha Hadid
// ═══════════════════════════════════════════════
const StackedPlates = React.memo(({ position }: { position: [number,number,number] }) => {
  const floors = [
    { w: 3.5, h: 0.3, d: 2.5, y: 0.5 }, { w: 3.2, h: 0.3, d: 2.2, y: 1.8 },
    { w: 2.9, h: 0.3, d: 2.0, y: 3.1 }, { w: 3.4, h: 0.3, d: 1.8, y: 4.4 },
    { w: 2.6, h: 0.3, d: 1.6, y: 5.7 }, { w: 3.0, h: 0.3, d: 1.4, y: 7.0 },
    { w: 2.2, h: 0.3, d: 1.2, y: 8.3 }, { w: 1.8, h: 0.3, d: 1.0, y: 9.6 },
  ];

  return (
    <group position={position}>
      {floors.map((f, i) => {
        const offX = (Math.random() - 0.5) * 0.6;
        const rotY = (Math.random() - 0.5) * (Math.PI / 36);
        return (
          <group key={i} position={[offX, f.y, 0]} rotation={[0, rotY, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[f.w, f.h, f.d]} />
              <meshStandardMaterial color="#0a1a30" metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Glowing underside */}
            <mesh position={[0, -f.h / 2 - 0.001, 0]} rotation={[-Math.PI, 0, 0]}>
              <planeGeometry args={[f.w, f.d]} />
              <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} side={THREE.DoubleSide} transparent opacity={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
});

// ═══════════════════════════════════════════════
// ENERGY TOWER
// ═══════════════════════════════════════════════
const EnergyTower = React.memo(({ position }: { position: [number,number,number] }) => {
  const topRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const ringBases = [2, 4, 6, 8, 10];

  useFrame(({ clock }) => {
    if (topRef.current) {
      topRef.current.rotation.x = clock.elapsedTime;
      topRef.current.rotation.z = clock.elapsedTime * 0.7;
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.position.y = ((ringBases[i] + clock.elapsedTime * 0.5) % 10) + 0.5;
      });
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[1.3, 10, 1.3]} />
        <meshStandardMaterial color="#0a1628" metalness={0.9} roughness={0.2} />
      </mesh>
      <lineSegments position={[0, 5, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.3, 10, 1.3)]} />
        <lineBasicMaterial color="#facc15" />
      </lineSegments>
      {[[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].map(([x, z], i) => (
        <mesh key={i} position={[x, 5, z]}>
          <boxGeometry args={[0.25, 10, 0.25]} />
          <meshStandardMaterial emissive="#facc15" emissiveIntensity={0.6} color="#facc15" />
        </mesh>
      ))}
      <group ref={ringsRef}>
        {ringBases.map((by, i) => (
          <mesh key={i} position={[0, by, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.0, 0.04, 8, 32]} />
            <meshStandardMaterial emissive="#00d4ff" emissiveIntensity={1.5} color="#00d4ff" />
          </mesh>
        ))}
      </group>
      <mesh ref={topRef} position={[0, 11, 0]}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial emissive="#facc15" emissiveIntensity={3} color="#facc15" />
        <pointLight color="#facc15" intensity={5} distance={12} />
      </mesh>
    </group>
  );
});

// ═══════════════════════════════════════════════
// PENTAGON TOWERS
// ═══════════════════════════════════════════════
const PentagonTower = React.memo(({ position }: { position: [number,number,number] }) => {
  const ledMats = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame(({ clock }) => {
    ledMats.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 1.0 + 0.5 * Math.sin(clock.elapsedTime * 2 + i * 1.2);
    });
  });

  return (
    <group position={position}>
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[1, 1.2, 8, 5]} />
        <meshStandardMaterial color="#061020" metalness={0.95} roughness={0.05} />
      </mesh>
      <lineSegments position={[0, 4, 0]}>
        <edgesGeometry args={[new THREE.CylinderGeometry(1, 1.2, 8, 5)]} />
        <lineBasicMaterial color="#00d4ff" />
      </lineSegments>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[0, i * 2 + 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.06, 1.06, 0.06, 5]} />
          <meshStandardMaterial emissive="#7c3aed" emissiveIntensity={0.8} color="#7c3aed" />
        </mesh>
      ))}
    </group>
  );
});

// ═══════════════════════════════════════════════
// BACKGROUND CITY FILL (40 simple buildings)
// ═══════════════════════════════════════════════
const BackgroundCity = React.memo(() => {
  const buildings = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 50,
      z: -10 - Math.random() * 20,
      h: 2 + Math.random() * 5,
      w: 0.5 + Math.random() * 1.5,
      d: 0.5 + Math.random() * 1.5,
      hasEdge: Math.random() > 0.5,
    }));
  }, []);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#04101e', emissive: '#000d1a', metalness: 0.7, roughness: 0.3 }), []);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#00d4ff', transparent: true, opacity: 0.3 }), []);

  return (
    <group>
      {buildings.map(b => {
        const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
        return (
          <group key={b.id} position={[b.x, 0, b.z]}>
            <mesh position={[0, b.h / 2, 0]} geometry={geo} material={mat} />
            {b.hasEdge && <lineSegments geometry={new THREE.EdgesGeometry(geo)} material={edgeMat} position={[0, b.h / 2, 0]} />}
          </group>
        );
      })}
    </group>
  );
});

// ═══════════════════════════════════════════════
// FLOATING DATA PARTICLES
// ═══════════════════════════════════════════════
const FloatingParticles = React.memo(() => {
  const pRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  const count = 1500;

  const [positions, velocities] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = Math.random() * 20;
      p[i * 3 + 2] = -20 + Math.random() * 28;
      v[i] = 0.005 + Math.random() * 0.01;
    }
    return [p, v];
  }, []);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;
    if (!pRef.current) return;
    const arr = pRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += velocities[i];
      if (arr[i * 3 + 1] > 22) arr[i * 3 + 1] = 0;
    }
    pRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00d4ff" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
});

// ═══════════════════════════════════════════════
// STAR FIELD
// ═══════════════════════════════════════════════
const StarField = React.memo(() => {
  const starsRef = useRef<THREE.Group>(null);
  const count = 800;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 80;
      p[i * 3 + 1] = 15 + Math.random() * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return p;
  }, []);

  useFrame(() => { if (starsRef.current) starsRef.current.rotation.y += 0.0002; });

  return (
    <group ref={starsRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.6} />
      </points>
    </group>
  );
});

// ═══════════════════════════════════════════════
// ENERGY BEAMS between buildings
// ═══════════════════════════════════════════════
const EnergyBeam = React.memo(({ from, to }: { from: THREE.Vector3, to: THREE.Vector3 }) => {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const mid = useMemo(() => new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5), [from, to]);
  const dist = useMemo(() => from.distanceTo(to), [from, to]);
  const dir = useMemo(() => new THREE.Vector3().subVectors(to, from).normalize(), [from, to]);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return q;
  }, [dir]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.opacity = 0.3 + 0.2 * Math.sin(clock.elapsedTime * 2);
  });

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.015, 0.015, dist, 4]} />
      <meshBasicMaterial ref={matRef} color="#7c3aed" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
});

// ═══════════════════════════════════════════════
// MOVING KEY LIGHT
// ═══════════════════════════════════════════════
const MovingKeyLight = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(clock.elapsedTime * 0.2) * 12;
      lightRef.current.position.z = Math.cos(clock.elapsedTime * 0.2) * 12;
      lightRef.current.position.y = 18;
    }
  });
  return <pointLight ref={lightRef} color="#0066cc" intensity={6} distance={30} />;
};

// ═══════════════════════════════════════════════
// MAIN SCENE
// ═══════════════════════════════════════════════
export const SmartCityScene = () => {
  const cityGroupRef = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();
  const cameraRef = useRef(camera as THREE.PerspectiveCamera);

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x020817, 0.018);
    return () => { scene.fog = null; };
  }, [scene]);

  useScrollAnimation(cityGroupRef, cameraRef);

  // Energy beam vectors
  const burj = useMemo(() => new THREE.Vector3(0, 19, -6), []);
  const shard = useMemo(() => new THREE.Vector3(-6, 15, -4), []);
  const twisted = useMemo(() => new THREE.Vector3(6, 13, -4), []);
  const penta1 = useMemo(() => new THREE.Vector3(-5, 8, 5), []);
  const penta2 = useMemo(() => new THREE.Vector3(5, 8, 5), []);
  const energyT = useMemo(() => new THREE.Vector3(9, 11, 2), []);

  return (
    <>
      {/* Lighting */}
      <ambientLight color="#040d1a" intensity={0.8} />
      <directionalLight color="#4488cc" intensity={0.6} position={[15, 25, 10]} castShadow shadow-mapSize={[2048, 2048]} />
      <hemisphereLight args={['#001133', '#000000', 0.5]} />
      <directionalLight color="#ff6600" intensity={0.3} position={[-20, 10, -15]} />
      <pointLight color="#003d5c" intensity={8} distance={15} position={[-5, 2, -3]} />
      <pointLight color="#1a0040" intensity={8} distance={15} position={[5, 2, -3]} />
      <pointLight color="#002040" intensity={6} distance={12} position={[0, 2, 5]} />
      <MovingKeyLight />

      {/* City Group (GSAP scrolls this) */}
      <group ref={cityGroupRef} rotation={[0.25, 0, 0]}>
        <AnimatedGrid />
        <StarField />
        <FloatingParticles />
        <BackgroundCity />

        {/* 8 Hero Buildings */}
        <BurjKhalifaTower position={[0, 0, -6]} />
        <ShardBuilding position={[-6, 0, -4]} />
        <TwistedTower position={[6, 0, -4]} />
        <HelixCorporate position={[-3, 0, -8]} />
        <PixelTower position={[3, 0, -8]} />
        <StackedPlates position={[-9, 0, 2]} />
        <EnergyTower position={[9, 0, 2]} />
        <PentagonTower position={[-5, 0, 5]} />
        <PentagonTower position={[5, 0, 5]} />

        {/* Energy Beams */}
        <EnergyBeam from={burj} to={shard} />
        <EnergyBeam from={burj} to={twisted} />
        <EnergyBeam from={shard} to={penta1} />
        <EnergyBeam from={energyT} to={penta2} />
      </group>

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={2.0} blendFunction={BlendFunction.ADD} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0008, 0.0008] as any} />
        <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.04} />
        <Vignette darkness={0.55} offset={0.25} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </>
  );
};
