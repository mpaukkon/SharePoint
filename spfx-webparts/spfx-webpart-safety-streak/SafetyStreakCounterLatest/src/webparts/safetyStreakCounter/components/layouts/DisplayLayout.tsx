import * as React from 'react';
import styles from '../SafetyStreakCounter.module.scss';
import { LayoutRenderProps } from './RitualLayout';

export const DisplayLayout: React.FC<LayoutRenderProps> = ({ title, viewModel, showLastUpdated, strings }) => {
  const primary = viewModel.state === 'success' ? viewModel.daysSince ?? '--' : '--';
  const secondary = viewModel.latestResetEffectiveDate
    ? viewModel.latestResetEffectiveDate.toLocaleDateString()
    : viewModel.message ?? '';

  return (
    <div className={styles.layoutDisplay}>
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
