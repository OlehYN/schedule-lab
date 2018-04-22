// vendors
import _ from 'lodash';
import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

// antd
import {Upload, message, Icon} from 'antd';
import {Layout, Menu, Avatar, Select, Table, Button} from "antd";

// redux
import {increment, decrement} from "./redux/actions/counter";
import {fetchClassrooms} from "./redux/actions/classrooms";
import {fetchTeachers, fetchTeachersLoad, fetchFilterTeachersLoad} from "./redux/actions/teachers";
import {fetchSubjects} from './redux/actions/subjects';

import days from './constants/days';
import hours from './constants/hours';
import weeks from './constants/weeks';

import queriesConfig from './configs';

// styles
import "./App.css";

// antd
const {Header, Footer, Sider, Content} = Layout;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;

class App extends Component {
    // добавлять дефолтный стейт в конструкторе
    // также можно байндить методы явно, чтобы не юзать в рендере {() =>}
    constructor(props) {
        super(props);
        this.state = {
            selectedClassrooms: [],
            selectedTeachers: [],
            selectedSubjects: [],
            selectedDays: [],
            selectedWeeks: [],
            selectedHours: [],

            key: 'teachersLoad',

            ...(Object.assign({},
                    ..._.toPairs(queriesConfig)
                        .filter(([fieldName]) => fieldName === 'storageField')
                        .map(([name, storageField]) => ({[storageField]: []}))
                )
            )
        };

        this.props.fetchClassrooms();
        this.props.fetchTeachers();
        this.props.fetchSubjects();
    }

    componentWillReceiveProps(nextProps) {
        // TODO do smth shitty
    }

    onSelectChange = (name, value) => {
        this.setState({[name]: value});
    };

    _sendRequest() {
        queriesConfig[this.state.key].sendRequest(this.props, this.state);
    }

    menuItemChange({key}) {
        this.setState({key, query: {type: null, data: []}});
    }

