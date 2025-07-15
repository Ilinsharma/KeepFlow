export const generateSummary = async (payload: {
  budget: number;
  ctr: number;
  leads: number;
  cpl: number;
  roas: number;
  aov: number;
}) => {
  const prompt = `You're an AI ad strategist. Based on the input data, generate a concise summary and insight for an ad campaign. and provide a personalized insight for the user.:
- Budget: $${payload.budget}
- CTR: ${payload.ctr}%
- Leads: ${Math.round(payload.leads)}
- Cost per Lead: $${Math.round(payload.cpl)}
- ROAS: ${payload.roas.toFixed(2)}x
- AOV: $${payload.aov}

Give 1 personalized insight + summary.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const json = await res.json();
  return json.choices?.[0]?.message?.content || 'No insight received.';
};