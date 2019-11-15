<template>
	<div class="orderDetail">
		<div v-if="orderDetailShow">
			<div class="receipt-address">
				<div style="padding:1.5rem" v-if="hasNoAdress" @click="setAddress">
					<img class="add" src="../assets/images/add.png" />
					<span>收货信息</span>
					<img class="arrow" src="../assets/images/arrow.png" />
				</div>
				<div style="padding:1.5rem" v-else>
					<div>
						<span>{{orderDetail.receiverName}}{{orderDetail.receiverPhone}}</span>
						<img class="arrow" src="../assets/images/arrow.png" />
					</div>
					<div class="adress adress1">
						{{orderDetail.area}}
						<!--{{province}}/{{city}}/{{county}}-->
					</div>
					<div class="adress adress2">
						{{orderDetail.detailAddr}}
					</div>
				</div>
			</div>
			<div class="gift-package">
				<div style="overflow:hidden">
					<img class="libao" :src="orderDetail.merchantLogo" />
					<div style="overflow:hidden">
						<div style="float:left">
							<div class="package-price">
								<div class="van-multi-ellipsis--l2" style="color:#1A2833;font-size:1.5rem">
									{{orderDetail.productName}}
								</div>
								<div>
									<span style="font-size:1.4rem;color:#8A9399">{{orderDetail.merchantName}}</span>
								</div>
							</div>
						</div>
						<div class="buynumber">x1</div>
					</div>
					<div style="overflow:hidden;padding-left:1.2rem">
						<span style="color:#FF7B31;font-size:1.6rem;float:right">￥{{orderDetail.orderRealAmt/100}}</span>
					</div>
				</div>
			</div>
			<div class="recommend">
				<!--<input type="text" placeholder="请输入推荐人手机号" />-->
				<van-cell-group>
					<van-field v-model="recommendPhone" label="推荐人手机号" placeholder="请输入推荐人手机号" clearable type='number' maxlength='11' @input="checkTel" />
				</van-cell-group>
			</div>
			<div class="submitTxt">
				<div style="padding:2.2rem 1.5rem;">
					<span style="color:#1A2833;font-size:1.6rem;">订单金额：</span>
					<span style="color:#FF7B31;font-size:1.8rem;">￥{{orderDetail.orderRealAmt/100}}</span>
					<button class="submit-gray" v-if="gray">提交</button>
					<button class="submit-active" v-else @click="submitOrder">提交</button>
				</div>
			</div>
		</div>
		<div v-else class="order-status">
			<img src="../assets/images/order-success.png" />
			<div class="sucess-txt" style="padding-top:3rem;">您的订单已提交成功</div>
			<div class="sucess-txt" style="padding-top:1.1rem;">会为您尽快安排发货</div>
			<div style="#8A9399;font-size:1.4rem;padding-top:2rem;">{{second}}s后自动跳转回购买界面</div>
		</div>
		<div class="orderWrapper" v-if="dropOutShow">
			<div class="order-content">
				<div class="title">提示</div>
				<div style="color:#353535;font-size:1.5rem;">是否确认取消订单</div>
				<div class="borderStyle"></div>
				<button class="canle" @click="dropOutShow=false">取消</button>
				<button class="confirm" @click="goBack">确认</button>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	export default {
		name: 'orderDetail',
		data() {
			return {
				hasNoAdress: false,
				orderDetailShow: true,
				recommendPhone: '',
				province: '',
				city: '',
				county: '',
				username: '',
				phone: '',
				detailAddress: '',
				gray: true,
				second: 3,
				dropOutShow: false,
				jumpUrl: '',
				orderDetail: {},
			}
		},
		methods: {
			getCode() { // 静默授权，没有有弹框
				const code = _utils.getQueryString('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
				const local = window.location.href
				if(code == null || code === '') {
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc20260737b4c8770' + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
				} else {
					this.getOpenId(code) //把code传给后台获取用户信息
				}
			},
			getOpenId(code) { // 通过code获取 openId等用户信息
				let _this = this
				let req = {
					code: code,
					appid: 'wxc20260737b4c8770',
					secret: '7f3d7817fdb685dc9741fe25e1688514',
					grant_type: 'authorization_code'
				}
				api.get(api.getWeixinUrl('oauth2', 'weixin'), req).then(res => {
					let openId = res.openid
					let req1 = {
						openId: 'oXVeb1dKm_5fBzRLRmFx9l-2NVZQ'
					}
					api.post(api.getWeixinUrl('unifiedorder', 'weixinPay'), req1).then(res1 => {
						function onBridgeReady() {
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": "wxc20260737b4c8770", //公众号名称，由商户传入     
									"timeStamp": "1395712654", //时间戳，自1970年以来的秒数     
									"nonceStr": "e61463f8efa94090b1f366cccfbbb444", //随机串     
									"package": "prepay_id=u802345jgfjsdfgsdg888",
									"signType": "MD5", //微信签名方式：     
									"paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
								},
								function(res) {
									if(res.err_msg == "get_brand_wcpay_request:ok") {
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

					}).catch((e) => {})
				}).catch((e) => {
					console.log('失败')
				})
			},
			setAddress() {
				this.$router.push("/shippingAddress")
			},
			checkTel() {
				if(this.username && this.phone && this.province && this.city && this.county && this.detailAddress && this.recommendPhone) {
					this.gray = false
				}
			},
			submitOrder() {
				window.location.href = this.jumpUrl
				//this.$router.push("/paymentMethod")
				//				this.orderDetailShow = false
				//				let interval = setInterval(()=>{
				//					this.second--
				//					if(this.second <=0){
				//						clearInterval(interval)
				//					}
				//				},1000)
				//				setTimeout(() => {
				//				this.$router.push("/productDetail")
				//			}, 3000)
			},
			goBack() {
				this.$router.push("/productDetail")
			},
			getOrderDetail() {
				let req = {
					"channel": 1,
					"receiverName": "张虹旺",
					"receiverPhone": "18055899999",
					"area": "上海市，浦东新区",
					"detailAddr": "博山东路",
					"productId": "20191114173306YQ",
					"orderType": 4,
					"payType": 2,
					"refererPhone": "18055899929",
					"firstCommissionRatio": "2.00",
					"secondCommissionRatio": "1.00"
				}
				api.post(api.getUrl('createOrderV2', 'collections'), req).then(res => {
					res = {
	"code": "000",
	"desc": "操作成功[A4000]",
	"accessToken": null,
	"content": {
		"orderNo": "MALL3019111551851941200310",
		"memberId": null,
		"phone": null,
		"amount": 987,
		"applyTerm": null,
		"monthPayment": null,
		"merchantId": null,
		"merchantName": '水光针*10,玻尿酸*10',
		"sdkOrderNo": null,
		"walletOrderNo": null,
		"repaymentType": null,
		"status": null,
		"createTime": 1573815185209,
		"storeId": null,
		"orderFlag": null,
		"receiverName": "张虹旺",
		"receiverPhone": "18055899999",
		"area": "上海市，浦东新区",
		"detailAddr": "博山东路",
		"deliverDetail": null,
		"couponCode": null,
		"discountAmt": 0,
		"parentOrderNo": null,
		"merchantLogo": 'http://cdn.duitang.com/uploads/item/201510/17/20151017095028_eGJMw.thumb.700_0.jpeg',
		"couponName": null,
		"couponUseJson": null,
		"freight": null,
		"orderRealAmt": 987,
		"eachProcedureFee": null,
		"cancelTime": null,
		"payTime": null,
		"invalidTime": null,
		"deliverTime": null,
		"receiveTime": null,
		"finishTime": null,
		"version": null,
		"productId": "20191114173306YQ",
		"productName": "展示名",
		"orderType": 4,
		"marketingActivityNo": null,
		"offlineOrderNo": null,
		"payType": 2,
		"weixinPaymentJson": null,
		"rightsRecordId": null
	},
	"sign": null
}
					if(res.code == 0) {
						this.orderDetail = res.content
					}
				}).catch((e) => {

				})
			}
		},
		mounted() {
			let orderNo = this.$route.query.orderNo
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
			if(this.device.version.MicroMessenger) {
				this.getCode()
			} else {
				let req = {
					code: '801e4862da74d9272af98ccbfa76bda0'
				}
				api.get(api.getWeixinUrl('pay', 'h5Pay'), req).then(res => {
					this.jumpUrl = res.url
					console.log(res.url)

				}).catch((e) => {})
			}

			api.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('invokeBackPress', {}, (data) => {
					console.log(data)
				})
			})
			this.province = sessionStorage.getItem('province')
			this.county = sessionStorage.getItem('county')
			this.city = sessionStorage.getItem('city')
			this.username = sessionStorage.getItem('username')
			this.phone = sessionStorage.getItem('phone')
			this.detailAddress = sessionStorage.getItem('detailAddress')
			if(this.province && this.city && this.county && this.username && this.phone && this.detailAddress) {
				this.hasNoAdress = false
			}
			//				let _this = this		
			//          pushHistory();  
			//          window.addEventListener("popstate", function(e) {  
			//              //此处已经捕获返回事件，可以写自己的跳转代码  
			//              _this.dropOutShow = true  
			//          }, false);  
			//          function pushHistory() {  
			//              var state = {  
			//                  title : "title",  
			//                  url : ""  
			//              };  
			//              window.history.pushState(state, "title", "");  
			//          }  
			this.getOrderDetail()
		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.orderDetail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		.orderWrapper {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.6);
			position: fixed;
			left: 0;
			top: 0;
			.order-content {
				width: 72%;
				margin: 50% auto 0;
				height: auto;
				background: #fff;
				border-radius: 1.4rem;
				text-align: center;
				.title {
					color: #4B464D;
					padding: 2rem 0;
					font-weight: 500;
					font-size: 1.7rem;
				}
				.borderStyle {
					width: 100%d;
					height: 1px;
					background: #E0E0E0;
					margin-top: 2rem;
				}
				button {
					border: none;
					background: none;
					font-size: 1.6rem;
					width: 100%;
					height: 4.5rem;
					line-height: 4.5rem;
					font-weight: 400;
				}
				.canle {
					width: 49%;
					border-right: 1px solid #E0E0E0;
				}
				.confirm {
					width: 49%;
					color: #FF7B31;
				}
			}
		}
		.receipt-address {
			width: 100%;
			height: auto;
			background: #fff;
			margin-top: 1rem;
			.adress {
				color: #8A9399;
				font-size: 1.4rem;
			}
			.adress1 {
				padding-top: 1.2rem;
			}
			.adress2 {
				padding-top: 0.8rem;
			}
			.add {
				width: 1.8rem;
			}
			span {
				color: #1A2833;
				font-size: 1.6rem;
				font-weight: 600;
				/*margin-left: 8px;*/
			}
			.arrow {
				width: 1.9rem;
				float: right;
			}
		}
		.gift-package {
			width: 100%;
			background: #fff;
			height: auto;
			margin-top: 1rem;
			padding: 1.8rem 1.5rem;
			.libao {
				width: 52px;
				height: 52px;
				border-radius: 3px;
				float: left;
			}
			.buynumber {
				color: #1A2833;
				font-size: 1.5rem;
				float: right;
			}
			.package-price {
				float: left;
				padding-left: 1.2rem;
			}
			.description {
				float: left;
				font-size: 1.2rem;
				color: #475966;
				margin-top: 1.7rem;
			}
		}
		.recommend {
			margin-top: 1rem;
		}
		.submitTxt {
			width: 100%;
			height: 8rem;
			background: #fff;
			position: fixed;
			bottom: 0;
			button {
				color: #fff;
				font-size: 1.4rem;
				outline: none;
				border: none;
				border-radius: 15px;
				background: linear-gradient(132deg, #FFAF82 0%, #FF7B31 100%);
				width: 8.2rem;
				height: 3rem;
				float: right;
			}
			.submit-gray {
				opacity: 0.5;
			}
			.submit-active {}
		}
		.order-status {
			width: 100%;
			height: 100%;
			background: #fff;
			text-align: center;
			img {
				width: 6.6rem;
				padding-top: 9.5rem;
			}
			.sucess-txt {
				font-size: 1.8rem;
				font-weight: 600;
				color: rgba(26, 40, 51, 1);
				line-height: 18px;
			}
		}
	}
</style>