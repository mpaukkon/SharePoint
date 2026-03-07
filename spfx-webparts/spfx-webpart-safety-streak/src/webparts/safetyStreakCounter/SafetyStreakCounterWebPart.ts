import { LayoutType } from './domain/types';
import { SafetyStreakService } from './services/SafetyStreakService';
import { renderSafetyStreakCounter } from './components/SafetyStreakCounter';

export interface ISafetyStreakCounterWebPartProps {
  resetEventsList: string;
  layout: LayoutType;
  titleOverride?: string;
  showLastUpdated?: boolean;
}

export class SafetyStreakCounterWebPart {
  constructor(
    private readonly props: ISafetyStreakCounterWebPartProps,
    private readonly service: SafetyStreakService
  ) {}

  async render(): Promise<string> {
    const viewModel = await this.service.loadCounter(this.props.resetEventsList);
    return renderSafetyStreakCounter({
      viewModel,
      layout: this.props.layout,
      titleOverride: this.props.titleOverride,
      showLastUpdated: this.props.showLastUpdated
    });
  }
}
