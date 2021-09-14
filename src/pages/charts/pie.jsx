import React, { Component } from 'react'
import {
    Card,
    message
} from 'antd'
import ReactECharts from 'echarts-for-react'

import {reqTotalProducts} from '../../api'

/* 
    饼状图路由
*/
export default class Bar extends Component {

    state = {
        saleList: [],    //销量数组
        inventoryList: []   //库存数组
    }

    /* 
        返回柱状图的配置对象
    */
    getOption = () => {
        const {saleList} = this.state
        return {
            title: {
                text: '商品的销售情况',
                subtext: '参考',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '商品名称',
                    type: 'pie',
                    radius: '80%',
                    data: saleList,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    }

    getOption2 = () => {
        const {inventoryList} = this.state
        return {
            backgroundColor: '#2c343c',

            title: {
                text: '商品库存',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip: {
                trigger: 'item'
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 0.5]
                }
            },
            series: [
                {
                    name: '商品名称',
                    type: 'pie',
                    radius: '80%',
                    center: ['50%', '50%'],
                    data: inventoryList.sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'radius',
                    label: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    },
                    itemStyle: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        }
    }

    /* 
        获取所有商品
    */
    getTotalProducts = async () => {
        const response = await reqTotalProducts()
        const result = response.data
        if(result.status===0){
            const products = result.data
            let saleList = []    
            let inventoryList = []
            products.forEach(product => {
                const {name, sales, inventory} = product
                saleList.push({value: sales, name})
                inventoryList.push({value: inventory, name})
            })
            this.setState({
                saleList,
                inventoryList
            })
        }else{
            console.log(result.msg)
            message.error('图表获取失败')
        }
    }

    componentDidMount(){
        this.getTotalProducts()
    }

    render() {
        return (
            <div>
                <Card title='柱状图一'>
                    <ReactECharts option={this.getOption()} />
                </Card>
                <Card title='柱状图二'>
                    <ReactECharts option={this.getOption2()} />
                </Card>
            </div>
        )
    }
}
