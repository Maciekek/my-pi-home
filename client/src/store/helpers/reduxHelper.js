
function createReducer(defaultState, actionHandlers) {
  return function reducer(state = defaultState, action) {
    if (actionHandlers.hasOwnProperty(action.type)) {
      return actionHandlers[action.type](state, action);
    }

    return state;
  }
}

export {
  createReducer,
};
