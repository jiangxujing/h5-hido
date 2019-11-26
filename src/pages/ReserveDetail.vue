<template>
    <!-- 预约详情 -->
    <div class="main-content reserve-detail">
        <div class="main-content-request" v-if="request">
            <div>
                <div class="detail-content">
                    <p class="detail-content-item">
                        <span class="content-item-label">预约项目</span>
                        <span class="content-item-value">{{orderForm.projectName}}</span>
                    </p>
                    <p class="detail-content-item">
                        <span class="content-item-label">医师</span>
                        <span class="content-item-value">{{orderForm.doctorName}}</span>
                    </p>
                    <p class="detail-content-item">
                        <span class="content-item-label">面诊时间</span>
                        <span class="content-item-value">{{orderForm.reserveTime}}</span>
                    </p>
                    <p class="detail-content-item" v-if="orderForm.deductionCode">
                        <span class="content-item-label">预付金</span>
                        <span class="content-item-value theme-color">{{orderForm.amount}}</span>
                    </p>
                </div>
                <div class="detail-item">
                    <p class="detail-item-title">订单信息</p>
                    <div class="detail-info">
                        <p class="detail-info-item">
                            <span class="fl-l">订单编号：</span>
                            <span class="fl-r">{{orderForm.orderNo}}</span>
                        </p>
                        <p class="detail-info-item">
                            <span class="fl-l">下单时间：</span>
                            <span class="fl-r">{{orderForm.reserveTime}}</span>
                        </p>
                    </div>
                </div>
                <p class="detail-tips" v-if="orderForm.status == '00'">温馨提示：请按照预约时间及时到店就诊</p>
            </div>
            <div class="page-button" v-if="orderForm.status == '00'">
                <van-button class="next-button" @click="confirmPay">确认到店</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { getQueryString, formatMoney } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'reserve-detail',
    data () {
        return {
            request: false,
            orderForm: {
                orderNo: '',
                status: '',
                projectName: '',
                doctorName: '',
                reserveTime: '',
                deductionCode: '',
                payAmount: null,
                deductionAmount: null
            }
        }
    },
    mounted () {
        document.title = '预约详情'
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
            // let datas = {
            //     orderNo: this.orderForm.orderNo
            // }
            // api.post(api.getUrl('customer-orderDetail'), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content) {
                        
            //         }
            //     }
            // })
            let res = {
                content: {}
            }
            res.content = {
                status: '00',
                projectName: '鼻综合',
                doctorName: '宋一刀',
                reserveTime: '2019-10-23 09:00:00',
                deductionCode: '95682',
                deductionAmount: 50000,
                payAmount: 5000
            }
            let content = res.content
            for (let key in content) {
                if (key == 'deductionAmount' || key == 'payAmount') {
                    this.orderForm[key] = Math.round(content[key]/100)
                } else {
                    this.orderForm[key] = content[key]
                }
            }
            this.orderForm.amount = this.orderForm.deductionCode ? '预付' + this.orderForm.payAmount + '元抵扣' + this.orderForm.deductionAmount + '元' : ''
            this.request = true
        },
        // 确认到店
        confirmPay () {
            // let datas = {
            //     orderNo: this.orderForm.orderNo
            // }
            // api.post(api.getUrl('customer-orderDetail'), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content) {
            //             Toast('确认到店成功')
            //             this.getOrderDetail()
            //         }
            //     }
            // })
            this.orderForm.status = '01'
            Toast('确认到店成功')
        }
    }
}
</script>

<style lang="scss">

</style>