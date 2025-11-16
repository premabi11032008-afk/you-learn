import React, { useMemo } from 'react';
import { Lesson } from '../types';
import SpeechControls from './SpeechControls';

interface LessonDisplayProps {
  lesson: Lesson;
  onStartQuiz: () => void;
}

const LessonDisplay: React.FC<LessonDisplayProps> = ({ lesson, onStartQuiz }) => {
  const textToRead = useMemo(() => {
    const title = lesson.title;
    const sectionsText = lesson.sections.map(s => `${s.heading}. ${s.content}`).join('\n\n');
    const examplesTitle = "Examples.";
    const examplesText = lesson.examples.join('\n');
    return [title, sectionsText, examplesTitle, examplesText].join('\n\n');
  }, [lesson]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg animate-fade-in space-y-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500">
        {lesson.title}
      </h2>

      <SpeechControls textToRead={textToRead} />

      {lesson.sections.map((section, index) => (
        <div key={index} className="p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {section.heading}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}
      

      <div className="p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          Examples
        </h3>
        <ul className="space-y-4">
          {lesson.examples.map((example, index) => (
            <li key={index} className="flex items-start">
              <span className="text-emerald-500 font-bold mr-3">✓</span>
              {/* Fix: Replaced `replaceAll` with `replace` and a global regex for broader compatibility. */}
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{example.replace(/\*\*/g, '')}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 text-center">
        <button
          onClick={onStartQuiz}
          className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Test Your Knowledge
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LessonDisplay;