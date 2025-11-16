import { GoogleGenAI, Type } from "@google/genai";
import { LearningStyle, ProgressLevel, EducationalContent, Subtopics } from '../types';

export async function generateSubtopics(topic: string): Promise<Subtopics> {
  const ai = new GoogleGenAI({ apiKey: `AlzaSyCtTVSSb9ri3LNfQ8RLGWJ2QhmYGaeupH8`});

  const prompt = `For the provided topic, suggest approximately 10 subtopics in a logical learning order, progressing from fundamental concepts to applied concepts, and finally to expert-level ideas.

Topic: ${topic}

Group these subtopics into 'beginner', 'intermediate', and 'advanced' categories. Output the result as a single JSON object with the following structure:
{
  "topic": "${topic}",
  "subtopics": {
    "beginner": ["<subtopic 1>", "<subtopic 2>", ...],
    "intermediate": ["<subtopic 3>", "<subtopic 4>", ...],
    "advanced": ["<subtopic 5>", "<subtopic 6>", ...]
  }
}

Do not include any text or explanation outside of this JSON object.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING },
      subtopics: {
        type: Type.OBJECT,
        properties: {
          beginner: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of fundamental/beginner-level subtopics.'
          },
          intermediate: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of applied/intermediate-level subtopics.'
          },
          advanced: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of expert-level subtopics.'
          },
        },
        required: ["beginner", "intermediate", "advanced"],
      },
    },
    required: ["topic", "subtopics"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.5,
    },
  });

  const jsonText = response.text.trim();
  const parsedResponse = JSON.parse(jsonText);
  return parsedResponse.subtopics as Subtopics;
}

export async function generateEducationalContent(
  topic: string,
  learningStyle: LearningStyle,
  progressLevel: ProgressLevel
): Promise<EducationalContent> {
  const ai = new GoogleGenAI({ apiKey: process.env.AlzaSyCtTVSSb9ri3LNfQ8RLGWJ2QhmYGaeupH8});

  const prompt = `You are an expert instructional designer and adaptive learning engine. Your task is to create a personalized, interactive learning module tailored to the user’s topic, learning style, and knowledge level.

All output must be in a **valid JSON format** according to the schema described below.

Topic: ${topic}
Learning Style: ${learningStyle}
Knowledge Level: ${progressLevel}

Your responsibilities:

1. **Lesson Content**
    * **title**: An engaging title for the learning module.
    * **sections**: A list of 3-5 content sections. Each section must have:
        * **heading**: A clear, descriptive subheading for the section.
        * **content**: A detailed explanation for that section. Break down complex topics into smaller paragraphs.
    * **examples**: Provide 3–4 detailed, real-world examples that match the difficulty level.

    **Content Style Guidance:**
    * Adjust teaching style based on learning style:
        * Visual: describe diagrams, charts, or infographics.
        * Auditory: include mnemonics or short spoken-script style guidance.
        * Kinesthetic: include a hands-on or real-world activity.
        * Reading/Writing: use markdown, bullet points, and well-structured text.
    * Increase complexity and depth based on the knowledge level (Beginner → Intermediate → Advanced).

2. **Quiz**
    * Create **5 multiple-choice questions**, ordered **from easiest to hardest**.
    * Each question must include:
        * question text
        * list of 4 options
        * correct answer (exact match to one option)
    * Automatically increase question difficulty based on the content.

Return only a **single JSON object**. No explanation outside the JSON.
`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      lesson: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: { type: Type.STRING },
              },
              required: ["heading", "content"],
            },
          },
          examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "sections", "examples"],
      },
      quiz: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer"],
        },
      },
    },
    required: ["lesson", "quiz"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7,
    },
  });
  
  const jsonText = response.text.trim();
  const parsedContent = JSON.parse(jsonText) as EducationalContent;
  return parsedContent;
}