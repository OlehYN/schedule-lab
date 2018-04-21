import {combineReducers} from "redux";
import counter from "./counter";
import classroom from "./classrooms";
import teacher from './teachers';
import subject from './subjects';

// import and include all your reducers
export default combineReducers({
    classroom, counter, teacher, subject
});
