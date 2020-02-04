import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { follow } from '../services/spiderApi';

export default class Graph extends PureComponent {
    state = {
        uid: null,
        option: {},
        fetchLevelCount: 0,
        maxFetchLevel: 3,
        categories: [{
            "name": "一度"
        }, {
            "name": "二度"
        }, {
            "name": "三度"
        }, {
            "name": "四度"
        }],
        nodes: [],
        links: [],
        fetching: false
    };

    getOption = (categories, nodes,links) => {

        // dataSource.nodes[0].x = myChart.getWidth() / 2;
        // dataSource.nodes[0].y = myChart.getHeight() / 2;
    console.log(this);
        return {
        legend: {
            data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
        },
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
                show: true,
                normal: {
                    position: 'right',
                    formatter: '{b}'
                }
            },
            draggable: true,
            focusNodeAdjacency: true,
            force: {
            // initLayout: 'circular'
            repulsion: 500,
            edgeLength: 250,
            //   repulsion: 20,
            //   gravity: 0.2
            },
            edgeSymbol: ['', 'arrow'],
            data: nodes.map((node, idx) => {
                node.id = node.uid;
                node.symbolSize = 40;
                node.label = {
                    show: node.symbolSize > 30
                };
                if (node.pic && node.pic.length > 0) {
                    node.symbol = `image://${node.pic}`;
                }
                return node;
            }),
            categories: categories,
            edges: links,
        }]
        };
    };

    buildCoreNodeData() {
        this.setState({nodes: [{
            uid: this.state.uid,
            name: this.state.name,
            category: 0
        }]});
        this.updateGraph();
    }

    appendNodes(sourceUid, category, followResult) {
        let newLinks = followResult.map((item) =>  ({
                source: sourceUid,
                target: item.uid
            }))
            .filter((link) => this.linkIsNotExist(link));

        let newNodes = followResult
            .filter((result) => result.uid && result.uid.length > 0 )
            .map((item) => ({
                    uid: item.uid,
                    name: item.name,
                    pic: item.pic,
                    category
                }))
            .filter((node) => this.nodeIsNotExist(node));
            this.setState({nodes: this.state.nodes.concat(newNodes), links: this.state.links.concat(newLinks)}, () => this.updateGraph());
    }

    linkIsNotExist(link) {
        return this.state.links.findIndex((item) => link.source === item.source && link.target === item.target) === -1;
    }

    nodeIsNotExist(node) {
        return this.state.nodes.findIndex((item) => node.uid === item.uid ) === -1;
    }

    incFetchLevelCount() {
        let inc = this.state.fetchLevelCount;
        this.setState({fetchLevelCount: ++inc});
        return inc;
    }

    doFetchFollow(uid, callback) {
        setTimeout(() => {
            if (this.state.fetching) {
                setTimeout(()=> this.doFetchFollow(uid, callback), 1000 );
            } else {
                this.setState({fetching: true});
                follow(uid, (data)=> {
                    this.setState({fetching: false});
                    callback(data);
                });
            }
        }, 100)
    }

    fetchDataSource(uid) {
        let that = this;
        this.doFetchFollow(uid, (results) => {
            if (that.state.fetchLevelCount < that.state.maxFetchLevel) {
                this.incFetchLevelCount();
                results
                .filter((result) => result.uid )
                .filter((result) => that.nodeIsNotExist(result))
                .forEach((result) => that.fetchDataSource(result.uid))
            }
            that.appendNodes(uid, that.state.fetchLevelCount, results);
        });
    }

    updateGraph() {
        this.setState({
            option: this.getOption(this.state.categories, this.state.nodes, this.state.links)
        }, () => this.printDataSource());
    }

    printDataSource() {
        console.info('nodes', this.state.nodes, 'links', this.state.links);
    }

    componentWillMount() {
        let uid = this.props.match.params.uid;
        let name = this.props.match.params.name;
        this.setState({uid, name});
    };

    componentDidMount() {
    this.buildCoreNodeData();
    this.incFetchLevelCount();
    this.fetchDataSource(this.state.uid);
    };

  render() {
    return (
      <div className='examples'>
        <div className='parent'>
        <label> {this.state.name}的关注图谱 </label>
          <ReactEcharts
            option={this.state.option}
            style={{height: '700px', width: '100%'}}
            className='react_for_echarts' />
        </div>
    </div>
    );
  }
}
