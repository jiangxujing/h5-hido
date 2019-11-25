<template>
    <!-- 订单详情 -->
    <div class="main-content medical-order-detail">
        <div v-if="request">
            <p>{{'订单No: ' + orderForm.orderNo}}</p>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { getQueryString } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'medical-order-detail',
    data () {
        return {
            request: false,
            orderForm: {
                orderNo: ''
            }
        }
    },
    mounted () {
        document.title = '订单详情'
        this.orderForm.orderNo = getQueryString('orderNo') ? getQueryString('orderNo') : null
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.setNative('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getOrderDetail()
            }, 600)
        } else {
            this.getOrderDetail()
        }
    },
    methods: {
        // 获取订单详情
        getOrderDetail () {
            this.request = true
        }
    }
}
</script>

<style lang="scss">

</style>