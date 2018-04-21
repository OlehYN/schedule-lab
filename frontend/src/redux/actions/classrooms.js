import types from "../types.js";

export function fetchClassroomsRequest() {
    return {
        type: types.FETCH_CLASSROOMS_REQUEST
    };
}

export function fetchClassroomsSuccess(payload) {
    return {
        type: types.FETCH_CLASSROOMS_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchClassroomsError(error) {
    return {
        type: types.FETCH_CLASSROOMS_FAIL,
        payload: error,
        error: true
    };
}

export const fetchClassrooms = () => (dispatch) => {
    return fetch("http://localhost:9100/classrooms", {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchClassroomsSuccess(json)));
};
