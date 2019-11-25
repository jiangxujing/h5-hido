<template>
	<div class="referrerPhone">
		<div class="title">
			请输入推荐人手机号
		</div>
		<van-cell-group>
		  <van-field v-model="value" placeholder="请输入用户名" />
		</van-cell-group>
	</div>
</template>


<script>
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	export default {
		name: '',
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
</style>