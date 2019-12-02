<template>
    <div class="main-content add-bank-card">
        <div>
            <div class="watchData">{{watchData}}</div>
            <div class="page-field">
                <van-field
                    class="bank-name-input"
                    v-model="bankName"
                    type="tel"
                    right-icon="arrow"
                    placeholder="请选择开户行"
                    disabled
                    @click="popupShow=true" />
                <van-field
                    v-model="cardNo"
                    clearable
                    maxlength="23"
                    type="tel"
                    label="银行卡号"
                    placeholder="请输入银行卡号"
                    @input="(value) => {cardNo = cardNo.replace(/\D/g,'').replace(/(\S{4})/g, '$1 ').replace(/\s*$/, '')}"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="bankBranch"
                    clearable
                    maxlength="20"
                    label="开户支行"
                    placeholder="请输入开户支行"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="name"
                    clearable
                    :maxlength="nameMaxlength"
                    label="本人姓名"
                    placeholder="请输入本人姓名"
                    @input="(value) => {nameMaxlength = $utils.getByteLen(value) >= 9.5 ? $utils.getByteLen(value) : 20}"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="idNo"
                    clearable
                    maxlength="18"
                    label="身份证号"
                    placeholder="请输入身份证号"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="phone"
                    clearable
                    maxlength="11"
                    type="tel"
                    label="预留手机号"
                    placeholder="请输入预留手机号"
                    @clear="clearVerifyCode" />
                <van-field
                    v-model="verifyCode"
                    center
                    clearable
                    maxlength="6"
                    type="tel"
                    label="验证码"
                    placeholder="请输入验证码">
                    <van-button class="van-field-btn" slot="button" plain size="small" type="info" :disabled="verifyBtn" @click="getVerify">{{verifyTitle}}</van-button>
                </van-field>
            </div>
            <div class="page-protocol">
                <van-checkbox v-model="checked" checked-color="#FF7B31">
                    <span class="protocol-title">点击提交即表示我已阅读并同意</span>
                    <span class="protocol-title protocol-a" @click="openPage('https://www.baidu.com')">《银行卡快捷支付协议》</span>
                </van-checkbox>
            </div>
        </div>
        <div class="page-button">
            <van-button class="next-button" @click="toNext" :disabled="nextBtn">提 交</van-button>
        </div>
        <van-popup v-model="popupShow" position="bottom" class="card-popup">
            <div class="popup-list">
                <div class="popup-list-title">选择开户行</div>
                <div :class="bankName === item.bankName ? 'popup-list-item theme-color' : 'popup-list-item'" v-for="(item, index) in bankList" :key="index" @click="() => {bankName=item.bankName, popupShow=false}">
                    <img class="popup-img" :src="item.bankPhoto" v-if="item.bankPhoto" />
                    <span class="popup-img-bg" v-else></span>
                    <div class="popup-content">{{item.bankName}}</div>
                    <img class="popup-success" src="../assets/images/gouxuan@2x.png" v-if="bankName === item.bankName" />
                </div>
            </div>
            <div class="close-button">
                <van-button @click="popupShow=false">取 消</van-button>
            </div>
        </van-popup>
    </div>            
</template>

<script>
import { Toast, Field, Button, Popup, Checkbox, CheckboxGroup } from 'vant'
import api from '../common/api.js'
import { checkRules } from '../common/utils.js'

