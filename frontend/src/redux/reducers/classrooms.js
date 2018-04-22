import types from "../types.js";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_CLASSROOMS_REQUEST:
            return state;
        case types.FETCH_CLASSROOMS_SUCCESS:
            return {...state, classrooms: action.payload};
        case types.FETCH_TEACHER_CLASSROOMS_REQUEST:
            return state;
        case types.FETCH_TEACHER_CLASSROOMS_SUCCESS:
            return {...state, teacherClassrooms: action.payload};
        default:
            return state;
    }
};
