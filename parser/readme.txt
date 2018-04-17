- To run server call
python main.py

- Configuration in config.ini

- API:
POST /parse/schedule
POST /parse/classrooms

multipart/form-data
param: file

- Load data script
python load_data.py [schedule files folder path] [classroom file path]
(when server is up)