<template>
	<div class="gift-package-detail">
		<div class="gift-package">
			<div style="overflow:hidden">
				<img class="libao" src="../assets/images/libao.png" />
				<div style="overflow:hidden;padding-right: 1.5rem;">
					<div style="float:left">
						<div class="package-price">
							<div class="van-multi-ellipsis--l2" style="color:#1A2833;font-size:1.5rem">
								399大礼包399大礼包39999大礼包399大礼包39999大礼包399大礼包39999大礼包399大礼包39999大礼包399大礼包39999大礼包399大礼包39999大礼包399大礼包399
							</div>
							<div class="price">
								￥399
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
					<div class="project-name">无针水光针</div>
					<div class="project-num">
						<span>可用：</span>
						<span>1/5</span>
					</div>
				</div>
				<div class="voucher-number-list">
					<div class="voucher-content" v-for="(item,index) in voucherList" :key="index">
						<div class="voucher-number" :class="item.status == '未使用'?'active-number':''">
							<span>券号：</span>
							<span>{{item.number}}</span>
						</div>
						<div class="voucher-status" :class="item.status == '未使用'?'active-status':''">{{item.status}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="delivery-goods">
			<div class="goods-staus">
				<div>配送商品</div>
				<div>已发货</div>
			</div>
			<div class="borderStyle"></div>
			<div class="goods-title">
				修复面膜x12；针剂x8
			</div>
			<div class="good-user-detail">
				<div>
					<div>收件人</div>
					<div>王静</div>
				</div>
				<div>
					<div>收件人</div>
					<div>王静</div>
				</div>
				<div>
					<div>收件人</div>
					<div>王静</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'productDetail',
		data() {
			return {
				voucherList:[
					{
						number:'2019897937463',
						status:'未使用'
					},{
						number:'2019897937463',
						status:'未使用'
					},{
						number:'2019897937463',
						status:'已使用'
					},{
						number:'2019897937463',
						status:'已使用'
					}
				]
			}
		},
		methods: {
			
		},
		mounted() {
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
						padding-top:1.2rem;
						&:first-child{
							padding-top:0;
						}
						.voucher-number {
							float: left;
							color:#8A9399;
							text-decoration:line-through;
						}
						.active-number{
							color:#1A2833;
							text-decoration:none!important;
						}
						.active-status{
							color:#FF7B31!important;
							}
						.voucher-status {
							float: right;
							color:#8A9399;
							
						}
					}
				}
			}
		}
		.delivery-goods{
					width:100%;
					height:auto;
					background: #fff;
					margin-top:1.1rem;
					.goods-staus{
						overflow: hidden;
						padding:1.7rem 1.5rem;
						font-size:1.5rem;
						div:first-child{
							float:left;
							color:#8A9399;
						}
						div:last-child{
							float:right;
							color:#1A2833;
						}
					}
					.goods-title{
						color:#1A2833;
						font-size:1.4rem;
						font-weight: 500;
						padding:0 0 1.2rem 1.5rem;
					}
					.good-user-detail{
						margin:0 1.5rem 1.9rem 1.5rem;
						height:auto;
						background:#FAFAFA ;
					}
				}
	}
</style>