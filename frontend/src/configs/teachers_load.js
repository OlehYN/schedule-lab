import _ from 'lodash';

import days from './../constants/days';
import hours from './../constants/hours';

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
        const mappedPayload = payload.map(({teacher, schedule}) =>
            schedule
                .filter(({subjects}) => subjects.length)
                .map(({day, subjects}) => subjects.map((subject) => ({day, teacher, ...subject})))
        );

        return _.flatten(_.flatten(mappedPayload))
            .map((value, index) => ({...value, key: index}))
            .map((value) => Object.assign(value, {
                day: !_.isNumber(value.day) || days[value.day],
                hour: !_.isNumber(value.hour) || hours[value.hour],
                weeks: !_.isArray(value.weeks) || value.weeks.join(',')
            }));
    },

    sendRequest: (props, state) => {
        props.fetchTeachersLoad(state.selectedTeachers, state.selectedWeeks);
    },

    requiredSelects: ['teachers', 'weeks'],

    storageField: 'teachersLoad'
};