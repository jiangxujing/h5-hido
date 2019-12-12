<template>
	<div class="gift-package-detail">
		<div class="gift-package">
			<div style="overflow:hidden">
				<img class="libao" :src="giftDetail.listPicture" />
				<div style="overflow:hidden;padding-right: 1.5rem;">
					<div style="float:left">
						<div class="package-price">
							<div class="van-multi-ellipsis--l2" style="color:#1A2833;font-size:1.5rem">
								{{giftDetail.productName}}
							</div>
							<div class="price" v-if="giftDetail.orderRealAmt">
								￥{{giftDetail.orderRealAmt/100}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="project-detail">
			<div class="hexiao-title">核销券号</div>
			<div class="borderStyle1"></div>
			<div class="project" v-for="(g,index) in giftDetail.virtualGoods" :key="index">
				<div class="project-content">
					<div class="project-name">{{g.goodsDesc}}</div>
					<div class="project-num">
						<span>可用：</span>
						<span>{{g.goodsCount}}</span>
					</div>
				</div>
				<div class="voucher-number-list">
					<div class="voucher-content" v-for="(item,index) in g.writeOff" :key="index">
						<div class="voucher-number" :class="item.status == '未使用'?'active-number':''">
							<span>券号：</span>
							<span>{{item.consumerCode}}</span>
						</div>
						<div class="voucher-status" :class="!item.writeOffTime ?'active-status':''">{{item.status}}</div>
						<div class="voucher-status" style="padding-right:1.3rem">{{item.writeOffTime}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="delivery-goods">
			<div class="goods-staus">
				<div>配送商品</div>
				<div>{{status}}</div>
			</div>
			<div class="borderStyle1"></div>
			<div class="goods-title" v-for="(i,index) in giftDetail.shipGoods" :key="index" style="display: block;">
				{{i.goodsDesc}}*{{i.goodsCount}}
			</div>
			<div class="good-user-detail">
				<div class="good-user">
					<div>收件人</div>
					<div>{{giftDetail.receiverName}}</div>
				</div>
				<div class="good-user">
					<div>电话</div>
					<div>{{giftDetail.receiverPhone}}</div>
				</div>
				<div class="good-user">
					<div>收货地址</div>
					<div style="line-height: 2rem;">{{giftDetail.area}}{{giftDetail.detailAddr}}</div>
				</div>
				<div class="borderStyle1" style="margin-top:1.4rem" v-if="giftDetail.expressNo"></div>
				<div class="logistics" v-if="giftDetail.expressNo">
					<div>
						<span>{{giftDetail.expressCompany}}:</span>
						<span>{{giftDetail.expressNo}}</span>
					</div>
					<div class="copy tag-read" :data-clipboard-text="giftDetail.expressNo" @click="copy">复制</div>
				</div>
			</div>
		</div>
		<div class="order-detail">
			<div class="order-title">订单信息</div>
			<div class="borderStyle1" style="margin-bottom:0"></div>
			<div class="good-user-detail" style="background: #fff;padding:1rem 0 1.9rem">
				<div class="good-user order-d">
					<div>订单编号：</div>
					<div>{{giftDetail.orderNo}}</div>
				</div>
				<div class="good-user order-d">
					<div>创建时间：</div>
					<div>{{giftDetail.createTime?$utils.dateFormatter(giftDetail.createTime, "yyyy-MM-dd HH:mm:ss"):''}}</div>
				</div>
				<div class="good-user order-d">
					<div>付款时间：</div>
					<div>{{giftDetail.payTime?$utils.dateFormatter(giftDetail.payTime, "yyyy-MM-dd HH:mm:ss"):''}}</div>
				</div>
				<div class="good-user order-d">
					<div>支付方式：</div>
					<div>{{payMethodType}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Clipboard from 'clipboard';
	import { Toast } from 'vant'
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	export default {
		name: 'productDetail',
		data() {
			return {
				voucherList: [{
					number: '2019897937463',
					status: '未使用'
				}, {
					number: '2019897937463',
					status: '未使用'
				}, {
					number: '2019897937463',
					status: '已使用'
				}, {
					number: '2019897937463',
					status: '已使用'
				}],
				status: '',
				payMethodType:'微信支付',
				giftDetail: {},

			}
		},
		methods: {
			copy() {
				var clipboard = new Clipboard('.tag-read')
				clipboard.on('success', e => {
					Toast('复制成功') //这里你如果引入了elementui的提示就可以用，没有就注释即可
					// 释放内存  
					clipboard.destroy()
				})
				clipboard.on('error', e => {
					// 不支持复制  
					console.log('该浏览器不支持自动复制')
					// 释放内存  
					clipboard.destroy()
				})
			},
			getPackageOrder(orderNo) {
				let req = {
					orderNo: orderNo
				}
				api.post(api.getUrl('queryPackageOrderDetail','collections'), req).then(res => {
					if(res.code == 0) {
						this.giftDetail = res.content;
						console.log(this.giftDetail)
						if(res.content.payType == 2){
							this.payMethodType = '微信支付'
						}else if(res.content.payType == 0){
							this.payMethodType = '未支付'
						}else if(res.content.payType == 1){
							this.payMethodType = '钱包支付'
						}else if(res.content.payType == 3){
							this.payMethodType = '快捷支付'
						}else{
							this.payMethodType = '微信支付'
						}
						if(this.giftDetail.status == 1) {
							this.status = '待支付'
						} else if(this.giftDetail.status == 3) {
							this.status = '待发货'
						} else if(this.giftDetail.status == 7) {
							this.status = '已发货'
						}
						this.giftDetail.virtualGoods.forEach((i) => {
							i.writeOff.forEach((k) => {
								if(k.writeOffTime){
									this.$set(k, "status", '已使用');
								}else{
									this.$set(k, "status", '未使用');
								}
						});
					});
					}
				}).catch((e) => {
					
				})
			}
		},
		mounted() {
			document.title = '礼包详情'
			let orderNo = this.$route.query.orderNo
			if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
				api.callHandler('callInit', {interceptBack: false})
				setTimeout(() => {
						this.getPackageOrder(orderNo)
				}, 600)
			} else {
					this.getPackageOrder(orderNo)
			}
			console.log(orderNo)
			//this.getPackageOrder(orderNo)
			if(this.giftDetail.status == 1) {
				this.status = '待支付'
			} else if(this.giftDetail.status == 3) {
				this.status = '待发货'
			} else if(this.giftDetail.status == 7) {
				this.status = '已发货'
			}
		},
	}
</script>

<style lang="scss">
	.gift-package-detail {
		padding-top: 1rem;
		overflow-x:hidden;
		.borderStyle1 {
			width: 100%;
			height: 1px;
			background: #F0F0F0;
			margin-bottom: 1.8rem;
			margin-left: 1.5rem;
		}
		.gift-package {
			width: 100%;
			background: #fff;
			height: auto;
			padding: 1.8rem 0 1.8rem 1.5rem;
			.libao {
				width: 7.2rem;
				height: 7.2rem;
				border-radius: .3rem;
				float: left;
			}
			.package-price {
				float: left;
				padding-left: 1.2rem;
			}
			.price {
				color: #FF7B31;
				font-size: 1.8rem;
				padding-top: 1.3rem;
			}
		}
		.project-detail {
			width: 100%;
			height: auto;
			background: #fff;
			margin-top: 1rem;
			padding-bottom: 1.8rem;
			.hexiao-title {
				padding: 1.55rem 1.5rem;
				color: #8A9399;
				font-size: 1.5rem;
				font-weight:500;
			}
			.project {
				padding: 0 1.5rem;
				margin-top:2rem;
				.project-content {
					overflow: hidden;
					.project-name {
						color: #1A2833;
						font-size: 1.4rem;
						float: left;
					}
					.project-num {
						float: right;
						font-size: 1.4rem;
						span:first-child {
							color: #8A9399
						}
						span:last-child {
							color: #1A2833;
						}
					}
				}
				.voucher-number-list {
					width: 100%;
					height: auto;
					font-size: 1.3rem;
					background: #FAFAFA;
					margin-top: 1.2rem;
					padding: 1.4rem 1.2rem;
					.voucher-content {
						overflow: hidden;
						padding-top: 1.2rem;
						&:first-child {
							padding-top: 0;
						}
						.voucher-number {
							float: left;
							color: #8A9399;
							text-decoration: line-through;
						}
						.active-number {
							color: #1A2833;
							text-decoration: none!important;
						}
						.active-status {
							color: #FF7B31!important;
						}
						.voucher-status {
							float: right;
							color: #8A9399;
							font-size:1.3rem;
						}
					}
				}
			}
		}
		.delivery-goods {
			width: 100%;
			height: auto;
			background: #fff;
			margin-top: 1.1rem;
			padding-bottom: 1.9rem;
			margin-bottom:1.1rem;
			.goods-staus {
				overflow: hidden;
				padding: 1.55rem 1.5rem;
				font-size: 1.5rem;
				div:first-child {
					float: left;
					color: #8A9399;
					font-weight: 500;
				}
				div:last-child {
					float: right;
					color: #1A2833;
				}
			}
			.goods-title {
				color: #1A2833;
				font-size: 1.4rem;
				font-weight: 500;
				padding: 0 0 1.2rem 1.5rem;
				display: inline-block;
			}
		}
		.good-user-detail {
			margin: 0 1.5rem 0 1.5rem;
			height: auto;
			background: #FAFAFA;
			padding: 1.2rem 1.4rem;
			font-size: 1.3rem;
			border-radius:3px;
			.good-user {
				overflow: hidden;
				padding-top: 1.2rem;
				div:first-child {
					float: left;
					color: #8A9399;
					width:6rem;
				}
				div:last-child {
					float: left;
					color: #1A2833;
					padding-left:1rem;
				}
			}
			.order-d {
				div:first-child {
					width:8rem;
				}
				div:last-child {
					float: right;
				}
			}
			.logistics {
				overflow: hidden;
				div:first-child {
					float: left;
				}
				div:last-child {
					float: right;
				}
			}
		}
		.order-detail {
			width: 100%;
			height: auto;
			background: #fff;
			.order-title {
				color: #8A9399;
				font-size: 1.5rem;
				padding: 1.55rem 1.5rem;
			}
		}
		.copy {
			color: #FF7B31;
		}
		#logisticsId {
			border: none;
			background: none;
			height: 1.7rem;
		}
	}
</style>