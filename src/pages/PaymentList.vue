<template>
	<div class="paymentMethod" >
		<div class="payment-header">
				<div class="title">需支付</div>
				<div class="money">
					<span>￥</span>
					<span>{{$utils.formatMoney(salesPrice,1)}}</span>
				</div>
			</div>
			<div class="payment-method-list">
				<div v-for="(p,index) in payTypeList" :key="index" @click="selectPayType(p)">
					<img class="weixin" src="../assets/images/weixin-pay.png" />
					<span>{{p.payTypeDesc}}</span>
					<img class="gouxuan" src="../assets/images/gouxuan@2x.png" v-if="p.active"/>
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
		name: 'paymentList',
		data() {
			return {
				payTypeList:[{
		            "payTypeCode": "1111",
		            "payTypeDesc": "微信"
		        },{
		            "payTypeCode": "2222",
		            "payTypeDesc": "银行卡支付"
		        },{
		            "payTypeCode": "3333",
		            "payTypeDesc": "么么钱包"
		        }],
		        salesPrice:'1000'
			}
		},
		methods: {
			getPaymentList(){
				let req = {
					phone:sessionStorage.getItem('phone')
				}
				api.post(api.getUrl('paymentType'), req).then(res => {
						if(res.code == 0) {
							this.payTypeList = res.content
						} 

					}).catch(() => {
					})
			},
			selectPayType(i){
				this.payTypeList.forEach((i) => {
					this.$set(i, "active", false);
				})
				this.$set(i, "active", true);
			}
		},
		mounted() {
//				this.withdrawalDetail.cardList.forEach((i) => {
//					this.$set(i, "active", false);
//				});
			this.getPaymentList()
			
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
			div{
				height:6.5rem;
				border-bottom:1px solid #EAEAEA;
				padding-top:1rem;
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
	}
</style>