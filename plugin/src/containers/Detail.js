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
        </span>
      ),
  },
  ];

  export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        var that = this;
        profile('2619074643', function(result) {
            console.log('target', result);
            that.setState({data: result});
        });
    }

    render() {
        return(
            <Table columns={columns} dataSource={this.state.data} />
        )
    }
 };