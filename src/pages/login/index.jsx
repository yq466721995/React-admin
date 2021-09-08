/* 
    登录的路由组件
*/
import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './login.less'
import Logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
const Item = Form.Item

class Login extends Component{

    formRef = React.createRef()

    handleSubmit = async()=>{

        const form = this.formRef.current
        // console.log(this.formRef)
        form.validateFields().then( async(values) =>{　　// 如果全部字段通过校验，会走then方法，里面可以打印出表单所有字段（一个object）
            // console.log('成功',values)
            const {username, password} = values
            const response = await reqLogin(username, password)
            const result = response.data
            if(result.status === 0){    //登录成功
                message.success('登录成功')
                // console.log('请求成功',result)

                //保存user
                const user = result.data
                memoryUtils.user = user //保存在内存中
                storageUtils.saveUser(user) //保存在local中

                //跳转到管理界面
                this.props.history.replace('/')
            }else{//登录失败
                message.error(result.msg)
                // console.log('登录失败',result)
            }
          })
          .catch( err =>{　　// 如果有字段没通过校验，会走catch，里面可以打印所有校验失败的信息
            message.error(err)
            // console.log('检验失败', err)
          })  
          
    }

    /* 
        对密码进行自定义验证
    */
   /* 
        用户名/密码的的合法性要求
        1). 必须输入
        2). 必须大于等于 4 位
        3). 必须小于等于 12 位
        4). 必须是英文、数字或下划线组成
   */
  /*  validatePwd = (rule, value, callback) => {
       
        if(!value){
            // callback('密码不能为空')
            return Promise.reject('密码不能为空')
        }else if(value.length < 4){
            // callback('密码至少4位')
            return Promise.reject('密码至少4位')
        }else if(value.length > 12){
            // callback('密码不能超过12位')
            return Promise.reject('密码不能超过12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            // callback('密码必须是英文、数字或下划线组成')
            return Promise.reject('密码必须是英文、数字或下划线组成')
        }else{
            // callback()
            return Promise.resolve()
        }
   } */

     // 自定义验证：password
    validatePwd = (rule, value, callback) => {
        if (!value) {
            return Promise.reject('密码不能为空')
        } else if (value.length < 4 || value.length > 12) {
            return Promise.reject('密码必须大于4位小于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject('密码必须是英文数字或者下划线组成')
        } else {
            return Promise.resolve()
        }
    }


    render(){

        /* 判断用户是否登录 */
        //如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/' />
        }

        return(
            <div className='login'>
                <header className='login-header'>
                    <img src={Logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form
                        ref={this.formRef}
                        name="normal_login"
                        className="login-form"
                        onFinish={this.handleSubmit}
                    >
                        {/* 
                            用户名/密码的的合法性要求
                            1). 必须输入
                            2). 必须大于等于 4 位
                            3). 必须小于等于 12 位
                            4). 必须是英文、数字或下划线组成
                        */}
                        <Item
                            name="username"
                            validateTrigger='onBlur'
                            //声明式验证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                { required: true, message: '用户名必须不能为空',  whitespace: true },
                                { min: 4, message: '用户名至少4位', trigger: 'blur' },
                                { max: 12, message: '用户名不能超过12位', trigger: 'blur' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成', trigger: 'blur' }
                            ]}
                        >
                            <Input 
                                allowClear 
                                prefix={<UserOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}} />} 
                                placeholder="用户名" />
                        </Item>
            
                        <Item
                            name="password"
                            validateTrigger='onBlur'
                            rules={[
                                {
                                    validator: this.validatePwd,
                                    trigger: 'blur'
                                }
                            ]}
                        >
                            <Input.Password
                                allowClear
                                prefix={<LockOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/* 
    高阶函数
    高阶组件
*/

export default Login
