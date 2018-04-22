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


export function fetchTeacherClassroomsRequest() {
    return {
        type: types.FETCH_TEACHER_CLASSROOMS_REQUEST
    };
}

export function fetchTeacherClassroomsSuccess(payload) {
    return {
        type: types.FETCH_TEACHER_CLASSROOMS_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchTeacherClassroomsError(error) {
    return {
        type: types.FETCH_TEACHER_CLASSROOMS_FAIL,
        payload: error,
        error: true
    };
}

export const fetchTeacherClassrooms = (teacher) => (dispatch) => {
    return fetch("http://localhost:9100/classroom/teacher?name="+teacher, {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchTeacherClassroomsSuccess(json)));
};
