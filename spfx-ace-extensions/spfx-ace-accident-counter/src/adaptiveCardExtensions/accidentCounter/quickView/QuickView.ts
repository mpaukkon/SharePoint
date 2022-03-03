import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AccidentCounterAdaptiveCardExtensionStrings';
import { IAccidentCounterAdaptiveCardExtensionProps, IAccidentCounterAdaptiveCardExtensionState } from '../AccidentCounterAdaptiveCardExtension';

export interface IQuickViewData {
  daysWithoutAccidents: string;
  daysWithoutAccidentsText:string;
  accidentsThisMonth: string;
  accidentsThisYear: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IAccidentCounterAdaptiveCardExtensionProps,
  IAccidentCounterAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
    daysWithoutAccidents: this.state.daysWithoutAccidents.toString(),
    daysWithoutAccidentsText: strings.DaysWithoutAccidentsText,
    accidentsThisMonth: this.state.accidentsThisMonth.toString()+strings.AccidentsInThisMonthText,
    accidentsThisYear: this.state.accidentsThisYear.toString()+strings.AccidentsInThisYearText

    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}