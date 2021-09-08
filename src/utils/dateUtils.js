/*
包含 n 个日期时间处理的工具函数模块
*/
/*
格式化日期
*/
export function formateDate(time) {
    if(!time) return ''
    let date = new Date(time)
    /* return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() */
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    if(month < 10){
        month = '0' + month
    }
    if(day < 10){
        day = '0' + day
    }
    
    if(min < 10){
        min = '0' + min
    }
    if(sec < 10){
        sec = '0' + sec
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
}