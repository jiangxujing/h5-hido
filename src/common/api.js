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

const prefix = '/hido-core'
const prefixList = [{
    type: 'user',
    value: '/user'
}, {
	type: 'collections',
    value: '/collections-web'
}]

const weixinPrefix = '/sns'
const weixinPayPrefix = '/pay'
const h5Prefix = '/mch'


/* 自定义判断元素类型JS */
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/* 参数过滤函数 */
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

const _parseJSON = str => {
    if (typeof str === 'object') {
        return str
    }
    try {
        return JSON.parse(str)
    } catch (ex) {}
    return (new Function('', 'return ' + str))()
}

const getUrl = (key, type) => {
    if (typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
        return ''
    }
    let url = prefix + ApiList[key]
    if (type) {
        prefixList.forEach(item => {
            item.type == type ? url = item.value + ApiList[key] : ''
        })
    }
    return url
}

const getWeixinUrl = (key,type) => {
	if (typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
        return ''
    }
	let url = ''
	if(type == 'weixin'){
		url = weixinPrefix + ApiList[key] 
	}else if(type== 'weixinPay'){
		url = weixinPayPrefix + ApiList[key]
	}else if(type == 'h5Pay'){
		url = h5Prefix + ApiList[key]
	}
    return url
}

const get = (url, params) =>{
  if (params) {
    params = filterNull(params)
  }
  return axios({
    method: 'get',
    url: url,
    params: params,
    withCredentials: false
  })
   .then(function(resp) {
        if (resp.status >= 200 && resp.status < 300) {
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
// 注册 app 交互方法
const setupWebViewJavascriptBridge = function(callback) {
    //android
    if (window.WebViewJavascriptBridge) { callback(window.WebViewJavascriptBridge) } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() { 
            callback(window.WebViewJavascriptBridge)
        },false);
    }
    //ios
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

/**
 * setNative 把获取到的入参 赋值到 cookie
 * type: 定义的接口名
 * params: 入参对象
 **/
const setNative = function(type, params) {
    if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
        setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler(type, params, function(data) {
                if (data.content) {
                    let content = data.content
                    for (var key in content) {
                        setCookie(key, content[key], 7)
                    }
                }
            })
        })
    }
}


// 微信
export const getWechat = (title,desc,linkUrl,imgUrl) => {
	   wx.checkJsApi({
        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'], // 需要检测的JS接口列表
        success: function(res) {
            console.log(res);
        }
    });
    wx.ready(function() {
        wx.onMenuShareAppMessage({
            title: title,
            desc:desc,
            link: linkUrl,
            imgUrl: imgUrl,
            trigger: function(res) {},
            success: function(res) {},
            cancel: function(res) {},
            fail: function(res) {}
        });
        wx.onMenuShareTimeline({
            title: title,
            desc:desc,
            link: linkUrl,
            imgUrl: imgUrl,
            trigger: function(res) {},
            success: function(res) {},
            cancel: function(res) {},
            fail: function(res) {}
        });
    });
    wx.error(function(res){
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
const post = (url, data, noLoading, noToken, formData) => {
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
        mmTicket: null,
        token: null,
        tokenExpire: null,
        accessToken: null,
        isRegister: null,
        lastLoginTime: null,
        memberId: null,
        memberType: null,
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

    headers.mmTicket = headers.accessToken
    headers.channel = 'android'
    headers.conection = 'close'
    setCookie('mmTicket', headers['mmTicket'], 7)
	alert(JSON.stringify(headers))
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
        if (resp.status >= 200 && resp.status < 300) {
            let respData = resp.data
            respData['code'] = ~~(respData['code'])
            respData['content'] = _parseJSON(respData['content'])
            if (respData['code'] === 9999 || respData['code'] === 1210 || respData['code'] === 1211 || respData['code'] === 111) {
                for (let k in headers) {
                    delCookie(k)
                }
                let desc = respData['desc'] ? respData['desc'] : '凭证已失效，请重新登录'
                Toast(desc)
                if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
                    setNative('callLogin', {})
                } else {
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
                }
            } else if (respData['code'] !== 0) {
                let desc = respData['desc'] ? respData['desc'] : '网络异常，请稍后再试'
                Toast(desc)
            }
            return Promise.resolve(respData)
        } else {
            return Promise.reject(new Error(resp.status))
        }
    }).catch(function (err) {
        console.log(err)
        Loading.hide()
        alert(JSON.stringify(err))
        Toast(err)
    })
}

// 返回在vue模板中的调用接口
export default {
    getUrl,
    getWeixinUrl,
    get,
    getWechat,
    post,
    setupWebViewJavascriptBridge,
    setNative,
    cancel: () => {
        cancel && cancel()
    }
}
