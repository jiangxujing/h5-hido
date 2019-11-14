<template>
	<div class="balanceWithdrawal">
		<div class="balanceWithdrawal-content">
			<div class="title">提现余额（元）</div>
			<div>
				<!--<input v-model="" style="border:none;outline: none;font-size:4.5rem;"/>-->
				<van-cell-group>
					<van-field @input="changeMoney" class="money" v-model="money" placeholder="请输入提现金额" clearable onkeyup="value=value.replace(/[^\d.]/g,'');value=value.replace(/^\./g,'');value=value.replace(/\.{2,}/g,'.');value=value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" />
				</van-cell-group>
			</div>
			<div class="borderStyle" style=" margin-left: 1.5rem;margin-top:0"></div>
			<div class="available-balance" v-if="normal">
				可用余额{{availableBalance}}元&nbsp;&nbsp;<span style="color:#A5A5A5">(最低提现100元)</span>
			</div>
			<div class="available-balance" style="color:#FF0000;" v-else>
				{{tips}}
			</div>
			<div class="available-balance" style="color:#FF0000;" v-else>

			</div>
			<div class="borderStyle" style="margin-top:0"></div>
			<div class="payment-method-list" @click="goToBank">
				<img class="weixin" src="../assets/images/bank.png" />
				<div class="bank-name-no">
					<div>{{bankname}}</div>
					<div>{{bankno}}</div>
				</div>
				<img class="gouxuan" src="../assets/images/arrow.png" />
			</div>
		</div>
		<button class="withdrawBtn buy-now buy-now-gray" v-if="grayShow">确认提现</button>
		<button class="withdrawBtn buy-now-active" v-else @click="getWithdraw">确认提现</button>
		<van-popup v-model="bankshow" closeable position="bottom" :style="{ height: '50%' }">
			<div class="banklist">
				<div class="bank" v-for="(b,index) in banklist" :key="index" @click="selectBank(b)" :class="b.active?'active':''">
					<div style="padding:1rem 1.5rem;overflow:hidden">
						<img class="bank-logo" :src="b.banklogo" />
						<div class="bank-no">
							<div style="margin-top:0.2rem">{{b.bankname}}</div>
							<div style="margin-top:0.8rem">{{b.bankno}}</div>
						</div>
						<img class="gou-xuan" src="../assets/images/gou.png" v-if="b.active" />
					</div>
				</div>
				<div class="bank" @click="addBank">
					<div style="padding:1.2rem 1.5rem 0;height:4rem;line-height:4rem;">
						<img src="../assets/images/addbank.png" class="bank-add" />
						<span style="color:#8A9399;font-size:1.4rem;margin-left:1.5rem">添加银行卡</span>
						<img src="../assets/images/arrowbank.png" class="banklarrow" />
					</div>
				</div>
			</div>
			<div>
				<button class="cancle-btn" @click="bankshow=false">取消</button>
			</div>
		</van-popup>
		<div class="sendCodeWrapper" v-if="sendCodeShow" @click="sendCodeShow=false">
			<div class="sendCode-content" @click.stop>
				<div class="title">已向159****111发送验证码</div>
				<div class="send-style">
					<input type="number" v-model="smsCode" placeholder="输入验证码"/>
					<button v-if="codeGrayShow">{{countdown}}s</button>
					<button @click="sendCode" class="active" v-else>重新发送</button>
				</div>
				<!--<span>{{countdown}}s</span>-->
				<div class="borderStyle" style="margin-top:2.3rem;"></div>
				<div style="color:#FF7B31;font-size:1.7rem;font-weight: 400;padding: 1.5rem 0;" @click="sendCodeShow=false">确定</div>
			</div>
			
		</div>
	</div>
</template>

