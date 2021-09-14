import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message,
} from 'antd'

import {
    PlusOutlined
} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option
/* 
    Product的默认子路由组件
*/
export default class ProductHome extends Component {

    state = {    
        total: 0,   //商品类型的总数量
        products: [],    //商品的数据
        loading: false, //是否正在加载中
        searchName: '', //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索
    }

    initColumns = () => {
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render : (price) => '￥' + price   //当前指定了对应的属性，传入的是对应的属性值
            },
            {
                title: '销量',
                dataIndex: 'sales',
            },
            {
                title: '库存',
                dataIndex: 'inventory'
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product
                    return (
                        <span>
                            <Button 
                                type='primary' 
                                onClick={() => this.updatestatus(_id, status===1 ? 2 : 1)}
                            >
                                {status===1 ? '下架' : '上架'}
                            </Button>
                            <span style={{marginLeft: 18}}>{status===1 ? '在售' : '售罄'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象传递给目标路由对象  */}
                            <LinkButton 
                                onClick={ () => this.props.history.push('/product/detail', {product}) }
                            >
                                详情
                            </LinkButton>
                            <LinkButton 
                                onClick={() => this.props.history.push('/product/addUpdate', product)}
                            >
                                修改
                            </LinkButton>
                        </span>
                    )
                }
            }
          ];
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum  //保存pageNum，让其他方法可以看见

        this.setState({loading:true})   //发送请求之前显示loading

        const {searchName, searchType} = this.state

        let response
        //如果搜索关键字有值，说明我们要做搜索分页
        if(searchName){
            response = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        }else{
            response = await reqProducts(pageNum, PAGE_SIZE)
        }
        const result = response.data
        this.setState({loading:false})   //发送请求之后隐藏loading
        if(result.status===0){
            //取出分页数据, 更新数据, 显示分页列表
            const {total, list} = result.data
            this.setState({
                total,
                products: list
            })
            console.log(list)
        }
    }

    /* 
        更新指定商品的状态
    */
    updatestatus = async (productId, status) => {
        const response = await reqUpdateStatus(productId, status)
        const result = response.data
        if(result.status===0){
            message.success('更新商品成功！')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
          
        const {products, total, loading, searchName, searchType} = this.state

        const title = (
            <span>
                <Select 
                    value={searchType} 
                    style={{width:130}}
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按关键字搜索</Option>
                </Select>
                <Input 
                    placeholder='关键字' 
                    style={{width: 150, margin: '0 10px'}} 
                    value={searchName} 
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={ () => this.getProducts(1) }>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addUpdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table 
                    loading={loading} 
                    bordered
                    rowKey='_id'
                    dataSource={products} 
                    columns={this.columns} 
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE, 
                        showQuickJumper: true, 
                        onChange: this.getProducts,
                    }}
                />
            </Card>
        )
    }
}
