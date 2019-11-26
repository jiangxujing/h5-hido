<template>
    <!-- 订单详情 -->
    <div class="main-content medical-order-detail">
        <div class="main-content-request" v-if="request">
            <div class="order-detail" v-if="orderForm.status == '00' || orderForm.status == '01'">
                <div>
                    <div class="detail-item">
                        <p class="detail-item-title">收费项目</p>
                        <div class="detail-item-content">
                            <div v-for="(item, index) in orderForm.chargeItem" :key="index" class="item-info">
                                <div class="item-info-name">{{item.name}}</div>
                                <div class="item-info-count">{{item.count ? 'X' + item.count : ''}}</div>
                                <div class="item-info-price">
                                    <span v-if="item.salesPrice">{{'￥' + item.salesPrice}}</span>
                                    <span class="originalPrice" v-if="!!item.originalPrice && item.originalPrice !== item.salesPrice">{{'￥' + item.originalPrice}}</span>
                                    <span class="theme-color" v-if="item.price">{{'-￥' + item.price}}</span>
                                </div>
                            </div>
                        </div>
                        <p class="total-fees"><span class="fl-l">小计</span><span class="fl-r">{{'￥' + orderForm.totalFees}}</span></p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-item-title">订单信息</p>
                        <div class="detail-info">
                            <p class="detail-info-item">
                                <span class="fl-l">开单号：</span>
                                <span class="fl-r">{{orderForm.projectItemNo}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">开单人：</span>
                                <span class="fl-r">{{orderForm.doctorName}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">开单时间：</span>
                                <span class="fl-r">{{orderForm.time}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">备注：</span>
                                <span class="fl-r">{{orderForm.remark}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="detail-item" v-if="orderForm.status == '01'">
                        <p class="detail-item-title">支付信息</p>
                        <div class="detail-info">
                            <p class="detail-info-item">
                                <span class="fl-l">支付方式：</span>
                                <span class="fl-r">{{orderForm.payType}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">支付世间：</span>
                                <span class="fl-r">{{orderForm.payTime}}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="order-detail-foot" v-if="orderForm.status == '00'">
                    <span class="foot-total-fees DINAlternate-Bold">{{'￥' + orderForm.totalFees}}</span>{{'已优惠￥' + orderForm.totalOffer}}
                    <van-button class="pay-button fl-r" @click="confirmPay">确认支付</van-button>
                </div>
            </div>
            <p v-else>{{'订单No: ' + orderForm.orderNo}}</p>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { getQueryString, formatMoney } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'medical-order-detail',
    data () {
        return {
            request: false,
            orderForm: {
                orderNo: '',
                status: '',
                chargeItem: [],
                gift: {},
                projectItemNo: '',
                doctorName: '',
                time: '',
                remark: '',
                deductionAmount: null,
                totalFees: null,
                totalOffer: null
            }
        }
    },
    mounted () {
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
                orderNo: '',
                status: '00',
                chargeItem: [{
                    name: '血常规',
                    count: 1,
                    originalPrice: 10000,
                    salesPrice: 8000
                }, {
                    name: '乙肝表面抗原',
                    count: 1,
                    originalPrice: 8000,
                    salesPrice: 8000
                }, {
                    name: '名字贼长贼长贼长贼长贼长贼长贼长还不够长还要长长长',
                    count: 1,
                    originalPrice: 8000,
                    salesPrice: 8000
                }, {
                    name: '束身衣',
                    count: 1,
                    originalPrice: 50000,
                    salesPrice: 50000
                }],
                gift:{
                    name: '束身衣',
                    price: 50000
                },
                prepaymentAmount: 11000,
                projectItemNo: '1284738585',
                doctorName: '宋一刀',
                time: '2019-10-23 09:00:00',
                remark: '局麻化验套餐',
                deductionAmount: 11100,
                totalFees: 39900,
                totalOffer: 62000
            }
            let content = res.content
            for (let key in content) {
                if (key == 'chargeItem') {
                    let chargeItem = content[key]
                    chargeItem.forEach(item => {
                        let data = {
                            name: item.name,
                            count: item.count,
                            originalPrice: formatMoney(item.originalPrice, 1),
                            salesPrice: formatMoney(item.salesPrice, 1)
                        }
                        this.orderForm[key].push(data)
                    })
                } else if (key == 'gift') {
                    let data = {
                        name: content[key].name+'(礼包)',
                        price: formatMoney(content[key].price, 1)
                    }
                    this.orderForm['chargeItem'].push(data)
                } else if (key == 'prepaymentAmount') {
                    let data = {
                        name: '预付金抵扣',
                        price: formatMoney(content[key], 1)
                    }
                    this.orderForm['chargeItem'].push(data)
                } else if (key == 'deductionAmount' || key == 'totalFees' || key == 'totalOffer') {
                    this.orderForm[key] = formatMoney(content[key], 1)
                } else {
                    this.orderForm[key] = content[key]
                }
            }
            document.title = this.orderForm.status == '00' ? '等待支付' : '订单详情'
            this.request = true
        },
        // 确认支付
        confirmPay () {
            // let datas = {
            //     orderNo: this.orderForm.orderNo
            // }
            // api.post(api.getUrl('customer-orderDetail'), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content) {
            //             this.getOrderDetail()
            //         }
            //     }
            // })
            this.orderForm.status = '01'
            document.title = '订单详情'
            this.orderForm.payType = '微信支付'
            this.orderForm.payTime = '2019-10-23 09:00:00'
        }
    }
}
</script>

<style lang="scss">

</style>