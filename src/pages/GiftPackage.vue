<template>
	<div>
			<div class="gift-package">
				<div class="time-status">
					<div class="time">2019/10/15 13:38:38</div>
					<div class="status">已发货</div>
				</div>
				<div class="borderStyle"></div>
				<div style="overflow:hidden">
					<img class="libao" src="../assets/images/libao.png" />
					<div style="overflow:hidden;padding-right: 1.5rem;">
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
						<span style="color:#FF7B31;font-size:1.6rem;float:right;padding-right: 1.5rem;">￥399</span>
					</div>
				</div>
			</div>
	</div>
</template>

<script>
	export default {
		name: 'giftPackage',
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		mounted() {
			

		},
	}
</script>

<style lang="scss">
		.gift-package {
			width: 100%;
			background: #fff;
			height: auto;
			margin-top: 1rem;
			padding: 1.8rem 0 1.8rem 1.5rem;
			.time-status{
				overflow:hidden;
				height:3.6rem;
				font-size:1.2rem;
				.time{
					float:left;
					color:#8A9399;
				}
				.status{
					float:right;
					padding-right:1.5rem;
				}
			}
			.borderStyle{
					width:100%;
					height:1px;
					background: #F0F0F0;
					margin-bottom:1.8rem;
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
</style>