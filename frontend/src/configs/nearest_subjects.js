import _ from 'lodash';

import humanReadable from './../utils/human_readable';

export default {
    columns: [
        {
            title: "Ім'я",
            dataIndex: "teacher",
            key: "teacher"
        },
        {
            title: "Предмет",
            dataIndex: "subject",
            key: "subject"
        },
        {
            title: "Аудиторія",
            dataIndex: "auditorium",
            key: "auditorium"
        },
        {
            title: "День",
            dataIndex: "day",
            key: "day"
        },
        {
            title: "Година",
            dataIndex: "hour",
            key: "hour"
        },
        {
            title: "Тижні",
            dataIndex: "weeks",
            key: "weeks"
        }
    ],
    payloadTransform: (payload = []) => {
        return humanReadable(payload.map((doc) => {
            const clonedDoc = _.cloneDeep(doc);
            clonedDoc['auditorium'] = (clonedDoc.classroom && clonedDoc.classroom.building && clonedDoc.classroom.number)
                ? clonedDoc.classroom.building + '-' + clonedDoc.classroom.number
                : '-';
            return clonedDoc;
        }));
    },

    sendRequest: (props, state) => {
        props.fetchNearestSubjects(state.selectedDays, state.selectedHours, state.selectedWeeks, state.selectedTeachers);
    },
    requiredSelects: ['days', 'weeks', 'hours', 'teachers'],
    storageField: 'nearestSubjects',
    type: 'table'
};