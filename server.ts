import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CURATED_DEMOS } from './src/demos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Initialize GoogleGenAI SDK with server-side User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function buildPedagogyPrompt(ageBracket: string): string {
  if (ageBracket.includes('5–7') || ageBracket.includes('Early Explorers')) {
    return (
      'PEDAGOGICAL PROFILE: Ages 5–7 (Early Explorers 🌱)\n' +
      '- Reading Level: Lexile 200L-400L (Kindergarten to Grade 2).\n' +
      '- Vocabulary: Sensory, tactile, concrete words (glowing, sweet, bouncing, breezy). NO unexplained jargon.\n' +
      '- Sentence Length: Very short, rhythmic sentences (6 to 11 words per sentence).\n' +
      '- Metaphors: Friendly kitchen baking, magic gardens, cheerful animal friends, cozy stakes.\n' +
      '- Narrative Arc: Clear 3-act story: 1) Gentle puzzle, 2) Discovering nature\'s secret trick, 3) Happy celebration.\n' +
      '- Key Concept Terms: Must highlight core terms in **bold**.\n'
    );
  } else if (ageBracket.includes('8–10') || ageBracket.includes('Adventurers')) {
    return (
      'PEDAGOGICAL PROFILE: Ages 8–10 (Adventurers 🔍)\n' +
      '- Reading Level: Lexile 500L-750L (Grade 3 to Grade 5).\n' +
      '- Vocabulary: Dynamic verbs, detective puzzles, secret codes, playful gadgets, schoolyard science.\n' +
      '- Sentence Length: Balanced sentences (10 to 18 words) with energetic dialogue.\n' +
      '- Metaphors: Detective mysteries, superhero power-ups, sports strategies, contraptions.\n' +
      '- Narrative Arc: High curiosity: 1) Baffling mystery/heist, 2) Using the scientific principle to crack the clue, 3) Triumph.\n' +
      '- Key Concept Terms: Must highlight core terms in **bold**.\n'
    );
  } else {
    return (
      'PEDAGOGICAL PROFILE: Ages 11–13 (Trailblazers 🚀)\n' +
      '- Reading Level: Lexile 800L-1050L (Grade 6 to Grade 8).\n' +
      '- Vocabulary: Accurate technical terminology, mathematical relationships, cause-and-effect physical laws.\n' +
      '- Sentence Length: Engaging, sophisticated prose (14 to 25 words).\n' +
      '- Metaphors: Sci-fi telemetry, deep-space survival, cyberpunk coding, environmental engineering, planetary expeditions.\n' +
      '- Narrative Arc: High stakes: 1) Critical crisis/emergency, 2) Applying rigorous mathematical/scientific law, 3) Equilibrium restored.\n' +
      '- Key Concept Terms: Must highlight core technical terms in **bold**.\n'
    );
  }
}

const storyTeacherResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Exciting and catchy story title with a thematic emoji' },
    mission_hook: { type: Type.STRING, description: 'A high-stakes 2-3 sentence The Mission challenge setting up the dilemma' },
    story_content: { type: Type.STRING, description: 'The main story narrative (300 to 400 words) using rich age-adapted prose with key terms in **bold**' },
    science_takeaway: { type: Type.STRING, description: 'The Secret Science/Math Takeaway - 2-3 clear sentences explaining the core academic concept' },
    vocabulary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: 'The scientific or mathematical keyword' },
          definition: { type: Type.STRING, description: 'Kid-friendly 1-2 sentence definition adapted to the age level' },
          in_story_usage: { type: Type.STRING, description: 'Short sentence showing how it was used in the story' },
        },
        required: ['word', 'definition', 'in_story_usage'],
      },
      description: '3 to 4 core vocabulary terms with age-appropriate definitions',
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'Comprehension or concept transfer question' },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Exactly 4 distinct multiple-choice answer options',
          },
          correct_index: { type: Type.INTEGER, description: 'Zero-based index of the correct option (0, 1, 2, or 3)' },
          explanation: { type: Type.STRING, description: 'Kid-friendly explanation of why the correct answer is right' },
          milestone: { type: Type.STRING, description: 'Pedagogical category: Foundational Recall, In-Story Reasoning, or Real-World Transfer' },
        },
        required: ['question', 'options', 'correct_index', 'explanation', 'milestone'],
      },
      description: 'Exactly 3 multiple-choice comprehension questions',
    },
    dinner_table_question: { type: Type.STRING, description: 'A conversational, engaging prompt for parents or teachers to ask over dinner or in class' },
    diagnostic_summary: { type: Type.STRING, description: 'Pedagogical insight explaining how this story builds conceptual intuition' },
    common_misconceptions: { type: Type.STRING, description: 'Common pitfalls or misunderstandings children typically hold about this concept' },
  },
  required: [
    'title',
    'mission_hook',
    'story_content',
    'science_takeaway',
    'vocabulary',
    'quiz',
    'dinner_table_question',
    'diagnostic_summary',
    'common_misconceptions',
  ],
};

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasApiKey: !!apiKey });
});

