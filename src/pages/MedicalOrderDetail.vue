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
                                    <span v-if="item.amount">{{'￥' + item.amount}}</span>
                                    <span class="original-amount" v-if="!!item.originalAmount && item.originalAmount !== item.amount">{{'￥' + item.originalAmount}}</span>
                                    <span class="theme-color" v-if="item.writeoffAmount">{{'-￥' + item.writeoffAmount}}</span>
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
                                <span class="fl-r">{{orderForm.meiyaOrderNo}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">开单人：</span>
                                <span class="fl-r">{{orderForm.meiyaOrderWriter}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">开单时间：</span>
                                <span class="fl-r">{{orderForm.meiyaOrderOpenTime}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">备注：</span>
                                <span class="fl-r">{{orderForm.meiyaOrderMemo}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="detail-item" v-if="!!businessNo">
                        <p class="detail-item-title">支付信息</p>
                        <div class="detail-info">
                            <p class="detail-info-item">
                                <span class="fl-l">支付方式：</span>
                                <span class="fl-r">{{orderForm.payType}}</span>
                            </p>
                            <p class="detail-info-item">
                                <span class="fl-l">支付时间：</span>
                                <span class="fl-r">{{orderForm.payTime}}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="order-detail-foot" v-if="!!meiyaOrderNo && !businessNo">
                    <span class="foot-total-fees DINAlternate-Bold">{{'￥' + orderForm.totalFees}}</span>{{'已优惠￥' + orderForm.totalOffer}}
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
                totalFees: null,
                totalOffer: null
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
            // let datas = {}
            // let apiUrl = ''
            // !!this.meiyaOrderNo ?
            //     (datas.meiyaOrderNo = this.meiyaOrderNo, apiUrl = 'customer-feeOrderPreview') :
            //     (datas.businessNo = this.businessNo, apiUrl = 'customer-feeOrderDetail')
            // api.post(api.getUrl(apiUrl), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content) {
            //             let content = res.content
            //             let totalFees = 0
            //             let totalOffer = 0
            //             for (let key in content) {
            //                 if (key == 'orderItemList') {
            //                     let orderItemList = content[key]
            //                     orderItemList.forEach(item => {
            //                         let data = {
            //                             itemNo: item.itemNo,
            //                             itemName: item.itemName,
            //                             itemCount: item.itemCount,
            //                             amount: formatMoney(item.amount, 1),
            //                             originalAmount: formatMoney(item.originalAmount, 1)
            //                         }
            //                         totalFees += item.amount
            //                         item.originalAmount > item.amount ? totalOffer += (item.originalAmount - item.amount) : ''
            //                         this.orderForm[key].push(data)
            //                     })
            //                 } else if (key == 'packageWriteoffs') {
            //                     let packageWriteoffs = content[key]
            //                     packageWriteoffs.forEach(item => {
            //                         let data = {
            //                             itemNo: item.itemNo,
            //                             itemName: item.itemName,
            //                             writeoffAmount: formatMoney(item.writeoffAmount, 1)
            //                         }
            //                         totalFees = totalFees - item.writeoffAmount
            //                         totalOffer += item.writeoffAmount
            //                         this.orderForm['orderItemList'].push(data)
            //                     })
            //                 } else if (key == 'couponDeductionAmount') {
            //                     let data = {
            //                         itemName: '预付金抵扣',
            //                         writeoffAmount: formatMoney(content[key], 1)
            //                     }
            //                     totalOffer += content[key]
            //                     this.orderForm['orderItemList'].push(data)
            //                 } else if (key == 'meiyaOrderOpenTime' || key == 'payTime') {
            //                     this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd HH:mm:ss') : ''
            //                 } else {
            //                     this.orderForm[key] = content[key]
            //                 }
            //             }
            //             this.orderForm.totalFees = formatMoney(totalFees, 1)
            //             this.orderForm.totalOffer = formatMoney(totalOffer, 1)
            //         }
            //     }
            // })
            let res = {
                content: {}
            }
            res.content = {
                status: '00',
                orderItemList: [{
                    itemName: '血常规',
                    itemCount: 1,
                    originalAmount: 10000,
                    amount: 8000
                }, {
                    itemName: '乙肝表面抗原',
                    itemCount: 1,
                    originalAmount: 8000,
                    amount: 8000
                }, {
                    itemName: '名字贼长贼长贼长贼长贼长贼长贼长还不够长还要长长长',
                    itemCount: 1,
                    originalAmount: 8000,
                    amount: 8000
                }, {
                    itemName: '束身衣',
                    itemCount: 1,
                    originalAmount: 50000,
                    amount: 50000
                }],
                packageWriteoffs: [{
                    itemName: '束身衣(礼包)',
                    itemNo: '9574122',
                    writeoffAmount: 50000
                }],
                couponDeductionAmount: 11000,
                meiyaOrderNo: '1284738585',
                meiyaOrderWriter: '宋一刀',
                meiyaOrderOpenTime: 1574840600563,
                meiyaOrderMemo: '局麻化验套餐',
                payTime: 1574940600563,
                payType: 'WX',
                totalFees: 39900,
                totalOffer: 62000
            }
            let content = res.content
            let totalFees = 0
            let totalOffer = 0
            for (let key in content) {
                if (key == 'orderItemList') {
                    let orderItemList = content[key]
                    orderItemList.forEach(item => {
                        let data = {
                            itemNo: item.itemNo,
                            itemName: item.itemName,
                            itemCount: item.itemCount,
                            amount: formatMoney(item.amount, 1),
                            originalAmount: formatMoney(item.originalAmount, 1)
                        }
                        totalFees += item.amount
                        item.originalAmount > item.amount ? totalOffer += (item.originalAmount - item.amount) : ''
                        this.orderForm[key].push(data)
                    })
                } else if (key == 'packageWriteoffs') {
                    let packageWriteoffs = content[key]
                    packageWriteoffs.forEach(item => {
                        let data = {
                            itemNo: item.itemNo,
                            itemName: item.itemName,
                            writeoffAmount: formatMoney(item.writeoffAmount, 1)
                        }
                        totalFees = totalFees - item.writeoffAmount
                        totalOffer += item.writeoffAmount
                        this.orderForm['orderItemList'].push(data)
                    })
                } else if (key == 'couponDeductionAmount') {
                    let data = {
                        itemName: '预付金抵扣',
                        writeoffAmount: formatMoney(content[key], 1)
                    }
                    totalOffer += content[key]
                    this.orderForm['orderItemList'].push(data)
                } else if (key == 'meiyaOrderOpenTime' || key == 'payTime') {
                    this.orderForm[key] = content[key] ? dateFormatter(new Date(content[key]), 'yyyy-MM-dd HH:mm:ss') : ''
                } else if (key == 'payType') {
                    this.orderForm[key] = getpPayType(content[key])
                } else {
                    this.orderForm[key] = content[key]
                }
            }
            this.orderForm.totalFees = formatMoney(totalFees, 1)
            this.orderForm.totalOffer = formatMoney(totalOffer, 1)
            
            this.request = true
        },
        // 确认支付
        confirmPay () {
            // let datas = {
            //     meiyaOrderNo: this.orderForm.meiyaOrderNo
            // }
            // api.post(api.getUrl('customer-createFeeOrder'), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content) {
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