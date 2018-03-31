# -*- coding: UTF-8 -*-

import pandas as pd
import re

from .base import parse_df

times = [
    ((8, 30), (9, 50)),
    ((10, 0), (11, 20)),
    ((11, 40), (13, 0)),
    ((13, 30), (14, 50)),
    ((15, 0), (16, 20)),
    ((16, 30), (17, 50)),
    ((18, 0), (19, 20))
]

days = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'П`ятниця',
    'Субота'
]


def parse_schedule(io):
    schedule_header = {
        0: 'weekday',
        'Час': 'time',
        'Дисципліна': 'subject',
        'Викладач': 'teacher',
        'Група': 'group',
        'Тижні': 'weeks',
        'Аудиторія': 'classroom'
    }
    df = parse_df(io, schedule_header)
    df = df.where(df['subject'].notnull() | df['weekday'].notnull())
    df['weeks'] = df['weeks'].astype(str)

    docs = []
    weekday, time, subj_groups = None, None, {}
    lecture = 'Лекція'
    gym = {
        'building': '3',
        'number': 'gym'
    }
    for _, row in df.iterrows():
        if pd.notnull(row['weekday']): weekday = row['weekday']
        if pd.notnull(row['time']): time = row['time']
        if pd.isnull(row['subject']): continue
        if row['group'] != lecture:
            subj_groups.setdefault(row['subject'], set()).add(row['group'])

        doc = {
            'weekday': days.index(weekday),
            'time': parse_time(time),
            'subject': row['subject'],
            'teacher': row['teacher'],
            'group': row['group'],
            'weeks': parse_weeks(row['weeks']),
            'classroom': parse_classroom(row['classroom'], gym)
        }

        docs.append(doc)
    for doc in docs:
        doc['group'] = [doc['group']] if not doc['group'] == lecture else subj_groups[doc['subject']]
    return docs


def parse_time(time_str):
    hour_re = '(\d+)[:.](\d+)'
    m = re.search(hour_re + '\s*-\s*' + hour_re, time_str)
    return times.index(((int(m.group(1)), int(m.group(2))),
                        (int(m.group(3)), int(m.group(4)))))


def parse_weeks(weeks_str):
    weeks = []
    for num_or_range in weeks_str.split(','):
        if '-' in num_or_range:
            [fr, to] = num_or_range.split('-')
            weeks.extend(list(range(int(fr.strip()), int(to.strip()) + 1)))
        elif num_or_range.strip():
            weeks.append(int(num_or_range.strip()))
    return weeks


def parse_classroom(classroom_str, empty=None):
    if pd.notnull(classroom_str):
        [building, number] = classroom_str.split('-')
        return {
            'building': building.strip(),
            'number': number.strip()
        }
    else:
        return empty


def parse_seats(seat_str):
    seats = {}
    if '-' in seat_str:
        [fr, to] = seat_str.split('-')
        seats['seats_range'] = {
            'from': int(fr.strip()),
            'to': int(to.strip())
        }
    else:
        seats['seats_num'] = int(seat_str.strip())
    return seats


def parse_classrooms(io):
    classroom_header = {
        'Номер': 'classroom',
        'Кількість місць': 'seats',
        'Проектор': 'projector',
        "Комп'ютерний клас": 'computers',
        'Дошка': 'blackboard'
    }
    df = parse_df(io, classroom_header)
    df['seats'] = df['seats'].astype(str)

    docs = []
    for _, row in df.iterrows():
        doc = parse_classroom(row['classroom'])
        equipm_rows = row[['projector', 'computers', 'blackboard']]
        doc['equipment'] = list(equipm_rows[equipm_rows == 'Так'].index)
        doc.update(parse_seats(row['seats']))
        docs.append(doc)
    return docs
