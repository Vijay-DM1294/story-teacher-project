import React from 'react';
import { Sparkles, Compass, Lightbulb, User, Loader2 } from 'lucide-react';

interface Step1CraftProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  protagonist: string;
  onProtagonistChange: (name: string) => void;
  ageBracket: string;
  onAgeBracketChange: (age: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error?: string | null;
}

const QUICK_TOPICS = [
  { label: '🌿 Photosynthesis', value: 'Photosynthesis' },
  { label: '🍎 Gravity', value: 'Gravity & Free Fall' },
  { label: '🍕 Fractions', value: 'Fractions & Proportions' },
  { label: '🕳️ Black Holes', value: 'Black Holes & Gravity' },
  { label: '💧 Water Cycle', value: 'The Water Cycle' },
  { label: '⚡ Circuits', value: 'Electric Circuits & Current' },
  { label: '🏔️ Plate Tectonics', value: 'Plate Tectonics & Earthquakes' },
  { label: '🧬 DNA & Genetics', value: 'DNA & Inheritance' },
  { label: '➖ Negative Numbers', value: 'Negative Numbers & Number Line' },
];

const AGE_OPTIONS = [
  {
    id: 'Ages 5–7 (Early Explorers 🌱)',
    title: 'Ages 5–7 (Early Explorers 🌱)',
    desc: 'Lexile 200L–400L. Simple sensory metaphors (leaf bakeries, sunshine cookies), short rhythmic sentences, gentle stakes.',
    badge: 'Grades K–2',
    accent: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
  },
  {
    id: 'Ages 8–10 (Adventurers 🔍)',
    title: 'Ages 8–10 (Adventurers 🔍)',
    desc: 'Lexile 500L–750L. Detective mysteries, comic quests, gadgets, schoolyard science puzzles, dynamic verbs, witty dialogue.',
    badge: 'Grades 3–5',
    accent: 'border-blue-200 bg-blue-50/50 text-blue-900',
  },
  {
    id: 'Ages 11–13 (Trailblazers 🚀)',
    title: 'Ages 11–13 (Trailblazers 🚀)',
    desc: 'Lexile 800L–1050L. Deep-space telemetry, survival expeditions, accurate formulas and technical terms, high stakes.',
    badge: 'Grades 6–8',
    accent: 'border-purple-200 bg-purple-50/50 text-purple-900',
  },
];

const THEME_OPTIONS = [
  '🧙‍♂️ Fantasy & Magic Quest',
  '🚀 Space & Sci-Fi Voyage',
  '🕵️ Detective Mystery & Crime Lab',
  '🦸 Superhero & Comic Quest',
  '🌿 Jungle Safari & Wildlife Adventure',
  '💻 Cyber Matrix & Tech Lab',
  '⏳ Time Travel Chrono-Missions',
];

export const Step1Craft: React.FC<Step1CraftProps> = ({
  topic,
  onTopicChange,
  protagonist,
  onProtagonistChange,
  ageBracket,
  onAgeBracketChange,
  theme,
  onThemeChange,
  onGenerate,
  isLoading,
  error,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
      <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-lg md:text-xl">
        <Compass className="w-6 h-6 text-indigo-600" />
        <h2>Step 1: Craft Your Learning Adventure</h2>
      </div>
      <p className="text-slate-600 text-sm mb-6">
        Choose any school science or math concept, or pick one of our curriculum quick picks below:
      </p>

      {/* Quick Pick Samples */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Curriculum Quick Picks</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onTopicChange(item.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                topic.toLowerCase() === item.value.toLowerCase()
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            School Science / Math Concept:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g., Photosynthesis, The Pythagorean Theorem, Newton's Laws..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm shadow-xs"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Type ANY academic concept you want to teach through a story!
          </span>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-500" />
            <span>Hero / Protagonist Name:</span>
          </label>
          <input
            type="text"
            value={protagonist}
            onChange={(e) => onProtagonistChange(e.target.value)}
            placeholder="e.g., Alex, Maya, Pip, Leo..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm shadow-xs"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Personalize the story with your child or student's name.
          </span>
        </div>
      </div>

      {/* Age Adaptation Tier */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <span>Target Age Adaptation Engine</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {AGE_OPTIONS.map((opt) => {
            const isSelected = ageBracket === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onAgeBracketChange(opt.id)}
                className={`cursor-pointer rounded-xl p-4 border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-800">{opt.title}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* World Theme */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Select Story World Theme:
        </label>
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm bg-white shadow-xs cursor-pointer"
        >
          {THEME_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-slate-400 mt-1 block">
          Sets the backdrop, aesthetic, and imaginative setting for the academic quest.
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* Generate Action Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>StoryTeacher AI is crafting your adventure...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>✨ Generate Story Adventure</span>
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 text-center sm:text-right">
          Powered by Google Gemini • Structured pedagogical scaffolding
        </p>
      </div>
    </div>
  );
};
