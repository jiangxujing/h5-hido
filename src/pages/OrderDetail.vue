<template>
	<div class="orderDetail">
		<div v-if="orderShow">
			<div v-if="orderDetailShow">
				<div class="receipt-address">
					<div style="padding:1.5rem" v-if="hasNoAdress" @click="setAddress">
						<img class="add" src="../assets/images/add.png" />
						<span>收货信息</span>
						<img class="arrow" src="../assets/images/arrow.png" />
					</div>
					<div style="padding:1.5rem" v-else @click="setAddress">
						<div>
							<span>{{username}}{{phone}}</span>
							<img class="arrow" src="../assets/images/arrow.png" />
						</div>
						<div class="adress adress1">
							{{province}}/{{city}}/{{county}}
						</div>
						<div class="adress adress2">
							{{detailAddress}}
						</div>
					</div>
				</div>
				<div class="gift-package">
					<div style="overflow:hidden">
						<img class="libao" v-if="orderDetail.headPicture" :src="orderDetail.headPicture" />
						<div style="overflow:hidden">
							<div style="float:left">
								<div class="package-price">
									<div class="van-multi-ellipsis--l2" style="color:#1A2833;font-size:1.5rem">
										{{orderDetail.name}}
									</div>
									<div v-for="i in orderDetail.giftPackageDetailList">
										<span style="font-size:1.4rem;color:#8A9399">{{i.goodsName}}*{{i.goodsCount}}</span>
									</div>
								</div>
							</div>
							<div class="buynumber">x1</div>
						</div>
						<div style="overflow:hidden;padding-left:1.2rem">
							<span style="color:#FF7B31;font-size:1.6rem;float:right" v-if="orderDetail.salesPrice">￥{{$utils.formatMoney(orderDetail.salesPrice,1)}}</span>
						</div>
					</div>
				</div>
				<div class="recommend" v-if="type==1">
					<van-cell-group>
						<van-field v-model="recommendPhone" label="推荐人手机号" placeholder="请输入推荐人手机号" clearable type='number' maxlength='11' @input="checkTel" />
					</van-cell-group>
				</div>
				<div class="submitTxt">
					<div style="padding:2.2rem 1.5rem;">
						<span style="color:#1A2833;font-size:1.6rem;">订单金额：</span>
						<span style="color:#FF7B31;font-size:1.8rem;" v-if="orderDetail.salesPrice">￥{{$utils.formatMoney(orderDetail.salesPrice,1)}}</span>
						<button class="submit-gray" v-if="gray">提交</button>
						<button class="submit-active" v-else @click="submitOrder">提交</button>
					</div>
				</div>
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
	import _utils from '../common/utils.js'
	export default {
		name: 'orderDetail',
		data() {
			return {
				hasNoAdress: true,
				orderDetailShow: true,
				recommendPhone: '',
				province: '',
				city: '',
				county: '',
				username: '',
				phone: '',
				detailAddress: '',
				gray: true,
				dropOutShow: false,
				jumpUrl: '',
				orderDetail: {},
				type:'',
				paymethodShow: false,
				orderShow:true,
				h5Show:false
			}
		},
		methods: {
//			getError(){
//				let packageCode = this.$route.query.packageCode
//				this.$router.push("/orderDetail?packageCode="+packageCode)
//			},
			getSuccess(){
				this.$router.push("/orderSuccess")
			},
			getError(){
				this.h5Show = false
				//this.$router.push("/paymentMethod?packageCode="+this.packageCode)
				console.log(this.h5Show)
			},
			setAddress() {
				this.$router.push("/shippingAddress")
			},
			checkTel() {
				let strTemp = _utils.checkTel()
				let tel = this.recommendPhone
				sessionStorage.setItem('recommendPhone',this.recommendPhone)
				console.log(tel)
				if(strTemp.test(tel)) {
					this.gray = false
				} else {
					this.gray = true
					console.log('手机号错误')
				}
			},
			submitOrder() {
				this.$router.push("/paymentMethod?packageCode="+this.packageCode)
			},
			goBack() {
				this.$router.push("/productDetail?packageCode="+this.packageCode)
			},
			getPackageDetail() {
				let req = {
					packageCode: this.packageCode
				}
				api.post(api.getUrl('queryPackage', 'collections'), req, false, false, false).then(res => {
					if(res.code == 0) {
						this.orderDetail = res.content.giftPackageDTODetails
						sessionStorage.setItem('salesPrice', res.content.giftPackageDTODetails.salesPrice)
						this.type = res.content.homepageUrl.type
						this.firstCommissionRatio = res.content.giftPackageDTODetails.firstCommissionRatio
						this.secondCommissionRatio = res.content.giftPackageDTODetails.secondCommissionRatio
						sessionStorage.setItem('firstCommissionRatio',res.content.giftPackageDTODetails.firstCommissionRatio)
						sessionStorage.setItem('secondCommissionRatio',res.content.giftPackageDTODetails.secondCommissionRatio)
					}
				}).catch((e) => {

				})
			}
		},
		mounted() {
			if(sessionStorage.getItem('h5paysuccess')){
				this.h5Show = true
			}
			this.packageCode = this.$route.query.packageCode
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
			sessionStorage.setItem('packageCode',this.$route.query.packageCode)
			this.getPackageDetail()
			this.province = sessionStorage.getItem('province')
			this.county = sessionStorage.getItem('county')
			this.city = sessionStorage.getItem('city')
			this.username = sessionStorage.getItem('username')
			this.phone = sessionStorage.getItem('phone')
			this.recommendPhone = sessionStorage.getItem('recommendPhone')
			this.detailAddress = sessionStorage.getItem('detailAddress')
			let params = {
				interceptBack: true
			}
			let _this = this
			api.setupWebViewJavascriptBridge((bridge) => {
				bridge.callHandler('callInit', params, (data) => {
					api.setupWebViewJavascriptBridge((bridge) => {
						bridge.registerHandler('invokeBackPress', (data) => {
							_this.dropOutShow = true
						})
					})
				})
			})
			api.setupWebViewJavascriptBridge((bridge) => {
						bridge.registerHandler('invokeBackPress', (data) => {
							api.setupWebViewJavascriptBridge((bridge) => {
								_this.dropOutShow = true
							})
						})
					})
			if(this.province && this.city && this.county && this.username && this.phone && this.detailAddress) {
				this.hasNoAdress = false
				console.log(this.hasNoAdress)
				if(!this.hasNoAdress) {
					this.gray = false
				}
			}
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
		.orderH5Wrapper{
			width:100%;
			height:100%;
			background: rgba(0,0,0,.6);
			position:fixed;
			left:0;
			top:0;
			.content{
				width:70%;
				height:20rem;
				background: #fff;
				border-radius:1.5rem;
				margin: 40% auto;
				.title{
					color:#1A2833;
					font-size:1.6rem;
					font-weight: bold;
					padding: 2rem 0;
    				text-align: center;
				}
				.success{
					color:#FE3750;
				}
				.success,.error{
					font-size:1.4rem;
					text-align: center;
					border-bottom: 1px solid #eee;
					padding: 1rem;
					font-weight: 400;
				}
			}
		}
	}
</style>