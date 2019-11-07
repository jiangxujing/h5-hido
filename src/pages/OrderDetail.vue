<template>
	<div class="orderDetail">
		<div v-if="orderDetailShow">
			<div class="receipt-address">
				<div style="padding:1.5rem" v-if="hasNoAdress" @click="setAddress">
					<img class="add" src="../assets/images/add.png" />
					<span>收货信息</span>
					<img class="arrow" src="../assets/images/arrow.png" />
				</div>
				<div style="padding:1.5rem" v-else>
					<div>
						<span>{{username}}{{phone}}</span>
						<img class="arrow" src="../assets/images/arrow.png" />
					</div>
					<div class="adress adress1">
						{{province}}/{{city}}/{{county}}
					</div>
					<div class="adress adress2">
						{{detailAddress}}
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
				<!--<input type="text" placeholder="请输入推荐人手机号" />-->
				<van-cell-group>
					<van-field v-model="recommendPhone" label="推荐人手机号" placeholder="请输入推荐人手机号" clearable type='number' maxlength='11' @input="checkTel"/>
				</van-cell-group>
			</div>
			<div class="submitTxt">
				<div style="padding:2.2rem 1.5rem;">
					<span style="color:#1A2833;font-size:1.6rem;">订单金额：</span>
					<span style="color:#FF7B31;font-size:1.8rem;">￥399</span>
					<button class="submit-gray" v-if="gray">提交</button>
					<button class="submit-active" v-else @click="submitOrder">提交</button>
				</div>
			</div>
		</div>
		<div v-else class="order-status">
			<img src="../assets/images/order-success.png" />
			<div class="sucess-txt" style="padding-top:3rem;">您的订单已提交成功</div>
			<div class="sucess-txt" style="padding-top:1.1rem;">会为您尽快安排发货</div>
			<div style="#8A9399;font-size:1.4rem;padding-top:2rem;">{{second}}s后自动跳转回购买界面</div>
		</div>
		<div class="orderWrapper" v-if="dropOutShow">
			<div class="order-content">
				<div class="title">提示</div>
				<div style="color:#353535;font-size:1.5rem;">是否确认取消订单</div>
				<div class="borderStyle"></div>
				<button class="canle" @click="dropOutShow=false">取消</button>
				<button class="confirm" @click="goBack">确认</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'orderDetail',
		data() {
			return {
				hasNoAdress: true,
				orderDetailShow: true,
				recommendPhone: '',
				province:'',
				city:'',
				county:'',
				username: '',
				phone: '',
				detailAddress: '',
				gray:true,
				second:3,
				dropOutShow:false
			}
		},
		methods: {
			setAddress(){
				this.$router.push("/shippingAddress")
			},
			checkTel(){
				if(this.username && this.phone && this.province && this.city && this.county  && this.detailAddress && this.recommendPhone){
					this.gray = false
				}
			},
			submitOrder(){
				this.$router.push("/paymentMethod")
//				this.orderDetailShow = false
//				let interval = setInterval(()=>{
//					this.second--
//					if(this.second <=0){
//						clearInterval(interval)
//					}
//				},1000)
//				setTimeout(() => {
//				this.$router.push("/productDetail")
//			}, 3000)
		},
		goBack(){
			this.$router.push("/productDetail")
		}
		},
		mounted() {
			this.province = sessionStorage.getItem('province')
			this.county = sessionStorage.getItem('county')
			this.city = sessionStorage.getItem('city')
			this.username = sessionStorage.getItem('username')
			this.phone = sessionStorage.getItem('phone')
			this.detailAddress = sessionStorage.getItem('detailAddress')
			if(this.province && this.city && this.county && this.username && this.phone && this.detailAddress) {
				this.hasNoAdress = false
			}
				let _this = this		
            pushHistory();  
            window.addEventListener("popstate", function(e) {  
                //此处已经捕获返回事件，可以写自己的跳转代码  
                _this.dropOutShow = true  
            }, false);  
            function pushHistory() {  
                var state = {  
                    title : "title",  
                    url : "#"  
                };  
                window.history.pushState(state, "title", "#");  
            }  

		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.orderDetail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		.orderWrapper{
			width:100%;
			height:100%;
			background:rgba(0,0,0,0.6);
			position:fixed;
			left:0;
			top:0;
			.order-content{
				width:72%;
				margin:50% auto 0;
				height:auto;
				background: #fff;
				border-radius:1.4rem;
				text-align:center;
				.title{
					color:#4B464D;
					padding:2rem 0;
					font-weight:500;
					font-size:1.7rem;
				}
				.borderStyle{
					width:100%d;
					height:1px;
					background: #E0E0E0;
					margin-top:2rem;
				}
				button{
					border:none;
					background: none;
					font-size:1.6rem;
					width:100%;
					height:4.5rem;
					line-height:4.5rem;
					font-weight:400;
				}
				.canle{
					width:49%;
					border-right:1px solid #E0E0E0;
				}
				.confirm{
					width:49%;
					color:#FF7B31;
				}
			}
		}
		.receipt-address {
			width: 100%;
			height: auto;
			background: #fff;
			margin-top: 1rem;
			.adress {
				color: #8A9399;
				font-size: 1.4rem;
			}
			.adress1 {
				padding-top: 1.2rem;
			}
			.adress2 {
				padding-top: 0.8rem;
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
			margin-top: 1rem;
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
				background: linear-gradient(132deg, #FFAF82 0%, #FF7B31 100%);
				width: 8.2rem;
				height: 3rem;
				float: right;
			}
			.submit-gray {
				opacity: 0.5;
			}
			.submit-active {}
		}
		.order-status {
			width: 100%;
			height: 100%;
			background: #fff;
			text-align: center;
			img {
				width: 6.6rem;
				padding-top: 9.5rem;
			}
			.sucess-txt {
				font-size: 1.8rem;
				font-weight: 600;
				color: rgba(26, 40, 51, 1);
				line-height: 18px;
			}
		}
	}
</style>