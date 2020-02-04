import React,{Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import {Layout as ALayout} from 'antd';
import Header from './Header'
import Home from '../containers/Home'
import My from '../containers/My'
import Target from '../containers/Target'
import Graph from '../containers/Graph'
import Follow from '../containers/Follow'
import MyFollow from '../containers/MyFollow'

const { Footer, Sider, Content } = ALayout;

export default class Layout extends Component {
    render(){
        return (
            <ALayout className="layout">
            <Header/>
            <Content style={{ padding: '0 50px' }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Switch>
                        <Route path='/' component={Home} exact />
                        <Route path='/my' component={My} />
                        <Route path='/target' component={Target} />
                        <Route path='/myfollow' component={MyFollow} />
                        <Route path='/follow/:uid/:name' component={Follow} />
                        <Route path='/graph/:uid/:name' component={Graph} />
                    </Switch>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </ALayout>

        )
    }
}