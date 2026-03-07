import { LayoutType } from '../domain/types';
import { CounterViewModel } from '../models/CounterViewModel';
import { renderContextLayout } from './layouts/ContextLayout';
import { renderDisplayLayout } from './layouts/DisplayLayout';
import { renderRitualLayout } from './layouts/RitualLayout';

export interface SafetyStreakCounterProps {
  viewModel: CounterViewModel;
  layout: LayoutType;
  titleOverride?: string;
  showLastUpdated?: boolean;
}

export const renderSafetyStreakCounter = ({
  viewModel,
  layout,
  titleOverride,
  showLastUpdated
}: SafetyStreakCounterProps): string => {
  const title = titleOverride ?? 'Safety Streak';

  switch (layout) {
    case 'Context':
      return renderContextLayout({ title, viewModel, showLastUpdated });
    case 'Display':
      return renderDisplayLayout({ title, viewModel, showLastUpdated });
    case 'Ritual':
    default:
      return renderRitualLayout({ title, viewModel, showLastUpdated });
  }
};
