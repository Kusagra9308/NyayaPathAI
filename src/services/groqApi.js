export async function callGroqAi({ apiKey, prompt, systemPrompt, model = 'llama-3.3-70b-versatile' }) {
  const key = apiKey || import.meta.env.VITE_GROQ_API_KEY;
  if (!key) {
    throw new Error('Groq API Key missing. Please provide your Groq API Key.');
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are NyayaPath AI, an expert Indian legal and RTI assistant. Help citizens draft precise, legally sound RTI queries under Section 6(1) of the RTI Act 2005.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

export async function detectMinistryWithGroq(queryText, apiKey) {
  const systemPrompt = `You are an expert on Indian Government Ministries and Public Authorities. 
Given a citizen query, return ONLY the exact matching Ministry name from this list:
- Department of Agriculture, Cooperation & Farmers Welfare
- Department of Consumer Affairs
- Department of Food & Public Distribution
- Department of Higher Education
- Department of Posts
- Department of School Education and Literacy
- Department of Telecommunications
- Ministry of AYUSH
- Ministry of Civil Aviation
- Ministry of Electronics & Information Technology
- Ministry of Environment, Forest and Climate Change
- Ministry of External Affairs
- Ministry of Home Affairs
- Ministry of Housing & Urban Affairs
- Ministry of Information & Broadcasting
- Ministry of Labour & Employment
- Ministry of Micro, Small and Medium Enterprises
- Ministry of Railways
- Ministry of Road Transport & Highways
- Ministry of Rural Development
- Ministry of Social Justice & Empowerment
- Prime Minister's Office

Return ONLY the single ministry string, nothing else.`;

  try {
    const ministryStr = await callGroqAi({
      apiKey,
      prompt: `Query: "${queryText}"`,
      systemPrompt
    });
    return ministryStr.trim();
  } catch (err) {
    console.warn('Groq ministry detection failed, falling back to local NLP:', err);
    return null;
  }
}
