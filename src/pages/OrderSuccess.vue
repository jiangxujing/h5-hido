<template>
	<div style="width:100%;height:100%">
		<div class="order-status">
			<img src="../assets/images/order-success.png" />
			<div class="sucess-txt" style="padding-top:3rem;">您的订单已提交成功</div>
			<div class="sucess-txt" style="padding-top:1.1rem;">会为您尽快安排发货</div>
			<div style="#8A9399;font-size:1.4rem;padding-top:2rem;">{{second}}s后自动跳转回购买界面</div>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	export default {
		name: 'shippingAddress',
		data() {
			return {
				second: 3
			}
		},
		methods: {},
		mounted() {
			let interval = setInterval(() => {
				this.second--
					if(this.second <= 0) {
						clearInterval(interval)
					}
			}, 1000)
			setTimeout(() => {
				this.$router.push("/productDetail?packageCode=" + sessionStorage.getItem('packageCode'))
			}, 3000)
		},
	}
</script>

<style lang="scss">
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
</style>