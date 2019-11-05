import axios from 'axios'
import _ from 'lodash'
import ApiList from './api.json'
import { Toast } from 'vant'
import { getQueryString } from './utils.js'
import Loading from '../components/Loading/loading.js'

let CancelToken = axios.CancelToken
let cancel

const prefix = '/h5-hido'

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

const getUrl = key => {
    if (typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
        return ''
    }
    return prefix + ApiList[key]
}


// 注册 app 交互方法
const setupWebViewJavascriptBridge = (callback) => {
    if (toolType === '5') {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge)
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback)
        }
        window.WVJBCallbacks = [callback]
        let WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'https://__bridge_loaded__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    } else if (toolType === '4') {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener( 'WebViewJavascriptBridgeReady' , function() {
                callback(WebViewJavascriptBridge)
            }, false )
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback)
        }
        window.WVJBCallbacks = [callback]
        let WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'https://__bridge_loaded__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    } else {
    }
}
export const getWechat = (title,desc,linkUrl,imgUrl) => {
	   wx.checkJsApi({
        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
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
 **/
const post = (url, data, noLoading, noToken) => {
    data ? data = filterNull(data) : ''
    const sec = 6000
    let postData = {}
    // app传入的头部信息
    let headers = {
        token: null,
        mmDeviceId: null,
        versionNo: null,
        phoneBrand: null,
        phoneType: null,
        ipAddress: null,
        positionLongitude: null,
        positionLatitude: null
    }
    for (let k in headers) {
        if (getQueryString(k)) {
            headers[k] = getQueryString(k)
            sessionStorage.setItem(k, headers[k])
        } else {
            headers[k] = sessionStorage.getItem(k)
        }
    }

    let _data = _.assign({}, data)
    _.forEach(_data, (val, key) => {
        ['timeout'].indexOf(key) === -1 ? postData[key] = val : ''
    })

    let timeout = _data['timeout'] || 10 * sec

    !noLoading ? Loading.show() : ''

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
    !noToken ? axiosHead.headers = headers : ''

    return axios(axiosHead).then(function(resp) {
        Loading.hide()
        if (resp.status >= 200 && resp.status < 300) {
            let respData = resp.data
            respData['code'] = ~~(respData['code'])
            respData['content'] = _parseJSON(respData['content'])
            if (respData['code'] === 1111) {
                Toast('凭证已失效，请重新登录', '提示')
                if (toolType === '5' || toolType === '4') {
                    setupWebViewJavascriptBridge(function(bridge) {
                        let params = {
                            jumpUrl: window.location.href
                        }
                        bridge.callHandler('goLogin', params, (data) => {
                            console.log(data)
                        })
                    })
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
    getWechat,
    post,
    setupWebViewJavascriptBridge,
    cancel: () => {
        cancel && cancel()
    }
}
