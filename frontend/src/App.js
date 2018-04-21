// vendors
import _ from 'lodash';
import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

// antd
import {Layout, Menu, Avatar, Select, Table, Button} from "antd";

// redux
import {increment, decrement} from "./redux/actions/counter";
import {fetchClassrooms} from "./redux/actions/classrooms";
import {fetchTeachers, fetchTeachersLoad} from "./redux/actions/teachers";
import {fetchSubjects} from './redux/actions/subjects';

import days from './constants/days';
import hours from './constants/hours';
import weeks from './constants/weeks';

import teacherLoadConfig from './configs/teachers_load';

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
            selectedHours: [],
            selectedWeeks: []
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
        this.props.fetchTeachersLoad(this.state.selectedTeachers, this.state.selectedWeeks);
    }

    render() {
        const {payloadTransform, columns} = teacherLoadConfig;

        const classrooms = this.props.classrooms
            .map(({building, number}) => <Option key={`${building}-${number}`}>{building}-{number}</Option>);

        const teachers = this.props.teachers
            .map((name) => <Option key={name}>{name}</Option>);

        const subjects = this.props.subjects
            .map((name) => <Option key={name}>{name}</Option>);

        const daysOptions = _.entries(days).map(([key, value]) => <Option key={key}>{value}</Option>);
        const hoursOptions = _.entries(hours).map(([key, value]) => <Option key={key}>{value}</Option>);
        const weeksOptions = weeks.map((value) => <Option key={value}>{value}</Option>);

        return (
            <Layout className="layout">
                <Header className="header">
                    <Avatar size="large" icon="calendar"/>
                    <div className="header__title">EPIC SCHEDULER</div>
                </Header>
                <Layout>
                    <Sider className="sider" width={{widht: 256}}>
                        <Menu
                            onClick={this.handleClick}
                            style={{width: 256}}
                            defaultSelectedKeys={["1"]}
                            defaultOpenKeys={["sub1"]}
                            mode="inline"
                        >
                            <MenuItemGroup key="g1" title="Меню">
                                <Menu.Item key="1">Навантаження викладача</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
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
                                onChange={this.onSelectChange.bind(this, 'selectedClassrooms')}
                            >
                                {classrooms}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "49.5%", paddingTop: '10px', marginRight: '0.5%'}}
                                placeholder="Виберіть предмет"
                                defaultValue={this.state.selectedSubjects}
                                onChange={this.onSelectChange.bind(this, 'selectedSubjects')}
                            >
                                {subjects}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "49.5%", paddingTop: '10px', marginLeft: '0.5%'}}
                                placeholder="Виберіть викладача"
                                defaultValue={this.state.selectedTeachers}
                                onChange={this.onSelectChange.bind(this, 'selectedTeachers')}
                            >
                                {teachers}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "33%", paddingTop: '10px'}}
                                placeholder="Виберіть день"
                                defaultValue={this.state.selectedDays}
                                onChange={this.onSelectChange.bind(this, 'selectedDays')}
                            >
                                {daysOptions}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "33%", 'marginLeft': "0.5%", 'marginRight': "0.5%", paddingTop: '10px'}}
                                placeholder="Виберіть годину"
                                defaultValue={this.state.selectedHours}
                                onChange={this.onSelectChange.bind(this, 'selectedHours')}
                            >
                                {hoursOptions}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{width: "33%", paddingTop: '10px'}}
                                placeholder="Виберіть тиждень"
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
                                dataSource={this.props.query.data ? payloadTransform(this.props.query.data) : []}
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
    query: state.teacher.query
});

// Передаем экшены, чтобы они были доступны без доп. оберток и связаны со store
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            increment,
            decrement,
            fetchClassrooms,
            fetchTeachers,
            fetchSubjects,
            fetchTeachersLoad
        },
        dispatch
    );

// connect им компонент к redux
export default connect(mapStateToProps, mapDispatchToProps)(App);

App.defaultProps = {
    classrooms: [],
    teachers: [],
    subjects: [],
    query: {
        type: '',
        data: []
    }
};