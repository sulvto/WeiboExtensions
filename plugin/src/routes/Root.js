import React,{Component} from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Error from '../layouts/Error'

export default class Root extends Component {
    render(){
        return (
            <Router >
                <Route path="/" component={Layout} />
            </Router>
        )
    }
}