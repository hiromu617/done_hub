import {Task} from '.'
import { initialState, storeTasks, getTasks } from './Storage'

function reducer(state: Task[], action) {
  // リロード時はstorageからstateを取ってくる
  if(state.length === 0){
    getTasks().then((res) => {
      state = res
    })
    .then(() =>{
      switch (action.type) {
        case 'checked':
          // alert(action.id)
          let checkedState: Task[] = state.slice()
          checkedState.map((t) => {
            if(t.id === action.id) t.checked = !t.checked
          })
          storeTasks(checkedState)
          return checkedState
        case 'delete':
          let copy: Task[] = state.slice()
          let newDeletedState = []
          for(let i = 0; i < state.length; i++){
            if(copy[i].id !== action.id) newDeletedState.push(copy[i])
          }
          storeTasks(newDeletedState)
          return newDeletedState
        case 'create':
          let uniqueId: number = generateRandomNumber(10000)
          while(state.find((t) => t.id === uniqueId) !== undefined){
            uniqueId = generateRandomNumber(10000)
          }
          let newTask :Task = {
            id: uniqueId,
            name: action.data.name,
            checked: false
          }
          let newState: Task[] = state.slice()
          newState.push(newTask)
          storeTasks(newState)
          return newState
        default : 
          return state
      }
    })
  }
  switch (action.type) {
    case 'checked':
      // alert(action.id)
      let checkedState: Task[] = state.slice()
      checkedState.map((t) => {
        if(t.id === action.id) t.checked = !t.checked
      })
      storeTasks(checkedState)
      return checkedState
    case 'delete':
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
      let copy: Task[] = state.slice()
      let newDeletedState = []
      for(let i = 0; i < state.length; i++){
        if(copy[i].id !== action.id) newDeletedState.push(copy[i])
      }
      storeTasks(newDeletedState)
      return newDeletedState
    case 'create':
      let uniqueId: number = generateRandomNumber(10000)
      while(state.find((t) => t.id === uniqueId) !== undefined){
        uniqueId = generateRandomNumber(10000)
      }
      let newTask :Task = {
        id: uniqueId,
        name: action.data.name,
        checked: false
      }
      let newState: Task[] = state.slice()
      newState.push(newTask)
      storeTasks(newState)
      return newState
    default : 
      return state
  }
}

const generateRandomNumber = (range: number): number => {
  return Math.floor(Math.random() * range);
};

export default reducer