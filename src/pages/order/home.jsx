import React, {Component} from 'react';

import {Button, Card, Input, message, Modal, Table} from 'antd'
import {PlusOutlined, ExclamationCircleOutlined} from '@ant-design/icons'

import LinkButton from "../../components/link-button";

import {reqOrderList, reqSearchOrder, reqDeleteOrder} from '../../api/index'
import {PAGE_SIZE} from "../../utils/constants";
import {formateDate} from '../../utils/dateUtils'

class OrderHome extends Component {

    state = {
        orders: [], //订单数据,
        total: 0,   //订单的总数量
        searchName: '',  //搜索的关键字
    }

    initColumns = () => {
        this.columns = [
            {
                title: '订单编号',
                width: 150,
                dataIndex: '_id',
                render: (_id) => 'itcast_' + _id
            },
            {
                title: '订单价格',
                dataIndex: 'order_price',
            },
            {
                title: '是否付款',
                dataIndex: 'pay_status',
                render: (pay_status) => pay_status===0 ? <span>未付款</span> : <span>已付款</span>
            },
            {
                title: '是否发货',
                dataIndex: 'is_send',
                render: (is_send) => is_send===0 ? <span>未发货</span> : <span>已发货</span>
            },
            {
                title: '下单时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '用户',
                dataIndex: 'user_name'
            },
            {
                width: 180,
                title: '操作',
                render: (order) => {
                    return (
                        <span>
                            {/* 将product对象传递给目标路由对象  */}
                            <LinkButton
                                onClick={() => this.props.history.push('/order/detail', order)}
                            >
                                详情
                            </LinkButton>
                            <LinkButton
                                onClick={() => this.props.history.push('/order/addUpdate', order)}
                            >
                                修改
                            </LinkButton>
                            <LinkButton
                                onClick={() => this.deleteOrder(order)}
                            >
                                删除
                            </LinkButton>
                        </span>
                    )
                }
            }
        ]
    }

    //获取订单列表
    getOrderList = async (pageNum) => {
        this.pageNum = pageNum  //保存pageNum，让其他方法可以看见

        const {searchName} = this.state
        let response
        //如果搜索关键字有值，说明我们要进行分页搜索
        if(searchName){
            response = await reqSearchOrder({pageNum, pageSize: PAGE_SIZE, searchName})
            console.log(response)
        }else{
            response = await reqOrderList(pageNum, PAGE_SIZE)
        }
        const result = response.data
        // console.log(result)
        if(result.status===0){
            //取出分页数据, 更新数据, 显示分页列表
            const {total, list} = result.data

            this.setState({
                total,
                orders:list
            })
        }else{

        }
    }

    deleteOrder = (order) => {
        const {_id} = order
        Modal.confirm({
            title: '删除订单',
            icon: <ExclamationCircleOutlined/>,
            content: '确定删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                const response = await reqDeleteOrder(_id)
                const result = response.data
                if (result.status === 0) {
                    message.success('删除订单成功')
                    this.getOrderList(1)
                } else {
                    message.error('删除订单失败')
                }
            },
        })
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getOrderList(1)
    }

    render() {
        const {orders, total, searchName} = this.state
        const title = (
            <span>
                <Input
                    placeholder='用户名'
                    style={{width: 200, margin: '0 10px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={()=>this.getOrderList(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/order/addUpdate')}>
                <PlusOutlined />
                添加订单
            </Button>
        )

        /*const dataSource = [
            {
                key: '1',
                orderId: '11515',
                price: 32,
                pay: false,
                deliver:false,
                time:'2021-12-03'
            },
            {
                key: '2',
                orderId: 'fafafa',
                price: 225,
                pay: false,
                deliver:false,
                time:'2015-02-15'
            },
        ];*/

        return (
            <Card title={title} extra={extra}>
                <Table
                    rowKey='_id'
                    dataSource={orders}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getOrderList,
                    }}
                />
            </Card>
        );
    }
}

export default OrderHome;