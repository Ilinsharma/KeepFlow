import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a performance report assistant for marketing agencies.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const message = completion.choices[0].message?.content;
    return NextResponse.json({ text: message });
  } catch (error: any) {
    console.error('[GPT API Error]', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}