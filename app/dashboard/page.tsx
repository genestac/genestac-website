"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  RefreshCw,
  Target,
  TrendingDown,
  Flame,
  Plus,
  X,
  Award,
  Sparkles,
  Camera,
  Utensils,
  Image as ImageIcon,
  Loader2,
  Droplet,
  Moon,
  Ruler,
  CheckSquare,
  Check,
  Footprints,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type WeightLog = {
  date: string;
  weight: number;
  note?: string;
  image_url?: string;
  imageUrl?: string;
};

type StepLog = {
  date: string;
  steps: number;
};


type MealLog = {
  id: string;
  date: string;
  mealType?: "Morning" | "Lunch" | "Snacks" | "Dinner";
  description: string;
  calories: number;
  feedback: string;
};

type WaterLog = {
  date: string;
  amount: number; // in Liters
};

type SleepLog = {
  date: string;
  hours: number;
};

type MeasurementLog = {
  date: string;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
};

type HabitLog = {
  date: string;
  habits: Record<string, boolean>;
};

type WeightJourney = {
  targetGoal?: number;
  history: WeightLog[];
  meals?: MealLog[];
  waterGoal?: number; // in Liters
  waterLogs?: WaterLog[];
  sleepLogs?: SleepLog[];
  measurements?: MeasurementLog[];
  habitLogs?: HabitLog[];
};

type RangeKey = "7d" | "30d" | "90d" | "all";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "all", label: "All" },
];

