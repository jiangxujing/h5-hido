<template>
    <!-- 创建卡券 -->
    <div class="main-content add-coupon">
        <div>
            <div class="watchData">{{watchData}}</div>
            <div class="page-field">
                <van-field
                    v-model="mobile"
                    clearable
                    maxlength="11"
                    type="tel"
                    label="用户手机号"
                    placeholder="请填写用户手机号" />
                <van-field
                    v-model="payAmount"
                    clearable
                    type="tel"
                    maxlength="4"
                    label="支付金额"
                    @input="value => {amount = null}"
                    placeholder="请填写支付金额" />
                <van-field
                    v-model="amount"
                    clearable
                    type="tel"
                    maxlength="4"
                    label="抵扣金额"
                    :placeholder="amountPlaceholder" />
            </div>
        </div>
        <div class="page-button">
            <van-button class="next-button" @click="toNext" :disabled="nextBtn">创 建</van-button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import api from '../common/api.js'

export default {
    name: 'add-coupon',
    data () {
        return {
            nextBtn: true,
            payAmount: '',
            amount: '',
            mobile: '',
            couponsProportion: 1,
            amountPlaceholder: '请填写抵扣金额'
        }
    },
    mounted () {
        document.title = '创建卡券'
        this.getCoupopList()
    },
    computed:{
        // 监听页面数据
        watchData: function () {
            const amoutReg = /^[1-9]\d*$/
            if (!!this.payAmount && !amoutReg.test(this.payAmount)) {
                Toast('支付金额格式有误')
                this.payAmount = null
            } else if (this.payAmount > 5000/this.couponsProportion) {
                let payAmountTips = '支付金额有误，请填写小于等于' + parseInt(5000/this.couponsProportion) + '的金额'
                Toast(payAmountTips)
                this.payAmount = null
            } else if (!!this.amount && !amoutReg.test(this.amount)) {
                Toast('抵扣金额格式有误')
                this.amount = null
            } else if (!this.payAmount && this.amount > 5000) {
                Toast('抵扣金额要小于等于5000')
                this.amount = null
            } else if (!!this.payAmount && (this.amount > this.payAmount * this.couponsProportion)) {
                let amountTips = '抵扣金额有误，请填写小于等于' + this.payAmount * this.couponsProportion + '的金额'
                Toast(amountTips)
                this.amount = null
            }
            this.amountPlaceholder = !(this.payAmount * this.couponsProportion) ? '请填写抵扣金额' : '最大可抵扣' + this.payAmount * this.couponsProportion + '元'
            // 下一步按钮
            this.nextBtn = this.payAmount && this.amount && this.mobile ? false : true
        }
    },
    methods: {
        // 获取折扣券列表
        getCoupopList () {
            api.post(api.getUrl('agent-myCoupon'), {}).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content && !!res.content.couponsProportion) {
                        this.couponsProportion = res.content.couponsProportion
                    }
                }
            })
        },
        // 创建
        toNext () {
            const mobileReg = /^(1)+\d{10}$/
            const amoutReg = /^[1-9]\d*$/
            if (!mobileReg.test(this.mobile)) {
                Toast('用户手机号有误')
                return false
            // } else if (!amoutReg.test(this.payAmount)) {
            //     Toast('支付金额格式有误')
            //     return false
            // } else if (!amoutReg.test(this.amount)) {
            //     Toast('抵扣金额格式有误')
            //     return false
            } else {
                let datas = {
                    payAmount: this.payAmount*100,
                    amount: this.amount*100,
                    mobile: this.mobile
                }
                this.nextBtn = true
                api.post(api.getUrl('agent-createCoupon'), datas).then(resp => {
                    if (resp.code === 0) {
                        Toast('创建卡券成功')
                        this.$router.go(-1)
                    } else {
                        this.nextBtn = false
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss">

</style>