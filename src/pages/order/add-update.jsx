import React, {Component} from 'react';
import {Card, Form, Input, Button, Radio, TreeSelect, message} from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from "../../components/link-button";

import {reqTotalProducts, reqAddOrder, reqUpdateOrder} from '../../api/index'

const Item = Form.Item
const { TreeNode } = TreeSelect;

class OrderAddUpdate extends Component {

    formRef = React.createRef()

    state = {
        products:[], //所有商品
        goods:[],   //购买商品
        totalPrice: 0, //总价格
    }

    getProducts = async () =>{
        const response = await reqTotalProducts()
        const result = response.data
        // console.log(result.data)
        if(result.status===0){
            this.setState({products:result.data})
        }

    }

    onChange = goods => {
        let {totalPrice,products} = this.state
        // console.log(value);
        this.setState({ goods });
        if(goods.length>0) {
            goods.forEach(good => {
                const pay_products = products.filter(product => product._id===good)
                pay_products.map(product => {
                    return totalPrice += product.price
                })
            })
        }
        this.setState({totalPrice})
        // console.log(totalPrice)
    };

    //验证手机号
    validatePhone = (rule, value, callback) => {
        var phone = value.replace(/\s/g, '')    //去除空格
        //检验手机号，号段主要有(不包括上网卡)：130~139、150~153、155~159、180~189、170~171、176~178。14号段上网卡专属号段
        let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
        if(value.length === 0){
            return Promise.resolve()
        }else{
            if(!regs.test(phone)){
                return Promise.reject('手机号输入不合法')
            }else{
                return Promise.resolve()
            }
        }
    }

    submit = () => {
        const form = this.formRef.current
        form.validateFields().then(async value => {
            // console.log(value)
            const {user_name, user_phone, goods, consignee_addr, pay_status, is_send} = value
            const {totalPrice} = this.state
            const order = {user_name, user_phone, goods, consignee_addr, pay_status, is_send, order_price:totalPrice}
            // console.log(goods)
            if(this.state.goods.length>0){
                //如果是更新，需要添加_id
                let response
                let result
                if(this.isUpdate){
                    order._id = this.order._id
                    response = await reqUpdateOrder(order)
                    result = response.data
                    if(result.status===0){
                        message.success('订单修改成功')
                        this.props.history.goBack()
                    }else{
                        message.error('订单添加失败')
                    }
                }else{
                    const response = await reqAddOrder(order)
                    const result = response.data
                    if(result.status===0){
                        message.success('订单添加成功')
                        this.props.history.goBack()
                    }else{
                        message.error('订单添加失败')
                    }
                }
            }else {
                message.error('请选择购买的商品')
            }
        })
    }

    componentWillMount() {
        //取出携带的state
        const order = this.props.location.state   //如果是添加商品,没值;更新商品则有值
        console.log(order)
        //保存是否是更新的标识
        this.isUpdate = !!order
        if(this.isUpdate){
            this.setState({
                totalPrice:order.order_price,
                goods:order.goods
            })
        }
        console.log(order)
        this.order = order || {}
        // this.getProducts()
    }

    componentDidMount() {
        this.getProducts()
    }

    render() {
        const {products,goods,totalPrice} = this.state
        const {order} = this
        // console.log(goods)
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.push('/order')}>
                    <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}} />
                </LinkButton>
                <span style={{fontSize: 20}}>添加订单</span>
            </span>
        )

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },  //左侧label的宽度
            wrapperCol: { span: 8 },  //指定右侧包裹的宽度
        }
        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.formRef}>
                    <Item
                        name='user_name'
                        label='购买用户'
                        validateTrigger='onBlur'
                        initialValue={order.user_name}
                        rules={[
                            {required: true, message: '用户名不能为空', trigger: 'blur'}
                        ]}
                    >
                        <Input placeholder='请输入用户名'/>
                    </Item>
                    <Item
                        label='用户手机'
                        name='user_phone'
                        validateTrigger='onBlur'
                        initialValue={order.user_phone}
                        rules={[
                            {required: true, message: '手机号不能为空'},
                            {validator: this.validatePhone, trigger: 'blur'}
                        ]}
                    >
                        <Input placeholder='请输入手机号' allowClear />
                    </Item>
                    <Item
                        name='goods'
                        label='购买商品'
                        initialValue={order.goods}
                        // validateTrigger='onBlur'
                        /*rules={[
                            {required: true, message: '商品不能为空', trigger: 'blur'}
                        ]}*/
                    >
                        <TreeSelect
                            showSearch
                            value={goods}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请挑选商品"
                            allowClear
                            multiple
                            onChange={this.onChange}
                        >
                            {
                                products.map(product => {
                                    return (
                                        <TreeNode value={product._id} title={product.name} key={product._id}>
                                        </TreeNode>
                                    )
                                })
                            }
                        </TreeSelect>
                    </Item>
                    {
                        order.isUpdate ? (
                            <Item
                                // name='order_price'
                                label='订单价格'
                            >
                                <Input disabled addonAfter='元' defaultValue={order.order_price}/>
                            </Item>
                        ) : (
                            <Item
                                // name='order_price'
                                label='订单价格'
                            >
                                <Input disabled addonAfter='元' value={totalPrice}/>
                            </Item>
                        )
                    }
                    <Item
                        label='发货地址'
                        name='consignee_addr'
                        validateTrigger='onBlur'
                        initialValue={order.consignee_addr}
                        rules={[
                            {required: true, message: '地址不能为空', trigger: 'blur'}
                        ]}
                    >
                        <Input/>
                    </Item>
                    <Item
                        name='pay_status'
                        label='支付状态'
                    >
                        <Radio.Group defaultValue={order.pay_status}>
                            <Radio value={0}>未支付</Radio>
                            <Radio value={1}>已支付</Radio>
                        </Radio.Group>
                    </Item>
                    <Item
                        name='is_send'
                        label='发货状态'
                    >
                        <Radio.Group defaultValue={order.is_send}>
                            <Radio value={0}>未发货</Radio>
                            <Radio value={1}>已发货</Radio>
                        </Radio.Group>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default OrderAddUpdate;