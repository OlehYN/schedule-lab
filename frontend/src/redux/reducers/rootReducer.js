import { combineReducers } from "redux";
import counter from "./counter";
import example from "./example";

// import and include all your reducers
export default combineReducers({
    counter,
    example
});
