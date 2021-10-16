import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Button,
    Cascader,
    message
} from 'antd'

import {
    ArrowLeftOutlined
} from '@ant-design/icons'

import PricturesWall from './prictures-wall'
import LinkButton from '../../components/link-button'
import {reqAddOrUpdateProduct, reqCategorys} from '../../api'
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input
/* 
    Product的添加和更新的子路由组件
*/
export default class ProductAddUpdate extends Component {

    formRef = React.createRef()

    state = {
        options: []
    }

    constructor(props){
        super(props)

        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categorys) => {
        //根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,  //不是叶子
        }))

        //如果是一个二级分类商品更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!=='0'){
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表的options
            if (subCategorys && subCategorys.length>0) {
                // 生成二级的 option 数组
                const childOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                //找到当前商品对应的一级option对象
                const targetOption = options.find(option => option.value===pCategoryId)
                //关联到对应的一级option对象
                targetOption.children = childOptions
            }
        }

        //更新options状态
        this.setState({
            options
        })
    }

    /* 
        异步获取一级/二级分类列表，并显示
        async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    */
    getCategorys = async (parentId) => {
        const response = await reqCategorys(parentId)
        const result = response.data
        if(result.status===0){
            const categorys = result.data
            //如果是一级分类列表
            if(parentId==='0'){
                this.initOptions(categorys)
            }else{  //二级列表
                return categorys    //返回二级列表 ==> 当前函数返回的promise就会成功且value为categorys
            }
        }
    }

   

    /* 
        验证价格的自定义验证
    */
    validatePrice = (rule, value) => {
        if(value*1 > 0){
            return Promise.resolve()    //验证通过
        }else{
            return Promise.reject(new Error('价格必须大于0！'))
        }
    }

    /* 
        验证销量的自定义验证
    */
    validateSales = (rule, value) => {
        if(value*1 < 0){
            return Promise.reject(new Error('销量不能小于0！'))
        }else{
            return Promise.resolve()    //验证通过
        }
    }

    /* 
        验证库存的自定义验证
    */
    validateInventory = (rule, value) => {
        if(value*1 < 0){
            return Promise.reject(new Error('库存不能小于0！'))
        }else{
            return Promise.resolve()    //验证通过
        }
    }
    
    /* 
        用来加载下一级列表的回调函数
    */
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        //显示loading效果
        targetOption.loading = true;

        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // console.log(subCategorys)
        //隐藏loading效果
        targetOption.loading = false
        //二级分类数组有数据
        if(subCategorys && subCategorys.length>0){
            //生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            //关联到当前的option上
            targetOption.children = childOptions
        }else{  //当前选中的分类没有二级子分类
            targetOption.isLeaf = true
        }
    
        //更新options状态
        this.setState({
            options: [...this.state.options]
        })
      };

    submit = () => {
        //进行表单验证，如果通过了，才发送请求
        const form = this.formRef.current
        form.validateFields().then(async value => {

            //1.收集数据,并封装成product对象
            const {name, desc, price, categoryIds, sales, inventory} = value
            let categoryId, pCategoryId
            if(categoryIds.length===1){
                pCategoryId = '0'
                categoryId = categoryIds[0]
            }else{
                pCategoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()
            const product = {name, desc, price, sales, inventory, imgs, detail, pCategoryId, categoryId}

            //如果是更新需要添加_id
            if(this.isUpdate){
                product._id = this.product._id
            }

            //2.调用接口请求函数去添加/更新
            const response = await reqAddOrUpdateProduct(product)
            const result = response.data
            
            //3.根据结果显示
            if(result.status===0){
                message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                this.props.history.goBack()
            }else{
                message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
            }
            
            // alert('发送ajax请求')
            // console.log('submit()',value,imgs,detail)
        }).catch(err => {

        })
    }

    componentWillMount(){
        //取出携带的state
        const product = this.props.location.state   //如果是添加商品,没值;更新商品则有值
        //保存是否是更新的标识
        this.isUpdate = !!product
        this.product = product || {}
    }

    componentDidMount(){
        this.getCategorys('0')
    }

    

    render() {
        const {options} = this.state
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        //用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate){
            //商品是一个一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                //商品是一个二级分类商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },  //左侧label的宽度
            wrapperCol: { span: 8 },  //指定右侧包裹的宽度
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.push('/product')}>
                    <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}} />
                </LinkButton>
                <span style={{fontSize: 20}}>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        
        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.formRef}>
                    <Item 
                        name='name' 
                        label='商品名称:' 
                        initialValue={product.name}
                        rules={[
                            {required: true, message: '必须输入商品名称'}
                        ]}
                    >
                        <Input placeholder='请输入商品名称' allowClear />
                    </Item>
                    <Item 
                        label='商品描述:'
                        name='desc'
                        initialValue={product.desc}
                        rules={[
                            {required: true, message: '必须输入商品描述'}
                        ]}
                    >
                        <TextArea placeholder='请输入商品描述' autoSize={{minRows:2, maxRows: 6}} allowClear />
                    </Item>
                    <Item 
                        label='商品价格:'
                        name='price'
                        initialValue={product.price}
                        rules={[
                            {required: true, message: '必须输入商品价格'},
                            {validator: this.validatePrice}
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' allowClear />
                    </Item>
                    <Item 
                        label='商品销量:'
                        name='sales'
                        initialValue={product.sales}
                        rules={[
                            {required: true, message: '必须输入商品销量'},
                            {validator: this.validateSales}
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品销量' allowClear />
                    </Item>
                    <Item 
                        label='商品库存:'
                        name='inventory'
                        initialValue={product.inventory}
                        rules={[
                            {required: true, message: '必须输入商品库存'},
                            {validator: this.validateInventory}
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品库存' allowClear />
                    </Item>
                    <Item 
                        label='商品分类:'
                        name='categoryIds'
                        initialValue={categoryIds}
                        rules={[
                            {required: true, message: '必须指定商品分类'}
                        ]}
                    >
                        <Cascader 
                            options={options}    /* 需要显示的列表数据 */
                            loadData={this.loadData}    /* 当选择某个列表项时，加载下一级列表的监听回调 */
                        />
                    </Item>
                    <Item label='商品图片:'>
                        <PricturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    {/* 栅格总共宽度分成24份 */}
                    <Item label='商品详情:' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail} /> 
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

/* 
1.  子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2.  父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象(也就是组件对象)，调用其方法
*/