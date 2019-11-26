<template>
	<div class="referrer">
		<div>
			<div class="title font-28 color-833 DINAlternate-Bold font-weight-500">
				请输入推荐人手机号
			</div>
			<div class="border-style" :class="{borderactive:phone}">
				<van-field @input="changeTel" v-model="phone" type="tel" maxLength='13' placeholder="请输入推荐人手机号" clearable/>
			</div>
		</div>
		<div class="btn">
			<button class="next font-18 gray" v-if="grayShow">下一步</button>
			<button class="next font-18" v-else @click="getNext">下一步</button>
			<div class="jump-over font-16 color-966 font-weight-400" @click="jumpNext">跳过</div>
		</div>
	</div>
</template>
<script>
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	import { Toast } from 'vant'
	export default {
		name: '',
		data() {
			return {
				phone: '',
				grayShow: true
			}
		},
		methods: {
			getNext() {
				const  mobileReg  =  /^(1)+\d{10}$/
				if(!mobileReg.test(this.phone)) {
					Toast('请填写正确的手机号')
					return false
				} else {
					sessionStorage.setItem('agentPhone', this.phone)
					this.$router.push("/reservation")
				}
			},
			formatMobile(obj1) {               
				var value = parseInt(obj1);               
				value = value.replace(/\s*/g, "");               
				var result = [];               
				for(var i = 0; i < value.length; i++)                {                 
					if(i == 3 || i == 7)                  {                   
						result.push(" " + value.charAt(i));                 
					}                 
					else                  {                   
						result.push(value.charAt(i));                 
					}               
				}               
				obj1.value = result.join("");             
			},
			changeTel() {
				var value = this.phone; 
				console.log(value)              
				value = value.replace(/\s*/g, "");               
				var result = [];               
				for(var i = 0; i < value.length; i++)                {                 
					if(i == 3 || i == 7)                  {                   
						result.push(" " + value.charAt(i));                 
					}                 
					else                  {                   
						result.push(value.charAt(i));                 
					}               
				}               
				this.phone = result.join("");
				console.log(this.phone.length)
				if(this.phone.length == 13) {
					this.grayShow = false
				} else {
					this.grayShow = true
				}

			},
			jumpNext() {
				this.$router.push("/reservation")
			}
		},
		mounted() {

		},
	}
</script>
<style lang="scss">
	@import '../assets/scss/common.scss';
	.referrer {
		width: 100%;
		height: 100%;
		background: #fff;
		.van-cell {
			padding: 6rem 1.5rem 1.3rem;
		}
		.title {
			padding-top: 5rem;
			padding-left: 2.5rem;
		}
		.btn {
			text-align: center;
			button {
				width: 86%;
				height: 4.5rem;
				background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
				border-radius: 2.5rem;
				color: #fff;
				font-weight: 400;
			}
			.gray {
				opacity: 0.5;
			}
			.next {
				margin-top: 6rem;
			}
			.jump-over {
				font-size: 1.6rem;
				margin-top: 2.6rem;
			}
		}
		.border-style {
			border-bottom: 1px solid #EAEAEA;
			margin: 0 2.5rem;
		}
		.borderactive {
			border-bottom: 2px solid #FF7B31;
		}
		.van-cell {
			padding-left: 0;
		}
	}
</style>