<template>
    <div class="main-content login">
        <div class="watchData">{{watchData}}</div>
        <h2 class="login-h2">您好！</h2>
        <h3 class="login-h3">欢迎来到HIDO</h3>
        <div class="page-field">
            <div class="page-part">
                <van-cell-group>
                    <input
                        class="van-cell-group-input"
                        type="tel"
                        placeholder="请输入手机号"
                        v-model="phone"
                        maxlength="11"
                        @focus="() => {phone = phone.replace(/\D/g,''), mobileFocus = true}"
                        @blur="setTimeout('mobileFocus')"/>
                    <i class="van-cell-group-inputTitle" v-if="phone">手机号</i>
                    <van-icon class="verify-input-code" v-if="phone && mobileFocus" name="close" @click="phone=''"/>
                </van-cell-group>
                <van-cell-group>
                    <input
                    class="van-cell-group-input"
                    placeholder="请输入验证码"
                    type="tel"
                    v-model="verificationCode"
                    maxlength="6"
                    @focus="() => {phone = phone.replace(/\D/g,''), verifyCodeFocus = true}"
                    @blur="setTimeout('verifyCodeFocus')"/>
                    <i class="van-cell-group-inputTitle" v-if="verificationCode">验证码</i>
                    <van-icon v-if="verificationCode && verifyCodeFocus" name="close"  @click="verificationCode = ''"/>
                </van-cell-group>
                <van-button class="page-verify" @click="getVerify" :disabled="verifyBtn">{{ verifyTitle }}</van-button>
            </div>
        </div>
        <div class="page-button">
            <van-button class="next-button" @click="toNext" :disabled="nextBtn">登 录</van-button>
        </div>
        <div class="page-protocol">
            <span class="protocol-title">登录即表示我已阅读并同意</span>
            <span class="protocol-title protocol-a" @click="popupVisible=true">注册协议</span><span style="color:$themeColor;">、</span><span class="protocol-title protocol-a" @click="popupVisible=true">隐私策略</span>
        </div>
        
        <van-popup class="van-popup-protocol" v-model="popupVisible">
            <div class="pop-content">
                <div class="pop-wrap"></div>
                <div class="close-wrap" @click="popupVisible=false"><img src="../assets/images/pop_close.png" /></div>
            </div>
        </van-popup>
	</div>
</template>

<script>
import { Toast, Field, Button, Popup } from 'vant'
import api from '../common/api.js'

