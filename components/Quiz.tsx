import React, { useState, useMemo } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  quiz: QuizQuestion[];
  onReset: () => void;
  onRetakeLesson: () => void;
}

const Quiz: React.FC<QuizProps> = ({ quiz, onReset, onRetakeLesson }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(new Array(quiz.length).fill(null));
  const [view, setView] = useState<'question' | 'summary' | 'result'>('question');

  const score = useMemo(() => {
    return selectedAnswers.reduce((total, answer, index) => {
      if (answer === quiz[index].correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);
  }, [selectedAnswers, quiz]);

  const handleSelectAnswer = (option: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setView('question');
  };

  const renderQuestionView = () => {
    const currentQuestion = quiz[currentQuestionIndex];
    const selectedAnswerForCurrent = selectedAnswers[currentQuestionIndex];

    return (
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
        <div className="mb-6">
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
            Question {currentQuestionIndex + 1} of {quiz.length}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {currentQuestion.question}
          </h2>
        </div>
        <div className="space-y-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelectAnswer(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                option === selectedAnswerForCurrent
                  ? 'bg-sky-100 dark:bg-sky-900 border-sky-500'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-900 border-transparent'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex(i => i - 1)}
            disabled={currentQuestionIndex === 0}
            className="py-2 px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentQuestionIndex < quiz.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(i => i + 1)}
              className="py-2 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setView('summary')}
              className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-all"
            >
              Review Answers
            </button>
          )}
        </div>
      </div>
    );
  };
  
  const renderSummaryView = () => {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6">Review Your Answers</h2>
        <ul className="space-y-4 mb-8">
          {quiz.map((question, index) => (
            <li key={index} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Q{index + 1}: {question.question}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Your Answer: <span className="font-medium text-sky-600 dark:text-sky-400">{selectedAnswers[index] || 'Not answered'}</span>
                </p>
              </div>
              <button onClick={() => handleGoToQuestion(index)} className="text-sm font-semibold text-sky-600 hover:underline flex-shrink-0 ml-4">
                Edit
              </button>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <button
            onClick={() => setView('result')}
            className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    );
  };

  const renderResultView = () => {
    const percentage = Math.round((score / quiz.length) * 100);
    const resultMessage = percentage >= 80 ? "Excellent work!" : percentage >= 50 ? "Good job, keep practicing!" : "Don't worry, try again!";
    const resultColor = percentage >= 80 ? "text-emerald-500" : percentage >= 50 ? "text-yellow-500" : "text-red-500";

    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg animate-fade-in space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">Quiz Complete!</h2>
          <div className="text-center">
            <p className={`text-6xl font-extrabold ${resultColor}`}>{percentage}%</p>
            <p className="text-xl text-slate-600 dark:text-slate-300 mt-2">You answered {score} out of {quiz.length} questions correctly.</p>
            <p className="text-2xl font-semibold mt-4">{resultMessage}</p>
          </div>
        </div>
        
        <div className="text-left bg-slate-100 dark:bg-slate-900/50 p-6 rounded-lg">
           <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Answer Review</h3>
           <ul className="space-y-4">
              {quiz.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  return (
                      <li key={index} className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-b-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{index + 1}. {question.question}</p>
                          <p className={`mt-1 text-sm ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              Your answer: {userAnswer || 'Not answered'}
                              {!isCorrect && <span className="block sm:inline sm:ml-2 font-medium">(Correct: {question.correctAnswer})</span>}
                          </p>
                      </li>
                  );
              })}
           </ul>
        </div>
        
        <div className="text-center">
          {percentage < 50 ? (
            <button
              onClick={onRetakeLesson}
              className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Retake Lesson & Quiz
            </button>
          ) : (
            <button
              onClick={onReset}
              className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Learn Another Topic
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };
  
  switch (view) {
    case 'question':
      return renderQuestionView();
    case 'summary':
      return renderSummaryView();
    case 'result':
      return renderResultView();
    default:
      return renderQuestionView();
  }
};

export default Quiz;