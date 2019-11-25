<template>
    <!-- 订单列表 -->
    <div class="main-content medical-order-list">
        <div v-if="request">
            <div v-if="orderList && orderList.length > 0">
                <div v-for="(item, index) in orderList" :key="index" class="order-item" @click="openDetail(item)">
                    <div class="order-item-time">{{item.time}}</div>
                    <div class="order-item-content">
                        <img class="order-img" src="../assets/images/orderIcon.png" />
                        <div class="order-item-info">
                            <p>{{item.statusShow}}</p>
                            <p class="order-item-amount DINAlternate-Bold"><span>￥</span>{{item.amountShow}}</p>
                        </div>
                        <img src="../assets/images/arrow.png" class="order-arrow" />
                    </div>
                </div>
            </div>
            <div class="no-content" v-else>暂无订单</div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { formatMoney } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'medical-order-list',
    data () {
        return {
            orderList: [],
            statusList: [{
                value: '00',
                label: '预付折扣券'
            }, {
                value: '01',
                label: '项目收费'
            }, {
                value: '02',
                label: '项目收费-有退费'
            }],
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
            // api.post(api.getUrl('agent-queryBindBankList'), {}).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content && res.content.length > 0) {
            //             this.orderList = res.content.map(item => {
            //                 let data = {}
            //                 data = item
            //                 data.amountShow = formatMoney(item.amount, 0)
            //                 data.deductionAmountShow = formatMoney(item.deductionAmount, 0)
            //                 if (item.status !== '') {
            //                     this.statusList.forEach(status =>{
            //                         status.value == item.status ? data.statusShow = status.label : ''
            //                     })
            //                 }
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
                status: '00',
                amount: '66600',
                photo: '',
                time: '2019/10/15 周三'
            }, {
                orderNo: 222,
                status: '01',
                amount: '111100',
                photo: '',
                time: '2019/10/15 周三'
            }, {
                orderNo: 333,
                status: '02',
                amount: '9900',
                photo: '',
                time: '2019/10/15 周三'
            }]
            this.orderList = res.content.map(item => {
                let data = {}
                data = item
                data.amountShow = Math.round(item.amount/100)
                if (item.status !== '') {
                    this.statusList.forEach(status =>{
                        status.value == item.status ? data.statusShow = status.label : ''
                    })
                }
                return data
            })
            this.request = true
        },
        openDetail (item) {
            if (!item.orderNo) {return false}
            let query = {
                orderNo: item.orderNo
            }
            let pageName = item.status == '00' ? '/medicalOrderDetail' : '/medicalOrderDetail'
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