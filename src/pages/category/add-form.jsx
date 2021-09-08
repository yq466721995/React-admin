import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Form,
    Select,
    Input
} from 'antd'
const Item = Form.Item
const Option = Select.Option
/* 
    分类添加的form组件
*/
export default class AddForm extends Component {

    formRef = React.createRef()

    static propTypes = {
        categorys: PropTypes.array.isRequired,  //一级分类的数组
        parentId: PropTypes.string.isRequired,   //父分类的ID
        setForm: PropTypes.func.isRequired  //用来传递form对象的函数
    }

    componentDidMount(){
        const form = this.formRef.current
        this.props.setForm(form)
    }

    render() {
        const {categorys, parentId} = this.props
        return (
            <Form ref={this.formRef}>
                <Item name='parentId' initialValue={parentId}>
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map( c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>

                <Item name='categoryName' rules={[{required: true, message: '分类名称不能为空'}]}>
                    <Input placeholder='请输入分类名称' />
                </Item>
            </Form>
        )
    }
}
