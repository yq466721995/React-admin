import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'

const Item = Form.Item

export default class AddUpdate extends Component {

    formRef = React.createRef()

    static propTypes = {
        setForm: PropTypes.func.isRequired   //用来传递form对象的函数
    }

    componentDidMount(){
        const form = this.formRef.current
        this.props.setForm(form)
    }

    render() {
        return (
            <Form ref={this.formRef}>
                <Item 
                    label='角色名称:'
                    name='roleName'
                    initialValue=''
                    rules={[
                        {required: true, message: '角色名称必须输入'}
                    ]}
                >
                    <Input placeholder='请输入角色名' allowClear/>
                </Item>
            </Form>
        )
    }
}
