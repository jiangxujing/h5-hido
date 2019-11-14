<template>
	<div class="agreement register-protocol">
        <h5 class="agreement-title">倍芙科技用户服务协议</h5>
		<div>
			
		</div>
	</div>
</template>

<script>
import api from '../common/api.js'
export default {
	name: 'register-protocol',
	data() {
		return {

		}
	},
	mounted() {
		document.title = '注册协议'
		api.setupWebViewJavascriptBridge(bridge => {
			let params = {
				title: '注册协议'
			}
			bridge.callHandler('callTitleUpdate', params, () => {})
		})
	},
	methods: {
		
	}
}
</script>

<style lang="scss">
    .register-protocol {
		
	}
</style>