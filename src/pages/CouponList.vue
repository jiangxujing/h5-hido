<template>
    <!-- 我的卡券 -->
    <div class="main-content coupon-list">
        <div v-if="request">
            <div class="coupon-add" @click="$router.push({name: 'addCoupon'})">
                <img class="coupon-add-img" src="../assets/images/add.png" />创建卡券
            </div>
            <div v-if="!!couponList && couponList.length > 0" >
                <div v-for="(item, index) in couponList" :key="index" :class="item.status == '00' || item.status == '01' ? 'coupon-item' : 'coupon-item coupon-item-over'">
                    <div class="coupon-item-left">
                        <div>
                            <p class="coupon-item-amount DINAlternate-Bold"><span>￥</span>{{item.amountShow}}</p>
                            <p>{{item.statusShow}}</p>
                        </div>
                    </div>
                    <div class="coupon-item-content">
                        <p>{{item.deductionAmountShow + '元抵扣券'}}</p>
                        <p class="coupon-item-info">{{'使用人:' + item.mobile}}</p>
                        <p class="coupon-item-info">{{'有效期至' + item.expiryTime}}</p>
                    </div>
                    <!-- <div class="close-btn" @click="closeCoupon(item)" v-if="item.status == '00' || item.status == '01'">取消</div> -->
                    <div class="close-btn" @click="closeCoupon(item)" v-if="item.status == '00' || item.status == '01'"><span>取消</span></div>
                </div>
            </div>
            <div class="no-content" v-else>暂无卡券</div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { dateFormatter } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'coupon-list',
    data () {
        return {
            request: false,
            couponList: [],
            statusList: [{
                value: '00',
                label: '未消费'
            }, {
                value: '01',
                label: '未消费'
            }, {
                value: '03',
                label: '已消费'
            }, {
                value: '04',
                label: '已失效'
            }]
        }
    },
    mounted () {
        document.title = '我的卡券'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.callHandler('callInit', {interceptBack: false})
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
            api.post(api.getUrl('agent-myCoupon'), {}).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content && !!res.content.couponCodeBaseInfo && res.content.couponCodeBaseInfo.length > 0) {
                        this.couponList = res.content.couponCodeBaseInfo.map(item => {
                            let data = {}
                            data = item
                            // data.amountShow = Math.round(item.amount/100)
                            // data.deductionAmountShow = Math.round(item.deductionAmount/100)
                            data.amountShow = item.amount/100
                            data.deductionAmountShow = item.deductionAmount/100
                            data.expiryTime = item.expiryTime ? dateFormatter(item.expiryTime,  'yyyy-MM-dd') : ''
                            if (item.status !== '') {
                                this.statusList.forEach(status => {
                                    status.value == item.status ? data.statusShow = status.label : ''
                                })
                            }
                            return data
                        })
                    } else {
                        this.couponList = []
                    }
                }
            })
        },
        // 取消优惠券
        closeCoupon (item) {
            if (!item.couponNo) {return false}
            // let datas = {
            //     couponNo: item.couponNo
            // }
            // api.post(api.getUrl('customer-orderDetail'), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content) {
            //             Toast('优惠券取消成功')
            //             this.getCoupopList()
            //         }
            //     }
            // })
            Toast('暂无接口！')
        }
    }
}
</script>

<style lang="scss">

</style>