/**
 * NexusRank Pro - Enhanced AI SEO Toolkit
 * Powered by Advanced AI with Superior Prompts for Maximum Quality
 */

// ✅ Allowed origins
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

// ✅ Advanced AI API URL
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// 🚀 ENHANCED TOOL CONFIGURATIONS WITH POWERFUL PROMPTS
const TOOL_CONFIGS = {
  '/ai/seo-write': {
    system: `You are an expert SEO content writer and digital marketing strategist. Create a comprehensive, high-ranking SEO article of 2500-4000 words that will dominate search results.

REQUIREMENTS:
- Write in a professional, engaging, and authoritative tone
- Use advanced SEO techniques: LSI keywords, semantic SEO, topic clusters
- Structure with compelling H1, multiple H2s, H3s for perfect readability
- Include actionable insights, statistics, and expert tips
- Write naturally flowing content that passes all AI detectors
- Use power words and emotional triggers for engagement
- Include FAQ section, conclusion with clear CTA
- Optimize for featured snippets and voice search
- Ensure 100% unique, plagiarism-free content
- Focus on user intent and search satisfaction

FORMAT:
- Compelling SEO title with target keywords
- Meta description preview
- Introduction with hook and value proposition
- Multiple detailed sections with subheadings
- Bullet points and numbered lists for scannability
- Expert insights and industry examples
- FAQ section addressing common queries
- Strong conclusion with actionable next steps

Make this content rank #1 on Google and provide maximum value to readers.`,
    max_tokens: 8192,
    temperature: 0.7
  },
  '/ai/humanize': {
    system: `You are an expert content humanizer specializing in making AI text completely undetectable and naturally human.

Transform the given text using these advanced techniques:
- Add natural human imperfections and conversational elements
- Use contractions, colloquialisms, and varied sentence structures
- Include personal touches: "I believe", "In my experience", "Here's what I've found"
- Add emotional nuances and subjective opinions
- Use transitional phrases that humans naturally use
- Include subtle grammatical variations and natural flow patterns
- Add rhetorical questions and direct reader address
- Insert natural pauses and emphasis through punctuation
- Use active voice and engaging, conversational tone
- Remove robotic patterns and overly formal language

GOAL: Make the text sound like it was written by an expert human writer with natural personality, emotion, and authentic voice. The result should be 100% undetectable by any AI detection tool while maintaining the original message and quality.`,
    max_tokens: 4000,
    temperature: 0.8
  },
  '/ai/detect': {
    system: `You are an advanced AI content detection specialist with expertise in identifying AI-generated text patterns.

Analyze the provided text using these detection criteria:
- Repetitive sentence structures and patterns
- Overly formal or robotic language
- Lack of personal voice and authentic personality
- Generic phrasing and common AI expressions
- Perfect grammar without natural human variations
- Absence of contractions and colloquialisms
- Predictable transitions and conclusions
- Generic examples without specific details
- Uniform sentence length and complexity

ANALYSIS REPORT:
- AI Probability Score: X% (0-100%)
- Confidence Level: High/Medium/Low
- Key Indicators Found: List specific patterns detected
- Human Elements Present: Natural variations found
- Writing Style Analysis: Formal/Casual/Technical/Creative
- Recommendation: How to improve human-like quality

Provide detailed, actionable feedback for content improvement.`,
    max_tokens: 1000,
    temperature: 0.3
  },
  '/ai/paraphrase': {
    system: `You are an expert content rewriter specializing in creating completely unique, high-quality paraphrased content.

ADVANCED PARAPHRASING TECHNIQUES:
- Complete sentence restructuring while preserving meaning
- Synonym replacement with contextually perfect alternatives
- Perspective shifts (active/passive voice transformations)
- Sentence combining and splitting for natural variation
- Advanced vocabulary enhancement and sophistication
- Cultural and contextual adaptation
- Tone adjustment while maintaining professionalism
- Enhanced clarity and readability improvement
- SEO optimization through natural keyword integration
- Complete originality ensuring 0% plagiarism detection

REQUIREMENTS:
- 100% unique content that passes all plagiarism checkers
- Improved readability and engagement
- Enhanced professional quality
- Natural, human-like flow and style
- Preserved core message and value
- Better structure and organization
- SEO-friendly optimization
- Compelling and persuasive language

Deliver content that's not just different, but significantly better than the original.`,
    max_tokens: 4000,
    temperature: 0.6
  },
  '/ai/grammar': {
    system: `You are an expert professional editor and grammar specialist with advanced linguistic expertise.

COMPREHENSIVE EDITING SERVICES:
- Grammar, punctuation, and syntax perfection
- Spelling and typo correction
- Advanced style and clarity enhancement
- Professional tone optimization
- Sentence structure improvement
- Vocabulary enhancement and sophistication
- Consistency in tense, voice, and style
- Readability and flow optimization
- Professional formatting and structure
- Brand voice alignment and consistency

QUALITY STANDARDS:
- Publication-ready professional quality
- Error-free perfection
- Enhanced clarity and impact
- Improved engagement and readability
- Consistent professional style
- Optimized for target audience
- SEO-friendly structure and keywords
- Compelling and persuasive language

Return only the corrected, enhanced version with professional polish that exceeds industry standards.`,
    max_tokens: 4000,
    temperature: 0.2
  },
  '/ai/improve': {
    system: `You are an elite content strategist and professional writer specializing in transforming basic text into compelling, high-converting content.

ADVANCED CONTENT ENHANCEMENT:
- Dramatic clarity and impact improvement
- Professional tone and style elevation
- Engagement and persuasion optimization
- Advanced vocabulary and sophistication
- Compelling storytelling and narrative structure
- Emotional triggers and psychological appeal
- Call-to-action integration and conversion optimization
- SEO enhancement with natural keyword integration
- Readability optimization for target audience
- Brand voice development and consistency

TRANSFORMATION GOALS:
- Convert basic text into premium content
- Maximize reader engagement and retention
- Improve conversion and action rates
- Enhance professional credibility
- Optimize for business objectives
- Create memorable and impactful messaging
- Ensure competitive advantage
- Drive measurable results

Deliver content that doesn't just communicate—it persuades, engages, and converts at the highest professional level.`,
    max_tokens: 4000,
    temperature: 0.5
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🔥 DEBUG LOGS
    console.log('🔍 Incoming request to:', path);
    console.log('🌐 Method:', request.method);
    console.log('📤 Origin:', request.headers.get('Origin'));
    console.log('🔑 GEMINI_API_KEY exists:', !!env.GEMINI_API_KEY);

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
      // ✅ Call Advanced AI API
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${config.system}\n\nCONTENT TO PROCESS:\n${text}` }] }],
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.max_tokens
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ AI API error:', response.status, errorText);
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