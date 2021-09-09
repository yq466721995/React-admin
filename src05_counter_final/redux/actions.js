/* 
    包含n个用来创建action的工厂函数(action creator)
*/
import { INCREMENT, DECREMENT } from './action-type'
//增加的同步action：返回对象
export const increment = (number) => ({type: INCREMENT, data: number})
//减少的同步action：返回对象
export const decrement = (number) => ({type: DECREMENT, data: number})
//增加的异步action：返回的是函数
export const incrementAsync = (number) => {
    return dispatch => {
        //执行异步操作(定时器、ajax请求、promise)
        setTimeout(() => {
            //当前异步请求执行完毕时，分发一个同步action
            dispatch(increment(number))
        }, 1000);
    }  
}
