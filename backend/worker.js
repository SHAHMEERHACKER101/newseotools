/**
 * NexusRank Pro - FINAL Google Gemini Worker
 * Secure, production-ready, with debug logs
 */

// ✅ Allowed origins (NO TRAILING SPACES!)
const ALLOWED_ORIGINS = [
  'https://newseotools.pages.dev',
  'http://localhost:5000'
];

// ✅ CORS headers
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }

  return headers;
}

// ✅ Handle preflight (OPTIONS)
function handleOptions(request) {
  const corsHeaders = getCorsHeaders(request);
  corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type';
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ✅ Gemini API URL (NO SPACES, CORRECT MODEL)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// ✅ Tool configurations
const TOOL_CONFIGS = {
  '/ai/seo-write': {
    system: 'Write a 2000-5000 word SEO-optimized article. Use H2/H3, bullet points, natural keywords, and human tone. Avoid AI patterns.',
    max_tokens: 8192,
    temperature: 0.7
  },
  '/ai/humanize': {
    system: 'Make this sound 100% human. Add contractions, imperfections, and conversational flow. Undetectable as AI.',
    max_tokens: 4000,
    temperature: 0.8
  },
  '/ai/detect': {
    system: 'Analyze this text and estimate AI probability. Respond with: "AI Probability: X%" and a 2-sentence explanation.',
    max_tokens: 1000,
    temperature: 0.3
  },
  '/ai/paraphrase': {
    system: 'Rewrite to be 100% unique and undetectable as AI. Keep meaning but change structure.',
    max_tokens: 4000,
    temperature: 0.6
  },
  '/ai/grammar': {
    system: 'Fix all grammar, spelling, and punctuation errors. Return only the corrected version.',
    max_tokens: 4000,
    temperature: 0.2
  },
  '/ai/improve': {
    system: 'Improve this text for clarity, fluency, and professionalism.',
    max_tokens: 4000,
    temperature: 0.5
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🔥 DEBUG LOGS — DO NOT REMOVE
    console.log('🔍 Incoming request to:', path);
    console.log('🌐 Method:', request.method);
    console.log('📤 Origin:', request.headers.get('Origin'));
    console.log('🔑 GEMINI_API_KEY exists:', !!env.GEMINI_API_KEY);
    if (env.GEMINI_API_KEY) {
      console.log('🔑 First 4 chars:', env.GEMINI_API_KEY.substring(0, 4));
    } else {
      console.log('❌ GEMINI_API_KEY is MISSING!');
    }

    // ✅ Handle CORS preflight
    if (request.method === 'OPTIONS') return handleOptions(request);

    // ✅ Validate POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: getCorsHeaders(request)
      });
    }

    // ✅ Check if endpoint exists
    const config = TOOL_CONFIGS[path];
    if (!config) {
      console.log('❌ Unknown endpoint:', path);
      return new Response(JSON.stringify({
        error: 'Endpoint not found',
        available: Object.keys(TOOL_CONFIGS)
      }), {
        status: 404,
        headers: getCorsHeaders(request)
      });
    }

    // ✅ Parse request body
    let data;
    try {
      data = await request.json();
      console.log('📄 Input text received:', data.text?.substring(0, 100) + '...');
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: getCorsHeaders(request)
      });
    }

    const text = data.text || data.prompt || '';
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.error('❌ No text provided');
      return new Response(JSON.stringify({ error: 'Text input is required' }), {
        status: 400,
        headers: getCorsHeaders(request)
      });
    }

    // ✅ Get API key
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('🛑 FATAL: GEMINI_API_KEY is NOT SET');
      return new Response(JSON.stringify({ error: 'AI service configuration error' }), {
        status: 500,
        headers: getCorsHeaders(request)
      });
    }

    try {
      // ✅ Call Gemini API
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${config.system}\n\n${text}` }] }],
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.max_tokens
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API error:', response.status, errorText);
        return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
          status: 503,
          headers: getCorsHeaders(request)
        });
      }

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!aiText) {
        console.error('❌ Empty AI response:', result);
        return new Response(JSON.stringify({ error: 'Empty AI response' }), {
          status: 500,
          headers: getCorsHeaders(request)
        });
      }

      // ✅ Success!
      return new Response(JSON.stringify({
        success: true,
        content: aiText,
        tool: path.split('/').pop(),
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          ...getCorsHeaders(request),
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('🚨 Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: getCorsHeaders(request)
      });
    }
  }
};
