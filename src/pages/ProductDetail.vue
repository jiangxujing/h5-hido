<template>
	<div class="product-detail" v-if="packageDetail">
		<div class="content1">
			<div class="content1-header" v-if="packageDetail" style="min-height:20rem">
				<img class="detail-img" :src="packageDetail.headPicture" />
				<div class="tips">
					<div class="header-tips">
						<img src="../assets/images/gou.png" />
						<span>随时退</span>
					</div>
					<div class="header-tips tips-guoqi">
						<img src="../assets/images/gou.png" />
						<span>过期退</span>
					</div>
					<div class="buy-count">{{packageDetail.initSalesCount}}人购买</div>
				</div>
			</div>
		</div>
		<div class="content1 content2" style="margin-top:0.8rem" v-if="packageDetail">
			<h2>礼包说明</h2>
			<div class="content2-detail">
				<h3>{{packageDetail.name}}</h3>
				<div class="package" v-for="(g,index) in packageDetail.giftPackageDetailList" :key="index">
					<div class="package-l">
						<img src="../assets/images/double.png" />
						<span style="padding-left:3px;">{{g.goodsDesc}}</span>
					</div>
					<div class="package-r">
						<span>{{g.goodsCount}}{{g.goodsUnit}}</span>
						<span style="color:#8A9399;">|</span>
						<span>￥{{g.goodsPrice/100}}</span>
					</div>
				</div>
				<div class="borderStyle"></div>
				<div class="merber-package-price">
					<div class="package-price-left">会员礼包价</div>
					<div class="package-price-right">
						<span style="text-decoration:line-through;">原价￥<span>{{$utils.formatMoney(packageDetail.originalPrice,1)}}</span></span>
						<span style="color:#FF7B31;font-size:1.4rem;font-weight:600;">￥{{$utils.formatMoney(packageDetail.salesPrice,1)}}</span>
					</div>
				</div>
			</div>
			<div class="advantage">
				<img :src="giftpackagedescription" />
			</div>
		</div>
		<div class="content1 content2 content3" v-if="rulepic && rulepic.length>0">
			<h2>产品使用规则</h2>
			<div class="advantage" v-for="(i,index) in rulepic" :key="index">
				<img :src="i" />
			</div>
		</div>
		<div class="content1 content2 content3 content4">
			<h2>其他礼包</h2>
			<div class="other-packages" v-for="(i,index) in giftPackageDTOList" style="margin-top:1rem" :key="index" :class="{ 'other-packages-last': index==giftPackageDTOList.length-1 }">
				<div style="overflow:hidden;position: relative;" v-if="homepageUrl.type==1 || inweixin" @click="goToDetail(i.packageCode)">
					<div style="height: 5.2rem;display: flex;">
						<img class="libao" :src="i.listPicture" />
						<div class="package-price">
							<div class="package-price-num">
								￥<span class="DINAlternate-Bold" style="font-size:3rem;font-weight: bold;margin-right: .4rem;">{{i.salesPrice%100==0?$utils.formatMoney(i.salesPrice):$utils.formatMoney(i.salesPrice,1)}}</span>会员礼包
							</div>
							<div style="color:#8A9399;font-size:1.2rem;line-height: 1.7rem;">{{'原价￥' + $utils.formatMoney(i.originalPrice,1)}}</div>
						</div>
						<div class="buynumber">{{i.initSalesCount}}人购买</div>
					</div>
					<div class="description" v-for="(d, dd) in i.giftPackageDetailList" :key="dd">{{d.goodsName}}x{{d.goodsCount}}</div>
					<div class="share">
						<button>立即购买</button>
					</div>
				</div>
				<div v-else style="overflow:hidden;position: relative;" @click="goToDetail(i.packageCode)">
					<div style="height: 5.2rem;display: flex;">
						<img class="libao" :src="i.listPicture" />
						<div class="package-price">
							<div class="package-price-num">
								￥<span class="DINAlternate-Bold" style="font-size:3rem;font-weight: bold;margin-right: .4rem;">{{$utils.formatMoney(i.salesPrice,1)}}</span>会员礼包
							</div>
							<div style="color:#8A9399;font-size:1.2rem;line-height: 1.7rem;">{{'原价￥' +$utils.formatMoney(i.originalPrice,1)}}</div>
						</div>
						<div class="buynumber">{{i.initSalesCount}}人购买</div>
					</div>
					<div class="description" v-for="(d, dd) in i.giftPackageDetailList" :key="dd">{{d.goodsName}}x{{d.goodsCount}}</div>
					<div class="share" @click.stop @click="getShare(i)">
						<button>立即分享</button>
					</div>
				</div>
			</div>
			<div class="fixBtn" v-if="inweixin">
				<div class="buy inweixin-style" @click="getBuy" v-if="packageDetail && homepageUrl.type==1">￥{{$utils.formatMoney(packageDetail.salesPrice,1)}}成为代理</div>
				<div class="buy inweixin-style" @click="getBuy" v-else>立即购买</div>
			</div>
			<div class="fixBtn" v-else>
				<div class="buy" @click="getBuy" v-if="packageDetail && homepageUrl.type==1">￥{{$utils.formatMoney(packageDetail.salesPrice,1)}}成为代理</div>
				<div class="buy" @click="getBuy" v-else>立即购买</div>
				<img src="../assets/images/share.png" class="share-now" @click="getShare(packageDetail)" />
			</div>
		</div>
		<div class="shareWraper" v-show='shareWrapperShow' @click='shareWrapperShow=false'>
			<div class="share-content">
				<div class="title"><span style="font-size:2rem">-</span>&nbsp;分享至&nbsp;<span style="font-size:2rem">-</span></div>
				<div class="weixin-friend">
					<div class="weixin" @click="shareWeixin">
						<img src="../assets/images/wechat.png" />
						<div>微信</div>
					</div>
					<div class="friend" @click="shareFriend">
						<img src="../assets/images/friend.png" />
						<div>朋友圈</div>
					</div>
				</div>
			</div>
			<button class="cancleBtn" @click="cancleBtn">取消</button>
		</div>
	</div>
