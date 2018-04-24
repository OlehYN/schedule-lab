import _ from 'lodash';

import humanReadable from "../utils/human_readable";
import transformClassroom from './../utils/transform_classroom';

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
        console.log(payload);
        const data = payload.map(({_id: {week, weekday, time, teacher}, schedule}) => ({
            key: teacher,
            schedule: schedule.map((doc) => Object.assign(doc, {hour: time, weeks: week, day: weekday, teacher}))
        }));
        const keys = _.uniq(data.map(({key}) => key));
        const preparedData = keys.map((uniqueKey) => ({
            key: uniqueKey,
            schedule: _.flatten(data.filter(({key}) => key === uniqueKey).map(({schedule}) => transformClassroom(schedule)))
        }));
        return humanReadable(preparedData);
    },

    sendRequest: (props, state) => {
        props.fetchTeacherDuplicates();
    },

    requiredSelects: [],

    storageField: 'teacherDuplicates',
    type: 'tabs'
};