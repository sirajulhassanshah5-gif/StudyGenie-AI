import { getStoredApiKey } from './geminiService';
import type { 
  QuizConfig, 
  GeneratedQuiz, 
  QuizQuestion, 
  UserAnswerRecord, 
  SampleQuizTopic 
} from '../types/quiz';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-1.5-flash';

export const SAMPLE_QUIZ_TOPICS: SampleQuizTopic[] = [
  {
    id: 'sample-cs',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    topicPrompt: 'Data structures including Binary Search Trees, Graphs, Hash Tables, Big O notation, and sorting algorithms.'
  },
  {
    id: 'sample-bio',
    title: 'Genetics & Molecular Biology',
    category: 'Biology',
    topicPrompt: 'DNA replication, RNA transcription, translation, Mendelian genetics inheritance, and CRISPR technology.'
  },
  {
    id: 'sample-math',
    title: 'Linear Algebra & Matrices',
    category: 'Mathematics',
    topicPrompt: 'Matrix multiplication, determinants, eigenvectors, eigenvalues, and vector spaces.'
  },
  {
    id: 'sample-hist',
    title: 'World History: Industrial Revolution',
    category: 'History',
    topicPrompt: 'The steam engine, factory systems, urbanization, social shifts, and economic impacts in 18th-19th century Europe.'
  }
];

export async function generateAIQuiz(config: QuizConfig): Promise<GeneratedQuiz> {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      return await fetchGeminiQuiz(config, apiKey);
    } catch (error) {
      console.warn('Gemini API quiz call failed, using intelligent local generator:', error);
    }
  }

  return generateLocalQuiz(config);
}

async function fetchGeminiQuiz(config: QuizConfig, apiKey: string): Promise<GeneratedQuiz> {
  const endpoint = `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

  const prompt = `You are StudyGenie AI, an elite educational quiz creator.
Generate a structured quiz based on the user's request.

Quiz Parameters:
- Topic / Content: "${config.topic}"
- Target Difficulty: ${config.difficulty.toUpperCase()} (Ensure questions strictly reflect this difficulty: Easy = foundational facts, Medium = conceptual understanding, Hard = multi-step analysis/scenarios)
- Requested Question Types: ${config.questionType === 'mixed' ? 'Mix of MCQs, True/False, and Short Answer Questions' : config.questionType}
- Question Count: ${config.questionCount}

INSTRUCTIONS FOR QUESTION TYPES:
1. "mcq": Multiple Choice Question with exactly 4 options. "options": ["Option 0", "Option 1", "Option 2", "Option 3"]. "correctAnswerIndex": number (0 to 3).
2. "true_false": Binary statement question. "options": ["True", "False"]. "correctAnswerIndex": 0 (for True) or 1 (for False).
3. "short_question": Open-ended short answer question. Do NOT include options. Instead provide "modelAnswer": "Ideal concise answer", "keyKeywords": ["keyword1", "keyword2", "keyword3"].

Return ONLY a valid JSON object matching this structure (no markdown wrapper, no extra text):
{
  "title": "Clear descriptive title for the quiz",
  "questions": [
    {
      "id": "q1",
      "type": "mcq", // or "true_false" or "short_question"
      "question": "Question text here?",
      "options": ["A", "B", "C", "D"], // only for mcq or true_false
      "correctAnswerIndex": 0, // only for mcq or true_false
      "modelAnswer": "Ideal answer text", // only for short_question
      "keyKeywords": ["concept1", "concept2"], // only for short_question
      "explanation": "Clear explanation of why the answer is correct.",
      "difficulty": "${config.difficulty}"
    }
  ]
}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2560,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  let cleanJson = textOutput.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleanJson);

  return {
    id: `quiz_${Date.now()}`,
    title: parsed.title || `${config.topic} Quiz (${config.difficulty})`,
    topic: config.topic,
    difficulty: config.difficulty,
    questions: (parsed.questions || []).map((q: any, idx: number) => ({
      id: q.id || `q_${idx + 1}`,
      type: q.type || (q.options?.length === 2 ? 'true_false' : q.options ? 'mcq' : 'short_question'),
      question: q.question || `Question ${idx + 1}`,
      options: q.options || undefined,
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
      modelAnswer: q.modelAnswer || undefined,
      keyKeywords: q.keyKeywords || undefined,
      explanation: q.explanation || 'Refer to key concepts for clarification.',
      difficulty: q.difficulty || config.difficulty
    })),
    createdAt: new Date().toLocaleDateString()
  };
}

