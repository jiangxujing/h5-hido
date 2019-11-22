<template>
	<div class="shippingAddress">
		<div class="title">请填写您的信息</div>
		<div>
			<van-cell-group>
				<van-field v-model="username" type="text" label="收货人姓名" placeholder="请输入用户名" clearable @input="checkEmpty" />
				<van-field v-model="phone" label="手机号" placeholder="请输入手机号" clearable type='number' maxlength='11' @input="checkEmpty" />
			</van-cell-group>
		</div>
		<div class="title">选择所在地区</div>
		<div @click="showPopup" style="background: #fff;padding:2rem 1.5rem;color:#1A2833;font-size:1.5rem;">
			<span>地区</span>
			<span style="padding-left:1.5rem" v-if="province && city && county">{{province}}/{{city}}/{{county}}</span>
			<img class="arrow" src="../assets/images/arrow.png" />
		</div>
		<div class="borderStyle" style="margin:0 1.5rem 0 1.5rem"></div>
		<van-popup v-model="show" closeable position="bottom" :style="{ height: '60%' }" class="city-info">
				<ul>
					<li class="title-address">省</li>
					<li v-for="(p,index) in provinceList" :key="index" @click="selectCountry(p)" :class="p.active?'active':''">
						{{p.provinceName}}
					</li>
				</ul>
				<ul>
					<li class="title-address">市</li>
					<li v-for="(c,index) in cityList" :key="index" @click="selectCity(c)" :class="c.active?'active':''">
						{{c.cityName}}
					</li>

				</ul>
				<ul>
					<li class="title-address">区</li>
					<li v-for="(d,index) in districtList" :key="index" @click="selectDistric(d)" :class="d.active?'active':''">
						{{d.countyName}}
					</li>
					</ul>
		</van-popup>
		<van-cell-group>
			<van-field class="big" type="text" v-model="detailAddress" placeholder="详细地址：如道路；门牌号；小区等" @input="checkEmpty" clearable/>
		</van-cell-group>
		<div class="save">
			<button class="savebtn gray" v-if="gray">保存</button>
			<button class="savebtn" v-else @click="saveAddress">保存</button>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	export default {
		name: 'shippingAddress',
		data() {
			return {
				username: '',
				phone: '',
				show: false,
				detailAddress: '',
				province: '',
				county: '',
				city: '',
				provinceList: [],
				cityList: [],
				districtList: [],
				gray: true
			}
		},
		methods: {
			saveAddress() {
				let packageCode = sessionStorage.getItem('packageCode')
				this.$router.push("/orderDetail?packageCode=" + packageCode)
			},
			checkEmpty() {
				if(this.username && this.phone && this.detailAddress && this.province && this.city && this.county) {
					this.gray = false
				} else {
					this.gray = true
				}
				sessionStorage.setItem('username', this.username)
				sessionStorage.setItem('phone', this.phone)
				sessionStorage.setItem('detailAddress', this.detailAddress)
			},
			showPopup() {
				this.show = true;
			},
			getCountryList() {
				api.post(api.getUrl('queryAdminRegion','collections'), {}).then(res => {
					this.provinceList = res.content
				}).catch(() => {
					console.log("系统异常")
				})
			},
			selectCountry(i) {
				this.city = ''
				this.district = ''
				this.provinceList.forEach((i) => {
					this.$set(i, "active", false);
				});
				this.cityList = i.cities
				this.districtList = []
				this.$set(i, "active", true);
				this.province = i.provinceName
				sessionStorage.setItem('province', this.province)
			},
			selectCity(i) {
				console.log(i)
				this.districtList = i.counties
				this.cityList.forEach((i) => {
					this.$set(i, "active", false);
				});
				this.$set(i, "active", true);
				this.city = i.cityName
				sessionStorage.setItem('city', this.city)
			},
			selectDistric(i) {
				this.districtList.forEach((i) => {
					this.$set(i, "active", false);
				});
				this.$set(i, "active", true);
				this.county = i.countyName
				sessionStorage.setItem('county', this.county)
				console.log(this.county)
				this.show = false
				console.log(this.username)
				console.log(this.phone)
				console.log(this.phone)
				console.log(this.detailAddress)
				console.log(this.province)
				console.log(this.city)
				console.log(this.county)
				if(this.username && this.phone && this.detailAddress && this.province && this.city && this.county) {
					console.log('在着吗')
					this.gray = false
				} else {
					console.log('还是在这')
					this.gray = true
				}
				let _this = this
				this.districtList.find(function(item) {
					if(item.code == _this.district) {
						_this.districtName = item.name
						console.log(_this.districtName)
					}
				});
			}
		},
		mounted() {
			this.getCountryList()
			let params = {
				interceptBack: false
			}
			api.setupWebViewJavascriptBridge((bridge) => {
				bridge.callHandler('callInit', params, (data) => {
				})
			})
		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/common.scss';
	.shippingAddress {
		width: 100%;
		height: 100%;
		background: #F8F8F8;
		.van-cell:not(:last-child)::after {
			margin-right: 1.5rem;
		}
		[class*=van-hairline]::after {
			border: none;
		}
		.title {
			color: #8A9399;
			padding: 2rem 0 1rem 1.5rem;
			font-size: 1.2rem;
		}
		.big {
			.van-cell__title,
			.van-cell__value {
				flex: 1
			}
		}
		.arrow {
			width: 1.9rem;
			float: right;
		}
		.save {
			text-align: center;
			.savebtn {
				width: 26.7rem;
				height: 4.5rem;
				background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
				border-radius: 23px;
				outline: none;
				border: none;
				color: #fff;
				font-size: 1.7rem;
				margin-top: 10rem;
			}
			.gray {
				opacity: 0.5;
			}
		}
		.city-info {
			display: flex;
			background: #fff!important;
			ul {
				flex: 1;
				text-align: center;
				line-height: 2.5rem;
				font-size: 1.5rem;
				color: #1A2833;
				.title-address{
					font-weight: bold;
					line-height:5rem;
				}
			}
		}
		.active {
			color: red
		}
	}
</style>