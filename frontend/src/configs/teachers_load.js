import _ from 'lodash';

import days from './../constants/days';
import hours from './../constants/hours';

/*

 {
    "room": {
      "building": "3",
      "number": "409"
    },
    "schedule": [
      {
        "day": 3,
        "hour": 2,
        "weeks": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ]
      }
    ]
  }

 */

/*

[
  {
    "teacher": "cт.викл. В.О. Лебідь",
    "schedule": [
      {
        "day": "0",
        "subjects": [
          {
            "day": 0,
            "hour": 3,
            "weeks": [
              4,
              9,
              14
            ],
            "classroom": {
              "building": "10",
              "number": "4",
              "equipment": [
                "projector",
                "computers"
              ],
              "seats_range": {
                "from": 10,
                "to": 15
              }
            },
            "subject": "Теорія ймовірностей",
            "group": [
              2
            ]
          }
        ]
      },
      {
        "day": "1",
        "subjects": []
      },
      {
        "day": "2",
        "subjects": []
      },
      {
        "day": "3",
        "subjects": []
      },
      {
        "day": "4",
        "subjects": []
      },
      {
        "day": "5",
        "subjects": []
      }
    ]
  }
]

 */
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
        const mappedPayload = payload.map(({teacher, schedule}) =>
            schedule
                .filter(({subjects}) => subjects.length)
                .map(({day, subjects}) => subjects.map((subject) => ({day, teacher, ...subject})))
        );

        const data = _.flatten(_.flatten(mappedPayload))
            .map((value, index) => ({...value, key: index}))
            .sort(({day: dayA}, {day: dayB}) => dayA - dayB)
            .map((value) => Object.assign(value, {
                day: !_.isNumber(value.day) || days[value.day],
                hour: !_.isNumber(value.hour) || hours[value.hour],
                weeks: !_.isArray(value.weeks) || value.weeks.join(',')
            }));

        const transformedData = _.uniq(data.map(({day}) => day))
            .map((groupDay) => ({key: groupDay, schedule: data.filter(({day}) => day === groupDay)}));

        return transformedData;
    },

    sendRequest: (props, state) => {
        props.fetchTeachersLoad(state.selectedTeachers, state.selectedWeeks);
    },

    requiredSelects: ['teachers', 'weeks'],

    storageField: 'teachersLoad',
    type: 'tabs'
};