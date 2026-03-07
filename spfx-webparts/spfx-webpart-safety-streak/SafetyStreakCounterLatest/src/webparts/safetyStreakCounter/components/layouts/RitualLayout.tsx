import * as React from 'react';
import styles from '../SafetyStreakCounter.module.scss';
import { CounterViewModel } from '../../models/CounterViewModel';

export interface LayoutRenderProps {
  title: string;
  viewModel: CounterViewModel;
  showLastUpdated?: boolean;
  strings: {
    caption: string;
    updatedLabel: string;
  };
}

export const RitualLayout: React.FC<LayoutRenderProps> = ({ title, viewModel, showLastUpdated, strings }) => {
  const primary = viewModel.state === 'success' ? viewModel.daysSince ?? '--' : '--';
  const secondary = viewModel.latestResetEffectiveDate
    ? viewModel.latestResetEffectiveDate.toLocaleDateString()
    : viewModel.message ?? '';

  return (
    <div className={styles.layoutRitual}>
      <div className={styles.title}>{title}</div>
      <div className={styles.caption}>{strings.caption}</div>
      <div className={styles.primaryValue} aria-live="polite" aria-label={`${primary} ${strings.caption}`}>{primary}</div>
      <div className={styles.secondaryValue}>{secondary}</div>
      {showLastUpdated && (
        <div className={styles.lastUpdated}>{strings.updatedLabel} {viewModel.lastUpdatedUtc}</div>
      )}
    </div>
  );
};
