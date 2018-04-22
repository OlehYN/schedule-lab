# -*- coding: UTF-8 -*-

import pandas as pd

from .base import parse_io, parse_xls, find_row_by_prefix, fetch_fst_val
from .constants import *


schedule_header = {
    0: 'weekday',
    'Час': 'time',
    'Дисципліна': 'subject',
    'Викладач': 'teacher',
    'Група': 'group',
    'Тижні': 'weeks',
    'Аудиторія': 'classroom'
}

classroom_header = {
    'Номер': 'classroom',
    'Кількість місць': 'seats',
    'Проектор': 'projector',
    "Комп'ютерний клас": 'computers',
    'Дошка': 'blackboard'
}


def parse_schedule(io):
    xls = pd.ExcelFile(io, engine='xlrd')
    df = parse_xls(xls, schedule_header)
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
        if pd.notnull(row['weekday']): weekday = row['weekday'].strip()
        if pd.notnull(row['time']): time = row['time'].strip()
        if pd.isnull(row['subject']): continue
        subject = row['subject'].strip()
        if row['group'] != lecture:
            subj_groups.setdefault(subject, set()).add(row['group'])

        doc = {
            'weekday': days.index(weekday),
            'time': parse_time(time),
            'subject': subject,
            'teacher': row['teacher'].strip(),
            'group': row['group'],
            'weeks': parse_weeks(row['weeks']),
            'classroom': parse_classroom(row['classroom'], gym)
        }

        docs.append(doc)
    for doc in docs:
        doc['group'] = [doc['group']] if not doc['group'] == lecture else subj_groups[doc['subject']]

    specialty = parse_specialty(xls)

    return specialty, docs


def parse_specialty(xls):
    df = parse_xls(xls)
    fac_row = find_row_by_prefix(df, 'Факультет')
    faculty = fetch_fst_val(df, fac_row).strip()
    specialty_val = fetch_fst_val(df, fac_row + 1).strip()
    semester_val = fetch_fst_val(df, fac_row + 2).strip()

    specialty_m = specialty_re.search(specialty_val)
    degree = next(i for i, v in enumerate(specialty_types) if v == specialty_m.group(1))
    specialty = specialty_m.group(2).strip()
    year_of_study = int(specialty_m.group(3))

    semester_m = semester_re.search(semester_val)
    semester = next(i for i, v in enumerate(semesters) if v in semester_m.group(1))
    year = int(semester_m.group(2))
    return {
        'faculty': faculty,
        'specialty': specialty,
        'degree': degree,
        'year_of_study': year_of_study,
        'semester': semester,
        'year': year
    }


def parse_time(time_str):
    m = re.search(time_re, time_str)
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
    df = parse_io(io, classroom_header)
    df['seats'] = df['seats'].astype(str)

    docs = []
    for _, row in df.iterrows():
        doc = parse_classroom(row['classroom'])
        equipm_rows = row[['projector', 'computers', 'blackboard']]
        doc['equipment'] = list(equipm_rows[equipm_rows == 'Так'].index)
        doc.update(parse_seats(row['seats']))
        docs.append(doc)
    return docs
