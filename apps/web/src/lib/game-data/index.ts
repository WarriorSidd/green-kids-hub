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

export function getGameData(id: string): GameDataSet {
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
