<template>
    <div class="main-content add-bank-card">
        <div>
            <div class="watchData">{{watchData}}</div>
            <div class="page-field">
                <van-field
                    v-model="bankNo"
                    clearable
                    maxlength="23"
                    type="tel"
                    label="银行卡号"
                    placeholder="请输入银行卡号"
                    @input="(value) => {bankNo = value.replace(/\D/g,'').replace(/....(?!$)/g,'$& ')}"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="bankName"
                    type="tel"
                    label="银行名称"
                    placeholder="请选择银行名称"
                    right-icon="arrow"
                    @clear="clearVerifyCode" 
                    @click="show=true" />
                <van-field
                    v-model="bankBranch"
                    clearable
                    maxlength="20"
                    type="tel"
                    label="开户支行"
                    placeholder="请输入开户支行"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="name"
                    clearable
                    maxlength="20"
                    label="本人姓名"
                    placeholder="请输入本人姓名"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="idCardNo"
                    clearable
                    maxlength="18"
                    label="身份证号"
                    placeholder="请输入身份证号"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="mobile"
                    clearable
                    maxlength="11"
                    type="number"
                    label="预留手机号"
                    placeholder="请输入预留手机号"
                    @clear="clearVerifyCode" />
                <van-cell-group>
                    <van-field
                        v-model="verifyCode"
                        center
                        clearable
                        maxlength="6"
                        type="number"
                        label="验证码"
                        placeholder="请输入验证码">
                        <van-button class="van-field-btn" slot="button" plain size="small" type="info" :disabled="verifyBtn" @click="getVerify">{{verifyTitle}}</van-button>
                    </van-field>
                </van-cell-group>
            </div>
            <div class="page-protocol">
                <van-checkbox v-model="checked" checked-color="#FF7B31">
                    <span class="protocol-title">点击提交即表示我已阅读并同意</span>
                    <!-- <span class="protocol-title protocol-a" @click="popupVisible=true">《银行卡快捷支付协议》</span>  -->
                    <span class="protocol-title protocol-a" @click="openPage('https://www.baidu.com')">《银行卡快捷支付协议》</span>
                </van-checkbox>
            </div>
        </div>
        <div class="page-button">
            <van-button class="next-button" @click="toNext" :disabled="nextBtn">提 交</van-button>
        </div>
        <!-- <van-popup class="van-popup-protocol" v-model="popupVisible">
            <div class="pop-content">
                <div class="pop-wrap"></div>
                <div class="close-wrap" @click="popupVisible=false"><img src="../assets/images/pop_close.png" /></div>
            </div>
        </van-popup> -->
        <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
    </div>            
</template>

<script>
import { Toast, Field, Button, Popup, Checkbox, CheckboxGroup, ActionSheet } from 'vant'
import api from '../common/api.js'

