import _ from 'lodash';

import days from './../constants/days';
import hours from './../constants/hours';

export default {
    columns: [
        {
            title: "Корпус",
            dataIndex: "building",
            key: "building"
        },
        {
            title: "Аудиторія",
            dataIndex: "number",
            key: "number"
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

    payloadTransform: (payload) => {
        /*const mappedPayload = payload.map(({room, schedule}) =>
            ({
                room: room.building, number: room.number, day: schedule.day,
                hour: schedule.hour, weeks: schedule.weeks.join(',')
            }));*/
        return [];

    },

    sendRequest: (props, state) => {
        props.fetchTeacherClassrooms(state.selectedTeachers[0]);
    },

    requiredSelects: ['teachers'],

    storageField: 'teacherClassrooms'
};