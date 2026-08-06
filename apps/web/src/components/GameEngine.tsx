'use client';

import React, { useState, useEffect } from 'react';
import { Game } from '@/lib/catalog';
import { Star, Trophy, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

interface GameEngineProps {
  game: Game;
}

export const GameEngine: React.FC<GameEngineProps> = ({ game }) => {
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Memory Game State
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Sequencing / Matching / Quiz State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    initGame();
  }, [game]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isCompleted]);

  const initGame = () => {
    setSeconds(0);
    setIsPlaying(true);
    setIsCompleted(false);
    setScore(0);
    setAttempts(0);
    setSelectedOption(null);

    if (game.type === 'MEMORY_CARDS') {
      const symbols = ['\u{1F31F}', '\u{1F34E}', '\u{1F680}', '\u{1F3A8}', '\u{1F436}', '\u{1F9E9}'];
      const deck = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, idx) => ({ id: idx, symbol, flipped: false, matched: false }));
      setCards(deck);
    }
  };

  // Memory Card Click Handler
  const handleCardClick = (index: number) => {
    const targetCard = cards[index];
    if (!isPlaying || !targetCard || targetCard.flipped || targetCard.matched || flippedCards.length >= 2) return;

    const newCards = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((a) => a + 1);
      const firstIndex = newFlipped[0] ?? 0;
      const secondIndex = newFlipped[1] ?? 0;

      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        const updatedCards = newCards.map((c, i) =>
          i === firstIndex || i === secondIndex ? { ...c, matched: true } : c
        );
        setCards(updatedCards);
        setFlippedCards([]);
        setScore((s) => s + 20);

        if (updatedCards.every((c) => c.matched)) {
          completeGame();
        }
      } else {
        setTimeout(() => {
          const resetCards = newCards.map((c, i) =>
            i === firstIndex || i === secondIndex ? { ...c, flipped: false } : c
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // Quiz Option Handler
  const handleQuizAnswer = (option: string) => {
    setSelectedOption(option);
    setAttempts((a) => a + 1);
    setScore((s) => s + 25);
    setTimeout(() => {
      completeGame();
    }, 600);
  };

  const completeGame = () => {
    setIsPlaying(false);
    setIsCompleted(true);
  };

  const calculateStars = () => {
    if (seconds < 30) return 3;
    if (seconds < 60) return 2;
    return 1;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          <ArrowLeft size={16} /> Exit Game
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Clock size={18} className="text-emerald-600" />
            <span>{seconds}s</span>
          </div>
          <div className="flex items-center gap-1 text-amber-600 font-bold">
            <Star size={18} className="fill-amber-400" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="relative min-h-[420px] rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
        <div className="mb-4">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800">
            {game.group} · {game.type}
          </span>
          <h1 className="mt-2 text-3xl font-black text-ink">{game.title}</h1>
          <p className="text-sm font-medium text-slate-600">{game.description}</p>
        </div>

        {/* Engine 1: Memory Cards */}
        {game.type === 'MEMORY_CARDS' && (
          <div className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-6">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`grid aspect-square place-items-center rounded-xl text-3xl font-black transition-all shadow-md ${
                  card.flipped || card.matched
                    ? 'bg-leaf text-white rotate-0'
                    : 'bg-slate-100 text-transparent hover:bg-emerald-50'
                }`}
              >
                {card.flipped || card.matched ? card.symbol : '\u{2753}'}
              </button>
            ))}
          </div>
        )}

        {/* Engine 2: Multiple Choice / Quiz */}
        {(game.type === 'MULTIPLE_CHOICE' || game.type === 'INTERACTIVE_QUIZ') && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl bg-emerald-50 p-6">
              <p className="text-xl font-black text-emerald-950">
                Question: What comes next in the logic sequence? [2, 4, 6, 8, ___]
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['9', '10', '12', '14'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`rounded-xl border p-4 text-left font-black text-lg transition ${
                    selectedOption === opt
                      ? 'border-emerald-600 bg-leaf text-white'
                      : 'border-slate-200 bg-white text-ink hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  Option: {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Engine 3: Default Interactive Fallback (Matching / Sequencing / Sorting) */}
        {game.type !== 'MEMORY_CARDS' && game.type !== 'MULTIPLE_CHOICE' && game.type !== 'INTERACTIVE_QUIZ' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl bg-amber-50 p-6">
              <p className="text-xl font-black text-amber-950">
                Match & Sort Activity: Arrange the blocks in correct order!
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Step 1: Focus', 'Step 2: Observe', 'Step 3: Analyze', 'Step 4: Complete'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleQuizAnswer(item)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left font-black text-emerald-900 hover:bg-emerald-100"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {isCompleted && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-slate-900/75 p-6 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-yellow-100 text-yellow-600">
                <Trophy size={36} />
              </div>
              <h2 className="mt-4 text-3xl font-black text-ink">Awesome Job!</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">You completed {game.title}</p>

              <div className="my-6 flex justify-center gap-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    className={star <= calculateStars() ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                <div>Time: {seconds}s</div>
                <div>Moves: {attempts}</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={initGame}
                  className="flex-1 rounded-xl bg-slate-100 py-3 font-black text-slate-700 hover:bg-slate-200"
                >
                  Play Again
                </button>
                <Link
                  href="/games"
                  className="flex-1 rounded-xl bg-leaf py-3 font-black text-white hover:bg-emerald-600"
                >
                  Game Library
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
