import * as React from 'react';
import styles from './SafetyStreakCounter.module.scss';
import { ISafetyStreakCounterProps } from './ISafetyStreakCounterProps';
import { RitualLayout } from './layouts/RitualLayout';
import { ContextLayout } from './layouts/ContextLayout';
import { DisplayLayout } from './layouts/DisplayLayout';

export default class SafetyStreakCounter extends React.Component<ISafetyStreakCounterProps> {
  public render(): React.ReactElement<ISafetyStreakCounterProps> {
    const { layout, viewModel, title, showLastUpdated } = this.props;
    const resolvedTitle = title ?? 'Safety Streak';

    const layoutProps = {
      title: resolvedTitle,
      viewModel,
      showLastUpdated
    };

    const renderLayout = () => {
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
      <div className={styles.safetyStreakCounter}>
        <div className={styles.card}>{renderLayout()}</div>
      </div>
    );
  }
}
