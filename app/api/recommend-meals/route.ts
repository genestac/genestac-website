import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const fallbackRecommendations = [
    {
      name: "High-Protein Berry Oatmeal Bowl",
      calories: 280,
      prepTime: "10 mins",
      benefits: "High fiber, low sugar, keeps you full for hours.",
      ingredients: ["1/2 cup rolled oats", "1 scoop vanilla protein powder", "1/2 cup mixed fresh berries", "1 tbsp chia seeds", "1 cup unsweetened almond milk"]
    },
    {
      name: "Mediterranean Quinoa & Chicken Salad",
      calories: 380,
      prepTime: "15 mins",
      benefits: "Lean protein, healthy unsaturated fats, vitamin-rich.",
      ingredients: ["100g grilled chicken breast", "1/2 cup cooked quinoa", "1 cup cherry tomatoes & cucumbers", "5 black olives", "1 tsp olive oil & lemon dressing"]
    },
    {
      name: "Baked Garlic Salmon & Asparagus",
      calories: 340,
      prepTime: "20 mins",
      benefits: "Rich in Omega-3 fatty acids, extremely low carb.",
      ingredients: ["120g wild-caught salmon fillet", "1 bunch fresh asparagus spears", "1 clove minced garlic", "1 slice lemon", "1 tsp olive oil"]
    }
  ];

  try {
    const { meals } = await request.json().catch(() => ({ meals: [] }));
    const apiKey = process.env.NVIDIA_KEY;

    if (!apiKey) {
      // Return beautiful fallback if API key is not configured
      return NextResponse.json({ recommendations: fallbackRecommendations });
    }

    const recentMealsText = Array.isArray(meals) && meals.length > 0
      ? meals.slice(-5).map((m: any) => `- ${m.mealType || 'Meal'}: ${m.description} (${m.calories} kcal, feedback: ${m.feedback})`).join("\n")
      : "No meals logged yet.";

    const messages = [
      {
        role: "user",
        content: `Analyze the user's recent diet:
${recentMealsText}

Based on this, suggest 3 healthy, appetizing, and low-calorie recipe ideas (approx 250-400 kcal each) that provide excellent alternatives or adjustments to align with a weight loss goal.
Respond ONLY in valid JSON format. Your response must be an object with a single key "recommendations" containing an array of 3 recipe objects. Each recipe object must have exactly these keys: "name" (string), "calories" (number), "prepTime" (string, e.g. "15 mins"), "benefits" (string, max 1 sentence), and "ingredients" (array of strings). Do not include markdown formatting or backticks around the JSON.`,
      },
    ];

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages,
          max_tokens: 450,
          temperature: 0.3,
        }),
      },
    );

    if (!response.ok) {
      console.warn("NVIDIA API failed, using fallbacks.");
      return NextResponse.json({ recommendations: fallbackRecommendations });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ recommendations: fallbackRecommendations });
    }

    try {
      const cleanedContent = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const result = JSON.parse(cleanedContent);
      if (Array.isArray(result.recommendations)) {
        return NextResponse.json(result);
      }
      return NextResponse.json({ recommendations: fallbackRecommendations });
    } catch (parseError) {
      console.error("Failed to parse AI recipes JSON:", content);
      return NextResponse.json({ recommendations: fallbackRecommendations });
    }
  } catch (error) {
    console.error("Error in recommend-meals route:", error);
    return NextResponse.json({ recommendations: fallbackRecommendations });
  }
}
