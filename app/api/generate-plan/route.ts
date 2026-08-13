import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PEXELS_FOOD_IMAGES: Record<string, string> = {
  poha: "https://images.pexels.com/photos/30769669/pexels-photo-30769669.jpeg?auto=compress&cs=tinysrgb&w=800",
  oats: "https://images.pexels.com/photos/12643933/pexels-photo-12643933.jpeg?auto=compress&cs=tinysrgb&w=800",
  eggs: "https://images.pexels.com/photos/34739831/pexels-photo-34739831.jpeg?auto=compress&cs=tinysrgb&w=800",
  idli: "https://images.pexels.com/photos/37867687/pexels-photo-37867687.jpeg?auto=compress&cs=tinysrgb&w=800",
  paratha: "https://images.pexels.com/photos/18305749/pexels-photo-18305749.jpeg?auto=compress&cs=tinysrgb&w=800",
  salad: "https://images.pexels.com/photos/36478888/pexels-photo-36478888.jpeg?auto=compress&cs=tinysrgb&w=800",
  paneer: "https://images.pexels.com/photos/33430559/pexels-photo-33430559.jpeg?auto=compress&cs=tinysrgb&w=800",
  dal: "https://images.pexels.com/photos/35008222/pexels-photo-35008222.jpeg?auto=compress&cs=tinysrgb&w=800",
  pulao: "https://images.pexels.com/photos/36885725/pexels-photo-36885725.jpeg?auto=compress&cs=tinysrgb&w=800",
  chicken: "https://images.pexels.com/photos/36885763/pexels-photo-36885763.jpeg?auto=compress&cs=tinysrgb&w=800",
  tea: "https://images.pexels.com/photos/8712296/pexels-photo-8712296.jpeg?auto=compress&cs=tinysrgb&w=800",
  fruits: "https://images.pexels.com/photos/984516/pexels-photo-984516.jpeg?auto=compress&cs=tinysrgb&w=800",
  soup: "https://images.pexels.com/photos/10078270/pexels-photo-10078270.jpeg?auto=compress&cs=tinysrgb&w=800",
  sprouts: "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
  default: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
};

