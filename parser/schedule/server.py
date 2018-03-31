from flask import Flask, Response, request
from . import parser, repo

app = Flask(__name__)


@app.route('/parse/schedule', methods=['POST'])
def parse_schedule():
    schedule_file = request.files['file']
    if schedule_file:
        schedule = parser.parse_schedule(schedule_file)
        result = repo.save_schedule(schedule)
        return Response("inserted {} schedule documents (modified {})"
                        .format(result.upserted_count, result.modified_count))


@app.route('/parse/classrooms', methods=['POST'])
def parse_classrooms():
    classrooms_file = request.files['file']
    if classrooms_file:
        classrooms = parser.parse_classrooms(classrooms_file)
        result = repo.save_classrooms(classrooms)
        return Response("updated {} schedule documents with {} classroom documents"
                        .format(result.modified_count, len(classrooms)))
