import * as React from 'react';
import styles from '../SafetyStreakCounter.module.scss';
import { CounterViewModel } from '../../models/CounterViewModel';

export interface LayoutRenderProps {
  title: string;
  viewModel: CounterViewModel;
  showLastUpdated?: boolean;
}

export const RitualLayout: React.FC<LayoutRenderProps> = ({ title, viewModel, showLastUpdated }) => {
  const primary = viewModel.state === 'success' ? viewModel.daysSince ?? '--' : '--';
  const secondary = viewModel.latestResetEffectiveDate
    ? viewModel.latestResetEffectiveDate.toLocaleDateString()
    : viewModel.message ?? '';

  return (
    <div className={styles.layoutRitual}>
      <div className={styles.title}>{title}</div>
      <div className={styles.primaryValue}>{primary}</div>
      <div className={styles.secondaryValue}>{secondary}</div>
      {showLastUpdated && (
        <div className={styles.lastUpdated}>Updated {viewModel.lastUpdatedUtc}</div>
      )}
    </div>
  );
};
