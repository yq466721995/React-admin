import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import {connect} from 'react-redux'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import { formateDate } from '../../utils/dateUtils'
// import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import {logout} from '../../redux/actions'

import './index.less'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now())    //当前时间字符串
    }

    /* 
        获取当前时间
    */
    getTime = () => {
        //每隔1s获取当前时间，并更新状态数据currentTime
        this.interval = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    /* 
        获取当前标题
    */
    /* getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key === path){  //如果当前item对象的key与path一样，item的title就是需要显示的title
                title = item.title
            }else if(item.children){
                //在所有子item中查找匹配
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                //如果有值说明匹配到
                if(cItem){
                    //取出它的title
                    title = cItem.title
                }
            }
        })
        return title
    } */

    /* 
        退出登录
    */
    loginout = () => {
        //显示确认框
        Modal.confirm({
            title: '退出登录',
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.props.logout()
            },
        })
    }

    /* 
        第一次render()之后执行一次
        一般在此执行异步操作：ajax请求/启动定时器
    */
    componentDidMount(){
        this.getTime()
    }

    /* 
        组件卸载之前调用
    */
   componentWillUnmount(){
       //清除定时器
        clearInterval(this.interval)
   }

    render() {

        const { currentTime } = this.state
        const username = this.props.user.username

        //得到当前需要显示的title
        // const title = this.getTitle()
        const title = this.props.headTitle

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <LinkButton onClick={this.loginout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{ title }</div>
                    <div className="header-bottom-right">
                        <span>{ currentTime }</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({headTitle: state.headTitle, user: state.user}),
    {logout}
)(withRouter(Header))
