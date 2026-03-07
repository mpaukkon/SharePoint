import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SafetyStreakCounterWebPartStrings';
import SafetyStreakCounter from './components/SafetyStreakCounter';
import { ISafetyStreakCounterProps } from './components/ISafetyStreakCounterProps';
import { LayoutType } from './domain/types';
import { CounterViewModel } from './models/CounterViewModel';
import { SafetyStreakService } from './services/SafetyStreakService';
import { ResetEventsRepository } from './data/ResetEventsRepository';

export interface ISafetyStreakCounterWebPartProps {
  resetEventsList: string;
  layout: LayoutType;
  titleOverride?: string;
  showLastUpdated: boolean;
}

export default class SafetyStreakCounterWebPart extends BaseClientSideWebPart<ISafetyStreakCounterWebPartProps> {
  private viewModel: CounterViewModel = {
    state: 'loading',
    message: 'Loading...',
    lastUpdatedUtc: new Date().toISOString()
  };

  private service?: SafetyStreakService;

  public async render(): Promise<void> {
    if (!this.service) {
      this.service = new SafetyStreakService(
        new ResetEventsRepository(this.context.pageContext.web.absoluteUrl, this.context.spHttpClient),
        { timeZone: this.context.pageContext.cultureInfo.currentTimeZone }
      );
    }

    this.viewModel = await this.service.loadCounter(this.properties.resetEventsList);

    const element: React.ReactElement<ISafetyStreakCounterProps> = React.createElement(
      SafetyStreakCounter,
      {
        layout: this.properties.layout,
        title: this.properties.titleOverride,
        showLastUpdated: this.properties.showLastUpdated,
        viewModel: this.viewModel
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('resetEventsList', {
                  label: strings.ResetEventsListLabel
                }),
                PropertyPaneDropdown('layout', {
                  label: strings.LayoutLabel,
                  options: [
                    { key: 'Ritual', text: strings.LayoutRitualLabel },
                    { key: 'Context', text: strings.LayoutContextLabel },
                    { key: 'Display', text: strings.LayoutDisplayLabel }
                  ]
                }),
                PropertyPaneTextField('titleOverride', {
                  label: strings.TitleOverrideLabel
                }),
                PropertyPaneToggle('showLastUpdated', {
                  label: strings.ShowLastUpdatedLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
