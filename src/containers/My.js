import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Divider, Avatar } from 'antd';

const columns = [
    {
        title: 'Pic',
        key: 'pic',
        render: (text, record) => (
            <Avatar src={record.pic} />
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <p>{text}</p>,
      },
      {
        title: 'From',
        dataIndex: 'from',
        key: 'from',
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

export default class My extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    key: '1',
                    name: 'John Brown'
                  },
                  {
                    key: '2',
                    name: 'Jim Green'
                  },
                  {
                    key: '3',
                    name: 'Joe Black'
                  }
               ]
        };
    }

    componentDidMount() {
    }

    render() {
        return(
            <div>My</div>
        )
    }
 }
