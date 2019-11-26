<template>
    <!-- 订单列表 -->
    <div class="main-content medical-order-list">
        <div v-if="request">
            <div v-if="orderList && orderList.length > 0">
                <div v-for="(item, index) in orderList" :key="index" class="order-item" @click="openDetail(item)">
                    <div class="order-item-time">{{item.time}}</div>
                    <div class="order-item-content">
                        <img class="order-img" src="../assets/images/order_icon.png" />
                        <div class="order-item-info">
                            <p>{{item.title}}</p>
                            <p class="order-item-amount DINAlternate-Bold"><span>￥</span>{{item.amountShow}}</p>
                        </div>
                        <img class="order-arrow" src="../assets/images/arrow.png" />
                    </div>
                </div>
            </div>
            <div class="no-content" v-else>暂无订单</div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import api from '../common/api.js'

export default {
    name: 'medical-order-list',
    data () {
        return {
            orderList: [],
            request: false
        }
    },
    mounted () {
        document.title = '订单列表'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.setNative('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getOrderList()
            }, 600)
        } else {
            this.getOrderList()
        }
    },
    methods: {
        // 获取订单列表
        getOrderList () {
            // api.post(api.getUrl('customer-orderList'), {}).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content && res.content.length > 0) {
            //             this.orderList = res.content.map(item => {
            //                 let data = {}
            //                 data = item
            //                 data.amountShow = Math.round(item.amount/100)
            //                 return data
            //             })
            //         } else {
            //             this.orderList = []
            //         }
            //     }
            // })
            let res = {
                content: []
            }
            res.content = [{
                orderNo: 111,
                amount: '66600',
                time: '2019/10/15 周三',
                title: '预付折扣券'
            }, {
                orderNo: 222,
                amount: '111100',
                time: '2019/10/15 周三',
                title: '项目收费'
            }, {
                orderNo: 333,
                amount: '9900',
                time: '2019/10/15 周三',
                title: '项目收费-有退费'
            }]
            this.orderList = res.content.map(item => {
                let data = {}
                data = item
                data.amountShow = Math.round(item.amount/100)
                return data
            })
            this.request = true
        },
        // 跳转订单详情
        openDetail (item) {
            if (!item.orderNo) {return false}
            let query = {
                orderNo: item.orderNo
            }
            let pageName = '/medicalOrderDetail'
            this.$router.push({
                path: pageName,
                query: query
            })
        }
    }
}
</script>

<style lang="scss">

</style>