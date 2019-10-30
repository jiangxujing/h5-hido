// 微信相关的方法
const wx = window.wx || {}
let jsReady = window.jsReady || false
let jsSignature = window.jsSignature || false

function WcImg (type, flag) {
  this.type = type;
  this.flag = flag
}

WcImg.prototype = {
  localId: null,
  serverId: null,
  type: 0,
  flag: 0,
  upload: 0
}

export const initWechatJs = (appId, nonceStr, timestamp, signature) => {
  return new Promise(async (resolve, reject) => {
    await wx.config({
      debug: false,
      appId: appId,
      timestamp: timestamp,
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: [
        'checkJsApi',
        'chooseImage',
        'uploadImage',
        // 'onMenuShareAppMessage',
        // 'onMenuShareTimeline',
        // 'onMenuShareQQ',
        'scanQRCode',
        'getLocation',
        'closeWindow'
      ]
    })
    await wx.ready(() => {
      console.log('wechat Ready!')
      window.jsReady = jsReady = true
      window.jsSignature = jsSignature = true
      resolve()
    })
    await wx.error(res => {
      console.log('wx config error:', res)
      window.jsSignature = jsSignature = false
      reject(res)
    })
    wx.checkJsApi({
      jsApiList: ['chooseImage'],
      success (res) {
        console.log(res)
      },
      fail (res) {
        console.log(res)
      }
    })
    getLocation()
  })
}

export const openCamera = (uploadCallback) => {
  if (!jsReady) {
    alert("网络较差，请在网络较好的地方尝试!")
    return
  }
  if (!jsSignature) {
    alert("当前微信版本太低，请升级后再拍摄!")
    return
  }
  wx.chooseImage({
    sizeType: ['compressed'],
    success (res) {
      // if (res.localIds.length > 1) {
      //   alert("只支持一张图片！")
      //   return
      // }
      // img.localId = res.localIds[0]
      // img = res
      // console.log(img)
      if (uploadCallback && typeof uploadCallback == 'function') {
        console.log(res.localIds)
        uploadCallback.call(this, res.localIds)
      }
    },
    fail (res) {
      console.log(res)
      alert("当前微信版本太低，请升级后再拍摄!")
    }
  })
}

export const openCameraForSinglePic = (picIndex, sourceType, uploadCallback) => {
  if (!jsReady) {
    alert("网络较差，请在网络较好的地方尝试!")
    return
  }
  if (!jsSignature) {
    alert("当前微信版本太低，请升级后再拍摄!")
    return
  }
  if (!sourceType || sourceType == null || typeof sourceType == 'undefined') {
    sourceType = ['album', 'camera']
  } else {
    sourceType = [sourceType]
  }
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: sourceType,
    success (res) {
      var localIds = res.localIds
      if (localIds.length > 1) {
        alert("只可以传一张")
      } else {
        // alert(localIds[0])
        var image = new WcImg(parseInt(picIndex), 0)
        image.localId = localIds[0]
        image.upload = 0
        wx.uploadImage({
          localId: image.localId,
          success (res) {
            // alert(JSON.stringify(res))
            image.upload = 1
            image.serverId = res.serverId
            if (uploadCallback && typeof uploadCallback == 'function') {
              uploadCallback.call(this, image)
            }
            // uploadMedia(image, applNo, code)
          }
        })
      }
    }
  })
}

export const openScanQRCode = (qrCodecallback) => {
  console.log('openScanQRCode')
  if (!jsReady) {
    alert("网络较差，请在网络较好的地方尝试!")
    return
  }
  if (!jsSignature) {
    alert("当前微信版本太低，请升级后再拍摄!")
    return
  }
  wx.scanQRCode({
    needResult: 1,
    desc: 'scanQRCode desc',
    success (res) {
      console.log(res)
      if (qrCodecallback && typeof qrCodecallback == 'function') {
        qrCodecallback.call(this, res)
      }
    },
    fail (res) {
      console.log(res)
      alert("当前微信版本太低，请升级后再扫码!")
    }
  })
}

export const getLocation = () => {
  console.log('GET LOCATION')
  // if (wx.getLocation) {
  //   console.log('support wx.getlocation');
  //   wx.getLocation({
  //     type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
  //     success: function (res) {
  //       console.log('wx.getlocation success:');
  //       console.log('latitude: ', res.latitude);
  //       console.log('longitude: ', res.longitude);
  //       latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
  //       longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
  //       // var speed = res.speed; // 速度，以米/每秒计
  //       // var accuracy = res.accuracy; // 位置精度
  //     },
  //     error: function (err) {
  //       console.log('wx.getlocation error:', err);
  //     }
  //   });
  //   return;
  // }
  if (navigator.geolocation) {
    console.log('support navigator.geolocation')
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('navigator.geolocation success:')
        console.log('latitude: ', position.coords.latitude)
        console.log('longitude: ', position.coords.longitude)
        localStorage.setItem('geoLocation', JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }))
      },
      error => {
        console.log(JSON.stringify(error))
        const showError = error => { console.log(error) }
        switch (error.code) {
          case error.TIMEOUT:
            showError("A timeout occured!")
            break
          case error.POSITION_UNAVAILABLE:
            showError('We can\'t detect your location. Sorry!')
            break
          case error.PERMISSION_DENIED:
            showError('Please allow geolocation access for this to work.')
            break
          case error.UNKNOWN_ERROR:
            showError('An unknown error occured!')
            break
        }
      },
      {
        /* 指示浏览器获取高精度的位置，默认为false*/
        enableHighAccuracy: true,
        /* 指定获取地理位置的超时时间，默认不限时，单位为毫秒*/
        timeout: 6000,
        /* 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。*/
        maximumAge: 60000
      }
    )
  }
}

export const closeWindow = () => {
  if (wx.closeWindow) {
    wx.closeWindow()
  } else {
    window.close()
  }
}
