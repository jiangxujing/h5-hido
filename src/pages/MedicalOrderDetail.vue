<template>
    <!-- 订单详情 -->
    <div class="main-content medical-order-detail">
        <div class="main-content-request" v-if="request">
            <div class="order-detail">
                <div>
                    <div class="detail-item">
                        <p class="detail-item-title">收费项目</p>
                        <div class="detail-item-content">
                            <div v-for="(item, index) in orderForm.orderItemList" :key="index" class="item-info">
                                <div class="item-info-name">{{item.itemName}}</div>
                                <div class="item-info-count">{{item.itemCount ? 'X' + item.itemCount : ''}}</div>
                                <div class="item-info-price">
                                    <span v-if="item.salesAmount !== null ">{{'￥' + $utils.formatMoney(item.salesAmount, 1)}}</span>
                                    <span class="original-amount" v-if="!!item.originalPrice && item.originalPrice !== item.salesAmount">{{'￥' + $utils.formatMoney(item.originalPrice, 1)}}</span>
                                    <span class="theme-color" v-if="item.writeoffAmount">{{'-￥' + $utils.formatMoney(item.writeoffAmount, 1)}}</span>
                                </div>
                            </div>
                        </div>
                        <p class="total-fees"><span class="fl-l">小计</span><span class="fl-r">{{'￥' + $utils.formatMoney(orderForm.totalFees, 1)}}</span></p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-item-title">订单信息</p>
                        <div class="detail-info">
                            <p class="detail-info-item">
                                <span class="detail-info-l">开单号：</span>
                                <span class="detail-info-r">{{orderForm.meiyaOrderNo}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="detail-info-l">开单人：</span>
                                <span class="detail-info-r">{{orderForm.meiyaOrderWriter}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="detail-info-ll">开单时间：</span>
                                <span class="detail-info-r">{{orderForm.meiyaOrderOpenTime}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="detail-info-l">备注：</span>
                                <span class="detail-info-r">{{orderForm.meiyaOrderMemo}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="detail-item" v-if="!!businessNo">
                        <p class="detail-item-title">支付信息</p>
                        <div class="detail-info">
                            <p class="detail-info-item">
                                <span class="detail-info-l">支付方式：</span>
                                <span class="detail-info-r">{{orderForm.payType}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="detail-info-l">支付时间：</span>
                                <span class="detail-info-r">{{orderForm.payTime}}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="order-detail-foot" v-if="!!meiyaOrderNo && !businessNo">
                    <span class="foot-total-fees DINAlternate-Bold">{{'￥' + $utils.formatMoney(orderForm.totalFees, 1)}}</span>{{'已优惠￥' + $utils.formatMoney(orderForm.totalOffer, 1)}}
                    <van-button class="pay-button fl-r" @click="confirmPay">确认支付</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { dateFormatter, getQueryString, formatMoney, getpPayType } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'medical-order-detail',
    data () {
        return {
            request: false,
            businessNo: '',
            meiyaOrderNo: '',
            orderForm: {
                status: '',
                orderItemList: [],
                packageWriteoffs: [],
                meiyaOrderNo: '',
                meiyaOrderWriter: '',
                meiyaOrderOpenTime: '',
                meiyaOrderMemo: '',
                totalFees: 0,
                totalOffer: 0
            }
        }
    },
    mounted () {
        this.meiyaOrderNo = getQueryString('meiyaOrderNo') ? getQueryString('meiyaOrderNo') : null
        this.businessNo = getQueryString('businessNo') ? getQueryString('businessNo') : null
        document.title = !!this.businessNo ? '订单详情' : '等待支付'
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
            if (!this.meiyaOrderNo && !this.businessNo) {
                return false
            }
            let datas = {}
            let apiUrl = ''
            !!this.meiyaOrderNo ?
                (datas.meiyaOrderNo = this.meiyaOrderNo, apiUrl = 'customer-feeOrderPreview') :
                (datas.businessNo = this.businessNo, apiUrl = 'customer-feeOrderDetail')
            api.post(api.getUrl(apiUrl), datas).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content) {
                        let content = res.content
                        let totalFees = 0
                        let totalOffer = 0
                        for (let key in content) {
                            if (key == 'orderItemList') {
                                let orderItemList = content[key] ? content[key] : []
                                orderItemList.forEach(item => {
                                    let data = {
                                        itemNo: item.itemNo,
                                        itemName: item.itemName,
                                        itemCount: item.itemCount,
                                        salesAmount: item.salesAmount,
                                        originalPrice: item.originalPrice
                                    }
                                    totalFees += item.salesAmount
                                    item.originalPrice > item.salesAmount ? totalOffer += (item.originalPrice - item.salesAmount) : ''
                                    this.orderForm[key].push(data)
                                })
                            } else if (key == 'packageWriteoffs') {
                                let packageWriteoffs = content[key] ? content[key] : []
                                packageWriteoffs.forEach(item => {
                                    let data = {
                                        itemNo: item.itemNo,
                                        itemName: item.itemName,
                                        writeoffAmount: item.writeoffAmount,
                                        salesAmount: null
                                    }
                                    totalFees = totalFees - item.writeoffAmount
                                    totalOffer += item.writeoffAmount
                                    this.orderForm['orderItemList'].push(data)
                                })
                            } else if (key == 'deductionAmount' && content[key]) {
                                let data = {
                                    itemName: '预付金抵扣',
                                    writeoffAmount: content[key],
                                    salesAmount: null
                                }
                                totalFees = totalFees - content[key]
                                totalOffer += content[key]
                                this.orderForm['orderItemList'].push(data)
                            } else if ((key == 'meiyaOrderOpenTime' || key == 'payTime') && !!this.businessNo) {
                                this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd HH:mm:ss') : ''
                            } else {
                                this.orderForm[key] = content[key]
                            }
                        }
                        this.orderForm.totalFees = totalFees
                        this.orderForm.totalOffer = totalOffer
                    }
                }
            })
        },
        // 确认支付
        confirmPay () {
            let datas = {
                meiyaOrderNo: this.orderForm.meiyaOrderNo
            }
            api.post(api.getUrl('customer-createFeeOrder'), datas).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content) {
                        let query = {
                            orderAmount: res.content.actualAmount,
                            orderNo: res.content.businessNo,
                            fromOrder: 1
                        }
                        let pageName = '/paymentList'
                        this.$router.push({
                            path: pageName,
                            query: query
                        })
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>