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
import myBankCard from '@/pages/MyBankCard'
import accountBalance from '@/pages/AccountBalance'
import withdrawSucess from '@/pages/WithdrawSucess'
import privacyPolicy from '@/agreement/PrivacyPolicy'
import registerProtocol from '@/agreement/RegisterProtocol'
import orderSuccess from '@/pages/OrderSuccess'
import couponList from '@/pages/CouponList'
import addCoupon from '@/pages/AddCoupon'
import medicalOrderList from '@/pages/MedicalOrderList'
import medicalOrderDetail from '@/pages/MedicalOrderDetail'
import reportList from '@/pages/ReportList'
import referrerPhone from '@/pages/ReferrerPhone'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
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
        	path: '/myBankCard',
            component: myBankCard,
            name:'myBankCard'
        },{
        	path: '/accountBalance',
            component: accountBalance,
            name:'accountBalance'	
        },{
        	path: '/withdrawSucess',
            component: withdrawSucess,
            name:'withdrawSucess'
        },{
        	path: '/privacyPolicy',
            component: privacyPolicy,
            name:'privacyPolicy'	
        },{
        	path: '/registerProtocol',
            component: registerProtocol,
            name:'registerProtocol'
        },{
        	path: '/orderSuccess',
            component: orderSuccess,
            name:'orderSuccess'
        },{
        	path: '/couponList',
            component: couponList,
            name:'couponList'
        },{
        	path: '/addCoupon',
            component: addCoupon,
            name:'addCoupon'
        },{
        	path: '/medicalOrderList',
            component: medicalOrderList,
            name:'medicalOrderList'
        },{
        	path: '/medicalOrderDetail',
            component: medicalOrderDetail,
            name:'medicalOrderDetail'
        },{
        	path: '/reportList',
            component: reportList,
            name:'reportList'
        },{
        	path: '/referrerPhone',
            component: referrerPhone,
            name:'referrerPhone'
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})
