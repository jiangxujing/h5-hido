<template>
	<div class="product-detail">
		<div class="content1">
			<div class="content1-header" v-if="packageDetail">
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
				<div class="package" v-for="g in packageDetail.giftPackageDetailList">
					<div class="package-l">
						<img src="../assets/images/double.png" />
						<span>{{g.goodsName}}</span>
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
						<span style="text-decoration:line-through;">原价￥<span>{{packageDetail.originalPrice/100}}</span></span>
						<span style="color:#FF7B31;font-size:1.4rem;font-weight:600;">￥{{packageDetail.salesPrice/100}}</span>
					</div>
				</div>
			</div>
			<div class="advantage" v-for="i in detailsPicture">
				<img :src="i" />
			</div>
		</div>
		<div class="content1 content2 content3" v-if="packageDetail">
			<h2>产品使用规则</h2>
				<img :src="packageDetail.listPicture" />
		</div>
		<div class="content1 content2 content3 content4">
			<h2>其他礼包</h2>
			<div class="other-packages" v-for="i in giftPackageDTOList" style="margin-top:1rem">
				<div>
					<div style="overflow:hidden">
						<div style="float:left">
							<img class="libao" :src="i.headPicture" />
							<div class="package-price">
								<div style="color:#FF7B31">
									<span style="font-size:1.6rem;">￥<span style="font-size:2.1rem;font-weight: bold;">{{i.salesPrice/100}}</span></span>
									<span style="font-size:1.4rem;">会员礼包</span>
								</div>
								<div style="color:#8A9399;font-size:1.7rem;font-weight: 400;">原价￥<span>{{i.originalPrice/100}}</span></div>
							</div>
						</div>
						<div class="buynumber">{{i.initSalesCount}}人购买</div>
					</div>
					<div>
						<div class="description">{{i.name}}</div>
						<div class="share" @click="getBuy(i)" v-if="homepageUrl.type==1">
							<button>立即购买</button>
						</div>
						<div class="share" @click="getShare(i)" v-else>
							<button>立即分享</button>
						</div>
					</div>
				</div>
			</div>
			<div class="buy" @click="getBuy" v-if="packageDetail">￥{{packageDetail.salesPrice/100}}成为代理</div>
		</div>
		<div class="shareWraper" v-show='shareWrapperShow' @click='shareWrapperShow=false'>
			<div class="share-content">
				<div class="title"><span style="font-size:2rem">-</span>&nbsp;分享至&nbsp;<span style="font-size:2rem">-</span></div>
				<div class="weixin-friend">
					<div class="weixin" @click="shareWeixin">
						<img src="../assets/images/weixin.png" />
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
				homepageUrl:'',
				detailsPicture:[]
			}
		},
		methods: {
			cancleBtn() {
				this.shareWrapperShow = false
			},
			getShare(i) {
				this.shareContent = i
				this.shareWrapperShow = true
			},
			shareWeixin() {
				if(this.device.version.MicroMessenger) {
					this.getWechat()
				} else {
					api.setupWebViewJavascriptBridge((bridge) => {
						let params = {
							"sharePlatform": "WechatSession",
							"shareParams": {
								"shareUrl": _utils.getUrlSearch(),
								"title": this.shareContent.shareTitle,
								"shareContent": this.shareContent.shareDesc,
								"sharePic": this.shareContent.sharePicture
							}
						}
						bridge.callHandler('callShareOnly', params, (data) => {
							console.log(data)
						})
					})
				}
			},
			shareFriend() {
				if(this.device.version.MicroMessenger) {
					this.getWechat()
				} else {
					api.setupWebViewJavascriptBridge((bridge) => {
						let params = {
							"sharePlatform": "WechatTimeline",
							"shareParams": {
								"shareUrl": _utils.getUrlSearch(),
								"title": this.shareContent.shareTitle,
								"shareContent": this.shareContent.shareDesc,
								"sharePic": this.shareContent.sharePicture
							}
						}
						bridge.callHandler('callShareOnly', params, (data) => {
							console.log(data)
						})
					})
				}
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
				console.log(i.packageCode)
				if(!_utils.getCookie('accessToken')) {
					console.log(this.urlParse(window.location.search).app)
					if(this.urlParse(window.location.search).app === "app") {
						api.setupWebViewJavascriptBridge(function(bridge) {
							bridge.callHandler('callLogin', {}, (data) => {
								console.log(data)
								_utils.setCookie('accessToken', data.content.accessToken, 1)

							})
						})
					} else {
						this.$router.push("/login")
					}
				} else {
					if(i.packageCode){
					this.$router.push("/orderDetail?packageCode=" + i.packageCode)
					}else{
						this.$router.push("/orderDetail?packageCode=" + this.$route.query.packageCode)
					}
				}
			},
			getWechat() {
				let linkUrl = location.href.split('#')[0]
				let reqUrl = {
					url: encodeURIComponent(linkUrl)
				}
				let imgUrl = this.imageUrl
				let imgurl = location.origin + this.prefixUrl + imgUrl
				api.get(api.getUrl('getWechat'), reqUrl).then(res => {
					if(res.code == '0000') {
						var timestamp = res.content.timestamp;
						var nonceStr = res.content.nonceStr;
						var signature = res.content.signature;
						var appId = res.content.appid
						wx.config({
							debug: false, // 开fff启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: appId,
							timestamp: timestamp, // 必填，生成签名的时间戳
							nonceStr: nonceStr, // 必填，生成签名的随机串
							signature: signature, // 必填，签名，见附录1
							jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						api.getWechat(this.content.title, this.content.content, linkUrl, imgurl)
					}
				})
			},
			getPackageDetail(code) {
				let req = {
					packageCode: code
				}
				api.post(api.getUrl('queryPackage', 'collections'), req, false, false, false).then(res => {
					if(res.code == 0) {
						console.log('jinl ')
						this.packageDetail = res.content.giftPackageDTODetails
						if(res.content.giftPackageDTODetails){
							this.detailsPicture = res.content.giftPackageDTODetails.detailsPicture.split(',')
						}
						this.giftPackageDTOList = res.content.giftPackageDTOList
						this.homepageUrl = res.content.homepageUrl
						let type = res.content.homepageUrl.type
						sessionStorage.setItem('type',type)
					}
				}).catch((e) => {

				})
			}

		},
		mounted() {
			document.title = "礼包详情"
			let ua = navigator.userAgent;
			this.device = {
				version: function() {
					return {
						MicroMessenger: /micromessenger/i.test(ua),
					}
				}()
			};
			this.ios = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			this.android = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
			let code = this.$route.query.packageCode
			this.getPackageDetail(code)
		},
	}
</script>

<style lang="scss">
	.product-detail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
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
							width: 7px;
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
		.content2 {
			padding-bottom: 1.8rem;
			h2 {
				padding-top: 2.8rem;
				padding-left: 1.5rem;
				padding-bottom: 1.4rem;
			}
			.content2-detail {
				width: 92%;
				margin: 0 auto;
				height: auto;
				background: #FAFAFA;
				overflow: hidden;
				padding-bottom: 2.4rem;
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
						img {
							height: 8px;
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
				border: 1px solid #EAEAEA;
				border-radius: 5px;
				overflow: hidden;
				padding: 1rem 1.2rem 1.5rem;
			}
			.libao {
				width: 52px;
				height: 52px;
				border-radius: 3px;
				float: left;
			}
			.buynumber {
				color: #8A9399;
				font-size: 1.7rem;
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
				font-weight: 400;
			}
			.share {
				float: right;
				button {
					width: 82px;
					height: 30px;
					background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
					border-radius: 15px;
					color: #fff;
					outline: none;
					border: none;
					font-size: 1.4rem;
					font-weight: 600;
				}
			}
			.buy {
				margin: 0 auto;
				margin-top: 1.6rem;
				text-align: center;
				width: 92%;
				height: 46px;
				background: linear-gradient(132deg, rgba(255, 175, 130, 1) 0%, rgba(255, 123, 49, 1) 100%);
				border-radius: 29px;
				font-size: 1.8rem;
				font-weight: 600;
				color: #fff;
				line-height: 46px;
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
					font-weight: 600;
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