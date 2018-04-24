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
            title: "Група",
            dataIndex: "group",
            key: "group"
        }
    ],
    payloadTransform: (payload = []) => {
        return humanReadable(payload);
    },

    sendRequest: (props, state) => {
        props.fetchFilterSubjects(state.selectedDays, state.selectedHours, state.selectedWeeks);
    },
    requiredSelects: ['days', 'weeks', 'hours'],
    storageField: 'subjectsFilter',
    type: 'table'
};