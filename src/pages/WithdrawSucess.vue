<template>
	<div class="withdrawSucess">
		<div>
			<img style="margin-top:9.5rem" src="../assets/images/withdraw-success.png" />
			<div style="margin-top:3rem">
				提现申请已提交
			</div>
			<div style="margin-top:1rem">
				预计1个工作日内到账
			</div>
			<button class="btn" @click="goBack">完成</button>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	export default {
		name: 'withdrawSucess',
		data() {
			return {

			}
		},
		methods: {
			goBack() {
				api.setupWebViewJavascriptBridge((bridge) => {
						bridge.callHandler('callFinish', {}, (data) => {
							console.log(data)
						})
					})

			}
		},
		mounted() {
			document.title = '提现成功'
		},
	}
</script>

<style lang="scss">
	.withdrawSucess {
		width: 100%;
		height: 100%;
		background: #fff;
		text-align: center;
		img {
			width: 6.6rem;
		}
		div {
			color: #1A2833;
			font-size: 1.8rem;
			font-weight: 600;
		}
		.btn {
			width: 71%;
			height: 4.5rem;
			background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
			border-radius: 2.3rem;
			color: #fff;
			font-weight: 500;
			font-size: 1.7rem;
			position: fixed;
			bottom: 7rem;
			left: 50%;
			margin-left: -35.5%
		}
	}
</style>