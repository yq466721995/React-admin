import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'

import {reqDeleteImg} from '../../api/index'
import { BASE_IMG_URL } from '../../utils/constants';
/* 
    用于图片上传的组件
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props){
        super(props)

        let fileList = []
        //如果传入了imgs属性
        const {imgs} = this.props
        if(imgs && imgs.length > 0){
            fileList = imgs.map((img,index) => ({
                uid: -index,      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                name: img,  //图片的文件名
                status: 'done',     //图片状态：done-已上传，uploading-正在上传中，remove-已删除
                url: BASE_IMG_URL + img,    //图片的地址
            }))
        }

        //初始化状态
        this.state=({
            previewVisible: false,  //标识是否显示大图预览Modal
            previewImage: '',       //大图的url
            previewTitle: '',
            fileList    //所有已上传图片的数组
        })
    }

    /* 
        获取所有已上传的图片文件名的数组
    */
    getImgs = () => {
      return this.state.fileList.map(file => file.name)
    }

    /* 
        隐藏Modal
    */
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        //显示指定file对应的大图
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    /* 
        file:当前操作的图片文件(上传/删除)
        fileList:所有已上传图片文件的数组
    */
    handleChange = async ({ file, fileList }) => {
        // console.log('handleChange()', file.status, file, fileList)

        //一旦上传成功，将当前上传的file的信息修正(name,url)
        if(file.status==='done'){
            //response: {status: 0, data: {name: "image-1630498878538.png, url: "http://localhost:5000/upload/image-1630498878538.png"}}
            const result = file.response
            if(result.status===0){
                message.success('图片上传成功')
                const {name, url} = result.data
                //当前操作的图片文件file和fileList数组的最后一个并不是同一个对象，而是两个内容相同的对象
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            }else{
                message.error('图片上传失败')
            }
        }else if(file.status==='removed'){
            //图片删除
            const response = await reqDeleteImg(file.name)
            const result = response.data
            if(result.status===0){
                message.success('删除图片成功')
            }else{
                message.error('删除图片失败')
            }
        }

        //在操作(上传/删除)过程中更新fileList的状态
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
        )
        return (
        <>
            <Upload
            action="/manage/img/upload"   //上传图片的接口地址
            accept='image/*'      //只接收图片格式
            listType="picture-card"   //卡片样式
            name='image'      //请求参数名
            fileList={fileList}   //已经上传的文件列表
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            >
            {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
            >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
        );
    }
}