// Curated Demos
app.get('/api/demos', (_req: Request, res: Response) => {
  res.json(CURATED_DEMOS);
});

// Story Generation Endpoint
app.post('/api/generate-story', async (req: Request, res: Response) => {
  try {
    const { topic, ageBracket, theme, protagonist, temperature } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a valid concept topic.' });
    }

    if (!ai) {
      // If no API key configured, check if we have a matching curated demo
      const foundDemoKey = Object.keys(CURATED_DEMOS).find(
        (k) => k.toLowerCase().includes(topic.trim().toLowerCase())
      );
      if (foundDemoKey) {
        return res.json({ story: CURATED_DEMOS[foundDemoKey].data, isDemo: true });
      }
      return res.status(503).json({
        error: 'Gemini API Key is not configured on the server. You can try the 1-Click Interactive Demos in the sidebar, or provide GEMINI_API_KEY.',
      });
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const pedagogyGuide = buildPedagogyPrompt(ageBracket || 'Ages 8–10 (Adventurers 🔍)');

    const userPrompt = `
You are StoryTeacher AI, an elite EdTech specialist, award-winning children's author, and master science teacher.
Your mission is to teach the school concept '${topic.trim()}' through a thrilling, age-adapted story, followed by an interactive 3-question comprehension quiz and a parent/educator diagnostic report.

MISSION PARAMETERS:
- Topic: ${topic.trim()}
- Target Audience: ${ageBracket || 'Ages 8–10 (Adventurers 🔍)'}
- Story Theme: ${theme || '🧙‍♂️ Fantasy & Magic Quest'}
- Protagonist Name: ${protagonist || 'Alex'}

${pedagogyGuide}

CRITICAL CONTENT SPECIFICATIONS:
1. Title: Catchy, engaging title with an emoji matching the theme.
2. The Mission Hook: 2-3 sentences setting up the high-stakes dilemma or mystery.
3. Story Content: Exactly 300 to 400 words. Vibrant narrative. Key scientific or mathematical terms MUST be formatted in **bold**.
4. Secret Science/Math Takeaway: 2-3 clear sentences summarizing the real-world principle in plain language.
5. Vocabulary: Exactly 3 to 4 core vocabulary terms with age-adapted definitions and short in-story usage examples.
6. Quiz: Exactly 3 multiple-choice questions:
   - Question 1 (Foundational Recall): Tests identifying the core definition or concept.
   - Question 2 (In-Story Reasoning): Tests understanding how the hero applied the concept in the plot.
   - Question 3 (Real-World Transfer): Tests applying the concept to an everyday real-world situation outside the story.
   Each question MUST have exactly 4 plausible choices, a 0-based correct_index (0, 1, 2, or 3), and a warm, encouraging explanation.
7. Dinner-Table Discussion Question: A delightful, conversational question parents or teachers can ask casually at dinner or in morning circle time to spark curious family dialogue.
8. Diagnostic Summary & Common Misconceptions: Analytical insights for educators and parents explaining what concept was taught and typical pitfalls children encounter with this topic.
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: storyTeacherResponseSchema,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      },
    });

    const rawText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      let clean = rawText.trim();
      if (clean.startsWith('```json')) clean = clean.slice(7);
      if (clean.startsWith('```')) clean = clean.slice(3);
      if (clean.endsWith('```')) clean = clean.slice(0, -3);
      parsedData = JSON.parse(clean.trim());
    }

    return res.json({ story: parsedData });
  } catch (error: any) {
    console.error('Error generating story:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate story adventure with Gemini API.',
    });
  }
});

// Text-to-Speech Endpoint using gemini-3.8-flash-lite-tts
app.post('/api/generate-speech', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for speech generation.' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key not configured on server.' });
    }

    const cleanText = text.replace(/[*#]/g, '').slice(0, 1000);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Warm, engaging, expressive children story narrator',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated by model.' });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate speech.' });
  }
});

// Vite Dev Server or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`StoryTeacher AI running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
