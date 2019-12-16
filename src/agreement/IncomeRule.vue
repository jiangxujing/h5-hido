<template>
	<div class="agreement income-rule">
		<div class="agreement-content">
			<h5 class="agreement-title">收益规则</h5>
			<div class="agreement-main">
				<ul>
					<li><span class="agreement-weight">累计收益：</span>该账户产生的总奖励金额，即已提取收益金额+可提取收益金额；</li>
					<li><span class="agreement-weight">可提取收益：</span>目前可提取的奖励金额，即累计收益金额-已提取收益金额；</li>
					<li><span class="agreement-weight">奖励金-礼包：</span>直接推荐好友/间接推荐好友点击购买礼包产品且完成支付后，您可获得最高150元的随机奖励金额;</li>
				</ul>
				<div class="agreement-annotate">名称解释：</div>
				<p><span class="weight">直接推荐好友：</span>直接通过您分享的礼包商品链接点击购买，或购买礼包商品时在“推荐人手机号”栏位填入您注册绑定该平台的手机号，并完成支付的用户；</p>
				<p><span class="weight">间接推荐好友：</span>通过您的直接推荐好友分享的礼包商品链接点击购买，或购买礼包商品时在“推荐人手机号”栏位填入您的直接推荐好友注册绑定该平台的手机号，并完成支付的用户；</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'income-rule',
	data() {
		return {

		}
	},
	mounted() {
		document.title = '收益规则'
	},
	methods: {
		
	}
}
</script>

<style lang="scss" scope>
	.income-rule {
		.agreement-title {
			color: #1A2833;
		}
		.agreement-main {
			color: #1A2833;
		}
		.agreement-annotate {
			color: #8A9399;
			font-size: 1.6rem;
			font-weight: 600;
			line-height: 3.2rem;
			margin-top: 2.4rem;
		}
		.weight {
			font-weight: 600;
    		color: #1A2833;
		}
		ul {
			margin-left: 2rem;
			li {
				list-style: disc;
				margin-bottom: .8rem;
			}
		}
	}
</style>