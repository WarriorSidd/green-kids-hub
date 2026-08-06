'use client';

import React, { useState } from 'react';
import { MatchingPair } from '@/lib/game-data';

interface MatchingEngineProps {
  pairs: MatchingPair[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

export default function MatchingEngine({
  pairs,
  onComplete,
  onScoreUpdate
}: MatchingEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentPair = pairs[currentIndex] || pairs[0];

  const handleSelect = (opt: string) => {
    if (feedback !== null || !currentPair) return;

    setSelectedOption(opt);
    setAttempts((a) => a + 1);

    if (opt === currentPair.right) {
      setFeedback('CORRECT');
      const newScore = score + 25;
      setScore(newScore);
      onScoreUpdate(newScore);

      setTimeout(() => {
        if (currentIndex + 1 < pairs.length) {
          setCurrentIndex((i) => i + 1);
          setSelectedOption(null);
          setFeedback(null);
        } else {
          onComplete(newScore, attempts + 1);
        }
      }, 1000);
    } else {
      setFeedback('WRONG');
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 900);
    }
  };

  if (!currentPair) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black uppercase text-sky-800">
          Match Pair {currentIndex + 1} of {pairs.length}
        </span>
      </div>

      {/* Target Item Display */}
      <div className="flex flex-col items-center justify-center rounded-2xl bg-sky-50/80 p-8 text-center ring-1 ring-sky-200">
        <span className="text-xs font-black uppercase tracking-wider text-sky-700">Find the Match For</span>
        <h2 className="mt-2 text-4xl font-black text-ink">{currentPair.left}</h2>
      </div>

      {/* Option Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {currentPair.options.map((opt) => {
          const isSelected = selectedOption === opt;
          let btnClass = 'border-slate-200 bg-white text-ink hover:border-sky-400 hover:bg-slate-50';

          if (isSelected) {
            if (feedback === 'CORRECT') {
              btnClass = 'border-emerald-600 bg-leaf text-white';
            } else if (feedback === 'WRONG') {
              btnClass = 'border-rose-600 bg-rose-600 text-white';
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={feedback !== null}
              className={`rounded-2xl border p-4 text-center font-black text-xl transition shadow-sm ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
