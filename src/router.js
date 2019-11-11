import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/Login'
import productDetail from '@/pages/ProductDetail'
import orderDetail from '@/pages/OrderDetail'
import shippingAddress from '@/pages/ShippingAddress'
import giftPackage from '@/pages/GiftPackage'
import giftPackageDetail from '@/pages/GiftPackageDetail'
import commonProblem from '@/pages/CommonProblem'
import addBankCard from '@/pages/AddBankCard'
import paymentMethod from '@/pages/PaymentMethod'
import balanceWithdrawal from '@/pages/BalanceWithdrawal'
import myTeam from '@/pages/MyTeam'
import accountBalance from '@/pages/AccountBalance'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
    mode: 'history', 
    base:'/hido-h5/', //为了配置产线找不到静态文件添加
    routes: [
        {
            path: '/login',
            component: login,
            name:'login'
        }, {
            path: '/productDetail',
            component: productDetail,
            name:'productDetail'
        },{
        	 path: '/orderDetail',
            component: orderDetail,
            name:'orderDetail'
        },{
        	path: '/shippingAddress',
            component: shippingAddress,
            name:'shippingAddress'
        },{
        	path: '/giftPackage',
            component: giftPackage,
            name:'giftPackage'
        },{
        	path: '/giftPackageDetail',
            component: giftPackageDetail,
            name:'giftPackageDetail'
        },{
        	path: '/commonProblem',
            component: commonProblem,
            name:'commonProblem'
        },{
        	path: '/addBankCard',
            component: addBankCard,
            name:'addBankCard'
        },{
        	path: '/paymentMethod',
            component: paymentMethod,
            name:'paymentMethod'
        },{
        	path: '/balanceWithdrawal',
            component: balanceWithdrawal,
            name:'balanceWithdrawal'
        },{
        	path: '/myTeam',
            component: myTeam,
            name:'myTeam'
        },{
        	path: '/accountBalance',
            component: accountBalance,
            name:'accountBalance'	
        }
    ]
})
