import { LayoutType } from '../domain/types';
import { CounterViewModel } from '../models/CounterViewModel';

export interface ISafetyStreakCounterProps {
  title?: string;
  layout: LayoutType;
  showLastUpdated: boolean;
  viewModel: CounterViewModel;
}
