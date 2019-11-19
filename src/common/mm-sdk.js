var h5MiMeSdk = h5MiMeSdk || (function (window, document, undefined) {
  var errMsg = {
    0: 'init config success!',
    100: '标题为空',
    997: 'CallBack return undefined value.',
    998: 'Handler Name is NULL.',
    999: 'init config faild!'
  };
  var inited = false;
  var sysPlatform = '';
  var ua = navigator.userAgent.toLowerCase();
  //调用设备对象的test方法判断设备类型
  if (/iphone|ipad|ipod/.test(ua)) {
    sysPlatform = 'IOS';
  } else if (/android/.test(ua)) {
    sysPlatform = 'ANDROID';
  } else {
    sysPlatform = '';
  }

  console.log('sysPlatform:', sysPlatform);

  function mockCallHandler (name, data, cb) {
    console.log('handler name:', name);
    cb = cb || function () {};
    var jsonEcho = function (json) {
      return Object.assign({
        code: 0,
        desc: '',
        content: {}
      }, json);
    };
    switch (name) {
      case 'callInit':
        cb(jsonEcho());
        break;
      case 'callToken':
        cb(jsonEcho({
          content: { 'accessToken': 'JLSKDJFNLKIOSNDF23JS788' }
        }));
        break;
      case 'callDevInfo':
        cb(jsonEcho({
          content: {
            'deviceId': '12345678',
            'imei': '343534534534534',
            'imsi': '45643r242',
            'ipNet': 'wifi',
            'mac': '23:e3:g3:34:54:3g',
            'PhoneBrand': 'iPhone',
            'phoneType': 'ios',
            'phoneVersion': '12.01'
          }
        }));
        break;
      case 'callOCR':
        cb(jsonEcho({
          content: {
            'idNo': '320123199901011234',
            'name': '王二小'
          }
        }));
        break;
      case 'callFaceDetection':
        cb(jsonEcho());
        break;
      case 'callTitleUpdate':
        cb(jsonEcho());
        break;
      case 'callLocation':
        cb(jsonEcho({
          content: {
            'latitude': 31,
            'longitude': 118
          }
        }));
        break;
      case 'callContactInfo':
        cb(jsonEcho({
          content: {
            'name': 'testName',
            'phone_number': '186xxxxxxxx'
          }
        }));
        break;
      case 'callBankCard':
        cb(jsonEcho({
          content: {
            'bankName': 'xxx',
            'cardNo': '6222453645643'
          }
        }));
        break;
      case 'callFinish':
        cb(jsonEcho());
        break;
      case 'callAPP':
        cb(jsonEcho());
        break;
      default:
        break;
    }
  }

  /**
   * 初始化jsbridge
   * @return jsbridge
   */
  var getJSBridge = function () {
    if (window.WebViewJavascriptBridge) {
      return window.WebViewJavascriptBridge;
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        console.log(window.WebViewJavascriptBridge);
        return window.WebViewJavascriptBridge;
      }, false)
    }
  };

  /**
   * 兼容IOS和安卓的jsbridge
   * @param  callback
   * @return webviewjsbridge
   */
  var connectWebViewJavascriptBridge = function (callback) {
    if (sysPlatform === 'IOS') {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
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

    if (sysPlatform === 'ANDROID') {
      if (window.WebViewJavascriptBridge) {
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
   * 兼容IOS和安卓的bridge重写
   * @type Object
   */
  var webViewCallHandler = {
    callHandler: function (handlerName, data) {
      if (sysPlatform === 'IOS') {
        base.birdge.callHandler(handlerName, data, function (response) {
          return response;
        });
      } else if (sysPlatform === 'ANDROID') {
        window.WebViewJavascriptBridge.callHandler(
          handlerName, data,
          function (response) {
            return response;
          });
      }
    }
  };

  var parseDataContent = function (data) {
    if (typeof data == 'undefined' || !data) return false;
    var _parseJSON = function (str) {
      if (typeof str == 'object') {
        return str;
      }
      try {
        return JSON.parse(str);
      } catch (ex) {};
      return (new Function("", "return " + str))();
    };

    if ('[object String]' === Object.prototype.toString.call(data)) {
      data = _parseJSON(data);
    }
    data.code = ~~(data.code);
    data.content = data.content || {};
    data.content = _parseJSON(data.content);
    return data;
  };

  var callJsBridgeHandler = function (handler, data) {
    handler = handler || '';
    data = data || {};
    return new Promise(function (resolve, reject) {
      if (handler === '') {
        reject(new Error(errMsg[998]));
      } else {
        return connectWebViewJavascriptBridge(function (webViewCallHandler) {
          return webViewCallHandler.callHandler(handler, data, function (res) {
            console.log('original res:' + JSON.stringify(res));
            resolve(parseDataContent(res));
          });
        });
      }
    });
  };

  var rdata = function (data) {
    return new Promise(function (resolve, reject) {
      if (data) {
        if (data.code === 0) {
          resolve(data.content);
        } else {
          reject(data);
        }
      } else {
        reject(new Error(errMsg[997]));
      }
    });
  };

  var init = function (back) {
    console.log('init page callInit');
    back = back.toString() || 'true'
    return callJsBridgeHandler('callInit', { interceptBack: back }).then(function (data) {
      console.log('init data:' + JSON.stringify(data));
      alert(JSON.stringify(data))
      inited = true;
      if (data) {
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error(errMsg[997]));
      }
    });
  };

  var getToken = function () {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callToken').then(function (data) {
      console.log('token data:', data);
      return rdata(data);
    });
  };

  var doLogin = function () {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callLogin').then(function (data) {
      console.log('token data:', data);
      return rdata(data);
    });
  };

  var getDevInfo = function () {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callDevInfo').then(function (data) {
      console.log('dev info:', data);
      return rdata(data);
    });
  };

  var getOcr = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callOCR', data).then(function (data) {
      console.log('ocr return:', data);
      return rdata(data);
    });
  };

  var getFacepp = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callFaceDetection', data).then(function (data) {
      console.log('face++ return:', data);
      return rdata(data);
    });
  };

  var getQRCode = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callQRCode', data).then(function (data) {
      console.log('call QRCode return:', data);
      return rdata(data);
    });
  };

  var takePhoto = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callTakePhoto', data).then(function (data) {
      console.log('take photo return:', data);
      return rdata(data);
    });
  };

  var changeTitle = function (title) {
    if (!title || title === '') return Promise.reject(new Error(errMsg[100]));
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callTitleUpdate', { title: title }).then(function (data) {
      console.log('change title:', data);
      return rdata(data);
    });
  };

  var getLocation = function () {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callLocation').then(function (data) {
      console.log('location data:', data);
      return rdata(data);
    });
  };

  var getContactInfo = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callContactInfo', data).then(function (data) {
      console.log('contact info:', data);
      return rdata(data);
    });
  };

  var getBankcard = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callBankCard', data).then(function (data) {
      console.log('bankcard:', data);
      return rdata(data);
    });
  };

  var onShare = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callShare', data).then(function (data) {
      console.log('call share:', data);
      return rdata(data);
    });
  };

  var onShareOne = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callShareOnly', data).then(function (data) {
      console.log('call share one channel:' + JSON.stringify(data));
      return rdata(data);
    });
  };

  var toggleMenu = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callMenuInit', data).then(function (data) {
      console.log('call app menu init:' + JSON.stringify(data));
      return rdata(data);
    });
  };

  var finishWeb = function () {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callFinish').then(function (data) {
      console.log('finish web:', data);
      return rdata(data);
    });
  };

  var goApp = function (data) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    return callJsBridgeHandler('callAPP', data).then(function (data) {
      console.log('goto app:', data);
      return rdata(data);
    });
  };

  var registerPressBack = function (cb) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    connectWebViewJavascriptBridge(function (webViewCallHandler) {
      webViewCallHandler.registerHandler('invokeBackPress', function (data) {
        if (typeof cb === 'function') cb(data);
      });
    });
  };

  var registerPageRefresh = function (cb) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    cb = cb || function () {};
    connectWebViewJavascriptBridge(function (webViewCallHandler) {
      webViewCallHandler.registerHandler('invokePageRefresh', function (data) {
        cb(data);
      });
    });
  };

  var registerPageIn = function (cb) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    cb = cb || function () {};
    connectWebViewJavascriptBridge(function (webViewCallHandler) {
      webViewCallHandler.registerHandler('invokePageIn', function (data) {
        cb(data);
      });
    });
  };

  var registerPageOut = function (cb) {
    if (!inited) {
      console.log(errMsg[999]);
      if (this.debug) alert(errMsg[999]);
    } else {
      console.log(errMsg[0]);
    }
    cb = cb || function () {};
    connectWebViewJavascriptBridge(function (webViewCallHandler) {
      webViewCallHandler.registerHandler('invokePageOut', function (data) {
        cb(data);
      });
    });
  };

  return {
    debug: false,
    inited: inited,
    init: init,
    doLogin: doLogin,
    getToken: getToken,
    getDevInfo: getDevInfo,
    getOcr: getOcr,
    getFacepp: getFacepp,
    getQRCode: getQRCode,
    takePhoto: takePhoto,
    changeTitle: changeTitle,
    getLocation: getLocation,
    getContactInfo: getContactInfo,
    getBankcard: getBankcard,
    onShare: onShare,
    onShareOne: onShareOne,
    toggleMenu: toggleMenu,
    finishWeb: finishWeb,
    goApp: goApp,
    registerPressBack: registerPressBack,
    registerPageRefresh: registerPageRefresh,
    registerPageIn: registerPageIn,
    registerPageOut: registerPageOut
  }

})(window, document);

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.mmsdk = factory();
})(this, function () {
  'use strict';
  return h5MiMeSdk;
});
