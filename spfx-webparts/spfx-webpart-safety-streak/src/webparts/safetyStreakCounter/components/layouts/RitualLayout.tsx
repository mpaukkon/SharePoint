import { CounterViewModel } from '../../models/CounterViewModel';

export interface LayoutRenderProps {
  title: string;
  viewModel: CounterViewModel;
  showLastUpdated?: boolean;
}

export const renderRitualLayout = ({ title, viewModel, showLastUpdated }: LayoutRenderProps): string => {
  const primary = viewModel.state === 'success' ? `${viewModel.daysSince ?? '--'}` : '--';
  const secondary = viewModel.latestResetEffectiveDate
    ? viewModel.latestResetEffectiveDate.toLocaleDateString()
    : viewModel.message ?? '';
  const lastUpdated = showLastUpdated ? ` (Updated ${viewModel.lastUpdatedUtc})` : '';

  return `[Ritual] ${title}: ${primary} days · ${secondary}${lastUpdated}`;
};
