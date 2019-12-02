<template>
    <!-- 预约详情 -->
    <div class="main-content reserve-detail">
        <div v-if="request">
            <div class="detail-info">
                <p class="detail-info-item">
                    <span class="fl-l">{{'订单号:' + orderForm.businessNo}}</span>
                    <span class="fl-r">{{'下单时间:' + orderForm.createTime}}</span>
                </p>
            </div>
            <div class="detail-content">
                <p class="detail-content-item">
                    <span class="fl-l">预约项目：</span>
                    <span class="fl-r">{{orderForm.medicineItemName}}</span>
                </p>
                <p class="detail-content-item">
                    <span class="fl-l">医生：</span>
                    <span class="fl-r">{{orderForm.doctorName}}</span>
                </p>
                <p class="detail-content-item">
                    <span class="fl-l">面诊时间：</span>
                    <span class="fl-r">{{orderForm.appointmentDate}}</span>
                </p>
                <p class="detail-content-item" v-if="orderForm.payAmount">
                    <span class="fl-l">预付金：</span>
                    <span class="fl-r theme-color">{{orderForm.amount}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { getQueryString, formatMoney, dateFormatter } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'reserve-detail',
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
                                this.orderForm[key] = formatMoney(content[key], 1)
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
                        this.orderForm.amount = !!content.payAmount && content.payAmount > 0 ? '预付￥' + this.orderForm.payAmount + '抵￥' + this.orderForm.deductionAmount : ''
                    }
                }
            })
            // let res = {
            //     content: {}
            // }
            // res.content = {
            //     medicineItemName: '鼻综合',
            //     doctorName: '宋一刀',
            //     businessNo: '4838488888574848',
            //     createTime: 1574840600563,
            //     appointmentDate: 1575040600563,
            //     deductionAmount: 50000,
            //     payAmount: 5000
            // }
            // let content = res.content
            // for (let key in content) {
            //     if (key == 'deductionAmount' || key == 'payAmount') {
            //         // this.orderForm[key] = Math.round(content[key]/100)
            //         this.orderForm[key] = formatMoney(content[key], 1)
            //     } else if (key == 'createTime' || key == 'appointmentDate') {
            //         this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd HH:mm:ss') : ''
            //     } else {
            //         this.orderForm[key] = content[key]
            //     }
            // }
            // this.orderForm.amount = !!content.payAmount && content.payAmount > 0 ? '预付￥' + this.orderForm.payAmount + '抵￥' + this.orderForm.deductionAmount : ''
            // this.request = true
        }
    }
}
</script>

<style lang="scss">

</style>