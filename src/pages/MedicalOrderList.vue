<template>
    <!-- 订单列表 -->
    <div class="main-content medical-order-list">
        <div v-if="request">
            <div v-if="orderList && orderList.length > 0">
                <div v-for="(item, index) in orderList" :key="index" class="order-item" @click="openDetail(item)">
                    <div class="order-item-time">{{item.timeShow}}</div>
                    <div class="order-item-content">
                        <img class="order-img" src="../assets/images/order_icon.png" />
                        <div class="order-item-info">
                            <p>{{item.title}}</p>
                            <p class="order-item-amount DINAlternate-Bold"><span>￥</span>{{$utils.formatMoney(item.amount, 1)}}</p>
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
import { dateFormatter } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'medical-order-list',
    data () {
        return {
            orderList: [],
            request: false,
            weekDay: [' 周日', ' 周一', ' 周二', ' 周三', ' 周四', ' 周五', ' 周六']
        }
    },
    mounted () {
        document.title = '订单列表'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.callHandler('callInit', {interceptBack: false})
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
            api.post(api.getUrl('customer-orderList'), {}).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content && res.content.length > 0) {
                        this.orderList = res.content.map(item => {
                            let data = {}
                            data = item
                            data.createTime = item.createTime ? dateFormatter(new Date(item.createTime), 'yyyy/MM/dd') : ''
                            data.timeShow = data.createTime + this.weekDay[new Date(Date.parse(data.createTime)).getDay()]
                            return data
                        })
                    } else {
                        this.orderList = []
                    }
                }
            })
        },
        // 跳转订单详情
        openDetail (item) {
            if (!item.businessNo) {return false}
            let query = {
                businessNo: item.businessNo
            }
            let pageName = item.type == 'RES' ? '/reserveDetail' : '/medicalOrderDetail'
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