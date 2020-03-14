//importing redux dependencies for our index file to gather all reducers in one
import { combineReducers } from "redux";

//importing our alert reducer
import alert from "./alert";

//exporting the reducers combined
export default combineReducers({
  alert
});
