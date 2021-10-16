import React, { Component } from 'react'
import { 
    Card, 
    Button, 
    Table, 
    message,
    Modal 
} from 'antd' 
import {
    PlusOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
/* 
商品分类路由
*/
export default class Category extends Component {

    state = {
        loading: false, //是否正在获取数据中
        categorys: [],   //一级分类列表
        subCategorys: [],   //二级分类列表
        parentId: '0',   //当前需要显示的分类列表的父分类Id
        parentName: '',  //当亲需要显示的分类列表的父分类名称
        showStatus: 0   //标识添加/更新的更新框是否显示，0：代表都显示；1：代表添加显示；2：代表更新显示
    }

    //初始化Table所有列的数组
    initColums = () => {
        this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',    //显示数据对应的数据名
            },
            {
              title: '操作',
              width: 300,
              render: (category) => (   //返回需要显示的界面标签
                  <span>
                      <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                      {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理的函数并传入数据 */}
                      {this.state.parentId === '0' ? <LinkButton onClick={ () => this.showSubCategorys(category) }>查看子分类</LinkButton> : null}
                      {/* <LinkButton onClick={() => this.deleteCategory(category) }>删除分类</LinkButton> */}
                  </span>
              )
            },
          ];
    }

    /* 
        异步获取一级/二级分类列表显示 
        parentId: 如果没有指定根据状态中的parentId请求，如果指定了就根据指定的发送请求 
    */
    getCategorys = async (parentId) => {
        parentId = parentId || this.state.parentId
        // console.log(parentId)
        //在发送请求前，显示loading
        this.setState({loading: true})
        //发异步ajax请求，获取数据
        const response = await reqCategorys(parentId)
        const result = response.data
        // console.log(result)
        //在请求完成后，隐藏loading
        this.setState({loading: false})
        if(result.status===0){
            //取出分类数组(可能是一级的也可能是二级的)
            const categorys = result.data
            // console.log(categorys)
            //更新状态
            if(parentId === '0'){
                //更新一级分类状态
                this.setState({
                    categorys
                })
            }else{
                //更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
                // console.log(categorys)
            }
            
        }else{
            message.error('获取分类列表失败')
        }
    }

    //显示指定一级分类对象的二级子列表
    showSubCategorys = (category) => {
        //更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        },() => {   //在状态更新且重新render()后执行
            // console.log('parentId',this.state.parentId)
            //获取二级分类列表
            this.getCategorys()
        })
        // console.log('parentId',this.state.parentId) //'0'
        //获取二级分类列表
        // this.getCategorys()
    }

    //显示一级分类列表
    showCategorys = () => {
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    /* deleteCategory = (category) => {
        const {_id} = category
        Modal.confirm({
            title: '删除分类',
            icon: <ExclamationCircleOutlined />,
            content: '确定删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                const response = await reqDeleteCategory(_id)
                const result = response.data
                if(result.status===0){
                    message.success('删除分类成功')
                    this.getCategorys('0')
                }else{
                    message.error('删除分类失败')
                }
            },
        })
    } */
    
    //显示删除分类
    /* showDeleteCategory = (category) => {
        this.removeCategory = category
        //显示确认框
        this.setState({
            showStatus: 3
        })
    } */

    //删除分类
    /* deleteCategory = async (category) => {
        const {_id} = this.removeCategory
        const response = await reqDeleteCategory(_id)
        const result = response.data
        if(result.status===0){
            message.success('删除分类成功')
            this.getCategorys('0')
        }else{
            message.error('删除分类失败')
        }
        this.setState({showStatus: 0})
    } */
    
    //响应点击取消：隐藏确认框
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()
        //隐藏确认框
        this.setState({
            showStatus: 0
        })
    }

    //显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    //添加分类
    addCategorys = () => {
        //表单验证
        this.form.validateFields().then(async value => {
            //隐藏确认框
            this.setState({
                showStatus: 0
            })

            //收集数据，并提交添加分类的请求
            const {categoryName, parentId} = this.form.getFieldsValue()
            //清除输入数据
            this.form.resetFields()

            //重新获取分类列表
            const response = await reqAddCategory(parentId, categoryName)
            const result = response.data
            if(result.status===0){
                //添加的分类就是当前分类列表下的分类
                if(parentId===this.state.parentId){
                    //重新获取当前分类列表显示
                    this.getCategorys()
                }else if(parentId==='0'){   //在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一级分类列表 
                    this.getCategorys('0')
                }
            }else{
                message.error('添加失败')
            }
        }).catch(error=>{

        })

    }

    //显示更新的确认框
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        //更新状态
        this.setState({
            showStatus: 2
        })
    }

    //更新分类
    updateCategorys = () => {
        //进行表单验证
        this.form.validateFields().then( async value=>{
            //1.隐藏确认框
            this.setState({
                showStatus: 0
            })

            //2.准备数据
            const categoryId = this.category._id
            const categoryName = this.form.getFieldValue('categoryName')
            //清除输入数据
            this.form.resetFields()
            // console.log(categoryName)
            
            //3.发请求更新分类
            const response = await reqUpdateCategory({categoryId, categoryName})
            const result = response.data
            if(result.status===0){
                //3.重新显示列表
                this.getCategorys()
            }else{
                message.error('更新失败')
            }
        }).catch(error=>{

        })

        
    }

    //为第一次render()准备数据
    componentWillMount(){
        this.initColums()
    }

    //执行异步任务：发送ajax请求
    componentDidMount(){
        this.getCategorys()
    }

    render() {
        //读取状态数据
        const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state

        //读取指定的分类
        const category = this.category || {}    //如果还没有指定一个空对象
        // console.log(category)

        //card的左侧
        const title = parentId==='0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined />
                <span style={{marginLeft:5}}>{parentName}</span>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                {/* 菜单列表表格 */}
                <Table 
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId==='0' ? categorys : subCategorys} 
                    columns={this.columns}
                    pagination={{pageSize: 5, showQuickJumper: true}}    
                />

                {/* 添加的确认框 */}
                <Modal title="添加分类" 
                    visible={showStatus===1} 
                    okText='确认' 
                    cancelText='取消'
                    destroyOnClose={true}
                    onOk={this.addCategorys} 
                    onCancel={this.handleCancel}>
                    <AddForm categorys={categorys} parentId={parentId} setForm={ form => this.form = form }/>
                </Modal>

                {/* 更新修改的确认框 */}
                <Modal title='更新分类' 
                    visible={showStatus===2}
                    okText='确认' 
                    cancelText='取消'
                    destroyOnClose={true}
                    onOk={this.updateCategorys} 
                    onCancel={this.handleCancel}>
                    <UpdateForm 
                        categoryName={category.name}
                        setForm={ form => this.form = form }
                    />
                </Modal>

                {/* 删除分类的确认框 */}
                {/* <Modal title='删除分类' 
                    visible={showStatus===3}
                    okText='确认' 
                    cancelText='取消'
                    destroyOnClose={true}
                    onOk={this.deleteCategory} 
                    onCancel={this.handleCancel}>
                </Modal> */}
            </Card>
        )
    }
}
