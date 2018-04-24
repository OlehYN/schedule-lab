import types from "../types.js";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_SUBJECTS_REQUEST:
            return state;
        case types.FETCH_SUBJECTS_SUCCESS:
            return {...state, subjects: action.payload};
        case types.FETCH_FILTER_SUBJECTS_REQUEST:
            return state;
        case types.FETCH_FILTER_SUBJECTS_SUCCESS:
            return {...state, subjectsFilter: action.payload};
        default:
            return state;
    }
};
