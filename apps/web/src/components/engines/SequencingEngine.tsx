'use client';

import React, { useState } from 'react';
import { SequenceItem } from '@/lib/game-data';

interface SequencingEngineProps {
  sequences: SequenceItem[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

export default function SequencingEngine({
  sequences,
  onComplete,
  onScoreUpdate
}: SequencingEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentSeq = sequences[currentIndex] || sequences[0];

  const handleSelect = (item: string) => {
    if (feedback !== null || !currentSeq) return;

    setSelectedOption(item);
    setAttempts((a) => a + 1);

    const isCorrect = item === currentSeq.correctOrder[0];

    if (isCorrect) {
      setFeedback('CORRECT');
      const newScore = score + 25;
      setScore(newScore);
      onScoreUpdate(newScore);

      setTimeout(() => {
        if (currentIndex + 1 < sequences.length) {
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

  if (!currentSeq) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black uppercase text-teal-800">
          Sequence Challenge {currentIndex + 1} of {sequences.length}
        </span>
      </div>

      <div className="rounded-2xl border border-teal-200 bg-teal-50/80 p-6 shadow-sm">
        <p className="text-xl font-black text-teal-950 sm:text-2xl">{currentSeq.prompt}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {currentSeq.items.map((item) => {
          const isSelected = selectedOption === item;
          let btnClass = 'border-slate-200 bg-white text-ink hover:border-teal-400 hover:bg-slate-50';

          if (isSelected) {
            if (feedback === 'CORRECT') {
              btnClass = 'border-emerald-600 bg-leaf text-white';
            } else if (feedback === 'WRONG') {
              btnClass = 'border-rose-600 bg-rose-600 text-white';
            }
          }

          return (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              disabled={feedback !== null}
              className={`rounded-2xl border p-4 text-left font-black text-lg transition shadow-sm ${btnClass}`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
