/* 
    包含n个用来创建action的工厂函数(action creator)
*/
import { INCREMENT, DECREMENT } from './action-type'
//增加的action
export const increment = (number) => ({type: INCREMENT, data: number})

export const decrement = (number) => ({type: DECREMENT, data: number})