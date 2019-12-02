<template>
	<div class="reservationStatus">
		<img src="../assets/images/order-success.png" class="reservation-img"/>
		<div v-if="reservationShow">
			<div class="title1 color-833 font-18 font-weight-600">预约成功</div>
			<div class="title2 color-833 font-16 font-weight-400">请按时前往医院就诊哦</div>
			<button class="font-17 font-weight-500" @click="goReservationDetail">查看预约详情</button>
		</div>
		<div v-else>
			<div class="title1 color-833 font-18 font-weight-600">预约成功</div>
			<div class="title2 color-833 font-16 font-weight-400">支付成功</div>
			<button class="font-17 font-weight-500" @click="goOrderDetail">查看详情</button>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	import { Toast } from 'vant'
	export default {
		name: 'reservation',
		data() {
			return {
				phone: '',
				grayShow: true,
				advisoryShow: false,
				advisorysetShow: true,
				gray: true,
				reservationShow:this.$route.query.reservation
			}
		},
		methods: {
			goReservationDetail() {
				this.$router.push("/confirmedReserve?businessNo="+sessionStorage.getItem('businessNo'))
			},
			goOrderDetail(){
				this.$router.push("/orderDetail?orderNo="+sessionStorage.getItem('orderNo'))
			}
		},
		mounted() {
			 this.$route.query.reservation==1?this.reservationShow = true:this.reservationShow = false
			if(this.$route.query.reservation==1){
				document.title = '预约成功'
			}else{
				document.title = '支付成功'
			}
			
			let params = {
				interceptBack: true
			}
			api.setupWebViewJavascriptBridge((bridge) => {
				bridge.callHandler('callInit', params, (data) => {
					api.setupWebViewJavascriptBridge((bridge) => {
						bridge.registerHandler('invokeBackPress', (data) => {
							api.setupWebViewJavascriptBridge((bridge) => {
								bridge.callHandler('callFinish', {}, (data) => {})
							})
						})
					})
				})
			})
			sessionStorage.getItem('h5paysuccess')?sessionStorage.removeItem('h5paysuccess'):''
		}
	}
</script>

<style lang="scss">
		@import '../assets/scss/common.scss';
	.reservationStatus{
		width:100%;
		height:100%;
		text-align: center;
		background: #fff;
		.reservation-img{
			width:6.6rem;
			padding-top:9rem;
		}
		.title1{
			padding-top:3rem;
		}
		.title2{
			padding-top:1.2rem;
		}
		button{
			width:70%;
			height:4.5rem;
			background:linear-gradient(132deg,rgba(255,175,130,1) 0%,rgba(255,123,49,1) 100%);
			border-radius:2.3rem;
			color:#fff;
			margin-top:5rem;
		}
	}
</style>