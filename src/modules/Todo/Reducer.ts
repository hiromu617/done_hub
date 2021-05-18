import { Task } from ".";
import { initialState, storeTasks, getTasks } from "./Storage";
import { getUser } from "./Storage";
import axios from "../../constants/axios";
function reducer(state: Task[], action) {
  switch (action.type) {
    case "refresh":
      getTasks().then((state) => {
        console.log("refresh---------");
        console.log(state);
        return state;
      });
    case "checked":
      console.log("=======------------------=");
      // console.log(action.comment)
      // alert(action.id)
      let checkedState: Task[] = state.slice();
      let checkedTask: Task;
      let usersUid: string;

      checkedState.map((t) => {
        if (t.id === action.id) {
          t.checked = !t.checked;
          checkedTask = t;
          // console.log(t)
        }
      });
      // 完了したタスクを除外
      let yetCheckedState = checkedState.filter((t) => !t.checked)

      // console.log(checkedTask)
      getUser().then((data) => {
        if (data.uid !== undefined) {
          // console.log(data)
          usersUid = data.uid;
        }
        // console.log(usersUid)
        axios
          .post("/api/done_posts/" + usersUid, {
            done_post: {
              title: checkedTask.name,
              uid: usersUid,
              comment: action.comment,
            },
          })
          // .then(res => console.log(res))
          .catch((e) => console.log(e));
      });

      // storeTasks(checkedState);
      storeTasks(yetCheckedState);
      return yetCheckedState;
    case "share":
      console.log("----");
      console.log(JSON.stringify(state));
      console.log(state);
      if (state.length == 0) return;

      getUser().then((data) => {
        if (data.uid !== undefined) {
          // console.log(data)
          usersUid = data.uid;
        }
        axios
          .post(
            "/api/done_posts/" + usersUid,
            {
              done_post: {
                comment: action.comment,
                tasks: JSON.stringify(state),
              },
            },
            { headers: { "content-type": "application/json" } }
          )
          // .then(res => console.log(res))
          .catch((e) => console.log(e));
      });

      return state;
    case "delete":
      // // リロード時はstorageからstateを取ってくる
      // if(state.length === 0){
      //   getTasks().then((res) => {
      //     // alert(res)
      //     state = res
      //     let copy: Task[] = state.slice()
      //     let newDeletedState = []
      //     for(let i = 0; i < state.length; i++){
      //       if(copy[i].id !== action.id) newDeletedState.push(copy[i])
      //     }
      //     storeTasks(newDeletedState)
      //     return newDeletedState
      //   })
      // }
      // console.log(state)
      let copy: Task[] = state.slice();
      let newDeletedState = [];
      for (let i = 0; i < state.length; i++) {
        if (copy[i].id !== action.id) newDeletedState.push(copy[i]);
      }
      storeTasks(newDeletedState);
      return newDeletedState;
    case "create":
      let uniqueId: number = generateRandomNumber(10000);
      while (state.find((t) => t.id === uniqueId) !== undefined) {
        uniqueId = generateRandomNumber(10000);
      }
      let newTask: Task = {
        id: uniqueId,
        name: action.data.name,
        checked: false,
        comment: "",
        expired: action.expired,
      };
      console.log(newTask)
      let newState: Task[] = state.slice();
      newState.push(newTask);
      storeTasks(newState);
      return newState;
    default:
      return state;
  }
}

const generateRandomNumber = (range: number): number => {
  return Math.floor(Math.random() * range);
};

export default reducer;
