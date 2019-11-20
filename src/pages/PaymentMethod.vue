<template>
	<div class="paymentMethod">
		<div class="payment-header">
			<div class="title">需支付</div>
			<div class="money">
				<span>￥</span>
				<span>{{salesPrice/100}}</span>
			</div>
		</div>
		<div class="payment-method-list">
			<div>
				<img class="weixin" src="../assets/images/weixin-pay.png" />
				<span>微信支付</span>
				<img class="gouxuan" src="../assets/images/gouxuan@2x.png" />
			</div>
		</div>
		<div style="text-align: center;">
			<button class="buy-now" @click="buyNow">立即支付</button>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	export default {
		name: 'paymentMethod',
		data() {
			return {
				salesPrice:sessionStorage.getItem('salesPrice')
			}
		},
		methods: {
			buyNow(){
				this.getOrderDetail()
			},
			getH5Pay() {
				let req = {
					orderNo: this.orderNo,
					payType: 'WX_H5'
				}
				api.post(api.getUrl('pay', 'collections'), req).then(res => {
					if(res.code == 0) {
						let sceneInfo = JSON.parse(res.content.sceneInfo)
						this.jumpUrl = sceneInfo.mWebUrl
						console.log(this.jumpUrl+'&redirect_url='+location.origin+'/h5-hido/index.html#/orderSuccess')
						location.href = this.jumpUrl+'&redirect_url='+location.origin+'/h5-hido/index.html#/orderSuccess'
					}
				}).catch((e) => {

				})
			},
			getJsApiPay() {
				let req = {
					orderNo: this.orderNo,
					payType: 'WX_JS'
				}
				api.post(api.getUrl('pay', 'collections'), req).then(res => {
					if(res.code == 0) {
						let sceneInfo = JSON.parse(res.content.sceneInfo)
						let _this = this
						function onBridgeReady() {
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": sceneInfo.appId, //公众号名称，由商户传入     
									"timeStamp": sceneInfo.timeStamp, //时间戳，自1970年以来的秒数     
									"nonceStr": sceneInfo.nonceStr, //随机串     
									"package": sceneInfo.package,
									"signType": sceneInfo.signType, //微信签名方式：     
									"paySign": sceneInfo.paySign //微信签名 
								},
								function(res) {
									if(res.err_msg == "get_brand_wcpay_request:ok") {
										_this.$router.push("/orderSuccess")
										// 使用以上方式判断前端返回,微信团队郑重提示：
										//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
									}
								});
						}
						if(typeof WeixinJSBridge == "undefined") {
							if(document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							} else if(document.attachEvent) {
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							}
						} else {
							onBridgeReady();
						}
					}

				}).catch((e) => {

				})
			},
				getOrderDetail() {
				let req = {
					"channel":this.channel,
					"receiverName": this.username,
					"receiverPhone": this.phone,
					"area": this.province + ',' + this.city + ',' + this.county,
					"detailAddr": this.detailAddress,
					"productId": sessionStorage.getItem('packageCode'),
					"orderType": 4,
					"payType": 2,
					"refererPhone": sessionStorage.getItem('recommendPhone') || null,
					"firstCommissionRatio": sessionStorage.getItem('firstCommissionRatio'),
					"secondCommissionRatio": sessionStorage.getItem('secondCommissionRatio')
				}
				api.post(api.getUrl('createOrderV2', 'collections'), req).then(res => {
					if(res.code == 0) {
						this.orderNo = res.content.orderNo
						if(this.device.version.MicroMessenger) {
							//在微信浏览器里需要静默授权等走jsapi支付
							//this.getCode() 需要静默授权时调用

							//假如登录时已经做过授权，拿到了openId了
							this.getJsApiPay()
						} else {
							//在app里走h5支付
							this.getH5Pay()
						}

					}
				}).catch((e) => {

				})
			}
		},
		mounted() {
			this.province = sessionStorage.getItem('province')
			this.county = sessionStorage.getItem('county')
			this.city = sessionStorage.getItem('city')
			this.username = sessionStorage.getItem('username')
			this.phone = sessionStorage.getItem('phone')
			this.detailAddress = sessionStorage.getItem('detailAddress')
				let ua = navigator.userAgent;
			this.device = {
				version: function() {
					return {
						MicroMessenger: /micromessenger/i.test(ua),
					}
				}()
			};
			this.ios = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			this.android = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
			 if(this.device.version.MicroMessenger){
				if(this.ios){
					this.channel = 4
				}else if(this.android){
					this.channel = 3
				}
			}else{
				if(this.ios){
					this.channel = 2
				}else if(this.android){
					this.channel = 1
				}
			}
				let params = {
				interceptBack: true
			}
			let _this = this
			api.setupWebViewJavascriptBridge((bridge) => {
				bridge.callHandler('callInit', params, (data) => {
					api.setupWebViewJavascriptBridge((bridge) => {
						bridge.registerHandler('invokeBackPress', (data) => {
							_this.$router.push("/orderDetail?packageCode=" + sessionStorage.getItem('packageCode'))
						})
					})
				})
			})
			api.setupWebViewJavascriptBridge((bridge) => {
						bridge.registerHandler('invokeBackPress', (data) => {
							api.setupWebViewJavascriptBridge((bridge) => {
								_this.$router.push("/orderDetail?packageCode=" + sessionStorage.getItem('packageCode'))
							})
						})
					})
		},
	}
</script>

<style lang="scss">
		@import '../assets/scss/common.scss';
	.paymentMethod {
		.payment-header {
			width: 100%;
			height: auto;
			background: #fff;
			margin-top: 1rem;
			text-align: center;
			.title {
				color: #1A2833;
				font-size: 1.4rem;
				padding: 2.4rem;
			}
			.money {
				color: #FF7B31;
				span:first-child {
					font-weight: 600;
					font-size: 2.8rem;
				}
				span:last-child {
					font-weight: bold;
					font-size: 4.8rem;
				}
			}
		}
		.payment-method-list {
			width: 100%;
			height: auto;
			margin-top: 1rem;
			background: #fff;
			padding: 1.3rem 0 1.3rem 1.5rem;
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
				margin-top: 0.8rem;
				float: right;
				margin-right: 1.5rem;
			}
		}
		
	}
</style>