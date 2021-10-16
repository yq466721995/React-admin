import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree
} from 'antd'

import menuList from '../../config/menuConfig'

const Item = Form.Item
//PureComponent会对props和state进行浅比较
export default class AuthForm extends PureComponent {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props){
        super(props)
        const children = this.getTreeNode(menuList)
        const { menus } = this.props.role
        //初始化状态
        this.state = {
            treeData: [
                {
                    title: '平台权限',
                    key: 'all',
                    children
                  },
            ],
            checkedKeys: menus  //根据传入的角色的menus生成是否选中的初始状态
        }
    }

    getTreeNode = (menuList) => {
        return menuList.reduce((pre, item)=>{
            pre.push(
                {
                    title: item.title,
                    key: item.key,
                    children: item.children ? this.getTreeNode(item.children) : []
                }
            )
            return pre
        }, [])
    }

    //选中某个node时
    onCheck = (checkedKeys) => {
        // console.log('onCheck', checkedKeys)
        this.setState({checkedKeys})
    }

    //为父组件获取menus数据的方法
    getMenus = () => this.state.checkedKeys

    //根据新传入的role来更新checkedKeys状态
    /* 
        当组件接收到新的属性时自动调用
    */
    /* componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    } */

    render() {
        // console.log('AuthForm render()')
        const {role} = this.props
        const {treeData, checkedKeys} = this.state
        return (
            <div>
                <Item label='角色名称:'>
                    <Input value={role.name} disabled />
                </Item>
                <Item>

                <Tree
                    checkable
                    checkedKeys={checkedKeys}
                    defaultExpandAll={true}
                    treeData={treeData}
                    onCheck={this.onCheck}
                />
                </Item>
            </div>
        )
    }
}
