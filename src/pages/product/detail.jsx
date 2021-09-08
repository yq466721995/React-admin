import React, { Component } from 'react'
import {
    Card,
    List
} from 'antd'

import {
    ArrowLeftOutlined
} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

const Item = List.Item
/* 
    Product的详情子路由
*/
export default class ProductDetail extends Component {

    state = {
        cName1: '',     //一级分类名称
        cName2:'',      //二级分类名称  
    }

    async componentDidMount () {
        const {pCategoryId, categoryId} = this.props.location.state.product
        if(pCategoryId==='0'){  //一级分类下的商品
            const response = await reqCategory(categoryId)
            const result = response.data
            if(result.status===0){
                const cName1 = result.data.name
                this.setState({
                    cName1
                })
            }
        }else{  //二级分类下的商品
            /* 通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送
            const response1 = await reqCategory(pCategoryId)    //获取一级分类列表
            const response2 = await reqCategory(categoryId)     //获取二级分类列表
            const result1 = response1.data
            const result2 = response2.data
            if(result1.status===0 && result2.status===0){
                const cName1 = result1.data.name
                const cName2 = result2.data.name
                this.setState({
                    cName1,
                    cName2
                })
            } */

            //一次性发送多个请求，只有都成功了，才正常处理
            const responses = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const result1 = responses[0].data
            const result2 = responses[1].data
            if(result1.status===0 && result2.status===0){
                const cName1 = result1.data.name
                const cName2 = result2.data.name
                this.setState({
                    cName1,
                    cName2
                })
            }
        }
    }

    render() {
        //读取携带的state数据
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        // console.log(imgs)
        const {cName1, cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined 
                        style={{marginRight: 10, fontSize: 20}}
                        onClick={ () => this.props.history.goBack() }
                    />
                </LinkButton>         
                <span style={{fontSize: 20}}>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List  itemLayout="vertical">
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span className='right'>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span>{cName1} {cName2 ? ' --> ' + cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img 
                                        key={img}
                                        className='product-img'
                                        src={ BASE_IMG_URL + img} 
                                        alt='img' 
                                    />
                                ))
                            }
                            {/* <img 
                                className='product-img'
                                src="https://img14.360buyimg.com/n0/jfs/t1/202976/5/2685/133464/61233f9dE500c1f35/5f79d5573ff4b5f9.jpg" 
                                alt="ThinkPad" 
                            />
                            <img 
                                className='product-img'
                                src="https://img14.360buyimg.com/n0/jfs/t1/185744/15/20595/175345/61233e16E45590ef3/5dfde7071a95a8f7.jpg" 
                                alt="ThinkPad" 
                            /> */}
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情：</span>
                        <span style={{display: 'inline-block'}} dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
