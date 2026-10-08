import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, ArrowRight, ArrowLeft, Lightbulb, BookMarked, Sparkles } from 'lucide-react';
import { StoryTeacherResponse } from '../types';

interface Step2StoryProps {
  storyData: StoryTeacherResponse;
  topic: string;
  ageBracket: string;
  theme: string;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step2Story: React.FC<Step2StoryProps> = ({
  storyData,
  topic,
  ageBracket,
  theme,
  onPrevStep,
  onNextStep,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      alert('Your browser does not support speech synthesis.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = storyData.story_content.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis && isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  // Helper to render bold text nicely
  const renderFormattedStory = (text: string) => {
    const paragraphs = text.split('\n\n').filter((p) => p.trim());
    return paragraphs.map((para, pIdx) => {
      // Split on **bold** words
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={pIdx} className="mb-4 last:mb-0 leading-relaxed text-slate-700 text-base md:text-lg">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const word = part.slice(2, -2);
              return (
                <strong
                  key={idx}
                  className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold border border-indigo-100"
                >
                  {word}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Metadata Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            {storyData.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
              🎯 {topic}
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
              🌱 {ageBracket.split('(')[0]}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200">
              {theme.split('&')[0]}
            </span>
          </div>
        </div>

        {/* Mission Hook Card */}
        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/70 border-l-4 border-amber-500 p-5 mb-6">
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>The Mission Hook</span>
          </div>
          <p className="text-amber-950 font-medium text-sm md:text-base leading-relaxed">
            {storyData.mission_hook}
          </p>
        </div>

        {/* Audio Narration Bar */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Interactive Audio Narration</div>
              <div className="text-[11px] text-slate-500">Listen with your device's natural voice engine</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={handleSpeak}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isPaused ? 'Resume' : 'Read Aloud'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          </div>
        </div>

        {/* Story Content */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4 text-indigo-600" />
            <span>The Adventure Story</span>
          </h3>
          <div className="story-content space-y-4">
            {renderFormattedStory(storyData.story_content)}
          </div>
        </div>

        {/* Secret Science / Math Takeaway */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-5 mb-8">
          <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>The Secret Science / Math Takeaway</span>
          </div>
          <p className="text-emerald-950 font-medium text-sm md:text-base leading-relaxed">
            {storyData.science_takeaway}
          </p>
        </div>

        {/* Concept Vocabulary Chest */}
        {storyData.vocabulary && storyData.vocabulary.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-indigo-600" />
              <span>Key Concept Vocabulary Chest</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {storyData.vocabulary.map((vocab, vIdx) => (
                <div
                  key={vIdx}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-4 transition-all hover:border-slate-300"
                >
                  <div className="font-bold text-indigo-700 text-sm mb-1">{vocab.word}</div>
                  <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                    <strong>Meaning:</strong> {vocab.definition}
                  </div>
                  {vocab.in_story_usage && (
                    <div className="text-[11px] text-slate-500 italic border-t border-slate-200/60 pt-2">
                      "{vocab.in_story_usage}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onPrevStep}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>⬅️ Edit Adventure Parameters (Step 1)</span>
          </button>

          <button
            onClick={onNextStep}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Proceed to Comprehension Quest (Step 3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