<script>
	import _utils from '../common/utils.js'
	export default {
		name: 'balanceWithdrawal',
		data() {
			return {
				grayShow: true,
				availableBalance: '100',
				smsCode:'',
				bankname: '',
				bankno: '',
				money: '',
				bankshow: false,
				banklist: [{
					banklogo: require('../assets/images/bank.png'),
					bankname: '招商银行',
					bankno: '621811226666'
				}, {
					banklogo: require('../assets/images/bank.png'),
					bankname: '招商银行',
					bankno: '621811228888'
				}],
				active: false,
				normal: true,
				sendCodeShow: false,
				countdown:10,
				codeGrayShow:true,
				inteval:''
			}
		},
		methods: {
			sendCode(){
				this.getWithdraw()
			},
			getWithdraw() {
				this.sendCodeShow = true
				console.log(this.inteval)
				if(!this.inteval){
					this.inteval = setInterval(()=>{
					this.countdown--
					if(this.countdown<=0){
						clearInterval(this.inteval)
						this.inteval = ''
						this.countdown = 10
						this.codeGrayShow = false
					}else{
						this.codeGrayShow = true
					}
				},1000)
				}
			},
			changeMoney() {
				if((parseFloat(this.money) > parseFloat(this.availableBalance)) && parseFloat(this.money) <= 10000) {
					this.normal = false
					this.tips = '金额已超过可提现余额'
					this.grayShow = true
				} else if(parseFloat(this.money) > 10000) {
					console.log('gggggggg')
					this.normal = false
					this.tips = '单笔最高可提现10000.00元'
					this.grayShow = true
				} else {
					this.normal = true
					if(!this.bankno) {
						this.grayShow = true
					} else {
						this.grayShow = false
					}
				}
			},
			selectBank(i) {
				this.banklist.forEach((i) => {
					this.$set(i, "active", false);
				});
				this.$set(i, "active", true);
				this.bankshow = false
				this.bankname = i.bankname
				this.bankno = i.bankno
				if((parseFloat(this.money) > parseFloat(this.availableBalance)) && parseFloat(this.money) <= 10000) {
					this.grayShow = true
				} else if(parseFloat(this.money) > 10000) {
					this.grayShow = true
				} else if(this.money){
					this.grayShow = false
				}
			},
			addBank() {
				this.$router.push("/addBankCard")
			},
			goToBank() {
				this.bankshow = true
				//				if(this.bankname) {
				//					this.$router.push("/addBankCard")
				//				} else {
				//					this.bankshow = true
				//				}
			}
		},
		mounted() {

		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.van-popup {
		background-color: transparent!important;
	}
	
	[class*=van-hairline]::after {
		border: none;
	}
	
	.van-cell {
		padding: 0;
	}
	
	.balanceWithdrawal {
		.balanceWithdrawal-content {
			width: 100%;
			height: auto;
			margin-top: 1rem;
			background: #fff;
			.van-field__control {
				color: #FF7B31!important;
				font-size: 4.5rem!important;
				font-weight: bold!important;
			}
			.title {
				color: #1A2833;
				font-size: 1.4rem;
				padding: 2rem 0 1rem 1.5rem;
				font-weight: 400;
			}
			.money {
				padding-left: 1.5rem;
			}
			.available-balance {
				color: #1A2833;
				font-size: 1.4rem;
				padding: 1.2rem 0 1.2rem 1.5rem;
			}
			.payment-method-list {
				width: 100%;
				height: auto;
				margin-top: 1rem;
				background: #fff;
				padding: 1.3rem 0 1.3rem 1.5rem;
				overflow: hidden;
				.weixin {
					width: 4rem;
					float: left;
				}
				.bank-name-no {
					float: left;
					div {
						font-size: 1.4rem;
						color: #475966;
						line-height: 2rem;
						padding-left: 1.3rem;
						font-weight: 400;
					}
				}
				.gouxuan {
					width: 1.9rem;
					vertical-align: middle;
					margin-top: 0.8rem;
					float: right;
					margin-right: 1.5rem;
				}
			}
		}
		.banklist {
			width: 96%;
			height: auto;
			background: #fff;
			position: fixed;
			bottom: 9rem;
			border-radius: 14px;
			left: 50%;
			margin-left: -48%;
			.bank {
				color: #1A2833;
				font-size: 1.4rem;
				height: 6.6rem;
				border-bottom: 1px solid #EAEAEA;
				overflow: hidden;
				&:last-child {
					border: none;
				}
				.banklarrow {
					float: right;
				}
			}
			.active {
				width: 100%;
				height: 100%;
				background: #FAFAFA;
				border-radius: 14px;
			}
			.bank-logo {
				float: left;
			}
			.bank-no {
				float: left;
				padding-left: 1.5rem;
			}
			.gou-xuan {
				float: right;
				margin-top: 1rem;
			}
		}
		.cancle-btn {
			width: 96%;
			height: 5.6rem;
			background: #fff;
			border-radius: 1.4rem;
			position: fixed;
			bottom: 2.9rem;
			left: 50%;
			margin-left: -48%;
			color: #1A2833;
			font-size: 1.8rem;
		}
		.bank-add {
			width: 4rem;
		}
		.sendCodeWrapper {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .6);
			position: fixed;
			top: 0;
			left: 0;
		}
		.sendCode-content {
			text-align: center;
			width:72%;
			height: auto;
			background: #fff;
			border-radius: 1.5rem;
			position: fixed;
			left: 50%;
			margin-left: -30%;
			top: 30%;
			.title{
				font-size:1.7rem;
				line-height: 3rem;
				font-weight:500;
				color:#1A2833;
				padding:3rem 0 1.7rem 0;
			}
			.send-style{
				height:4.5rem;
				border:1px solid #EAEAEA;
				border-radius:3px;
				margin:0 1.5rem;
				padding: 1rem 0;
				input{
					border:none;
				}
				button{
					border:1px solid #FF7B31;
					width:6.8rem;
					height:2.3rem;
					border-radius:1.2rem;
					background: #fff;
					color:#FF7B31;
					font-size:1rem;
					box-sizing: border-box;
					
				}
			}
			.active{
				background: indianred;
			}
		}
	}
</style>