export default {
    name: 'add-bank-card',
    data () {
        return {
            keyboardshow:false,
            verifyTitle: '获取验证码',
            loginVerify: 59,
            clock: '',
            verifyBtn: false,
            nextBtn: true,
            checkedCardNo: '',
            checkedBankName: '',
            checkedBankBranch: '',
            checkedName: '',
            checkedIdNo: '',
            checkedPhone: '',
            verifyCode: '',
            serialNo: '',
            popupVisible: false,
            mobileFocus: false,
            verifyCodeFocus: false,
            cardNo: '',
            bankName: '',
            bankBranch:'',
            name: '',
            idNo: '',
            phone: '',
            checked: false,
            bankList: [],
            popupShow: false,
            nameMaxlength: 20
        }
    },
    mounted () {
        document.title = '添加银行卡'
        this.verifyTitle = '获取验证码'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            setTimeout(() => {
                this.getQueryBankLimit()
            }, 600)
        } else {
            this.getQueryBankLimit()
        }
    },
    computed: {
        // 监听页面数据
        watchData: function () {
            this.verifyBtn = this.verifyTitle === '获取验证码' || this.verifyTitle === '重新发送' ? false : true
            // 下一步按钮
            this.nextBtn = this.serialNo && this.verifyCode && (this.verifyCode.length >= 4) ? false : true
            if (
                this.cardNo && this.cardNo !== this.checkedCardNo ||
                this.name && this.name !== this.checkedName ||
                this.idNo && this.idNo !== this.checkedIdNo ||
                this.phone && this.phone !== this.checkedPhone ||
                this.bankName && this.bankName !== this.checkedBankName ||
                this.bankBranch && this.bankBranch !== this.checkedBankBranch
            ) {
                clearInterval(this.clock)
                this.verifyBtn = false
                this.verifyTitle = '获取验证码'
            }
        }
    },
    methods: {
        // 获取银行卡列表
        getQueryBankLimit () {
            api.post(api.getUrl('agent-queryBankLimit'), {}).then(resp => {
                if (!!resp && resp.code === 0) {
                    if (!!resp.content && resp.content.length > 0) {
                        this.bankList = resp.content.map(item => { return item })
                    } else {
                        this.bankList = []
                        Toast('暂无支持银行')
                    }
                }
            })
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
        // 表单校验
        checkForm () {
            if (!this.bankName) {
                Toast('请选择开户行')
                return false
            } else if (!this.cardNo) {
                Toast('请输入银行卡号')
                return false
            } else if (this.cardNo.replace(/\D/g,'').length < 12) {
                Toast('请输入正确的银行卡号')
                return false
            } else if (!this.bankBranch) {
                Toast('请输入开户支行')
                return false
            } else if (!checkRules(this.bankBranch, 'chineseReg') || this.bankBranch.replace(/\s/g, '').length < 4) {
                Toast('支行信息格式错误')
                return false
            } else if (!this.name) {
                Toast('请输入本人姓名')
                return false
            } else if (this.name.length < 2) {
                Toast('本人姓名至少输入2位汉字')
            } else if (!checkRules(this.name, 'nameReg')) {
                Toast('请输入中文姓名')
                return false
            } else if (!this.idNo) {
                Toast('请输入身份证号')
                return false
            } else if (!checkRules(this.idNo, 'idCardNoReg')) {
                Toast('身份证号输入有误')
                return false
            } else if (!this.phone) {
                Toast('请输入手机号码')
                return false
            } else if (!checkRules(this.phone, 'mobileReg')) {
                Toast('手机号码有误')
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
                    cardNo: this.cardNo.replace(/\s/g, ''),
                    name: this.name,
                    idNo: this.idNo,
                    phone: this.phone,
                    bankName: this.bankName,
                    bankBranch: this.bankBranch
                }
                this.verifyBtn = true
                api.post(api.getUrl('bankCard-v3-getVerifyCode', 'user'), datas).then(resp => {
                    if (resp.code === 0) {
                        this.verifyCode = ''
                        this.checkedCardNo = this.cardNo
                        this.checkedName = this.name
                        this.checkedIdNo = this.idNo
                        this.checkedPhone = this.phone
                        this.checkedBankBranch = this.bankBranch
                        this.checkedBankName = this.bankName
                        this.serialNo = resp.content.serialNo
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
            if (!checkRules(this.verifyCode, 'integerReg')) {
                Toast('验证码有误')
                return false
            } else if (this.phone !== this.checkedPhone) {
                Toast('请重新获取验证码')
                return false
            } else if (!this.checked) {
                Toast('请先阅读并同意相关协议')
                return false
            } else {
                let datas = {
                    cardNo: this.cardNo.replace(/\s/g, ''),
                    name: this.name,
                    idNo: this.idNo,
                    phone: this.phone,
                    bankBranch: this.bankBranch,
                    bankName: this.bankName,
                    verifyCode: this.verifyCode,
                    serialNo: this.serialNo
                }
                this.nextBtn = true
                api.post(api.getUrl('bankCard-v3-bindBankCard', 'user'), datas).then(resp => {
                    if (resp.code === 0) {
                        Toast('银行卡添加成功')
                        clearInterval(this.clock)
                        this.verifyCode = ''
                        this.checkedPhone = ''
                        this.verifyBtn = false
                        this.verifyTitle = '获取验证码'
                        this.$router.go(-1)
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scope>
    .van-action-sheet{
        max-height: 50%;
    }
</style>