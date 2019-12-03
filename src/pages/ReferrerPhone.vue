<template>
	<div class="referrer">
		<div>
			<div class="title font-28 color-833 DINAlternate-Bold font-weight-500">
				请输入推荐人手机号
			</div>
			<div class="border-style" :class="{borderactive:agentPhone}">
				<van-field  @input="changeTel" v-model="agentPhone" type="tel" maxLength='11' placeholder="请输入推荐人手机号" clearable/>
			</div>
		</div>
		<div class="btn">
			<button class="next font-18 gray" v-if="grayShow">下一步</button>
			<button class="next font-18" v-else @click="getNext">下一步</button>
			<div class="jump-over font-16 color-966 font-weight-400" @click="jumpNext">跳过</div>
		</div>
		<div class="orderWrapper" v-if="invalidShow">
			<div class="order-content">
				<div class="title">提示</div>
				<div style="color:#353535;font-size:1.5rem;">该手机号不是代理哦~</div>
				<div class="borderStyle"></div>
				<button class="canle" @click="invalidShow=false">取消</button>
				<button class="confirm" @click="jumpNext">继续</button>
			</div>
		</div>
	</div>
</template>
<script>
	import api from '../common/api.js'
	import { Toast } from 'vant'
	export default {
		name: '',
		data() {
			return {
				agentPhone: '',
				grayShow: true,
				invalidShow: false
			}
		},
		methods: {
			getNext() {
				const  mobileReg  =  /^(1)+\d{10}$/
				let agentPhone =  this.agentPhone.replace(/\s+/g, "")
				console.log(agentPhone)
				if(!mobileReg.test(agentPhone)) {
					Toast('请填写正确的手机号')
					return false
				} else {
					if(this.customerPhone == agentPhone){
						Toast('推荐人手机号不能与登陆手机号为同一个')
					}else{
						//sessionStorage.setItem('agentPhone', agentPhone)
						this.getDueryCoupon()
					}
				
				}
			},
//			blurFun(){
//				var value = this.agentPhone; 
//				value = value.replace(/\s*/g, "");               
//				var result = [];               
//				for(var i = 0; i < value.length; i++) {                 
//					if(i == 3 || i == 7)                  {                   
//						result.push(" " + value.charAt(i));                 
//					}                 
//					else                  {                   
//						result.push(value.charAt(i));                 
//					}               
//				}               
//				this.agentPhone = result.join("");
//				console.log(this.agentPhone.length)
//				if(this.agentPhone.length == 13) {
//					this.grayShow = false
//				} else {
//					this.grayShow = true
//				}
//			},
			changeTel() {
				if(this.agentPhone.length == 11) {
					this.grayShow = false
				} else {
					this.grayShow = true
				}
			},
			getDueryCoupon() {
				let req = {
					agentPhone: this.agentPhone
				}
				api.post(api.getUrl('queryCoupon'), req, true).then(res => {
					sessionStorage.removeItem('checked')
					if(res.code == '000') {
						console.log('ggggg')
						if(this.$route.query.itemNo){
							this.$router.push("/reservation?itemNo="+this.$route.query.itemNo)
						}else{
							this.$router.push("/reservation")
						}
					} else {
						console.log('hhhhhh')
						this.invalidShow = true
					}
				}).catch(() => {})
			},
			jumpNext() {
				if(this.$route.query.itemNo){
					this.$router.push("/reservation?itemNo="+this.$route.query.itemNo)
				}else{
					this.$router.push("/reservation")
				}
			},
			isHasParentAgent() {
				api.post(api.getUrl('isHasParentAgent'), {}, true).then(res => {
					if(res.code == '000') {
						this.customerPhone = res.content.customerPhone
					}
				}).catch(() => {})
			}
		},
		mounted() {
			document.title = "输入推荐人手机号"
			//this.agentPhone = sessionStorage.getItem('agentPhone') || null
//			if(this.agentPhone) {
//				this.changeTel()
//			}
			if(navigator.userAgent.toLowerCase().indexOf('hido')  !=  -1) {
				api.setNative('callInit', {
					interceptBack: false
				})
				setTimeout(() => {
					this.isHasParentAgent()
				}, 600)
			}
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
		.orderWrapper {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.6);
			position: fixed;
			left: 0;
			top: 0;
			.order-content {
				width: 72%;
				margin: 50% auto 0;
				height: auto;
				background: #fff;
				border-radius: 1.4rem;
				text-align: center;
				.title {
					color: #4B464D;
					padding: 2rem 0;
					font-weight: 500;
					font-size: 1.7rem;
				}
				.borderStyle {
					width: 100%d;
					height: 1px;
					background: #E0E0E0;
					margin-top: 2rem;
				}
				button {
					border: none;
					background: none;
					font-size: 1.6rem;
					width: 100%;
					height: 4.5rem;
					line-height: 4.5rem;
					font-weight: 400;
				}
				.canle {
					width: 49%;
					border-right: 1px solid #E0E0E0;
				}
				.confirm {
					width: 49%;
					color: #FF7B31;
				}
			}
		}
	}
</style>