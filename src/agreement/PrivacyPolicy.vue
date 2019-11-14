<template>
	<div class="agreement privacy-policy">
        <h5 class="agreement-title">倍芙科技隐私权政策</h5>
		<div>
			
		</div>
	</div>
</template>

<script>
import api from '../common/api.js'
export default {
	name: 'privacy-policy',
	data() {
		return {

		}
	},
	mounted() {
		document.title = '隐私政策'
		api.setupWebViewJavascriptBridge(bridge => {
			let params = {
				title: '隐私政策'
			}
			bridge.callHandler('callTitleUpdate', params, () => {})
		})
	},
	methods: {
		
	}
}
</script>

<style lang="scss">
    .privacy-policy {
		
	}
</style>