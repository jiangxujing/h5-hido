import axios from 'axios'
import _ from 'lodash'
import router from '../router.js'
import ApiList from './api.json'
import { Toast } from 'vant'
import { getQueryString, getCookie, setCookie, delCookie } from './utils.js'
import Loading from '../components/Loading/loading.js'
import qs from 'qs'

let CancelToken = axios.CancelToken
let cancel

let sysPlatform = '';
let ua = navigator.userAgent.toLowerCase();
//调用设备对象的test方法判断设备类型
if(/iphone|ipad|ipod/.test(ua)) {
	sysPlatform = 'IOS';
} else if(/android/.test(ua)) {
	sysPlatform = 'ANDROID';
} else {
	sysPlatform = '';
}

// const origin = 'otherOrigin'
const origin = window.location.origin == 'https://h5-hido.h-ido.com' ?
	'proOrigin' :
	(window.location.origin == 'https://bf-uat.memedai.cn' ? 'uatOrigin' : 'otherOrigin')

const prefixList = [{
	type: 'user',
	otherOrigin: '/user',
	proOrigin: 'https://user.h-ido.com/user',
	uatOrigin: 'https://bf-uat.memedai.cn/user'
}, {
	type: 'collections',
	otherOrigin: '/collections-web',
	proOrigin: 'https://collections-web.h-ido.com/collections-web',
	uatOrigin: 'https://bf-uat.memedai.cn/collections-web'
}, {
	type: 'core',
	otherOrigin: '/hido-core',
	proOrigin: 'https://hido-core.h-ido.com/hido-core',
	uatOrigin: 'https://bf-uat.memedai.cn/hido-core'
}]

