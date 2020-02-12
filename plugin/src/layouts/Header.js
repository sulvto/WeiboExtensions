import React,{Component} from 'react';
import {Layout as ALayout} from 'antd'
import {Link} from 'react-router-dom';
import {Menu,Icon} from 'antd'

export default class Header extends Component {
    state = {
        current: 'home',
    }

    handleClick=(e)=>{ // 点击事件
        this.setState({current: e.key});
    }

    render() {
        return (
            <ALayout.Header>
                <div className="logo" />
                <Menu
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    onClick={this.handleClick}
                    theme="dark"
                    defaultSelectedKeys={['home']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="home">
                        <Link to="/">首页</Link>
                    </Menu.Item>
                    <Menu.Item key="myfollow">
                        <Link to="/myfollow">MyFollow</Link>
                    </Menu.Item>
                    <Menu.Item key="trend">
                        <Link to="/trend/1686546714/ItGTTsfnA">Trend</Link>
                    </Menu.Item>
                    <Menu.Item key="tasks">
                        <Link to="/tasks">Tasks</Link>
                    </Menu.Item>
                </Menu>
            </ALayout.Header>
        )
    }

}