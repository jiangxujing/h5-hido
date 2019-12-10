<template>
	<div v-if="loadingEnd" style="padding-top:1rem">
		<div v-if="packageList && packageList.length > 0">
			<div class="gift-package" v-for="(p,index) in packageList" :key="index" @click="goToGiftDetail(p.orderNo)">
				<div class="time-status">
					<div class="time">{{p.orderTime?$utils.dateFormatter(p.orderTime, "yyyy/MM/dd HH:mm:ss"):''}}</div>
					<div class="status">{{getStatusDesc(p.orderStatus)}}</div>
				</div>
				<div class="borderStyle1"></div>
				<div style="overflow:hidden">
					<img class="libao" :src="p.headPicture" />
					<div style="overflow:hidden;padding-right: 1.5rem;position: relative;">
						<div style="float:left">
							<div class="package-price">
								<div class="van-multi-ellipsis--l2" style="color:#1A2833;font-size:1.5rem">
									{{p.productName}}
								</div>
								<div v-for="(l,index) in p.goodsList" :key="index" style="padding-top:0.7rem">
									<span style="font-size:1.4rem;color:#8A9399">{{l.goodsDesc}}*{{l.goodsCount}}</span>
								</div>
							</div>
							<span style="color:#1A2833;font-weight:bold;font-size:1.6rem;position: absolute;right:1.5rem;bottom:-1px;" class="DINAlternate-Bold">￥<span>{{$utils.formatMoney(p.oderAmount,1)}}</span></span>
						</div>
					</div>
					<!--<div style="overflow:hidden;padding-left:1.2rem">
						<span style="color:#1A2833;font-weight:bold;font-size:1.6rem;float:right;padding-right: 1.5rem;" class="DINAlternate-Bold">￥<span>{{$utils.formatMoney(p.oderAmount,1)}}</span></span>
					</div>-->
				</div>
			</div>
		</div>
		<div v-else class="no-content">暂无礼包</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	export default {
		name: 'giftPackage',
		data() {
			return {
				packageList: [],
				orderTime: '',
				packageName: '',
				loadingEnd:false
			}
		},
		methods: {
			getGiftList() {
				api.post(api.getUrl('queryPurchasedPackageList', 'collections'), {}).then(res => {
					if(res.code == '0000') {
						this.loadingEnd = true
						this.packageList = res.content
					}
				})
			},
			goToGiftDetail(orderNo) {
				this.$router.push("/giftPackageDetail?orderNo=" + orderNo)
			},
			getStatusDesc(status) {
				if(status == 1) {
					return '待支付'
				} else if(status == 3) {
					return '待发货'
				} else if(status == 7) {
					return '已发货'
				} else {
					return '待发货'
				}
			}

		},
		mounted() {
			if(sessionStorage.getItem('h5paysuccess')) {
				sessionStorage.removeItem('h5paysuccess')
			}
			document.title = '我的礼包'
			if(navigator.userAgent.toLowerCase().indexOf('hido')  !=  -1) {
				api.callHandler('callInit', {
					interceptBack: false
				})
				setTimeout(() => {
					this.getGiftList()
				}, 600)
			} else {
				this.getGiftList()
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
			api.setupWebViewJavascriptBridge((bridge) => {
				bridge.registerHandler('invokeBackPress', (data) => {
					api.setupWebViewJavascriptBridge((bridge) => {
						bridge.callHandler('callFinish', {}, (data) => {})
					})
				})
			})
		},
	}
</script>

<style lang="scss">
	.gift-package {
		width: 100%;
		background: #fff;
		height: auto;
		margin-bottom: 1rem;
		padding: 0 0 1.8rem 1.5rem;
		.time-status {
			overflow: hidden;
			height: 3.6rem;
			line-height:3.6rem;
			font-size: 1.2rem;
			.time {
				float: left;
				color: #8A9399;
			}
			.status {
				float: right;
				padding-right: 1.5rem;
			}
		}
		.borderStyle1 {
			width: 100%;
			height: 1px;
			background: #F0F0F0;
			margin-bottom: 1.8rem;
		}
		.libao {
			width: 6.5rem;
			height: 6.5rem;
			border-radius: .3rem;
			float: left;
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
</style>