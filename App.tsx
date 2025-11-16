import React, { useState, useCallback } from 'react';
import { LearningStyle, ProgressLevel, Lesson, QuizQuestion, AppState, EducationalContent, Subtopics } from './types';
import { generateEducationalContent, generateSubtopics } from './services/geminiService';
import Header from './components/Header';
import TopicSelector from './components/TopicSelector';
import SubtopicSelector from './components/SubtopicSelector';
import LessonDisplay from './components/LessonDisplay';
import Quiz from './components/Quiz';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.TOPIC_SELECTION);
  const [topic, setTopic] = useState<string>('');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopics | null>(null);
  const [completedSubtopics, setCompletedSubtopics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFindSubtopics = useCallback(async (currentTopic: string) => {
    setAppState(AppState.GENERATING_SUBTOPICS);
    setError(null);
    setSubtopics(null);
    setTopic(currentTopic);
    try {
      const generatedSubtopics = await generateSubtopics(currentTopic);
      const allCompleted = JSON.parse(localStorage.getItem('completedLessons') || '{}');
      setCompletedSubtopics(allCompleted[currentTopic] || []);
      setSubtopics(generatedSubtopics);
      setAppState(AppState.SUBTOPIC_SELECTION);
    } catch (err) {
      console.error(err);
      setError('Failed to generate subtopics. Please try a different topic.');
      setAppState(AppState.TOPIC_SELECTION);
    }
  }, []);

  const handleGenerateLesson = useCallback(async (subtopic: string, learningStyle: LearningStyle, progressLevel: ProgressLevel) => {
    setAppState(AppState.GENERATING_LESSON);
    setError(null);
    setLesson(null);
    setQuiz(null);
    setSelectedSubtopic(subtopic);

    try {
      const content: EducationalContent = await generateEducationalContent(subtopic, learningStyle, progressLevel);
      setLesson(content.lesson);
      setQuiz(content.quiz);
      setAppState(AppState.LESSON_VIEW);
    } catch (err) {
      console.error(err);
      setError('Failed to generate educational content. Please try again.');
      setAppState(AppState.SUBTOPIC_SELECTION);
    }
  }, []);

  const handleStartQuiz = () => {
    const allCompleted = JSON.parse(localStorage.getItem('completedLessons') || '{}');
    const topicCompletions = allCompleted[topic] || [];
    if (!topicCompletions.includes(selectedSubtopic)) {
        const newTopicCompletions = [...topicCompletions, selectedSubtopic];
        allCompleted[topic] = newTopicCompletions;
        localStorage.setItem('completedLessons', JSON.stringify(allCompleted));
        setCompletedSubtopics(newTopicCompletions);
    }
    setAppState(AppState.QUIZ_VIEW);
  };
  
  const handleReset = () => {
    setAppState(AppState.TOPIC_SELECTION);
    setLesson(null);
    setQuiz(null);
    setError(null);
    setSubtopics(null);
    setTopic('');
    setSelectedSubtopic('');
    setCompletedSubtopics([]);
  };

  const handleRetakeLesson = () => {
    setAppState(AppState.LESSON_VIEW);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.TOPIC_SELECTION:
        return <TopicSelector onFindSubtopics={handleFindSubtopics} error={error} />;
      case AppState.GENERATING_SUBTOPICS:
        return <LoadingSpinner />;
      case AppState.SUBTOPIC_SELECTION:
        return subtopics && <SubtopicSelector subtopics={subtopics} onGenerate={handleGenerateLesson} completedSubtopics={completedSubtopics} />;
      case AppState.GENERATING_LESSON:
        return <LoadingSpinner />;
      case AppState.LESSON_VIEW:
        return lesson && <LessonDisplay lesson={lesson} onStartQuiz={handleStartQuiz} />;
      case AppState.QUIZ_VIEW:
        return quiz && <Quiz quiz={quiz} onReset={handleReset} onRetakeLesson={handleRetakeLesson} />;
      default:
        return <TopicSelector onFindSubtopics={handleFindSubtopics} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;