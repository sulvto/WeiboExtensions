import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Divider, Avatar } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { detailTrend } from '../services/spiderApi';
import Item from 'antd/lib/list/Item';

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

export default class DetailTrend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {
                title: {
                    text:'Hello Echarts-for-react.',
                  },
                  tooltip: {
                    trigger: 'axis'
                  }
            }
        };
        this.data = [];
        this.categorys = [];
        this.forwards = [];
        this.comments = [];
        this.likes = [];
    }

    reload() {
        let result = [];
        for (const iterator in this.data) {
            if (iterator) {
                result[result.length] = {
                    category: new Date(Number.parseInt(iterator)).toLocaleString().replace(/^\D*/,''),
                    forward: this.data[iterator].forward,
                    comment: this.data[iterator].comment,
                    like: this.data[iterator].like
                }
            }
        }

        this.categorys = result.map(item => item.category);
        this.forwards = result.map(item => item.forward);
        this.comments = result.map(item => item.comment);
        this.likes = result.map(item => item.like);
        this.setState({option: this.getOption()});
    }

    fetchNewDate() {

        detailTrend(this.uid, this.rid, (data) => {
            this.data = data;
            this.reload();
        });
    }

    getOption() {
        return {
            title: {
              text:'Hello Echarts-for-react.',
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['转发', '评论', '点赞']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
              show: true,
              feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: this.categorys
              }
            ],
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '转发',
                    type: 'line',
                    stack: '总量',
                    data: this.forwards
                },
                {
                    name: '评论',
                    type: 'line',
                    stack: '总量',
                    data: this.comments
                },
                {
                    name: '点赞',
                    type: 'line',
                    stack: '总量',
                    data: this.likes
                }
            ]
        }
    }

    componentDidMount() {
        if (this.timeTicket) {
          clearInterval(this.timeTicket);
        }
        this.uid = this.props.match.params.uid;
        this.rid = this.props.match.params.rid;
        this.fetchNewDate();
        this.timeTicket = setInterval(() => this.fetchNewDate(), 1000 * 60 * 1);
      }
    
      componentWillUnmount() {
        if (this.timeTicket) {
          clearInterval(this.timeTicket);
        }
      }

    render() {
        return(
            <div>
                <h1>Trend</h1>
                <ReactEcharts option={this.state.option} />
            </div>
        )
    }
 }
