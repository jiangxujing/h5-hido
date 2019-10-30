import Vue from 'vue'
import App from './App'
import router from './router.js'
import api from './common/api.js'
import utils from './common/utils.js'


// 将工具方法绑定到全局
Vue.prototype.$utils = utils
// 将API方法绑定到全局
Vue.prototype.$api = api
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    document.title = 'hido'
    next()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
