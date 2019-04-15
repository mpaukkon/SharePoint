import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BaseDialog,IDialogConfiguration} from '@microsoft/sp-dialog';
import {IToDoTask} from './IToDoTask';
import { DialogContent } from 'office-ui-fabric-react';
import styles from './ToDoWebPart.module.scss';
import {Link,IconButton} from 'office-ui-fabric-react';
import * as moment from 'moment';


interface IToDoItemDialogContentProps
{
    task:IToDoTask;
    close: () => void;
}


class ToDoItemDialogContent extends React.Component<IToDoItemDialogContentProps,null>
{
    constructor(props){
        super(props);
    }

    public render():JSX.Element{
        return(
            <div>
                <DialogContent
                title= {this.props.task.subject}
                showCloseButton={true}
                onDismiss={this.props.close}
                >
                <div className="ms-Grid">
                 <div className={styles.taskRow}>
       <div className={styles.column}>
     <div className={styles.title}><Link>{this.props.task.subject}</Link></div> 
     <div className={styles.subTitle}>{!!(this.props.task.dueDateTime)?moment(this.props.task.dueDateTime.dateTime).add(3, "hours").format('DD.MM.YYYY'):""}</div>
     </div><div className={styles.column}>
     <div className="complete">
     <IconButton title="Complete task" className="ms-fontSize-su" iconProps={{iconName: 'Completed'}}></IconButton>
     </div>
     </div>
     </div>
     </div>
                </DialogContent>
            </div>
        );
    }
}


export default class TodoItemDialog extends BaseDialog{
    public task: IToDoTask;

    public render():void{
        ReactDOM.render(
        <ToDoItemDialogContent 
        task= {this.task}
        close={this.close}
        />,this.domElement);

    }


    public getConfig(): IDialogConfiguration {
        return {
          isBlocking: false
        };
      }
}