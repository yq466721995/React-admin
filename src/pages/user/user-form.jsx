import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/* 
    添加/修改用户的form组件
*/
export default class UserForm extends PureComponent {

    formRef = React.createRef()

    static propTypes = {
        setForm: PropTypes.func.isRequired,  //用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    //手机号校验
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

    //邮箱校验
    validateEmail = (rule, value, callback) => {
        //  验证邮箱的正则表达式
        const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if(!regEmail.test(value)) {
            return Promise.reject('请输入合法的邮箱')
        }else{
            // 合法的邮箱
            return Promise.resolve()
        }
       
    }

    componentDidMount(){
        const form = this.formRef.current
        this.props.setForm(form)
        // console.log(form.getFieldsValue())
    }

    render() {
        const { roles, user } = this.props
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  //左侧label的宽度
            wrapperCol: { span: 16 },  //指定右侧包裹的宽度
        }
        return (
            <Form {...formItemLayout} ref={this.formRef}>
                <Item 
                    label='用户名:'
                    name='username'
                    validateTrigger='onBlur'
                    initialValue={user.username}
                    rules={[
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                        { min: 4, message: '用户名至少4位', trigger: 'blur' },
                        { max: 12, message: '用户名不能超过12位', trigger: 'blur' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成', trigger: 'blur' }
                    ]}
                >
                    <Input placeholder='请输入用户名' allowClear />
                </Item>
                {
                    user._id ? '' : (
                        <Item 
                            label='密码:'
                            name='password'
                            validateTrigger='onBlur'
                            initialValue=''
                            rules={[
                                {required: true, message: '密码不能为空', trigger: 'blur'},
                                { min: 4, message: '用户名至少4位', trigger: 'blur' },
                                { max: 12, message: '用户名不能超过12位', trigger: 'blur' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成', trigger: 'blur' }
                            ]}
                        >
                            <Input.Password placeholder='请输入密码' type='password' allowClear />
                        </Item>
                    )
                }
                <Item 
                    label='手机号:'
                    name='phone'
                    initialValue={user.phone}
                    validateTrigger='onBlur'
                    rules={[
                        {required: true, message: '手机号不能为空'},
                        {validator: this.validatePhone, trigger: 'blur'}
                    ]}
                >
                    <Input placeholder='请输入手机号' allowClear />
                </Item>
                <Item 
                    label='邮箱:'
                    name='email'
                    validateTrigger='onBlur'
                    initialValue={user.email}
                    rules={[
                        {required: true, message: '邮箱不能为空'},
                        {validator: this.validateEmail, trigger: 'blur'}
                    ]}
                >
                    <Input placeholder='请输入邮箱' type='email' allowClear />
                </Item>
                <Item 
                    label='角色:'
                    name='role_id'
                    initialValue={user.role_id}
                    rules={[
                        {required: true, message: '角色必须选择'}
                    ]}
                >
                    <Select placeholder="请选择角色" allowClear >
                        {
                            roles.map(role => (<Option key={role._id} value={role._id}>{role.name}</Option>))
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
