//importing our action types
import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

//setting our initialState to an empty array
const initialState = [];

//setting an arrow function for our alertReducer passing the state as the intialState and our action for actionType
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return [state.filter(alert => alert.id !== action.payload)];
    default:
      return state;
  }
}
