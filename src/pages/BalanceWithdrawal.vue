<template>
	<div class="balanceWithdrawal">
		<div class="balanceWithdrawal-content">
			<div class="title">提现余额（元）</div>
			<div class="money">{{money}}</div>
			<div class="borderStyle" style=" margin-left: 1.5rem;"></div>
			<div class="available-balance">
				可用余额124.34元
			</div>
			<div class="borderStyle" style="margin-top:0"></div>
			<div class="payment-method-list" @click="goToBank">
				<img class="weixin" src="../assets/images/bank.png" />
				<div class="bank-name-no">
					<div>招商银行</div>
					<div>尾号1000储蓄卡</div>
				</div>
				<img class="gouxuan" src="../assets/images/arrow.png" />
			</div>
		</div>
		<button class="withdrawBtn buy-now">确认提现</button>
	</div>
</template>

<script>
	import _utils from '../common/utils.js'
	export default {
		name: 'balanceWithdrawal',
		data() {
			return {
				money:_utils.formatMoney(2000000.32,2)
				
			}
		},
		methods: {
			goToBank() {
					this.$router.push("/addBankCard")
			}
		},
		mounted() {

		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.balanceWithdrawal {
		.balanceWithdrawal-content {
			width: 100%;
			height: auto;
			margin-top: 1rem;
			background: #fff;
			.title {
				color: #1A2833;
				font-size: 1.4rem;
				padding: 2rem 0 1rem 1.5rem;
				font-weight: 400;
			}
			.money {
				color: #FF7B31;
				font-size: 4.5rem;
				font-weight: bold;
				padding-left: 1.5rem;
			}
			.available-balance {
				color: #1A2833;
				font-size: 1.4rem;
				padding: 1.2rem 0 1.2rem 1.5rem;
			}
			.payment-method-list {
				width: 100%;
				height: auto;
				margin-top: 1rem;
				background: #fff;
				padding: 1.3rem 0 1.3rem 1.5rem;
				overflow: hidden;
				.weixin {
					width: 4rem;
					float:left;
				}
				.bank-name-no{
					float:left;
					div{
					font-size: 1.4rem;
					color: #475966;
					line-height: 2rem;
					padding-left: 1.3rem;
					font-weight:400;
					}
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
	}
</style>