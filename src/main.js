import Vue from 'vue'
// import Vant from 'vant'
import App from './App'
import router from './router.js'
import api from './common/api.js'
import utils from './common/utils.js'
import 'vant/lib/button/style'

import { Toast, Popup, Field, Button, Cell, CellGroup, Icon, Checkbox, CheckboxGroup, DropdownMenu, DropdownItem, Collapse, CollapseItem, ActionSheet, DatetimePicker } from 'vant'

Vue.component(Toast.name, Toast)
Vue.component(Popup.name, Popup)
Vue.component(Field.name, Field)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(CellGroup.name, CellGroup)
Vue.component(Icon.name, Icon)
Vue.component(Checkbox.name, Checkbox)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(Collapse.name, Collapse)
Vue.component(CollapseItem.name, CollapseItem)
Vue.component(ActionSheet.name, ActionSheet)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.use(Toast, Popup, Field, Button, Cell, CellGroup, Icon, Checkbox, CheckboxGroup, DropdownMenu, DropdownItem, Collapse, CollapseItem, ActionSheet, DatetimePicker)

// 将方法绑定到全局
Vue.prototype.$utils = utils
Vue.prototype.$api = api

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    next()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
