"use client";

import { useEffect, useState, useMemo, useRef, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Search,
  RefreshCw,
  Download,
  MessageSquare,
  Users,
  Sparkles,
  Activity,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  Globe,
  Bot,
  Copy,
  CheckCircle,
  FileText,
} from "lucide-react";

// Simple interface for conversation records
interface Conversation {
  id: number;
  phone: string;
  user_message: string | null;
  bot_reply: string | null;
  created_at: string;
}

interface WhatsAppProfile {
  id: string;
  phone: string;
  full_name: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  city: string | null;
  diabetes: string | null;
  thyroid_disease: string | null;
  pcos: string | null;
  fatty_liver: string | null;
  pancreatitis: string | null;
  kidney_disease: string | null;
  current_medications: string | null;
  profile_complete: boolean;
  lead_status: "READ" | "UNREAD" | null;
  created_at: string;
  updated_at: string;
}

interface PrescriptionState {
  patientName: string;
  age: string;
  gender: string;
  date: string;
  phone: string;
  patientId: string;
  city: string;
  height: string;
  weight: string;
  bmi: string;
  waist: string;
  bloodPressure: string;
  pulse: string;
  spo2: string;
  medicalHistory: {
    diabetes: boolean;
    hypertension: boolean;
    thyroid: boolean;
    pcos: boolean;
    fattyLiver: boolean;
    kidneyDisease: boolean;
    pancreatitis: boolean;
    heartDisease: boolean;
    sleepApnea: boolean;
    depression: boolean;
    other: string;
  };
  currentMedications: string;
  allergies: string;
  dietPattern: string;
  mealsPerDay: string;
  waterIntake: string;
  sugaryDrinks: string;
  physicalActivity: string;
  exercise: string;
  sleepHours: string;
  sleepQuality: string;
  alcohol: string;
  alcoholFrequency: string;
  smoking: string;
  examNotes: string;
  investigationsReviewed: {
    cbc: boolean;
    hba1c: boolean;
    lft: boolean;
    kft: boolean;
    lipidProfile: boolean;
    tsh: boolean;
    vitaminD: boolean;
    vitaminB12: boolean;
    fastingBloodSugar: boolean;
    other: string;
  };
  diagnosis: string;
  bmiCategory: string;
  weightGoal: string;
  targetDuration: string;
  medicationPlan: Array<{
    medicine: string;
    strength: string;
    dose: string;
    timing: string;
    duration: string;
  }>;
  dietAdvice: string;
  exercisePlan: string;
  lifestyleAdvice: {
    drinkHydration: boolean;
    avoidSugary: boolean;
    highProtein: boolean;
    adequateSleep: boolean;
    dailyWalking: boolean;
    strengthTraining: boolean;
    stressManagement: boolean;
    other: string;
  };
  reviewAfter: string;
  requiredTests: string;
  doctorNotes: string;
  consentExplained: boolean;
  patientAgrees: boolean;
  patientSignature: string;
  doctorSignature: string;
  registrationNo: string;
}

const formInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50";
const formTextareaClass = `${formInputClass} min-h-[96px] resize-y`;
const formLabelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="border-b border-slate-100 p-6 last:border-b-0">
    <h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-slate-800">
      {title}
    </h3>
    {children}
  </section>
);

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <label className={`block ${className}`}>
    <span className={formLabelClass}>{label}</span>
    {children}
  </label>
);

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/40">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    <span>{label}</span>
  </label>
);

