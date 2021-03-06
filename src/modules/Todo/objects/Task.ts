type Task = {
  /** ID */
  id: number;
  /** 名称 */
  name: string;
  /** 完了フラグ */
  checked: boolean;

  comment: string;

  expired: Date;
};
  
export default Task;