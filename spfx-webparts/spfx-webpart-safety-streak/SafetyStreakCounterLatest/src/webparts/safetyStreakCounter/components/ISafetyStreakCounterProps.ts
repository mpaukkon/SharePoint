import { LayoutType } from '../domain/types';
import { CounterViewModel } from '../models/CounterViewModel';

export interface ISafetyStreakCounterProps {
  title?: string;
  layout: LayoutType;
  showLastUpdated: boolean;
  viewModel: CounterViewModel;
  strings: {
    defaultTitle: string;
    caption: string;
    updatedLabel: string;
  };
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
}
