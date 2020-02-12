import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Divider, Avatar } from 'antd';
import { myfollow } from '../services/spiderApi';
import { Link } from 'react-router-dom';

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
        title: 'UID',
        dataIndex: 'uid',
        key: 'uid',
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
          { record.uid &&
            <span>
                <Divider type="vertical" />
                <Link to={`/follow/${record.uid}/${record.name}`}>查看关注</Link>
                <Divider type="vertical" />
                <Link to={`/profile/${record.uid}`}>查看最新微博</Link>
                <Divider type="vertical" />
                <Link to={`/graph/${record.uid}/${record.name}`}>查看关注图谱</Link>
            </span>
          }
        </span>
      ),
    },
  ];

export default class MyFollow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        var that = this;
        myfollow('1005055090093753', function(result) {
            that.setState({data: result});
        });
    }

    render() {
        return(
            <div>
                <h1>我的微博关注</h1>
                <Table columns={columns} dataSource={this.state.data} />
           </div>
        )
    }
 }
