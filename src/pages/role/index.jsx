import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import {connect} from 'react-redux' 

import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'
/* 
角色路由
*/
class Role extends Component {

    state = {
        roles: [],  //所有角色的列表
        role: {},    //选中的role
        isShowAdd: false,   //是否显示添加界面
        isShowAuth: false,  //是否显示设置权限界面
    }

    constructor(props){
        super(props)

        //创建ref的容器
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                // render: (auth_time) => formateDate(auth_time)
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    onRow = (role) => {
        return {
            onClick: event => { // 点击行
                // console.log('onClick()',role)
                // alert('点击行')
                this.setState({role})
            },
        }
    }

    //获取角色列表
    getRoles = async () => {
        const response = await reqRoles()
        const result = response.data
        if(result.status===0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    //添加角色
    addRole = async () => {
        //进行表单验证，只有通过了才向下处理
        this.form.validateFields().then( async value => {
            //隐藏确认框
            this.setState({isShowAdd: false})
            //收集输入数据
            const {roleName} = value
            //清除历史数据
            this.form.resetFields()
            //请求添加
            const response = await reqAddRole(roleName)
            const result = response.data
            //根据结果提示/更新列表显示
            if(result.status===0){
                message.success('角色添加成功')
                // this.getRoles()
                //产生新的角色
                const role = result.data
                //更新roles状态
                //React不推荐的写法
                /* const {roles} = this.state
                roles.push(role)
                this.setState({
                    roles
                }) */
                //更新roles状态:基于原本状态数据更新
                this.setState(state => ({
                    roles: [...state.roles, role]
                }))
            }else{
                message.error('角色添加失败')
            }
        }).catch(error=>{

        })

    }

    //更新角色(设置角色权限)
    updateRole = async () => {

        //隐藏确认框
        this.setState({isShowAuth: false})

        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        //指定角色的授权人
        role.auth_name = this.props.user.username

        //请求更新
        const response = await reqUpdateRole(role)
        const result = response.data
        if(result.status===0){
            // this.getRoles()
            if(this.props.user.role_id === role._id){
                //将储存的user删除
                this.props.logout()
                message.success('角色的权限已更新，请重新登录')
            }else{
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]   
                })
            }
            
        }else{
            message.error('设置角色权限失败')
        }
    }

    componentWillMount() {
        this.initColumn()
        
    }

    componentDidMount(){
        this.getRoles()
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
                    rowSelection={{
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({role})
                        }
                    }}
                    onRow={this.onRow}
                />
                {/* 添加角色框 */}
                <Modal 
                    title='添加角色'
                    visible={isShowAdd}
                    okText='确定'
                    cancelText='取消'
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
                {/* 角色授权框 */}
                <Modal 
                    title='设置角色权限'
                    visible={isShowAuth}
                    okText='确定'
                    cancelText='取消'
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm role={this.state.role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {logout}
)(Role)
