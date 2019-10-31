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
                        @focus="mobileFocus=true"
                        @blur="setTimeout('mobileFocus', 1000)"/>
                    <i class="van-cell-group-inputTitle" v-if="mobile">手机号</i>
                    <van-icon v-if="mobile && mobileFocus" name="close" @click="mobile=''"/>
                </van-cell-group>
                <van-cell-group>
                    <input
                    class="van-cell-group-input"
                    placeholder="请输入验证码"
                    type="tel"
                    v-model="verifyCode"
                    maxlength="6"
                    @focus="verifyCodeFocus=true"
                    @blur="setTimeout('verifyCodeFocus', 1000)"/>
                    <i class="van-cell-group-inputTitle" v-if="verifyCode">验证码</i>
                    <van-icon class="verify-input-code" v-if="verifyCode && verifyCodeFocus" name="close"  @click="verifyCode = ''"/>
                </van-cell-group>
                <van-button id="getVerifyCode" class="page-verify" @click="getVerify">{{ verifyTitle }}</van-button>
            </div>
        </div>
        <div class="page-button">
            <van-button class="next-button" @click="toNext" :disabled="nextBtn">下一步</van-button>
        </div>
        <div class="page-protocol">
            <span class="protocol-title">点击登录即表示我已阅读并同意 </span>
            <span class="protocol-title protocol-a" @click="popupVisible=true"> 相关注册协议</span>
        </div>
        
        <van-popup v-model="popupVisible">
            <div class="pop-content">
                <div class="pop-wrap"></div>
                <div class="close-wrap" @click="popupVisible=false"><img src="../assets/images/pop_close.png" /></div>
            </div>
        </van-popup>
	</div>
</template>

<script>
import { Field, Button, Toast, Popup } from 'vant'
import api from '../common/api.js'
import { dateFormatter, getCookie, setCookie, delCookie } from '../common/utils.js'


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
            agreementUrl: '',
            mobileFocus: false,
            verifyCodeFocus: false
        }
    },
    mounted () {
        this.nextBtn = this.verifyCode ? false : true
        this.serialNo = getCookie('serialNo') ? getCookie('serialNo') : ''
        this.mobile = getCookie('loginMobile') ? getCookie('loginMobile') : ''
        this.checkedMobile = getCookie('checkedLoginMobile') ? getCookie('checkedLoginMobile') : ''
        this.verifyTitle = '获取验证码'
    },
    computed: {
        // 监听页面数据
        watchData: function () {
            this.verifyBtn = this.mobile && (this.verifyTitle === '获取验证码' || this.verifyTitle === '重新发送') ? false : true
            // 下一步按钮
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
        setTimeout (type, time) {
            let _this = this
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
                api.post(api.getUrl('apply-getPhoneVerifyCode'), datas).then(resp => {
                    if (resp.code === '0000') {
                        this.verifyCode = ''
                        this.checkedMobile = this.mobile
                        this.serialNo = resp.content
                        setCookie('serialNo', this.serialNo, 0.5)
                        setCookie('loginMobile', this.mobile, 0.5)
                        setCookie('checkedLoginMobile', this.mobile, 0.5)
                        setCookie('loginVerify', this.loginVerify, 0.5)
                        this.loginVerify = 59
                        this.verifyTitle = this.loginVerify + ' S'
                        this.clock = setInterval(this.doLoop, 1000)
                    } else {
                        this.verifyBtn = false
                    }
                })
            }
        },
        // 验证码倒计时
        doLoop () {
            if (this.loginVerify > 0) {
                this.loginVerify--
                this.verifyBtn = true
                setCookie('loginVerify', this.loginVerify, 0.5)
                this.verifyTitle = this.loginVerify + ' S'
            } else {
                delCookie('loginVerify')
                clearInterval(this.clock)
                this.verifyBtn = false
                this.verifyTitle = '重新发送'
                this.loginVerify = 59
            }
        },
        // 下一步
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
                // api.post(api.getUrl('apply-verifyPhoneCode'), datas).then(resp => {
                //     clearInterval(this.clock)
                //     delCookie('serialNo')
                //     delCookie('loginMobile')
                //     delCookie('checkedLoginMobile')
                //     delCookie('loginVerify')
                //     this.verifyCode = ''
                //     this.checkedMobile = ''
                //     this.verifyBtn = false
                //     this.verifyTitle = '获取验证码'
                //     if (resp.code === '0000') {
                //         if (!!resp.content) {
                            
                //         }
                //     }
                // })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../assets/scss/login.scss';
</style>
