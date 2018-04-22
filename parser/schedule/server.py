from flask import Flask, request, jsonify
from . import parser, repo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/parse/schedule', methods=['POST'])
def parse_schedule():
    schedule_file = request.files['file']
    if schedule_file:
        schedule = parser.parse_schedule(schedule_file)
        result = repo.save_schedule(schedule)
        return jsonify({k: v for k, v in result.bulk_api_result.items()
                        if k in ('nUpserted', 'nModified')})


@app.route('/parse/classrooms', methods=['POST'])
def parse_classrooms():
    classrooms_file = request.files['file']
    if classrooms_file:
        classrooms = parser.parse_classrooms(classrooms_file)
        result = repo.save_classrooms(classrooms)
        return jsonify({'nModified': result.modified_count})
