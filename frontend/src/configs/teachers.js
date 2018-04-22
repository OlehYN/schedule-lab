export default {
    columns: [
        {
            title: "Ім'я",
            dataIndex: "teacher",
            key: "teacher"
        }
    ],

    payloadTransform: (payload) => {
        return payload.map((teacherName) => ({teacher: teacherName}));
    },
    
    sendRequest: (props, state) => {
        props.fetchFilterTeachersLoad(state.selectedSubjects, state.selectedTeachers);
    },

    requiredSelects: ['teachers', 'subjects'],

    storageField: 'teachersFilter'
};