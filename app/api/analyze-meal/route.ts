import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: "Please provide a description." },
        { status: 400 },
      );
    }

    const apiKey = process.env.NVIDIA_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "NVIDIA API key not configured." },
        { status: 500 },
      );
    }

    const messages = [
      {
        role: "user",
        content: `Analyze this meal. Provide a realistic estimate of the total calories and a brief feedback message (max 2 sentences) on whether this aligns with a healthy weight-loss diet. 
        Respond ONLY in valid JSON format with exactly these two keys: "calories" (number) and "feedback" (string). Do not include markdown formatting or backticks around the JSON.
        Meal description: ${description}`,
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
          max_tokens: 150,
          temperature: 0.2,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API Error:", errorText);
      return NextResponse.json(
        { error: "Failed to analyze meal." },
        { status: response.status },
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Invalid response from AI." },
        { status: 500 },
      );
    }

    try {
      // Sometimes AI adds markdown block like ```json ... ```
      const cleanedContent = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const result = JSON.parse(cleanedContent);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      return NextResponse.json(
        { error: "AI response was not in expected JSON format." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in analyze-meal route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
