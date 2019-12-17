import _ from 'lodash'
import md5 from 'js-md5'

const ua = navigator.userAgent.toLowerCase(), //判断浏览器类型 
	arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], // 加权因子
	arrValid = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 校验码

let date = null,
	sysPlatform = '',
	cookiePosBegin = -1,
	cookiePosEnd = -1,
	offSet = 60 * 1000 * (new Date(0)).getTimezoneOffset(),
	week = {
		'0': '日',
		'1': '一',
		'2': '二',
		'3': '三',
		'4': '四',
		'5': '五',
		'6': '六'
	},
	regObj = {
		'chsName': /^[\u4E00-\u9FFF]([\u4E00-\u9FFF]{0,3})[\u4E00-\u9FFF]$/, // 2-5汉字
		'vCode4': /^\d(\d{2})\d$/, // 4位验证码
		'vCode6': /^\d(\d{4})\d$/, // 6位验证码
		'mobile': /^1\d{10}$/, // 通用手机号
		'email': /^(\w)+[(\.\w+)|(\-\w+)]*@(\w)+(([\.|\-]\w+)+)$/, // 邮箱
		'strongPwd': /^(?=.*[A-Za-z]+)(?=.*\d+)(?=.*[\~\!\@\#\$%\^&\*\(\)_\+\{\}\:\;\"\"\'\/\`\?\<\>\.\,\[\]\-\=\\\|]+)[A-Za-z\d\x21-\x7e]{8,16}$/ // 强密码
	},
	regFunc = {
		idNum(cid) {
			if(/^\d{17}(\d|x|X)$/i.test(cid)) {
				let sum = 0,
					idx = 0;
				for(let i = 0; i < cid.length - 1; i++) { // 对前17位数字与权值乘积求和
					sum += parseInt(cid.substr(i, 1), 10) * arrExp[i]
				}
				idx = sum % 11 // 计算模（固定算法）
				return arrValid[idx] === cid.substr(17, 1).toUpperCase() // 检验第18为是否与校验码相等
			} else if(/^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(cid)) {
				return true
			} else {
				return false
			}
		}
	},
	crypts = {
		encode(val) {
			if(val === undefined) {
				return window.encodeURIComponent('')
			}

			if(typeof val === typeof 1) {
				val += ''
			}

			if(_.isObject(val)) {
				return window.encodeURIComponent(JSON.stringify(val))
			} else if(typeof val === typeof 'a') {
				return window.encodeURIComponent(val)
			} else {
				return window.encodeURIComponent('')
			}
		},
		decode(val) {
			try {
				return JSON.parse(window.decodeURIComponent(val))
			} catch(e) {
				return window.decodeURIComponent(val)
			}
		}
	};

if(/iphone|ipad|ipod/.test(ua)) { //调用设备对象的test方法判断设备类型
	sysPlatform = 'IOS'
} else if(/android/.test(ua)) {
	sysPlatform = 'ANDROID'
} else {
	sysPlatform = ''
}

// 控制页面字体大小
export const htmlFontSize = () => {
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var width = w > h ? h : w;
	width = width > 720 ? 720 : width;
	var fz = ~~(width * 100000 / 36) / 10000;
	fz = 10;
	document.getElementsByTagName('html')[0].style.cssText = 'font-size: ' + fz + 'px';
	var realfz = ~~(+window.getComputedStyle(document.getElementsByTagName('html')[0]).fontSize.replace('px', '') * 10000) / 10000;
	if(fz !== realfz) {
		document.getElementsByTagName('html')[0].style.cssText = 'font-size: ' + fz * (fz / realfz) + 'px';
	}
	document.getElementsByTagName('html')[0].style.cssText = 'font-size: 10px'
}

export const resetFontSize = (doc, win) => {
	let docEle = doc.documentElement,
		// evt = 'orientationchange' in window ? 'orientationchange' : 'resize,
		fn = function() {
			setTimeout(function() {
				let width = docEle.clientWidth
				width && (docEle.style.fontSize = 10 * (width / 375) + 'px')
			}, 1000 / 60)
		}
	'orientationchange' in win ? win.addEventListener('orientationchange', fn, false) : ''
	win.addEventListener('resize', fn, false)
	doc.addEventListener('DOMContentLoaded', fn, false)
	fn()
}

export const resetWindow = () => {
	// 重设 viewport 的 height ，防止在 ios 低版本下高度的bug
	const resetViewHeight = (h) => {
		let vpList = document.getElementsByName('viewport')
		_.forEach(vpList, vp => {
			let content = vp.getAttribute('content')
			vp.setAttribute('content', content.replace(/height=.+?,/gi, 'height=' + h + ','))
		})
	}

	const resetWidth = () => {
		let winW = window.innerWidth || document.documentElement.clientWidth
		// console.log(winW)
		document.documentElement.style.width = winW + 'px'
		document.body.style.width = winW + 'px'
		document.body.style.overflowX = 'hidden'
		localStorage.setItem('width', winW)
	}

	const resetHeight = () => {
		let winH = window.innerHeight || document.documentElement.clientHeight
		// console.log(winH)
		document.documentElement.style.height = winH + 'px'
		document.body.style.height = winH + 'px'
		let pageContainers = document.querySelectorAll('.page-container')
		_.forEach(pageContainers, pc => {
			pc.style.minHeight = winH + 'px'
			pc.style.height = winH + 'px'
		})
		sysPlatform === 'IOS' ? resetViewHeight(winH) : ''
		// console.log('window height:' + winH)
	}

	resetWidth()
	resetHeight()
	window.addEventListener('resize', () => {
		resetWidth()
		resetHeight()
	})
	window.addEventListener('orientationchange', () => {
		resetWidth()
		resetHeight()
	})
	document.addEventListener('focusout', () => {
		window.scrollTo(0, 0)
	})

	// ios下解决点出去不失焦的问题
	const objBlur = (item, time) => {
		time = time || 300
		let obj = item,
			docTouchend = event => {
				if(event.target !== obj) {
					setTimeout(() => {
						obj.blur()
						document.removeEventListener('touchend', docTouchend, false)
					}, time)
				}
			}
		if(obj) {
			obj.addEventListener('focus', () => {
				document.addEventListener('touchend', docTouchend, false)
			}, false)
		}
	}

	if(sysPlatform === 'IOS') {
		let ipts = document.querySelectorAll('input')
		_.forEach(ipts, item => {
			// eslint-disable-next-line
			let input = new objBlur(item)
			input = null
		})
	}
}

export const dispatchEvent = (target, evt) => {
	if(!evt || evt === '') return false
	let event = document.createEvent('HTMLEvents')
	event.initEvent(evt, true, true)
	event.eventType = 'message'
	target.dispatchEvent(event)
}

export const filterVal = (name, val) => {
	const _filters = {
		bankcardNo() {
			if(val == '') return val
			let card = val.replace(/\D/g, '')
			let ncard = ''
			if(card.length > 19) card = card.slice(0, -1)
			for(let n = 0; n < card.length; n = n + 4) {
				ncard += card.substring(n, n + 4) + " "
			}
			return ncard.replace(/(\s*$)/g, "")
		},
		mobile() {
			val = val.replace(/\D/g, '')
			if(val.length > 11) val = val.slice(0, -1)
			if(!/^1[0-9]*$/.test(val)) val = ''
			return val
		},
		contactPhone() {
			val = val.replace(/\D/g, '');
			if(val.length > 11) val = val.slice(0, -1)
			if(!/^1[0-9]*$/.test(val)) val = ''
			return val
		},
		idNo() {
			// eslint-disable-next-line
			val = val.replace(/[\u4e00-\u9fa5|A-W|a-w|y|z|Y|Z|\s|`~!@#$%^&*()\-=_+\{\}\[\]\|\\;':",\.\<\>\/\?]|([x|X](?!$))/g, '')
			if(val.length > 18) val = val.slice(0, -1)
			return val
		},
		servicePass() {
			val = val.replace(/\D/g, '')
			if(val.length > 8) val = val.substr(0, 8)
			return val
		},
		verifyCode() {
			val = val.replace(/\D/g, '')
			if(val.length > 6) val = val.substr(0, 6)
			return val
		},
		mimeVerifyCode() {
			val = val.replace(/\D/g, '')
			if(val.length > 4) val = val.substr(0, 4)
			return val
		}
	}
	return(typeof _filters[name] === 'function') ? _filters[name].call(this) : val
}

/**
 * 格式校验
 **/
export const validator = (val, type) => {
	if(type === 'idNum') {
		return regFunc.idNum(val)
	} else if(typeof type === typeof 'a' && !!regObj[type]) {
		return regObj[type].test(val)
	} else {
		return false
	}
}

/**
 * 时间差
 **/
export const timeInterval = (endDate, startDate) => {
	let diff = endDate.getTime() - startDate.getTime() // 时间差的毫秒数  
	let days = Math.floor(diff / (24 * 3600 * 1000)) // 计算出相差天数  
	//计算出小时数  
	let leave1 = diff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数  
	let hours = Math.floor(leave1 / (3600 * 1000))
	//计算相差分钟数  
	let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数  
	let minutes = Math.floor(leave2 / (60 * 1000))
	//计算相差秒数  
	let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数  
	let seconds = Math.round(leave3 / 1000)

	let returnStr = seconds + "秒"
	minutes > 0 ? returnStr = minutes + "分" + returnStr : ''
	hours > 0 ? returnStr = hours + "小时" + returnStr : ''
	days > 0 ? returnStr = days + "天" + returnStr : ''

	return returnStr
}

/**
 * 时间格式处理
 **/
export const dateFormatter = (datetime, fmt, fix) => {
	offSet = !fix ? 0 : offSet
	// date = datetime instanceof Date ? datetime : new Date(+datetime + offSet)
	date = datetime instanceof Date ? datetime : new Date(datetime)
	let o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': (date.getHours() % 12) === 0 ? 12 : (date.getHours() % 12), // 小时
		'H+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	}
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay() + ''])
	}
	for(let k in o) {
		if(new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
		}
	}
	return fmt
}

/**
 * 设置 cookie
 **/
export const setCookie = (name, value, day) => {
	let exp = new Date()
	day = day || 1
	exp.setTime(exp.getTime() + day * 60 * 60 * 1000 * 24)
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
}

/**
 * 获取 cookie
 **/
export const getCookie = name => {
	let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"))
	return arr != null ? unescape(arr[2]) : null
}

/**
 * 删除 cookie
 **/
export const delCookie = name => {
	let cval = getCookie(name)
	let exp = new Date()
	exp.setTime(exp.getTime() - 1)
	cval != null ? document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() : ''
}

/**
 * cookie 存取
 **/
export const cookieCan = (name, value, options, noMd5) => {
	if(typeof name !== typeof 'a') {
		return ''
	}
	// 字符串 / 数字 / 非空对象
	if(typeof value === typeof 'a' || typeof value === typeof 1 || !_.isEmpty(value) || _.isEqual(value, {}) || _.isEqual(value, [])) { // 存
		typeof value === typeof 1 ? value += '' : ''
		options = options || {
			expires: 30
		}
		date = new Date()
		date.setMilliseconds(date.getMilliseconds() + (+options.expires * 24 * 60 * 60 * 1000))
		document.cookie = [
			(!noMd5 ? md5(name) : name),
			'=', crypts.encode(value),
			options.expires ? '; expires=' + date.toUTCString() : '',
			options.path ? '; path=' + options.path : '',
			options.domain ? '; domain=' + options.domain : '',
			options.secure ? '; secure' : ''
		].join('')
		return ''
	} else { // 取
		if(document.cookie.length > 0) {
			cookiePosBegin = !noMd5 ? ocument.cookie.indexOf(md5(name)) + md5(name).length + 1 : ocument.cookie.indexOf(name) + name.length + 1
			cookiePosEnd = document.cookie.indexOf(';', cookiePosBegin)
			cookiePosEnd === -1 ? cookiePosEnd = document.cookie.length : ''
			return crypts.decode(document.cookie.substring(cookiePosBegin, cookiePosEnd))
		} else {
			return ''
		}
	}
}

/**
 * session 存取
 **/
export const sessionCan = (name, obj) => {
	if((typeof name === typeof 'a') && _.isEmpty(obj) && !_.isEqual(obj, {}) && !_.isEqual(obj, [])) { // 取
		return !window.sessionStorage ? (cookieCan(name) || {}) : (crypts.decode(window.sessionStorage.getItem(md5(name))) || {})
	} else if((typeof name === typeof 'a') && (!_.isEmpty(obj) || _.isEqual(obj, {}) || _.isEqual(obj, []))) { // 存
		!window.sessionStorage ? cookieCan(name, obj) : window.sessionStorage.setItem(md5(name), crypts.encode(obj))
		return {}
	} else {
		return {}
	}
}

/**
 * storage 存取
 **/
export const storageCan = (name, obj) => {
	if((typeof name === typeof 'a') && _.isEmpty(obj) && !_.isEqual(obj, {}) && !_.isEqual(obj, [])) { // 取
		return !window.localStorage ? (cookieCan(name) || {}) : (crypts.decode(window.localStorage.getItem(md5(name))) || {})
	} else if((typeof name === typeof 'a') && (!_.isEmpty(obj) || _.isEqual(obj, {}) || _.isEqual(obj, []))) { // 存
		!window.localStorage ? cookieCan(name, obj) : window.localStorage.setItem(md5(name), crypts.encode(obj))
		return {}
	} else {
		return {}
	}
}

export const convertSecondToTime = sec => {
	if(sec === 0) {
		return sec
	}
	let hh = 0,
		mm = 0,
		ss = 0;
	const step = 60,
		fix = t => {
			return t < 10 ? '0' + t : t + ''
		},
		timeOffset = (t, step) => {
			return [Math.floor(t / step), t % step]
		};

	[mm, ss] = timeOffset(sec, step)
	if(mm > 59) {
		[hh, mm] = timeOffset(mm, step)
	}
	return [fix(hh), fix(mm), fix(ss)].join(':')
}

/*
 * 数组重排方法，
 * @params  origin 原始数组
 *          target 需要挪动的数组
 *          direction 方向 'left' or 'right'
 */
export const reAlignArray = (origin, target, direction) => {
	let newArr = origin ? _.clone(origin) : [],
		index = -1,
		edgeIndex = -1,
		item = null;

	target = target || []
	direction = direction || 'right'

	if(direction === 'right') { // 右移
		edgeIndex = newArr.indexOf(target[target.length - 1])
		if(edgeIndex >= (newArr.length - 1) || edgeIndex === -1) { // 边界条件
			return newArr
		}
		for(let i = target.length - 1; i >= 0; i--) { // 倒序循环
			item = target[i]
			index = newArr.indexOf(item)
			if(index < (newArr.length - 1)) {
				newArr[index] = newArr[index + 1]
				newArr[index + 1] = item
			}
		}
	} else { // 左移
		edgeIndex = newArr.indexOf(target[0])
		if(edgeIndex <= 0 || edgeIndex === -1) { // 边界条件
			return newArr
		}
		target.forEach(item => { // 正序循环
			index = newArr.indexOf(item)
			if(index > 0) {
				newArr[index] = newArr[index - 1]
				newArr[index - 1] = item
			}
		})
	}
	return newArr
}

/**
 * 金钱展示
 **/
export const formatMoney = (amount, fixed) => {
	//  /* 千分位方法，支持小数*/
	const toThousands = num => {
		let arr = [],
			result = '';

		num = (num || 0).toString()
		if(num.indexOf('.') != -1) {
			arr = num.split('.')
			num = arr[0]
		}
		while(num.length > 3) {
			result = ',' + num.slice(-3) + result
			num = num.slice(0, num.length - 3)
		}
		num ? result = num + result : ''
		arr.length > 0 ? result += '.' + arr[1] : ''
		return result
	}
	if(~~(amount) === 0) {
		return '0.00'
	}
	fixed = fixed || 0

	let tmpNumber = fixed == 1 ? (amount / 100).toFixed(2) : parseInt(amount / 100, 10)
	return tmpNumber >= 1000 ? toThousands(tmpNumber) : tmpNumber
}
/**
 * 表格处理 空 为 '/'
 **/
export const emptyFormat = (row, column) => {
	let data = row[column.property]
	return data ? data : '/'
}

/**
 * 获取过滤掉指定参数的url
 **/
export const getUrlSearch = () => {
	let appHeaders = ['accessToken', 'deviceID', 'phoneBrand', 'channel', 'phoneVersion', 'appVersion', 'screenHeight', 'screenWidth'],
		arr = [],
		tempAll = [],
		newUrl = window.location.href.split('?')[0],
		str = location.href, // 取得整个地址栏
		num = str.indexOf('?');

	str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]    
	arr = str.split('&') // 各个参数放到数组里
	arr.forEach((item, i) => {
		num = item.indexOf('=')
		if(num > 0) {
			!i ? newUrl += '?' : ''
			let name = item.substring(0, num)
			if(appHeaders.indexOf(name) == -1) {
				newUrl += name + '=' + item.substr(num + 1) + '&'
			}
		}
	})
	newUrl.split('?').length > 1 && !newUrl.split('?')[1] ? newUrl = newUrtokl.split('?')[0] : ''
	tempAll = newUrl.split('&')
	if(tempAll && tempAll.length > 0) {
		let newJumpArr = []
		tempAll.forEach(item => {
			!!item ? newJumpArr.push(item) : ''
		})
		newUrl = newJumpArr.join('&')
	}
	return newUrl
}

/**
 * 获取URL指定参数值
 **/
export const getQueryString = (key) => {
	let hashSearch = window.location.href.split('?')[1]
	let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
	if(hashSearch) {
		let result = hashSearch.match(reg)
		return result ? decodeURIComponent(result[2]) : null
	}
}

/**
 * 获取 toolType
 **/
export const getToolType = () => {
	let ua = navigator.userAgent.toLowerCase(),
		isIos = /\(i[^;]+;( u;)? cpu.+mac os x/i.test(ua), // IOS
		isAndroid = /android/i.test(ua) || /linux/i.test(ua), // 安卓
		isWechat = ua.match(/micromessenger\/(\d+\.\d+\.\d+)/) || ua.match(/micromessenger\/(\d+\.\d+)/), // 微信
		isAliPay = ua.match(/alipaydefined\/(\d+\.\d+\.\d+)/) || ua.match(/aliapp\/(\d+\.\d+)/) || ua.match(/alipayclient\/(\d+)/), // 支付宝
		isWeibo = /weibo/i.test(ua), // 微博
		isIosQQ = isIos && / qq/i.test(ua), // QQ(IOS)
		isAndroidQQ = isAndroid && /mqqbrowserqq/i.test(ua), // QQ(安卓)
		toolType = null;

	if(getQueryString('toolType')) {
		toolType = getQueryString('toolType')
		sessionStorage.setItem('toolType', toolType)
	} else if(sessionStorage.getItem('toolType')) {
		toolType = sessionStorage.getItem('toolType')
	} else {
		if(isWechat) {
			toolType = 1
		} else if(isAliPay) {
			toolType = 2
		} else if(isWeibo) {
			toolType = 7
		} else if(isIosQQ || isAndroidQQ) {
			toolType = 6
		} else {
			toolType = 3
		}
	}
	return toolType
}

/**
 * 显示遮罩层
 **/
export const toShare = () => {
	let $node = document.createElement("div"),
		_dom = {
			show: $dom => { // dom show
				$dom && ($dom.style.display = "block")
			},
			hide: $dom => { // dom hide
				$dom && ($dom.style.display = "none")
			},
			appendDom: ($parent, $el) => { // append dom
				$parent.appendChild($el)
			},
			removeDom: $el => { // remove dom
				$el.parentNode.removeChild($el)
			},
			appendToBody: $el => { // append dom to body
				document.body.appendChild($el)
			},
			addClass: ($el, className) => { // add class
				$el.classList ? $el.classList.add(className) : el.className += ' ' + className
			},
			removeClass: ($el, className) => { // remove class
				$el.classList ? $el.classList.remove(className) : $el.className = $el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
			},
			isChinese: str => { // 判断中文字符
				let strGroup = /[u00-uFF]/;
				return !strGroup.test(str)
			},
			strlen: str => {
				let strlength = 0;
				for(let i = 0; i < str.length; i++) {
					strlength = _dom.isChinese(str.charAt(i)) == true ? strlength + 2 : strlength + 1
				}
				return strlength
			}
		};

	if(document.getElementsByClassName("open-sarari-tip").length > 0) {
		return false
	}

	_dom.addClass($node, 'open-sarari-tip')
	$node.onclick = e => {
		e.preventDefault()
		e.stopPropagation()
		_dom.removeDom(document.getElementsByClassName("open-sarari-tip")[0])
	}
	document.body.appendChild($node)
}

export const checkTel = () => {
	let strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
	return strTemp
}

/*
 * 设置中文字符输入长度
 */
export const getByteLen = (value) => {
	let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g
	let mat = value.match(cnReg)
	let length
	if (mat) {
		length = (mat.length + (value.length - mat.length) * 0.5)
	} else {
		length = value.length * 0.5
	}
	return length
}

/*
 * 获取支付方式名称
 */
export const getpPayType = (value) => {
	let label = 'value'
	const payType = [{
		value: 'WX',
		label: '微信'
	}, {
		value: 'ALIPAY',
		label: '支付宝'
	}, {
		value: 'MM_INSTALMENT',
		label: '米么分期'
	}, {
		value: 'BANK',
		label: '银行卡支付'
	}]
	payType.forEach(item => {
		item.value == value ? label = item.label : '' 
	})
	return label
}


/*
 * 校验
 */
export const checkRules = (value, type) => {
	const rules = {
		// mobileReg: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9])|166|198|199)+\d{8}$/,								// 手机号
		mobileReg: /^(1)+\d{10}$/,								// 手机号
		nameReg: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,		// 中文姓名
		chineseReg: /^[\u4e00-\u9fa5]*$/,						// 中文
		idCardNoReg: /^(^\d{18}$)|(^\d{17}(\d|X|x)$)$/,			// 身份证
		positiveIntegerReg: /^[1-9]\d*$/,						// 正整数
		integerReg: /^\d+$/										// 整数
	}
	if (!rules[type]) {
		return false
	}
	return rules[type].test(value)
}

export default {
	htmlFontSize,
	validator,
	dateFormatter,
	setCookie,
	getCookie,
	delCookie,
	storageCan,
	sessionCan,
	cookieCan,
	convertSecondToTime,
	reAlignArray,
	formatMoney,
	emptyFormat,
	getUrlSearch,
	getQueryString,
	getToolType,
	toShare,
	timeInterval,
	resetFontSize,
	resetWindow,
	checkTel,
	getByteLen,
	getpPayType,
	checkRules
}