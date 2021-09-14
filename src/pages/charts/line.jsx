import React, { Component } from 'react'
import {
    Card,
    message
} from 'antd'
import ReactECharts from 'echarts-for-react'

import {reqTotalProducts} from '../../api'

/* 
    折线图路由
*/
export default class Bar extends Component {

    state = {
        productNames: [],    //所有商品名称
        Sales: [],   //销量
        Inventory: [],  //库存
    }

    /* 
        返回柱状图的配置对象
    */
    getOption = () => {
        const {productNames, Sales, Inventory} = this.state
        return {
            title: {
                text: '商品销售情况',
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                type: 'category',
                data: productNames,
                axisLabel: {
                    interval: 0,
                    rotate: 45  //代表逆时针旋转45度
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name:'销量',
                data: Sales,
                type: 'line',
            },{
                name:'库存',
                data: Inventory,
                type: 'line',
            }]
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
            let productNames = []
            let Sales = []
            let Inventory = []
            products.forEach(product => {
                const {name, sales, inventory} = product
                productNames.push(name)
                Sales.push(sales)
                Inventory.push(inventory)
            })
            this.setState({
                productNames,
                Sales,
                Inventory
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
            </div>
        )
    }
}
