export interface TaskData {
  id?: number;
  title: string;
  state?: 'ToDo';
  point: number;
  condition: string;
  userName: string;
  userId?: string;
}

export interface BacklogState {
  epicList: {
    id: number;
    title: string;
    storyList: {
      id: number;
      title: string;
      taskList: TaskData[];
    }[];
  }[];
}
