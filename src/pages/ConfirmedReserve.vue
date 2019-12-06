<template>
    <!-- 预约详情 -->
    <div class="main-content confirmed-reserve">
        <div v-if="request">
            <div class="detail-content">
                <p class="detail-content-item">
                    <span class="content-item-label">预约项目</span>
                    <span class="content-item-value">{{orderForm.medicineItemName}}</span>
                </p>
                <p class="detail-content-item">
                    <span class="content-item-label">医师</span>
                    <span class="content-item-value">{{orderForm.doctorName}}</span>
                </p>
                <p class="detail-content-item">
                    <span class="content-item-label">面诊时间</span>
                    <span class="content-item-value">{{orderForm.appointmentDate}}</span>
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
            <p class="detail-tips">温馨提示：请按照预约时间及时到店就诊</p>
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
                medicineItemName: '',
                doctorName: '',
                appointmentDate: '',
                createTime: '',
                payAmount: null,
                deductionAmount: null
            }
        }
    },
    mounted () {
        document.title = '预约详情'
        this.orderForm.businessNo = getQueryString('businessNo') ? getQueryString('businessNo') : null
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.callHandler('callInit', {interceptBack: false})
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
            let datas = {
                businessNo: this.orderForm.businessNo
            }
            api.post(api.getUrl('customer-reserveDetail'), datas).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content) {
                        let content = res.content
                        for (let key in content) {
                            if (key == 'deductionAmount' || key == 'payAmount') {
                                // this.orderForm[key] = Math.round(content[key]/100)
                                this.orderForm[key] = content[key]/100
                            } else if (key == 'createTime') {
                                this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd HH:mm:ss') : ''
                            } else if (key == 'appointmentDate') {
                                let appointmentDate = new Date(content[key])
                                let endTime = appointmentDate.setHours(appointmentDate.getHours()+1)
                                this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd HH:mm') + '-' + dateFormatter(endTime, 'HH:mm') : ''
                            } else {
                                this.orderForm[key] = content[key]
                            }
                        }
                        this.orderForm.amount = !!content.payAmount && content.payAmount > 0 ? '预付' + this.orderForm.payAmount + '元抵扣' + this.orderForm.deductionAmount + '元' : ''
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>