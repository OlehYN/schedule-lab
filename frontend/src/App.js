// vendors
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// antd
import { Layout } from "antd";
import { Menu } from "antd";
import { Avatar } from "antd";
import { Select } from "antd";
import { Table } from "antd";

// redux
import { increment, decrement } from "./redux/actions/counter";
// import {
//     selectSubreddit,
//     fetchPostsIfNeeded,
//     invalidateSubreddit
// } from ".redux/actions/reddit";

// styles
import "./App.css";

// antd
const { Header, Footer, Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;

class App extends Component {
    render() {
        // колоноки Table
        const columns = [
            {
                title: "Name",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "Age",
                dataIndex: "age",
                key: "age"
            },
            {
                title: "Address",
                dataIndex: "address",
                key: "address"
            }
        ];

        // мок данных для таблиц
        const data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                key: i,
                name: `Edward King ${i}`,
                age: 32,
                address: `London, Park Lane no. ${i}`
            });
        }

        const children = [];
        for (let i = 10; i < 36; i++) {
            children.push(
                <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
            );
        }

        function handleChange(value) {
            console.log(`selected ${value}`);
        }
        return (
            <Layout className="layout">
                <Header className="header">
                    <Avatar size="large" icon="calendar" />
                    <div className="header__title">EPIC SCHEDULER</div>
                </Header>
                <Layout>
                    <Sider className="sider" width={{ widht: 256 }}>
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 256 }}
                            defaultSelectedKeys={["1"]}
                            defaultOpenKeys={["sub1"]}
                            mode="inline"
                        >
                            <MenuItemGroup key="g1" title="Navigation">
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
                            </MenuItemGroup>
                        </Menu>
                    </Sider>
                    <Content className="content">
                        <div className="content__title">Option Title</div>
                        <div>
                            <span>redux example</span>
                            <div>
                                <button onClick={this.props.increment}>
                                    Increment
                                </button>
                                <button onClick={this.props.decrement}>
                                    decrement
                                </button>
                            </div>
                            <p>Count: {this.props.count}</p>
                        </div>
                        <div className="content__select">
                            <div className="content__select__label">Label</div>
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                defaultValue={["a10", "c12"]}
                                onChange={handleChange}
                            >
                                {children}
                            </Select>
                            <div className="content__select__label">
                                Label 2
                            </div>
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                onChange={handleChange}
                            >
                                {children}
                            </Select>
                            <div className="content__select__label">
                                Label 3
                            </div>
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                onChange={handleChange}
                            >
                                {children}
                            </Select>
                            <Table
                                className="content__table"
                                columns={columns}
                                dataSource={data}
                            />
                        </div>
                    </Content>
                </Layout>
                <Footer className="footer">Mogilyanka ®</Footer>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    count: state.counter.count
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            increment,
            decrement
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(App);
