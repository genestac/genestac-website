"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Logo3DCanvasProps {
  size?: number; // Size in pixels
  interactive?: boolean;
  pulseGlow?: boolean;
}

export default function Logo3DCanvas({
  size = 140,
  interactive = true,
  pulseGlow = true,
}: Logo3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ---------- Three.js Setup ----------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    // Clear existing canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    renderer.domElement.style.filter =
      "drop-shadow(0 0 18px rgba(255,176,32,0.35)) drop-shadow(0 0 40px rgba(255,140,20,0.18))";

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const GOLD = new THREE.Color(0xffb020);
    const PALE = new THREE.Color(0xffe3a8);
    const HOT = new THREE.Color(0xfff3d6);

    // ---------- 1. Fine Wire Rings (Shell of Arcs) ----------
    const RING_COUNT = 46;
    const RING_RADIUS = 2.15;
    const rings: (THREE.LineLoop | THREE.Mesh)[] = [];
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    function randomAxis() {
      const v = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      return v.normalize();
    }

    for (let i = 0; i < RING_COUNT; i++) {
      const segs = 64;
      const r = RING_RADIUS * (0.82 + Math.random() * 0.34);
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geometriesToDispose.push(geo);

      const mix = Math.random();
      const col = GOLD.clone().lerp(PALE, mix * 0.6);
      const mat = new THREE.LineBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.1 + Math.random() * 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materialsToDispose.push(mat);

      const line = new THREE.LineLoop(geo, mat);
      line.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        randomAxis()
      );
      line.userData.spin = (Math.random() - 0.5) * 0.8;
      line.userData.axis = randomAxis();
      line.userData.jitterPhase = Math.random() * Math.PI * 2;
      line.userData.jitterSpeed = 2.5 + Math.random() * 5.0;
      ringGroup.add(line);
      rings.push(line);
    }

    // ---------- 2. Bolder Sweeping Bands ----------
    const BIG_COUNT = 5;
    for (let i = 0; i < BIG_COUNT; i++) {
      const r = RING_RADIUS * (1.02 + Math.random() * 0.18);
      const torusGeo = new THREE.TorusGeometry(r, 0.008, 6, 96);
      geometriesToDispose.push(torusGeo);

      const torusMat = new THREE.MeshBasicMaterial({
        color: HOT.clone().lerp(GOLD, Math.random() * 0.5),
        transparent: true,
        opacity: 0.5 + Math.random() * 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materialsToDispose.push(torusMat);

      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        randomAxis()
      );
      torus.userData.spin = (Math.random() - 0.5) * 0.6;
      torus.userData.axis = randomAxis();
      torus.userData.jitterPhase = Math.random() * Math.PI * 2;
      torus.userData.jitterSpeed = 2.0 + Math.random() * 4.0;
      ringGroup.add(torus);
      rings.push(torus);
    }

    // ---------- 3. Speckled Data Points Across Sphere Shell ----------
    const PARTICLE_COUNT = 1400;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = RING_RADIUS * (0.78 + Math.random() * 0.42);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    geometriesToDispose.push(pGeo);

    const pMat = new THREE.PointsMaterial({
      color: HOT,
      size: 0.028,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    materialsToDispose.push(pMat);

    const particles = new THREE.Points(pGeo, pMat);
    coreGroup.add(particles);

    // ---------- 4. Bright Neural Core ----------
    const coreGeo = new THREE.IcosahedronGeometry(0.42, 3);
    geometriesToDispose.push(coreGeo);
    const coreMat = new THREE.MeshBasicMaterial({
      color: HOT,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsToDispose.push(coreMat);
    const core = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(core);

    const coreGlowGeo = new THREE.IcosahedronGeometry(0.75, 2);
    geometriesToDispose.push(coreGlowGeo);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: GOLD,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsToDispose.push(coreGlowMat);
    const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    coreGroup.add(coreGlow);

    // ---------- 5. Distant Amber Dust ----------
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPos[i * 3 + 2] = r * Math.cos(phi);
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    geometriesToDispose.push(dustGeo);

    const dustMat = new THREE.PointsMaterial({
      color: 0x8a5a20,
      size: 0.015,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsToDispose.push(dustMat);

    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ---------- Mouse Movement Listener ----------
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = y * 0.6;
      mouseRef.current.targetY = x * 0.6;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ---------- Animation Loop ----------
    let animationFrameId: number;
    const timer = new THREE.Timer();
    let frame = 0;

    let smoothBass = 0;
    let smoothVol = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();
      frame++;

      // Fast dynamic ambient pulsation mode with multiple harmonics
      const bass = 0.16 + 0.12 * Math.sin(t * 1.8) + 0.06 * Math.sin(t * 4.3 + 1);
      const mid = 0.12 + 0.1 * Math.sin(t * 2.6 + 1.3) + 0.05 * Math.sin(t * 6.1);
      const treble = 0.1 + 0.09 * Math.sin(t * 3.7 + 2.1) + 0.06 * Math.sin(t * 8.9);
      const vol = (bass + mid + treble) / 3;

      smoothBass += (bass - smoothBass) * 0.3;
      smoothVol += (vol - smoothVol) * 0.25;

      // Mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      // Rings spin fast & randomly on their axes with per-ring jitter
      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];
        const axis = (r.userData.axis as THREE.Vector3) || new THREE.Vector3(0, 1, 0);
        const spin = (r.userData.spin as number) || 0.3;
        const jitterSpeed = (r.userData.jitterSpeed as number) || 3.0;
        const jitterPhase = (r.userData.jitterPhase as number) || 0;
        const jitter = Math.sin(t * jitterSpeed + jitterPhase) + 0.5 * Math.cos(t * jitterSpeed * 1.7);
        const speedMul = 1.4 + 1.2 * Math.abs(jitter);
        r.rotateOnAxis(axis, spin * 0.06 * speedMul);
      }

      // Fast multi-axis ring group rotation & erratic tilt
      ringGroup.rotation.y = t * 0.35 + Math.sin(t * 2.8) * 0.3 + Math.cos(t * 4.1) * 0.15;
      ringGroup.rotation.x = Math.sin(t * 1.2) * 0.4 + Math.cos(t * 2.5) * 0.2;
      ringGroup.rotation.z = Math.cos(t * 0.9) * 0.25;

      // Core pulses rapidly with bass, brightens with volume
      if (pulseGlow) {
        const coreScale = 1 + smoothBass * 0.8 + 0.04 * Math.sin(t * 7.5);
        core.scale.setScalar(coreScale);
        coreGlow.scale.setScalar(1 + smoothBass * 1.3 + smoothVol * 0.4);
        coreGlowMat.opacity = 0.18 + smoothVol * 0.38;
        coreMat.opacity = 0.78 + smoothVol * 0.22;
      }

      // Fast particle shimmer & multi-axis spin
      pMat.size = 0.024 + treble * 0.06;
      pMat.opacity = 0.55 + treble * 0.4 + 0.25 * Math.sin(t * 9) + 0.15 * Math.sin(t * 13.7);
      particles.rotation.y = t * 0.25 + Math.sin(t * 3.5) * 0.2;
      particles.rotation.x = Math.sin(t * 1.5) * 0.25;
      particles.rotation.z = Math.cos(t * 1.1) * 0.18;

      // Whole group rotates faster with erratic high-speed wobble & scale pulse
      coreGroup.scale.setScalar(1 + smoothVol * 0.12 + 0.03 * Math.sin(t * 8));
      coreGroup.rotation.y = t * 0.22 + Math.sin(t * 2.1) * 0.18 + mouseRef.current.y;
      coreGroup.rotation.x = Math.sin(t * 1.4) * 0.12 + mouseRef.current.x;

      dust.rotation.y = t * 0.04;

      // Glow drop shadow filter strength
      if (frame % 3 === 0) {
        const glow = 14 + smoothVol * 28;
        renderer.domElement.style.filter = `drop-shadow(0 0 ${glow}px rgba(255,176,32,0.45)) drop-shadow(0 0 ${
          glow * 2.2
        }px rgba(255,140,20,0.22))`;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
    };
  }, [size, interactive, pulseGlow]);

  return (
    <div
      ref={mountRef}
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{ width: size, height: size }}
    />
  );
}

