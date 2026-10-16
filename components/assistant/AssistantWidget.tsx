"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo3DCanvas from "./Logo3DCanvas";
import {
  hasGreetedInSession,
  markGreetedInSession,
  shouldShowHourlyReminder,
  recordReminderShown,
  getActiveTaskInfo,
  type ActiveTaskDetails,
} from "@/lib/assistantState";
import type { UserProgress } from "@/lib/checkUnlocks";
import type { UserTrackingData } from "@/lib/evaluateRequirement";
import { supabase } from "@/lib/supabase";
import { ArrowRight, X, Sparkles, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

interface AssistantWidgetProps {
  user: any;
}

// Clean emojis or symbols from text before reading aloud
function sanitizeSpeechText(text: string): string {
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    )
    .trim();
}

// Play a pleasant two-tone AI chime via Web Audio API for instant feedback
function playAssistantChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Ignore context restrictions safely
  }
}

export default function AssistantWidget({ user }: AssistantWidgetProps) {
  const [phase, setPhase] = useState<"HERO_SPLASH" | "DOCKED" | "MINIMIZED">(
    "MINIMIZED",
  );
  const [taskDetails, setTaskDetails] = useState<ActiveTaskDetails | null>(
    null,
  );

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("genestac_assistant_muted") === "true";
    }
    return false;
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const lastSpokenKeyRef = useRef<string>("");

  // Refs to hold latest values without causing speakTask to recreate
  const taskDetailsRef = useRef<ActiveTaskDetails | null>(null);
  const displayNameRef = useRef<string>("Champion");
  const phaseRef = useRef<"HERO_SPLASH" | "DOCKED" | "MINIMIZED">("MINIMIZED");
  const isMutedRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const hasUnlockedRef = useRef(false);

  // Extract display name
  const displayName = useMemo(() => {
    if (!user) return "Champion";
    return (
      user.user_metadata?.full_name?.split(" ")[0] ||
      user.email?.split("@")[0] ||
      "Champion"
    );
  }, [user]);

  // Keep refs in sync with state
  useEffect(() => {
    taskDetailsRef.current = taskDetails;
  }, [taskDetails]);
  useEffect(() => {
    displayNameRef.current = displayName;
  }, [displayName]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Load user progress & evaluate current task
  const refreshTaskInfo = useCallback(async () => {
    if (!user) return;
    try {
      const userId = user.id;
      const isBypass = userId === "mock-user-7788";

      if (isBypass) {
        const todayStr = new Date().toISOString().split("T")[0];
        const mockProgress: UserProgress = {
          current_level_id: 2,
          total_xp: 20,
          unlocked_level_ids: [1, 2],
          completed_level_ids: [1],
        };
        const mockTracking: UserTrackingData = {
          weightHistory: [{ date: todayStr, weight: 70 }],
          waterLogs: [{ date: todayStr, amount: 0.5 }],
          stepsLogs: [],
          sleepLogs: [],
          meals: [],
          habitLogs: [],
          totalXp: 20,
        };
        const taskInfo = getActiveTaskInfo(mockProgress, mockTracking);
        setTaskDetails(taskInfo);
        return;
      }

      // Fetch user_plans and user_progress from database
      const [{ data: userPlan }, { data: userData }, { data: progressData }] =
        await Promise.all([
          supabase
            .from("user_plans")
            .select(
              "steps_history, water_history, sleep_history, measurement_history",
            )
            .eq("user_id", userId)
            .maybeSingle(),
          supabase
            .from("users")
            .select("weight_loss_journey")
            .eq("id", userId)
            .maybeSingle(),
          supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle(),
        ]);

      const journey = (userData?.weight_loss_journey || {}) as any;

      const userProgress: UserProgress = {
        current_level_id: progressData?.current_level_id || 1,
        total_xp: progressData?.total_xp || 0,
        unlocked_level_ids: progressData?.unlocked_level_ids || [1],
        completed_level_ids: progressData?.completed_level_ids || [],
      };

      const extractArr = (data: any) => (Array.isArray(data) ? data : []);

      const trackingData: UserTrackingData = {
        weightHistory: extractArr(journey.history),
        waterLogs: extractArr(userPlan?.water_history || journey.waterLogs),
        stepsLogs: extractArr(userPlan?.steps_history),
        sleepLogs: extractArr(userPlan?.sleep_history || journey.sleepLogs),
        meals: extractArr(journey.meals),
        habitLogs: extractArr(journey.habitLogs),
        totalXp: userProgress.total_xp,
      };

      const taskInfo = getActiveTaskInfo(userProgress, trackingData);
      setTaskDetails(taskInfo);
    } catch {
      // Fallback
    }
  }, [user]);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback speech synthesis engine
  const fallbackSpeechSynthesis = useCallback(
    (spokenText: string, currentKey: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        return;
      }

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch {}

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }
    },
    [],
  );

  // Primary speak function — HTML5 Web Audio TTS with SpeechSynthesis fallback
  const speakTask = useCallback(
    (force: boolean = false) => {
      if (typeof window === "undefined") return;

      const details = taskDetailsRef.current;
      if (!details) return;

      const currentPhase = phaseRef.current;
      const currentMuted = isMutedRef.current;

      const cleanTitle = sanitizeSpeechText(details.level.title);
      const cleanDesc = sanitizeSpeechText(details.level.description);
      const spokenText = `Hey ${displayNameRef.current}! Your next task is ${cleanTitle}. ${cleanDesc}`;
      const currentKey = `${details.level.id}-${cleanTitle}-${currentPhase}`;

      // Don't re-speak the exact same prompt unless forced
      if (!force && lastSpokenKeyRef.current === currentKey) return;

      if (currentMuted && !force) return;

      // 1. Play pleasant AI chime for activation feedback
      playAssistantChime();

      // Stop any ongoing HTML5 audio playback
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        } catch {}
      }

      lastSpokenKeyRef.current = currentKey;

      // Primary: High quality Same-Origin Audio TTS via /api/tts (100% reliable on Linux/Chrome/Firefox/Safari)
      try {
        const ttsUrl = `/api/tts?text=${encodeURIComponent(spokenText)}`;

        const audio = new Audio(ttsUrl);
        currentAudioRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          isSpeakingRef.current = true;
        };
        audio.onended = () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          currentAudioRef.current = null;
        };
        audio.onerror = () => {
          fallbackSpeechSynthesis(spokenText, currentKey);
        };

        audio.play().catch(() => {
          fallbackSpeechSynthesis(spokenText, currentKey);
        });
      } catch {
        fallbackSpeechSynthesis(spokenText, currentKey);
      }
    },
    [fallbackSpeechSynthesis],
  );

  // Toggle Mute State
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (typeof window !== "undefined") {
        localStorage.setItem("genestac_assistant_muted", String(next));
      }
      if (next && typeof window !== "undefined") {
        if (currentAudioRef.current) {
          try {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
          } catch {}
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  // Handle manually triggering voice when speaker icon is clicked
  const handleSpeakerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      hasUnlockedRef.current = true;
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        } catch {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.resume();
      }
      if (isMutedRef.current) {
        isMutedRef.current = false;
        setIsMuted(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("genestac_assistant_muted", "false");
        }
        lastSpokenKeyRef.current = "";
        speakTask(true);
      } else if (isSpeakingRef.current) {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      } else {
        lastSpokenKeyRef.current = "";
        speakTask(true);
      }
    },
    [speakTask],
  );

  // User gesture unlock — fires once on first click/tap anywhere on page.
  // Browsers block speech until a user gesture occurs. speakTask() MUST be
  // called synchronously here (no setTimeout) — deferring it even by a tick
  // causes browsers to no longer treat the speak() call as gesture-triggered,
  // and it gets silently blocked. If taskDetails hasn't loaded yet, speakTask
  // just no-ops safely; the taskDetails/phase effect below will pick it up
  // once data arrives, now that hasUnlockedRef is true.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const unlockAudio = () => {
      hasUnlockedRef.current = true;
      window.speechSynthesis.resume();
      lastSpokenKeyRef.current = "";
      speakTask();
    };
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  // Handle Initial Login Greeting Sequence
  useEffect(() => {
    if (!user) return;
    refreshTaskInfo();

    const alreadyGreeted = hasGreetedInSession();
    if (!alreadyGreeted) {
      setPhase("HERO_SPLASH");
      markGreetedInSession();
      const timer = setTimeout(() => {
        setPhase("DOCKED");
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setPhase("DOCKED");
    }
  }, [user, refreshTaskInfo]);

  // Hourly Reminder Check Loop
  useEffect(() => {
    if (!user) return;
    const checkHourlyNudge = () => {
      if (
        shouldShowHourlyReminder() &&
        taskDetails &&
        !taskDetails.isCompleted
      ) {
        recordReminderShown();
        if (phase === "MINIMIZED") setPhase("DOCKED");
      }
    };
    const interval = setInterval(checkHourlyNudge, 60000);
    return () => clearInterval(interval);
  }, [user, taskDetails, phase]);

  // Listen for real-time data log events to refresh task info instantly
  useEffect(() => {
    const handleDataLogged = () => refreshTaskInfo();
    window.addEventListener("genestac:data_logged", handleDataLogged);
    return () =>
      window.removeEventListener("genestac:data_logged", handleDataLogged);
  }, [refreshTaskInfo]);

  // Trigger speech when task or phase changes (only after browser gesture unlock)
  useEffect(() => {
    if (
      taskDetails &&
      (phase === "HERO_SPLASH" || phase === "DOCKED") &&
      hasUnlockedRef.current
    ) {
      speakTask();
    }
  }, [taskDetails, phase, speakTask]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!user) return null;

  return (
    <>
      <AnimatePresence>
        {/* ============================================================ */}
        {/* PHASE 1: HERO GREETING SPLASH OVERLAY                         */}
        {/* ============================================================ */}
        {phase === "HERO_SPLASH" && (
          <motion.div
            key="hero-splash"
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              onClick={handleSpeakerClick}
              className="relative z-10 flex flex-col items-center text-center max-w-sm bg-slate-950/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl cursor-pointer"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Speaker Control Button */}
              <button
                onClick={handleSpeakerClick}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-400 hover:bg-slate-800 transition z-10 cursor-pointer"
                title={
                  isMuted
                    ? "Unmute Voice"
                    : isSpeaking
                      ? "Stop Speaking"
                      : "Read Aloud"
                }
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2
                    className={`w-4 h-4 ${
                      isSpeaking ? "animate-pulse text-amber-300" : ""
                    }`}
                  />
                )}
              </button>

              {/* 3D Neural Core Logo */}
              <div className="relative mb-2">
                <Logo3DCanvas size={150} interactive={true} pulseGlow={true} />
              </div>

              {/* Greeting */}
              <h2 className="text-xl font-extrabold text-white mb-1 tracking-tight">
                Hello,{" "}
                <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                  {displayName}
                </span>
                !
              </h2>

              {taskDetails && (
                <div className="my-3 px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                    {taskDetails.level.icon} {taskDetails.level.title}
                  </p>
                  <p className="text-xs font-semibold text-slate-200">
                    {taskDetails.level.description}
                  </p>
                </div>
              )}

              {/* Action Button */}
              {taskDetails && (
                <Link
                  href={taskDetails.actionRoute}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhase("DOCKED");
                  }}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  {taskDetails.actionLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* PHASE 2 & 3: LEFT-ALIGNED FLOATING LOGO & SPEECH BUBBLE      */}
      {/* ============================================================ */}
      <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-[100] pointer-events-auto flex flex-col items-start gap-2">
        {/* Animated Speech Text Bubble — Appears ONLY while speaking */}
        <AnimatePresence>
          {isSpeaking && taskDetails && (
            <motion.div
              key="speaking-bubble"
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.92 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              onClick={handleSpeakerClick}
              className="bg-slate-950/95 border border-amber-500/40 text-white rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl max-w-[280px] sm:max-w-xs relative flex flex-col gap-1.5 cursor-pointer mb-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  <span>
                    {taskDetails.level.icon} {taskDetails.level.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      typeof window !== "undefined" &&
                      "speechSynthesis" in window
                    ) {
                      window.speechSynthesis.cancel();
                    }
                    if (currentAudioRef.current) {
                      currentAudioRef.current.pause();
                    }
                    setIsSpeaking(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Stop Speaking"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {taskDetails.level.description}
              </p>

              <Link
                href={taskDetails.actionRoute}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 self-start inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2"
              >
                {taskDetails.actionLabel}
                <ArrowRight className="w-3 h-3" />
              </Link>

              {/* Speech Bubble Pointer */}
              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-slate-950 border-r border-b border-amber-500/40 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Floating AI Logo Button */}
        <motion.button
          key="left-ai-logo-btn"
          onClick={handleSpeakerClick}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-950/95 border border-amber-500/40 text-white shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.06 }}
          title={
            isSpeaking ? "Stop Speaking" : "AI Health Assistant - Tap to Speak"
          }
        >
          {/* Outer Glowing Ring */}
          <span
            className={`absolute inset-0 rounded-full border ${
              isSpeaking
                ? "border-amber-400 animate-ping opacity-75"
                : "border-amber-500/30 animate-pulse"
            }`}
          />

          {/* 3D Neural Logo Canvas */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
            <Logo3DCanvas size={36} interactive={false} pulseGlow={true} />
          </div>

          {/* Sparkle / Speaking Badge */}
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 shadow-md">
            {isSpeaking ? (
              <Volume2 className="w-2.5 h-2.5 animate-pulse text-slate-950" />
            ) : (
              <Sparkles className="w-2.5 h-2.5 text-slate-950" />
            )}
          </span>
        </motion.button>
      </div>
    </>
  );
}
