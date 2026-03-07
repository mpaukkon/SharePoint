import * as React from 'react';
import styles from './SafetyStreakCounter.module.scss';
import type { ISafetyStreakCounterProps } from './ISafetyStreakCounterProps';
import { RitualLayout } from './layouts/RitualLayout';
import { ContextLayout } from './layouts/ContextLayout';
import { DisplayLayout } from './layouts/DisplayLayout';

export default class SafetyStreakCounter extends React.Component<ISafetyStreakCounterProps> {
  public render(): React.ReactElement<ISafetyStreakCounterProps> {
    const { layout, viewModel, title, showLastUpdated, isDarkTheme, hasTeamsContext, strings } = this.props;
    const resolvedTitle = title ?? strings.defaultTitle;

    const layoutProps = {
      title: resolvedTitle,
      viewModel,
      showLastUpdated,
      strings
    };

  const renderLayout = (): React.ReactNode => {
      switch (layout) {
        case 'Context':
          return <ContextLayout {...layoutProps} />;
        case 'Display':
          return <DisplayLayout {...layoutProps} />;
        case 'Ritual':
        default:
          return <RitualLayout {...layoutProps} />;
      }
    };

    return (
      <section className={`${styles.safetyStreakCounter} ${isDarkTheme ? styles.dark : ''} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.card}>{renderLayout()}</div>
      </section>
    );
  }
}