</template>

<script>
	import api from '../common/api.js'
	import _utils from '../common/utils.js'
	export default {
		name: 'productDetail',
		data() {
			return {
				hasNoAdress: false,
				shareWrapperShow: false,
				orginPrice: _utils.formatMoney(39999999.11, 2),
				proxyShow: true,
				packageDetail: {},
				giftPackageDTOList: [],
				homepageUrl: '',
				detailsPicture: [],
				inweixin: false,
				giftpackagedescription:'',
				rulepic:[],
			}
		},
		methods: {
			goToDetail(p) {
				console.log(p)
				this.$router.push("/productDetail?packageCode=" + p+'&uid='+this.uid)
				//window.location.reload(true)
				this.$router.go(0)
			},
			cancleBtn() {
				this.shareWrapperShow = false
			},
			getShare(i) {
				this.shareContent = i
				this.shareWrapperShow = true
			},
			shareWeixin() {
				api.setupWebViewJavascriptBridge((bridge) => {
					let params = {
						"sharePlatform": "WechatSession",
						"shareParams": {
							"shareUrl": location.href,
							"title": this.shareContent.shareTitle,
							"shareContent": this.shareContent.shareDesc,
							"sharePic": this.shareContent.sharePicture
						}
					}
					bridge.callHandler('callShareOnly', params, (data) => {
						console.log(data)
					})
				})
			},
			shareFriend() {
				api.setupWebViewJavascriptBridge((bridge) => {
					let params = {
						"sharePlatform": "WechatTimeline",
						"shareParams": {
							"shareUrl": location.href,
							"title": this.shareContent.shareTitle,
							"shareContent": this.shareContent.shareDesc,
							"sharePic": this.shareContent.sharePicture
						}
					}
					bridge.callHandler('callShareOnly', params, (data) => {
						console.log(data)
					})
				})
			},
			urlParse(queryStr) {
				let arr = queryStr.slice(1).split('&');
				let map = {};
				arr.forEach(item => {
					let param = item.split('=');
					map[param[0]] = param[1];
				});
				return map;
			},

			getBuy(i) {
				if(navigator.userAgent.toLowerCase().indexOf('hido')  !=  -1) {
					api.callHandler('callInit', {
						interceptBack: false
					})
					setTimeout(() => {
						if(!_utils.getCookie('accessToken')) {
							api.callHandler('callLogin', {})
						} else {
							if(i.packageCode) {
								this.$router.push("/orderDetail?packageCode=" + i.packageCode + '&uid=' + this.uid)
							} else {
								this.$router.push("/orderDetail?packageCode=" + this.$route.query.packageCode + '&uid=' + this.uid)
							}
						}

					}, 600)
				} else {
					if(!_utils.getCookie('accessToken')) {
						this.$router.push("/login")
					} else {
						if(i.packageCode) {
							this.$router.push("/orderDetail?packageCode=" + i.packageCode + '&uid=' + this.uid)
						} else {
							this.$router.push("/orderDetail?packageCode=" + this.$route.query.packageCode + '&uid=' + this.uid)
						}
					}
				}
			},
			getWechat() {
				let packageDetail = this.packageDetail
				let originUrl = (location.href.split('#/')[0]).split('?')[0] + '#/' + location.href.split('#/')[1]
				let url = originUrl.replace("#", "&");
				let linkUrl = url.split('#')[0]
				url = linkUrl.replace("&", "#")
				console.log(url)
				let reqUrl = {
					url: encodeURIComponent(url)
				}
				api.get(api.getUrl('share'), reqUrl).then(res => {
					if(res.code == '000') {
						var timestamp = res.content.timestamp;
						var nonceStr = res.content.nonceStr;
						var signature = res.content.signature;
						var appId = res.content.appid
						console.log(res)
						wx.config({
							debug: false, // 开fff启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: appId,
							timestamp: timestamp, // 必填，生成签名的时间戳
							nonceStr: nonceStr, // 必填，生成签名的随机串
							signature: signature, // 必填，签名，见附录1
							jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						api.getWechat(this.packageDetail.shareTitle, this.packageDetail.shareDesc, url, this.packageDetail.sharePicture)
					}
				})
			},
			getPackageDetail(code) {
				let req = {
					packageCode: code
				}
				api.post(api.getUrl('queryPackage', 'collections'), req).then(res => {
					if(res.code == 0) {
						console.log('jinl ')
						this.packageDetail = res.content.giftPackageDTODetails
						this.giftPackageDTOList = res.content.giftPackageDTOList
						console.log('hhhhhhhhhhhhhhhhh')
						if(this.device.version.MicroMessenger) {
							this.getWechat()
						}
						if(res.content.giftPackageDTODetails.detailsPicture) {
							this.detailsPicture = res.content.giftPackageDTODetails.detailsPicture.split(',')
							this.giftpackagedescription = this.detailsPicture[0]
							for(var i=1;i<this.detailsPicture.length;i++){
								console.log(this.rulepic)
								this.rulepic.push(this.detailsPicture[i])
							}
							
						}
						this.homepageUrl = res.content.homepageUrl
						if(!!res.content.homepageUrl) {
							let type = res.content.homepageUrl.type
							sessionStorage.setItem('type', type)
						}
					}
				}).catch((e) => {})
			}
		},
		watch: {
        	'$route' (to, from) { // 监听路由是否变化
				if (to.query.packageCode !== from.query.packageCode) {
					this.getPackageDetail(this.$route.query.packageCode)
				}
			}
		},
		mounted() {
			document.title = "礼包详情"
			let ua = navigator.userAgent;
			this.ios = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			this.android = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
			let code = this.$route.query.packageCode
			this.uid = this.$route.query.uid
			sessionStorage.setItem('packageCode',this.$route.query.packageCode)
			sessionStorage.setItem('uid',this.$route.query.uid)
			this.device = {
				version: function() {
					return {
						MicroMessenger: /micromessenger/i.test(ua),
					}
				}()
			};
			if(navigator.userAgent.toLowerCase().indexOf('hido')  !=  -1) {
				api.callHandler('callInit', {
					interceptBack: false
				})
				setTimeout(() => {
					this.getPackageDetail(code)
				}, 600)
			} else {
				this.getPackageDetail(code)
			}
			let url = location.href
			if(this.device.version.MicroMessenger) {
				this.inweixin = true
				let URL = decodeURIComponent(url)
				this.uid = this.$route.query.uid
				sessionStorage.setItem('uid', this.$route.query.uid)
			} else {
				this.uid = this.$route.query.uid
				sessionStorage.setItem('uid', this.$route.query.uid)
			}
			let params = {
				interceptBack: true
			}
			api.setupWebViewJavascriptBridge((bridge) => {
				bridge.callHandler('callInit', params, (data) => {
					api.setupWebViewJavascriptBridge((bridge) => {
						bridge.registerHandler('invokeBackPress', (data) => {
							api.setupWebViewJavascriptBridge((bridge) => {
								bridge.callHandler('callFinish', {}, (data) => {})
							})
						})
					})
				})
			})
			api.setupWebViewJavascriptBridge((bridge) => {
				bridge.registerHandler('invokeBackPress', (data) => {
					api.setupWebViewJavascriptBridge((bridge) => {
						bridge.callHandler('callFinish', {}, (data) => {})
					})
				})
			})
		},
	}
</script>

<style lang="scss">
	.product-detail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		-webkit-overflow-scroll:touch;
		.content1 {
			width: 100%;
			height: auto;
			background: #fff;
			.content1-header {
				width: 92%;
				margin: 0 auto;
				.detail-img {
					width: 100%;
					margin-top: 2.1rem;
				}
				.tips {
					color: #8A9399;
					margin-top: 1.4rem;
					overflow: hidden;
					padding-bottom: 1.8rem;
					font-size: 1.2rem;
					.header-tips {
						float: left;
						img {
							vertical-align: middle;
							margin-top: -3px;
							width: 1.2rem;
						}
					}
					.tips-guoqi {
						margin-left: 1.5rem;
					}
					.buy-count {
						float: right;
					}
				}
			}
		}
		@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
			.content2{
					padding-bottom: 4rem!important;
				}
			}
		.content2 {
			padding-bottom: 1.8rem;
			h2 {
				padding-top: 2.8rem;
				padding-left: 1.5rem;
				padding-bottom: 1.4rem;
				color: #1A2833;
				font-size: 1.8rem;
			}
			.content2-detail {
				width: 92%;
				margin: 0 auto;
				height: auto;
				background: #FAFAFA;
				overflow: hidden;
				padding-bottom: 2.4rem;
				border-radius:0.5rem;
				h3 {
					font-size: 1.6rem;
					padding-top: 2.4rem;
					margin-left: 2rem;
				}
				.package {
					margin-top: 3rem;
					overflow: hidden;
					font-size: 1.4rem;
					.package-l {
						padding-left: 2rem;
						float: left;
						vertical-align: middle;
					    display: flex;
					    align-items: center;
					    width:70%;
						img {
							height: .8rem;
							vertical-align: middle;
						}
					}
					.package-r {
						float: right;
						padding-right: 2rem;
					}
				}
				.borderStyle {
					width: 30.5rem;
					height: 1px;
					background: #EAEAEA;
					margin: 0 auto;
					margin-top: 2rem;
				}
				.merber-package-price {
					margin-top: 2rem;
					padding: 0 2rem;
					overflow: hidden;
					color: #8A9399;
					.package-price-left {
						float: left;
						font-size: 1.4rem;
					}
					.package-price-right {
						float: right;
						font-size: 1.2rem;
					}
				}
			}
			.advantage {
				width: 92%;
				margin: 0 auto;
				margin-top: 1rem;
				img {
					width: 100%;
				}
			}
		}
		.content3 {
			margin-top: 0.8rem;
			text-align: center;
			h2 {
				text-align: left;
			}
			img {
				width: 92%;
			}
		}
		.content4 {
			text-align: left;
			.other-packages {
				width: 92%;
				margin: 0 auto;
				height: auto;
				border: 0.5px solid #EAEAEA;
				border-radius: .5rem;
				overflow: hidden;
				padding: 1rem 1.2rem 1.5rem;
			}
			.other-packages-last{
				margin-bottom:6rem;
			}
			.libao {
				width: 5.2rem;
				height: 5.2rem;
				border-radius: .3rem;
				float: left;
			}
			.buynumber {
				color: #8A9399;
				font-size: 1.2rem;
				padding-top:1.2rem;
			}
			.package-price {
				padding-left: 1.2rem;
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space:nowrap;
				.package-price-num {
					margin-bottom: 0.2rem;	
					line-height: 3rem;
					font-size: 1.4rem;
					color: #FF7B31;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space:nowrap;
				}
			}
			.description {
				font-size: 1.2rem;
				color: #475966;
				margin-top: 1rem;
				font-weight: 400;
				height: 1.2rem;
				line-height: 1;
				overflow: hidden;
			    text-overflow: ellipsis;
			    width: 65%;
			    white-space: nowrap;
			}
			.share {
				position: absolute;
				right: 0;
				bottom: 0;
				button {
					padding: 0.8rem 1.8rem;
					line-height: 1;
					background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
					border-radius: 1.5rem;
					color: #fff;
					outline: none;
					border: none;
					font-size: 1.4rem;
					font-weight: 600;
				}
			}
			.fixBtn{
				overflow: hidden;
				padding: 1rem 1.1rem 1rem 1.5rem;
				position: fixed;
			    bottom: 0;
			    width: 100%;
			    background: #fff;
			}
			@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
				.fixBtn{
						overflow: hidden;
						padding: 1rem 1.1rem 3rem 1.5rem;
						position: fixed;
					    bottom: 0;
					    width: 100%;
					    background: #fff;
					}
			}
			.buy {
				text-align: center;
				background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
				border-radius: 2.9rem;
				font-size: 1.8rem;
				font-weight: 600;
				color: #fff;
				float: left;
    			height: 4.6rem;
    			line-height: 4.6rem;
				margin: .6rem 0;
				width:74%;
			}
			.inweixin-style{
				float:none!important;
				margin:0 auto!important;
			}
			.share-now {
				width: 5.8rem;
				height: 5.8rem;
				float: right;
				margin-left: 1.1rem;
			}
		}
		.shareWraper {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .6);
			text-align: center;
			.share-content {
				width: 96%;
				margin: 0 auto;
				position: fixed;
				bottom: 8.8rem;
				left: 50%;
				margin-left: -48%;
				background: #fff;
				border-radius: 1.4rem;
				.title {
					color: #1A2833;
					font-size: 1.6rem;
					padding-top: 2rem;
				}
				.weixin-friend {
					display: flex;
					width: 60%;
					margin: 0 auto;
					.weixin,
					.friend {
						flex: 1;
						img {
							width: 5rem;
							margin-top: 3.9rem;
						}
						div {
							color: #1A2833;
							font-size: 1rem;
							margin-top: 1.5rem;
							padding-bottom: 3.8rem;
						}
					}
				}
			}
			.cancleBtn {
				width: 96%;
				position: fixed;
				left: 50%;
				bottom: 2.4rem;
				border-radius: 1.4rem;
				background: #fff;
				height: 5.6rem;
				border: none;
				outline: none;
				font-size: 1.8rem;
				margin-left: -48%;
			}
		}
	}
</style>