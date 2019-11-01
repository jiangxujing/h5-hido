import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/Login'
import productDetail from '@/pages/ProductDetail'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
    mode: 'history', 
    base:'/h5-hido/', //为了配置产线找不到静态文件添加
    routes: [
        {
            path: '/login',
            component: login,
            name:'login'
        }, {
            path: '/productDetail',
            component: productDetail,
            name:'productDetail'
        }
    ]
})
