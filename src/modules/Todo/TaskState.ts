import Task from './objects/Task';

/**
 * タスク State
 */
type TaskState = {
  /** タスク一覧 */
  list: Task[];
  /** タスク詳細 */
  detail: Task | null;
  /** 詳細モーダル表示 */
  dispModal: boolean;
  /** 新規作成タスクかどうか */
  isNewTask: boolean;
};

/**
 * State 初期値
 */
export const initialState: TaskState = {
  list: [],
  detail: null,
  dispModal: false,
  isNewTask: false,
};

export default TaskState;