    render() {

        const uploadConfig = {
            name: 'file',
            action: '//localhost:5000/parse/schedule',
            showUploadList: false,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        const {payloadTransform, columns} = queriesConfig[this.state.key];

        const classrooms = this.props.classrooms
            .map(({building, number}) => <Option key={`${building}-${number}`}>{building}-{number}</Option>);

        const teachers = this.props.teachers
            .map((name) => <Option key={name}>{name}</Option>);

        const subjects = this.props.subjects
            .map((name) => <Option key={name}>{name}</Option>);

        const daysOptions = _.entries(days).map(([key, value]) => <Option key={key}>{value}</Option>);
        const hoursOptions = _.entries(hours).map(([key, value]) => <Option key={key}>{value}</Option>);
        const weeksOptions = weeks.map((value) => <Option key={value}>{value}</Option>);

        const selectedTeachers = this.state.selectedTeachers.join(',');
        const selectedSubjects = this.state.selectedSubjects.join(',');

        const params = [{value: selectedTeachers, name: 'teacher'}, {value: selectedSubjects, name: 'subject'}]
            .filter(({value}) => value)
            .map(({name, value}) => `${name}=${value}`)
            .join('&');
        return (
            <Layout className="layout">
                <Header className="header">
                    <Avatar size="large" icon="calendar"/>
                    <div className="header__title">EPIC SCHEDULER</div>
                    <div style={{marginLeft: 'auto', marginRight: 0}}>
                        <Upload {...uploadConfig}>
                            <Button>
                                <Icon type="upload"/> Додати розклад
                            </Button>
                        </Upload>
                        <a href={`http://localhost:9100/reports/classrooms/load?${params}`}>
                            <Button href={`http://localhost:9100/reports/classrooms/load?${params}`}
                                    style={{marginLeft: 10}} type="primary" icon="download">Excel</Button>
                        </a>
                    </div>
                </Header>
                <Layout>
                    <Sider className="sider" width={{widht: 256}}>
                        <Menu
                            onClick={this.menuItemChange.bind(this)}
                            style={{width: 256}}
                            defaultSelectedKeys={["1"]}
                            defaultOpenKeys={["sub1"]}
                            mode="inline"
                        >
                            <MenuItemGroup key="g1" title="Меню">
                                <Menu.Item key="teachersFilter">Викладачі</Menu.Item>
                                <Menu.Item key="teachersLoad">Навантаження викладачів</Menu.Item>
                            </MenuItemGroup>
                        </Menu>
                    </Sider>
                    <Content className="content">
                        <div className="content__select">
                            <Select
                                mode="multiple"
                                style={{width: "100%", paddingTop: '10px'}}
                                placeholder="Виберіть аудиторію"
                                defaultValue={this.state.selectedClassrooms}
                                disabled={!queriesConfig[this.state.key].requiredSelects.includes('classrooms')}
                                onChange={this.onSelectChange.bind(this, 'selectedClassrooms')}
                            >
                                {classrooms}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "49.5%", paddingTop: '10px', marginRight: '0.5%'}}
                                placeholder="Виберіть предмет"
                                disabled={!queriesConfig[this.state.key].requiredSelects.includes('subjects')}
                                defaultValue={this.state.selectedSubjects}
                                onChange={this.onSelectChange.bind(this, 'selectedSubjects')}
                            >
                                {subjects}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "49.5%", paddingTop: '10px', marginLeft: '0.5%'}}
                                placeholder="Виберіть викладача"
                                disabled={!queriesConfig[this.state.key].requiredSelects.includes('teachers')}
                                defaultValue={this.state.selectedTeachers}
                                onChange={this.onSelectChange.bind(this, 'selectedTeachers')}
                            >
                                {teachers}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "33%", paddingTop: '10px'}}
                                placeholder="Виберіть день"
                                disabled={!queriesConfig[this.state.key].requiredSelects.includes('days')}
                                defaultValue={this.state.selectedDays}
                                onChange={this.onSelectChange.bind(this, 'selectedDays')}
                            >
                                {daysOptions}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "33%", 'marginLeft': "0.5%", 'marginRight': "0.5%", paddingTop: '10px'}}
                                placeholder="Виберіть годину"
                                disabled={!queriesConfig[this.state.key].requiredSelects.includes('hours')}
                                defaultValue={this.state.selectedHours}
                                onChange={this.onSelectChange.bind(this, 'selectedHours')}
                            >
                                {hoursOptions}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "33%", paddingTop: '10px'}}
                                placeholder="Виберіть тиждень"
                                disabled={!queriesConfig[this.state.key].requiredSelects.includes('weeks')}
                                defaultValue={this.state.selectedWeeks}
                                onChange={this.onSelectChange.bind(this, 'selectedWeeks')}
                            >
                                {weeksOptions}
                            </Select>

                            <div style={{margin: '0 auto', textAlign: 'center', paddingTop: '10px'}}>
                                <Button
                                    type="primary"
                                    onClick={this._sendRequest.bind(this)}
                                >
                                    Запустити
                                </Button>
                            </div>

                            <Table
                                className="content__table"
                                columns={columns}
                                pagination={{pageSize: 10}}
                                dataSource={this.props[this.state.key] ? payloadTransform(this.props[this.state.key]) : []}
                            />
                        </div>
                    </Content>
                </Layout>
                <Footer className="footer">Mogilyanka ®</Footer>
            </Layout>
        );
    }
}

// Вытягиваем кусок состояния redux в props нашего компонета
const mapStateToProps = state => ({
    count: state.counter.count,
    classrooms: state.classroom.classrooms,
    teachers: state.teacher.teachers,
    subjects: state.subject.subjects,

    teachersLoad: state.teacher.teachersLoad,
    teachersFilter: state.teacher.teachersFilter
});

//TODO Передаем экшены, чтобы они были доступны без доп. оберток и связаны со store
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            increment,
            decrement,
            fetchClassrooms,
            fetchTeachers,
            fetchSubjects,
            fetchTeachersLoad,
            fetchFilterTeachersLoad
        },
        dispatch
    );

// connect им компонент к redux
export default connect(mapStateToProps, mapDispatchToProps)(App);

App.defaultProps = {
    classrooms: [],
    teachers: [],
    subjects: [],

    ...(Object.assign({},
            ..._.toPairs(queriesConfig)
                .filter(([fieldName]) => fieldName === 'storageField')
                .map(([name, storageField]) => ({[storageField]: []}))
        )
    )
};