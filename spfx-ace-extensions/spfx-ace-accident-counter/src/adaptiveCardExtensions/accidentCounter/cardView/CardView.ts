import {
  BasePrimaryTextCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IPrimaryTextCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AccidentCounterAdaptiveCardExtensionStrings';
import { IAccidentCounterAdaptiveCardExtensionProps, IAccidentCounterAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AccidentCounterAdaptiveCardExtension';



export class CardView extends BasePrimaryTextCardView<IAccidentCounterAdaptiveCardExtensionProps, IAccidentCounterAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: this.state.daysWithoutAccidents.toString()+strings.DaysWithoutAccidentsText,description: this.properties.description
      
    };
  }

  /*
  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    if(this.properties.link.length > 0)  
    {
    return{
        type:'ExternalLink',
        parameters:{
          target: this.properties.link
        }
      };
  }}
*/
  
}
