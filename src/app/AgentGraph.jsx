"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const BONE = new THREE.Color("#e9e5dc");
const DIM = new THREE.Color("#3a3833");
const SIGNAL = new THREE.Color("#f5a524");

// A seeded random so the graph looks the same on every visit.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildGraph(count) {
  const rand = rng(42);
  const nodes = [];
  // Fibonacci sphere with jitter: even coverage, still organic.
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * Math.PI * (3 - Math.sqrt(5));
    const radius = 2.1 + (rand() - 0.5) * 0.9;
    nodes.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius * 0.85,
        Math.sin(theta) * r * radius
      )
    );
  }
  // Connect each node to its nearest neighbours.
  const edgeSet = new Set();
  const adj = nodes.map(() => []);
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => [j, a.distanceToSquared(b)])
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 3);
    nearest.forEach(([j]) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        adj[i].push(j);
        adj[j].push(i);
      }
    });
  });
  const edges = [...edgeSet].map((k) => k.split("-").map(Number));
  return { nodes, edges, adj };
}

function makeGlowTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function Graph({ count, reduced }) {
  const { nodes, edges, adj } = useMemo(() => buildGraph(count), [count]);
  const group = useRef();
  const nodeMesh = useRef();
  const lineGeo = useRef();
  const pulseRefs = useRef([]);
  const glow = useMemo(() => (typeof document !== "undefined" ? makeGlowTexture() : null), []);
  const { pointer } = useThree();

  // Heat per node: 1 when a signal arrives, decays back to 0.
  const heat = useMemo(() => new Float32Array(nodes.length), [nodes.length]);
  const start = useRef(null);
  const PULSES = reduced ? 0 : 5;

  // Each pulse walks the graph one edge at a time, like an agent hopping between tools.
  const pulses = useMemo(() => {
    const rand = rng(7);
    return Array.from({ length: PULSES }, (_, i) => {
      const from = Math.floor(rand() * nodes.length);
      const to = adj[from][0];
      return { from, to, t: rand(), speed: 0.55 + rand() * 0.35, rand: rng(100 + i) };
    });
  }, [PULSES, nodes.length, adj]);

  const linePositions = useMemo(() => new Float32Array(edges.length * 6), [edges.length]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const current = useMemo(() => nodes.map(() => new THREE.Vector3()), [nodes]);

  useEffect(() => {
    if (!nodeMesh.current) return;
    nodes.forEach((_, i) => nodeMesh.current.setColorAt(i, DIM));
  }, [nodes]);

  useFrame((state, delta) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - start.current;
    // Assembly: nodes travel out from the centre over the first 1.8s.
    const k = reduced ? 1 : Math.min(elapsed / 1.8, 1);
    const ease = 1 - Math.pow(1 - k, 4);

    nodes.forEach((p, i) => {
      const stagger = reduced ? 1 : Math.min(Math.max((ease * 1.4) - (i / nodes.length) * 0.4, 0), 1);
      current[i].copy(p).multiplyScalar(stagger);
    });

    // Pulses
    pulses.forEach((pulse, idx) => {
      pulse.t += delta * pulse.speed;
      if (pulse.t >= 1) {
        heat[pulse.to] = 1;
        const options = adj[pulse.to].filter((n) => n !== pulse.from);
        const pool = options.length ? options : adj[pulse.to];
        pulse.from = pulse.to;
        pulse.to = pool[Math.floor(pulse.rand() * pool.length)];
        pulse.t = 0;
      }
      const m = pulseRefs.current[idx];
      if (m) {
        m.position.lerpVectors(current[pulse.from], current[pulse.to], pulse.t);
        m.visible = k >= 1;
      }
    });

    // Nodes
    for (let i = 0; i < nodes.length; i++) {
      heat[i] = Math.max(0, heat[i] - delta * 0.9);
      const h = heat[i];
      dummy.position.copy(current[i]);
      dummy.scale.setScalar(0.028 + h * 0.05);
      dummy.updateMatrix();
      nodeMesh.current.setMatrixAt(i, dummy.matrix);
      color.copy(DIM).lerp(BONE, 0.42).lerp(SIGNAL, h);
      nodeMesh.current.setColorAt(i, color);
    }
    nodeMesh.current.instanceMatrix.needsUpdate = true;
    if (nodeMesh.current.instanceColor) nodeMesh.current.instanceColor.needsUpdate = true;

    // Edges
    edges.forEach(([a, b], e) => {
      linePositions.set([current[a].x, current[a].y, current[a].z, current[b].x, current[b].y, current[b].z], e * 6);
    });
    if (lineGeo.current) lineGeo.current.attributes.position.needsUpdate = true;

    // Slow turn, nudged by the cursor.
    if (group.current && !reduced) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x += (pointer.y * 0.25 - group.current.rotation.x) * 0.04;
      group.current.rotation.z += (-pointer.x * 0.12 - group.current.rotation.z) * 0.04;
    }
  });

  return (
    <group ref={group} rotation={[0.2, 0, 0]}>
      <lineSegments>
        <bufferGeometry ref={lineGeo}>
          <bufferAttribute attach="attributes-position" count={edges.length * 2} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#e9e5dc" transparent opacity={0.13} />
      </lineSegments>

      <instancedMesh ref={nodeMesh} args={[null, null, nodes.length]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {pulses.map((_, i) => (
        <group key={i} ref={(el) => (pulseRefs.current[i] = el)} visible={false}>
          <mesh>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={SIGNAL} toneMapped={false} />
          </mesh>
          {glow && (
            <sprite scale={[0.55, 0.55, 0.55]}>
              <spriteMaterial map={glow} color={SIGNAL} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.9} />
            </sprite>
          )}
        </group>
      ))}
    </group>
  );
}

export default function AgentGraph({ compact = false }) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = compact || (typeof window !== "undefined" && window.innerWidth < 768);

  return (
    <Canvas
      camera={{ position: [0, 0, compact ? 6.2 : small ? 7 : 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <Graph count={small ? 42 : 64} reduced={reduced} />
    </Canvas>
  );
}
