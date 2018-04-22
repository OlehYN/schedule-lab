import types from "../types.js";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_TEACHERS_LOAD_REQUEST:
            return state;
        case types.FETCH_TEACHERS_LOAD_SUCCESS:
            return {...state, teachersLoad: action.payload};
        case types.FETCH_TEACHERS_REQUEST:
            return state;
        case types.FETCH_TEACHERS_SUCCESS:
            return {...state, teachers: action.payload};
        case types.FETCH_FILTER_TEACHERS_REQUEST:
            return state;
        case types.FETCH_FILTER_TEACHERS_SUCCESS:
            return {...state, teachersFilter: action.payload};
        default:
            return state;
    }
};
