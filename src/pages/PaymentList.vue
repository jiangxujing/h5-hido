<template>
	<div class="paymentMethod">
		<div class="payment-header">
			<div class="title">需支付</div>
			<div class="money">
				<span>￥</span>
				<span class="DINAlternate-Bold">{{$utils.formatMoney(salesPrice,1)}}</span>
			</div>
		</div>
		<div class="payment-method-list">
			<div v-for="(p,index) in payTypeList" :key="index">
				<img class="weixin" :src="p.icon" />
				<span>{{p.payTypeDesc}}</span>
				<img class="gouxuan" src="../assets/images/gouxuan.png" />
			</div>
		</div>
		<div style="text-align: center;">
			<button class="buy-now" @click="buyNow">立即支付</button>
		</div>
		<div class="orderH5Wrapper" v-show="h5Show">
			<div class="content">
				<div class="title">请确认微信支付是否完成</div>
				<div class="success" @click="getSuccess">已完成支付</div>
				<div class="error" @click="getError">支付遇到问题，重新支付</div>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	import { Toast } from 'vant'
	export default {
		name: 'paymentList',
		data() {
			return {
				payTypeList: [{
					"icon": require('../assets/images/wechat.png'),
					"payTypeCode": "1111",
					"payTypeDesc": "微信"
				}],
				//				payTypeList: [{
				//					"icon": require('../assets/images/wechat.png'),
				//					"payTypeCode": "1111",
				//					"payTypeDesc": "微信"
				//				}, {
				//					"icon": require('../assets/images/wechat.png'),
				//					"payTypeCode": "2222",
				//					"payTypeDesc": "银行卡支付"
				//				}, {
				//					"icon": require('../assets/images/wechat.png'),
				//					"payTypeCode": "3333",
				//					"payTypeDesc": "么么钱包"
				//				}],
				salesPrice: '',
				h5Show: false,
				buyed: null
			}
		},
		methods: {
			getPaymentList() {
				let req = {
					phone: sessionStorage.getItem('phone')
				}
				api.post(api.getUrl('paymentType'), req).then(res => {
					if(res.code == 0) {
						this.payTypeList = res.content
					}

				}).catch(() => {})
			},
			selectPayType(i) {
				this.payTypeList.forEach((i) => {
					this.$set(i, "active", false);
				})
				this.$set(i, "active", true);
			},
			getSuccess() {
				if(this.fromOrder) {
					this.$router.push("/reservationStatus?orderNo=" + this.orderNo)
				} else {
					this.$router.push("/reservationStatus?businessNo=" + this.businessNo + '&reservation=' + 1)
				}

			},
			getError() {
				this.h5Show = false
				console.log(this.h5Show)
			},
			orderPayH5() {
				let req = {
					businessNo: this.orderNo,
					payType: 'WX_H5'
				}
				api.post(api.getUrl('orderPay'), req).then(res => {
					this.buyed = true
					setTimeout(() => {
						this.buyed = false
					}, 3000)
					if(res.code === 0) {
						sessionStorage.setItem('h5paysuccess', true)
						let uri = ''
						uri = location.origin + location.pathname+'#/paymentList?h5paysuccess=' + sessionStorage.getItem('h5paysuccess') + '&orderAmount=' + this.salesPrice + '&orderNo=' + this.orderNo + '&fromOrder=' + this.fromOrder
						let linkUrl = encodeURIComponent(uri)
						let sceneInfo = JSON.parse(res.content.respExt)
						this.jumpUrl = sceneInfo.mWebUrl
						console.log('99999999999999=' + this.jumpUrl)
						setTimeout(() => {
							location.href = this.jumpUrl + '&redirect_url=' + linkUrl
						}, 200)

					}
				}).catch((e) => {

				})
			},
			payH5() {
				let req = {
					businessNo: this.businessNo,
					payType: 'WX_H5'
				}
				api.post(api.getUrl('reservePay'), req).then(res => {
					this.buyed = true
					setTimeout(() => {
						this.buyed = false
					}, 3000)
					if(res.code === 0) {
						sessionStorage.setItem('h5paysuccess', true)
						let uri = ''
						uri = location.origin + location.pathname+'#/paymentList?h5paysuccess=' + sessionStorage.getItem('h5paysuccess') + '&salesPrice=' + this.salesPrice + '&businessNo=' + this.businessNo
						let linkUrl = encodeURIComponent(uri)
						let sceneInfo = JSON.parse(res.content.respExt)
						this.jumpUrl = sceneInfo.mWebUrl
						console.log('99999999999999=' + this.jumpUrl)
						setTimeout(() => {
							location.href = this.jumpUrl + '&redirect_url=' + linkUrl
						}, 200)

					}
				}).catch((e) => {

				})
			},
			buyNow() {
				if(this.buyed) {
					Toast('请勿提交订单过块！')
				} else {
					if(this.fromOrder) {
						this.orderPayH5()
					} else {
						this.payH5()
					}

				}

			}
		},
		mounted() {
			document.title = "选择支付方式"
			this.h5paysuccess = this.$route.query.h5paysuccess
			this.fromOrder = this.$route.query.fromOrder
			this.orderNo = this.$route.query.orderNo
			if(this.fromOrder) {
				//订单来的
				this.salesPrice = this.$route.query.orderAmount
				this.orderNo = this.$route.query.orderNo
			} else {
				//预约来的
				this.salesPrice = this.$route.query.salesPrice
				this.businessNo = this.$route.query.businessNo
			}

			if(sessionStorage.getItem('h5paysuccess') || this.h5paysuccess) {
				this.h5Show = true
			}
			let params = {
				interceptBack: true
			}
			let _this = this
			if(this.$route.query.fromOrder) {
				api.setupWebViewJavascriptBridge((bridge) => {
					bridge.callHandler('callInit', params, (data) => {
						api.setupWebViewJavascriptBridge((bridge) => {
							bridge.registerHandler('invokeBackPress', (data) => {
								_this.$router.push("/medicalOrderDetail?businessNo=" + this.$route.query.orderNo)
							})
						})
					})
				})
				api.setupWebViewJavascriptBridge((bridge) => {
					bridge.registerHandler('invokeBackPress', (data) => {
						api.setupWebViewJavascriptBridge((bridge) => {
							_this.$router.push("/medicalOrderDetail?businessNo=" + this.$route.query.orderNo)
						})
					})
				})
			} else {
				let url = sessionStorage.getItem('reservationUrl')
				api.setupWebViewJavascriptBridge((bridge) => {
					bridge.callHandler('callInit', params, (data) => {
						api.setupWebViewJavascriptBridge((bridge) => {
							bridge.registerHandler('invokeBackPress', (data) => {
								_this.$router.push(url)
							})
						})
					})
				})
				api.setupWebViewJavascriptBridge((bridge) => {
					bridge.registerHandler('invokeBackPress', (data) => {
						api.setupWebViewJavascriptBridge((bridge) => {
							_this.$router.push(url)
						})
					})
				})
			}
			//				this.withdrawalDetail.cardList.forEach((i) => {
			//					this.$set(i, "active", false);
			//				});
			//this.getPaymentList()

		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.paymentMethod {
		padding-top: 1rem;
		.payment-header {
			width: 100%;
			height: auto;
			background: #fff;
			text-align: center;
			.title {
				color: #1A2833;
				font-size: 1.4rem;
				padding: 2.4rem;
			}
			.money {
				color: #FF7B31;
				padding-bottom: 2.2rem;
				span:first-child {
					font-weight: 600;
					font-size: 2.8rem;
				}
				span:last-child {
					font-weight: bold;
					font-size: 4.8rem;
					line-height: 0;
				}
			}
		}
		.payment-method-list {
			width: 100%;
			height: 6.5rem;
			margin-top: 1rem;
			background: #fff;
			padding: 1.3rem 0 0 1.5rem;
			.weixin {
				width: 4rem;
			}
			span {
				font-size: 1.7rem;
				color: #1A2833;
				line-height: 4rem;
				padding-left: 1.3rem;
			}
			.gouxuan {
				width: 1.9rem;
				vertical-align: middle;
				margin-top: 1rem;
				float: right;
				margin-right: 1.5rem;
			}
		}
		.orderH5Wrapper {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .6);
			position: fixed;
			left: 0;
			top: 0;
			.content {
				width: 70%;
				height: 20rem;
				background: #fff;
				border-radius: 1.5rem;
				margin: 40% auto;
				.title {
					color: #1A2833;
					font-size: 1.6rem;
					font-weight: bold;
					padding: 2rem 0;
					text-align: center;
				}
				.success {
					color: #FE3750;
				}
				.success,
				.error {
					font-size: 1.4rem;
					text-align: center;
					border-bottom: 1px solid #eee;
					padding: 1rem;
					font-weight: 400;
				}
			}
		}
	}
</style>