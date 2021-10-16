/* 
    包含应用中所有接口请求函数模块
    每个函数的返回值都是promise
*/
import ajax from "./ajax"

const BASE = ''

//登录
export const reqLogin = (username, password) => ajax( BASE + '/login', {username, password}, 'POST')

//获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax( BASE + '/manage/category/list', {parentId})

//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax( BASE + 'manage/category/add', {parentId, categoryName}, 'POST')

//删除分类
 export const reqDeleteCategory = (categoryId) => ajax( BASE + '/manage/category/delete',{categoryId}, 'POST')

//更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax( BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

//获取一个分类
export const reqCategory = (categoryId) => ajax( BASE + '/manage/category/info', {categoryId})

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax( BASE + '/manage/product/list',{pageNum, pageSize})

//获取所有商品
export const reqTotalProducts = () => ajax( BASE + '/manage/product/total' )

//更新商品状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax( BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

/*
搜索商品分页列表(根据商品名称/商品描述) 
searchType：搜索的类型, productName/productDesc
*/
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax( BASE + '/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]: searchName
})

//删除指定名称的图片
export const reqDeleteImg = (name) => ajax( BASE + '/manage/img/delete', {name}, 'POST')

//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax( BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST' )

//修改商品
// export const reqUpdateProduct = () => ajax( BASE + '/manage/product/update', 'POST' )'/manage/role/list

//删除商品
export const reqDeleteProduct = (productId) => ajax( BASE +'/manage/product/delete', {productId}, 'POST' )

//获取所有角色的列表
export const reqRoles = () => ajax( BASE + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax( BASE + '/manage/role/add', {roleName}, 'POST' )

//更新角色(设置角色权限)
export const reqUpdateRole = (role) => ajax( BASE + '/manage/role/update', role, 'POST' )

//删除角色
export const reqDeleteRole = (roleId) => ajax( BASE + '/mange/role/delete',{roleId},'POST' )

//获取用户列表
export const reqUsers = () => ajax( BASE + '/manage/user/list' )

//删除指定用户
export const reqDeleteUser = (userId) => ajax( BASE + '/manage/user/delete', {userId}, 'POST' )

//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax( BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//添加订单
//export const reqAddOrUpdateOrder = (order) => ajax( BASE + '/manage/order/' + (order._id ? 'add' : 'update'), order, 'POST' )
export const reqAddOrder = (order) => ajax( BASE + '/manage/order/add', order, 'POST' )

//修改订单
export const reqUpdateOrder = (order) => ajax( BASE + '/manage/order/update', order, "POST"  )

//获取全部订单
// export const reqOrderTotal = () => ajax( BASE + '/manage/order/total' )

//获取订单分页列表
export const reqOrderList = (pageNum,pageSize) => ajax( BASE + '/manage/order/list',{pageNum,pageSize} )

//删除订单
export const reqDeleteOrder = (orderId) => ajax( BASE +'/manage/order/delete', {orderId}, 'POST' )

/*
搜索订单分页列表(根据订单的编号/订单用户)
searchType：搜索的类型, orderId/username
*/
export const reqSearchOrder = ({pageNum, pageSize, searchName}) => ajax( BASE + '/manage/order/search',{
    pageNum,
    pageSize,
    searchName
} )