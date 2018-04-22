from flask import Flask, request, jsonify
from flask_cors import CORS
from . import parser, repo

app = Flask(__name__)
CORS(app)


@app.route('/parse/schedule', methods=['POST'])
def parse_schedule():
    schedule_file = request.files['file']
    if schedule_file:
        specialty, schedules = parser.parse_schedule(schedule_file)
        result = repo.save_schedule(specialty, schedules)
        return jsonify({k: v for k, v in result.bulk_api_result.items()
                        if k in ('nInserted', 'nRemoved')})


@app.route('/parse/classrooms', methods=['POST'])
def parse_classrooms():
    classrooms_file = request.files['file']
    if classrooms_file:
        classrooms = parser.parse_classrooms(classrooms_file)
        result = repo.update_classrooms(classrooms)
        return jsonify({'nModified': result.modified_count})
