import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd'
import {connect} from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found'

const { Footer, Sider, Content } = Layout; 

/* 
    后台管理的路由组件
*/
class Admin extends Component{
    render(){
        const user = this.props.user
        //如果内存中没有存储user ==> 当前没登录
        if(!user || !user._id){
            //自动跳转到登录
            return <Redirect to='/login'/>
        }
        return(
            <Layout style={{minHeight: '100%'}}>
                {/* 侧边栏 */}
                <Sider style={{overflow: 'auto',height: '100vh',position: 'fixed',left: 0,}}>
                    {/* 左侧菜单 */}
                    <LeftNav />
                </Sider>
                {/* 右侧部分 */}
                <Layout style={{marginLeft: 200}}>
                    {/* 头部 */}
                    <Header/>
                    {/* 内容部分 */}
                    <Content style={{ margin: 20, backgroundColor: '#fff' }}>
                        <Switch>
                            <Redirect from='/' to='/home' exact/>  {/* exact精准匹配 */}
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Route component={NotFound}/>   {/* 以上都匹配不到，显示not-found页面 */}
                        </Switch>
                    </Content>
                    {/* 尾部 */}
                    <Footer style={{ color: '#aaa', textAlign: 'center' }}>
                        推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {}
)(Admin)