function getMealImage(mealDescription: string): string {
  const lower = mealDescription.toLowerCase();
  if (lower.includes("poha")) return PEXELS_FOOD_IMAGES.poha;
  if (lower.includes("oat")) return PEXELS_FOOD_IMAGES.oats;
  if (lower.includes("egg")) return PEXELS_FOOD_IMAGES.eggs;
  if (lower.includes("idli") || lower.includes("dosa")) return PEXELS_FOOD_IMAGES.idli;
  if (lower.includes("paratha") || lower.includes("chilla")) return PEXELS_FOOD_IMAGES.paratha;
  if (lower.includes("salad")) return PEXELS_FOOD_IMAGES.salad;
  if (lower.includes("paneer")) return PEXELS_FOOD_IMAGES.paneer;
  if (lower.includes("dal") || lower.includes("khichdi")) return PEXELS_FOOD_IMAGES.dal;
  if (lower.includes("pulao") || lower.includes("rice") || lower.includes("biryani")) return PEXELS_FOOD_IMAGES.pulao;
  if (lower.includes("chicken") || lower.includes("fish")) return PEXELS_FOOD_IMAGES.chicken;
  if (lower.includes("tea") || lower.includes("coffee") || lower.includes("chaas")) return PEXELS_FOOD_IMAGES.tea;
  if (lower.includes("fruit") || lower.includes("apple") || lower.includes("makhana")) return PEXELS_FOOD_IMAGES.fruits;
  if (lower.includes("soup")) return PEXELS_FOOD_IMAGES.soup;
  if (lower.includes("sprout") || lower.includes("chana")) return PEXELS_FOOD_IMAGES.sprouts;
  return PEXELS_FOOD_IMAGES.default;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, food_habits, lifestyle_habits, medical_issues, allergies } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const healthProfileData = {
      food_habits: food_habits || "",
      lifestyle_habits: lifestyle_habits || "",
      medical_issues: medical_issues || "",
      allergies: allergies || "",
      submitted_at: new Date().toISOString(),
    };

    // STEP 1: Immediately save health_profile to user_plans so user data is NEVER lost
    const { data: existing } = await supabaseAdmin
      .from("user_plans")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("user_plans")
        .update({
          health_profile: healthProfileData,
          doctor_review: false,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      await supabaseAdmin.from("user_plans").insert({
        user_id: userId,
        health_profile: healthProfileData,
        doctor_review: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // STEP 2: Fast AI Plan Generation
    const openAiApiKey = process.env.OPENAI_API_KEY;
    const nvidiaKey = process.env.NVIDIA_KEY;

    let aiDietPlan: any = null;
    let aiExercisePlan: any = null;

    const userDetailsPrompt = `User Profile:
- Food Habits: ${food_habits || "Standard diet"}
- Lifestyle: ${lifestyle_habits || "Moderate daily activity"}
- Medical Conditions: ${medical_issues || "None"}
- Allergies: ${allergies || "None"}`;

    const systemPrompt = `You are a nutrition & fitness AI assistant. Generate a 7-day Diet Plan ("diet_plan") and Exercise Plan ("exercise_plan") customized for the user.
Respond ONLY with a valid JSON object:
{
  "diet_plan": {
    "monday": { "breakfast": {"meal": "string"}, "lunch": {"meal": "string"}, "snacks": {"meal": "string"}, "dinner": {"meal": "string"} },
    "tuesday": { ... }, "wednesday": { ... }, "thursday": { ... }, "friday": { ... }, "saturday": { ... }, "sunday": { ... }
  },
  "exercise_plan": {
    "monday": { "type": "string", "duration_minutes": 30, "exercises": [{"name": "string", "sets": 3, "reps": 15}] },
    "tuesday": { ... }, "wednesday": { ... }, "thursday": { ... }, "friday": { ... }, "saturday": { ... }, "sunday": { ... }
  }
}`;

    if (openAiApiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userDetailsPrompt },
          ],
          temperature: 0.6,
          max_tokens: 1800,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          aiDietPlan = parsed.diet_plan;
          aiExercisePlan = parsed.exercise_plan;
        }
      }
    } else if (nvidiaKey) {
      // Use faster 8B model on NVIDIA with max_tokens limit for fast response
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${nvidiaKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userDetailsPrompt },
          ],
          temperature: 0.6,
          max_tokens: 1800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "";
        content = content.replace(/```json/g, "").replace(/```/g, "").trim();
        try {
          const parsed = JSON.parse(content);
          aiDietPlan = parsed.diet_plan;
          aiExercisePlan = parsed.exercise_plan;
        } catch (e) {
          console.error("NVIDIA JSON parse error:", e);
        }
      }
    }

    // Fallback default structure if AI key wasn't available or JSON parse failed
    if (!aiDietPlan || !aiExercisePlan) {
      aiDietPlan = getFallbackDietPlan(food_habits || "");
      aiExercisePlan = getFallbackExercisePlan();
    }

    // Attach image URLs to all meals in diet_plan
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for (const day of days) {
      if (aiDietPlan[day]) {
        for (const mealType of ["breakfast", "lunch", "snacks", "dinner"]) {
          if (aiDietPlan[day][mealType]) {
            const mealText = aiDietPlan[day][mealType].meal || "";
            if (!aiDietPlan[day][mealType].image) {
              aiDietPlan[day][mealType].image = getMealImage(mealText);
            }
          }
        }
      }
    }

    // STEP 3: Save generated diet_plan and exercise_plan to user_plans
    await supabaseAdmin
      .from("user_plans")
      .update({
        diet_plan: aiDietPlan,
        exercise_plan: aiExercisePlan,
        doctor_review: false,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    return NextResponse.json({
      success: true,
      diet_plan: aiDietPlan,
      exercise_plan: aiExercisePlan,
      health_profile: healthProfileData,
      doctor_review: false,
    });
  } catch (err: any) {
    console.error("Error in /api/generate-plan:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate plan" },
      { status: 500 }
    );
  }
}

