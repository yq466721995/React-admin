/* 
    reducer函数模块：根据当前state和指定action返回一个新的state
*/
//管理count数据的reducer
import { INCREMENT, DECREMENT } from './action-type'
export default function count (state=1, action) {
    console.log('reducer()',state,action)
    switch(action.type){
        case INCREMENT:
            return state + action.data
        case DECREMENT:
            return state - action.data
        default:
            return state
    }
}