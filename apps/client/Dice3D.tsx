import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface Dice3DProps {
  values: [number, number] | null;
  canRoll: boolean;
  onRoll: () => void;
}

const DOTS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.25, -0.25], [0.25, 0.25]],
  3: [[-0.25, -0.25], [0, 0], [0.25, 0.25]],
  4: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]],
  5: [[-0.25, -0.25], [0.25, -0.25], [0, 0], [-0.25, 0.25], [0.25, 0.25]],
  6: [[-0.25, -0.3], [0.25, -0.3], [-0.25, 0], [0.25, 0], [-0.25, 0.3], [0.25, 0.3]],
};

// Target rotations: which euler angles show each face on top
const FACE_ROT: Record<number, [number, number, number]> = {
  1: [0, 0, 0],
  2: [-Math.PI / 2, 0, 0],
  3: [0, 0, Math.PI / 2],
  4: [0, 0, -Math.PI / 2],
  5: [Math.PI / 2, 0, 0],
  6: [Math.PI, 0, 0],
};

function makeFaceTexture(value: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(4, 4, 248, 248, 24);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#1e293b';
  for (const [dx, dy] of DOTS[value] || []) {
    ctx.beginPath();
    ctx.arc(128 + dx * 160, 128 + dy * 160, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

function createDie(scene: THREE.Scene, x: number): THREE.Mesh {
  // Three.js BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
  // We want: +X=3, -X=4, +Y=1, -Y=6, +Z=2, -Z=5
  const mats = [
    new THREE.MeshStandardMaterial({ map: makeFaceTexture(3) }),
    new THREE.MeshStandardMaterial({ map: makeFaceTexture(4) }),
    new THREE.MeshStandardMaterial({ map: makeFaceTexture(1) }),
    new THREE.MeshStandardMaterial({ map: makeFaceTexture(6) }),
    new THREE.MeshStandardMaterial({ map: makeFaceTexture(2) }),
    new THREE.MeshStandardMaterial({ map: makeFaceTexture(5) }),
  ];
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const die = new THREE.Mesh(geo, mats);
  die.position.set(x, 0, 0);
  die.castShadow = true;
  scene.add(die);
  return die;
}

export default function Dice3D({ values, canRoll, onRoll }: Dice3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneData = useRef<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; die1: THREE.Mesh; die2: THREE.Mesh } | null>(null);
  const animFrame = useRef(0);
  const [rolling, setRolling] = useState(false);
  const [settled, setSettled] = useState(false);
  const prevKey = useRef('');

  // Init scene once
  useEffect(() => {
    if (!mountRef.current || sceneData.current) return;

    const w = 280, h = 160;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    renderer.domElement.style.borderRadius = '12px';

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 8, 5);
    dir.castShadow = true;
    scene.add(dir);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.8;
    floor.receiveShadow = true;
    scene.add(floor);

    const die1 = createDie(scene, -0.9);
    const die2 = createDie(scene, 0.9);

    sceneData.current = { scene, camera, renderer, die1, die2 };

    const loop = () => { animFrame.current = requestAnimationFrame(loop); renderer.render(scene, camera); };
    loop();

    return () => {
      cancelAnimationFrame(animFrame.current);
      renderer.dispose();
      if (mountRef.current) {
        const cv = mountRef.current.querySelector('canvas');
        if (cv) mountRef.current.removeChild(cv);
      }
      sceneData.current = null;
    };
  }, []);

  // Animate on new values
  useEffect(() => {
    if (!values || !sceneData.current) return;
    const key = `${values[0]}-${values[1]}-${Date.now()}`;
    if (prevKey.current === `${values[0]}-${values[1]}`) {
      // Same values but might be a new roll — check if we're already settled
      if (settled) return;
    }
    prevKey.current = `${values[0]}-${values[1]}`;

    setRolling(true);
    setSettled(false);

    const { die1, die2 } = sceneData.current;
    const dur = 1100;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const spin1 = [Math.PI * (3 + Math.random() * 5), Math.PI * (3 + Math.random() * 5), Math.PI * (2 + Math.random() * 3)];
    const spin2 = [Math.PI * (3 + Math.random() * 5), Math.PI * (3 + Math.random() * 5), Math.PI * (2 + Math.random() * 3)];
    const r1 = FACE_ROT[values[0]] || [0, 0, 0];
    const r2 = FACE_ROT[values[1]] || [0, 0, 0];
    const s1 = [die1.rotation.x, die1.rotation.y, die1.rotation.z];
    const s2 = [die2.rotation.x, die2.rotation.y, die2.rotation.z];

    const anim = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      const e = ease(t);
      die1.rotation.x = s1[0] + (spin1[0] + r1[0] - s1[0]) * e;
      die1.rotation.y = s1[1] + (spin1[1] + r1[1] - s1[1]) * e;
      die1.rotation.z = s1[2] + (spin1[2] + r1[2] - s1[2]) * e;
      die2.rotation.x = s2[0] + (spin2[0] + r2[0] - s2[0]) * e;
      die2.rotation.y = s2[1] + (spin2[1] + r2[1] - s2[1]) * e;
      die2.rotation.z = s2[2] + (spin2[2] + r2[2] - s2[2]) * e;
      const bounce = Math.sin(t * Math.PI * 3) * (1 - t) * 1.5;
      die1.position.y = bounce;
      die2.position.y = bounce;
      if (t < 1) requestAnimationFrame(anim);
      else { die1.position.y = 0; die2.position.y = 0; setRolling(false); setSettled(true); }
    };
    requestAnimationFrame(anim);
  }, [values]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={mountRef} className="rounded-xl overflow-hidden shadow-inner" />
      {settled && values && (
        <p className="text-lg font-bold text-emerald-700">
          {values[0]} + {values[1]} = {values[0] + values[1]}
          {values[0] === values[1] && <span className="ml-2 text-yellow-600">DOUBLES!</span>}
        </p>
      )}
      <button onClick={() => { if (canRoll && !rolling) { setSettled(false); setRolling(true); onRoll(); } }}
        disabled={!canRoll || rolling}
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md">
        {rolling ? '🎲 Rolling...' : canRoll ? '🎲 Roll Dice' : '⏳ Wait...'}
      </button>
    </div>
  );
}
