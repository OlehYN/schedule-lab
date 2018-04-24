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
        const data = payload.map(({_id: {week, weekday, time, classroom: {building, number}}, schedule}) => ({
            key: `${building}-${number}`,
            schedule: schedule.map((doc) => Object.assign(doc, {hour: time, weeks: week, day: weekday, auditorium: `${building}-${number}`}))
        }));
        const keys = _.uniq(data.map(({key}) => key));
        const preparedData = keys.map((uniqueKey) => ({
            key: uniqueKey,
            schedule: _.flatten(data.filter(({key}) => key === uniqueKey).map(({schedule}) => schedule))
        }));
        return humanReadable(preparedData);
    },

    sendRequest: (props, state) => {
        props.fetchClassroomDuplicates();
    },

    requiredSelects: [],

    storageField: 'classroomDuplicates',
    type: 'tabs'
};