import _ from 'lodash';

export default (schedule) => {
    return schedule.map((doc) => {
        const clonedDoc = _.cloneDeep(doc);
        clonedDoc['auditorium'] = (clonedDoc.classroom && clonedDoc.classroom.building && clonedDoc.classroom.number)
            ? clonedDoc.classroom.building + '-' + clonedDoc.classroom.number
            : '-';
        return clonedDoc;
    })
};