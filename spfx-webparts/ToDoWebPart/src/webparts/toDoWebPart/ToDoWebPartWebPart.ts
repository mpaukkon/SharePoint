import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'ToDoWebPartWebPartStrings';
import ToDoWebPart from './components/ToDoWebPart';
import { IToDoWebPartProps } from './components/IToDoWebPartProps';
import { MSGraphClient } from '@microsoft/sp-http';


export interface IToDoWebPartWebPartProps {
  description: string;
}

export default class ToDoWebPartWebPart extends BaseClientSideWebPart<IToDoWebPartWebPartProps> {

  public render(): void {
    
    
    const element: React.ReactElement<IToDoWebPartProps > = React.createElement(
     
      ToDoWebPart,
      {
        msGraphClientFactory: this.context.msGraphClientFactory
        
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
