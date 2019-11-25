<template>
    <!-- 我的折扣券 -->
    <div class="main-content coupon-list">
        <div class="coupon-add" @click="$router.push({name: 'addCoupon'})">
            <img class="coupon-add-img" src="../assets/images/addbank.png" />创建卡券
        </div>
        <div v-for="(item, index) in couponList" :key="index" :class="item.status == '00' ? 'coupon-item' : 'coupon-item coupon-item-over'">
            <div class="coupon-item-left">
                <p class="coupon-item-amount DINAlternate-Bold"><span>￥</span>{{item.amountShow}}</p>
                <p>{{item.statusShow}}</p>
            </div>
            <div class="coupon-item-right">
                <p>{{item.deductionAmountShow + '元抵扣券'}}</p>
                <p class="coupon-item-phone"><span>使用人：</span>{{item.agentPhone}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import api from '../common/api.js'

export default {
    name: 'coupon-list',
    data () {
        return {
            couponList: [],
            statusList: [{
                value: '00',
                label: '未消费'
            }, {
                value: '01',
                label: '已消费'
            }],
        }
    },
    mounted () {
        document.title = '我的折扣券'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.setNative('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getCoupopList()
            }, 600)
        } else {
            this.getCoupopList()
        }
    },
    methods: {
        // 获取折扣券列表
        getCoupopList () {
            // api.post(api.getUrl('agent-queryBindBankList'), {}).then(res => {
            //     if (!!res && res.code === 0) {
            //         if (!!res.content && res.content.length > 0) {
            //             this.couponList = res.content.map(item => {
            //                 let data = {}
            //                 data = item
            //                 data.amountShow = Math.round(item.amount/100)
            //                 data.deductionAmountShow = Math.round(item.deductionAmount/100)
            //                 if (item.status !== '') {
            //                     this.statusList.forEach(status =>{
            //                         status.value == item.status ? data.statusShow = status.label : ''
            //                     })
            //                 }
            //                 return data
            //             })
            //         } else {
            //             this.couponList = []
            //         }
            //     }
            // })
            let res = {
                content: []
            }
            res.content = [{
                status: '00',
                amount: '66600',
                deductionAmount: '99900',
                agentPhone: '18734342343'
            }, {
                status: '00',
                amount: '111100',
                deductionAmount: '200000',
                agentPhone: '18734342344'
            }, {
                status: '01',
                amount: '9900',
                deductionAmount: '50000',
                agentPhone: '18734342345'
            }]
            this.couponList = res.content.map(item => {
                let data = {}
                data = item
                data.amountShow = Math.round(item.amount/100)
                data.deductionAmountShow = Math.round(item.deductionAmount/100)
                if (item.status !== '') {
                    this.statusList.forEach(status =>{
                        status.value == item.status ? data.statusShow = status.label : ''
                    })
                }
                return data
            })
        }
    }
}
</script>

<style lang="scss">

</style>