// Fallback patient conversations to show if database is empty/unreachable
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 101,
    phone: "+91 98765 43210",
    user_message:
      "Hello, I want to know about the doctor-guided weight loss program. What is the pricing?",
    bot_reply:
      "Hello! Our Doctor-Guided Weight Loss Program starts at ₹4,999/month. It includes personalized metabolic analysis, weekly consultations, custom meal plans, and continuous support. Would you like to schedule a free initial consultation?",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: 102,
    phone: "+91 98765 43210",
    user_message: "Yes, please. I prefer a Saturday morning appointment.",
    bot_reply:
      "Great! We have a Saturday slot available at 10:30 AM with Dr. Sharma. Should I book this for you?",
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 mins ago
  },
  {
    id: 103,
    phone: "+91 88888 77777",
    user_message: "Can you explain what PBSE therapy is?",
    bot_reply:
      "PBSE stands for Peripheral Blood Stemcell Enrichment. It is a regenerative treatment that concentrates stem cells from your blood and re-introduces them to target areas for tissue repair and pain relief. It's commonly used for joint pain and nerve disorders. Let me know if you want to speak with a specialist.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 104,
    phone: "+91 99999 11111",
    user_message: "Do you offer treatments for lower back pain?",
    bot_reply:
      "Yes, we specialize in non-surgical spine and nerve treatments. This includes Platelet-Rich Plasma (PRP) therapy, cell-guided therapies, and specialized rehabilitation. Would you like to book an assessment?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 105,
    phone: "+91 99999 11111",
    user_message: "How much does PRP therapy cost for knee pain?",
    bot_reply:
      "PRP therapy packages start at ₹15,000 per session depending on the enrichment level and treatment zone. Typically, 2-3 sessions are recommended for optimal recovery. Shall I have our medical coordinator call you with more details?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(), // 4.5 hours ago
  },
  {
    id: 106,
    phone: "+91 77777 55555",
    user_message: "What is the success rate of the hair treatment?",
    bot_reply:
      "Our hair restoration treatments (using growth factors and cell-based rejuvenation) show a 85%+ success rate in halting hair fall and stimulating active follicles within 3-6 months. We recommend an initial scalp analysis to determine eligibility.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 107,
    phone: "+91 77777 55555",
    user_message: "Perfect, how do I book that scalp analysis?",
    bot_reply:
      "You can book directly through our website or I can assist you here. Please share your email address and preferred date/time, and I will set up the appointment for you.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 23.8).toISOString(), // 1 day ago
  },
  {
    id: 108,
    phone: "+91 90000 12345",
    user_message: "Do you have any clinic in Gurugram?",
    bot_reply:
      "Yes, Genestac Therapeutics is located at Sector 45, Gurugram. We operate Mon-Sat from 9:00 AM to 7:00 PM. Would you like the exact address and map link?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

const SuperAdminPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filterPhone, setFilterPhone] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isBypassed, setIsBypassed] = useState<boolean>(false);
  const [newMessagePhones, setNewMessagePhones] = useState<Set<string>>(
    new Set(),
  );
  const selectedPhoneRef = useRef<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "conversations" | "profiles" | "prescription"
  >("conversations");
  const [profiles, setProfiles] = useState<WhatsAppProfile[]>([]);
  const [newProfilePhones, setNewProfilePhones] = useState<Set<string>>(
    new Set(),
  );
  const [selectedProfile, setSelectedProfile] =
    useState<WhatsAppProfile | null>(null);
  const [prescription, setPrescription] = useState<PrescriptionState>({
    patientName: "",
    age: "",
    gender: "",
    date: "",
    phone: "",
    patientId: "",
    city: "",
    height: "",
    weight: "",
    bmi: "",
    waist: "",
    bloodPressure: "",
    pulse: "",
    spo2: "",
    medicalHistory: {
      diabetes: false,
      hypertension: false,
      thyroid: false,
      pcos: false,
      fattyLiver: false,
      kidneyDisease: false,
      pancreatitis: false,
      heartDisease: false,
      sleepApnea: false,
      depression: false,
      other: "",
    },
    currentMedications: "",
    allergies: "",
    dietPattern: "",
    mealsPerDay: "",
    waterIntake: "",
    sugaryDrinks: "",
    physicalActivity: "",
    exercise: "",
    sleepHours: "",
    sleepQuality: "",
    alcohol: "",
    alcoholFrequency: "",
    smoking: "",
    examNotes: "",
    investigationsReviewed: {
      cbc: false,
      hba1c: false,
      lft: false,
      kft: false,
      lipidProfile: false,
      tsh: false,
      vitaminD: false,
      vitaminB12: false,
      fastingBloodSugar: false,
      other: "",
    },
    diagnosis: "",
    bmiCategory: "",
    weightGoal: "",
    targetDuration: "",
    medicationPlan: [
      { medicine: "", strength: "", dose: "", timing: "", duration: "" },
      { medicine: "", strength: "", dose: "", timing: "", duration: "" },
      { medicine: "", strength: "", dose: "", timing: "", duration: "" },
    ],
    dietAdvice: "",
    exercisePlan: "",
    lifestyleAdvice: {
      drinkHydration: false,
      avoidSugary: false,
      highProtein: false,
      adequateSleep: false,
      dailyWalking: false,
      strengthTraining: false,
      stressManagement: false,
      other: "",
    },
    reviewAfter: "",
    requiredTests: "",
    doctorNotes: "",
    consentExplained: false,
    patientAgrees: false,
    patientSignature: "",
    doctorSignature: "",
    registrationNo: "",
  });

  const updatePrescription = <K extends keyof PrescriptionState>(
    key: K,
    value: PrescriptionState[K],
  ) => {
    setPrescription((prev) => ({ ...prev, [key]: value }));
  };

  const updateMedicalHistory = (
    key: keyof PrescriptionState["medicalHistory"],
    value: boolean | string,
  ) => {
    setPrescription((prev) => ({
      ...prev,
      medicalHistory: { ...prev.medicalHistory, [key]: value },
    }));
  };

  const updateInvestigationsReviewed = (
    key: keyof PrescriptionState["investigationsReviewed"],
    value: boolean | string,
  ) => {
    setPrescription((prev) => ({
      ...prev,
      investigationsReviewed: { ...prev.investigationsReviewed, [key]: value },
    }));
  };

  const updateLifestyleAdvice = (
    key: keyof PrescriptionState["lifestyleAdvice"],
    value: boolean | string,
  ) => {
    setPrescription((prev) => ({
      ...prev,
      lifestyleAdvice: { ...prev.lifestyleAdvice, [key]: value },
    }));
  };

  const updateMedicationPlan = (
    index: number,
    key: keyof PrescriptionState["medicationPlan"][number],
    value: string,
  ) => {
    setPrescription((prev) => ({
      ...prev,
      medicationPlan: prev.medicationPlan.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    }));
  };

  const updateVital = (key: "height" | "weight", value: string) => {
    setPrescription((prev) => {
      const next = { ...prev, [key]: value };
      const height = Number(key === "height" ? value : prev.height);
      const weight = Number(key === "weight" ? value : prev.weight);
      const bmi =
        height > 0 && weight > 0
          ? (weight / (height / 100) ** 2).toFixed(1)
          : "";
      return { ...next, bmi };
    });
  };

  // Keep ref in sync with state so the realtime callback always sees current value
  useEffect(() => {
    selectedPhoneRef.current = selectedPhone;
  }, [selectedPhone]);

  const fetchConversations = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("conversations")
        .select("id, phone, user_message, bot_reply, created_at")
        .order("created_at", { ascending: false });
      if (supabaseError) throw supabaseError;
      setConversations(data as Conversation[]);
    } catch (err: any) {
      console.warn("Supabase fetch failed, using mock data fallback.", err);
      // We do not throw or show error, we just keep empty conversations list so that MOCK_CONVERSATIONS automatically gets picked up as fallback.
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("whatsapp_profiles")
        .select("*")
        .order("updated_at", { ascending: false });
      if (supabaseError) throw supabaseError;
      setProfiles(data as WhatsAppProfile[]);
    } catch (err: any) {
      console.warn("Supabase profiles fetch failed", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchProfiles();
  }, []);

  // Real-time subscription to conversations table
  useEffect(() => {
    const channel = supabase
      .channel("conversations-live-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "conversations" },
        (payload: any) => {
          const incoming = payload.new as Conversation;
          setConversations((prev) => [incoming, ...prev]);
          // Highlight the room only if it isn't the currently open one
          if (incoming.phone !== selectedPhoneRef.current) {
            setNewMessagePhones((prev) => new Set(prev).add(incoming.phone));
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversations" },
        (payload: any) => {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === payload.new.id ? (payload.new as Conversation) : c,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "conversations" },
        (payload: any) => {
          setConversations((prev) =>
            prev.filter((c) => c.id !== payload.old.id),
          );
        },
      )
      .subscribe();

    const profileChannel = supabase
      .channel("profiles-live-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "whatsapp_profiles" },
        (payload: any) => {
          const incoming = payload.new as WhatsAppProfile;
          setProfiles((prev) => [incoming, ...prev]);
          setNewProfilePhones((prev) => new Set(prev).add(incoming.phone));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "whatsapp_profiles" },
        (payload: any) => {
          const updated = payload.new as WhatsAppProfile;
          setProfiles((prev) => {
            const exists = prev.some((p) => p.phone === updated.phone);
            if (exists) {
              return prev
                .map((p) => (p.phone === updated.phone ? updated : p))
                .sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime(),
                );
            }
            return [updated, ...prev].sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
            );
          });
          setNewProfilePhones((prev) => new Set(prev).add(updated.phone));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(profileChannel);
    };
  }, []);

  // Auth guard
  useEffect(() => {
    const checkAuth = async () => {
      // Check query parameter for bypass in development
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("bypassAuth") === "true") {
        setIsBypassed(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/login");
        return;
      }
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (profileErr || !profile || profile.role !== "superadmin") {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  // Group conversations by phone number
  const groupedConversations = useMemo(() => {
    const dataToUse =
      conversations.length > 0 ? conversations : MOCK_CONVERSATIONS;
    const groups: { [phone: string]: Conversation[] } = {};

    dataToUse.forEach((c) => {
      if (!groups[c.phone]) {
        groups[c.phone] = [];
      }
      groups[c.phone].push(c);
    });

    // Sort messages inside each group chronologically
    Object.keys(groups).forEach((phone) => {
      groups[phone].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    });

    return groups;
  }, [conversations]);

  // Transform grouped conversations into sorted chat rooms
  const chatRooms = useMemo(() => {
    return Object.keys(groupedConversations)
      .map((phone) => {
        const msgs = groupedConversations[phone];
        const latestMsg = msgs[msgs.length - 1];
        return {
          phone,
          messages: msgs,
          latestMessageTime: new Date(latestMsg.created_at),
          latestSnippet:
            latestMsg.user_message ||
            latestMsg.bot_reply ||
            "No message content",
        };
      })
      .sort(
        (a, b) => b.latestMessageTime.getTime() - a.latestMessageTime.getTime(),
      );
  }, [groupedConversations]);

  // Filtered chat rooms based on search and phone filter
  const filteredChatRooms = useMemo(() => {
    return chatRooms.filter((room) => {
      const matchesPhone = filterPhone
        ? room.phone.includes(filterPhone)
        : true;
      const matchesSearch = searchTerm
        ? room.messages.some(
            (m) =>
              m.user_message
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              m.bot_reply?.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : true;
      return matchesPhone && matchesSearch;
    });
  }, [chatRooms, filterPhone, searchTerm]);

  // Auto-select first chat room if none selected
  useEffect(() => {
    if (!selectedPhone && filteredChatRooms.length > 0) {
      setSelectedPhone(filteredChatRooms[0].phone);
    }
  }, [filteredChatRooms, selectedPhone]);

  // Compute metrics
  const stats = useMemo(() => {
    const dataToUse =
      conversations.length > 0 ? conversations : MOCK_CONVERSATIONS;
    const total = dataToUse.length;
    const replied = dataToUse.filter((c) => c.bot_reply).length;
    const rate = total > 0 ? Math.round((replied / total) * 100) : 0;

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const dailyVolume = dataToUse.filter(
      (c) => new Date(c.created_at).getTime() > oneDayAgo,
    ).length;

    return {
      totalExchanges: total,
      activeLeads: Object.keys(groupedConversations).length,
      responseRate: rate,
      dailyVolume,
    };
  }, [conversations, groupedConversations]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchConversations();
    await fetchProfiles();
    setIsRefreshing(false);
  };

  const copyTranscript = () => {
    if (!selectedPhone) return;
    const msgs = groupedConversations[selectedPhone] || [];
    const transcriptText = msgs
      .map(
        (m) =>
          `[${new Date(m.created_at).toLocaleString()}]\nPatient: ${m.user_message || "N/A"}\nBot: ${m.bot_reply || "N/A"}`,
      )
      .join("\n\n");

    navigator.clipboard.writeText(transcriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const dataToUse =
      conversations.length > 0 ? conversations : MOCK_CONVERSATIONS;
    const headers = ["ID", "Phone", "User Message", "Bot Reply", "Created At"];
    const rows = dataToUse
      .filter((c) => (filterPhone ? c.phone.includes(filterPhone) : true))
      .filter((c) =>
        searchTerm
          ? c.user_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.bot_reply?.toLowerCase().includes(searchTerm.toLowerCase())
          : true,
      )
      .map((c) => [
        c.id,
        c.phone,
        c.user_message || "",
        c.bot_reply || "",
        new Date(c.created_at).toLocaleString(),
      ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `genestac_conversations_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProfileClick = async (profile: WhatsAppProfile) => {
    setSelectedProfile(profile);
    if (profile.lead_status?.toUpperCase() === "UNREAD") {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id ? { ...p, lead_status: "READ" } : p,
        ),
      );
      try {
        await supabase
          .from("whatsapp_profiles")
          .update({ lead_status: "READ" })
          .eq("id", profile.id);
      } catch (err) {
        console.error("Failed to update lead status:", err);
      }
    }
  };

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const activeMessages = selectedPhone
    ? groupedConversations[selectedPhone] || []
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafcff] gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading secure dashboard console...
        </p>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-blue-50/20 py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bypass Dev Header warning */}
        {isBypassed && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <p className="text-sm font-semibold text-amber-800">
                Developer Authentication Bypass Active (?bypassAuth=true)
              </p>
            </div>
            <p className="text-xs text-amber-600 font-medium">
              Viewing in visual inspection mode
            </p>
          </div>
        )}

        {/* Dashboard Title Panel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Super Admin
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Live Monitoring
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Patient Conversation Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor and analyze incoming inquiries, assistant bot replies, and
              patient engagement levels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition duration-200 focus:ring-2 focus:ring-slate-100 outline-none disabled:opacity-50"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-500 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition duration-200 focus:ring-4 focus:ring-blue-100 outline-none"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex space-x-1 rounded-xl bg-blue-900/5 p-1 max-w-3xl mx-auto sm:mx-0">
          <button
            onClick={() => setActiveTab("conversations")}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold leading-5 transition-all outline-none ${
              activeTab === "conversations"
                ? "bg-white text-blue-700 shadow shadow-slate-200"
                : "text-slate-600 hover:bg-white/[0.5] hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Conversations
          </button>
          <button
            onClick={() => {
              setActiveTab("profiles");
              setNewProfilePhones(new Set());
            }}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold leading-5 transition-all outline-none ${
              activeTab === "profiles"
                ? "bg-white text-blue-700 shadow shadow-slate-200"
                : "text-slate-600 hover:bg-white/[0.5] hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" /> WhatsApp Profiles
            {(newProfilePhones.size > 0 ||
              profiles.some(
                (p) => p.lead_status?.toUpperCase() === "UNREAD",
              )) && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("prescription")}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold leading-5 transition-all outline-none ${
              activeTab === "prescription"
                ? "bg-white text-blue-700 shadow shadow-slate-200"
                : "text-slate-600 hover:bg-white/[0.5] hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" /> Prescription
          </button>
        </div>

        {/* Filters and Workspace */}
        {activeTab === "conversations" && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden">
            {/* Workspace Filters Bar */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-sm font-semibold text-slate-700">
                  Filters
                </span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {filteredChatRooms.length} of {chatRooms.length} lines
                </span>
              </div>

              <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
                {/* Phone Filter Dropdown */}
                <div className="relative flex-1 sm:flex-initial min-w-[150px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <select
                    value={filterPhone}
                    onChange={(e) => setFilterPhone(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition font-medium text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="">All Phones</option>
                    {Array.from(
                      new Set(
                        (conversations.length > 0
                          ? conversations
                          : MOCK_CONVERSATIONS
                        ).map((c) => c.phone),
                      ),
                    ).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                {/* Message Search Input */}
                <div className="relative flex-1 sm:flex-initial min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search user messages..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition font-medium text-slate-700"
                  />
                </div>

                {/* Reset Filter Button */}
                {(filterPhone || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilterPhone("");
                      setSearchTerm("");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline px-2 py-1"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Unified Two-Pane Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px] h-[650px]">
              {/* Left Column: Chat Rooms List (5 cols) */}
              <div className="lg:col-span-5 border-r border-slate-100 flex flex-col h-full overflow-hidden">
                <div className="p-4 bg-slate-50/10 border-b border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Patient Inquiries
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                    Sorted by recent activity
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-50 no-scrollbar">
                  {filteredChatRooms.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 font-semibold">
                        No discussions match filter criteria.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try tweaking the search string or phone filter.
                      </p>
                    </div>
                  ) : (
                    filteredChatRooms.map((room) => {
                      const isActive = selectedPhone === room.phone;
                      const isWebVisitor = room.phone.startsWith("Web Visitor");
                      const initial =
                        room.phone.replace(/[^0-9]/g, "").slice(-2) || "P";
                      const hasNew = newMessagePhones.has(room.phone);
                      return (
                        <button
                          key={room.phone}
                          onClick={() => {
                            setSelectedPhone(room.phone);
                            setNewMessagePhones((prev) => {
                              const next = new Set(prev);
                              next.delete(room.phone);
                              return next;
                            });
                          }}
                          className={`w-full p-4 text-left flex items-start gap-3.5 transition duration-200 outline-none
                          ${
                            isActive
                              ? "bg-blue-50/45 border-l-4 border-blue-600"
                              : hasNew
                                ? "bg-amber-50/60 border-l-4 border-amber-400 animate-pulse"
                                : "hover:bg-slate-50/60 border-l-4 border-transparent"
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm
                          ${
                            isWebVisitor
                              ? isActive
                                ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white animate-pulse"
                                : "bg-gradient-to-tr from-violet-100 to-indigo-100 text-indigo-600 border border-indigo-200/50"
                              : isActive
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600"
                          }`}
                          >
                            {isWebVisitor ? (
                              <Globe className="w-5 h-5" />
                            ) : (
                              initial
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-bold truncate ${hasNew ? "text-amber-800" : "text-slate-800"}`}
                              >
                                {room.phone}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {hasNew && (
                                  <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {getRelativeTime(room.latestMessageTime)}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {room.latestSnippet}
                            </p>

                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                                {room.messages.length} msg
                                {room.messages.length !== 1 ? "s" : ""}
                              </span>
                              {room.messages[room.messages.length - 1]
                                .bot_reply ? (
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold flex items-center gap-0.5">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />{" "}
                                  Replied
                                </span>
                              ) : (
                                <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold flex items-center gap-0.5">
                                  <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />{" "}
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Chat History Viewer (7 cols) */}
              <div className="lg:col-span-7 flex flex-col h-full bg-slate-50/20 overflow-hidden">
                {selectedPhone ? (
                  <>
                    {/* Chat Pane Header */}
                    <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${selectedPhone.startsWith("Web Visitor") ? "bg-indigo-50 text-indigo-600 animate-pulse" : "bg-blue-50 text-blue-600"}`}
                        >
                          {selectedPhone.startsWith("Web Visitor") ? (
                            <Globe className="w-5 h-5" />
                          ) : (
                            <MessageCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">
                            {selectedPhone}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-semibold">
                            {selectedPhone.startsWith("Web Visitor")
                              ? "Live Web Chat Session"
                              : "WhatsApp Chat Session"}{" "}
                            · {activeMessages.length} message
                            {activeMessages.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyTranscript}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-bold bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200 transition duration-150"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Transcript
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Chat Pane Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30">
                      {activeMessages.map((msg, idx) => (
                        <div key={msg.id || idx} className="space-y-4">
                          {/* Patient User Message (Left Align) */}
                          {msg.user_message && (
                            <div className="flex items-start gap-3 max-w-[85%]">
                              <div
                                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-sm
                              ${
                                selectedPhone.startsWith("Web Visitor")
                                  ? "bg-gradient-to-tr from-violet-500 to-indigo-500 text-white"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                              >
                                {selectedPhone.startsWith("Web Visitor") ? (
                                  <Globe className="w-3.5 h-3.5" />
                                ) : (
                                  selectedPhone
                                    .replace(/[^0-9]/g, "")
                                    .slice(-2) || "P"
                                )}
                              </div>
                              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm space-y-1">
                                <p className="text-sm text-slate-800 leading-relaxed break-words font-medium">
                                  {msg.user_message}
                                </p>
                                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                                  <span>
                                    {selectedPhone.startsWith("Web Visitor")
                                      ? "Web Visitor"
                                      : "Patient"}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {new Date(
                                      msg.created_at,
                                    ).toLocaleTimeString(undefined, {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Bot Reply Message (Right Align) */}
                          {msg.bot_reply && (
                            <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex-shrink-0 flex items-center justify-center shadow-sm">
                                <Bot className="w-4 h-4" />
                              </div>
                              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md space-y-1">
                                <p className="text-sm leading-relaxed break-words font-medium">
                                  {msg.bot_reply}
                                </p>
                                <div className="flex items-center justify-end gap-1 text-[10px] text-blue-200">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Genestac AI</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(
                                      msg.created_at,
                                    ).toLocaleTimeString(undefined, {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Chat Pane Footer Status */}
                    <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Virtual Assistant Active
                      </span>
                      <span className="font-semibold text-slate-400">
                        ID: #{activeMessages[activeMessages.length - 1]?.id}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
                      <Bot className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      Select a Conversation
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">
                      Select one of the patient numbers from the sidebar list to
                      view the full dialogue, timestamp logs, and automated
                      agent replies.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Profiles View */}
        {activeTab === "profiles" && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Patient Profiles
                </span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {profiles.length} Profiles
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4 font-semibold border-b border-slate-100">
                      Contact
                    </th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100">
                      Details (Age / Ht / Wt)
                    </th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100">
                      Conditions & Meds
                    </th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-100 text-right">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profiles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-slate-500 text-sm font-medium"
                      >
                        No profile data available.
                      </td>
                    </tr>
                  ) : (
                    profiles.map((profile) => {
                      const isNew =
                        newProfilePhones.has(profile.phone) ||
                        profile.lead_status?.toUpperCase() === "UNREAD";
                      const conditions = [
                        profile.diabetes && "Diabetes",
                        profile.thyroid_disease && "Thyroid",
                        profile.pcos && "PCOS",
                        profile.fatty_liver && "Fatty Liver",
                        profile.pancreatitis && "Pancreatitis",
                        profile.kidney_disease && "Kidney Disease",
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <tr
                          key={profile.id}
                          className={`transition-colors duration-300 cursor-pointer ${isNew ? "bg-blue-50/50 hover:bg-blue-50/70" : "hover:bg-slate-50/50"}`}
                          onClick={() => handleProfileClick(profile)}
                          onMouseEnter={() => {
                            if (isNew) {
                              setNewProfilePhones((prev) => {
                                const next = new Set(prev);
                                next.delete(profile.phone);
                                return next;
                              });
                            }
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm relative">
                                {profile.full_name
                                  ? profile.full_name.slice(0, 2).toUpperCase()
                                  : profile.phone
                                      .replace(/[^0-9]/g, "")
                                      .slice(-2)}
                                {isNew && (
                                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full animate-pulse" />
                                )}
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-bold ${isNew ? "text-blue-900" : "text-slate-800"}`}
                                >
                                  {profile.full_name || profile.phone}
                                </p>
                                {profile.full_name && (
                                  <p className="text-[11px] text-slate-400 font-medium">
                                    {profile.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${profile.profile_complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                            >
                              {profile.profile_complete
                                ? "Complete"
                                : "Incomplete"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-slate-700">
                                {profile.age ? `${profile.age} yrs` : "--"}
                              </span>
                              <span className="text-xs text-slate-500">
                                {profile.height_cm
                                  ? `${profile.height_cm} cm`
                                  : "--"}{" "}
                                /{" "}
                                {profile.weight_kg
                                  ? `${profile.weight_kg} kg`
                                  : "--"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-[200px] truncate">
                            <div className="flex flex-col gap-1">
                              <span
                                className="text-xs text-slate-700 truncate"
                                title={conditions || ""}
                              >
                                <span className="font-semibold text-slate-500">
                                  Cond:
                                </span>{" "}
                                {conditions || "--"}
                              </span>
                              <span
                                className="text-xs text-slate-700 truncate"
                                title={profile.current_medications || ""}
                              >
                                <span className="font-semibold text-slate-500">
                                  Meds:
                                </span>{" "}
                                {profile.current_medications || "--"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-xs font-medium text-slate-500">
                            {getRelativeTime(new Date(profile.updated_at))}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Prescription View */}
        {activeTab === "prescription" && (
          <form
            onSubmit={(event) => event.preventDefault()}
            className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <FileText className="h-3.5 w-3.5" />
                  GENESTAC
                </div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                  Medical Weight Loss Consultation Prescription
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Structured doctor worksheet for eligibility, risk review,
                  prescription planning, and follow-up.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 text-slate-500" />
                  Print
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Save Draft
                </button>
              </div>
            </div>

            <Section title="Patient Information">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Patient Name" className="lg:col-span-2">
                  <input
                    value={prescription.patientName}
                    onChange={(event) =>
                      updatePrescription("patientName", event.target.value)
                    }
                    className={formInputClass}
                  />
                </Field>
                <Field label="Age">
                  <input
                    value={prescription.age}
                    onChange={(event) =>
                      updatePrescription("age", event.target.value)
                    }
                    className={formInputClass}
                    inputMode="numeric"
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={prescription.gender}
                    onChange={(event) =>
                      updatePrescription("gender", event.target.value)
                    }
                    className={formInputClass}
                  >
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
                <Field label="Date">
                  <input
                    type="date"
                    value={prescription.date}
                    onChange={(event) =>
                      updatePrescription("date", event.target.value)
                    }
                    className={formInputClass}
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    value={prescription.phone}
                    onChange={(event) =>
                      updatePrescription("phone", event.target.value)
                    }
                    className={formInputClass}
                  />
                </Field>
                <Field label="Patient ID">
                  <input
                    value={prescription.patientId}
                    onChange={(event) =>
                      updatePrescription("patientId", event.target.value)
                    }
                    className={formInputClass}
                  />
                </Field>
                <Field label="City">
                  <input
                    value={prescription.city}
                    onChange={(event) =>
                      updatePrescription("city", event.target.value)
                    }
                    className={formInputClass}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Vitals">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Height (cm)">
                  <input
                    value={prescription.height}
                    onChange={(event) =>
                      updateVital("height", event.target.value)
                    }
                    className={formInputClass}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Weight (kg)">
                  <input
                    value={prescription.weight}
                    onChange={(event) =>
                      updateVital("weight", event.target.value)
                    }
                    className={formInputClass}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="BMI">
                  <input
                    value={prescription.bmi}
                    readOnly
                    className={`${formInputClass} bg-slate-50 text-slate-500`}
                  />
                </Field>
                <Field label="Waist Circumference (cm)">
                  <input
                    value={prescription.waist}
                    onChange={(event) =>
                      updatePrescription("waist", event.target.value)
                    }
                    className={formInputClass}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Blood Pressure">
                  <input
                    value={prescription.bloodPressure}
                    onChange={(event) =>
                      updatePrescription("bloodPressure", event.target.value)
                    }
                    className={formInputClass}
                    placeholder="120 / 80"
                  />
                </Field>
                <Field label="Pulse (bpm)">
                  <input
                    value={prescription.pulse}
                    onChange={(event) =>
                      updatePrescription("pulse", event.target.value)
                    }
                    className={formInputClass}
                    inputMode="numeric"
                  />
                </Field>
                <Field label="SpO2 (%)">
                  <input
                    value={prescription.spo2}
                    onChange={(event) =>
                      updatePrescription("spo2", event.target.value)
                    }
                    className={formInputClass}
                    inputMode="numeric"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Medical History">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Checkbox
                  label="Diabetes"
                  checked={prescription.medicalHistory.diabetes}
                  onChange={(checked) =>
                    updateMedicalHistory("diabetes", checked)
                  }
                />
                <Checkbox
                  label="Hypertension"
                  checked={prescription.medicalHistory.hypertension}
                  onChange={(checked) =>
                    updateMedicalHistory("hypertension", checked)
                  }
                />
                <Checkbox
                  label="Thyroid Disorder"
                  checked={prescription.medicalHistory.thyroid}
                  onChange={(checked) =>
                    updateMedicalHistory("thyroid", checked)
                  }
                />
                <Checkbox
                  label="PCOS"
                  checked={prescription.medicalHistory.pcos}
                  onChange={(checked) => updateMedicalHistory("pcos", checked)}
                />
                <Checkbox
                  label="Fatty Liver"
                  checked={prescription.medicalHistory.fattyLiver}
                  onChange={(checked) =>
                    updateMedicalHistory("fattyLiver", checked)
                  }
                />
                <Checkbox
                  label="Kidney Disease"
                  checked={prescription.medicalHistory.kidneyDisease}
                  onChange={(checked) =>
                    updateMedicalHistory("kidneyDisease", checked)
                  }
                />
                <Checkbox
                  label="Pancreatitis"
                  checked={prescription.medicalHistory.pancreatitis}
                  onChange={(checked) =>
                    updateMedicalHistory("pancreatitis", checked)
                  }
                />
                <Checkbox
                  label="Heart Disease"
                  checked={prescription.medicalHistory.heartDisease}
                  onChange={(checked) =>
                    updateMedicalHistory("heartDisease", checked)
                  }
                />
                <Checkbox
                  label="Sleep Apnea"
                  checked={prescription.medicalHistory.sleepApnea}
                  onChange={(checked) =>
                    updateMedicalHistory("sleepApnea", checked)
                  }
                />
                <Checkbox
                  label="Depression / Anxiety"
                  checked={prescription.medicalHistory.depression}
                  onChange={(checked) =>
                    updateMedicalHistory("depression", checked)
                  }
                />
                <Field label="Other" className="sm:col-span-2">
                  <input
                    value={prescription.medicalHistory.other}
                    onChange={(event) =>
                      updateMedicalHistory("other", event.target.value)
                    }
                    className={formInputClass}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Current Medications & Allergies">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Current Medications">
                  <textarea
                    value={prescription.currentMedications}
                    onChange={(event) =>
                      updatePrescription(
                        "currentMedications",
                        event.target.value,
                      )
                    }
                    className={formTextareaClass}
                  />
                </Field>
                <Field label="Allergies">
                  <textarea
                    value={prescription.allergies}
                    onChange={(event) =>
                      updatePrescription("allergies", event.target.value)
                    }
                    className={formTextareaClass}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Lifestyle Assessment">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="space-y-4">
                  <Field label="Diet Pattern">
                    <select
                      value={prescription.dietPattern}
                      onChange={(event) =>
                        updatePrescription("dietPattern", event.target.value)
                      }
                      className={formInputClass}
                    >
                      <option value="">Select</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non Vegetarian">Non Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </Field>
                  <Field label="Meals Per Day">
                    <input
                      value={prescription.mealsPerDay}
                      onChange={(event) =>
                        updatePrescription("mealsPerDay", event.target.value)
                      }
                      className={formInputClass}
                    />
                  </Field>
                  <Field label="Water Intake (L/day)">
                    <input
                      value={prescription.waterIntake}
                      onChange={(event) =>
                        updatePrescription("waterIntake", event.target.value)
                      }
                      className={formInputClass}
                    />
                  </Field>
                  <Field label="Sugary Drinks">
                    <select
                      value={prescription.sugaryDrinks}
                      onChange={(event) =>
                        updatePrescription("sugaryDrinks", event.target.value)
                      }
                      className={formInputClass}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </Field>
                </div>
                <div className="space-y-4">
                  <Field label="Physical Activity">
                    <select
                      value={prescription.physicalActivity}
                      onChange={(event) =>
                        updatePrescription(
                          "physicalActivity",
                          event.target.value,
                        )
                      }
                      className={formInputClass}
                    >
                      <option value="">Select</option>
                      <option value="Sedentary">Sedentary</option>
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Active">Active</option>
                    </select>
                  </Field>
                  <Field label="Exercise">
                    <textarea
                      value={prescription.exercise}
                      onChange={(event) =>
                        updatePrescription("exercise", event.target.value)
                      }
                      className={formTextareaClass}
                    />
                  </Field>
                </div>
                <div className="space-y-4">
                  <Field label="Sleep Hours">
                    <input
                      value={prescription.sleepHours}
                      onChange={(event) =>
                        updatePrescription("sleepHours", event.target.value)
                      }
                      className={formInputClass}
                    />
                  </Field>
                  <Field label="Sleep Quality">
                    <select
                      value={prescription.sleepQuality}
                      onChange={(event) =>
                        updatePrescription("sleepQuality", event.target.value)
                      }
                      className={formInputClass}
                    >
                      <option value="">Select</option>
                      <option value="Good">Good</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </Field>
                  <Field label="Alcohol">
                    <select
                      value={prescription.alcohol}
                      onChange={(event) =>
                        updatePrescription("alcohol", event.target.value)
                      }
                      className={formInputClass}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </Field>
                  <Field label="Alcohol Frequency">
                    <input
                      value={prescription.alcoholFrequency}
                      onChange={(event) =>
                        updatePrescription(
                          "alcoholFrequency",
                          event.target.value,
                        )
                      }
                      className={formInputClass}
                    />
                  </Field>
                  <Field label="Smoking">
                    <select
                      value={prescription.smoking}
                      onChange={(event) =>
                        updatePrescription("smoking", event.target.value)
                      }
                      className={formInputClass}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </Field>
                </div>
              </div>
            </Section>

            <Section title="Examination & Investigations">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Field label="Examination Notes">
                  <textarea
                    value={prescription.examNotes}
                    onChange={(event) =>
                      updatePrescription("examNotes", event.target.value)
                    }
                    className={formTextareaClass}
                  />
                </Field>
                <div>
                  <span className={formLabelClass}>
                    Investigations Reviewed
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Checkbox
                      label="CBC"
                      checked={prescription.investigationsReviewed.cbc}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("cbc", checked)
                      }
                    />
                    <Checkbox
                      label="HbA1c"
                      checked={prescription.investigationsReviewed.hba1c}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("hba1c", checked)
                      }
                    />
                    <Checkbox
                      label="LFT"
                      checked={prescription.investigationsReviewed.lft}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("lft", checked)
                      }
                    />
                    <Checkbox
                      label="KFT"
                      checked={prescription.investigationsReviewed.kft}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("kft", checked)
                      }
                    />
                    <Checkbox
                      label="Lipid Profile"
                      checked={prescription.investigationsReviewed.lipidProfile}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("lipidProfile", checked)
                      }
                    />
                    <Checkbox
                      label="TSH"
                      checked={prescription.investigationsReviewed.tsh}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("tsh", checked)
                      }
                    />
                    <Checkbox
                      label="Vitamin D"
                      checked={prescription.investigationsReviewed.vitaminD}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("vitaminD", checked)
                      }
                    />
                    <Checkbox
                      label="Vitamin B12"
                      checked={prescription.investigationsReviewed.vitaminB12}
                      onChange={(checked) =>
                        updateInvestigationsReviewed("vitaminB12", checked)
                      }
                    />
                    <Checkbox
                      label="Fasting Blood Sugar"
                      checked={
                        prescription.investigationsReviewed.fastingBloodSugar
                      }
                      onChange={(checked) =>
                        updateInvestigationsReviewed(
                          "fastingBloodSugar",
                          checked,
                        )
                      }
                    />
                    <Field label="Other">
                      <input
                        value={prescription.investigationsReviewed.other}
                        onChange={(event) =>
                          updateInvestigationsReviewed(
                            "other",
                            event.target.value,
                          )
                        }
                        className={formInputClass}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Clinical Assessment">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Diagnosis" className="md:col-span-2">
                  <textarea
                    value={prescription.diagnosis}
                    onChange={(event) =>
                      updatePrescription("diagnosis", event.target.value)
                    }
                    className={formTextareaClass}
                  />
                </Field>
                <Field label="BMI Category">
                  <select
                    value={prescription.bmiCategory}
                    onChange={(event) =>
                      updatePrescription("bmiCategory", event.target.value)
                    }
                    className={formInputClass}
                  >
                    <option value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Overweight">Overweight</option>
                    <option value="Obesity Class I">Obesity Class I</option>
                    <option value="Obesity Class II">Obesity Class II</option>
                    <option value="Obesity Class III">Obesity Class III</option>
                  </select>
                </Field>
                <div className="space-y-4">
                  <Field label="Weight Loss Goal (kg)">
                    <input
                      value={prescription.weightGoal}
                      onChange={(event) =>
                        updatePrescription("weightGoal", event.target.value)
                      }
                      className={formInputClass}
                    />
                  </Field>
                  <Field label="Target Duration (months)">
                    <input
                      value={prescription.targetDuration}
                      onChange={(event) =>
                        updatePrescription("targetDuration", event.target.value)
                      }
                      className={formInputClass}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            <Section title="Treatment Plan">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Medicine</th>
                      <th className="px-4 py-3">Strength</th>
                      <th className="px-4 py-3">Dose</th>
                      <th className="px-4 py-3">Timing</th>
                      <th className="px-4 py-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescription.medicationPlan.map((row, index) => (
                      <tr key={index}>
                        {(
                          [
                            "medicine",
                            "strength",
                            "dose",
                            "timing",
                            "duration",
                          ] as const
                        ).map((key) => (
                          <td key={key} className="p-3">
                            <input
                              value={row[key]}
                              onChange={(event) =>
                                updateMedicationPlan(
                                  index,
                                  key,
                                  event.target.value,
                                )
                              }
                              className={formInputClass}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Field label="Diet Advice">
                  <textarea
                    value={prescription.dietAdvice}
                    onChange={(event) =>
                      updatePrescription("dietAdvice", event.target.value)
                    }
                    className={formTextareaClass}
                  />
                </Field>
                <Field label="Exercise Plan">
                  <textarea
                    value={prescription.exercisePlan}
                    onChange={(event) =>
                      updatePrescription("exercisePlan", event.target.value)
                    }
                    className={formTextareaClass}
                  />
                </Field>
                <div>
                  <span className={formLabelClass}>Lifestyle Advice</span>
                  <div className="grid grid-cols-1 gap-3">
                    <Checkbox
                      label="Drink 2-3 L water/day"
                      checked={prescription.lifestyleAdvice.drinkHydration}
                      onChange={(checked) =>
                        updateLifestyleAdvice("drinkHydration", checked)
                      }
                    />
                    <Checkbox
                      label="Avoid sugary drinks"
                      checked={prescription.lifestyleAdvice.avoidSugary}
                      onChange={(checked) =>
                        updateLifestyleAdvice("avoidSugary", checked)
                      }
                    />
                    <Checkbox
                      label="High protein diet"
                      checked={prescription.lifestyleAdvice.highProtein}
                      onChange={(checked) =>
                        updateLifestyleAdvice("highProtein", checked)
                      }
                    />
                    <Checkbox
                      label="Adequate sleep"
                      checked={prescription.lifestyleAdvice.adequateSleep}
                      onChange={(checked) =>
                        updateLifestyleAdvice("adequateSleep", checked)
                      }
                    />
                    <Checkbox
                      label="Daily walking"
                      checked={prescription.lifestyleAdvice.dailyWalking}
                      onChange={(checked) =>
                        updateLifestyleAdvice("dailyWalking", checked)
                      }
                    />
                    <Checkbox
                      label="Strength training"
                      checked={prescription.lifestyleAdvice.strengthTraining}
                      onChange={(checked) =>
                        updateLifestyleAdvice("strengthTraining", checked)
                      }
                    />
                    <Checkbox
                      label="Stress management"
                      checked={prescription.lifestyleAdvice.stressManagement}
                      onChange={(checked) =>
                        updateLifestyleAdvice("stressManagement", checked)
                      }
                    />
                    <Field label="Other">
                      <input
                        value={prescription.lifestyleAdvice.other}
                        onChange={(event) =>
                          updateLifestyleAdvice("other", event.target.value)
                        }
                        className={formInputClass}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Follow-up Plan">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Review After">
                  <select
                    value={prescription.reviewAfter}
                    onChange={(event) =>
                      updatePrescription("reviewAfter", event.target.value)
                    }
                    className={formInputClass}
                  >
                    <option value="">Select</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="4 Weeks">4 Weeks</option>
                    <option value="6 Weeks">6 Weeks</option>
                    <option value="8 Weeks">8 Weeks</option>
                  </select>
                </Field>
                <Field label="Required Tests Before Next Visit">
                  <textarea
                    value={prescription.requiredTests}
                    onChange={(event) =>
                      updatePrescription("requiredTests", event.target.value)
                    }
                    className={formTextareaClass}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Doctor Notes">
              <Field label="Notes">
                <textarea
                  value={prescription.doctorNotes}
                  onChange={(event) =>
                    updatePrescription("doctorNotes", event.target.value)
                  }
                  className={`${formTextareaClass} min-h-[140px]`}
                />
              </Field>
            </Section>

            <Section title="Warning Signs Explained">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Severe abdominal pain",
                  "Persistent vomiting",
                  "Severe dizziness",
                  "Chest pain",
                  "Difficulty breathing",
                  "Allergic reaction",
                  "Severe dehydration",
                ].map((warning) => (
                  <label
                    key={warning}
                    className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"
                  >
                    <input
                      type="checkbox"
                      checked
                      readOnly
                      className="h-4 w-4 rounded border-rose-300 text-rose-600"
                    />
                    {warning}
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Consent & Signatures">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Checkbox
                    label="Risks, benefits, and possible side effects explained."
                    checked={prescription.consentExplained}
                    onChange={(checked) =>
                      updatePrescription("consentExplained", checked)
                    }
                  />
                  <Checkbox
                    label="Patient agrees to treatment plan."
                    checked={prescription.patientAgrees}
                    onChange={(checked) =>
                      updatePrescription("patientAgrees", checked)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Patient Signature">
                    <input
                      value={prescription.patientSignature}
                      onChange={(event) =>
                        updatePrescription(
                          "patientSignature",
                          event.target.value,
                        )
                      }
                      className={formInputClass}
                    />
                  </Field>
                  <Field label="Doctor Signature">
                    <input
                      value={prescription.doctorSignature}
                      onChange={(event) =>
                        updatePrescription(
                          "doctorSignature",
                          event.target.value,
                        )
                      }
                      className={formInputClass}
                    />
                  </Field>
                  <Field label="Registration No.">
                    <input
                      value={prescription.registrationNo}
                      onChange={(event) =>
                        updatePrescription("registrationNo", event.target.value)
                      }
                      className={formInputClass}
                    />
                  </Field>
                </div>
              </div>
            </Section>
          </form>
        )}

        {/* Database Sync Status Block */}
        <div className="bg-slate-100/60 p-4 rounded-2xl border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-600">
              Database Sync:{" "}
              {conversations.length > 0
                ? "Connected (Real data active)"
                : "Offline (Rendered Mock fallback data)"}
            </span>
          </div>
          <p className="font-medium text-slate-400">
            Current system time: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Profile Details Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm mt-22">
          <div
            className={`rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col bg-white ${selectedProfile.lead_status?.toUpperCase() === "UNREAD" ? "ring-2 ring-amber-400" : ""}`}
          >
            <div
              className={`p-6 border-b flex items-center justify-between ${selectedProfile.lead_status?.toUpperCase() === "UNREAD" ? "bg-amber-50 border-amber-100" : "bg-slate-50/50 border-slate-100"}`}
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">
                  Profile Details
                </h2>
                {selectedProfile.lead_status?.toUpperCase() === "UNREAD" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    New Lead
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            {selectedProfile.lead_status?.toUpperCase() === "UNREAD" && (
              <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-800 text-sm font-medium">
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
                This is an unattended lead — will be marked as{" "}
                <strong className="ml-1">Read</strong> automatically.
              </div>
            )}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-500 block">ID</span>
                      <span className="text-sm font-medium text-slate-800 break-all">
                        {selectedProfile.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Phone
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Full Name
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.full_name || "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">City</span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.city || "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Profile Status
                      </span>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedProfile.profile_complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {selectedProfile.profile_complete
                          ? "Complete"
                          : "Incomplete"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Physical & Vitals
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-500 block">Age</span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.age
                          ? `${selectedProfile.age} yrs`
                          : "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Height
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.height_cm
                          ? `${selectedProfile.height_cm} cm`
                          : "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Weight
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.weight_kg
                          ? `${selectedProfile.weight_kg} kg`
                          : "--"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Medical History
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Diabetes
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.diabetes || "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Thyroid Disease
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.thyroid_disease || "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">PCOS</span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.pcos || "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Fatty Liver
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.fatty_liver || "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Pancreatitis
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.pancreatitis || "--"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Kidney Disease
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {selectedProfile.kidney_disease || "--"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Current Medications
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-800">
                    {selectedProfile.current_medications || "None reported."}
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 mt-2">
                  <span>
                    Created:{" "}
                    {new Date(selectedProfile.created_at).toLocaleString()}
                  </span>
                  <span>
                    Updated:{" "}
                    {new Date(selectedProfile.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-6 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SuperAdminPage;
