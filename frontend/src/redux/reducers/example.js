import types from "../types.js";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_REQUEST:
            return state;
        case types.FETCH_SUCCESS:
            return { ...state, posts: action.payload };
        default:
            return state;
    }
};
