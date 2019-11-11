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
					<div>{{bankname}}</div>
					<div>{{bankno}}</div>
				</div>
				<img class="gouxuan" src="../assets/images/arrow.png" />
			</div>
		</div>
		<button class="withdrawBtn buy-now">确认提现</button>
		<div class="banklistwrapper" v-if="bankshow">
			<div class="banklist">
				<div class="bank" v-for="(b,index) in banklist" :key="index" @click="selectBank(b)" :class="b.active?'active':''">
					<div style="padding:1.2rem 1.5rem;overflow: hidden;">
						<img class="bank-logo" :src="b.banklogo" />
						<div class="bank-no">
							<div style="margin-top:0.2rem">{{b.bankname}}</div>
							<div style="margin-top:0.8rem">{{b.bankno}}</div>
						</div>
						<img class="gou-xuan" src="../assets/images/gou.png" v-if="b.active" />
					</div>
				</div>
			</div>
			<div>
				<button class="cancle-btn" @click="bankshow=false">取消</button>
			</div>
		</div>
	</div>
</template>

<script>
	import _utils from '../common/utils.js'
	export default {
		name: 'balanceWithdrawal',
		data() {
			return {
				bankname:'招商银行',
				bankno:'尾号1001（储蓄卡）',
				money: _utils.formatMoney(2000000.32, 2),
				bankshow:false,
				banklist: [{
					banklogo: require('../assets/images/bank.png'),
					bankname: '招商银行',
					bankno: '621811228888'
				}, {
					banklogo: require('../assets/images/bank.png'),
					bankname: '招商银行',
					bankno: '621811228888'
				}],
				active: false

			}
		},
		methods: {
			selectBank(i) {
				this.banklist.forEach((i) => {
					this.$set(i, "active", false);
				});
				this.$set(i, "active", true);
			},
			goToBank() {
				if(this.bankname){
					this.$router.push("/addBankCard")
				}else{
					this.bankshow = true
				}
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
					float: left;
				}
				.bank-name-no {
					float: left;
					div {
						font-size: 1.4rem;
						color: #475966;
						line-height: 2rem;
						padding-left: 1.3rem;
						font-weight: 400;
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
		.banklistwrapper {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .6);
			position: fixed;
			top: 0;
			left: 0;
			.banklist {
				width: 96%;
				height: auto;
				background: #fff;
				position: fixed;
				bottom: 9rem;
				border-radius: 14px;
				left: 50%;
				margin-left: -48%;
				.bank {
					color: #1A2833;
					font-size: 1.4rem;
				}
				.active {
					width: 100%;
					height: 100%;
					background: #FAFAFA;
					border-radius: 14px;
				}
				.bank-logo {
					float: left;
				}
				.bank-no {
					float: left;
					padding-left: 1.5rem;
				}
				.gou-xuan {
					float: right;
					margin-top: 1rem;
				}
			}
			.cancle-btn {
				width: 96%;
				height: 5.6rem;
				background: #fff;
				border-radius: 1.4rem;
				position: fixed;
				bottom: 2.9rem;
				left: 50%;
				margin-left: -48%;
				color:#1A2833;
				font-size:1.8rem;
			}
		}
	}
</style>