<template>
    <div class="main-content login">
        <div class="watchData">{{watchData}}</div>
        <div class="page-field">
            <div class="page-part">
                <van-cell-group>
                    <input
                        class="van-cell-group-input"
                        type="tel"
                        placeholder="请输入手机号"
                        v-model="mobile"
                        maxlength="11"
                        @focus="mobileFocus = true"
                        @blur="setTimeout('mobileFocus')"/>
                    <i class="van-cell-group-inputTitle" v-if="mobile">手机号</i>
                    <van-icon v-if="mobile && mobileFocus" name="close" @click="mobile=''"/>
                </van-cell-group>
                <van-cell-group>
                    <input
                    class="van-cell-group-input"
                    placeholder="请输入验证码"
                    type="tel"
                    v-model="verifyCode"
                    maxlength="4"
                    @focus="verifyCodeFocus=true"
                    @blur="setTimeout('verifyCodeFocus')"/>
                    <i class="van-cell-group-inputTitle" v-if="verifyCode">验证码</i>
                    <van-icon class="verify-input-code" v-if="verifyCode && verifyCodeFocus" name="close"  @click="verifyCode = ''"/>
                </van-cell-group>
                <van-button id="getVerifyCode" class="page-verify" @click="getVerify" :disabled="verifyBtn">{{ verifyTitle }}</van-button>
            </div>
        </div>
        <div class="page-button">
            <van-button class="next-button" @click="toNext" :disabled="nextBtn">登 录</van-button>
        </div>
        <div class="page-protocol">
            <span class="protocol-title">登录即表示我已阅读并同意 HIDO 的 </span>
            <span class="protocol-title protocol-a" @click="popupVisible=true">&nbsp;用户注册协议</span>
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
            checkedMobile: '',
            mobile: '',
            verifyCode: '',
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
            // 限制手机号输入格式
            let mobile = this.mobile.replace(/\D/g,'')
            if (/^1/.test(mobile)) {
                this.mobile = mobile
            } else {
                this.mobile = ''
                clearInterval(this.clock)
                this.verifyBtn = false
                this.verifyTitle = '获取验证码'
            }      
            // 按钮监听
            this.verifyBtn = this.verifyTitle === '获取验证码' || this.verifyTitle === '重新发送' ? false : true
            this.nextBtn = this.verifyCode && (this.verifyCode.length === 4) && (this.mobile === this.checkedMobile) ? false : true
            if (this.mobile && this.mobile !== this.checkedMobile) {
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
            type == 'mobileFocus' ? (clearInterval(this.clock), this.verifyBtn = false, this.verifyTitle = '获取验证码') : ''
            setTimeout(() => { this[type] = false}, 100)
        },
        // 获取验证码
        getVerify () {
            const mobileReg = /^((17[0-9])|(14[0-9])|(13[0-9])|(15[0-9])|(18[0-9])|166|198|199)+\d{8}$/
            if (!this.mobile) {
                Toast('请输入手机号')
            } else if (!mobileReg.test(this.mobile)) {
                Toast('手机号码格式有误')
            } else {
                let datas = {
                    mobile: this.mobile
                }
                this.verifyBtn = true
                // api.post(api.getUrl(''), datas).then(resp => {
                //     if (resp.code === '0000') {
                //         this.verifyCode = ''
                //         this.checkedMobile = this.mobile
                //         this.serialNo = resp.content
                //         this.loginVerify = 59
                //         this.verifyTitle = this.loginVerify + ' S'
                //         this.clock = setInterval(this.doLoop, 1000)
                //     } else {
                //         this.verifyBtn = false
                //     }
                // })
                this.verifyCode = ''
                this.checkedMobile = this.mobile
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
            if (!(/^\d+$/).test(this.verifyCode)) {
                Toast('验证码是4位数字', '提示')
            } else if (this.mobile !== this.checkedMobile) {
                Toast('请重新获取验证码', '提示')
            } else {
                let datas = {
                    mobile: this.mobile,
                    verifyCode: this.verifyCode,
                    serialNo: this.serialNo,
                    key: this.key || null
                }
                this.nextBtn = true
                // api.post(api.getUrl(''), datas).then(resp => {
                //     clearInterval(this.clock)
                //     this.verifyCode = ''
                //     this.checkedMobile = ''
                //     this.verifyBtn = false
                //     this.verifyTitle = '获取验证码'
                //     if (resp.code === '0000') {
                //         if (!!resp.content) {
                //         }
                //     }
                // })
                Toast('重来！！')
                clearInterval(this.clock)
                this.verifyCode = ''
                this.checkedMobile = ''
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
        padding-top: 1rem;
    }
</style>
