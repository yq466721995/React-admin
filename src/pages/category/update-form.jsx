import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { 
    Form,
    Input
} from 'antd'
const Item = Form.Item
// const Field = Form.Field
/* 
    分类添加的form组件
*/
export default class UpdateForm extends Component {

    formRef = React.createRef()

    static propTypes = {
        categoryName: PropTypes.string,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount(){
        //将form对象通过setForm()传递给父组件
        const form = this.formRef.current
        this.props.setForm(form)
    }

    render() {
        const {categoryName} = this.props
        // console.log(this.props)
        return (
            <Form ref={this.formRef}>
                <Item 
                name='categoryName' 
                initialValue={categoryName} 
                rules={[{required: true, message: '分类名称不能为空'}]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
            </Form>
        )
    }
}
