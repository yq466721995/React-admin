import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactECharts from 'echarts-for-react'

export default class Bar extends Component {

    static propTypes = {
        isVisited: PropTypes.bool.isRequired
    }

    getOption = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }]
        }
    }

    getOption2 = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        }
    }

    render() {
        const {isVisited} = this.props
        return (
            <div>
                {
                    isVisited ? (<ReactECharts option={this.getOption()} />) : (<ReactECharts option={this.getOption2()} />)
                }
                
            </div>
        )
    }
}
