<template>
	<div class="paymentMethod">
		<div class="payment-header">
			<div class="title">需支付</div>
			<div class="money">
				<span>￥</span>
				<span>{{$utils.formatMoney(salesPrice,1)}}</span>
			</div>
		</div>
		<div class="payment-method-list">
			<div v-for="(p,index) in payTypeList" :key="index">
				<img class="weixin" :src="p.icon" />
				<span>{{p.payTypeDesc}}</span>
				<img class="gouxuan" src="../assets/images/gouxuan@2x.png"/>
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
	export default {
		name: 'paymentList',
		data() {
			return {
				payTypeList: [{
					"icon": require('../assets/images/weixin-pay.png'),
					"payTypeCode": "1111",
					"payTypeDesc": "微信"
				}],
//				payTypeList: [{
//					"icon": require('../assets/images/weixin-pay.png'),
//					"payTypeCode": "1111",
//					"payTypeDesc": "微信"
//				}, {
//					"icon": require('../assets/images/weixin-pay.png'),
//					"payTypeCode": "2222",
//					"payTypeDesc": "银行卡支付"
//				}, {
//					"icon": require('../assets/images/weixin-pay.png'),
//					"payTypeCode": "3333",
//					"payTypeDesc": "么么钱包"
//				}],
				salesPrice: sessionStorage.getItem('reservationMoney'),
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
				}else{
					this.$router.push("/reservationStatus?businessNo=" + this.businessNo + '&reservation=' + 1)
				}
				
			},
			getError() {
				this.h5Show = false
				console.log(this.h5Show)
			},
			payH5() {
				let req = {}
				if(this.fromOrder) {
						req = {
						orderNo: sessionStorage.getItem('orderNo') || this.orderNo,
						payType: 'WX_H5'
					}
				} else {
					req = {
						businessNo: sessionStorage.getItem('businessNo') || this.businessNo,
						payType: 'WX_H5'
					}
				}
				api.post(api.getUrl('reservePay'), req).then(res => {
					this.buyed = null
					if(res.code == '000') {
						sessionStorage.setItem('h5paysuccess', true)
						let uri = ''
						if(this.fromOrder) {
							uri = location.origin + '/h5-hido/index.html#/paymentList?h5paysuccess=' + sessionStorage.getItem('h5paysuccess') + '&salesPrice=' + sessionStorage.getItem('reservationMoney') + '&orderNo=' + sessionStorage.getItem('orderNo')
						}else{
							uri = location.origin + '/h5-hido/index.html#/paymentList?h5paysuccess=' + sessionStorage.getItem('h5paysuccess') + '&salesPrice=' + sessionStorage.getItem('reservationMoney') + '&businessNo=' + sessionStorage.getItem('businessNo')
						}
						
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
					this.payH5()
				}

			}
		},
		mounted() {
			document.title = "选择支付方式"
			this.h5paysuccess = this.$route.query.h5paysuccess
			this.fromOrder = this.$route.query.fromOrder
			this.$route.query.salesPrice ? this.salesPrice = this.$route.query.salesPrice : this.salesPrice = sessionStorage.getItem('reservationMoney')
			this.$route.query.businessNo ? this.businessNo = this.$route.query.businessNo : this.businessNo = sessionStorage.getItem('businessNo')
			this.$route.query.orderNo ? this.orderNo = this.$route.query.orderNo : this.orderNo = sessionStorage.getItem('orderNo')
			if(sessionStorage.getItem('h5paysuccess') || this.h5paysuccess) {
				this.h5Show = true
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
			padding: 1.3rem 0 0 1.5rem;
			div {
				height: 6.5rem;
				border-bottom: 1px solid #EAEAEA;
				padding-top: 1rem;
			}
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