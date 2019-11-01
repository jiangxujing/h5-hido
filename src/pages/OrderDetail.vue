<template>
	<div class="orderDetail">
		<div class="receipt-address">
			<!--<div style="padding:1.5rem">
				<img class="add" src="../assets/images/add.png" />
				<span>收货信息</span>
				<img class="arrow" src="../assets/images/arrow.png" />
			</div>-->
			<div style="padding:1.5rem">
				<div>
					<span>张三 18739473644</span>
					<img class="arrow" src="../assets/images/arrow.png" />
				</div>
				<div class="adress adress1">
					上海市 上海市浦东新区
				</div>
				<div class="adress adress2">
					银山路183号5号楼102室（新桥创业园）
				</div>
			</div>
		</div>
		<div class="gift-package">
			<div style="overflow:hidden">
				<img class="libao" src="../assets/images/libao.png" />
				<div style="overflow:hidden">
					<div style="float:left">
						<div class="package-price">
							<div class="van-multi-ellipsis--l2" style="color:#1A2833;font-size:1.5rem">
								399大礼包399大礼包399
							</div>
							<div>
								<span style="font-size:1.4rem;color:#8A9399">修复面膜*10</span>
							</div>
						</div>
					</div>
					<div class="buynumber">x1</div>
				</div>
				<div style="overflow:hidden;padding-left:1.2rem">
					<span style="font-size:1.4rem;color:#8A9399;float:left">无针水光针*1</span>
					<span style="color:#FF7B31;font-size:1.6rem;float:right">￥399</span>
				</div>
			</div>
		</div>
		<div class="recommend">
			<span>推荐人手机号</span>
			<input type="text" placeholder="请输入推荐人手机号" />
		</div>
		<div class="submitTxt">
			<div style="padding:2.2rem 1.5rem;">
				<span style="color:#1A2833;font-size:1.6rem;">订单金额：</span>
				<span style="color:#FF7B31;font-size:1.8rem;">￥399</span>
				<button class="submit-gray">提交</button>
				<!--<button class="submit-active">提交</button>-->
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss">
	.orderDetail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		.receipt-address {
			width: 100%;
			height:auto;
			background: #fff;
			margin-top: 1rem;
			.adress{
				color:#8A9399;
				font-size:1.4rem;
			}
			.adress1{
				padding-top:1.2rem;
			}
			.adress2{
				padding-top:0.8rem;
			}
			.add {
				width: 1.8rem;
			}
			span {
				color: #1A2833;
				font-size: 1.6rem;
				font-weight: 600;
				/*margin-left: 8px;*/
			}
			.arrow {
				width: 1.9rem;
				float: right;
			}
		}
		.gift-package {
			width: 100%;
			background: #fff;
			height: auto;
			margin-top: 1rem;
			padding: 1.8rem 1.5rem;
			.libao {
				width: 52px;
				height: 52px;
				border-radius: 3px;
				float: left;
			}
			.libao {
				width: 52px;
				height: 52px;
				border-radius: 3px;
				float: left;
			}
			.buynumber {
				color: #1A2833;
				font-size: 1.5rem;
				float: right;
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
		.recommend {
			width: 100%;
			height: 6rem;
			background: #fff;
			margin-top: 1rem;
			span {
				color: #1A2833;
				font-size: 1.5rem;
				line-height: 6rem;
				padding-left: 1.5rem;
			}
			input {
				border: none;
				font-size: 1.5rem;
				padding-left: 2.5rem;
			}
		}
		.submitTxt {
			width: 100%;
			height: 8rem;
			background: #fff;
			position: fixed;
			bottom: 0;
			button {
				color: #fff;
				font-size: 1.4rem;
				outline: none;
				border: none;
				border-radius: 15px;
				 background:linear-gradient(132deg,#FFAF82 0%,#FF7B31 100%);
				width: 8.2rem;
				height: 3rem;
				float:right;
			}
			.submit-gray {
				opacity:0.5;
			}
			.submit-active {
              
			}
		}
	}
</style>