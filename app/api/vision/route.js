import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  const { text, img_url } = await request.json();
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `${text}\n![image](${img_url})`,
        },
      ],
    });
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    return NextResponse.json({ error: "Error generating response", details: error.message }, { status: 500 });
  }
}
