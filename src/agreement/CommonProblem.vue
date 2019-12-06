<template>
	<div class="agreement common-problem">
		<div class="agreement-content">
			<h5 class="agreement-title">常见问题</h5>
			<div class="agreement-main"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'common-problem',
	data() {
		return {

		}
	},
	mounted() {
		document.title = '常见问题'
	},
	methods: {
		
	}
}
</script>

<style lang="scss" scope>
	.agreement {
		background-color: #F5F5F5;
		padding-top: 1rem;
		height: 100%;
		.agreement-content {
			width: 100%;
			height: 100%;
			background-color:#fff;
			padding: 8px 20px 28px;
		}
		p {
			margin-bottom: 6px;
		}
		.agreement-title {
			color: #353535;
			font-size: 18px;
			font-weight: 700;
			line-height: 50px;
			text-align: center;
		}
		.agreement-main {
			font-size: 14px;
			line-height: 24px;
			color:#4B464D;
		}
		.agreement-subtitle {
			margin-bottom: 10px;
		}
		.weight {
			font-weight:700;
			color: #353535!important;
		}
		.text-indent-2em {
			text-indent: 2em;
		}
	}
</style>