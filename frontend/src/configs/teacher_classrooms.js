import _ from 'lodash';

import humanReadable from './../utils/human_readable';

export default {
    columns: [
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
        },
        {
            title: "Викладач",
            dataIndex: "teacher",
            key: "teacher"
        },
        {
            title: "Предмет",
            dataIndex: "subject",
            key: "subject"
        }
    ],

    payloadTransform: (payload = []) => {
        const pureData = payload.filter(({room}) => room)
            .map(({room: {building, number}, schedule}) => ({key: `${building}-${number}`, schedule}));

        const keys = _.uniq(pureData.map(({key}) => key)).sort((a, b) => a.localeCompare(b));
        const data = keys.map((dataKey) => ({key: dataKey, schedule: _.flatten(pureData.filter(({key}) => key === dataKey).map(({schedule}) => schedule))}));

        return humanReadable(data);
    },

    sendRequest: (props, state) => {
        props.fetchTeacherClassrooms(state.selectedTeachers);
    },

    requiredSelects: ['teachers'],
    type: 'tabs',
    storageField: 'teacherClassrooms'
};