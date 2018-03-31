from pymongo import MongoClient, ReplaceOne, UpdateMany
import configparser

config = configparser.ConfigParser()
config.read('config.ini')
conf = config['mongodb']

client = MongoClient(conf['host'], conf.getint('port'))
db = client[conf['db']]


def save_schedule(schedule):
    requests = []
    for s in schedule:
        filter = {k: s[k] for k in ('weekday', 'time')}
        filter.update({'weeks': {"$in": s['weeks']}})
        filter.update({'classroom.' + k: s['classroom'][k] for k in ('building', 'number')})

        requests.append(ReplaceOne(filter, s, upsert=True))
    result = db['schedule'].bulk_write(requests)
    return result


def save_classrooms(classrooms):
    requests = []
    for c in classrooms:
        filter = {'classroom.' + k: c[k] for k in ('building', 'number')}
        update = {'$set': {'classroom.' + k: v for k, v in c.items()}}
        requests.append(UpdateMany(filter, update))
    result = db['schedule'].bulk_write(requests)
    return result
