import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Divider, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { follow } from '../services/spiderApi';

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

export default class Follow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            uid: -1,
            name: '*'
        };
    }

    reset(uid, name) {
        this.setState({uid, name});
        var that = this;
        follow(uid, function(result) {
            that.setState({data: result});
        });
    }

    componentDidMount() {
        let uid = this.props.match.params.uid;
        let name = this.props.match.params.name;
        this.reset(uid, name);
    }

    render() {
        return(
            <div>
                <h1>{this.state.name}的微博关注</h1>
                <Table columns={columns} dataSource={this.state.data} />
           </div>
        )
    }
 }
