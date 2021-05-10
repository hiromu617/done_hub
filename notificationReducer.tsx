function reducer(state, action) {
  switch (action.type) {
    case 'set':
      alert(action.count)
      return {count: action.count};
    case 'decrement':
      return {count: state.count - 1};
    default:
      return state
  }
}

export default reducer;
