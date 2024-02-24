import { combineReducers } from "redux";
import authorityReducer from "./reducers/authority";

const rootReducer = combineReducers({
  authority: authorityReducer,
});

export default rootReducer;
