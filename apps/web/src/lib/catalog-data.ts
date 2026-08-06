export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  group: 'Group A' | 'Group B' | 'Group C';
  category: string;
  type: 'MEMORY_CARDS' | 'SEQUENCING' | 'DRAG_AND_DROP' | 'INTERACTIVE_QUIZ' | 'SORTING' | 'TIMED_CHALLENGE' | 'MULTIPLE_CHOICE' | 'MATCHING';
  stars: number;
  status: 'Unlocked' | 'Locked' | 'Approved' | 'Draft' | 'Pending Approval';
}

export const groups = [
  { key: 'GROUP_A', label: 'Group A', classes: 'Senior KG + 1st', games: 50 },
  { key: 'GROUP_B', label: 'Group B', classes: '2nd + 3rd', games: 75 },
  { key: 'GROUP_C', label: 'Group C', classes: '4th + 5th', games: 100 }
];

export const categoryMeta = [
  { name: 'English', color: 'bg-sky-100 text-sky-700' },
  { name: 'Mathematics', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Science', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'General Knowledge', color: 'bg-orange-100 text-orange-700' },
  { name: 'Brain Development', color: 'bg-pink-100 text-pink-700' },
  { name: 'Logic Development', color: 'bg-violet-100 text-violet-700' },
  { name: 'Coding Basics', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Creativity', color: 'bg-rose-100 text-rose-700' },
  { name: 'Emotional Intelligence', color: 'bg-lime-100 text-lime-700' },
  { name: 'Memory Improvement', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Focus & Concentration', color: 'bg-teal-100 text-teal-700' },
  { name: 'Problem Solving', color: 'bg-amber-100 text-amber-700' }
];

export const games: Game[] = [
  // GROUP A (Senior KG + 1st Standard)
  {
    id: 'game-1',
    slug: 'memory-garden-match',
    title: 'Memory Garden Match',
    description: 'Flip cards and find matching pairs of flowers, fruits, and animals to build visual memory recall.',
    group: 'Group A',
    category: 'Memory Improvement',
    type: 'MEMORY_CARDS',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-4',
    slug: 'kind-choice-quest',
    title: 'Kind Choice Quest',
    description: 'Interactive emotion choice stories helping young learners practice kindness and empathy.',
    group: 'Group A',
    category: 'Emotional Intelligence',
    type: 'INTERACTIVE_QUIZ',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-7',
    slug: 'alphabet-phonics-bingo',
    title: 'Alphabet Phonics Bingo',
    description: 'Match letter sounds with starting pictures to build foundational phonics skills.',
    group: 'Group A',
    category: 'English',
    type: 'MATCHING',
    stars: 2,
    status: 'Unlocked'
  },
  {
    id: 'game-8',
    slug: 'counting-farm-animals',
    title: 'Counting Farm Animals',
    description: 'Count cows, ducks, and sheep in the pasture and match the correct number icon.',
    group: 'Group A',
    category: 'Mathematics',
    type: 'MULTIPLE_CHOICE',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-9',
    slug: 'rainbow-color-sorter',
    title: 'Rainbow Color Sorter',
    description: 'Drag primary and secondary colored gems into matching rainbow baskets.',
    group: 'Group A',
    category: 'Creativity',
    type: 'DRAG_AND_DROP',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-10',
    slug: 'living-vs-nonliving',
    title: 'Living vs Non-Living Explorer',
    description: 'Identify living plants and animals vs inanimate household objects.',
    group: 'Group A',
    category: 'Science',
    type: 'SORTING',
    stars: 2,
    status: 'Unlocked'
  },

  // GROUP B (2nd + 3rd Standard)
  {
    id: 'game-2',
    slug: 'pattern-path-builder',
    title: 'Pattern Path Builder',
    description: 'Observe sequence patterns of geometric shapes and complete missing elements.',
    group: 'Group B',
    category: 'Logic Development',
    type: 'SEQUENCING',
    stars: 2,
    status: 'Unlocked'
  },
  {
    id: 'game-6',
    slug: 'tiny-detective-observation',
    title: 'Tiny Detective Observation',
    description: 'Spot subtle differences between two visual scenes before the round timer ends.',
    group: 'Group B',
    category: 'Focus & Concentration',
    type: 'TIMED_CHALLENGE',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-11',
    slug: 'synonym-safari-match',
    title: 'Synonym Safari Match',
    description: 'Connect words with similar meanings to navigate through the jungle trail.',
    group: 'Group B',
    category: 'English',
    type: 'MATCHING',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-12',
    slug: 'multiplication-grid-runner',
    title: 'Multiplication Grid Runner',
    description: 'Solve multiplication tables (2x to 10x) to power up your rocket racer.',
    group: 'Group B',
    category: 'Mathematics',
    type: 'MULTIPLE_CHOICE',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-13',
    slug: 'solar-system-pioneer',
    title: 'Solar System Pioneer',
    description: 'Arrange planets in proper orbital order from the Sun outward.',
    group: 'Group B',
    category: 'Science',
    type: 'SEQUENCING',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-14',
    slug: 'world-monuments-quiz',
    title: 'World Monuments Quiz',
    description: 'Match famous world heritage sites (Taj Mahal, Colosseum, Pyramids) to their countries.',
    group: 'Group B',
    category: 'General Knowledge',
    type: 'MATCHING',
    stars: 2,
    status: 'Unlocked'
  },
  {
    id: 'game-15',
    slug: 'grid-memory-matrix',
    title: 'Grid Memory Matrix',
    description: 'Memorize lit tiles on a 4x4 grid and reproduce the pattern after a distractor delay.',
    group: 'Group B',
    category: 'Brain Development',
    type: 'MEMORY_CARDS',
    stars: 3,
    status: 'Unlocked'
  },

  // GROUP C (4th + 5th Standard)
  {
    id: 'game-3',
    slug: 'fraction-pizza-lab',
    title: 'Fraction Pizza Lab',
    description: 'Drag pizza slices onto plates to match fractional representations and simplified ratios.',
    group: 'Group C',
    category: 'Mathematics',
    type: 'DRAG_AND_DROP',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-5',
    slug: 'debug-the-robot-steps',
    title: 'Debug the Robot Steps',
    description: 'Sort loop and condition blocks in proper order to navigate the robot through maze grids.',
    group: 'Group C',
    category: 'Coding Basics',
    type: 'SORTING',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-16',
    slug: 'grammar-master-clause-quest',
    title: 'Grammar Master: Clause Quest',
    description: 'Distinguish independent clauses, dependent clauses, and complex sentence structures.',
    group: 'Group C',
    category: 'English',
    type: 'MULTIPLE_CHOICE',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-17',
    slug: 'elements-periodic-puzzle',
    title: 'Elements & Periodic Puzzle',
    description: 'Group chemical symbols with their element names and atomic numbers.',
    group: 'Group C',
    category: 'Science',
    type: 'MATCHING',
    stars: 2,
    status: 'Unlocked'
  },
  {
    id: 'game-18',
    slug: '3d-spatial-rotation-lab',
    title: '3D Spatial Rotation Lab',
    description: 'Rotate complex 3D block arrangements in mind to match target perspective angles.',
    group: 'Group C',
    category: 'Brain Development',
    type: 'MULTIPLE_CHOICE',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-19',
    slug: 'multi-step-logic-detective',
    title: 'Multi-Step Logic Detective',
    description: 'Use deduction clues to eliminate suspects and solve mystery grid puzzles.',
    group: 'Group C',
    category: 'Problem Solving',
    type: 'SORTING',
    stars: 3,
    status: 'Unlocked'
  },
  {
    id: 'game-20',
    slug: 'financial-math-budget-boss',
    title: 'Financial Math: Budget Boss',
    description: 'Calculate discounts, savings taxes, and make optimal spending decisions.',
    group: 'Group C',
    category: 'Problem Solving',
    type: 'INTERACTIVE_QUIZ',
    stars: 3,
    status: 'Unlocked'
  }
];
