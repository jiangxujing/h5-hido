<template>
	<div class="reservation">
		<div v-show="advisorysetShow">
			<div class="font-12 color-399 title">预约信息</div>
			<div class="list-style" @click="openAdvisoryList('1')">
				<div class="list-content">
					<label for="name" class="font-15 color-833">咨询项目</label>
					<input type="text" placeholder="请选择" class="advisory-list" v-model="projectName" />
					<img src="../assets/images/arrow.png" class="right-arrow" />
				</div>
			</div>
			<div class="list-style" @click="openAdvisoryList(2)">
				<div class="list-content">
					<label for="name" class="font-15 color-833">医师</label>
					<input type="text" placeholder="请选择" class="advisory-list" v-model="doctor" />
					<img src="../assets/images/arrow.png" class="right-arrow" />
				</div>
			</div>
			<div class="list-style" @click="openTime">
				<div class="list-content">
					<label for="name" class="font-15 color-833">面诊时间</label>
					<input type="text" placeholder="请选择" class="advisory-list" v-model="reserveTime" />
					<img src="../assets/images/arrow.png" class="right-arrow" />
				</div>
			</div>
			<div class="font-12 color-399 title">就诊人信息</div>
			<van-cell-group :border="false">
				<van-field v-model="name" center clearable label="姓名" placeholder="请输入姓名" maxlength="20" @input="checkEmpty()" class="list-style">
				</van-field>
				<van-field v-model="phone" center :readonly=true clearable label="手机号" type="tel" placeholder="请选择" @input="checkEmpty()" maxlength="11" class="list-style">
				</van-field>
			</van-cell-group>
			<div class="coupon-content" @click="selectDeduction" v-if="couponDetailShow">
				<span class="color-B31 font-15">预付{{couponDetail.payAmount/100}}元抵扣</span>
				<span class="DINAlternate-Bold color-B31 font-22">{{couponDetail.deductionAmount/100}}元</span>
				<img src="../assets/images/radio-checked.png" class="radioChecked" v-if="checked" />
				<img src="../assets/images/radio-no.png" class="radioChecked" v-else/>
			</div>
			<div style="text-align: center;padding-top:5rem;width:100%;position:fixed;bottom:2.5rem;">
				<button class="reservation-btn opacity-style font-17" v-if="gray">预约</button>
				<button class="reservation-btn font-17" v-else @click="getReservation">预约</button>
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
			<van-popup v-model="consultationTimeShow" closeable position="bottom" :style="{ height: '60%',background:'#fff!important' }">
			<div v-show="dateShow">
				<van-datetime-picker v-model="currentDate" type="date" @confirm="confirm" @cancel="cancelTime" :min-date="minDate"/>
			</div>
			<ul v-show="timeShow">
				<li  v-for="(t,index) in time" :key="index" class="time" @click="selectTime(index,t)" :class="timeindex == index?'active-time':''">{{t}}</li>
			</ul>
		</van-popup>
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
				<div class="project-list" v-if="couponDetail">
					<span class="project-left font-14 color-399">预付金：</span>
					<span class="project-right font-16 color-833">{{couponDetail.payAmount/100}}元</span><span class="color-B31 font-12" v-if="checked">（实际付款抵扣{{couponDetail.deductionAmount/100}}元）</span>
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
				phone: sessionStorage.getItem('phone') || null,
				checked: false, //抵扣券是否选中，
				consultingList: [],
				doctorsList: [],
				projectactive: -1,
				doctoractive: -1,
				couponDetail: null,
				couponDetailShow: false,
				dateShow:true,
				timeShow:false,
				timeindex:-1,
				minDate:new Date(),
				couponDetailShow:false,
				time:['9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00']
			}
		},
		methods: {
			//选择面诊时间方法
			confirm(val) {
				//this.consultationTimeShow = false
				this.dateShow = false
				this.timeShow = true
				this.advisorysetShow = true
				console.log(val) // 打印出了时间
				this.dateTime = val ? _utils.dateFormatter(val, "yyyy-MM-dd") : ''
			},
			confirmAllTime(){
				this.reserveTime = this.dateTime +' '+this.timehour
				this.consultationTimeShow = false
			},
			cancelTime() {
				this.consultationTimeShow = false
				this.advisorysetShow = true
			},
			openAdvisoryList(params) {
				//咨询项目
				if(params == 1) {
					this.advisoryShow = true
					this.advisorysetShow = false
					this.doctorShow = false
					this.getMedicineItemsTotalList()
				} else if(params == 2) {
					if(!this.projectName) {
						Toast('咨询项目不能为空')
					} else {
						this.getDoctorsList() //医师列表
						this.doctorShow = true
						this.advisorysetShow = false
						this.advisoryShow = false
					}
				}
			},
			//面诊时间弹框展示
			openTime() {
				this.consultationTimeShow = true
				this.timeShow = false
				this.dateShow = true
			},
			checkEmpty() {
				if(this.phone && this.phone.length == 11 && this.projectName && this.doctor && this.reserveTime && this.name) {
					this.gray = false
					sessionStorage.setItem('visitName', this.name)
				} else {
					this.gray = true
				}
			},

			//是否选择抵扣券方法
			selectDeduction() {
				this.checked = !this.checked
				sessionStorage.setItem('checked', this.checked)
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
			selectTime(index,t){
				this.timehour = t
				this.reserveTime = this.dateTime +' '+this.timehour
				this.consultationTimeShow = false
				this.frontendTime = t.split('-')[0]+':00'
				let time = this.dateTime+' '+this.frontendTime
				this.appointmentDate = _utils.dateFormatter(new Date(time),"yyyy-MM-dd HH:mm")
				sessionStorage.setItem('reserveTime',this.reserveTime)//显示时间
				sessionStorage.setItem('appointmentDate',this.appointmentDate)
				if(index != this.timeindex) {
						this.timeindex = index;
					} else {
						this.timeindex = -1;
					}
				if(this.projectName && this.doctor && this.reserveTime && this.name && this.phone.length == 11) {
					this.gray = false
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
					sessionStorage.setItem('selectItem',1)
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
				const regu = /^[a-zA-Z\u4e00-\u9fa5]{2,15}$/;
				const re = new RegExp(regu);
				if(_utils.getByteLen(this.name) < 4) {
					Toast('请至少输入2位汉字')
				} else if(this.name.search(re) < 0) {
					Toast('姓名格式有误，只能输入中英文')
				} else {
					this.comfirmBox = true
				}

			},
			comfirmReservation() {
				sessionStorage.setItem('visitName', this.name)
				sessionStorage.setItem('phone', this.phone)
				let req = {}
				console.log(_utils.dateFormatter(new Date(this.appointmentDate), "yyyy-MM-dd HH:mm") )
				if(!this.checked) {
					req = {
						agentPhone: sessionStorage.getItem('agentPhone') || this.agentPhone, //推荐人手机号,
						doctorName: this.doctor || null,
						doctorNo: this.doctorNo || null,
						medicineItemNo: this.projectItemNo || null, //项目编号
						medicineItemName: this.projectName || null,
						appointmentDate: new Date(this.appointmentDate).getTime() || null,
						customerName: this.name || null,
						customerPhone: this.phone || null
					}
				} else {
					req = {
						agentPhone: sessionStorage.getItem('agentPhone') || this.agentPhone, //推荐人手机号,
						couponCode: this.couponDetail.couponNo || null, //抵扣券码
						doctorName: this.doctor || null,
						doctorNo: this.doctorNo || null,
						medicineItemNo: this.projectItemNo || null, //项目编号
						medicineItemName: this.projectName || null,
						appointmentDate: new Date(this.appointmentDate).getTime() || null,
						customerName: this.name || null,
						customerPhone: this.phone || null
					}
				}
				api.post(api.getUrl('reserveDoctor'), req).then(res => {
					if(res.code == 0) {
						sessionStorage.setItem('reservation', 1)
						if(!this.checked) {
							sessionStorage.setItem('businessNo', res.content.businessNo)
							this.$router.push("/reservationStatus")
						} else {
							this.$router.push("/PaymentMethod")
						}

					} else {
						Toast('预约失败，请重新提交')
					}

				}).catch(() => {})
			},
			getMedicineItemsTotalList() {
				api.post(api.getUrl('medicineItemsList'), {}).then(res => {
					this.consultingList = res.content
					this.consultingList.forEach((i,k) => {
						console.log(i)
						console.log(k)
						if(i.itemNo == this.projectItemNo){
							sessionStorage.setItem('projectactive',k)
							this.projectactive = k
						}
				});
				}).catch(() => {})
			},
			getMedicineItemsList() {
				let req = {
					medicineItemNo: this.itemNo || null
				}
				api.post(api.getUrl('medicineItemsList'), req).then(res => {
					if(this.itemNo && sessionStorage.getItem('selectItem')!=1) {
						this.projectItemNo = res.content[0].itemNo
						this.projectName = res.content[0].itemName
						sessionStorage.setItem('projectName', this.projectName)
						sessionStorage.setItem('projectItemNo', this.projectItemNo)
					}
					this.name = sessionStorage.getItem('visitName') || null
					this.reserveTime = this.appointmentDate = sessionStorage.getItem('reserveTime') || null
					this.appointmentDate = sessionStorage.getItem('appointmentDate') || null
					console.log(this.appointmentDate)
					this.doctor = sessionStorage.getItem('doctor') || null
					this.projectName = sessionStorage.getItem('projectName') || this.projectName
					this.projectItemNo = sessionStorage.getItem('projectItemNo') || this.projectItemNo
					this.doctorNo = sessionStorage.getItem('doctorNo') || null
					this.doctor = sessionStorage.getItem('doctor') || null
					this.checked = sessionStorage.getItem('checked') || false
					this.projectactive = sessionStorage.getItem('projectactive') || null
					this.doctoractive = sessionStorage.getItem('doctoractive') || null
					if(this.projectName && this.doctor && this.reserveTime && this.name && this.phone && this.phone.length == 11) {
						this.gray = false
					}
				}).catch(() => {})
			},
			getDoctorsList() {
				let req = {
					medicineItemNo: this.projectItemNo
				}
				api.post(api.getUrl('doctorsList'), req).then(res => {
					this.doctorsList = res.content
				}).catch(() => {})
			},
			getDueryCoupon() {
				let req = {
					agentPhone: sessionStorage.getItem('agentPhone') || this.agentPhone
				}
				api.post(api.getUrl('queryCoupon'), req, true).then(res => {
					if(res.code == '000') {
						this.couponDetail = res.content
						if(this.couponDetail.couponNo){
							console.log('ggggggg')
							this.couponDetailShow = true
						}else{
							console.log('43333')
							this.couponDetailShow = false
						}
					}
				}).catch(() => {})
			},
			isHasParentAgent() {
				api.post(api.getUrl('isHasParentAgent'), {},false).then(res => {
					if(res.code == '000') {
						this.phone = res.content.customerPhone
						this.agentPhone = res.content.agentPhone
						if(!sessionStorage.getItem('agentPhone') && this.agentPhone){
							console.log('1111111111111')
							this.getDueryCoupon()
						} else {
							this.couponDetailShow = false
						}
						this.getMedicineItemsList() //咨询项目列表
					} 
				}).catch(() => {})
			}
		},
		mounted() {
			this.itemNo = this.$route.query.itemNo
			this.isHasParentAgent()
			if(sessionStorage.getItem('agentPhone')) {
				console.log('22222222222')
				this.getDueryCoupon()
			} else {
				this.couponDetailShow = false
			}
			document.title = "预约"
		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.reservation {
		width: 100%;
		height: 100%;
		background: #F8F8F8;
		.van-cell:not(:last-child)::after {
			right: 1.5rem;
		}
		.title {
			height: 4rem;
			padding-left: 1rem;
			line-height: 4rem;
		}
		.list-style {
			height: 6rem;
			background: #fff;
			padding-top:2rem;
			padding-left: 1.5rem;
			.list-content {
				border-bottom: 1px solid #F8F8F8;
				width: 97%;
				height: 6rem;
			}
			label {
				width: 10rem;
				display: inline-block;
			}
		}
		.advisory-list {
			border: none;
			padding-left: 1rem;
			font-size: 1.5rem;
		}
		.right-arrow {
			width: 2.2rem;
			float: right;
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
					padding-left: 1.2rem;
					.project-left {}
					.project-right {
						padding-left: 0.5rem;
					}
				}
				.comfirmBtn {
					text-align: center;
					padding-top: 1.4rem;
					padding-bottom:1.5rem;
				}
			}
		}
		.time{
			font-size:16px;
			line-height:4rem;
			padding-left:5rem;
			&:first-child{
				padding-top:2rem;
			}
		}
		.active-time{
			color:#1989fa;
		}
	}
</style>