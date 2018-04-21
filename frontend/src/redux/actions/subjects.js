import types from "../types.js";

export function fetchSubjectsRequest() {
    return {
        type: types.FETCH_SUBJECTS_REQUEST
    };
}

export function fetchSubjectsSuccess(payload) {
    return {
        type: types.FETCH_SUBJECTS_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchSubjectsError(error) {
    return {
        type: types.FETCH_SUBJECTS_FAIL,
        payload: error,
        error: true
    };
}

export const fetchSubjects = () => (dispatch) => {
    return fetch("http://localhost:9100/subjects", {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchSubjectsSuccess(json)));
};
