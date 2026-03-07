import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy
} from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

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

  private _isDarkTheme: boolean = false;
  private _service?: SafetyStreakService;
  private _viewModel: CounterViewModel = {
    state: 'loading',
    message: strings.LoadingMessage,
    lastUpdatedUtc: new Date().toISOString()
  };

  public render(): void {
    this._renderAsync().catch(() => {
      this._viewModel = {
        state: 'error',
        message: 'Unable to load Safety Streak Counter data.',
        lastUpdatedUtc: new Date().toISOString()
      };
    });
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

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
                PropertyFieldListPicker('resetEventsList', {
                  label: strings.ResetEventsListLabel,
                  selectedList: this.properties.resetEventsList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context as unknown as never,
                  key: 'resetEventsListPicker'
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

  private async _renderAsync(): Promise<void> {
    if (!this._service) {
      const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this._service = new SafetyStreakService(
        new ResetEventsRepository(this.context.pageContext.web.absoluteUrl, this.context.spHttpClient),
        {
          timeZone: resolvedTimeZone,
          messages: {
            noData: strings.NoDataMessage,
            noAccess: strings.NoAccessMessage,
            error: strings.ErrorMessage
          }
        }
      );
    }

    if (!this.properties.resetEventsList) {
      this._viewModel = {
        state: 'noData',
        message: strings.NoListSelectedMessage,
        lastUpdatedUtc: new Date().toISOString()
      };
    } else {
      this._viewModel = await this._service.loadCounter(this.properties.resetEventsList);
    }

    const element: React.ReactElement<ISafetyStreakCounterProps> = React.createElement(
      SafetyStreakCounter,
      {
        layout: this.properties.layout ?? 'Ritual',
        title: this.properties.titleOverride,
        showLastUpdated: this.properties.showLastUpdated ?? false,
        viewModel: this._viewModel,
        strings: {
          defaultTitle: strings.DefaultTitle,
          caption: strings.Caption,
          updatedLabel: strings.UpdatedLabel
        },
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams
      }
    );

    ReactDom.render(element, this.domElement);
  }
}