export default {
    name: 'login',
    data () {
        return {
            verifyTitle: '获取验证码',
            loginVerify: 59,
            clock: '',
            verifyBtn: false,
            nextBtn: true,
            checkedPhone: '',
            phone: '',
            verificationCode: '',
            serialNo: '',
            popupVisible: false,
            mobileFocus: false,
            verifyCodeFocus: false
        }
    },
    mounted () {
        this.verifyTitle = '获取验证码'
    },
    computed: {
        // 监听页面数据
        watchData: function () {  
            // 按钮监听
            this.verifyBtn = this.verifyTitle === '获取验证码' || this.verifyTitle === '重新发送' ? false : true
            this.nextBtn = this.verificationCode && (this.verificationCode.length === 4) && (this.phone === this.checkedPhone) ? false : true
            if (this.phone && this.phone !== this.checkedPhone) {
                clearInterval(this.clock)
                this.verifyBtn = false
                this.verifyTitle = '获取验证码'
            }   
        }
    },
    computed: {
        // 监听页面数据
        watchData: function () {  
            // 按钮监听
            this.verifyBtn = this.verifyTitle === '获取验证码' || this.verifyTitle === '重新发送' ? false : true
            this.nextBtn = this.verificationCode && (this.verificationCode.length === 4) && (this.phone === this.checkedPhone) ? false : true
            if (this.phone && this.phone !== this.checkedPhone) {
                clearInterval(this.clock)
                this.verifyBtn = false
                this.verifyTitle = '获取验证码'
            }
        }
    },
    methods: {
        // ipnut 清除
        setTimeout (type) {
            let _this = this
            type == 'mobileFocus' && this.phone !== this.checkedPhone ? (clearInterval(this.clock), this.verifyBtn = false, this.verifyTitle = '获取验证码') : ''
            setTimeout(() => { this[type] = false}, 100)
        },
        // 获取验证码
        getVerify () {
            const mobileReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9])|166|198|199)+\d{8}$/
            if (!this.phone) {
                Toast('请输入手机号')
            } else if (!mobileReg.test(this.phone)) {
                Toast('手机号码格式有误')
            } else {
                let datas = {
                    phone: this.phone
                }
                this.verifyBtn = true
                // api.post(api.getUrl('common-sendMobileCode'), datas).then(resp => {
                //     if (resp.code === '0000') {
                //         this.verificationCode = ''
                //         this.checkedPhone = this.phone
                //         this.serialNo = resp.content
                //         this.loginVerify = 59
                //         this.verifyTitle = this.loginVerify + ' S'
                //         this.clock = setInterval(this.doLoop, 1000)
                //     } else {
                //         this.verifyBtn = false
                //     }
                // })
                this.verificationCode = ''
                this.checkedPhone = this.phone
                this.serialNo = '99655245420'
                this.loginVerify = 59
                this.verifyTitle = this.loginVerify + ' S'
                this.clock = setInterval(this.doLoop, 1000)
            }
        },
        // 验证码倒计时
        doLoop () {
            if (this.loginVerify > 0) {
                this.loginVerify--
                this.verifyBtn = true
                this.verifyTitle = this.loginVerify + ' S'
            } else {
                clearInterval(this.clock)
                this.verifyBtn = false
                this.verifyTitle = '重新发送'
                this.loginVerify = 59
            }
        },
        // 登录
        toNext () {
            if (!(/^\d+$/).test(this.verificationCode)) {
                Toast('验证码是4位数字', '提示')
            } else if (this.phone !== this.checkedPhone) {
                Toast('请重新获取验证码', '提示')
            } else {
                let datas = {
                    mobilePhone: this.phone,
                    verificationCode: this.verificationCode,
                    serialNo: this.serialNo,
                    key: this.key || null
                }
                this.nextBtn = true
                // api.post(api.getUrl('common-validatePhoneCode'), datas).then(resp => {
                //     clearInterval(this.clock)
                //     this.verificationCode = ''
                //     this.checkedPhone = ''
                //     this.verifyBtn = false
                //     this.verifyTitle = '获取验证码'
                //     if (resp.code === '0000') {
                //         if (!!resp.content) {
                //         }
                //     }
                // })
                Toast('重来！！')
                clearInterval(this.clock)
                this.verificationCode = ''
                this.checkedPhone = ''
                this.verifyBtn = false
                this.verifyTitle = '获取验证码'
            }
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/scss/vant.scss';
    .login {
        padding-top: 3rem;
        height: 100%;
        background: #fff;
        .login-h2 {
            margin-left: 2.5rem;
            color: $darkColor;
            font-size: 2.8rem;
            line-height: 2.8rem;
        }
        .login-h3 {
            color: $darkColor;
            font-size: 2.8rem;
            margin: 1.2rem 0 1rem 2.5rem;
            line-height: 2.8rem;
        }
        .page-protocol {
            position: fixed;
            width: 100%;
            bottom: 2.5rem;
            text-align: center;
            font-size: 1rem;
            color: $lightColor;
            .protocol-a {
                font-size: 1rem;
                line-height: 3rem;
            }
        }
        .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
            border-width: 0;
            border-bottom: 1px solid $borderColor;
        }
        .van-cell-group {
            height: 7rem;
            .van-cell-group-input {
                height: 4.3rem;
                line-height: 3.8rem;
                font-size: 1.6rem;
                top: 2.7rem;
            }
            .van-cell-group-inputTitle {
                position: absolute;
                top: 0.5rem;
                font-style: normal;
                line-height: 1;
                top: 1.6rem;
                color: $lightColor;
            }
            .van-icon-close {
                right: 0;
                top: 2.7rem;
                position: absolute;
                line-height: 4rem;
                color: $lightColor;
            }
            .verify-input-code {
                right: 10.1rem;
            }
        }
        .page-part {
            padding: 0 2.5rem;
        }
        .page-verify {
            position: absolute;
            right: 2.5rem;
            top: 3.8rem;
            width: 9rem;
            height: 1.6rem;
            line-height: 1;
            font-size: 1.6rem;
            border-radius: 0;
            border: none;
            border-left: 1px solid $normalColor;
            color: $themeColor;
            padding: 0 0 0 1rem;
        }
        input::-webkit-input-placeholder {
            font-size: 1.6rem;
            color: $lightColor;
        }
        .page-button {
            padding: 6rem 2.5rem 5.5rem;
        }
        .page-verify.van-button--disabled {
            color: $lightColor;
            background: #fff;
        }
    }
</style>
