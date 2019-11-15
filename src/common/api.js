import axios from 'axios'
import _ from 'lodash'
import ApiList from './api.json'
import { Toast } from 'vant'
import { getQueryString, getCookie, setCookie, urlParse } from './utils.js'
import Loading from '../components/Loading/loading.js'
import qs from 'qs'

let CancelToken = axios.CancelToken
let cancel

const prefix = '/hidoCode'
const prefixList = [{
    type: 'user',
    value: '/user'
},{
	type: 'collections',
    value: '/collections-web'
},{
	type: 'hido-core',
    value: '/hido-core'
}]

const weixinPrefix = '/sns'
const weixinPayPrefix = '/pay'
const h5Prefix = '/mch'

let toolType = null
if (getQueryString('toolType')) {
    toolType = getQueryString('toolType')
    sessionStorage.setItem('toolType', toolType)
} else {
    toolType = sessionStorage.getItem('toolType')
}

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
const setupWebViewJavascriptBridge = (callback) => {
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
 * formData: formData请求方式
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
        isRegister: null,
        lastLoginTime: null,
        memberId: null,
        memberType: null,
        token: null,
        tokenExpire: null,
        accessToken: null,
        mmTicket: null,
        positionLongitude: null,
        positionLatitude: null
    }
    for (let k in headers) {
        if (getQueryString(k)) {
            headers[k] = getQueryString(k)
            setCookie(k, headers[k], 7)
        } else {
            headers[k] = getCookie(k)
        }
    }
    headers.mmChannel = 'mmdApp_h5'
    headers.mmTicket = headers.accessToken

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
            if (respData['code'] === 1210 || respData['code'] === 1211 || respData['code'] === 111) {
                Toast('凭证已失效，请重新登录', '提示')
                if (urlParse()) {
                    setupWebViewJavascriptBridge(function(bridge) {
                        let params = {
                            jumpUrl: window.location.href
                        }
                        bridge.callHandler('callLogin', params, (data) => {
                            setCookie('accessToken', data.accessToken, 7)
                            console.log(data)
                        })
                    })
                } else {
                    this.$router.push({name: 'login'})
                }
            } else if (respData['code'] !== 0) {
                let desc = respData['desc'] ? respData['desc'] : '网络异常，请稍后再试'
                Toast(desc, '提示')
            }
            return Promise.resolve(respData)
        } else {
            return Promise.reject(new Error(resp.status))
        }
    }).catch(function (err) {
        console.log(err)
        Loading.hide()
        Toast('网络异常，请稍后再试', '提示')
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
    cancel: () => {
        cancel && cancel()
    }
}
