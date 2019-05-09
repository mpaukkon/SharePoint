import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import styles from './PostToTeamsExtensionApplicationCustomizer.module.scss';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'PostToTeamsExtensionApplicationCustomizerStrings';


const LOG_SOURCE: string = 'PostToTeamsExtensionApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IPostToTeamsExtensionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class PostToTeamsExtensionApplicationCustomizer
  extends BaseApplicationCustomizer<IPostToTeamsExtensionApplicationCustomizerProperties> {
    private _teamsLauncherJsUrl: string = "https://teams.microsoft.com/share/launcher.js";

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    let currentPageUrl:string = window.location.origin+this.context.pageContext.legacyPageContext["serverRequestPath"];
    console.log(this.context.pageContext);
    let scriptElement: HTMLScriptElement = document.createElement("script");
    scriptElement.src = this._teamsLauncherJsUrl;
    scriptElement.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(scriptElement);
    console.log("test");
    let bottomPlaceHolder: PlaceholderContent = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    if(bottomPlaceHolder)
    {
      bottomPlaceHolder.domElement.innerHTML = '<div class="'+styles.row+'">'+
           '<div class="'+styles.shareLink+'"><div class="teams-share-button" data-icon-px-size="64" data-href="'+currentPageUrl+'"></div><div class="ms-fontSize-16">Share to Teams</div></div>'+
      '</div>';
    }

    return Promise.resolve();
  }
  
  
}
