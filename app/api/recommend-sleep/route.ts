import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const fallbackSleepAdvice = {
    targetHours: 8.0,
    tip: "Maintain a consistent sleep schedule and limit screen time for 30 minutes before bed to support natural melatonin production.",
  };

  try {
    const { sleepLogs } = await request.json().catch(() => ({ sleepLogs: [] }));
    const apiKey = process.env.NVIDIA_KEY;

    if (!apiKey) {
      return NextResponse.json(fallbackSleepAdvice);
    }

    const recentSleepText =
      Array.isArray(sleepLogs) && sleepLogs.length > 0
        ? sleepLogs
            .slice(-7)
            .map((log: any) => `- Date: ${log.date}, Hours: ${log.hours}h`)
            .join("\n")
        : "No sleep logs recorded yet.";

    const messages = [
      {
        role: "user",
        content: `Evaluate the user's recent sleep history:
${recentSleepText}

Based on this patterns, recommend a personalized target for tonight (usually between 7 and 9 hours) and provide one brief, highly actionable sleep hygiene tip (maximum 2 sentences) to help them achieve better recovery.
Respond ONLY in valid JSON format with exactly these two keys: "targetHours" (number) and "tip" (string). Do not include markdown formatting or backticks around the JSON.`,
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
          max_tokens: 200,
          temperature: 0.3,
        }),
      },
    );

    if (!response.ok) {
      console.warn("NVIDIA API failed, using sleep fallbacks.");
      return NextResponse.json(fallbackSleepAdvice);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(fallbackSleepAdvice);
    }

    try {
      const cleanedContent = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const result = JSON.parse(cleanedContent);
      if (
        typeof result.targetHours === "number" &&
        typeof result.tip === "string"
      ) {
        return NextResponse.json(result);
      }
      return NextResponse.json(fallbackSleepAdvice);
    } catch (parseError) {
      console.error("Failed to parse AI sleep JSON:", content);
      return NextResponse.json(fallbackSleepAdvice);
    }
  } catch (error) {
    console.error("Error in recommend-sleep route:", error);
    return NextResponse.json(fallbackSleepAdvice);
  }
}
