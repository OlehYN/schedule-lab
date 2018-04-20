import types from "../types";

const initialState = { count: 0 };

export default (state = initialState, action) => {
    switch (action.type) {
        case types.INCREMENT:
            return {
                ...state,
                count: state.count + 1
            };

        case types.DECREMENT:
            return {
                ...state,
                count: state.count - 1
            };

        default:
            return state;
    }
};
