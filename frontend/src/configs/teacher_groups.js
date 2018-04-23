import _ from 'lodash';

import humanReadable from './../utils/human_readable';

export default {
    columns: [
        {
            title: "Предмет",
            dataIndex: "subject",
            key: "subject"
        },
        {
            title: "Група",
            dataIndex: "group",
            key: "group"
        }
    ],

    payloadTransform: (payload = []) => {
        const pureData = payload.map(({teacher, schedule}) => ({key: teacher, schedule}));

        const keys = _.uniq(pureData.map(({key}) => key));
        const data = keys.map((dataKey) => ({key: dataKey, schedule: _.flatten(pureData.filter(({key}) => key === dataKey).map(({schedule}) => schedule))}));

        return humanReadable(data);
    },

    sendRequest: (props, state) => {
        props.fetchTeacherGroups(state.selectedTeachers);
    },

    requiredSelects: ['teachers'],
    type: 'tabs',
    storageField: 'teacherGroups'
};