function getFallbackDietPlan(foodHabits: string) {
  const isVeg = foodHabits.toLowerCase().includes("veg") && !foodHabits.toLowerCase().includes("non-veg");
  return {
    monday: {
      breakfast: { meal: "1 bowl of Poha with peanuts and a cup of green tea" },
      lunch: { meal: "2 Roti, 1 bowl yellow Dal, seasonal sabzi & salad" },
      snacks: { meal: "1 small bowl of roasted Makhana" },
      dinner: { meal: "1 bowl of light Khichdi with a small portion of curd" }
    },
    tuesday: {
      breakfast: { meal: "2 Besan Chilla with green chutney" },
      lunch: { meal: "1 bowl of brown rice, Rajma, and cucumber salad" },
      snacks: { meal: "1 apple or handful of almonds" },
      dinner: { meal: "2 Roti with Lauki sabzi" }
    },
    wednesday: {
      breakfast: { meal: "1 bowl of Masala Oats cooked with vegetables" },
      lunch: { meal: isVeg ? "2 Roti, 1 bowl Paneer Bhurji & Dal" : "2 Roti, Egg bhurji & Dal" },
      snacks: { meal: "1 cup green tea with 2 Marie biscuits" },
      dinner: { meal: "1 bowl of Daliya upma with vegetables" }
    },
    thursday: {
      breakfast: { meal: "2 Idli with Sambhar and coconut chutney" },
      lunch: { meal: "2 Roti, 1 bowl dry Bhindi sabzi & curd" },
      snacks: { meal: "1 small bowl of sprout chat with lemon" },
      dinner: { meal: "2 Roti with light Dal & green salad" }
    },
    friday: {
      breakfast: { meal: "1 stuffed Paneer Paratha (less ghee) with curd" },
      lunch: { meal: "1 bowl vegetable Pulao with cucumber Raita" },
      snacks: { meal: "1 glass buttermilk (Chaas) or coconut water" },
      dinner: { meal: "1 bowl Palak Paneer with 2 Roti" }
    },
    saturday: {
      breakfast: { meal: "1 bowl vegetable Upma with tea/coffee" },
      lunch: { meal: "2 Roti, 1 bowl Chana Masala & salad" },
      snacks: { meal: "A handful of roasted peanuts or papaya" },
      dinner: { meal: "Vegetable soup and stir-fried Paneer/Tofu" }
    },
    sunday: {
      breakfast: { meal: "2 boiled eggs or 1 large bowl mixed fruit chat" },
      lunch: { meal: isVeg ? "2 Roti with Soya chunk curry & salad" : "2 Roti with homemade Chicken Curry & salad" },
      snacks: { meal: "Tea or coffee with 1-2 rusks" },
      dinner: { meal: "Cheat Meal: 2 slices pizza or Paneer Tikka (Enjoy moderately!)" }
    }
  };
}

function getFallbackExercisePlan() {
  return {
    monday: {
      type: "Full Body Warm-up & Cardio",
      duration_minutes: 30,
      exercises: [
        { name: "Brisk Walking", sets: 1, duration: "20 mins" },
        { name: "Jumping Jacks", sets: 3, reps: 15 },
        { name: "Stretching", sets: 1, duration: "5 mins" }
      ]
    },
    tuesday: {
      type: "Lower Body & Core",
      duration_minutes: 30,
      exercises: [
        { name: "Bodyweight Squats", sets: 3, reps: 15 },
        { name: "Lunges", sets: 3, reps: "10 per leg" },
        { name: "Plank", sets: 3, duration: "30 seconds" }
      ]
    },
    wednesday: {
      type: "Yoga & Flexibility",
      duration_minutes: 40,
      exercises: [
        { name: "Surya Namaskar", sets: 5, reps: "Full cycle" },
        { name: "Bhujangasana (Cobra Pose)", sets: 3, duration: "30 seconds" },
        { name: "Anulom Vilom", sets: 1, duration: "10 mins" }
      ]
    },
    thursday: {
      type: "Upper Body Strength",
      duration_minutes: 30,
      exercises: [
        { name: "Push-ups (or Knee Push-ups)", sets: 3, reps: 10 },
        { name: "Arm Circles", sets: 3, duration: "30 seconds" },
        { name: "Wall Push-ups", sets: 3, reps: 15 }
      ]
    },
    friday: {
      type: "Active Fat Burn",
      duration_minutes: 35,
      exercises: [
        { name: "Spot Jogging", sets: 3, duration: "2 mins" },
        { name: "High Knees", sets: 3, duration: "30 seconds" },
        { name: "Bicycle Crunches", sets: 3, reps: 20 }
      ]
    },
    saturday: {
      type: "Long Walk / Outdoor Activity",
      duration_minutes: 45,
      exercises: [
        { name: "Outdoor Walk in Park", sets: 1, duration: "45 mins", notes: "Walk continuously at a steady pace." }
      ]
    },
    sunday: {
      type: "Rest Day",
      duration_minutes: 0,
      exercises: [
        { name: "Complete Rest", sets: 1, duration: "0 mins", notes: "Give your body time to recover. Stay hydrated." }
      ]
    }
  };
}
