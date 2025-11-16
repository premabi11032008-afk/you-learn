export enum LearningStyle {
  VISUAL = 'Visual (Diagrams, Charts)',
  AUDITORY = 'Auditory (Listening, Speaking)',
  KINESTHETIC = 'Kinesthetic (Doing, Experiencing)',
  READING_WRITING = 'Reading/Writing (Text, Lists)',
}

export enum ProgressLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface LessonSection {
  heading: string;
  content: string;
}

export interface Lesson {
  title: string;
  sections: LessonSection[];
  examples: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface EducationalContent {
  lesson: Lesson;
  quiz: QuizQuestion[];
}

export interface Subtopics {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

export enum AppState {
  TOPIC_SELECTION,
  GENERATING_SUBTOPICS,
  SUBTOPIC_SELECTION,
  GENERATING_LESSON,
  LESSON_VIEW,
  QUIZ_VIEW,
}