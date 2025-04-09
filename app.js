// app.js
const AV = require("./libs/av-core-min.js");
const adapters = require("./libs/leancloud-adapters-weapp.js");

AV.setAdapters(adapters);
AV.debug.enable(); // 开启调试模式，输出详细日志

AV.init({
  appId: 'SaroR90AD4lQZQLTyi3NOtoB-gzGzoHsz',
  appKey: 'yT16CKbre8nvt2R4W22uv7hI',
  serverURLs: "https://saror90a.lc-cn-n1-shared.com",
});

// 验证初始化
console.log('[LeanCloud] SDK 状态:', {
  initialized: AV.applicationId === 'SaroR90AD4lQZQLTyi3NOtoB-gzGzoHsz',
  version: AV.version,
  region: AV.region,  // 新增属性：自动返回 "cn" 或 "us"
  //endpoints: AV.getServerURLs()
});


// app.js
App({
  onLaunch: function () {
    // 小程序启动时执行的代码
    console.log('App Launch');
  },
  onShow: function () {
    // 小程序显示时执行的代码
    console.log('App Show');
  },
  onHide: function () {
    // 小程序隐藏时执行的代码
    console.log('App Hide');
  },
  onPageNotFound: function (options) {
    // 小程序找不到页面时执行的代码
    console.error('App Page Not Found:', options);
  },
  onUnhandledRejection: function (rejection) {
    // 小程序未处理的 Promise 拒绝时执行的代码
    console.error('App Unhandled Rejection:', rejection);
  },
  onThemeChange: function (theme) {
    // 小程序主题变化时执行的代码
    console.log('App Theme Change:', theme);
  },
  onMemoryWarning: function (level) {
    // 小程序内存不足时执行的代码
    console.warn('App Memory Warning:', level);
  },
  onNetworkStatusChange: function (status) {
    // 小程序网络状态变化时执行的代码
    console.log('App Network Status Change:', status);
  },
  onUserCaptureScreen: function () {
    // 用户截屏时执行的代码
    console.log('App User Capture Screen');
  },
  onAudioInterruptionEnd: function () {
    // 音频中断结束时执行的代码
    console.log('App Audio Interruption End');
  }, 
  onAudioInterruptionBegin: function () {
    // 音频中断开始时执行的代码
    console.log('App Audio Interruption Begin');
  }, 
  
  globalData: {
    user: null
  },

  // 检查登录状态
  checkLogin: async function() {
    if (this.globalData.user) return true
    
    try {
      const user = AV.User.current()
      if (user) {
        await user.fetch() // 刷新用户数据
        this.globalData.user = user
        return true
      }
      return false
    } catch (error) {
      console.error('登录态检查失败:', error)
      return false
    }
  },

  // 全局错误处理
  onError(msg) {
    console.error('App Error:', msg);
    AV.Cloud.run('logError', {
      error: msg,
      page: getCurrentPages().pop().route
    })
  }
});