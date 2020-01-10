import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TeamPresenceWebPartWebPartStrings';
import TeamPresenceWebPart from './components/TeamPresenceWebPart';
import { ITeamPresenceWebPartProps } from './components/ITeamPresenceWebPartProps';


export interface ITeamPresenceWebPartWebPartProps {
  title: string;
}

export default class TeamPresenceWebPartWebPart extends BaseClientSideWebPart<ITeamPresenceWebPartWebPartProps> {

 
 
  public render(): void {
    const element: React.ReactElement<ITeamPresenceWebPartProps > = React.createElement(
      TeamPresenceWebPart,
      {
        title: this.properties.title,
        context: this.context,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        }
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
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
