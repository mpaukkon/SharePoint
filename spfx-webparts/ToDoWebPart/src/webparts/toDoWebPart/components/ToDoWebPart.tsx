import * as React from 'react';
import styles from './ToDoWebPart.module.scss';
import { IToDoWebPartProps } from './IToDoWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { MSGraphClient } from "@microsoft/sp-http";
import { tasks } from '@microsoft/teams-js';
import { BrowserSupportLevel } from '@microsoft/sp-core-library';
import {GroupedList,IGroup, IGroupDividerProps,Button,IconButton,Link} from 'office-ui-fabric-react';
import * as moment from 'moment';
import {IToDoTask} from './IToDoTask';
import ToDoItemDialog from './ToDoItemDialog';



export interface ITodoWebPartState
{
  todoTasks: IToDoTask[];
  todoGroups: IGroup[];
}

export default class ToDoWebPart extends React.Component<IToDoWebPartProps, ITodoWebPartState> {
  
  public todoTasks: IToDoTask[] = [];
  constructor(props: IToDoWebPartProps, state: ITodoWebPartState)
  {
    super(props);
    this.state = {
      todoTasks: [],
      todoGroups:[]
    };
  }
  
  
  public componentDidMount(): void{
    this.getTodoTasks(); 
  }


 
  
  public render(): React.ReactElement<IToDoWebPartProps> {
     
          
    return (
      <div className={ styles.toDoWebPart }>
        <div className={ styles.container }>
         
                       
             <GroupedList 
             items={this.state.todoTasks} 
             onRenderCell={this._onRenderCell}
             groups={this.state.todoGroups}
            />
           
        </div>
      </div>
    );
  }

  
  

  private _onRenderCell = ((nestingDepth?:number, item?:IToDoTask, index?: number) =>
  {
    
    return(
     <div>
       <div className={styles.taskRow}>
       <div className={styles.column}>
     <div className={styles.title}><Link /*onClick={this._subjectClicked(item)}*/>{item.subject}</Link></div> 
     {!!(item.dueDateTime)?<div className={styles.subTitle}>{moment(item.dueDateTime.dateTime).add(3, "hours").format('DD.MM.YYYY')}</div>:null}
     </div><div className={styles.column}>
     <div className="complete">
     
     <IconButton title="Complete task" className={styles.button }onClick={this._completeButtonClicked(item.id)} iconProps={{iconName: 'Completed'}}></IconButton>
     {!!(item.reminderDateTime)?<IconButton className={styles.bell} iconProps={{iconName: 'AlarmClock'}}></IconButton>:null}
     </div>
     </div>
     </div>
     </div>
    );
  });

  /*
  private _onRenderHeader(props: IGroupDividerProps) :JSX.Element {
    
    return(
      <div>
        <div className={styles.row}>
       <div className={styles.column}>
       <div className={styles.title}>{props.group.name}</div>
       <div className={styles.column}>{props.group.isCollapsed?"false":"true"}</div>
       </div></div>
      </div>
    )

  }
  
*/  
  private getTodoTasks(): Promise<any>
  {
   
    this.props.msGraphClientFactory.getClient().then((graphClient: MSGraphClient) =>
      {
        graphClient.api("https://graph.microsoft.com/beta/me/outlook/tasks?$orderby=dueDateTime/dateTime&filter=status ne 'completed'").get((error, response:any,rawResponse?:any) =>
        {
        if(response && response.value && response.value.length > 0)
        {
          let todoTasks: IToDoTask[] = [];
          response.value.reverse().forEach((item,index) => {
              if(item.dueDateTime === null)
              {
                todoTasks.push(item);
              
              
              }
              else
              {
                todoTasks.unshift(item);
               
              }
              
          });
          
          this._createTodoGroups(todoTasks);
            this.setState({
              todoTasks: todoTasks,
              todoGroups: this._createTodoGroups(todoTasks)
              
            });
      }
    });
  
      });
    return null;
  }

  private _createTodoGroups(todoTasks:IToDoTask[]): IGroup[]
  {
    
    if(todoTasks.length > 0)
    {
        
        let taskGroups: IGroup[] = [];
       
      let today = moment();
      today.set({
        hour:0,minute:0,second:0
      });
      let tomorrow = moment();
      tomorrow.set(
        {
          hour:0,
          minute:0,
          second: 0
        }
      ).add(1,"day");
      

      let dueArray:number[] = [];
      let todayArray:number[] = [];
      let tomorrowArray:number[] = [];
      let laterArray: number[] = [];
      todoTasks.forEach((value:IToDoTask, index)=>{     
        if(value.dueDateTime !== null && today.diff(moment(value.dueDateTime.dateTime).add(3,"hours").startOf("day"),"day") > 0 )
        {

            dueArray.push(index);
          }

          else if(value.dueDateTime !== null && today.startOf("day").diff(moment(value.dueDateTime.dateTime).add(3,"hours").startOf("day"),"hours")  == 0) 
          {
            
            todayArray.push(index);
          }
          else if(value.dueDateTime !== null && tomorrow.diff(moment(value.dueDateTime.dateTime).add(3,"hours").startOf("day"), "hours") == 0)
          {

              tomorrowArray.push(index);

          }
          else
          {
            laterArray.push(index);
            
          }

      });
      
      if(dueArray.length > 0)
      {
        taskGroups.push({
          key:"due",
          startIndex: dueArray[0],
          count: dueArray.length,
          name: "Due",
          isCollapsed: false
        });
      }

      if(todayArray.length > 0)
      {
        taskGroups.push({
          key:"today",
          startIndex: todayArray[0],
          count: todayArray.length,
          name: "Today",
          isCollapsed: false
        });
      }
      if(tomorrowArray.length > 0)
      {
        taskGroups.push({
          key:"tomorrow",
          startIndex: tomorrowArray[0],
          count: tomorrowArray.length,
          name: "Tomorrow",
          isCollapsed: true
        });
      }
      if(laterArray.length > 0)
      {
        taskGroups.push({
          key:"later",
          startIndex: laterArray[0],
          count: laterArray.length,
          name: "Later",
          isCollapsed: true
        });
      }
      return taskGroups;
    }
  }

  private _completeButtonClicked = param => e => {
    console.log("Button clicked"+param);
    this.props.msGraphClientFactory.getClient().then((client: MSGraphClient) => 
    {
      client.api("https://graph.microsoft.com/beta/me/outlook/tasks/"+param+"/complete").post("").then((response: any)=>
      {
          if(response)
          {
            
            this.getTodoTasks();
          }
      });
    });
}




}
