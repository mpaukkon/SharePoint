export interface IToDoTask{
    subject: string;
    dueDateTime: {
      dateTime: string;
      timeZone: string;
    };
    reminderDateTime: {
      dateTime: string;
      timeZone: string;
    };
    isReminderOn: boolean;
    id: string;

    
  }