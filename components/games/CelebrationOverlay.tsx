"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import { useEffect } from "react";
import type { LevelSeed } from "@/data/journey_seed";

interface CelebrationOverlayProps {
  isVisible: boolean;
  level: LevelSeed | null;
  xpGained: number;
  onDismiss: () => void;
}

// Generate confetti pieces with random properties
function generateConfetti(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 360,
    colorClass: `confetti-${(i % 8) + 1}`,
  }));
}

// Synthesize a loud, pleasant victory fanfare sound using Web Audio API
function playVictorySound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Rich Level-Up Fanfare Sequence with harmonic chord burst
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.15, vol: 0.6 },  // C5
      { freq: 659.25, time: 0.12, dur: 0.15, vol: 0.6 }, // E5
      { freq: 783.99, time: 0.24, dur: 0.18, vol: 0.7 }, // G5
      { freq: 1046.5, time: 0.38, dur: 0.65, vol: 0.9 }, // C6 (Finale)
      { freq: 1318.5, time: 0.42, dur: 0.60, vol: 0.6 }, // E6 (Chord Layer)
      { freq: 1567.9, time: 0.46, dur: 0.60, vol: 0.5 }, // G6 (Sparkle Layer)
    ];

    notes.forEach(({ freq, time, dur, vol }) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "triangle";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(freq, now + time);
      osc2.frequency.setValueAtTime(freq * 1.002, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(vol, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now + time);
      osc2.start(now + time);
      osc1.stop(now + time + dur + 0.05);
      osc2.stop(now + time + dur + 0.05);
    });
  } catch (err) {
    console.error("Audio playback error:", err);
  }
}

export default function CelebrationOverlay({
  isVisible,
  level,
  xpGained,
  onDismiss,
}: CelebrationOverlayProps) {
  const confetti = generateConfetti(30);

  // Auto-dismiss after 4 seconds and play sound effect
  useEffect(() => {
    if (isVisible) {
      playVictorySound();
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && level && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                className={`absolute rounded-sm ${piece.colorClass}`}
                style={{
                  left: `${piece.x}%`,
                  top: -20,
                  width: piece.size,
                  height: piece.size * 0.6,
                  transform: `rotate(${piece.rotation}deg)`,
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: "100vh",
                  rotate: 720,
                  opacity: [1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.2,
            }}
          >
            {/* Star burst */}
            <motion.div
              className="relative mb-6"
              initial={{ rotate: 0, scale: 0 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: 0.3,
              }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-2xl shadow-amber-500/50">
                <span className="text-4xl">
                  {level.type === "boss" ? "👑" : "⭐"}
                </span>
              </div>

              {/* Orbiting sparkles */}
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: [0, Math.cos((angle * Math.PI) / 180) * 60],
                    y: [0, Math.sin((angle * Math.PI) / 180) * 60],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-2xl font-black text-white mb-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {level.type === "boss"
                ? "🎉 BOSS DEFEATED!"
                : "🎉 LEVEL UNLOCKED!"}
            </motion.h2>

            {/* Level name */}
            <motion.p
              className="text-lg font-bold text-amber-400 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Level {level.order_index}: {level.title}
            </motion.p>

            {/* XP Gained */}
            <motion.div
              className="flex items-center gap-2 bg-amber-500/20 rounded-2xl px-5 py-3 border border-amber-500/40"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.7,
              }}
            >
              <Star className="w-6 h-6 text-amber-400" fill="#fbbf24" />
              <span className="text-xl font-black text-amber-300">
                +{xpGained} XP
              </span>
            </motion.div>

            {/* Tap to dismiss hint */}
            <motion.p
              className="mt-6 text-xs text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
