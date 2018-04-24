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

export function fetchFilterSubjectsRequest() {
    return {
        type: types.FETCH_FILTER_SUBJECTS_REQUEST
    };
}

export function fetchFilterSubjectsSuccess(payload) {
    return {
        type: types.FETCH_FILTER_SUBJECTS_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchFilterSubjectsError(error) {
    return {
        type: types.FETCH_FILTER_SUBJECTS_FAIL,
        payload: error,
        error: true
    };
}

export const fetchFilterSubjects = (selectedDays, selectedHours, selectedWeeks) => (dispatch) => {
    const day = selectedDays.join(',');
    const week = selectedWeeks.join(',');
    const hour = selectedHours.join(',');

    const params = [{value: day, name: 'day'}, {value: week, name: 'week'}, {value: hour, name: 'hour'}]
        .filter(({value}) => value)
        .map(({name, value}) => `${name}=${value}`)
        .join('&');

    const queryString = params ? '?' + params : '';
    return fetch("http://localhost:9100/student/subject" + queryString, {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchFilterSubjectsSuccess(json)));
};