function generateLocalQuiz(config: QuizConfig): GeneratedQuiz {
  const questions: QuizQuestion[] = [];

  // Create MCQs
  if (config.questionType === 'mcq' || config.questionType === 'mixed') {
    questions.push({
      id: 'q_local_1',
      type: 'mcq',
      question: `Which of the following best defines the primary principle of ${config.topic || 'the topic'}?`,
      options: [
        'A foundational system designed to process inputs into structured outputs efficiently.',
        'A legacy methodology that has been completely superseded by modern frameworks.',
        'An unverified theoretical hypothesis with no practical implementation.',
        'A hardware-exclusive protocol restricted to embedded systems.'
      ],
      correctAnswerIndex: 0,
      explanation: 'The primary principle relies on efficient input processing and structured systematic execution.',
      difficulty: config.difficulty
    });

    if (config.difficulty === 'hard') {
      questions.push({
        id: 'q_local_2',
        type: 'mcq',
        question: `When evaluating edge-case constraints in ${config.topic || 'this subject'}, what is the most critical trade-off?`,
        options: [
          'Memory overhead versus processing latency during peak load',
          'Color palette selection in UI rendering',
          'Alphabetical sorting of error logs',
          'Static variable declaration count'
        ],
        correctAnswerIndex: 0,
        explanation: 'In advanced scenarios, managing memory overhead versus processing latency is the central architectural trade-off.',
        difficulty: 'hard'
      });
    }
  }

  // Create True / False
  if (config.questionType === 'true_false' || config.questionType === 'mixed') {
    questions.push({
      id: 'q_local_tf_1',
      type: 'true_false',
      question: `Statement: Core principles of ${config.topic || 'this subject'} apply consistently across both theoretical models and practical applications.`,
      options: ['True', 'False'],
      correctAnswerIndex: 0,
      explanation: 'True. Theoretical principles form the direct baseline for real-world implementations.',
      difficulty: config.difficulty
    });

    questions.push({
      id: 'q_local_tf_2',
      type: 'true_false',
      question: `Statement: Increasing system complexity in ${config.topic || 'this area'} guarantees reduced operational risk.`,
      options: ['True', 'False'],
      correctAnswerIndex: 1,
      explanation: 'False. Increasing complexity usually introduces additional potential failure points and increases risk.',
      difficulty: config.difficulty
    });
  }

  // Create Short Questions
  if (config.questionType === 'short_question' || config.questionType === 'mixed') {
    questions.push({
      id: 'q_local_sq_1',
      type: 'short_question',
      question: `Explain why key concepts in ${config.topic || 'this subject'} are important for problem solving.`,
      modelAnswer: `Understanding core concepts provides a structured framework to break down complex problems, optimize performance, and minimize errors.`,
      keyKeywords: ['framework', 'concept', 'optimize', 'structure', 'problem'],
      explanation: 'A strong short answer highlights structured frameworks, optimization, and methodical problem decomposition.',
      difficulty: config.difficulty
    });
  }

  // Fill up to target question count if needed
  while (questions.length < config.questionCount) {
    const idx = questions.length + 1;
    questions.push({
      id: `q_fill_${idx}`,
      type: 'mcq',
      question: `[${config.difficulty.toUpperCase()} Quiz Q${idx}] What is a key takeaway regarding ${config.topic || 'study materials'}?`,
      options: [
        `Consistent practice and clear understanding of core terms in ${config.topic || 'the topic'}.`,
        'Memorizing answers without understanding underlying concepts.',
        'Ignoring edge cases and practice tests.',
        'Skipping foundational definitions.'
      ],
      correctAnswerIndex: 0,
      explanation: 'Deep conceptual understanding combined with active review produces superior test performance.',
      difficulty: config.difficulty
    });
  }

  return {
    id: `quiz_local_${Date.now()}`,
    title: `${config.topic || 'Study'} Quiz (${config.difficulty.toUpperCase()})`,
    topic: config.topic || 'General Knowledge',
    difficulty: config.difficulty,
    questions: questions.slice(0, config.questionCount),
    createdAt: new Date().toLocaleDateString()
  };
}

export function evaluateShortAnswer(
  userText: string,
  modelAnswer?: string,
  keywords?: string[]
): { score: number; feedback: string } {
  if (!userText || !userText.trim()) {
    return { score: 0, feedback: 'No response submitted.' };
  }

  const textLower = userText.toLowerCase();
  
  if (keywords && keywords.length > 0) {
    let matched = 0;
    keywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) matched++;
    });

    const ratio = matched / keywords.length;
    let score = ratio >= 0.7 ? 1.0 : ratio >= 0.4 ? 0.7 : 0.4;
    
    // Bonus check for length and substance
    if (userText.split(/\s+/).length > 8 && score < 1.0) {
      score = Math.min(1.0, score + 0.2);
    }

    return {
      score,
      feedback: score >= 0.8 
        ? `Excellent! Your answer hits key terms (${matched}/${keywords.length} matched).`
        : `Good effort! Key concepts covered (${matched}/${keywords.length} matched). Model answer: "${modelAnswer || ''}"`
    };
  }

  // Length heuristic fallback
  const wordCount = userText.trim().split(/\s+/).length;
  const score = wordCount >= 10 ? 1.0 : wordCount >= 5 ? 0.7 : 0.4;

  return {
    score,
    feedback: score === 1.0
      ? 'Well formulated response!'
      : `Model answer for comparison: "${modelAnswer || ''}"`
  };
}

export function calculateQuizScore(
  questions: QuizQuestion[],
  userAnswers: Record<string, UserAnswerRecord>
): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  mcqCount: number;
  mcqCorrect: number;
  trueFalseCount: number;
  trueFalseCorrect: number;
  shortCount: number;
  shortScoreTotal: number;
} {
  let totalScore = 0;
  let mcqCount = 0;
  let mcqCorrect = 0;
  let trueFalseCount = 0;
  let trueFalseCorrect = 0;
  let shortCount = 0;
  let shortScoreTotal = 0;

  questions.forEach(q => {
    const record = userAnswers[q.id];
    if (!record) return;

    if (q.type === 'mcq') {
      mcqCount++;
      if (record.selectedIndex === q.correctAnswerIndex) {
        mcqCorrect++;
        totalScore += 1;
      }
    } else if (q.type === 'true_false') {
      trueFalseCount++;
      if (record.selectedIndex === q.correctAnswerIndex) {
        trueFalseCorrect++;
        totalScore += 1;
      }
    } else if (q.type === 'short_question') {
      shortCount++;
      const s = record.scoreAwarded ?? 0;
      shortScoreTotal += s;
      totalScore += s;
    }
  });

  const maxScore = questions.length;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    totalScore,
    maxScore,
    percentage,
    mcqCount,
    mcqCorrect,
    trueFalseCount,
    trueFalseCorrect,
    shortCount,
    shortScoreTotal
  };
}
