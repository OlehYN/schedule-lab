import configparser
from schedule.server import app

config = configparser.ConfigParser()
config.read('config.ini')
conf = config['api']

app.run(conf['host'], conf.getint('port'), debug=conf.getboolean('debug'))