// Weight-loss milestones, checked against total kg lost so far
const WEIGHT_MILESTONES = [2, 5, 10, 15, 20, 25, 30];
// Streak milestones, checked against the current logging streak
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [journey, setJourney] = useState<WeightJourney>({ history: [] });
  const [todayWeight, setTodayWeight] = useState<string>("");
  const [todayNote, setTodayNote] = useState<string>("");
  const [targetGoalInput, setTargetGoalInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [range, setRange] = useState<RangeKey>("all");

  // Meal Tracking State
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [mealDescription, setMealDescription] = useState("");
  const [mealType, setMealType] = useState<
    "Morning" | "Lunch" | "Snacks" | "Dinner"
  >("Morning");
  const [analyzingMeal, setAnalyzingMeal] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);

  // Photo Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);

  // Water Tracker State
  const [waterToday, setWaterToday] = useState<number>(0); // in Liters
  const [savingWater, setSavingWater] = useState(false);
  const [isWaterHistoryModalOpen, setIsWaterHistoryModalOpen] = useState(false);

  // Meal Recommendations State
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Sleep Tracker State
  const [sleepToday, setSleepToday] = useState<number>(7.0);
  const [sleepAdvice, setSleepAdvice] = useState<{ targetHours: number; tip: string }>({
    targetHours: 8.0,
    tip: "Aim for a consistent bedtime and keep your room cool and dark to improve deep sleep cycles.",
  });
  const [loadingSleepTips, setLoadingSleepTips] = useState(false);
  const [savingSleep, setSavingSleep] = useState(false);
  const [isSleepHistoryModalOpen, setIsSleepHistoryModalOpen] = useState(false);

  // Steps Tracker State
  const [stepsToday, setStepsToday] = useState<number>(0);
  const [savingSteps, setSavingSteps] = useState(false);

  // user_plans History State Arrays
  const [stepsLogsState, setStepsLogsState] = useState<StepLog[]>([]);
  const [waterLogsState, setWaterLogsState] = useState<WaterLog[]>([]);
  const [sleepLogsState, setSleepLogsState] = useState<SleepLog[]>([]);
  const [measurementLogsState, setMeasurementLogsState] = useState<MeasurementLog[]>([]);

  // Manual Tracking State
  const [measurements, setMeasurements] = useState({ waist: "", hips: "", chest: "" });
  const [savingMeasurements, setSavingMeasurements] = useState(false);
  const [isMeasurementsHistoryModalOpen, setIsMeasurementsHistoryModalOpen] = useState(false);
  const [habits, setHabits] = useState({
    vitamins: false,
    walk: false,
    noSugar: false,
  });
  const [savingHabits, setSavingHabits] = useState(false);
  const [isHabitsHistoryModalOpen, setIsHabitsHistoryModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      console.warn("Cloudinary cloud name not set. Using local base64 fallback.");
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    // Fetch the signature from our secure backend API
    const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
    if (!signRes.ok) {
      throw new Error("Failed to get upload signature");
    }
    const { timestamp, signature, api_key } = await signRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || "Failed to upload image");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const cleanJourneyForDb = (journeyObj: WeightJourney) => {
    return {
      ...journeyObj,
      history: (journeyObj.history || []).map((entry) => {
        const { imageUrl, ...rest } = entry;
        return rest;
      }),
    };
  };


  const fetchRecommendations = async (mealsList: MealLog[]) => {
    setLoadingRecs(true);
    try {
      const res = await fetch("/api/recommend-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meals: mealsList }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } else {
        console.error("Failed to load recommendations");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const extractLogsArray = (data: any, keyNames: string[] = []): any[] => {
    if (!data) return [];
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return [];
      }
    }
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      for (const key of keyNames) {
        if (Array.isArray(data[key])) return data[key];
      }
      if (Array.isArray(data.logs)) return data.logs;
      if (Array.isArray(data.history)) return data.history;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  };

  const mergeLogsByDate = <T extends { date: string }>(primary: T[] = [], fallback: T[] = []): T[] => {
    const map = new Map<string, T>();
    const addLog = (item: T) => {
      if (!item || !item.date) return;
      const dateKey = typeof item.date === "string" && item.date.includes("T") ? item.date.split("T")[0] : String(item.date);
      map.set(dateKey, item);
    };

    (fallback || []).forEach(addLog);
    (primary || []).forEach(addLog);

    return Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeB - timeA;
    });
  };

  const saveUserPlanData = async (
    userId: string,
    updates: {
      steps_history?: StepLog[];
      water_history?: WaterLog[];
      sleep_history?: SleepLog[];
      measurement_history?: MeasurementLog[];
    }
  ) => {
    const { data: existing } = await supabase
      .from("user_plans")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.id) {
      return await supabase
        .from("user_plans")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      return await supabase
        .from("user_plans")
        .insert({
          user_id: userId,
          ...updates,
        });
    }
  };

  const handleLogSteps = async (amount: number) => {
    if (!user) return;
    setSavingSteps(true);

    const todayStr = new Date().toISOString().split("T")[0];
    let newStepsLogs = [...stepsLogsState];
    const existingIndex = newStepsLogs.findIndex((log) => log.date && log.date.split("T")[0] === todayStr);

    let newCount = amount;
    if (existingIndex >= 0) {
      newCount = Math.max(0, newStepsLogs[existingIndex].steps + amount);
      newStepsLogs[existingIndex] = { date: todayStr, steps: newCount };
    } else {
      newCount = Math.max(0, amount);
      newStepsLogs.push({ date: todayStr, steps: newCount });
    }

    const finishSave = () => {
      setStepsLogsState(newStepsLogs);
      setStepsToday(newCount);
      setSavingSteps(false);
      toast.success("Steps logged successfully!");
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await saveUserPlanData(user.id, { steps_history: newStepsLogs });
    if (error) {
      console.error("Error saving steps to user_plans:", error);
      setSavingSteps(false);
      toast.error("Failed to save steps.");
    } else {
      finishSave();
    }
  };

  const handleResetSteps = async () => {
    if (!user) return;
    setSavingSteps(true);

    const todayStr = new Date().toISOString().split("T")[0];
    let newStepsLogs = [...stepsLogsState];
    const existingIndex = newStepsLogs.findIndex((log) => log.date && log.date.split("T")[0] === todayStr);

    if (existingIndex >= 0) {
      newStepsLogs[existingIndex] = { date: todayStr, steps: 0 };
    }

    const finishSave = () => {
      setStepsLogsState(newStepsLogs);
      setStepsToday(0);
      setSavingSteps(false);
      toast.success("Steps reset.");
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await saveUserPlanData(user.id, { steps_history: newStepsLogs });
    if (error) {
      console.error("Error resetting steps in user_plans:", error);
      setSavingSteps(false);
      toast.error("Failed to reset steps.");
    } else {
      finishSave();
    }
  };

  const handleLogWater = async (amount: number) => {
    if (!user) return;
    setSavingWater(true);
    
    const todayStr = new Date().toISOString().split("T")[0];
    let currentLogs = mergeLogsByDate(waterLogsState, journey.waterLogs || []);
    let newWaterLogs = [...currentLogs];
    const existingIndex = newWaterLogs.findIndex(log => log.date && log.date.split("T")[0] === todayStr);
    
    let newAmount = amount;
    if (existingIndex >= 0) {
      newAmount = parseFloat((newWaterLogs[existingIndex].amount + amount).toFixed(2));
      if (newAmount < 0) newAmount = 0;
      newWaterLogs[existingIndex] = { date: todayStr, amount: newAmount };
    } else {
      if (newAmount < 0) newAmount = 0;
      newWaterLogs.push({ date: todayStr, amount: newAmount });
    }
    
    const newJourney: WeightJourney = {
      ...journey,
      waterLogs: newWaterLogs
    };

    const finishSave = () => {
      setWaterLogsState(newWaterLogs);
      setJourney(newJourney);
      setWaterToday(newAmount);
      setSavingWater(false);
      toast.success("Water intake logged successfully!");
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await saveUserPlanData(user.id, { water_history: newWaterLogs });
    await supabase
      .from("users")
      .update({ weight_loss_journey: cleanJourneyForDb(newJourney) })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving water intake to user_plans:", error);
      setSavingWater(false);
      toast.error("Failed to save water intake.");
    } else {
      finishSave();
    }
  };

  const handleResetWater = async () => {
    if (!user) return;
    setSavingWater(true);
    
    const todayStr = new Date().toISOString().split("T")[0];
    let currentLogs = mergeLogsByDate(waterLogsState, journey.waterLogs || []);
    let newWaterLogs = [...currentLogs];
    const existingIndex = newWaterLogs.findIndex(log => log.date && log.date.split("T")[0] === todayStr);
    
    if (existingIndex >= 0) {
      newWaterLogs[existingIndex] = { date: todayStr, amount: 0 };
    }
    
    const newJourney: WeightJourney = {
      ...journey,
      waterLogs: newWaterLogs
    };

    const finishSave = () => {
      setWaterLogsState(newWaterLogs);
      setJourney(newJourney);
      setWaterToday(0);
      setSavingWater(false);
      toast.success("Water intake reset.");
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await saveUserPlanData(user.id, { water_history: newWaterLogs });
    await supabase
      .from("users")
      .update({ weight_loss_journey: cleanJourneyForDb(newJourney) })
      .eq("id", user.id);

    if (error) {
      console.error("Error resetting water intake in user_plans:", error);
      setSavingWater(false);
      toast.error("Failed to reset water intake.");
    } else {
      finishSave();
    }
  };

  const fetchSleepRecommendations = async (sleepLogsList: SleepLog[]) => {
    setLoadingSleepTips(true);
    try {
      const res = await fetch("/api/recommend-sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sleepLogs: sleepLogsList }),
      });
      if (res.ok) {
        const data = await res.json();
        setSleepAdvice({
          targetHours: data.targetHours || 8.0,
          tip: data.tip || "Aim for a consistent bedtime.",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSleepTips(false);
    }
  };

  const handleSaveSleep = async () => {
    if (!user) return;
    setSavingSleep(true);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    let currentLogs = mergeLogsByDate(sleepLogsState, journey.sleepLogs || []);
    let newSleepLogs = [...currentLogs];
    const existingIndex = newSleepLogs.findIndex((log) => log.date && log.date.split("T")[0] === yesterdayStr);

    if (existingIndex >= 0) {
      newSleepLogs[existingIndex] = { date: yesterdayStr, hours: sleepToday };
    } else {
      newSleepLogs.push({ date: yesterdayStr, hours: sleepToday });
    }

    const newJourney: WeightJourney = {
      ...journey,
      sleepLogs: newSleepLogs,
    };

    const finishSave = () => {
      setSleepLogsState(newSleepLogs);
      setJourney(newJourney);
      setSavingSleep(false);
      toast.success("Sleep duration saved!");
      fetchSleepRecommendations(newSleepLogs);
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await saveUserPlanData(user.id, { sleep_history: newSleepLogs });
    await supabase
      .from("users")
      .update({ weight_loss_journey: cleanJourneyForDb(newJourney) })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving sleep to user_plans:", error);
      setSavingSleep(false);
      toast.error("Failed to save sleep details.");
    } else {
      finishSave();
    }
  };

  const handleSaveMeasurements = async () => {
    if (!user) return;
    setSavingMeasurements(true);
    
    const today = new Date().toISOString().split("T")[0];
    let currentLogs = mergeLogsByDate(measurementLogsState, journey.measurements || []);
    let newMeasurements = [...currentLogs];
    const existingIndex = newMeasurements.findIndex((log) => log.date && log.date.split("T")[0] === today);

    const log: MeasurementLog = {
      date: today,
      waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
      hips: measurements.hips ? parseFloat(measurements.hips) : undefined,
      chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
    };

    if (existingIndex >= 0) {
      newMeasurements[existingIndex] = log;
    } else {
      newMeasurements.push(log);
    }

    const newJourney: WeightJourney = { ...journey, measurements: newMeasurements };

    const finishSave = () => {
      setMeasurementLogsState(newMeasurements);
      setJourney(newJourney);
      setSavingMeasurements(false);
      toast.success("Measurements saved!");
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await saveUserPlanData(user.id, { measurement_history: newMeasurements });
    await supabase
      .from("users")
      .update({ weight_loss_journey: cleanJourneyForDb(newJourney) })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving measurements to user_plans:", error);
      setSavingMeasurements(false);
      toast.error("Failed to save measurements.");
    } else {
      finishSave();
    }
  };

  const handleSaveHabits = async () => {
    if (!user) return;
    setSavingHabits(true);
    
    const today = new Date().toISOString().split("T")[0];
    let newHabitLogs = [...(journey.habitLogs || [])];
    const existingIndex = newHabitLogs.findIndex((log) => log.date === today);

    const log: HabitLog = {
      date: today,
      habits,
    };

    if (existingIndex >= 0) {
      newHabitLogs[existingIndex] = log;
    } else {
      newHabitLogs.push(log);
    }

    const newJourney: WeightJourney = { ...journey, habitLogs: newHabitLogs };

    const finishSave = () => {
      setJourney(newJourney);
      setSavingHabits(false);
      toast.success("Habits logged!");
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ weight_loss_journey: cleanJourneyForDb(newJourney) })
      .eq("id", user.id);

    if (error) {
      setSavingHabits(false);
      toast.error("Failed to save habits.");
    } else {
      finishSave();
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const bypass = urlParams.get("bypassAuth") === "true";

      if (bypass) {
        const mockUser = {
          id: "mock-user-7788",
          email: "patient@genestac.com",
          user_metadata: { full_name: "Amit Sharma" },
        } as unknown as SupabaseUser;

        setUser(mockUser);
        setJourney({ history: [] }); // Start empty for bypass too
        setWaterToday(0);
        setSleepToday(7.0);
        setLoading(false);
        fetchRecommendations([]);
        fetchSleepRecommendations([]);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // Fetch user_plans data (steps, water, sleep, measurements history)
      const { data: userPlan } = await supabase
        .from("user_plans")
        .select("steps_history, water_history, sleep_history, measurement_history")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const userPlanSteps: StepLog[] = extractLogsArray(userPlan?.steps_history, ["stepsLogs", "steps_history"]);
      const userPlanWater: WaterLog[] = extractLogsArray(userPlan?.water_history, ["waterLogs", "water_history"]);
      const userPlanSleep: SleepLog[] = extractLogsArray(userPlan?.sleep_history, ["sleepLogs", "sleep_history"]);
      const userPlanMeasurements: MeasurementLog[] = extractLogsArray(userPlan?.measurement_history, ["measurementLogs", "measurements", "measurement_history"]);

      const { data, error } = await supabase
        .from("users")
        .select("weight_loss_journey")
        .eq("id", session.user.id)
        .maybeSingle();

      const fetchedJourney = ((data && data.weight_loss_journey) ? data.weight_loss_journey : {}) as WeightJourney;
      const normalizedHistory = (Array.isArray(fetchedJourney.history) ? fetchedJourney.history : []).map(entry => ({
        ...entry,
        imageUrl: entry.image_url || entry.imageUrl,
      }));

      const legacyWater = extractLogsArray(fetchedJourney.waterLogs, ["waterLogs"]);
      const legacySleep = extractLogsArray(fetchedJourney.sleepLogs, ["sleepLogs"]);
      const legacyMeasurements = extractLogsArray(fetchedJourney.measurements, ["measurements"]);

      // Combine / merge user_plans data with users weight_loss_journey data so no history is lost
      const finalWaterLogs = mergeLogsByDate(userPlanWater, legacyWater);
      const finalSleepLogs = mergeLogsByDate(userPlanSleep, legacySleep);
      const finalMeasurementLogs = mergeLogsByDate(userPlanMeasurements, legacyMeasurements);
      const finalStepsLogs = userPlanSteps;

      setStepsLogsState(finalStepsLogs);
      setWaterLogsState(finalWaterLogs);
      setSleepLogsState(finalSleepLogs);
      setMeasurementLogsState(finalMeasurementLogs);

      setJourney({
        targetGoal: fetchedJourney.targetGoal,
        history: normalizedHistory,
        meals: Array.isArray(fetchedJourney.meals)
          ? fetchedJourney.meals
          : [],
        waterGoal: fetchedJourney.waterGoal,
        waterLogs: finalWaterLogs,
        sleepLogs: finalSleepLogs,
        measurements: finalMeasurementLogs,
        habitLogs: Array.isArray(fetchedJourney.habitLogs)
          ? fetchedJourney.habitLogs
          : [],
      });

      if (fetchedJourney.targetGoal) {
        setTargetGoalInput(fetchedJourney.targetGoal.toString());
      }

      const todayStr = new Date().toISOString().split("T")[0];

      // Set today's steps log
      const todayStepLog = finalStepsLogs.find(log => log.date === todayStr);
      setStepsToday(todayStepLog ? todayStepLog.steps : 0);

      // Set today's water log
      const todayWaterLog = finalWaterLogs.find(log => log.date === todayStr);
      setWaterToday(todayWaterLog ? todayWaterLog.amount : 0);

      // Set yesterday's sleep log
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const yesterdaySleepLog = finalSleepLogs.find(log => log.date === yesterdayStr);
      setSleepToday(yesterdaySleepLog ? yesterdaySleepLog.hours : 7.0);

      // Set today's measurement log if exists
      const todayMeasurementLog = finalMeasurementLogs.find(log => log.date === todayStr);
      if (todayMeasurementLog) {
        setMeasurements({
          waist: todayMeasurementLog.waist ? todayMeasurementLog.waist.toString() : "",
          hips: todayMeasurementLog.hips ? todayMeasurementLog.hips.toString() : "",
          chest: todayMeasurementLog.chest ? todayMeasurementLog.chest.toString() : "",
        });
      }

      // Fetch AI recommendations
      fetchRecommendations(Array.isArray(fetchedJourney.meals) ? fetchedJourney.meals : []);
      fetchSleepRecommendations(finalSleepLogs);
      setLoading(false);
    };

    void loadDashboard();
  }, [router]);

  const handleSaveWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !todayWeight) return;

    setSaving(true);
    const weightNum = parseFloat(todayWeight);
    const goalNum = targetGoalInput ? parseFloat(targetGoalInput) : undefined;
    const todayStr = new Date().toISOString().split("T")[0];

    let uploadedUrl = "";
    if (selectedFile) {
      setUploadingPhoto(true);
      try {
        uploadedUrl = await uploadToCloudinary(selectedFile);
      } catch (err: any) {
        console.error(err);
        toast.error(`Image upload failed: ${err.message || err}`);
        setSaving(false);
        setUploadingPhoto(false);
        return;
      }
      setUploadingPhoto(false);
    }

    let newHistory = [...(journey.history || [])];
    const existingIndex = newHistory.findIndex(
      (entry) => entry.date === todayStr,
    );

    const newEntry: WeightLog = {
      date: todayStr,
      weight: weightNum,
      note: todayNote.trim() ? todayNote.trim() : undefined,
      ...(uploadedUrl && {
        image_url: uploadedUrl,
        imageUrl: uploadedUrl,
      }),
    };

    if (existingIndex >= 0) {
      const oldEntry = newHistory[existingIndex];
      // Preserve existing photo if we didn't upload a new one
      if (!uploadedUrl) {
        newEntry.image_url = oldEntry.image_url;
        newEntry.imageUrl = oldEntry.imageUrl;
      }
      newHistory[existingIndex] = newEntry;
    } else {
      newHistory.push(newEntry);
    }

    newHistory.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Snapshot previous streak/milestone count so we can tell the user
    // what's new after saving (handled after state updates below).
    const previousWeightLoss =
      journey.history.length > 0
        ? journey.history[0].weight -
          journey.history[journey.history.length - 1].weight
        : 0;

    const newJourney: WeightJourney = {
      ...journey,
      targetGoal: goalNum,
      history: newHistory,
    };

    const finishSave = () => {
      setJourney(newJourney);
      setTodayWeight("");
      setTodayNote("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setSaving(false);
      setIsModalOpen(false);

      const newWeightLoss =
        newHistory.length > 0
          ? newHistory[0].weight - newHistory[newHistory.length - 1].weight
          : 0;

      const newlyHitMilestone = WEIGHT_MILESTONES.find(
        (m) => previousWeightLoss < m && newWeightLoss >= m,
      );

      if (newlyHitMilestone) {
        toast.success(`🎉 Milestone unlocked: -${newlyHitMilestone}kg!`);
      } else {
        toast.success("Weight logged successfully!");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("bypassAuth") === "true") {
      finishSave();
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ weight_loss_journey: cleanJourneyForDb(newJourney) })
      .eq("id", user.id);

    if (error) {
      setSaving(false);
      toast.error("Failed to save weight. Please try again.");
    } else {
      finishSave();
    }
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !mealDescription) return;

    setAnalyzingMeal(true);

    try {
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: mealDescription }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze meal");
      }

      const analysis = await res.json();

      let newMeals = [...(journey.meals || [])];

      if (editingMealId) {
        const index = newMeals.findIndex((m) => m.id === editingMealId);
        if (index !== -1) {
          newMeals[index] = {
            ...newMeals[index],
            mealType,
            description: mealDescription || "No description",
            calories: analysis.calories || 0,
            feedback: analysis.feedback || "Unable to determine.",
          };
        }
      } else {
        const newMeal: MealLog = {
          id: Math.random().toString(36).substring(7),
          date: new Date().toISOString(),
          mealType,
          description: mealDescription || "No description",
          calories: analysis.calories || 0,
          feedback: analysis.feedback || "Unable to determine.",
        };
        newMeals.push(newMeal);
      }

      const newJourney = { ...journey, meals: newMeals };

      const finishSave = () => {
        setJourney(newJourney);
        setMealDescription("");
        setMealType("Morning");
        setEditingMealId(null);
        setAnalyzingMeal(false);
        setIsMealModalOpen(false);
        toast.success(
          editingMealId ? "Meal updated!" : "Meal logged and analyzed!",
        );
      };

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("bypassAuth") === "true") {
        finishSave();
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({ weight_loss_journey: cleanJourneyForDb(newJourney) })
        .eq("id", user.id);

      if (error) throw error;
      finishSave();
    } catch (error) {
      console.error(error);
      toast.error("Error logging meal. Please try again.");
      setAnalyzingMeal(false);
    }
  };

  const history = journey.history || [];

  // 7-day (or shortest available window) moving average, computed over
  // the FULL history so early points in a filtered range are still smooth.
  const historyWithAverage = useMemo(() => {
    const windowSize = 7;
    return history.map((entry, idx) => {
      const start = Math.max(0, idx - (windowSize - 1));
      const slice = history.slice(start, idx + 1);
      const avg = slice.reduce((sum, e) => sum + e.weight, 0) / slice.length;
      return { ...entry, average: Math.round(avg * 10) / 10 };
    });
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (range === "all") return historyWithAverage;
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return historyWithAverage.filter((entry) => new Date(entry.date) >= cutoff);
  }, [historyWithAverage, range]);

  const chartData = useMemo(() => {
    return filteredHistory.map((entry) => {
      const d = new Date(entry.date);
      const formattedDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return {
        ...entry,
        displayDate: formattedDate,
      };
    });
  }, [filteredHistory]);

  // Meal Tracking Calculations
  const mealsList = journey.meals || [];
  const todayStrDate = new Date().toISOString().split("T")[0];
  const todaysMeals = mealsList.filter((m) => m.date.startsWith(todayStrDate));
  const totalCaloriesToday = todaysMeals.reduce(
    (acc, meal) => acc + (meal.calories || 0),
    0,
  );
  const hasLoggedWeightToday = history.some((log) => log.date === todayStrDate);

  const pastMeals = mealsList
    .filter((m) => !m.date.startsWith(todayStrDate))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pastMealsByDate = pastMeals.reduce(
    (acc, meal) => {
      const d = meal.date.split("T")[0];
      if (!acc[d]) acc[d] = [];
      acc[d].push(meal);
      return acc;
    },
    {} as Record<string, MealLog[]>,
  );

  // Derived Stats Calculations (always based on FULL history, not the filtered range)
  const currentWeight =
    history.length > 0 ? history[history.length - 1].weight : null;
  history.length > 0 ? history[history.length - 1].weight : null;
  const initialWeight = history.length > 0 ? history[0].weight : null;
  const initialDateObj = history.length > 0 ? new Date(history[0].date) : null;
  const initialDateStr = initialDateObj
    ? initialDateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const lastSyncStr =
    history.length > 0
      ? new Date(history[history.length - 1].date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "--";

  const weightLoss =
    initialWeight && currentWeight ? initialWeight - currentWeight : 0;

  const targetGoal = journey.targetGoal;

  let progressPercent = 0;
  if (
    initialWeight &&
    currentWeight &&
    targetGoal &&
    initialWeight > targetGoal
  ) {
    progressPercent = Math.min(
      100,
      Math.max(
        0,
        ((initialWeight - currentWeight) / (initialWeight - targetGoal)) * 100,
      ),
    );
  }

  // Average Weekly Loss calculation
  let avgWeeklyLoss = 0;
  if (initialDateObj && weightLoss > 0) {
    const diffTime = Math.abs(new Date().getTime() - initialDateObj.getTime());
    const weeks = diffTime / (1000 * 60 * 60 * 24 * 7);
    if (weeks >= 1) {
      avgWeeklyLoss = weightLoss / weeks;
    } else {
      avgWeeklyLoss = weightLoss; // If less than a week, show total
    }
  }

  // Streak Calculation
  let currentStreak = 0;
  if (history.length > 0) {
    let streakCount = 0;
    let checkDate = new Date(); // Start checking from today
    checkDate.setHours(0, 0, 0, 0);

    const sortedHistory = [...history].reverse();
    let currentHistoryIndex = 0;

    while (currentHistoryIndex < sortedHistory.length) {
      const logDate = new Date(sortedHistory[currentHistoryIndex].date);
      logDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round(
        (checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
        currentHistoryIndex++;
      } else if (diffDays === 1 && streakCount === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = streakCount;
  }

  // Helper: find the most recent logged weight on or before a given date
  const getWeightAtOrBefore = (targetDate: Date) => {
    let result: number | null = null;
    for (const entry of history) {
      const d = new Date(entry.date);
      if (d <= targetDate) {
        result = entry.weight;
      } else {
        break;
      }
    }
    return result;
  };

  // Week-over-week comparison
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);

  const weightSevenDaysAgo = getWeightAtOrBefore(sevenDaysAgo);
  const weightFourteenDaysAgo = getWeightAtOrBefore(fourteenDaysAgo);

  const thisWeekLoss =
    currentWeight !== null && weightSevenDaysAgo !== null
      ? weightSevenDaysAgo - currentWeight
      : null;
  const lastWeekLoss =
    weightSevenDaysAgo !== null && weightFourteenDaysAgo !== null
      ? weightFourteenDaysAgo - weightSevenDaysAgo
      : null;

  // Milestones achieved so far
  const achievedWeightMilestones = WEIGHT_MILESTONES.filter(
    (m) => weightLoss >= m,
  );
  const nextWeightMilestone = WEIGHT_MILESTONES.find((m) => weightLoss < m);
  const achievedStreakMilestones = STREAK_MILESTONES.filter(
    (m) => currentStreak >= m,
  );

  // Motivational micro-copy, driven by real data rather than a static string
  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    "there";

  let motivationalMessage = "Log your first weight to start your journey!";
  if (history.length > 0) {
    if (currentStreak === 0) {
      motivationalMessage =
        "You've missed a day — let's get back on track today.";
    } else if (currentStreak >= 30) {
      motivationalMessage = `Incredible consistency — ${currentStreak} days strong! 🔥`;
    } else if (currentStreak >= 7) {
      motivationalMessage = `You're on fire! ${currentStreak}-day streak going strong 🔥`;
    } else if (
      thisWeekLoss !== null &&
      lastWeekLoss !== null &&
      thisWeekLoss > lastWeekLoss
    ) {
      motivationalMessage = "You're accelerating — this week beat last week 📈";
    } else if (targetGoal && progressPercent >= 90) {
      motivationalMessage = "So close to your goal — final push! 💪";
    } else {
      motivationalMessage = "Nice work — every log keeps your streak alive.";
    }
  }

  const gaugeData = [
    { name: "Progress", value: progressPercent, color: "#10b981" },
    {
      name: "Remaining",
      value: Math.max(100 - progressPercent, 0),
      color: "#e2e8f0",
    },
  ];

  // Custom tooltip so we can surface notes alongside the weight + average
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0]?.payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-blue-600 font-medium">{point.weight} kg</p>
        {point.average !== undefined && (
          <p className="text-slate-400 text-xs">Avg: {point.average} kg</p>
        )}
        {point.note && (
          <p className="text-slate-500 text-xs mt-1 italic max-w-[180px]">
            “{point.note}”
          </p>
        )}
        {point.imageUrl && (
          <div className="mt-2 w-full max-w-[140px] rounded-lg overflow-hidden shadow-sm border border-slate-200">
            <img
              src={point.imageUrl}
              alt="Progress log"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
        <p className="font-medium text-slate-500">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-slate-50 min-h-screen relative">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Greeting + motivational line */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-slate-700">
              <span className="font-bold text-slate-900">Hey {firstName},</span>{" "}
              {motivationalMessage}
            </p>
          </div>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-400 p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Last Sync</p>
                <p className="font-bold text-slate-900">{lastSyncStr}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-green-300 p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Goal Progress</p>
                <p className="font-bold text-slate-900">
                  {targetGoal ? `${progressPercent.toFixed(1)}%` : "--"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blue-300 p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium ">Total Lost</p>
                <p className="font-bold text-slate-900">
                  {weightLoss.toFixed(1)} kg
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-red-300 p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium ">Current Streak</p>
                <p className="font-bold text-slate-900">
                  {currentStreak > 0 ? `${currentStreak} Days` : "--"}
                </p>
              </div>
            </div>
          </div>

          {/* Week-over-week comparison */}
          {thisWeekLoss !== null && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  This week vs last week
                </p>
                <p className="font-bold text-slate-900 mt-0.5">
                  {thisWeekLoss.toFixed(1)} kg lost this week
                  {lastWeekLoss !== null && (
                    <span
                      className={`ml-2 text-sm font-semibold ${
                        thisWeekLoss >= lastWeekLoss
                          ? "text-emerald-600"
                          : "text-orange-500"
                      }`}
                    >
                      {thisWeekLoss >= lastWeekLoss ? "▲" : "▼"} vs{" "}
                      {lastWeekLoss.toFixed(1)} kg last week
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Achievements / milestone badges */}
          {(achievedWeightMilestones.length > 0 ||
            achievedStreakMilestones.length > 0) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-md font-bold text-slate-900">
                  Achievements
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievedWeightMilestones.map((m) => (
                  <span
                    key={`w-${m}`}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5"
                  >
                    🎉 -{m}kg lost
                  </span>
                ))}
                {achievedStreakMilestones.map((m) => (
                  <span
                    key={`s-${m}`}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5"
                  >
                    🔥 {m}-day streak
                  </span>
                ))}
                {nextWeightMilestone && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-dashed border-slate-300 text-slate-500 text-xs font-semibold px-3 py-1.5">
                    Next: -{nextWeightMilestone}kg (
                    {(nextWeightMilestone - weightLoss).toFixed(1)}kg to go)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Main Chart Area */}
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col w-full">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Weight Loss Progress
                </h2>
                <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setRange(opt.key)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                        range === opt.key
                          ? "bg-white text-blue-600 shadow-sm border border-blue-500"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[300px] md:h-[450px] w-full">
                {history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorWeight"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="displayDate"
                        tick={{ fill: "#000000", fontSize: 12 }}
                        tickMargin={10}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={["dataMin - 2", "dataMax + 2"]}
                        tick={{ fill: "#000000", fontSize: 12 }}
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      {targetGoal && (
                        <ReferenceLine
                          y={targetGoal}
                          stroke="#f59e0b"
                          strokeDasharray="3 3"
                          label={{
                            position: "insideTopLeft",
                            value: `Target Goal: ${targetGoal} kg`,
                            fill: "#f59e0b",
                            fontSize: 12,
                          }}
                        />
                      )}
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorWeight)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                        dot={{
                          r: 4,
                          strokeWidth: 2,
                          fill: "#fff",
                          stroke: "#3b82f6",
                        }}
                      />

                      {/* Highlight logs that carried a note */}
                      {chartData
                        .filter((d) => d.note)
                        .map((d) => (
                          <ReferenceDot
                            key={d.date}
                            x={d.displayDate}
                            y={d.weight}
                            r={5}
                            fill="#fff"
                            stroke="#f59e0b"
                            strokeWidth={2}
                          />
                        ))}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
                    <p className="mb-2 text-slate-900 font-medium">
                      No weight data logged yet
                    </p>
                    <p className="text-sm">
                      Click the + button to log your first weight and start your
                      journey!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Stats Sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
              <h2 className="text-lg font-bold text-slate-900">
                Current Stats
              </h2>

              <div>
                <p className="text-sm font-medium ">Current Weight</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {currentWeight ? `${currentWeight} kg` : "--"}
                </p>
                <p className="text-sm  mt-1">Last logged: {lastSyncStr}</p>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              <div>
                <p className="text-sm font-medium ">Start Weight</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {initialWeight ? `${initialWeight} kg` : "--"}
                </p>
                <p className="text-sm  mt-1">{initialDateStr || "--"}</p>
              </div>

              {targetGoal && (
                <>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div>
                    <p className="text-sm font-medium ">Goal Weight</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {targetGoal} kg
                    </p>
                    {currentWeight && (
                      <p className="text-sm mt-1">
                        {Math.max(currentWeight - targetGoal, 0).toFixed(1)} kg
                        to go
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col items-center">
              <h2 className="text-md font-bold text-slate-900 self-start mb-2">
                Average Weekly Loss
              </h2>
              <div className="h-[120px] w-[200px] relative mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 right-0 text-center flex flex-col items-center">
                  <div className="w-1.5 h-16 bg-slate-700 absolute bottom-0 origin-bottom rounded-full -rotate-45 mb-4 z-10" />
                  <div className="w-4 h-4 rounded-full bg-slate-800 absolute bottom-[-4px] z-20" />
                  <p className="font-bold text-slate-900 mt-2 z-30 bg-white px-2">
                    {history.length > 1
                      ? `${avgWeeklyLoss.toFixed(1)} kg/wk`
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* My Transformation Gallery */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-w-0">
              <div className="w-full min-w-0">
                <h2 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  My Transformation Gallery
                </h2>
                {history.filter((entry) => entry.image_url || entry.imageUrl).length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin w-full">
                    {history
                      .filter((entry) => entry.image_url || entry.imageUrl)
                      .map((entry) => {
                        const dateObj = new Date(entry.date);
                        const formattedDate = dateObj.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        });
                        const imgUrl = entry.image_url || entry.imageUrl;
                        const weightDiff = initialWeight ? entry.weight - initialWeight : 0;

                        return (
                          <div
                            key={entry.date}
                            onClick={() => setActivePhotoUrl(imgUrl || null)}
                            className="flex-shrink-0 w-36 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 group transition shadow-sm"
                          >
                            <div className="relative h-32 w-full overflow-hidden bg-slate-200">
                              <img
                                src={imgUrl}
                                alt={`Progress on ${formattedDate}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-2.5">
                              <p className="text-sm font-bold text-slate-900">{entry.weight} kg</p>
                              <p className="text-sm font-semibold text-slate-800 mt-0.5">{formattedDate}</p>
                              {weightDiff !== 0 && (
                                <p className={`text-sm font-bold mt-1 ${weightDiff < 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                  {weightDiff < 0 ? `${weightDiff.toFixed(1)} kg` : `+${weightDiff.toFixed(1)} kg`}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 px-4">
                    <Camera className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-700">No transformation photos yet</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
                      Upload your photo when entering your daily weight to visualize your progress.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Water & Sleep Health Trackers Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Water Tracker Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                    Hydration Tracker
                  </h2>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full shrink-0">
                    Target: {currentWeight ? (currentWeight * 0.035).toFixed(2) : "2.5"} L
                  </span>
                </div>

                {/* Cup Animation Area */}
                <div className="flex items-center gap-6 my-5">
                  <div className="relative w-16 h-24 border-4 border-slate-300 rounded-b-3xl rounded-t-lg overflow-hidden bg-slate-50 flex items-end">
                    {/* Water Level Fill */}
                    <div
                      style={{
                        height: `${Math.min(
                          (waterToday / (currentWeight ? currentWeight * 0.035 : 2.5)) * 100,
                          100
                        )}%`,
                      }}
                      className="w-full bg-blue-500 transition-all duration-500 relative flex items-center justify-center"
                    >
                      {/* Wave Animation Overlay */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-50 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-3xl font-extrabold text-slate-900">
                      {waterToday.toFixed(2)} <span className="text-lg font-semibold text-slate-500">L</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {Math.max(
                        (currentWeight ? currentWeight * 0.035 : 2.5) - waterToday,
                        0
                      ).toFixed(2)}{" "}
                      L more to reach goal
                    </p>
                  </div>
                </div>
              </div>

              {/* Log Buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLogWater(0.25)}
                    disabled={savingWater}
                    className="flex-1 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs transition border border-blue-100 flex items-center justify-center gap-1"
                  >
                    +0.25L
                  </button>
                  <button
                    onClick={() => handleLogWater(0.5)}
                    disabled={savingWater}
                    className="flex-1 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs transition border border-blue-100 flex items-center justify-center gap-1"
                  >
                    +0.5L
                  </button>
                  <button
                    onClick={() => setIsWaterHistoryModalOpen(true)}
                    className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition flex items-center justify-center"
                    title="View History"
                  >
                    History
                  </button>
                </div>
                <button
                  onClick={handleResetWater}
                  disabled={savingWater}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition flex items-center justify-center"
                  title="Reset today's water"
                >
                  Reset Today
                </button>
              </div>
            </div>

            {/* Sleep Tracker Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                    Sleep (Last Night)
                  </h2>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full shrink-0">
                    Target: {sleepAdvice.targetHours.toFixed(1)}h
                  </span>
                </div>

                {/* Sleep Arc Display */}
                <div className="flex items-center gap-4 my-3">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-slate-100"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-indigo-500 transition-all duration-500"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * Math.min(sleepToday, sleepAdvice.targetHours)) / sleepAdvice.targetHours}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <Moon className="w-5 h-5 text-indigo-500 fill-indigo-500/10" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Stepper controls */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-xl justify-between">
                      <button
                        onClick={() => setSleepToday(prev => Math.max(0, parseFloat((prev - 0.5).toFixed(1))))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition text-sm"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm text-slate-800 shrink-0">
                        {sleepToday.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">hrs</span>
                      </span>
                      <button
                        onClick={() => setSleepToday(prev => Math.min(24, parseFloat((prev + 0.5).toFixed(1))))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Sleep Advisor Tip bubble */}
                {sleepAdvice.tip && (
                  <div className="mt-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-2.5 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500/10 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-950 font-medium leading-relaxed animate-fade-in">
                      {loadingSleepTips ? "Refreshing advice..." : sleepAdvice.tip}
                    </p>
                  </div>
                )}
              </div>

              {/* Log / Save Sleep Button */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setIsSleepHistoryModalOpen(true)}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm border border-indigo-100"
                >
                  History
                </button>
                <button
                  onClick={handleSaveSleep}
                  disabled={savingSleep}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm shadow-indigo-600/10 disabled:opacity-50"
                >
                  {savingSleep ? "Saving..." : "Log Sleep"}
                </button>
              </div>
            </div>

            {/* Steps Tracker Card (Commented out for now) */}
            {/* 
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-emerald-500" />
                    Steps Tracker
                  </h2>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
                    Target: 10,000
                  </span>
                </div>

                <div className="flex items-center gap-4 my-3">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-slate-100"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-emerald-500 transition-all duration-500"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * Math.min(stepsToday, 10000)) / 10000}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <Footprints className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-extrabold text-slate-900 truncate">
                      {stepsToday.toLocaleString()} <span className="text-xs font-semibold text-slate-500">steps</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {stepsToday >= 10000
                        ? "Goal reached! 🎉"
                        : `${(10000 - stepsToday).toLocaleString()} to goal`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLogSteps(1000)}
                    disabled={savingSteps}
                    className="flex-1 py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs transition border border-emerald-100 flex items-center justify-center gap-1"
                  >
                    +1,000
                  </button>
                  <button
                    onClick={() => handleLogSteps(2500)}
                    disabled={savingSteps}
                    className="flex-1 py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs transition border border-emerald-100 flex items-center justify-center gap-1"
                  >
                    +2,500
                  </button>
                </div>
                <button
                  onClick={handleResetSteps}
                  disabled={savingSteps}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition flex items-center justify-center"
                  title="Reset today's steps"
                >
                  Reset Today
                </button>
              </div>
            </div>
            */}
          </div>

          {/* AI Meal Recommendations Card Section */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <h2 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                  Personalized Recipe Ideas
                </h2>
                {loadingRecs ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Generating healthy recommendations...</p>
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {recommendations.map((recipe, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between hover:border-orange-200 transition group"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full shrink-0">
                              {recipe.calories} kcal
                            </span>
                            <span className="text-sm font-semibold">
                              {recipe.prepTime}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-orange-600 transition">
                            {recipe.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {recipe.benefits}
                          </p>
                        </div>

                        {/* Ingredients Popover trigger or bulleted list on hover */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                          <p className="text-sm font-bold text-slate-900 mb-1">Ingredients:</p>
                          <ul className="text-sm text-slate-900 list-disc list-inside space-y-0.5 truncate">
                            {recipe.ingredients?.slice(0, 3).map((ing: string, i: number) => (
                              <li key={i} className="truncate">{ing}</li>
                            ))}
                            {recipe.ingredients?.length > 3 && (
                              <li className="list-none text-[8px] font-bold text-slate-400 mt-0.5">
                                {/* +{recipe.ingredients.length - 3} more ingredients */}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Utensils className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No suggestions yet</p>
                    <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5">
                      Log meals today to unlock AI-powered recipes tomorrow.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Manual Trackers Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Body Measurements Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                  Body Measurements (inches)
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Waist</label>
                    <input
                      type="number"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      placeholder="e.g. 34"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Hips</label>
                    <input
                      type="number"
                      value={measurements.hips}
                      onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                      placeholder="e.g. 40"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Chest</label>
                    <input
                      type="number"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      placeholder="e.g. 38"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 transition"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMeasurementsHistoryModalOpen(true)}
                  className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm border border-indigo-100"
                >
                  History
                </button>
                <button
                  onClick={handleSaveMeasurements}
                  disabled={savingMeasurements}
                  className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                >
                  {savingMeasurements ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* Daily Habit Tracker Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  Daily Habits
                </h2>
                <div className="space-y-3 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${habits.vitamins ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                      {habits.vitamins && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${habits.vitamins ? 'text-slate-400 line-through' : 'text-slate-700'}`}>Took Vitamins</span>
                    <input type="checkbox" className="hidden" checked={habits.vitamins} onChange={(e) => setHabits({ ...habits, vitamins: e.target.checked })} />
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${habits.walk ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                      {habits.walk && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${habits.walk ? 'text-slate-400 line-through' : 'text-slate-700'}`}>30 Min Walk</span>
                    <input type="checkbox" className="hidden" checked={habits.walk} onChange={(e) => setHabits({ ...habits, walk: e.target.checked })} />
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${habits.noSugar ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                      {habits.noSugar && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${habits.noSugar ? 'text-slate-400 line-through' : 'text-slate-700'}`}>No Refined Sugar</span>
                    <input type="checkbox" className="hidden" checked={habits.noSugar} onChange={(e) => setHabits({ ...habits, noSugar: e.target.checked })} />
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsHabitsHistoryModalOpen(true)}
                  className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm border border-emerald-100"
                >
                  History
                </button>
                <button
                  onClick={handleSaveHabits}
                  disabled={savingHabits}
                  className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                >
                  {savingHabits ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>

          

          {/* Meal Tracker Section */}
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-500" />
                  Today's Meals & Calories
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Track your daily intake with AI.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-orange-50 px-4 py-3 rounded-xl border border-orange-100 flex items-center">
                  <span className="text-sm text-orange-800 font-medium mr-3">
                    Total Today:
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {totalCaloriesToday} <span className="text-sm text-orange-800 font-medium">/ {targetGoal ? targetGoal * 24 : 2000} kcal</span>
                  </span>
                </div>
                {totalCaloriesToday > (targetGoal ? targetGoal * 24 : 2000) && (
                  <div className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    You've exceeded your daily limit. A short 15-min walk can help balance it out!
                  </div>
                )}
                {totalCaloriesToday > 0 && totalCaloriesToday <= (targetGoal ? targetGoal * 24 : 2000) && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    You're within your calorie goal. Great discipline today!
                  </div>
                )}
              </div>
            </div>

            {!hasLoggedWeightToday ? (
              <div className="bg-slate-50 border-2 border-dashed border-red-300 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                <Target className="w-10 h-10 text-red-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Enter Today's Weight First
                </h3>
                <p className="text-slate-500 mb-4 max-w-sm">
                  You must log your daily weight progress before you can start
                  tracking your meals.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Log Weight Now
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {["Morning", "Lunch", "Snacks", "Dinner"].map(
                  (mealCategory) => {
                    const categoryMeals = todaysMeals.filter(
                      (m) => m.mealType === mealCategory,
                    );
                    const categoryCalories = categoryMeals.reduce(
                      (acc, m) => acc + (m.calories || 0),
                      0,
                    );

                    return (
                      <div
                        key={mealCategory}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-900 text-lg">
                            {mealCategory}
                          </h3>
                          <span className="text-sm font-bold text-slate-500">
                            {categoryCalories} kcal
                          </span>
                        </div>

                        <div className="flex-1 mb-4 flex flex-col gap-3">
                          {categoryMeals.length > 0 ? (
                            categoryMeals.map((meal) => (
                              <div
                                key={meal.id}
                                className="border border-slate-100 rounded-lg p-3 bg-slate-50"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-medium">
                                    {new Date(meal.date).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" },
                                    )}
                                  </span>
                                  <span className="text-xs font-bold text-orange-600">
                                    {meal.calories} kcal
                                  </span>
                                </div>
                                <p className="text-md font-medium  mb-2">
                                  {meal.description}
                                </p>
                                <p className="text-sm italic bg-white p-2 rounded border border-slate-100">
                                  <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />{meal.feedback}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="flex-1 flex items-center justify-center py-6 text-slate-400 text-sm">
                              No {mealCategory.toLowerCase()} logged yet.
                            </div>
                          )}
                        </div>

                        {categoryMeals.length > 0 ? (
                          <button
                            onClick={() => {
                              const mealToEdit = categoryMeals[0];
                              setMealType(mealCategory as any);
                              setMealDescription(mealToEdit.description);
                              setEditingMealId(mealToEdit.id);
                              setIsMealModalOpen(true);
                            }}
                            className="w-full py-2.5 rounded-xl border-2 border-solid border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2 mt-auto"
                          >
                            Edit {mealCategory}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setMealType(mealCategory as any);
                              setMealDescription("");
                              setEditingMealId(null);
                              setIsMealModalOpen(true);
                            }}
                            className="w-full py-2.5 rounded-xl border-2 border-dashed border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2 mt-auto"
                          >
                            <Plus className="w-4 h-4" /> Add {mealCategory}
                          </button>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* Past Meals History Section */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-red-400" />
              Past Meal Logs
            </h2>

            {Object.keys(pastMealsByDate).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(pastMealsByDate)
                  .sort(
                    (a, b) =>
                      new Date(b[0]).getTime() - new Date(a[0]).getTime(),
                  )
                  .map(([dateStr, mealsOnDate]) => {
                    const dailyTotal = mealsOnDate.reduce(
                      (sum, m) => sum + (m.calories || 0),
                      0,
                    );
                    return (
                      <div
                        key={dateStr}
                        className="border border-blue-600 rounded-xl overflow-hidden"
                      >
                        <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-100">
                          <h3 className="font-bold ">
                            {new Date(dateStr).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </h3>
                          <span className="font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm">
                            {dailyTotal} kcal
                          </span>
                        </div>
                        <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mealsOnDate.map((meal) => (
                            <div
                              key={meal.id}
                              className="bg-white border border-blue-500 rounded-lg p-3 shadow-sm flex flex-col"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold ">
                                  {meal.mealType || "Meal"} •{" "}
                                  {new Date(meal.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <span className="text-sm font-bold ">
                                  {meal.calories} kcal
                                </span>
                              </div>
                              <p className="text-sm  mb-2">
                                {meal.description}
                              </p>
                              {meal.feedback && (
                                <p className="text-sm  italic mt-auto">
                                  "{meal.feedback}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Utensils className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p>No past meal logs found yet.</p>
                <p className="text-sm text-slate-400 mt-1">
                  Meals you log will automatically appear here on the next day.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Meal Modal */}
      {isMealModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingMealId ? `Edit ${mealType}` : "Log a Meal"}
              </h3>
              <button
                onClick={() => setIsMealModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meal Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Morning", "Lunch", "Snacks", "Dinner"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      disabled={!!editingMealId}
                      onClick={() => setMealType(type as any)}
                      className={`py-2 px-3 rounded-xl text-sm font-semibold transition ${
                        mealType === type
                          ? "bg-orange-100 text-orange-700 border-2 border-orange-200"
                          : "bg-slate-50 text-slate-500 border-2 border-slate-100"
                      } ${!editingMealId && mealType !== type ? "hover:bg-slate-100" : ""} ${editingMealId && mealType !== type ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What did you eat?
                </label>
                <textarea
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white resize-none h-24"
                  placeholder="e.g. 2 slices of whole wheat toast with half an avocado and 2 scrambled eggs"
                />
              </div>

              <button
                type="submit"
                disabled={analyzingMeal || !mealDescription}
                className="w-full rounded-2xl bg-orange-600 px-4 py-4 text-sm font-bold text-white transition hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 disabled:opacity-70 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {analyzingMeal ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI is analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze & Log
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-64 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 focus:ring-4 focus:ring-blue-300"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Weight Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                Log Today's Weight
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="p-5">
              <div className="mb-4">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Weight (in kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  step="0.1"
                  min="20"
                  max="300"
                  required
                  autoFocus
                  value={todayWeight}
                  onChange={(e) => setTodayWeight(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-lg font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. 74.5"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Note (optional)
                </label>
                <input
                  type="text"
                  id="note"
                  value={todayNote}
                  onChange={(e) => setTodayNote(e.target.value)}
                  maxLength={80}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. felt bloated, started new workout..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-slate-400" />
                  Progress Photo (optional)
                </label>
                <div className="flex items-center gap-4">
                  {previewUrl ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group shrink-0">
                      <img
                        src={previewUrl}
                        alt="Progress preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition shrink-0">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                      <span className="text-[10px] text-slate-500 mt-1 font-semibold">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {selectedFile && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {!journey.targetGoal && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                  <label
                    htmlFor="targetGoal"
                    className="block text-sm font-medium text-orange-800 mb-2"
                  >
                    Set a Target Goal (Optional)
                  </label>
                  <input
                    type="number"
                    id="targetGoal"
                    step="0.1"
                    min="20"
                    max="300"
                    value={targetGoalInput}
                    onChange={(e) => setTargetGoalInput(e.target.value)}
                    className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-orange-400"
                    placeholder="e.g. 70.0"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving || uploadingPhoto}
                className="w-full rounded-2xl bg-blue-600 px-4 py-4 text-sm font-bold text-white transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-70 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2"
              >
                {saving || uploadingPhoto ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {uploadingPhoto
                  ? "Uploading Photo..."
                  : saving
                    ? "Saving..."
                    : "FWeight Log"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Lightbox / Full Photo Modal */}
      {activePhotoUrl && (
        <div
          onClick={() => setActivePhotoUrl(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            <button
              onClick={() => setActivePhotoUrl(null)}
              className="absolute top-[-45px] right-0 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activePhotoUrl}
              alt="Transformation high-res"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Water History Modal */}
      {isWaterHistoryModalOpen && (() => {
        const displayLogs = mergeLogsByDate(waterLogsState, journey.waterLogs || []);
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 mt-30">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="bg-blue-600 px-6 py-5 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-200" /> Water Intake History
                </h3>
                <button
                  onClick={() => setIsWaterHistoryModalOpen(false)}
                  className="text-blue-100 hover:bg-blue-500/50 p-1.5 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {displayLogs && displayLogs.length > 0 ? (
                  <div className="space-y-3">
                    {displayLogs
                      .map((log) => {
                        const d = new Date(log.date);
                        return (
                          <div key={log.date} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <span className="font-semibold text-slate-700">
                              {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                            <span className="font-bold text-blue-600 text-lg bg-blue-100/50 px-3 py-1 rounded-full">
                              {log.amount.toFixed(2)} L
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Droplet className="w-12 h-12 text-blue-100 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No water history found.</p>
                    <p className="text-xs text-slate-400 mt-1">Start logging your daily water intake!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Sleep History Modal */}
      {isSleepHistoryModalOpen && (() => {
        const displayLogs = mergeLogsByDate(sleepLogsState, journey.sleepLogs || []);
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 mt-30">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="bg-indigo-600 px-6 py-5 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-200" /> Sleep History
                </h3>
                <button
                  onClick={() => setIsSleepHistoryModalOpen(false)}
                  className="text-indigo-100 hover:bg-indigo-500/50 p-1.5 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {displayLogs && displayLogs.length > 0 ? (
                  <div className="space-y-3">
                    {displayLogs
                      .map((log) => {
                        const d = new Date(log.date);
                        return (
                          <div key={log.date} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <span className="font-semibold text-slate-700">
                              {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                            <span className="font-bold text-indigo-600 text-lg bg-indigo-100/50 px-3 py-1 rounded-full">
                              {log.hours.toFixed(1)} h
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Moon className="w-12 h-12 text-indigo-100 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No sleep history found.</p>
                    <p className="text-xs text-slate-400 mt-1">Start logging your daily sleep hours!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Measurements History Modal */}
      {isMeasurementsHistoryModalOpen && (() => {
        const displayLogs = mergeLogsByDate(measurementLogsState, journey.measurements || []);
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 mt-30">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="bg-indigo-600 px-6 py-5 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-indigo-200" /> Measurements History
                </h3>
                <button
                  onClick={() => setIsMeasurementsHistoryModalOpen(false)}
                  className="text-indigo-100 hover:bg-indigo-500/50 p-1.5 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {displayLogs && displayLogs.length > 0 ? (
                  <div className="space-y-3">
                    {displayLogs
                      .map((log) => {
                        const d = new Date(log.date);
                        return (
                          <div key={log.date} className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <span className="font-semibold text-slate-700">
                              {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                            <div className="flex gap-2">
                              {log.waist && <span className="text-xs font-bold text-indigo-600 bg-indigo-100/50 px-2 py-1 rounded-md">Waist: {log.waist}"</span>}
                              {log.hips && <span className="text-xs font-bold text-indigo-600 bg-indigo-100/50 px-2 py-1 rounded-md">Hips: {log.hips}"</span>}
                              {log.chest && <span className="text-xs font-bold text-indigo-600 bg-indigo-100/50 px-2 py-1 rounded-md">Chest: {log.chest}"</span>}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Ruler className="w-12 h-12 text-indigo-100 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No measurements history found.</p>
                    <p className="text-xs text-slate-400 mt-1">Start logging your body measurements!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Habits History Modal */}
      {isHabitsHistoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 mt-30">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-200" /> Habits History
              </h3>
              <button
                onClick={() => setIsHabitsHistoryModalOpen(false)}
                className="text-emerald-100 hover:bg-emerald-500/50 p-1.5 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {journey.habitLogs && journey.habitLogs.length > 0 ? (
                <div className="space-y-3">
                  {[...journey.habitLogs]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((log) => {
                      const d = new Date(log.date);
                      return (
                        <div key={log.date} className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className="font-semibold text-slate-700">
                            {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(log.habits).map(([habit, done]) => (
                               <span key={habit} className={`text-xs font-bold px-2 py-1 rounded-md ${done ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 bg-slate-200'}`}>
                                 {done ? '✅ ' : '❌ '}{habit.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                               </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CheckSquare className="w-12 h-12 text-emerald-100 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No habits history found.</p>
                  <p className="text-xs text-slate-400 mt-1">Start logging your daily habits!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
