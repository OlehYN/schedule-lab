import types from "../types.js";

// one actions config set
export function fetchTeachersRequest() {
    return {
        type: types.FETCH_TEACHERS_REQUEST
    };
}

export function fetchTeachersSuccess(payload) {
    return {
        type: types.FETCH_TEACHERS_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchTeachersError(error) {
    return {
        type: types.FETCH_TEACHERS_FAIL,
        payload: error,
        error: true
    };
}

export const fetchTeachers = () => (dispatch) => {
    return fetch("http://localhost:9100/teachers", {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchTeachersSuccess(json)));
};
//

export function fetchTeachersLoadRequest() {
    return {
        type: types.FETCH_FILTER_TEACHERS_REQUEST
    };
}

export function fetchTeachersLoadSuccess(payload) {
    return {
        type: types.FETCH_TEACHERS_LOAD_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchTeachersLoadError(error) {
    return {
        type: types.FETCH_TEACHERS_LOAD_FAIL,
        payload: error,
        error: true
    };
}

export const fetchTeachersLoad = (selectedTeachers, selectedWeeks) => (dispatch) => {
    const name = selectedTeachers.join(',');
    const week = selectedWeeks.join(',');
    const params = [{value: name, name: 'name'}, {value: week, name: 'week'}]
        .filter(({value}) => value)
        .map(({name, value}) => `${name}=${value}`)
        .join('&');

    const queryString = params ? '?' + params : '';
    return fetch("http://localhost:9100/teacher/load" + queryString, {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchTeachersLoadSuccess(json)));
};

export function fetchFilterTeachersRequest() {
    return {
        type: types.FETCH_FILTER_TEACHERS_REQUEST
    };
}

export function fetchFilterTeachersSuccess(payload) {
    return {
        type: types.FETCH_FILTER_TEACHERS_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchFilterTeachersError(error) {
    return {
        type: types.FETCH_FILTER_TEACHERS_FAIL,
        payload: error,
        error: true
    };
}

export const fetchFilterTeachers = (selectedSubjects, selectedTeachers) => (dispatch) => {
    const teachers = selectedTeachers.join(',');
    const subjects = selectedSubjects.join(',');

    const params = [{value: teachers, name: 'teacher'}, {value: subjects, name: 'subject'}]
        .filter(({value}) => value)
        .map(({name, value}) => `${name}=${value}`)
        .join('&');

    const queryString = params ? '?' + params : '';
    return fetch("http://localhost:9100/teachers" + queryString, {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchFilterTeachersSuccess(json)));
};

export function fetchTeacherGroupsRequest() {
    return {
        type: types.FETCH_TEACHER_GROUPS_REQUEST
    };
}

export function fetchTeacherGroupsSuccess(payload) {
    return {
        type: types.FETCH_TEACHER_GROUPS_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchTeacherGroupsError(error) {
    return {
        type: types.FETCH_TEACHER_GROUPS_FAIL,
        payload: error,
        error: true
    };
}

export const fetchTeacherGroups = (selectedTeachers) => (dispatch) => {
    const teachers = selectedTeachers.join(',');

    const params = [{value: teachers, name: 'teacher'}]
        .filter(({value}) => value)
        .map(({name, value}) => `${name}=${value}`)
        .join('&');

    const queryString = params ? '?' + params : '';

    return fetch("http://localhost:9100/teacher/group"+queryString, {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchTeacherGroupsSuccess(json)));
};

export function fetchTeacherDuplicatesRequest() {
    return {
        type: types.FETCH_TEACHER_DUPLICATES_REQUEST
    };
}

export function fetchTeacherDuplicatesSuccess(payload) {
    return {
        type: types.FETCH_TEACHER_DUPLICATES_SUCCESS,
        payload
    };
}

// сейчас не используется (пример стуктуры)
export function fetchTeacherDuplicatesError(error) {
    return {
        type: types.FETCH_TEACHER_DUPLICATES_FAIL,
        payload: error,
        error: true
    };
}

export const fetchTeacherDuplicates = () => (dispatch) => {
    return fetch("http://localhost:9100/reports/duplicates/teacher", {method: "GET"})
        .then(response => response.json())
        .then(json => dispatch(fetchTeacherDuplicatesSuccess(json)));
};