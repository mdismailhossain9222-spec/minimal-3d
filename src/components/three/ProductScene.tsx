import { Environment, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

/**
 * A quiet, well-lit turntable for a single NOVA object. The geometry is a
 * stylised "engineered" solid — faceted, matte, one electric edge.
 */

function ProductObject({ autoRotate, interactive }: { autoRotate: boolean; interactive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const g = group.current;
    const m = inner.current;
    if (!g || !m) return;
    if (autoRotate) g.rotation.y = state.clock.elapsedTime * 0.35;
    if (interactive) {
      g.rotation.y += state.pointer.x * 0.003;
      g.rotation.x = state.pointer.y * 0.12;
    }
    m.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group ref={group} rotation={[0.1, 0.6, 0]}>
      <mesh ref={inner}>
        <cylinderGeometry args={[0.95, 1.15, 1.7, 6]} />
        <meshStandardMaterial color="#1C1C24" roughness={0.3} metalness={0.65} flatShading />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.CylinderGeometry(0.95, 1.15, 1.7, 6)]} />
        <lineBasicMaterial color="#6E7BFF" transparent opacity={0.6} />
      </lineSegments>
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[1.2, 1.28, 0.1, 6]} />
        <meshStandardMaterial color="#101016" roughness={0.5} metalness={0.4} flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color="#6E7BFF"
          emissive="#6E7BFF"
          emissiveIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

export default function ProductScene({
  autoRotate = true,
  interactive = true,
  className,
}: {
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
}) {
  const dpr = useMemo<[number, number]>(() => [1, 2], []);
  return (
    <div className={className}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.9, 4.6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 3]} intensity={1.2} color="#CFE0FF" />
        <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#9F6BFF" />
        <pointLight position={[2, 1, 3]} intensity={5} color="#6E7BFF" />
        <ProductObject autoRotate={autoRotate} interactive={interactive} />
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.55}
          scale={6}
          blur={2.4}
          far={3}
          resolution={512}
          color="#000000"
        />
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
