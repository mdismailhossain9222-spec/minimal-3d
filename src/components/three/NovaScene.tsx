import { Environment, Float, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, Suspense } from "react";
import { useLocation } from "react-router";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Shared                                                             */
/* ------------------------------------------------------------------ */

const VOID = "#0B0B10";

/** Cinematic key/fill/rim lighting — cool key, violet rim, low ambient. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} color="#BFD0FF" />
      <directionalLight position={[-8, 3, -6]} intensity={0.5} color="#9F6BFF" />
      <pointLight position={[2.5, 1.4, 3]} intensity={7} color="#6E7BFF" />
      <pointLight position={[-3.5, -1, 2.5]} intensity={4} color="#F0509B" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Faceted core — the hero object                                     */
/* ------------------------------------------------------------------ */

function NovaCore({ delay = 0 }: { delay?: number }) {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        g.scale,
        { x: 0.001, y: 0.001, z: 0.001 },
        { x: 1, y: 1, z: 1, duration: 1.6, delay, ease: "expo.out" },
      );
      gsap.fromTo(
        g.rotation,
        { y: -1.1 },
        { y: 0, duration: 2, delay, ease: "expo.out" },
      );
    });
    return () => ctx.revert();
  }, [delay]);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = t * 0.16;
    g.rotation.z = Math.sin(t * 0.3) * 0.06;
    g.position.y = Math.sin(t * 0.5) * 0.14;
  });

  return (
    <group ref={ref} position={[0, 0.35, 0]} scale={0.001}>
      <mesh>
        <icosahedronGeometry args={[1.42, 0]} />
        <meshStandardMaterial
          color="#191922"
          roughness={0.28}
          metalness={0.72}
          flatShading
        />
      </mesh>
      {/* Electric wire over the facets */}
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.43, 0)]} />
        <lineBasicMaterial color="#6E7BFF" transparent opacity={0.5} />
      </lineSegments>
      {/* Inner glow bead */}
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#6E7BFF"
          emissive="#6E7BFF"
          emissiveIntensity={1.4}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  opacity,
}: {
  radius: number;
  tilt: number;
  speed: number;
  color: string;
  opacity: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 12, 128]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Particles                                                          */
/* ------------------------------------------------------------------ */

function Particles({ count = 160 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#8FA0FF"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Pointer parallax                                                   */
/* ------------------------------------------------------------------ */

function PointerParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = gsap.utils.interpolate(g.rotation.y, state.pointer.x * 0.1, 0.045);
    g.rotation.x = gsap.utils.interpolate(g.rotation.x, -state.pointer.y * 0.07, 0.045);
  });
  return <group ref={ref}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

export default function NovaScene({ compact = false }: { compact?: boolean }) {
  const { pathname } = useLocation();
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <Canvas
      key={pathname}
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, compact ? 10 : 8.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Lights />
      <PointerParallax>
        <NovaCore delay={0.2} />
        <group position={[0, 0.35, 0]}>
          <OrbitRing radius={2.35} tilt={1.25} speed={0.24} color="#6E7BFF" opacity={0.55} />
          <OrbitRing radius={2.9} tilt={1.05} speed={-0.16} color="#9F6BFF" opacity={0.32} />
          <OrbitRing radius={3.45} tilt={1.42} speed={0.1} color="#F0509B" opacity={0.2} />
        </group>
        {!reduced && <Particles />}
      </PointerParallax>
      <ContactShadows
        position={[0, -2.3, 0]}
        opacity={0.5}
        scale={13}
        blur={2.8}
        far={4}
        resolution={512}
        color="#000000"
      />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
