import React, {Component} from 'react';
import {Card, List} from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons'

import {reqTotalProducts} from '../../api'

import LinkButton from "../../components/link-button";
import {formateDate} from '../../utils/dateUtils'

const Item = List.Item

class OrderDetail extends Component {

    state = {
        list: '',   //购买商品的名字
        pay_products:[], //购买商品
    }

    //获取所有商品
    getProducts = async () =>{
        const {order} = this
        const {pay_products,list} = this.state
        const response = await reqTotalProducts()
        const result = response.data
        // console.log(result.data)
        if(result.status===0){
            // this.setState({products:result.data})
            const products = result.data
            order.goods.map(good => {
                // const pay_products = products.filter(product => product._id===good)
                // this.setState({pay_products})
                // console.log(pay_product)
                products.map(product => {
                    if(product._id===good){
                        pay_products.push(product.name)
                    }
                })
            })
            this.setState({pay_products})
        }
    }

    componentWillMount() {
        this.order = this.props.location.state
        // console.log(this.order)
    }

    componentDidMount() {
        this.getProducts()
    }

    render() {
        const {order} = this
        const {pay_products} = this.state
        console.log(pay_products)
        // console.log(list)
        // console.log(order)
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.push('/order')}>
                    <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}} />
                </LinkButton>
                <span style={{fontSize: 20}}>订单详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List  itemLayout="vertical">
                    <Item>
                        <span className='left'>订单号：</span>
                        <span>{'itcast_'+order._id}</span>
                    </Item>
                    <Item>
                        <span className='left'>用户ID：</span>
                        <span className='right'>{order._id}</span>
                    </Item>
                    <Item>
                        <span className='left'>用户名：</span>
                        <span>{order.user_name}</span>
                    </Item>
                    <Item>
                        <span className='left'>用户电话：</span>
                        <span>{order.user_phone}</span>
                    </Item>
                    <Item>
                        <span className='left'>发货地址：</span>
                        <span>{order.consignee_addr}</span>
                    </Item>
                    <Item>
                        <span className='left'>购买商品：</span>
                        <span style={{marginLeft:'-15px'}}>
                            {
                                pay_products.map(pay_product => {
                                    return (
                                        <span style={{marginLeft:'15px'}}>{pay_product}</span>
                                    )
                                })
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>是否付款：</span>
                        <span>{order.pay_status===0 ? '未付款':'已付款'}</span>
                    </Item>
                    <Item>
                        <span className='left'>是否发货：</span>
                        <span>{order.is_send===0 ? '未发货':'已发货'}</span>
                    </Item>
                    <Item>
                        <span className='left'>订单时间：</span>
                        <span>{formateDate(order.create_time)}</span>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default OrderDetail;