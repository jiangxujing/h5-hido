<template>
	<div class="product-detail">
		<div class="content1">
			<div class="content1-header">
				<img class="detail-img" src="../assets/images/detai-img.jpg" />
				<div class="tips">
					<div class="header-tips">
						<img src="../assets/images/gou.png"/>
						<span>随时退</span>
					</div>
					<div class="header-tips tips-guoqi">
						<img src="../assets/images/gou.png"/>
						<span>过期退</span>
					</div>
					<div class="buy-count">131人购买</div>
				</div>
			</div>
		</div>
		<div class="content1 content2" style="margin-top:0.8rem">
			<h2>礼包说明</h2>
			<div class="content2-detail">
				<h3>大气泡+水光针体验套餐</h3>
				<div class="package">
					<div class="package-l">
						<img src="../assets/images/double.png" />
						<span>大气泡</span>
					</div>
					<div class="package-r">
						<span>12次</span>
						<span>|</span>
						<span>￥219</span>
					</div>
				</div>
				<div class="borderStyle"></div>
				<div class="merber-package-price">
					<div class="package-price-left">会员礼包价</div>
					<div class="package-price-right">
						<span>原价￥1,200</span>
						<span style="color:#FF7B31">￥399</span>
					</div>
				</div>
			</div>
			<div class="advantage">
				<img src="../assets/images/advantage.jpg" />
			</div>
		</div>
		<div class="content1 content2 content3">
			<h2>产品使用规则</h2>
			<img src="../assets/images/productRule.png" />
		</div>
		<div class="content1 content2 content3 content4">
			<h2>其他礼包</h2>
			<div class="other-packages">
				<div>
					<div style="overflow:hidden">
						<div style="float:left">
							<img class="libao" src="../assets/images/libao.png" />
							<div class="package-price">
								<div style="color:#FF7B31">
									<span style="font-size:2.1rem;">￥390</span>
									<span style="font-size:1.4rem;">会员礼包</span>
								</div>
								<div style="color:#8A9399;font-size:1.7rem">原价￥12，000</div>
							</div>
						</div>
						<div class="buynumber">131人购买</div>
					</div>
					<div>
						<div class="description">水光针12次体验套餐*12</div>
						<div class="share">
							<button>立即分享</button>
						</div>
					</div>
				</div>
			</div>
			<div class="buy">￥399成为代理</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss">
	.product-detail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		.content1 {
			width: 100%;
			height: auto;
			background: #fff;
			.content1-header {
				width: 92%;
				margin: 0 auto;
				.detail-img {
					width: 100%;
					margin-top: 2.1rem;
				}
				.tips {
					color: #8A9399;
					margin-top: 1.4rem;
					overflow: hidden;
					padding-bottom: 1.8rem;
					font-size: 1.2rem;
					.header-tips {
						float: left;
						img{
							vertical-align: middle;
							margin-top:-3px;
							width:7px;
						}
					}
					.tips-guoqi {
						margin-left: 1.5rem;
					}
					.buy-count {
						float: right;
					}
				}
			}
		}
		.content2 {
			padding-bottom: 1.8rem;
			h2 {
				padding-top: 2.8rem;
				padding-left: 1.5rem;
				padding-bottom: 2.4rem;
			}
			.content2-detail {
				width: 92%;
				margin: 0 auto;
				height: auto;
				background: #FAFAFA;
				overflow: hidden;
				padding-bottom: 2.4rem;
				h3 {
					font-size: 1.6rem;
					padding-top: 2.4rem;
					margin-left: 2rem;
				}
				.package {
					margin-top: 3rem;
					overflow: hidden;
					font-size: 1.4rem;
					.package-l {
						padding-left: 2rem;
						float: left;
						img {
							height: 8px;
							vertical-align: middle;
						}
					}
					.package-r {
						float: right;
						padding-right: 2rem;
					}
				}
				.borderStyle {
					width: 30.5rem;
					height: 1px;
					background: #EAEAEA;
					margin: 0 auto;
					margin-top: 2rem;
				}
				.merber-package-price {
					margin-top: 2rem;
					padding: 0 2rem;
					overflow: hidden;
					color: #8A9399;
					.package-price-left {
						float: left;
						font-size: 1.4rem;
					}
					.package-price-right {
						float: right;
						font-size: 1.2rem;
					}
				}
			}
			.advantage {
				width: 92%;
				margin: 0 auto;
				margin-top: 1rem;
				img {
					width: 100%;
				}
			}
		}
		.content3 {
			margin-top: 0.8rem;
			text-align: center;
			h2 {
				text-align: left;
			}
			img {
				width: 92%;
			}
		}
		.content4 {
			text-align: left;
			.other-packages {
				width: 92%;
				margin:0 auto;
				height: auto;
				border: 1px solid #EAEAEA;
				border-radius: 5px;
				overflow: hidden;
				padding: 1rem 1.2rem 1.5rem;
			}
			.libao {
				width: 52px;
				height: 52px;
				border-radius: 3px;
				float: left;
			}
			.buynumber{
				color:#8A9399;
				font-size:1.7rem;
				float:right;
			}
			.package-price {
				float: left;
				padding-left:1.2rem;
			}
			.description {
				float: left;
				font-size:1.2rem;
				color:#475966;
				margin-top:1.7rem;
			}
			.share {
				float: right;
				button{
					width:82px;
					height:30px;
					background:linear-gradient(132deg,rgba(255,175,130,1) 0%,rgba(255,123,49,1) 100%);
					border-radius:15px;
					color:#fff;
					outline: none;
					border:none;
				}
			}
			.buy{
				margin:0 auto;
				margin-top:1.6rem;
				text-align: center;
				width:92%;
				height:46px;
				background:linear-gradient(132deg,rgba(255,175,130,1) 0%,rgba(255,123,49,1) 100%);
				border-radius:29px;
				font-size:1.8rem;
				font-weight:600;
				color:#fff;
				line-height:46px;
			}
		}
	}
</style>