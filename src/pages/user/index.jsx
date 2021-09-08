import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Modal,
    message
} from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import UserForm from './user-form'
/* 
用户路由
*/
export default class User extends Component {

    state = {
        users: [],       //所有用户列表
        roles:[],   //所有角色列表
        isShow: false,  //是否显示确认框
        loading: false, //是否加载中
    }

    initColumn = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role => role._id ===role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    //根据role数组，生成包含所有角色名的对象(属性名用角色id值)
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        },{})
        //保存roleNames
        this.roleNames = roleNames
    }

    //显示添加界面
    showAdd = () => {
        this.user = null    //清空user
        this.setState({isShow: true})
    }

    //显示更新界面
    showUpdate = (user) => {
        this.user = user    //保存user
        //显示更新确认框
        this.setState({isShow: true})
    }

    //添加或更新用户
    addOrUpdateUser = () => {
        //隐藏确认框
        this.setState({isShow: false})

        this.form.validateFields().then( async value => {
            //收集数据
            const user = this.form.getFieldsValue()
            this.form.resetFields()
            //如果有user则更新用户，否则添加用户
            if(this.user && this.user._id){
                user._id = this.user._id
            }
            //发送请求
            const response = await reqAddOrUpdateUser(user)
            const result = response.data
            //更新显示
            if(result.status===0){
                message.success(`用户${this.user ? '更新' : '添加'}成功`)
                this.getUsers()
            }else{
                message.error(`用户${this.user ? '更新' : '添加'}失败`)
            }

        }).catch(err => {

        })
    }

    //获取用户列表
    getUsers = async () => {
        //发送请求前显示loading
        this.setState({loading: true})
        const response = await reqUsers()
        const result = response.data
        //发送请求后隐藏loading
        this.setState({loading: false})
        if(result.status===0){
            const {users, roles} = result.data
            this.initRoleNames(roles)
            console.log(users)
            this.setState({
                users,
                roles
            })
        }
    }

    //删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确定删除${user.username}吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                const response = await reqDeleteUser(user._id)
                const result = response.data
                if(result.status===0){
                    message.success('删除用户成功')
                    this.getUsers()
                }else{
                    message.error('删除用户失败')
                }
            }
        })
    }

    componentWillMount(){
        this.initColumn()
    }

    componentDidMount(){
        this.getUsers()
    }

    render() {
        const {users, isShow, loading, roles} = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    columns={this.columns}
                    dataSource={users}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    okText='确定'
                    cancelText='取消'
                    destroyOnClose={true}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                    } }
                >
                    <UserForm 
                        setForm={form => this.form = form} 
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
