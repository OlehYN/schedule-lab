export default {
    columns: [
        {
            title: "Ім'я",
            dataIndex: "teacher",
            key: "teacher"
        }
    ],
    payloadTransform: (payload = []) => {
        return payload.map((teacherName) => ({teacher: teacherName}));
    },

    sendRequest: (props, state) => {
        props.fetchFilterTeachers(state.selectedSubjects, state.selectedTeachers);
    },
    requiredSelects: ['teachers', 'subjects'],
    storageField: 'teachersFilter',
    type: 'table'
};