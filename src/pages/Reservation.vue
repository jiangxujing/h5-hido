<template>
	<div class="reservation">
		<div v-show="advisorysetShow">
			<div class="font-12 color-399 title">预约信息</div>
			<div class="list-style" @click="openAdvisoryList">
				<label for="name" class="font-15 color-833">咨询项目</label>
				<input type="text" placeholder="请选择" class="advisory-list" />
				<img src="../assets/images/arrow.png" class="right-arrow" />
			</div>
			<div class="list-style">
				<label for="name" class="font-15 color-833">医师</label>
				<input type="text" placeholder="请选择" class="advisory-list" />
				<img src="../assets/images/arrow.png" class="right-arrow" />
			</div>
			<div class="list-style">
				<label for="name" class="font-15 color-833">面诊时间</label>
				<input type="text" placeholder="请选择" class="advisory-list" />
			</div>
			<div class="font-12 color-399 title">预约信息</div>
			<div class="list-style">
				<label for="name" class="font-15 color-833">姓名</label>
				<input type="text" placeholder="请选择" class="advisory-list" />
			</div>
			<div class="list-style">
				<label for="name" class="font-15 color-833">手机号</label>
				<input type="tel" placeholder="请选择" class="advisory-list" maxlength="11" />
			</div>
			<div class="list-style">
				<label for="name" class="font-15 color-833">咨询项目</label>
				<input type="text" placeholder="请选择" class="advisory-list" />
				<img src="../assets/images/arrow.png" class="right-arrow" />
			</div>
			<div class="coupon-content">
				<span class="color-B31 font-15">预付50元抵扣</span>
				<span class="DINAlternate-Bold color-B31 font-22">500元</span>
				<img src="../assets/images/radio-checked.png" class="radioChecked" />
			</div>
			<div style="text-align: center;padding-top:5rem;">
				<button class="reservation-btn opacity-style" v-if="gray">预约</button>
				<button class="reservation-btn" v-else @click="getReservation">预约</button>
			</div>
		</div>
		<div class="drop-down" v-if="advisoryShow">
			<ul>
				<li class="font-15 color-833" @click="selectadvisory">鼻综合</li>
				<li class="font-15 color-833">鼻综合</li>
				<li class="font-15 color-833">鼻综合</li>
			</ul>
		</div>
		<div class="comfirm-reservation-wrapper">
			<div class="comfirm-reservation">
				<div class="title font-17 font-weight-500">确认预约</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">我的项目：</span>
					<span class="project-right font-16 color-833">眼综合</span>
				</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">我的项目：</span>
					<span class="project-right font-16 color-833">眼综合</span>
				</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">我的项目：</span>
					<span class="project-right font-16 color-833">眼综合</span>
				</div>
				<div class="project-list">
					<span class="project-left font-14 color-399">预付金：</span>
					<span class="project-right font-16 color-833">50元</span><span class="color-B31 font-12">（实际付款抵扣500元）</span>
				</div>
				<div class="borderStyle"></div>
				<div class="comfirmBtn color-B31 font-17 font-weight-400">确认预约</div>
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
				advisoryShow: false,
				advisorysetShow: true,
				gray: true
			}
		},
		methods: {
			openAdvisoryList() {
				this.advisoryShow = true
				this.advisorysetShow = false
			},
			selectadvisory() {
				this.advisoryShow = false
				this.advisorysetShow = true
			},
			getReservation() {

			}
		},
		mounted() {

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
		}
		.advisory-list {
			border: none;
			padding-left: 5.5rem;
		}
		.right-arrow {
			width: 2.2rem;
			float: right;
			margin-top: 2.2rem;
			margin-right: 1.2rem;
		}
		.drop-down {
			background: #fff;
			ul {
				padding: 0 1.5rem;
				li {
					border-bottom: 1px solid #EAEAEA;
					height: 5rem;
					line-height: 5rem;
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
				.comfirmBtn{
					text-align: center;
					padding-top:1.4rem;
				}
			}
		}
	}
</style>