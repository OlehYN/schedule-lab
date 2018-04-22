from pymongo import MongoClient, InsertOne, UpdateMany, DeleteMany, ReturnDocument
import configparser

config = configparser.ConfigParser()
config.read('config.ini')
conf = config['mongodb']

client = MongoClient(conf['host'], conf.getint('port'))
db = client[conf['db']]
schedule_coll = db['schedule']
specialties_coll = db['specialties']


def save_schedule(specialty, schedules):
    requests = []
    specialty = specialties_coll.find_one_and_update(
        specialty,
        {'$set': specialty},
        upsert=True,
        return_document=ReturnDocument.AFTER)
    requests.append(DeleteMany({'specialty': specialty['_id']}))
    for s in schedules:
        doc = s.copy()
        doc['specialty'] = specialty['_id']
        requests.append(InsertOne(doc))
    return schedule_coll.bulk_write(requests)


def remove_schedules_for(specialty):
    return schedule_coll.delete_many({'specialty': specialty['_id']})


def update_classrooms(classrooms):
    requests = []
    for c in classrooms:
        filter = {'classroom.' + k: c[k] for k in ('building', 'number')}
        update = {'$set': {'classroom.' + k: v for k, v in c.items()}}
        requests.append(UpdateMany(filter, update))
    return schedule_coll.bulk_write(requests)