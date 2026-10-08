import React from 'react';
import { BookOpen, Sparkles, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-xl shadow-indigo-500/10 mb-6">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-20 -mb-12 w-48 h-48 rounded-full bg-purple-400/10 blur-xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EdTech Cognitive Narrative Engine</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 md:w-9 md:h-9 text-indigo-200" />
            StoryTeacher AI
          </h1>

          <p className="text-indigo-100/90 text-sm md:text-base max-w-3xl leading-relaxed">
            Kids find science and maths boring but never get tired of stories. Teach any school concept through an age-adapted story, dynamically test comprehension, and generate a parent/teacher diagnostic report.
          </p>
        </div>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            aria-label="Toggle Controls"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
