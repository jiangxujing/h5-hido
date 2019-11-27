<template>
    <!-- 预约详情 -->
    <div class="main-content confirmed-reserve">
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
                    <p class="detail-content-item" v-if="orderForm.payAmount">
                        <span class="content-item-label">预付金</span>
                        <span class="content-item-value theme-color">{{orderForm.amount}}</span>
                    </p>
                </div>
                <div class="detail-item">
                    <p class="detail-item-title">订单信息</p>
                    <div class="detail-info">
                        <p class="detail-info-item">
                            <span class="fl-l">订单编号：</span>
                            <span class="fl-r">{{orderForm.businessNo}}</span>
                        </p>
                        <p class="detail-info-item">
                            <span class="fl-l">下单时间：</span>
                            <span class="fl-r">{{orderForm.createTime}}</span>
                        </p>
                    </div>
                </div>
                <p class="detail-tips" v-if="orderForm.isToday">温馨提示：请按照预约时间及时到店就诊</p>
            </div>
            <div class="page-button" v-if="orderForm.isToday">
                <van-button class="next-button" @click="confirmPay">确认到店</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { getQueryString, formatMoney, dateFormatter } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'confirmed-reserve',
    data () {
        return {
            request: false,
            orderForm: {
                businessNo: '',
                projectName: '',
                doctorName: '',
                reserveTime: '',
                createTime: '',
                payAmount: null,
                deductionAmount: null,
                isToday: false
            }
        }
    },
    mounted () {
        document.title = '预约详情'
        this.orderForm.businessNo = getQueryString('businessNo') ? getQueryString('businessNo') : null
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
            //     businessNo: this.orderForm.businessNo
            // }
            // api.post(api.getUrl('customer-orderDetail'), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content) {
            //             let content = res.content
            //             for (let key in content) {
            //                 if (key == 'deductionAmount' || key == 'payAmount') {
            //                     this.orderForm[key] = Math.round(content[key]/100)
            //                 } else if (key == 'createTime' || key == 'reserveTime') {
            //                     this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd hh:mm:ss') : ''
            //                 } else {
            //                     this.orderForm[key] = content[key]
            //                 }
            //             }
            //             this.orderForm.isToday = new Date(content.reserveTime).toDateString() === new Date().toDateString() ? true : false
            //             this.orderForm.amount = !!content.payAmount && content.payAmount > 0 ? '预付' + this.orderForm.payAmount + '元抵扣' + this.orderForm.deductionAmount + '元' : ''
            //         }
            //     }
            // })
            let res = {
                content: {}
            }
            res.content = {
                projectName: '鼻综合',
                doctorName: '宋一刀',
                createTime: 1574840600563,
                reserveTime: 1575040600563,
                deductionAmount: 50000,
                payAmount: 5000
            }
            let content = res.content
            for (let key in content) {
                if (key == 'deductionAmount' || key == 'payAmount') {
                    this.orderForm[key] = Math.round(content[key]/100)
                } else if (key == 'createTime' || key == 'reserveTime') {
                    this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd hh:mm:ss') : ''
                } else {
                    this.orderForm[key] = content[key]
                }
            }
            this.orderForm.isToday = new Date(content.reserveTime).toDateString() === new Date().toDateString() ? true : false
            this.orderForm.amount = !!content.payAmount && content.payAmount > 0 ? '预付' + this.orderForm.payAmount + '元抵扣' + this.orderForm.deductionAmount + '元' : ''
            this.request = true
        },
        // 确认到店
        confirmPay () {
            // let datas = {
            //     reservationNo: this.orderForm.businessNo
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
            Toast('确认到店成功')
            this.$router.push({name: 'medicalOrderList'})
        }
    }
}
</script>

<style lang="scss">

</style>