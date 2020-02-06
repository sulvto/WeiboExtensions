import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Divider, Avatar } from 'antd';
import { list } from '../services/tasksApi';

const columns = [
    {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        render: text => <p>{text}</p>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <p>{text}</p>,
      },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a target="_blink" href={record.url}>查看主页</a>
        </span>
      ),
    },
  ];

  export default class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        list((data) => {
            console.log(data);
            this.setState({data});
        });
    }

    render() {
        return(
            <Table columns={columns} dataSource={this.state.data} />
        )
    }
 };