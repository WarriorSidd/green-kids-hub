'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/lib/game-data';

interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

export default function QuizEngine({
  questions,
  onComplete,
  onScoreUpdate
}: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (opt: string) => {
    if (feedback !== null || !currentQ) return;

    setSelectedOption(opt);
    setAttempts((a) => a + 1);

    if (opt === currentQ.correctAnswer) {
      setFeedback('CORRECT');
      const newScore = score + 25;
      setScore(newScore);
      onScoreUpdate(newScore);

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((i) => i + 1);
          setSelectedOption(null);
          setFeedback(null);
        } else {
          onComplete(newScore, attempts + 1);
        }
      }, 1200);
    } else {
      setFeedback('WRONG');
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 1000);
    }
  };

  if (!currentQ) return null;

  return (
    <div className="space-y-6">
      {/* Round Indicator */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800">
          Round {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-xs font-bold text-slate-500">
          Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
        </span>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-200 bg-emerald-50/60 p-6 shadow-sm">
        <p className="text-xl font-black text-emerald-950 leading-relaxed sm:text-2xl">
          {currentQ.question}
        </p>
        {currentQ.explanation && feedback === 'CORRECT' && (
          <div className="mt-4 rounded-xl bg-emerald-100 p-3 text-xs font-bold text-emerald-900 animate-fade-in">
            💡 {currentQ.explanation}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption === opt;
          let btnClass = 'border-slate-200 bg-white text-ink hover:border-emerald-400 hover:bg-slate-50';

          if (isSelected) {
            if (feedback === 'CORRECT') {
              btnClass = 'border-emerald-600 bg-emerald-600 text-white animate-bounce';
            } else if (feedback === 'WRONG') {
              btnClass = 'border-rose-600 bg-rose-600 text-white animate-shake';
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelectOption(opt)}
              disabled={feedback !== null}
              className={`rounded-2xl border p-4 text-left font-black text-base transition shadow-sm ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
