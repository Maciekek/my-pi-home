import { rootActions } from './../root-actions';
import { rootActionTypes } from './../root-actions';

export const reducer = (state, action) => {
  console.log(action);
  console.log(rootActions);
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };
    case rootActionTypes.TEST:
      return { ...state, counter: 99999 };
    default:
      return state;
  }
};
