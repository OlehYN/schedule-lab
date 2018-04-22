import configparser
from schedule import server


def main():
    config = configparser.ConfigParser()
    config.read('config.ini')
    conf = config['api']

    server.run(conf['host'], conf.getint('port'), debug=conf.getboolean('debug'))


if __name__ == "__main__":
    main()

