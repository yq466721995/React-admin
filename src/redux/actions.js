/* 
包含n个action creator的函数模块
同步action：对象 {type: 'xxx', data: 数据值}
异步action：函数 dispatch => {}
*/
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    SET_USER,
} from './action-types'
import {reqLogin} from '../api'
import storageUtils from '../utils/storageUtils'
/* 
    设置头部标题的同步action
*/
export const setHeadTitle = (headeTitle) => ({type: SET_HEAD_TITLE, data: headeTitle})

/* 
    接收用户的同步action
*/
export const receiveUser = (user) => ({type: RECEIVE_USER, user})

/* 
    显示错误信息的同步action
*/
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

/* 
    退出登录的同步action
*/
export const logout = () => {
    //删除local中的user
    storageUtils.removeUser()
    //返回action对象
    return {type: SET_USER}
}

/* 
    登录的异步action
*/
export const login = (username, password) => {
    return async dispatch => {
        // 1. 执行ajax请求
        const response = await reqLogin(username, password)
        const result = response.data
        // 2.1 如果请求成功，分发一个成功的同步action
        if(result.status===0){
            const user = result.data
            //保存user到local中
            storageUtils.saveUser(user)
            //分发接收用户的同步action
            dispatch(receiveUser(user))
        }else{  // 2.2 如果请求失败，分发一个失败的同步action
            const msg = result.msg
            // message.error(msg)
            dispatch(showErrorMsg(msg))
        }
        
    }
}