/* 自定义判断元素类型JS */
function toType(obj) {
	return({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/* 参数过滤函数 */
function filterNull(o) {
	for(var key in o) {
		if(o[key] === null) {
			delete o[key]
		}
		if(toType(o[key]) === 'string') {
			o[key] = o[key].trim()
		} else if(toType(o[key]) === 'object') {
			o[key] = filterNull(o[key])
		} else if(toType(o[key]) === 'array') {
			o[key] = filterNull(o[key])
		}
	}
	return o
}

const _parseJSON = str => {
	if(typeof str === 'object') {
		return str
	}
	try {
		return JSON.parse(str)
	} catch(ex) {}
	return(new Function('', 'return ' + str))()
}

const getUrl = (key, type) => {
	if(typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
		return ''
	}
	let url = ''
	let newType = type ? type : 'core'
	prefixList.forEach(item => {
		item.type == newType ? url = item[origin] + ApiList[key] : ''
	})
	return url
}

const get = (url, params) => {
	if(params) {
		params = filterNull(params)
	}
	return axios({
			method: 'get',
			url: url,
			params: params,
			withCredentials: false
		})
		.then(function(resp) {
			if(resp.status >= 200 && resp.status < 300) {
				let respData = resp.data
				respData['code'] = ~~(respData['code'])
				return Promise.resolve(respData)
			}
			return Promise.reject(new Error(resp.status))
		}).catch(function(err) {
			console.log(err)
			// Toast('网络异常，请稍后再试', '提示')
			return Promise.reject(new Error(err))
		})
}

/**
 * jsbridge
 * @param  callback
 * @return webviewjsbridge
 */
const setupWebViewJavascriptBridge = function(callback) {
	if(sysPlatform === 'IOS') {
		if(window.WebViewJavascriptBridge) {
			return callback(WebViewJavascriptBridge);
		}
		if(window.WVJBCallbacks) {
			return window.WVJBCallbacks.push(callback);
		}
		window.WVJBCallbacks = [callback];
		var WVJBIframe = document.createElement('iframe');
		WVJBIframe.style.display = 'none';
		WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function() {
			document.documentElement.removeChild(WVJBIframe);
		}, 0)
	}
	if(sysPlatform === 'ANDROID') {
		if(window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge);
		} else {
			document.addEventListener(
				'WebViewJavascriptBridgeReady',
				function() {
					callback(WebViewJavascriptBridge);
				},
				false
			);
		}
	}
};

/**
 * callHandler 连接Native提供接口对的方法（把获取到的数据赋值到cookie）
 * type: 定义的接口名
 * params: 入参对象
 **/
const callHandler = function(type, params) {
	setupWebViewJavascriptBridge(function(webViewCallHandler) {
		webViewCallHandler.callHandler(type, params, function(data) {
			if(data.content) {
				var content = data.content
				for(var key in content) {
					setCookie(key, content[key], 7)
				}
			}
		})
	});
}

/**
 * registerHandler 注册app调用方法
 * type: 定义的接口名
 * callback: 回调方法
 **/
const registerHandler = function(type, responseCallback) {
	// if (sysPlatform === 'IOS') {
	//     webViewCallHandler.registerHandler(type, function(data) {
	//         responseCallback(data)
	//     })
	// } else if (sysPlatform === 'ANDROID') {
	//     setupWebViewJavascriptBridge(function(webViewCallHandler) {
	//         webViewCallHandler.init(function(message, responseCallback) {
	//             responseCallback(message)
	//         })
	//         webViewCallHandler.registerHandler(type, function(data) {
	//             responseCallback(data)
	//         })
	//     })
	// }
	setupWebViewJavascriptBridge(function(webViewCallHandler) {
		webViewCallHandler.registerHandler(type, function(data) {
			responseCallback(data)
		});
	});
}

// 微信
export const getWechat = (title, desc, linkUrl, imgUrl) => {
//	wx.checkJsApi({
//		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'], // 需要检测的JS接口列表
//		success: function(res) {
//			console.log(res);
//		}
//	});
	wx.ready(function() {
		wx.onMenuShareAppMessage({
			title: title,
			desc: desc,
			link: linkUrl,
			imgUrl: imgUrl,
			trigger: function(res) {},
			success: function(res) {},
			cancel: function(res) {},
			fail: function(res) {}
		});
		wx.onMenuShareTimeline({
			title: title,
			desc: desc,
			link: linkUrl,
			imgUrl: imgUrl,
			trigger: function(res) {},
			success: function(res) {},
			cancel: function(res) {},
			fail: function(res) {}
		});
	});
	wx.error(function(res) {
		console.log(JSON.stringify(res))
		//alert("配置項過期！");
	});
}
/**
 * 一般post请求
 * url： 请求地址
 * data： 入参对象
 * Loading: 无加载动画
 * noToken: 不需要校验token
 * formData: 传参方式为 formData
 **/
const post = (url, data, noBox, noLoading, noToken, formData) => {
	// 超时
	const sec = 6000
	// body 入参
	data ? data = filterNull(data) : ''
	let postData = {}
	let _data = _.assign({}, data)
	_.forEach(_data, (val, key) => {
		['timeout'].indexOf(key) === -1 ? postData[key] = val : ''
	})
	// header 入参
	let headers = {
		accessToken: null,
		deviceID: null,
		phoneBrand: null,
		phoneVersion: null,
		appVersion: null,
		screenHeight: null,
		screenWidth: null,
		channel: null
	}
	for (let k in headers) {
		if (getQueryString(k)) {
			headers[k] = getQueryString(k)
			setCookie(k, headers[k], 7)
		} else {
			headers[k] = getCookie(k)
		}
	}
	
	// headers.conection = 'close'
	headers.accessToken ? headers.mmTicket = headers.accessToken : null

	let timeout = _data['timeout'] || 10 * sec
	// 请求头
	let axiosHead = {
		method: 'post',
		url: url,
		data: postData,
		timeout: timeout,
		CancelToken: new CancelToken(function executor(c) {
			cancel = c
		})
	}

	!noLoading ? Loading.show() : ''
	!noToken ? axiosHead.headers = headers : ''
	formData ? axiosHead.data = qs.stringify(postData) : ''

	return axios(axiosHead).then(function(resp) {
		Loading.hide()
		if(resp.status >= 200 && resp.status < 300) {
			let respData = _parseJSON(resp.data)
			respData['code'] = ~~(respData['code'])
			respData['content'] = _parseJSON(respData['content'])
			if ([111, 1210, 1211, 9999].indexOf(respData['code']) !== -1) {
				for(let k in headers) {
					delCookie(k)
				}
				let desc = respData['desc'] ? respData['desc'] : '凭证已失效，请重新登录'
				respData['code'] === 111 ? '' : Toast(desc)
				if(navigator.userAgent.toLowerCase().indexOf('hido')  !=  -1) {
					setNative('callLogin', {})
				} else {
				      if(router.currentRoute.name == "reservation"){
				        router.replace({
				          name:"login",
				          query: {redirect: '/referrerPhone'}
				        })
				      }else{
				        router.replace({
				          name:"login",
				          query: {redirect: router.currentRoute.fullPath}
				        })
				      }
				}
			} else if(respData['code'] !== 0) {
				if(!noBox){
					let desc = respData['desc'] ? respData['desc'] : '网络异常，请稍后再试'
					Toast(desc)
				}
			}
			return Promise.resolve(respData)
		} else {
			return Promise.reject(new Error(resp.status))
		}
	}).catch(function(err) {
		console.log(err)
		Loading.hide()
		// alert(JSON.stringify(err))
		let desc = '网络异常，请稍后再试'
		Toast(desc)
	})
}

// 返回在vue模板中的调用接口
export default {
	getUrl,
	get,
	getWechat,
	post,
	setupWebViewJavascriptBridge,
	callHandler,
	registerHandler,
	cancel: () => {
		cancel && cancel()
	}
}