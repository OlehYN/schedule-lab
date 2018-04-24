import humanReadable from './../utils/human_readable';

export default {
    columns: [
        {
            title: "Аудиторія",
            dataIndex: "auditorium",
            key: "auditorium"
        },
        {
            title: "Обладнання",
            dataIndex: "equipment",
            key: "equipment"
        }
    ],
    payloadTransform: (payload = []) => {
        return humanReadable(payload.map(({classroom: {building, number}, equipment}) => ({
            auditorium: `${building}-${number}`,
            equipment: equipment
        })));
    },

    sendRequest: (props, state) => {
        props.fetchEmptyClassrooms(state.selectedDays, state.selectedHours, state.selectedWeeks);
    },
    requiredSelects: ['days', 'weeks', 'hours'],
    storageField: 'emptyClassrooms',
    type: 'table'
};