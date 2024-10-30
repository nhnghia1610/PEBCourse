import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    const { courseId } = params;

    // Log incoming request
    const { numberOfQuestions, maxChoices } = await req.json();
    console.log('Received data:', { numberOfQuestions, maxChoices });

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    if (typeof numberOfQuestions !== 'number' || typeof maxChoices !== 'number') {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Call OpenAI to generate questions
    const prompt = `Generate ${numberOfQuestions} multiple-choice questions with ${maxChoices} choices each.`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another available model
      messages: [{ role: "user", content: prompt }],
    });

    const questions = response.choices[0].message.content; // Adjust based on API response format

    return NextResponse.json({ questions }, { status: 200 });
  } catch (err) {
    console.error("Error in generateAIQuiz_POST:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
