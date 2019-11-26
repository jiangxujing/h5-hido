<template>
	<div class="reservation">
		<div v-show="advisorysetShow">
			<div class="font-12 color-399 title">预约信息</div>
			<div class="list-style" @click="openAdvisoryList('1')">
				<label for="name" class="font-15 color-833">咨询项目</label>
				<input type="text" placeholder="请选择" class="advisory-list" v-model="projectName" />
				<img src="../assets/images/arrow.png" class="right-arrow" />
			</div>
			<div class="list-style" @click="openAdvisoryList(2)">
				<label for="name" class="font-15 color-833">医师</label>
				<input type="text" placeholder="请选择" class="advisory-list" v-model="doctor" />
				<img src="../assets/images/arrow.png" class="right-arrow" />
			</div>
			<div class="list-style" @click="openAdvisoryList(3)">
				<label for="name" class="font-15 color-833">面诊时间</label>
				<input type="text" placeholder="请选择" class="advisory-list" v-model="reserveTime" />
				<img src="../assets/images/arrow.png" class="right-arrow" />
			</div>
			<div class="font-12 color-399 title">预约信息</div>
			<div class="list-style">
				<label for="name" class="font-15 color-833">姓名</label>
				<input type="text" placeholder="请选择" class="advisory-list" v-model="name" @input="checkEmpty" maxlength="20" />
			</div>
			<div class="list-style">
				<label for="name" class="font-15 color-833">手机号</label>
				<input type="tel" placeholder="请选择" class="advisory-list" maxlength="11" v-model="phone" @input="checkEmpty" />
			</div>
			<div class="coupon-content" @click="selectDeduction" v-if="couponDetail">
				<span class="color-B31 font-15">预付{{couponDetail.prepaymentAmount}}元抵扣</span>
				<span class="DINAlternate-Bold color-B31 font-22">{{couponDetail.deductionAmount}}元</span>
				<img src="../assets/images/radio-checked.png" class="radioChecked" v-if="checked" />
				<img src="../assets/images/radio-no.png" class="radioChecked" v-else/>
			</div>
			<div style="text-align: center;padding-top:5rem;">
				<button class="reservation-btn opacity-style" v-if="gray">预约</button>
				<button class="reservation-btn" v-else @click="getReservation">预约</button>
			</div>
		</div>
		<div class="drop-down" v-if="advisoryShow">
			<div style="height:5rem;background: #fff;border-bottom: 1px solid #EAEAEA;" @click="closeList(1)">
				<img src="../assets/images/close.png" style="float:right;margin-right:1.5rem;width:2rem;margin-top: 1.2rem;" />
			</div>
			<ul>
				<li class="font-15 color-833" v-for="(i,index) in consultingList" :key="index" @click="selectadvisory(index,1,i,consultingList)">
					{{i.itemName}}
					<img src="../assets/images/gouxuan@2x.png" class="gouxuan" v-if="projectactive == index" />
				</li>
			</ul>
		</div>
		<div class="drop-down" v-if="doctorShow">
			<div style="height:5rem;background: #fff;border-bottom: 1px solid #EAEAEA;" @click="closeList(2)">
				<img src="../assets/images/close.png" style="float:right;margin-right:1.5rem;width:2rem;margin-top: 1.2rem;" />
			</div>
			<ul>
				<li class="font-15 color-833" v-for="(d,index) in doctorsList" :key="index" @click="selectadvisory(index,2,d,doctorsList)">
					{{d.doctorName}}
					<img src="../assets/images/gouxuan@2x.png" class="gouxuan" v-if="doctoractive == index" />
				</li>
			</ul>
		</div>
		<div class="drop-down" v-if="consultationTimeShow">
			<van-datetime-picker v-model="currentDate" type="datetime" @confirm="confirm" @change="change" />
		</div>
		<div class="comfirm-reservation-wrapper" @click="comfirmBox=false" v-show="comfirmBox">
			<div class="comfirm-reservation">
				<div class="title font-17 font-weight-500">确认预约</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">我的项目：</span>
					<span class="project-right font-16 color-833">{{projectName}}</span>
				</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">预约医师：</span>
					<span class="project-right font-16 color-833">{{doctor}}</span>
				</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">预约时间：</span>
					<span class="project-right font-16 color-833">{{reserveTime}}</span>
				</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">预付金：</span>
					<span class="project-right font-16 color-833">{{couponDetail.prepaymentAmount}}元</span><span class="color-B31 font-12">（实际付款抵扣{{couponDetail.deductionAmount}}元）</span>
				</div>
				<div class="borderStyle"></div>
				<div class="comfirmBtn color-B31 font-17 font-weight-400" @click="comfirmReservation">确认预约</div>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	import { Toast } from 'vant'
	export default {
		name: 'reservation',
		data() {
			return {
				phone: '',
				grayShow: true,
				advisoryShow: false, //咨询项目弹框
				advisorysetShow: true, //初始进来应该显示的内容
				doctorShow: false, //医师弹框
				consultationTimeShow: false, //面诊时间弹框
				gray: true,
				comfirmBox: false,
				currentDate: new Date(),
				reserveTime: '',
				projectName: '',
				doctor: '',
				name: '',
				phone: '',
				checked: false, //抵扣券是否选中，
				consultingList: [],
				doctorsList: [],
				projectactive: -1,
				doctoractive: -1,
				couponDetail: {
					"deductionAmount": "5000",
					"deductionCode": "1111111",
					"prepaymentAmount": "50"
				}
			}
		},
		methods: {
			//选择面诊时间方法
			confirm(val) {
				this.consultationTimeShow = false
				this.advisorysetShow = true
				console.log(val) // 打印出了时间
				this.reserveTime = val ? _utils.dateFormatter(val, "yyyy-MM-dd HH:mm:ss") : ''
				sessionStorage.setItem('reserveTime', this.reserveTime)
			},

			change(e) {
				console.log(e.getValues()) // 打印出了选中的时间，是个数组
			},
			openAdvisoryList(params) {
				//咨询项目
				if(params == 1) {
					this.advisoryShow = true
					this.advisorysetShow = false
					this.doctorShow = false
				} else if(params == 2) {
					if(!this.projectName) {
						Toast('咨询项目不能为空')
					} else {
						this.getDoctorsList() //医师列表
						this.doctorShow = true
						this.advisorysetShow = false
						this.advisoryShow = false
					}
				} else if(params == 3) {
					this.consultationTimeShow = true
					this.advisorysetShow = false
					this.doctorShow = false
				}
			},
			checkEmpty() {
				if(this.phone.length == 11 && this.projectName && this.doctor && this.reserveTime && this.name) {
					this.gray = false
				} else {
					this.gray = true
				}
			},

			//是否选择抵扣券方法
			selectDeduction() {
				this.checked = !this.checked
				this.isHasPrepayment = this.checked
				sessionStorage.setItem('isHasPrepayment', this.isHasPrepayment)
				if(this.projectName && this.doctor && this.reserveTime && this.name && this.phone.length == 11) {
					this.gray = false
				}
			},
			closeList(params) {
				if(params == 1) {
					this.advisoryShow = false
					this.advisorysetShow = true
				} else if(params == 2) {
					this.doctorShow = false
					this.advisorysetShow = true
				}
			},

			//选择项目列表和医师列表方法
			selectadvisory(index, params, i, list) {
				if(params == 1) {
					this.advisoryShow = false
					this.advisorysetShow = true
					this.projectName = i.itemName
					this.projectItemNo = i.itemNo
					if(index != this.projectactive) {
						this.projectactive = index;
					} else {
						this.projectName = ''
						this.projectItemNo = ''
						this.projectactive = -1;
					}
					sessionStorage.setItem('projectName', this.projectName)
					sessionStorage.setItem('projectItemNo', this.projectItemNo)
					sessionStorage.setItem('projectactive', this.projectactive)
				} else if(params == 2) {
					this.doctorShow = false
					this.advisorysetShow = true
					this.doctor = i.doctorName
					this.doctorNo = i.doctorNo
					if(index != this.doctoractive) {
						this.doctoractive = index;
					} else {
						this.doctoractive = -1;
						this.doctor = ''
						this.doctorNo = ''
					}
					sessionStorage.setItem('doctor', this.doctor)
					sessionStorage.setItem('doctorNo', this.doctorNo)
					sessionStorage.setItem('doctoractive', this.doctoractive)
				}
				if(this.projectName && this.doctor && this.reserveTime && this.name && this.phone.length == 11) {
					this.gray = false
				}
			},
			getReservation() {
				this.comfirmBox = true
			},
			comfirmReservation() {
				sessionStorage.setItem('visitName', this.name)
				const  mobileReg  =  /^(1)+\d{10}$/
				if(!mobileReg.test(this.phone)) {
					Toast('请填写正确的手机号')
				} else if(_utils.getByteLen(this.name) < 4) {
					Toast('请至少输入2位汉字')
				} else {
					sessionStorage.setItem('visitPhone', this.phone)
					let req = {}
					if(!this.isHasPrepayment) {
						req = {
							agentPhone: sessionStorage.getItem('agentPhone') || null, //推荐人手机号,
							doctorName: this.doctorName || null,
							doctorNo: this.doctorNo || null,
							isHasPrepayment: this.isHasPrepayment || false, //	是否有预付金boolean
							projectItemNo: this.projectItemNo || null, //项目编号
							projectName: this.projectName || null,
							reserveTime: this.reserveTime || null,
							visitName: this.name || null,
							visitPhone: this.phone || null
						}
					} else {
						console.log(this.couponDetail)
						req = {
							agentPhone: sessionStorage.getItem('agentPhone') || null, //推荐人手机号,
							deductionAmount: this.couponDetail.deductionAmount || null, //抵扣金
							deductionCode: this.couponDetail.deductionCode || null, //抵扣券码
							doctorName: this.doctorName || null,
							doctorNo: this.doctorNo || null,
							isHasPrepayment: this.isHasPrepayment || false, //	是否有预付金boolean
							prepaymentAmount: this.couponDetail.prepaymentAmount || null, //预付金
							projectItemNo: this.projectItemNo || null, //项目编号
							projectName: this.projectName || null,
							reserveTime: this.reserveTime || null,
							visitName: this.name || null,
							visitPhone: this.phone || null
						}
					}
					api.post(api.getUrl('reserveDoctor'), req).then(res => {
						if(res.code == 0) {
							if(!this.isHasPrepayment) {
								this.$router.push("/reservationStatus")
							} else {
								this.$router.push("/PaymentMethod")
							}

						} else {
							Toast('预约失败，请重新提交')
						}

					}).catch(() => {
						if(!this.isHasPrepayment) {
							this.$router.push("/reservationStatus")
						} else {
							this.$router.push("/paymentList")
						}
					})
				}
			},
			getMedicineItemsList() {
				api.post(api.getUrl('medicineItemsList'), {}).then(res => {
					this.consultingList = res.content
				}).catch(() => {})
			},
			getDoctorsList() {
				let req = {
					projectItemNo: this.projectItemNo
				}
				api.post(api.getUrl('doctorsList'), req).then(res => {
					this.doctorsList = res.content
				}).catch(() => {})
			},
			getDueryCoupon() {
				let req = {
					agentPhone: sessionStorage.getItem('agentPhone')
				}
				api.post(api.getUrl('queryCoupon'), req).then(res => {
					this.couponDetail = res.content
				}).catch(() => {})
			},
		},
		mounted() {
			this.getMedicineItemsList() //咨询项目列表
			if(sessionStorage.getItem('agentPhone')) {
				this.getDueryCoupon()
			}
			this.phone = sessionStorage.getItem('visitPhone') || null
			this.name = sessionStorage.getItem('visitName') || null
			this.reserveTime = sessionStorage.getItem('reserveTime') || null
			this.doctor = sessionStorage.getItem('doctor') || null
			this.projectName = sessionStorage.getItem('projectName') || null
			this.projectItemNo = sessionStorage.getItem('projectItemNo') || null
			this.doctorNo = sessionStorage.getItem('doctorNo') || null
			this.doctor = sessionStorage.getItem('doctor') || null
			this.checked = sessionStorage.getItem('isHasPrepayment') || false
			this.projectactive = sessionStorage.getItem('projectactive') || null
			this.doctoractive = sessionStorage.getItem('doctoractive') || null
			if(this.projectName && this.doctor && this.reserveTime && this.name && this.phone.length == 11) {
				this.gray = false
			}
		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.reservation {
		width: 100%;
		height: 100%;
		background: #F8F8F8;
		.title {
			height: 4rem;
			padding-left: 1rem;
			line-height: 4rem;
		}
		.list-style {
			height: 6rem;
			background: #fff;
			line-height: 7rem;
			padding-left: 1.5rem;
			label {
				width: 10rem;
				display: inline-block;
			}
		}
		.advisory-list {
			border: none;
			padding-left: 1rem;
		}
		.right-arrow {
			width: 2.2rem;
			float: right;
			margin-top: 2.2rem;
			margin-right: 1.2rem;
		}
		.drop-down {
			background: #fff;
			margin-top: 1rem;
			ul {
				padding: 0 1.5rem;
				li {
					border-bottom: 1px solid #EAEAEA;
					height: 5rem;
					line-height: 5rem;
					.gouxuan {
						width: 2.2rem;
						float: right;
						margin-right: 1.5rem;
						margin-top: 1.3rem;
					}
				}
			}
		}
		.coupon-content {
			height: 6rem;
			background: #FFF5EF;
			line-height: 6rem;
			padding-left: 1.5rem;
			margin-top: 1rem;
			.radioChecked {
				width: 1.5rem;
				float: right;
				margin-top: 2.3rem;
				margin-right: 1.5rem;
			}
		}
		.reservation-btn {
			width: 71%;
			height: 4.5rem;
			background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
			border-radius: 2.3rem;
			color: #fff;
		}
		.comfirm-reservation-wrapper {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .6);
			position: fixed;
			top: 0;
			left: 0;
			.comfirm-reservation {
				width: 72%;
				height: 25rem;
				background: #fff;
				border-radius: 1.4rem;
				margin: 22rem auto 0;
				.title {
					color: #4B464D;
					font-weight: 500;
					text-align: center;
				}
				.project-list {
					line-height: 3rem;
					padding-left: 1.8rem;
					.project-left {}
					.project-right {
						padding-left: 0.5rem;
					}
				}
				.comfirmBtn {
					text-align: center;
					padding-top: 1.4rem;
				}
			}
		}
	}
</style>