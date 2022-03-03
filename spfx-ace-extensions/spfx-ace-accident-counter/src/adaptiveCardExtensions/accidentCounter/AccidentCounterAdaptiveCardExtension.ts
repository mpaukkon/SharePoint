import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AccidentCounterPropertyPane } from './AccidentCounterPropertyPane';
import { getSP } from "../../pnpjs";
import {Accident} from "../types";
import { sp } from '@pnp/sp';

export interface IAccidentCounterAdaptiveCardExtensionProps {
  title: string;
  description: string;
  link:string;
}

export interface IAccidentCounterAdaptiveCardExtensionState {
  daysWithoutAccidents: number;
  accidentsThisMonth: number;
  accidentsThisYear: number;
}



const CARD_VIEW_REGISTRY_ID: string = 'AccidentCounter_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AccidentCounter_QUICK_VIEW';
export const QUICK_VIEW_REGISTRY_ID2: string = 'AccidentCounter2_QUICK_VIEW';

export default class AccidentCounterAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAccidentCounterAdaptiveCardExtensionProps,
  IAccidentCounterAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AccidentCounterPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {

      daysWithoutAccidents: 0,
      accidentsThisMonth: 0,
      accidentsThisYear: 0
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    setTimeout(async() => {
    const sp = getSP(this.context );
    const accidents = await sp.web.getAccidents();
    this.setState(
      {
        daysWithoutAccidents: accidents.daysWithoutAccidents,
        accidentsThisMonth: accidents.accidentsThisMonth,
        accidentsThisYear: accidents.accidentsThisYear
      }
    );
    
  },300);
  return Promise.resolve();
}
  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AccidentCounter-property-pane'*/
      './AccidentCounterPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AccidentCounterPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }


}
