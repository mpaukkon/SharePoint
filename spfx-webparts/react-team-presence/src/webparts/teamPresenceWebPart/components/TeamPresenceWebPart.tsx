import * as React from 'react';
import styles from './TeamPresenceWebPart.module.scss';
import { ITeamPresenceWebPartProps } from './ITeamPresenceWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { MSGraphClient } from "@microsoft/sp-http";
import {Persona, IPersonaSharedProps, PersonaSize, PersonaPresence, classNamesFunction} from 'office-ui-fabric-react';
import TeamPresenceWebPartWebPart from '../TeamPresenceWebPartWebPart';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';


interface IPerson extends IPersonaSharedProps
{
    activity?: string;

}

interface ITeamPresenceWebPartState
{
  persons: IPerson[];
}

export default class TeamPresenceWebPart extends React.Component<ITeamPresenceWebPartProps, ITeamPresenceWebPartState, {}> {
  
  private groupID: string;
  constructor(props: ITeamPresenceWebPartProps)
  {
    super(props);
    this.groupID = this.props.context.pageContext.legacyPageContext['groupId'];
    this.state = {
      persons:[]
    };

  }

  
 

  public componentDidMount(): void{
    console.log("Group ID:"+this.groupID);
    if(this.groupID.length > 0)
    {    
      this._loadMembersAndPresence(this.groupID);
    }
   
  }

  
  
  public render(): React.ReactElement<ITeamPresenceWebPartProps> {
    return (
      <div className={ styles.teamPresenceWebPart }>
        
        <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.updateProperty} />
        <div className={ styles.container }>
          <div className={ styles.row }>
              {
                this.state.persons.map((item: IPerson) => {
                  return <div className={styles.persona}><Persona 
                  {...item}
                  size={PersonaSize.size40}
                  presence={item.presence}
                  text = {item.text}
                  secondaryText = {item.activity}
                  /></div>;
                })
              }
          </div>
        </div>
      </div>
    );
  }

  private _loadMembersAndPresence(groupID: string): void{
    let persons: IPerson[] = [];
    var body: String;
    var ids:String = "";
      body = '{"ids":[{0}]}';
    this.props.context.msGraphClientFactory.getClient().then((client:MSGraphClient): void => {
      client.api("/groups/"+groupID+"/members").get().then(membersResponse => {
       console.log(membersResponse);

          membersResponse.value.map((val:any) =>
          {
            console.log(val.id);
            const person: IPerson =
            {
                text: val.displayName,
                secondaryText: val.jobTitle,
                id: val.id

            }
            
            persons.push(person);
            
              ids += '"'+val.id+'",';
          });
        ids=ids.substring(0,ids.lastIndexOf(','));
          console.log(ids);
        
          body = body.replace("{0}",ids.toString());
          console.log(body);client.api('https://graph.microsoft.com/beta/communications/getPresencesByUserId').post(body, (error,presenceResponse: any, rawResponse?:any) => {
            console.log(presenceResponse);
            presenceResponse.value.map((val: any) => {
              console.log(val.id);  
              var p = persons.filter(item => item.id === val.id)[0];
              
              switch(val.availability)
              {
                case "Available":
                p.presence = PersonaPresence.online;
                break;
                case "AvailableIdle":
                  p.presence = PersonaPresence.online;
                  break;
                  case "Away":
                    p.presence = PersonaPresence.away;
                    break;
                    case "BeRightBack":
                      p.presence = PersonaPresence.away;
                      break;
                      case "Busy":
                        p.presence = PersonaPresence.busy
                        break;
                        case "BusyIdle":
                        p.presence = PersonaPresence.busy
                        break;
                        case "DoNotDisturb":
                        p.presence = PersonaPresence.dnd
                        break;
                        case "Offline":
                        p.presence = PersonaPresence.offline
                        break;
                        default:
                          p.presence = PersonaPresence.none
                          break;
              }
              p.activity = val.activity;
              
            });
              console.log(persons);
            this.setState({
              persons: persons
            })
        });
      });
    
        
    });
  }

  


}
