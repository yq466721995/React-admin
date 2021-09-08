/* 
    能发送ajax请求的函数模块
    函数的返回值是promise对象
    优化：1、统一处理请求异常
*/
import axios from 'axios'
// import {message} from 'antd'

export default function ajax(url, data={}, method='GET'){

    /* return new Promise((reject,resolve)=>{
        let promise
        //1.执行异步ajax请求
        if(method==='GET'){ //发送get请求
            promise =  axios.get(url, {
                params: data
            })
        }else{  //发送post请求
            promise = axios.post(url, data)
        }
        //2.如果成功了调用resolve(value)
        promise.then(response =>{
            resolve(response.data)
        //3.如果失败了，不调用reject(reason)，而是提示异常信息
        }).catch(error =>{
            message.error('请求出错：' + error.message)
        })
    }) */

    if(method==='GET'){ //发送get请求
        return axios.get(url, {
            params: data
        })
    }else{  //发送post请求
        return axios.post(url, data)
    }

    
}