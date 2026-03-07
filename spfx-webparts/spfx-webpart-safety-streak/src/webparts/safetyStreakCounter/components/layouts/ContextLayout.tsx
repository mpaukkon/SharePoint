import { CounterViewModel } from '../../models/CounterViewModel';
import { LayoutRenderProps } from './RitualLayout';

export const renderContextLayout = ({ title, viewModel, showLastUpdated }: LayoutRenderProps): string => {
  const primary = viewModel.state === 'success' ? `${viewModel.daysSince ?? '--'}` : '--';
  const secondary = viewModel.latestResetEffectiveDate
    ? viewModel.latestResetEffectiveDate.toLocaleDateString()
    : viewModel.message ?? '';
  const lastUpdated = showLastUpdated ? ` (Updated ${viewModel.lastUpdatedUtc})` : '';

  return `[Context] ${title}: ${primary} days · ${secondary}${lastUpdated}`;
};