export default {
    name: 'add-bank-card',
    data () {
        return {
            verifyTitle: '获取验证码',
            loginVerify: 59,
            clock: '',
            verifyBtn: false,
            nextBtn: true,
            checkedBankNo: '',
            checkedBankName: '',
            checkedName: '',
            checkedIdCardNo: '',
            checkedMobile: '',
            verifyCode: '',
            serialNo: '',
            popupVisible: false,
            mobileFocus: false,
            verifyCodeFocus: false,
            bankNo: '',
            bankName: '',
            bankBranch:'',
            name: '',
            idCardNo: '',
            mobile: '',
            checked: false,
            rules: {
                bankNo: [
                    {required: true, message: '请输入银行卡号'}
                ],
                bankName: [
                    {required: true, message: '请选择银行名称'}
                ],
                bankBranch: [
                    {required: true, message: '请输入开户支行'}
                ],
                name: [
                    {required: true, message: '请输入本人姓名'}
                ],
                idCardNo: [
                    {required: true, message: '请输入身份证号'}
                ],
                mobile: [
                    {required: true, message: '请输入手机号码'}
                ]
            },
            actions: [
                { name: '招商银行' },
                { name: '工商银行' },
                { name: '建设银行' }
            ],
            show: false
        }
    },
    mounted () {
        document.title = '添加银行卡'
        this.verifyTitle = '获取验证码'
    },
    computed: {
        // 监听页面数据
        watchData: function () {
            this.verifyBtn = this.verifyTitle === '获取验证码' || this.verifyTitle === '重新发送' ? false : true
            // 下一步按钮
            this.nextBtn = this.serialNo && this.verifyCode && (this.verifyCode.length >= 4) ? false : true
            if (
                this.bankNo && this.bankNo !== this.checkedBankNo ||
                this.name && this.name !== this.checkedName ||
                this.idCardNo && this.idCardNo !== this.checkedIdCardNo ||
                this.mobile && this.mobile !== this.checkedMobile
            ) {
                clearInterval(this.clock)
                this.verifyBtn = false
                this.verifyTitle = '获取验证码'
            }
        }
    },
    methods: {
        // 选择银行卡
        onSelect(item) {
            this.show = false
            this.bankName = item.name
        },
        // 跳转协议
        openPage (url) {
            window.location.href = url
        },
        // 清空四要素 都需重新获取验证码
        clearVerifyCode () {
            clearInterval(this.clock)
            this.serialNo = ''
            this.verifyBtn = false
            this.verifyTitle = '获取验证码'
        },
        checkForm () {
            // const mobileReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9])|166|198|199)+\d{8}$/
            const mobileReg = /^(1)+\d{10}$/
            const nameReg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
            const branchReg = /^[\u4e00-\u9fa5]*$/
            const idCardNoReg = /^(^\d{18}$)|(^\d{17}(\d|X|x)$)$/
            if (!this.bankNo) {
                Toast('请输入银行卡号')
                return false
            } else if (this.bankNo.replace(/\D/g,'').length < 12) {
                Toast('请输入正确的银行卡号')
                return false
            } else if (!this.bankName) {
                Toast('请选择银行名称')
                return false
            } else if (!this.bankBranch) {
                Toast('请输入开户支行')
                return false
            } else if (!branchReg.test(this.bankBranch) || this.bankBranch.replace(/\D/g,'').length < 4) {
                Toast('支行信息格式错误')
                return false
            } else if (!this.name) {
                Toast('请输入本人姓名')
                return false
            } else if (this.name.length < 2) {
                Toast('本人姓名至少输入2位汉字')
            } else if (!nameReg.test(this.name)) {
                Toast('请输入中文姓名')
                return false
            } else if (!this.idCardNo) {
                Toast('请输入身份证号')
                return false
            } else if (!idCardNoReg.test(this.idCardNo)) {
                Toast('身份证号输入有误')
                return false
            } else if (!this.mobile) {
                Toast('请输入手机号码')
                return false
            } else if (!mobileReg.test(this.mobile)) {
                Toast('手机号码有误')
                return false
            } else if (!this.checked) {
                Toast('请先阅读并同意相关协议')
                return false
            } else {
                return true
            }
        },
        // 获取验证码
        getVerify () {
            if (!this.checkForm()) {
                return false
            } else {
                let datas = {
                    bankNo: this.bankNo,
                    name: this.name,
                    idCardNo: this.idCardNo,
                    mobile: this.mobile
                }
                this.verifyBtn = true
                // api.post(api.getUrl(''), datas).then(resp => {
                //     if (resp.code === '0000') {
                //         this.verifyCode = ''
                //         this.checkedBankNo = this.bankNo
                //         this.checkedName = this.name
                //         this.checkedIdCardNo = this.idCardNo
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
                this.checkedBankNo = this.bankNo
                this.checkedName = this.name
                this.checkedIdCardNo = this.idCardNo
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
        // 提交
        toNext () {
            if (!(/^\d+$/).test(this.verifyCode)) {
                Toast('验证码有误', '提示')
            } else if (this.mobile !== this.checkedMobile) {
                Toast('请重新获取验证码', '提示')
            } else {
                let datas = {
                    bankNo: this.bankNo,
                    name: this.name,
                    idCardNo: this.idCardNo,
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
                Toast('银行卡添加成功')
                clearInterval(this.clock)
                this.verifyCode = ''
                this.checkedMobile = ''
                this.verifyBtn = false
                this.verifyTitle = '获取验证码'
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style lang="scss">
    // @import '../assets/scss/index.scss';

</style>