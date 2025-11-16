import React, { useState } from 'react';
import { LearningStyle, ProgressLevel, Subtopics } from '../types';

interface SubtopicSelectorProps {
  subtopics: Subtopics;
  onGenerate: (topic: string, learningStyle: LearningStyle, progressLevel: ProgressLevel) => void;
  completedSubtopics: string[];
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const SubtopicSelector: React.FC<SubtopicSelectorProps> = ({ subtopics, onGenerate, completedSubtopics }) => {
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(LearningStyle.VISUAL);
  const [progressLevel, setProgressLevel] = useState<ProgressLevel>(ProgressLevel.BEGINNER);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectSubtopic = (subtopic: string, level: ProgressLevel) => {
    setSelectedSubtopic(subtopic);
    setProgressLevel(level);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubtopic) {
      onGenerate(selectedSubtopic, learningStyle, progressLevel);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onGenerate(searchQuery.trim(), learningStyle, progressLevel);
    }
  };

  const renderSubtopicList = (list: string[], level: ProgressLevel) => {
    return (
      <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">{level}</h3>
        <ul className="space-y-2">
          {list.map((subtopic) => {
            const isCompleted = completedSubtopics.includes(subtopic);
            return (
              <li key={subtopic}>
                <button
                  onClick={() => handleSelectSubtopic(subtopic, level)}
                  className={`w-full text-left p-3 rounded-md transition-all duration-200 text-sm flex justify-between items-center ${
                    selectedSubtopic === subtopic
                      ? 'bg-sky-500 text-white font-semibold shadow-md'
                      : 'bg-white dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-800'
                  }`}
                >
                  <span className="flex-grow">{subtopic}</span>
                  {isCompleted && <CheckIcon />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg transition-all animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">Choose a Subtopic</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Select a specific area to focus on for your personalized lesson.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {subtopics.beginner.length > 0 && renderSubtopicList(subtopics.beginner, ProgressLevel.BEGINNER)}
          {subtopics.intermediate.length > 0 && renderSubtopicList(subtopics.intermediate, ProgressLevel.INTERMEDIATE)}
          {subtopics.advanced.length > 0 && renderSubtopicList(subtopics.advanced, ProgressLevel.ADVANCED)}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="learning-style" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preferred learning style
            </label>
            <select
              id="learning-style"
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value as LearningStyle)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            >
              {Object.values(LearningStyle).map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="progress-level" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Knowledge level
            </label>
            <select
              id="progress-level"
              value={progressLevel}
              onChange={(e) => setProgressLevel(e.target.value as ProgressLevel)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            >
              {Object.values(ProgressLevel).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedSubtopic}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11.94 1.515a1 1 0 01.55.945V5h3a1 1 0 01.782 1.625l-4 5a1 1 0 01-1.564 0l-4-5A1 1 0 016 5h3V2.46a1 1 0 01.55-.945l1.45-.484a1 1 0 01.94 0l1.45.484zM8 12v5a1 1 0 001 1h2a1 1 0 001-1v-5" />
          </svg>
          Generate My Lesson
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-center text-slate-500 dark:text-slate-400 mb-4">Don't see what you're looking for? Search for it.</p>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., 'The role of mitochondria'"
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            aria-label="Search for a subtopic"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="w-full sm:w-auto flex-shrink-0 flex justify-center items-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Generate
          </button>
        </form>
      </div>

    </div>
  );
};

export default SubtopicSelector;
