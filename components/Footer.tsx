
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 mt-8">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Powered by AI. Built for learners. &copy; {new Date().getFullYear()} YouLearn.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
