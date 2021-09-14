/* 
    左侧导航的组件
*/
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd'
import {connect} from 'react-redux'

import Logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
// import memoryUtils from '../../utils/memoryUtils'
import './index.less'
import {setHeadTitle} from '../../redux/actions'

const { SubMenu } = Menu;

class LeftNav extends Component {

    hasAuth = (item) => {
        const { key,isPublic } = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username
        /* 
            1. 当前用户是admin
            2. 当期item是公开的
            3. 如果当前用户是有此item的权限：key有没有在menus中
        */
        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
        }
        return false
    }

    /* 
        根据menuList的数据生成标签数组
        使用map() + 递归调用
    */
    getMenuNodes = (menuList) => {

        //得到当前的请求路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre,item) => {
            /* 
                {
                    title: '首页', // 菜单标题名称
                    key: '/home', // 对应的 path
                    icon: 'home', // 图标名称
                    children: [],   //可能有，可能没有 
                },
            */
           //如果当前用户有item的对应权限，才需要显示对应的菜单项
            if(this.hasAuth(item)){
                if(!item.children){
                    //判断item是否是当前对应的item
                    if(item.key===path || path.indexOf(item.key)===0){
                        //更新redux中的headTitle的状态
                        this.props.setHeadTitle(item.title)
                    }

                    pre.push((
                         <Menu.Item key={item.key} icon={item.icon}>
                            <Link 
                                to={item.key} 
                                onClick={() => this.props.setHeadTitle(item.title)}
                            >
                                {item.title}
                            </Link>
                         </Menu.Item>
                    ))
                }else{
                     //查找一个与当前请求匹配的子路由
                     const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                     //如果存在，说明当前item的子列表
                     if(cItem){
                         this.openKey = item.key
                     }
     
                    pre.push((
                         <SubMenu key={item.key} title={item.title} icon={item.icon}>
                             { this.getMenuNodes(item.children) }
                         </SubMenu>  
                    ))
                }
            }
           return pre
        }, [])
    }

    /* 
        根据menuList的数据生成标签数组
        使用map() + 递归调用
    */
    /* getMenuNodes_reduce = (menuList) => {
        return menuList.reduce((pre,item)=>{
            //向pre添加<Menu.Item>
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                ))
            }else{
            //向pre添加<SubMenu>
                pre.push((
                    <SubMenu key={item.key} title={item.title} icon={item.icon}>
                        { this.getMenuNodes(item.children) }
                    </SubMenu>
                ))
            }
            return pre
        },[])
    } */

    /* 
        在第一次render()之前执行一次
        为第一次render()准备数据(必须同步的)
    */
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
        // console.log('1111')
    }

    render() {
        //得到当前的请求路由路径
        let path = this.props.location.pathname
        // console.log("render()",path)
        if(path.indexOf('/product')===0){   //当前请求的是商品或其子路由界面
            path = '/product'
        }

        //得到需要打开菜单项的key
        const openKey = this.openKey
        // console.log(openKey)

        return (
            <div>
                <Link to='/' className="left-nav">
                    <header className="left-nav-header">
                        <img src={Logo} alt="logo" />
                        <h1>叶秋后台</h1>
                    </header>
                </Link>

                {/* 菜单 */}
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >

                    {/* <Menu.Item key="/home" icon={<HomeOutlined />}>
                        <Link to='/home'>首页</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
                        <Menu.Item key="/category" icon={<BarsOutlined />}>
                            <Link to='/category'>品类管理</Link>
                        </Menu.Item>
                        <Menu.Item key="/product" icon={<ToolOutlined />}>
                            <Link to='/product'>商品管理</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user" icon={<UserOutlined />}>
                        <Link to='/user'>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="" icon={<SafetyOutlined />}>
                        <Link to='/role'>角色管理</Link>
                    </Menu.Item>
                    <SubMenu key="sub2" title="图形图表" icon={<AreaChartOutlined />}>
                        <Menu.Item key="/charts/bar" icon={<BarChartOutlined />}>
                            <Link to='/charts/bar'>柱状图</Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/line" iccon={<LineChartOutlined />}>
                            <Link to='/charts/line'>折线图</Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/pie" iccon={<PieChartOutlined />}>
                            <Link to='/charts/pie'>饼图</Link>
                        </Menu.Item>
                    </SubMenu> */}

                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))