<template>
	<div class="gift-package-detail">
		<div class="gift-package">
			<div style="overflow:hidden">
				<img class="libao" :src="giftDetail.imgurl" />
				<div style="overflow:hidden;padding-right: 1.5rem;">
					<div style="float:left">
						<div class="package-price">
							<div class="van-multi-ellipsis--l2" style="color:#1A2833;font-size:1.5rem">
								{{giftDetail.packageName}}
							</div>
							<div class="price">
								￥{{giftDetail.oderAmount}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="project-detail">
			<h2>核销券号</h2>
			<div class="borderStyle"></div>
			<div class="project">
				<div class="project-content">
					<div class="project-name">{{giftDetail.virtualGoods.goodsDesc}}</div>
					<div class="project-num">
						<span>可用：</span>
						<span>{{giftDetail.virtualGoods.goodsCount}}</span>
					</div>
				</div>
				<div class="voucher-number-list">
					<div class="voucher-content" v-for="(item,index) in giftDetail.virtualGoods.writeOff" :key="index">
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
			<div class="borderStyle"></div>
			<div class="goods-title">
				修复面膜x12；针剂x8
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
					<div style="line-height: 2rem;">{{giftDetail.area}}{{giftDetail.address}}</div>
				</div>
				<div class="borderStyle" style="margin-top:1.4rem"></div>
				<div class="logistics">
					<div>
						<span>中通快递:</span>
						<span>{{giftDetail.logisticsNo}}</span>
					</div>
					<div class="copy tag-read" :data-clipboard-text="giftDetail.logisticsNo" @click="copy">复制</div>
				</div>
			</div>
		</div>
		<div class="order-detail">
			<div class="order-title">订单信息</div>
			<div class="borderStyle" style="margin-bottom:0"></div>
			<div class="good-user-detail" style="background: #fff;">
				<div class="good-user order-d">
					<div>订单编号：</div>
					<div>{{giftDetail.orderNo}}</div>
				</div>
				<div class="good-user order-d">
					<div>创建时间：</div>
					<div>{{giftDetail.createTime}}</div>
				</div>
				<div class="good-user order-d">
					<div>付款时间：</div>
					<div>{{giftDetail.orderTime}}</div>
				</div>
				<div class="good-user order-d">
					<div>支付方式：</div>
					<div>微信支付</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Clipboard from 'clipboard';
	import { Toast } from 'vant'
	import api from '../common/api.js'
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
				giftDetail: {
					"address": "测试内容n7hi",
					"area": "测试内容tt61",
					"createTime": "测试内容0u1h",
					"oderAmount": 34844,
					"orderNo": "测试内容d314",
					"orderTime": "测试内容57o1",
					"packageCode": "测试内容lyz3",
					"packageName": "测试内容6rqv",
					"payType": "测试内容y3ua",
					"receiverName": "测试内容8q73",
					"receiverPhone": "测试内容1b56",
					"imgurl": require('../assets/images/libao.png'),
					"logisticsNo": 32109210119,
					"shipGoods": [{
						"goodsCount": 46472,
						"goodsDesc": "测试内容mr5r"
					}],
					"status": 7,
					"virtualGoods": {
						"goodsCount": 15252,
						"goodsDesc": "测试内容5alx",
						"writeOff": [{
							"consumerCode": "122222222222",
							"writeOffTime": "2019-10-11"
						},{
							"consumerCode": "333333333",
							"writeOffTime": ""
						}]
					}
				},

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
				api.post(api.getUrl('queryPackageOrderDetail'), req).then(res => {
					if(res.code == '0000') {
						this.giftDetail = res.content;
						if(this.giftDetail.status == 1) {
							this.status = '待支付'
						} else if(this.giftDetail.status == 3) {
							this.status = '待发货'
						} else if(this.giftDetail.status == 7) {
							this.status = '已发货'
						}
					}
				}).catch((e) => {
					this.giftDetail = res.content;

				})
			}
		},
		mounted() {
			let orderNo = this.$route.query.orderNo
			console.log(orderNo)
			//this.getPackageOrder(orderNo)
			if(this.giftDetail.status == 1) {
				this.status = '待支付'
			} else if(this.giftDetail.status == 3) {
				this.status = '待发货'
			} else if(this.giftDetail.status == 7) {
				this.status = '已发货'
			}
			
			this.giftDetail.virtualGoods.writeOff.forEach((i) => {
						if(i.writeOffTime){
							this.$set(i, "status", '已使用');
						}else{
							this.$set(i, "status", '未使用');
						}
					});
		},
	}
</script>

<style lang="scss">
	.gift-package-detail {
		.borderStyle {
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
			margin-top: 1rem;
			padding: 1.8rem 0 1.8rem 1.5rem;
			.libao {
				width: 7.2rem;
				height: 7.2rem;
				border-radius: 3px;
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
			h2 {
				padding: 1.8rem 1.5rem;
				color: #8A9399;
				font-size: 1.5rem;
			}
			.project {
				padding: 0 1.5rem;
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
			.goods-staus {
				overflow: hidden;
				padding: 1.7rem 1.5rem;
				font-size: 1.5rem;
				div:first-child {
					float: left;
					color: #8A9399;
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
			}
		}
		.good-user-detail {
			margin: 0 1.5rem 1.9rem 1.5rem;
			height: auto;
			background: #FAFAFA;
			padding: 1.2rem 1.4rem;
			font-size: 1.3rem;
			.good-user {
				overflow: hidden;
				padding-top: 1.2rem;
				div:first-child {
					float: left;
					color: #8A9399;
				}
				div:last-child {
					float: right;
					color: #1A2833;
					width: 70%;
				}
			}
			.order-d {
				div:last-child {
					float: left;
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
				padding: 1.8rem 1.5rem;
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