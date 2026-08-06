'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { games, Game } from '@/lib/catalog-data';
import { saveGameScore, getStoredUser } from '@/lib/api';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  options: string[];
}

export interface SortItem {
  id: string;
  name: string;
  category: string;
}

export interface SequenceItem {
  id: string;
  prompt: string;
  items: string[];
  correctOrder: string[];
}

export interface GameDataSet {
  quizQuestions?: QuizQuestion[];
  matchingPairs?: MatchingPair[];
  sortCategories?: string[];
  sortItems?: SortItem[];
  sequenceItems?: SequenceItem[];
  memoryLevels?: { level: number; gridCols: number; pairsCount: number; symbols: string[] }[];
}

function getGameData(id: string): GameDataSet {
  switch (id) {
    case 'game-1':
      return {
        memoryLevels: [
          { level: 1, gridCols: 3, pairsCount: 3, symbols: ['A', 'B', 'C'] },
          { level: 2, gridCols: 4, pairsCount: 6, symbols: ['A', 'B', 'C', 'D', 'E', 'F'] }
        ]
      };

    case 'game-4':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'Your friend drops their lunch on the ground. What do you do?',
            options: ['Laugh at them', 'Share your lunch with them', 'Walk away', 'Tell them to be careful'],
            correctAnswer: 'Share your lunch with them',
            explanation: 'Sharing shows empathy and kindness when a friend is in trouble!'
          },
          {
            id: 'q2',
            question: 'A new classmate is sitting alone at recess. What do you do?',
            options: ['Ignore them', 'Make fun of them', 'Invite them to play tag with you', 'Tell them to go away'],
            correctAnswer: 'Invite them to play tag with you',
            explanation: 'Including others helps everyone feel welcome and valued.'
          },
          {
            id: 'q3',
            question: 'Your sibling is crying because they lost a favorite toy. What do you do?',
            options: ['Say it is just a toy', 'Help them search under the couch', 'Take another toy for yourself', 'Turn off the lights'],
            correctAnswer: 'Help them search under the couch',
            explanation: 'Helping loved ones solve problems shows love and care.'
          }
        ]
      };

    case 'game-7':
      return {
        matchingPairs: [
          { id: 'p1', left: 'B', right: 'Ball', options: ['Ball', 'Cat', 'Dog', 'Fish'] },
          { id: 'p2', left: 'S', right: 'Sun', options: ['Tree', 'Sun', 'Pen', 'Kite'] },
          { id: 'p3', left: 'M', right: 'Moon', options: ['Moon', 'Lamp', 'Rose', 'Hat'] },
          { id: 'p4', left: 'D', right: 'Duck', options: ['Apple', 'Bird', 'Duck', 'Egg'] }
        ]
      };

    case 'game-8':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'The pasture has: 3 Cows, 2 Ducks, and 4 Hens. How many Cows are there?',
            options: ['2', '3', '4', '5'],
            correctAnswer: '3'
          },
          {
            id: 'q2',
            question: 'The pond has: 5 Ducks, 1 Frog, and 2 Fish. How many Ducks are swimming?',
            options: ['3', '4', '5', '6'],
            correctAnswer: '5'
          },
          {
            id: 'q3',
            question: 'The barn has: 4 Horses, 3 Sheep, and 2 Goats. How many total animals in the barn?',
            options: ['7', '8', '9', '10'],
            correctAnswer: '9'
          }
        ]
      };

    case 'game-9':
      return {
        sortCategories: ['Primary Colors', 'Secondary Colors'],
        sortItems: [
          { id: 'i1', name: 'Red Ruby (Red)', category: 'Primary Colors' },
          { id: 'i2', name: 'Green Emerald (Green)', category: 'Secondary Colors' },
          { id: 'i3', name: 'Blue Sapphire (Blue)', category: 'Primary Colors' },
          { id: 'i4', name: 'Orange Amber (Orange)', category: 'Secondary Colors' }
        ]
      };

    case 'game-10':
      return {
        sortCategories: ['Living Things', 'Non-Living Things'],
        sortItems: [
          { id: 'i1', name: 'Puppy Dog', category: 'Living Things' },
          { id: 'i2', name: 'Wooden Chair', category: 'Non-Living Things' },
          { id: 'i3', name: 'Sunflower Plant', category: 'Living Things' },
          { id: 'i4', name: 'Story Book', category: 'Non-Living Things' }
        ]
      };

    case 'game-2':
      return {
        sequenceItems: [
          {
            id: 's1',
            prompt: 'Identify the missing pattern step: [ Red, Blue, Red, Blue, ? ]',
            items: ['Red', 'Green', 'Blue', 'Yellow'],
            correctOrder: ['Red']
          },
          {
            id: 's2',
            prompt: 'Complete the number sequence: 2, 4, 6, 8, [ ? ]',
            items: ['9', '10', '12', '14'],
            correctOrder: ['10']
          }
        ]
      };

    case 'game-6':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'Scene 1: [ Apple, Banana, Cherry, Mango ]\nScene 2: [ Apple, Banana, Mango ]\nWhich item was removed?',
            options: ['Banana', 'Cherry', 'Mango', 'Apple'],
            correctAnswer: 'Cherry'
          },
          {
            id: 'q2',
            question: 'Scene 1: [ Dog, Cat, Bird, Frog ]\nScene 2: [ Dog, Cat, Rabbit, Frog ]\nWhich animal was replaced by Rabbit?',
            options: ['Dog', 'Cat', 'Bird', 'Frog'],
            correctAnswer: 'Bird'
          }
        ]
      };

    case 'game-11':
      return {
        matchingPairs: [
          { id: 'p1', left: 'Happy', right: 'Joyful', options: ['Sad', 'Joyful', 'Angry', 'Tired'] },
          { id: 'p2', left: 'Big', right: 'Huge', options: ['Small', 'Huge', 'Thin', 'Short'] },
          { id: 'p3', left: 'Fast', right: 'Quick', options: ['Slow', 'Quick', 'Heavy', 'Dull'] }
        ]
      };

    case 'game-12':
      return {
        quizQuestions: [
          { id: 'q1', question: 'Solve rocket power math: 3 x 4 = ?', options: ['7', '10', '12', '14'], correctAnswer: '12' },
          { id: 'q2', question: 'Solve rocket power math: 6 x 5 = ?', options: ['25', '30', '35', '40'], correctAnswer: '30' },
          { id: 'q3', question: 'Solve rocket power math: 7 x 8 = ?', options: ['48', '54', '56', '63'], correctAnswer: '56' }
        ]
      };

    case 'game-13':
      return {
        sequenceItems: [
          {
            id: 's1',
            prompt: 'Which planet is 3rd from the Sun in our Solar System?',
            items: ['Mercury', 'Venus', 'Earth', 'Mars'],
            correctOrder: ['Earth']
          },
          {
            id: 's2',
            prompt: 'Which is the largest gas giant planet in our Solar System?',
            items: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'],
            correctOrder: ['Jupiter']
          }
        ]
      };

    case 'game-14':
      return {
        matchingPairs: [
          { id: 'p1', left: 'Taj Mahal', right: 'India', options: ['India', 'China', 'Egypt', 'Brazil'] },
          { id: 'p2', left: 'Eiffel Tower', right: 'France', options: ['Germany', 'France', 'Italy', 'Spain'] },
          { id: 'p3', left: 'Great Wall', right: 'China', options: ['Japan', 'India', 'China', 'Korea'] }
        ]
      };

    case 'game-3':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'A pizza is cut into 4 equal slices. You eat 1 slice. What fraction did you eat?',
            options: ['1/2', '1/3', '1/4', '1/5'],
            correctAnswer: '1/4'
          },
          {
            id: 'q2',
            question: 'A pizza has 8 equal slices. 4 slices are eaten. What fraction remains?',
            options: ['1/4', '1/3', '1/2', '3/4'],
            correctAnswer: '1/2'
          }
        ]
      };

    case 'game-5':
      return {
        sequenceItems: [
          {
            id: 's1',
            prompt: 'Order the FIRST step to make a sandwich:',
            items: ['Eat sandwich', 'Put bread slice on table', 'Add cheese', 'Put top bread slice'],
            correctOrder: ['Put bread slice on table']
          }
        ]
      };

    case 'game-16':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'Which of the following is a COMPLETE independent clause?',
            options: ['Running fast through the park', 'She runs fast through the park.', 'Very quickly in the morning', 'Because she was tired'],
            correctAnswer: 'She runs fast through the park.'
          }
        ]
      };

    case 'game-17':
      return {
        matchingPairs: [
          { id: 'p1', left: 'O', right: 'Oxygen', options: ['Osmium', 'Oxygen', 'Gold', 'Argon'] },
          { id: 'p2', left: 'Fe', right: 'Iron', options: ['Iron', 'Fluorine', 'Francium', 'Fermium'] }
        ]
      };

    case 'game-18':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'If you rotate a 2D Square by 90 degrees clockwise, what shape does it look like?',
            options: ['Circle', 'Square', 'Triangle', 'Diamond'],
            correctAnswer: 'Square'
          }
        ]
      };

    case 'game-19':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'Amy is taller than Ben. Ben is taller than Cara. Who is the SHORTEST?',
            options: ['Amy', 'Ben', 'Cara', 'Cannot be determined'],
            correctAnswer: 'Cara'
          }
        ]
      };

    case 'game-20':
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'A board game costs Rs 200. It is on sale for 50% off. How much do you pay?',
            options: ['Rs 50', 'Rs 100', 'Rs 150', 'Rs 175'],
            correctAnswer: 'Rs 100'
          }
        ]
      };

    default:
      return {
        quizQuestions: [
          {
            id: 'q1',
            question: 'What is 5 + 5?',
            options: ['8', '10', '12', '15'],
            correctAnswer: '10'
          }
        ]
      };
  }
}

interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ questions, onComplete, onScoreUpdate }) => {
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
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800">
          Round {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-xs font-bold text-slate-500">
          Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-emerald-50/60 p-6 shadow-sm">
        <p className="text-xl font-black text-emerald-950 leading-relaxed sm:text-2xl">
          {currentQ.question}
        </p>
        {currentQ.explanation && feedback === 'CORRECT' && (
          <div className="mt-4 rounded-xl bg-emerald-100 p-3 text-xs font-bold text-emerald-900">
            💡 {currentQ.explanation}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption === opt;
          let btnClass = 'border-slate-200 bg-white text-ink hover:border-emerald-400 hover:bg-slate-50';

          if (isSelected) {
            if (feedback === 'CORRECT') {
              btnClass = 'border-emerald-600 bg-emerald-600 text-white';
            } else if (feedback === 'WRONG') {
              btnClass = 'border-rose-600 bg-rose-600 text-white';
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
};

interface MatchingEngineProps {
  pairs: MatchingPair[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

const MatchingEngine: React.FC<MatchingEngineProps> = ({ pairs, onComplete, onScoreUpdate }) => {
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

      <div className="flex flex-col items-center justify-center rounded-2xl bg-sky-50/80 p-8 text-center ring-1 ring-sky-200">
        <span className="text-xs font-black uppercase tracking-wider text-sky-700">Find the Match For</span>
        <h2 className="mt-2 text-4xl font-black text-ink">{currentPair.left}</h2>
      </div>

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
};

interface SortingEngineProps {
  categories: string[];
  items: SortItem[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

const SortingEngine: React.FC<SortingEngineProps> = ({ categories, items, onComplete, onScoreUpdate }) => {
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

      <div className="flex flex-col items-center justify-center rounded-2xl bg-amber-50 p-8 text-center ring-1 ring-amber-200">
        <span className="text-xs font-black uppercase tracking-wider text-amber-800">Sort This Item</span>
        <h2 className="mt-2 text-4xl font-black text-ink">{currentItem.name}</h2>
      </div>

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
};

interface SequencingEngineProps {
  sequences: SequenceItem[];
  onComplete: (score: number, moves: number) => void;
  onScoreUpdate: (score: number) => void;
}

const SequencingEngine: React.FC<SequencingEngineProps> = ({ sequences, onComplete, onScoreUpdate }) => {
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
};

interface GameEngineProps {
  gameId?: string;
  game?: Game;
}

export const GameEngine: React.FC<GameEngineProps> = ({ gameId, game: customGame }) => {
  const activeGame =
    customGame || games.find((g) => g.id === gameId || g.slug === gameId) || games[0] || {
      id: 'game-1',
      slug: 'memory-garden-match',
      title: 'Memory Garden Match',
      description: 'Flip cards and find matching pairs.',
      group: 'Group A' as const,
      category: 'Memory Improvement',
      type: 'MEMORY_CARDS' as const,
      stars: 3,
      status: 'Unlocked' as const
    };

  const gameData = getGameData(activeGame.id);

  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  // Memory Cards State (Game 1, 15)
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  useEffect(() => {
    initGame();
  }, [activeGame.id]);

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
    setMoves(0);
    setFlippedCards([]);

    if (activeGame.type === 'MEMORY_CARDS' || activeGame.type === 'TIMED_CHALLENGE') {
      const levels = gameData?.memoryLevels?.[0];
      const symbols = levels?.symbols || ['A', 'B', 'C', 'D', 'E', 'F'];
      const deck = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, idx) => ({ id: idx, symbol, flipped: false, matched: false }));
      setCards(deck);
    }
  };

  const handleCardClick = (index: number) => {
    const targetCard = cards[index];
    if (!isPlaying || !targetCard || targetCard.flipped || targetCard.matched || flippedCards.length >= 2) return;

    const newCards = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
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
        setScore((s) => s + 25);

        if (updatedCards.every((c) => c.matched)) {
          handleEngineComplete(score + 25, moves + 1);
        }
      } else {
        setTimeout(() => {
          const resetCards = newCards.map((c, i) =>
            i === firstIndex || i === secondIndex ? { ...c, flipped: false } : c
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const handleEngineComplete = (finalScore: number, totalMoves: number) => {
    setScore(finalScore);
    setMoves(totalMoves);
    setIsPlaying(false);
    setIsCompleted(true);

    // Persist score to storage
    const currentUser = getStoredUser();
    if (currentUser && currentUser.role === 'STUDENT') {
      const stars = finalScore >= 100 || seconds < 30 ? 3 : finalScore >= 50 || seconds < 60 ? 2 : 1;
      const accuracy = totalMoves > 0 ? Math.round((finalScore / (totalMoves * 25)) * 100) : 0;
      saveGameScore(
        currentUser.id,
        activeGame.id,
        activeGame.title,
        finalScore,
        stars,
        seconds,
        accuracy
      );
    }
  };

  const calculateStars = () => {
    if (score >= 100 || seconds < 30) return 3;
    if (score >= 50 || seconds < 60) return 2;
    return 1;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top HUD Header */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-black text-slate-700 hover:bg-slate-200"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Exit Game
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <svg className="size-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{seconds}s</span>
          </div>
          <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
            <svg className="size-5 fill-amber-400 text-amber-400" viewBox="0 0 24 24" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Main Gameplay Stage */}
      <div className="relative min-h-[420px] rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
        <div className="mb-6">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800">
            {activeGame.group} · {activeGame.category}
          </span>
          <h1 className="mt-2 text-3xl font-black text-ink">{activeGame.title}</h1>
          <p className="mt-1 text-sm font-medium text-slate-600">{activeGame.description}</p>
        </div>

        {/* Dynamic Engine Router */}
        {gameData?.quizQuestions && (activeGame.type === 'MULTIPLE_CHOICE' || activeGame.type === 'INTERACTIVE_QUIZ') && (
          <QuizEngine
            questions={gameData.quizQuestions}
            onScoreUpdate={(s) => setScore(s)}
            onComplete={(finalScore, m) => handleEngineComplete(finalScore, m)}
          />
        )}

        {gameData?.matchingPairs && activeGame.type === 'MATCHING' && (
          <MatchingEngine
            pairs={gameData.matchingPairs}
            onScoreUpdate={(s) => setScore(s)}
            onComplete={(finalScore, m) => handleEngineComplete(finalScore, m)}
          />
        )}

        {gameData?.sortItems && (activeGame.type === 'SORTING' || activeGame.type === 'DRAG_AND_DROP') && (
          <SortingEngine
            categories={gameData.sortCategories || ['Category A', 'Category B']}
            items={gameData.sortItems}
            onScoreUpdate={(s) => setScore(s)}
            onComplete={(finalScore, m) => handleEngineComplete(finalScore, m)}
          />
        )}

        {gameData?.sequenceItems && activeGame.type === 'SEQUENCING' && (
          <SequencingEngine
            sequences={gameData.sequenceItems}
            onScoreUpdate={(s) => setScore(s)}
            onComplete={(finalScore, m) => handleEngineComplete(finalScore, m)}
          />
        )}

        {(activeGame.type === 'MEMORY_CARDS' || activeGame.type === 'TIMED_CHALLENGE' || (!gameData?.quizQuestions && !gameData?.matchingPairs && !gameData?.sortItems && !gameData?.sequenceItems)) && (
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`grid aspect-square place-items-center rounded-2xl text-4xl font-black transition-all shadow-sm ${
                  card.flipped || card.matched
                    ? 'bg-leaf text-white rotate-0'
                    : 'bg-slate-100 text-transparent hover:bg-emerald-50'
                }`}
              >
                {card.flipped || card.matched ? card.symbol : '❓'}
              </button>
            ))}
          </div>
        )}

        {/* Completion Star Modal */}
        {isCompleted && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-slate-900/75 p-6 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-yellow-100 text-yellow-600">
                <svg className="size-9 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4m6 0h8m-8 4h8m-8 4h8m-8 4h8" />
                </svg>
              </div>
              <h2 className="mt-4 text-3xl font-black text-ink">Awesome Job!</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">You completed {activeGame.title}</p>

              <div className="my-6 flex justify-center gap-2">
                {[1, 2, 3].map((star) => (
                  <svg
                    key={star}
                    className={`size-9 ${star <= calculateStars() ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                <div>Score: {score} pts</div>
                <div>Time: {seconds}s</div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 p-2 text-xs font-black text-emerald-700">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Score Saved to Your Profile!
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
