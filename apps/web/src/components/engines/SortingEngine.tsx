'use client';

import React, { useState } from 'react';
import { SortItem } from '@/lib/game-data';

interface SortingEngineProps {
  categories: string[];
  items: SortItem[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

export default function SortingEngine({
  categories,
  items,
  onComplete,
  onScoreUpdate
}: SortingEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentItem = items[currentIndex] || items[0];

  const handleSelectCategory = (cat: string) => {
    if (feedback !== null || !currentItem) return;

    setSelectedCat(cat);
    setAttempts((a) => a + 1);

    if (cat === currentItem.category) {
      setFeedback('CORRECT');
      const newScore = score + 20;
      setScore(newScore);
      onScoreUpdate(newScore);

      setTimeout(() => {
        if (currentIndex + 1 < items.length) {
          setCurrentIndex((i) => i + 1);
          setSelectedCat(null);
          setFeedback(null);
        } else {
          onComplete(newScore, attempts + 1);
        }
      }, 900);
    } else {
      setFeedback('WRONG');
      setTimeout(() => {
        setFeedback(null);
        setSelectedCat(null);
      }, 800);
    }
  };

  if (!currentItem) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black uppercase text-violet-800">
          Item {currentIndex + 1} of {items.length}
        </span>
      </div>

      {/* Target Item Display */}
      <div className="flex flex-col items-center justify-center rounded-2xl bg-amber-50 p-8 text-center ring-1 ring-amber-200">
        <span className="text-xs font-black uppercase tracking-wider text-amber-800">Sort This Item</span>
        <h2 className="mt-2 text-4xl font-black text-ink">{currentItem.name}</h2>
      </div>

      {/* Category Buckets */}
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const isSelected = selectedCat === cat;
          let btnClass = 'border-slate-200 bg-white text-ink hover:border-violet-500 hover:bg-violet-50';

          if (isSelected) {
            if (feedback === 'CORRECT') {
              btnClass = 'border-leaf bg-leaf text-white';
            } else if (feedback === 'WRONG') {
              btnClass = 'border-rose-600 bg-rose-600 text-white';
            }
          }

          return (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              disabled={feedback !== null}
              className={`flex h-32 flex-col items-center justify-center rounded-2xl border-2 p-4 text-center font-black text-xl shadow-sm transition ${btnClass}`}
            >
              <span>{cat}</span>
              <span className="mt-1 text-xs font-bold opacity-75">Tap to Place Item</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
