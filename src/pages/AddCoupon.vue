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
                    v-model="amount"
                    clearable
                    type="tel"
                    maxlength="4"
                    label="抵扣金额"
                    placeholder="请填写抵扣金额" />
                <van-field
                    v-model="payAmount"
                    clearable
                    type="tel"
                    maxlength="4"
                    label="支付金额"
                    placeholder="请填写支付金额" />
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
            mobile: ''
        }
    },
    mounted () {
        document.title = '创建卡券'
    },
    computed:{
        // 监听页面数据
        watchData: function () {
            // 下一步按钮
            this.nextBtn = this.payAmount && this.amount && this.mobile ? false : true
        }
    },
    methods: {
        // 创 建
        toNext () {
            const mobileReg = /^(1)+\d{10}$/
            const amoutReg = /^[1-9]\d*$/
            if (!mobileReg.test(this.mobile)) {
                Toast('用户手机号有误')
                return false
            } else if (!amoutReg.test(this.amount)) {
                Toast('抵扣金额格式有误')
                return false
            } else if (this.amount > 5000) {
                Toast('填写金额需小于等于5000，请重新输入')
                return false
            } else if (!amoutReg.test(this.payAmount)) {
                Toast('支付金额格式有误')
                return false
            } else if (this.payAmount > 5000) {
                Toast('填写金额需小于等于5000，请重新输入')
                return false
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
                // Toast('创建卡券成功')
                // this.$router.go(-1)
            }
        }
    }
}
</script>

<style lang="scss">

</style>