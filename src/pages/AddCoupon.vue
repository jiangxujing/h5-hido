<template>
    <!-- 创建卡券 -->
    <div class="main-content add-coupon">
        <div>
            <div class="watchData">{{watchData}}</div>
            <div class="page-field">
                <van-field
                    v-model="agentPhone"
                    clearable
                    maxlength="11"
                    type="tel"
                    label="用户手机号"
                    placeholder="请填写用户手机号" />
                <van-field
                    v-model="deductionAmount"
                    clearable
                    type="tel"
                    maxlength="10"
                    label="抵扣金额"
                    placeholder="请填写抵扣金额" />
                <van-field
                    v-model="amount"
                    clearable
                    type="tel"
                    maxlength="10"
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
            amount: '',
            deductionAmount: '',
            agentPhone: ''
        }
    },
    mounted () {
        document.title = '创建卡券'
    },
    computed:{
        // 监听页面数据
        watchData: function () {
            // 下一步按钮
            this.nextBtn = this.amount && this.deductionAmount && this.agentPhone ? false : true
        }
    },
    methods: {
        // 创 建
        toNext () {
            const mobileReg = /^(1)+\d{10}$/
            if (!mobileReg.test(this.agentPhone)) {
                Toast('手机号码有误')
                return false
            } else {
                let datas = {
                    amount: this.amount*100,
                    deductionAmount: this.deductionAmount*100,
                    agentPhone: this.agentPhone
                }
                this.nextBtn = true
                api.post(api.getUrl('bankCard-v3-bindBankCard', 'user'), datas).then(resp => {
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