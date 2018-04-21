import types from "../types.js";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_TEACHERS_LOAD_REQUEST:
            return state;
        case types.FETCH_TEACHERS_LOAD_SUCCESS:
            return {...state, query: {data: action.payload, type: action.type}};
        case types.FETCH_TEACHERS_REQUEST:
            return state;
        case types.FETCH_TEACHERS_SUCCESS:
            return {...state, teachers: action.payload};
        default:
            return state;
    }
};
