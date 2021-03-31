import Task from './objects/Task'

// allというTask型の配列を受け取ってTask型の値を返す
export const generateNewTask = (all: Task[]): Task => {
  let hasDuplicate: boolean = true;
  // resultの初期値
  let result: Task = {
    id: -1,
    name: 'undefiend',
    comment: '',
    checked: false,
  };

  // IDの重複しないタスクを生成する
  while (hasDuplicate) {
    // ランダムなIDを生成
    const randomId: number = generateRandomNumber(100000);
    // 既存タスクの全件中に生成したIDを持つデータがあるかチェック
    const duplicate: Task | undefined = all.find((t) => t.id === randomId);
    // 重複がなければOK
    if (!duplicate) {
      hasDuplicate = false;
      result = {
        id: randomId,
        name: '新しいタスク',
        comment: '',
        checked: false,
      };
    }
  }

  return result;
};

const generateRandomNumber = (range: number): number => {
  return Math.floor(Math.random() * range);
};

// 更新・作成したタスク内容をリストに反映させる
export const reflectEditToList = (
  all: Task[],
  edit: Task,
  isNew: boolean,
): Task[] => {
  let result: Task[] = [];

  // isNewがtrueならallにeditを加えて返す
  if (isNew) {
    result = [...all, edit];
  } else {
    result = all?.reduce((acc: Task[], cur: Task) => {
      // edit(新しく追加するもの)とcur(古いTask)のidが一致している場合のみeditをpush
      if (edit.id === cur.id) {
        acc.push(edit);
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);
  }

  return result;
};

/**
 * 削除したタスク内容をリストに反映させる
 * @param all タスク全件
 * @param deletedId 削除したタスクID
 */
export const reflectDeleteToList = (all: Task[], deletedId: number): Task[] => {
  return all?.filter((t) => t.id !== deletedId);
};

// /**
//  * タスク全件を読み込み
//  */
//  export const loadTaskList = async (): Promise<Task[]> => {
//   const all: Task[] = await TaskStorage.load();
//   return all;
// };

// /**
//  * タスク全件を保存
//  * @param all タスク全件
//  */
// export const saveTaskList = (all: Task[]) => {
//   TaskStorage.save(all);
// };