<template>
    <!-- 我的折扣券 -->
    <div class="main-content coupon-list">
        <div class="coupon-add" @click="$router.push({name: 'addCoupon'})">
            <img class="coupon-add-img" src="../assets/images/addbank.png" />创建卡券
        </div>
        <div v-for="(item, index) in couponList" :key="index" class="coupon-item">

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
            couponList: []
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
            //                 return data
            //             })
            //         } else {
            //             this.couponList = []
            //         }
            //     }
            // })
            this.couponList = [{
                status: '未消费',
                amount: '39900',
                deductionAmount: '30000',
                agentPhone: '18734342345'
            }, {
                status: '未消费',
                amount: '39900',
                deductionAmount: '30000',
                agentPhone: '18734342345'
            }, {
                status: '未消费',
                amount: '39900',
                deductionAmount: '30000',
                agentPhone: '18734342345'
            }]
        }
    }
}
</script>

<style lang="scss">

</style>