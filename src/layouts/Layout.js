import React,{Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import {Layout as ALayout} from 'antd';
import './App.css';
import Header from './Header'
import Home from '../containers/Home'
import My from '../containers/My'
import Profile from '../containers/Profile'
import Detail from '../containers/Detail'
import Graph from '../containers/Graph'
import Follow from '../containers/Follow'
import MyFollow from '../containers/MyFollow'
import DetailTrend from '../containers/DetailTrend'
import Tasks from '../containers/Tasks'

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
                        <Route path='/detail' component={Detail} />
                        <Route path='/myfollow' component={MyFollow} />
                        <Route path='/tasks' component={Tasks} />
                        <Route path='/profile/:uid' component={Profile} />
                        <Route path='/follow/:uid/:name' component={Follow} />
                        <Route path='/graph/:uid/:name' component={Graph} />
                        <Route path='/trend/:uid/:rid' component={DetailTrend} />
                    </Switch>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </ALayout>

        )
    }
}