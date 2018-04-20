import types from "../types.js";

export function fetchPostsRequest() {
    return {
        type: types.FETCH_REQUEST
    };
}

export function fetchPostsSuccess(payload) {
    return {
        type: types.FETCH_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchPostsError(error) {
    return {
        type: types.FETCH_FAIL,
        payload: error,
        error: true
    };
}

export const fetchPostsWithRedux = () => (dispatch, getState) => {
    return fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "GET"
    })
        .then(response => response.json())
        .then(json => dispatch(fetchPostsSuccess(json)));
};
