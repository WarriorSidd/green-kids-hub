import {
  IconAward,
  IconBarChart,
  IconBookCheck,
  IconGamepad,
  IconStar
} from '@/components/Icons';
import { games, groups, categoryMeta, Game } from './catalog-data';

export type { Game };
export { games, groups };

export const categories = categoryMeta.map((cat) => {
  let icon = IconBarChart;
  if (cat.name === 'English') icon = IconBookCheck;
  if (cat.name === 'Science') icon = IconStar;
  if (cat.name === 'General Knowledge' || cat.name === 'Emotional Intelligence') icon = IconAward;
  if (cat.name === 'Memory Improvement' || cat.name === 'Focus & Concentration') icon = IconGamepad;

  return {
    ...cat,
    icon
  };
});
