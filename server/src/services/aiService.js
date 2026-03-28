const Groq = require('groq-sdk');

let groqClient;

const SYSTEM_PROMPT = `You are a senior software engineer performing a thorough code review.
Analyze the provided code and return a JSON response with this exact strict structure:

{
  "qualityScore": <number 1-10>,
  "summary": "<brief summary of the code quality>",
  "issues": [
    {
      "type": "bug" | "improvement" | "suggestion",
      "severity": "low" | "medium" | "high",
      "title": "<short title>",
      "description": "<detailed explanation>",
      "lineNumber": <number or null>,
      "originalCode": "<the problematic code snippet>",
      "suggestedCode": "<the fixed/improved code snippet>"
    }
  ],
  "documentation": "<markdown documentation explaining what each function/class does>"
}

Guidelines:
- Return ONLY valid JSON matching the exact schema above.
- Be thorough but constructive
- Include specific line references when possible
- Provide before/after code examples for improvements
- Rate severity accurately (high = crash/security, medium = logic error, low = style/minor)
- Generate clear documentation in markdown format`;

/**
 * Analyze code using Groq API (Llama3)
 * @param {string} code - The code to analyze
 * @param {string} language - Programming language
 * @returns {Object} AI analysis result
 */
async function analyzeCode(code, language = 'javascript') {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  const prompt = `Language: ${language}\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content;
    const parsed = JSON.parse(text);

    return {
      qualityScore: Math.min(10, Math.max(1, parsed.qualityScore || 5)),
      summary: parsed.summary || 'No summary generated',
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      documentation: parsed.documentation || 'No documentation generated',
    };
  } catch (error) {
    console.error('Groq API error:', error.message);
    throw new Error('Failed to analyze code with AI: ' + error.message);
  }
}

module.exports = { analyzeCode };
