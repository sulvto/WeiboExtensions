import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Divider, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { profile } from '../services/spiderApi';

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: text => <p>{text}</p>
      },
      {
        title: 'Content',
        dataIndex: 'feedContent',
        key: 'feedContent',
        render: text => <p>{text}</p>,
      },
      {
        title: 'From',
        dataIndex: 'from',
        key: 'from',
        render: text => <p>{text}</p>,
      },
      {
        title: 'Count',
        key: 'comment',
        render: (text, record) => (
          <span>
            <em>forward {record.forward}</em>
            <Divider type="vertical" />
            <em>comment {record.comment}</em>
            <Divider type="vertical" />
            <em>like {record.like}</em>
          </span>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a target="_blink" href={record.url}>查看微博内容</a>
        <Divider type="vertical" />
        <Link to={`/trend/${record.uid}/${record.rid}`}>查看趋势</Link>
        </span>
      ),
  },
  ];

  export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        var that = this;
        let uid = this.props.match.params.uid;

        profile(uid, function(result) {
            that.setState({data: result});
        });
    }

    render() {
        return(
            <Table columns={columns} dataSource={this.state.data} />
        )
    }
 };