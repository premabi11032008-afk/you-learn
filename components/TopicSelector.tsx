import React, { useState } from 'react';

interface TopicSelectorProps {
  onFindSubtopics: (topic: string) => void;
  error: string | null;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onFindSubtopics, error }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onFindSubtopics(topic);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg transition-all animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">Personalize Your Learning Journey</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Tell us what you want to learn, and we'll create a custom lesson for you.</p>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            What topic do you want to learn about?
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Quantum Physics', 'React Hooks', 'The Renaissance'"
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!topic.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explore Subtopics
        </button>
      </form>
    </div>
  );
};

export default TopicSelector;
