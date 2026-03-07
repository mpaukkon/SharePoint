import { LayoutRenderProps } from './RitualLayout';

export const renderDisplayLayout = ({ title, viewModel, showLastUpdated }: LayoutRenderProps): string => {
  const primary = viewModel.state === 'success' ? `${viewModel.daysSince ?? '--'}` : '--';
  const secondary = viewModel.latestResetEffectiveDate
    ? viewModel.latestResetEffectiveDate.toLocaleDateString()
    : viewModel.message ?? '';
  const lastUpdated = showLastUpdated ? ` (Updated ${viewModel.lastUpdatedUtc})` : '';

  return `[Display] ${title}: ${primary} days · ${secondary}${lastUpdated}`;
};
