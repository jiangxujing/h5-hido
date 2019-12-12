<template>
	<div class="main-content login">
		<div>
			<div class="watchData">{{watchData}}</div>
			<h2 class="login-h2">您好！</h2>
			<h3 class="login-h3">欢迎来到HIDO</h3>
			<div class="page-field">
				<div class="page-part">
					<van-cell-group>
						<input class="van-cell-group-input" type="tel" placeholder="请输入手机号" v-model="phone" maxlength="11" @focus="() => {phone=phone.replace(/\D/g,''), mobileFocus=true}" @blur="setTimeout('mobileFocus')" />
						<i class="van-cell-group-inputTitle" v-if="phone">手机号</i>
						<van-icon class="verify-input-code" v-if="phone && mobileFocus" name="close" @click="phone=''" />
					</van-cell-group>
					<van-cell-group>
						<input class="van-cell-group-input" placeholder="请输入验证码" type="tel" v-model="verifyCode" maxlength="6" @focus="() => {phone=phone.replace(/\D/g,''), verifyCodeFocus=true}" @blur="setTimeout('verifyCodeFocus')" />
						<i class="van-cell-group-inputTitle" v-if="verifyCode">验证码</i>
						<van-icon v-if="verifyCode && verifyCodeFocus" name="close" @click="verifyCode=''" />
					</van-cell-group>
					<van-button class="page-verify" @click="getVerify" :disabled="verifyBtn">{{ verifyTitle }}</van-button>
				</div>
			</div>
			<div class="page-button">
				<van-button class="next-button" @click="toNext" :disabled="nextBtn">登 录</van-button>
			</div>
		</div>

		<div class="page-protocol">
			<span class="protocol-title">登录即表示我已阅读并同意</span>
			<span class="protocol-title protocol-a" @click="$router.push({name: 'registerProtocol'})">用户注册协议</span><span style="color:$themeColor;">、</span><span class="protocol-title protocol-a" @click="$router.push({name: 'privacyPolicy'})">隐私策略</span>
		</div>

		<!-- <van-popup class="van-popup-protocol" v-model="popupVisible">
            <div class="pop-content">
                <div class="pop-wrap"></div>
                <div class="close-wrap" @click="popupVisible=false"><img src="../assets/images/pop_close.png" /></div>
            </div>
        </van-popup> -->
	</div>
</template>

<script>
	import { Toast } from 'vant'
	import { setCookie, getQueryString, checkRules } from '../common/utils.js'
	import api from '../common/api.js'

	export default {
		name: 'login',
		data() {
			return {
				verifyTitle: '获取验证码',
				loginVerify: 59,
				clock: '',
				verifyBtn: false,
				nextBtn: true,
				checkedPhone: '',
				phone: '',
				verifyCode: '',
				serialNo: '',
				popupVisible: false,
				mobileFocus: false,
				verifyCodeFocus: false
			}
		},
		mounted() {
			document.title = 'HIDO'
			this.verifyTitle = '获取验证码'
			let ua = navigator.userAgent;
			this.device = {
				version: function() {
					return {
						MicroMessenger: /micromessenger/i.test(ua),
					}
				}()
			};
			if(this.device.version.MicroMessenger) {
				this.getCode()
			}
		},
		computed: {
			// 监听页面数据
			watchData: function() {
				// 按钮监听
				this.verifyBtn = this.verifyTitle === '获取验证码' || this.verifyTitle === '重新发送' ? false : true
				this.nextBtn = this.verifyCode && (this.verifyCode.length >= 4) && (this.phone === this.checkedPhone) ? false : true
				if(this.phone && this.phone !== this.checkedPhone) {
					clearInterval(this.clock)
					this.verifyBtn = false
					this.verifyTitle = '获取验证码'
				}
			}
		},
		methods: {
			getCode() { // 静默授权，没有有弹框
				let appId = 'wxc20260737b4c8770'
				const code = getQueryString('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
				this.code = code
				const local = window.location.href
				if(code == null || code === '') {
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
				}
			},
			// ipnut 清除
			setTimeout(type) {
				let _this = this
				type == 'mobileFocus' ? (clearInterval(this.clock), this.verifyBtn = false, this.verifyTitle = '获取验证码', this.checkedPhone = '') : ''
				setTimeout(() => {
					this[type] = false
				}, 100)
			},
			// 获取验证码
			getVerify() {
				if(!this.phone) {
					Toast('请输入手机号')
				} else if(!checkRules(this.phone, 'mobileReg')) {
					Toast('手机号码格式有误')
				} else {
					sessionStorage.setItem('phone', this.phone)
					let datas = {
						phone: this.phone
					}
					this.verifyBtn = true
					api.post(api.getUrl('common-sendMobileCode', 'user'), datas).then(res => {
						if(!!res && res.code === 0) {
							this.verifyCode = ''
							this.checkedPhone = this.phone
							this.serialNo = res.content.serialNo
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
			doLoop() {
				if(this.loginVerify > 0) {
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
			toNext() {
				if(!checkRules(this.verifyCode, 'integerReg')) {
					Toast('验证码有误')
				} else if(this.phone !== this.checkedPhone) {
					Toast('请重新获取验证码')
				} else {
					let datas = {
						phone: this.phone,
						verifyCode: this.verifyCode,
						smsSerialNo: this.serialNo,
						code: this.code,
						scope: 'snsapi_base',
						wechat: 'XM'
					}
					this.nextBtn = true
					api.post(api.getUrl('login-phoneLogin', 'user'), datas).then(res => {
						if(!!res && res.code === 0) {
							clearInterval(this.clock)
							let content = res.content
							this.verifyCode = ''
							this.checkedPhone = ''
							this.verifyBtn = false
							this.verifyTitle = '获取验证码'
							this.serialNo = ''
							setCookie('isRegister', content.isRegister, 7)
							setCookie('lastLoginTime', content.lastLoginTime, 7)
							setCookie('memberId', content.memberId, 7)
							setCookie('memberType', content.memberType, 7)
							setCookie('token', content.token, 7)
							setCookie('tokenExpire', content.tokenExpire, 7)
							setCookie('accessToken', res.accessToken, 7)
							setCookie('mmTicket', res.accessToken, 7)
							setCookie('channel', 'hido_h5', 7)
							// this.$router.go(-1) // 哪来回哪去
							if(this.device.version.MicroMessenger) {
								if(this.$route.query.redirect.indexOf('productDetail') != -1) {
									if(location.origin == 'https://bf-uat.memedai.cn'){
										console.log('15555555555')
										location.href = location.origin + "/h5-hido/index.html#/productDetail?packageCode=" + sessionStorage.getItem('packageCode') + '&uid=' + sessionStorage.getItem('uid')
									}else{
										console.log('666666666666')
										location.href = location.origin + "/index.html#/productDetail?packageCode=" + sessionStorage.getItem('packageCode') + '&uid=' + sessionStorage.getItem('uid')
									}
								}else{
									this.$router.push(this.$route.query.redirect || '/')
								}
							} else {
								this.$router.push(this.$route.query.redirect || '/')
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	// @import '../assets/scss/index.scss';
</style>