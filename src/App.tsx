import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { Sidebar } from './components/Sidebar';
import { Step1Craft } from './components/Step1Craft';
import { Step2Story } from './components/Step2Story';
import { Step3Quiz } from './components/Step3Quiz';
import { Step4Diagnostic } from './components/Step4Diagnostic';
import { StoryTeacherResponse } from './types';
import { CURATED_DEMOS } from './demos';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [storyData, setStoryData] = useState<StoryTeacherResponse | null>(null);

  const [topic, setTopic] = useState<string>('Photosynthesis');
  const [protagonist, setProtagonist] = useState<string>('Pip');
  const [ageBracket, setAgeBracket] = useState<string>('Ages 5–7 (Early Explorers 🌱)');
  const [theme, setTheme] = useState<string>('🧙‍♂️ Fantasy & Magic Quest');
  const [temperature, setTemperature] = useState<number>(0.7);

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Check backend health and API key status on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasApiKey(true);
        }
      })
      .catch(() => {
        // Dev server starting
      });
  }, []);

  const handleLoadDemo = (demoKey: string) => {
    const demo = CURATED_DEMOS[demoKey];
    if (!demo) return;

    setTopic(demo.topic);
    setAgeBracket(demo.age_bracket);
    setTheme(demo.theme);
    setProtagonist(demo.protagonist);
    setStoryData(demo.data);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setError(null);
    setCurrentStep(2);
  };

  const handleReset = () => {
    setStoryData(null);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setError(null);
    setCurrentStep(1);
  };

  const handleGenerateStory = async () => {
    if (!topic.trim()) {
      setError('Please enter a concept topic.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          ageBracket,
          theme,
          protagonist,
          temperature,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate story.');
      }

      setStoryData(data.story);
      setUserAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
      setCurrentStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error communicating with Gemini engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!storyData?.quiz) return;

    let score = 0;
    storyData.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_index) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <StepNavigation
              currentStep={currentStep}
              onSelectStep={setCurrentStep}
              hasStory={!!storyData}
              quizSubmitted={quizSubmitted}
            />

            {currentStep === 1 && (
              <Step1Craft
                topic={topic}
                onTopicChange={setTopic}
                protagonist={protagonist}
                onProtagonistChange={setProtagonist}
                ageBracket={ageBracket}
                onAgeBracketChange={setAgeBracket}
                theme={theme}
                onThemeChange={setTheme}
                onGenerate={handleGenerateStory}
                isLoading={isLoading}
                error={error}
              />
            )}

            {currentStep === 2 && storyData && (
              <Step2Story
                storyData={storyData}
                topic={topic}
                ageBracket={ageBracket}
                theme={theme}
                onPrevStep={() => setCurrentStep(1)}
                onNextStep={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && storyData && (
              <Step3Quiz
                quizQuestions={storyData.quiz}
                topic={topic}
                userAnswers={userAnswers}
                onSelectAnswer={handleSelectQuizAnswer}
                isSubmitted={quizSubmitted}
                score={quizScore}
                onSubmit={handleSubmitQuiz}
                onRetake={handleRetakeQuiz}
                onPrevStep={() => setCurrentStep(2)}
                onNextStep={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 4 && storyData && (
              <Step4Diagnostic
                storyData={storyData}
                topic={topic}
                ageBracket={ageBracket}
                protagonist={protagonist}
                score={quizScore}
                totalQuestions={storyData.quiz?.length || 3}
                userAnswers={userAnswers}
                onRetakeQuiz={() => {
                  handleRetakeQuiz();
                  setCurrentStep(3);
                }}
                onNewAdventure={handleReset}
              />
            )}
          </main>

          {/* Settings Sidebar */}
          <Sidebar
            temperature={temperature}
            onTemperatureChange={setTemperature}
            onLoadDemo={handleLoadDemo}
            onReset={handleReset}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            hasApiKey={hasApiKey}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
