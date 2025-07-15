// app/api/gpt/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const prompt = `You're an AI world's most intelligent ad strategist and analyst . Based on the input data, generate a concise summary and insight for an ad campaign. and provide a personalized insight for the user.and its should be in motivating and encouraging tone. based on the following data:
- Budget: $${body.budget}
- Budget: $${body.budget}
- CTR: ${body.ctr}%
- Leads: ${Math.round(body.leads)}
- Cost per Lead: $${Math.round(body.cpl)}
- ROAS: ${body.roas.toFixed(2)}x
- Average Order Value: $${body.aov}

Give a short optimization tip and Detailed summary.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  return NextResponse.json({
    summary: data.choices?.[0]?.message?.content || 'No insight received.',
  });
}