import configparser
import sys
from os import listdir
from os.path import join
from requests import post


def main():
    config = configparser.ConfigParser()
    config.read('config.ini')
    conf = config['api']
    baseurl = "http://{0}:{1}".format(conf['host'], conf['port'])

    sch_path = sys.argv[1] if len(sys.argv) > 1 else "schedule"
    cl_path = sys.argv[2] if len(sys.argv) > 2 else "classrooms.xlsx"

    sch_files = [xls for xls in [join(sch_path, file) for file in listdir(sch_path)]
                 if xls.endswith((".xls", ".xlsx"))]
    for sch_file in sch_files:
        post_file(baseurl + '/parse/schedule', sch_file)

    post_file(baseurl + '/parse/classrooms', cl_path)


def post_file(url, path, param='file'):
    with open(path, 'rb') as file:
        resp = post(url,  files={param: file})
        if resp.ok:
            print('{}[{}]: {}'.format(url, path, resp.json()))


if __name__ == "__main__":
    main()
