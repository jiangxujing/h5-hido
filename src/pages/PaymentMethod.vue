<template>
	<div class="paymentMethod">
		<div class="payment-header">
			<div class="title">需支付</div>
			<div class="money">
				<span>￥</span>
				<span>399</span>
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
	export default {
		name: 'paymentMethod',
		data() {
			return {

			}
		},
		methods: {
			buyNow(){
				
			}
		},
		mounted() {

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