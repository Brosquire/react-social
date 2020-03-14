//Redux Store File

//requiring redux dependencies
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

//setting initial state set to an object
const initialState = {};
//setting middleware
const middleware = [thunk];

//creating our store setting it equal to the createStore we imported,
//then setting the state to our initialState object,
//setting our devTool parameter to our imported composeWithDevTools(passing applyMiddleWare(...spreading the middleware in))
export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
