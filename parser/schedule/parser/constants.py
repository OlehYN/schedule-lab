import re

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

semesters = [
    'осінній',
    'весняний',
    'додатковий'
]

specialty_types = [
    'Спеціальність',
    'МП'
]

faculty_prefix = 'Факультет'
year_suffix = 'р.н.'

time_re = re.compile('(\d+)[:.](\d+)\s*-\s*(\d+)[:.](\d+)')
specialty_re = re.compile('(' + '|'.join(specialty_types) + ')\s*"(.+)",\s*(\d)\s*' + year_suffix)
semester_re = re.compile('(.+)\s*(\d\d\d\d)\s*-\s*\d\d\d\d')
