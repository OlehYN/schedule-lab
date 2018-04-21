import types from "../types.js";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_CLASSROOMS_REQUEST:
            return state;
        case types.FETCH_CLASSROOMS_SUCCESS:
            return {...state, classrooms: action.payload};
        default:
            return state;
    }
};
