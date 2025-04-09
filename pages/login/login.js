// pages/login/login.js
const app = getApp()
const AV = require('../../libs/av-core-min.js')

Page({
  handleLogin: function() {
    console.log('handleLogin')
    if (app.globalData.user) {
      // 如果用户已经登录，直接跳转到首页
      console.log('用户已经登录', app.globalData.user.toJSON())
      wx.hideLoading()
      wx.switchTab({ url: '/pages/feed/feed' })
      return
    }

    // 显示加载提示框
    wx.showLoading({ title: '登录中', mask: true })

    // 1.获取微信信息
    wx.getUserProfile({
      desc: '用于完善会员信息',
      success: async (res) => {
        try {
          console.log('获取用户信息成功:', res.userInfo)
          // 2. 获取微信登录凭证
          wx.login({
            success: async (loginRes) => {
              if (!loginRes.code) {
                wx.hideLoading()
                wx.showToast({
                  title: '获取登录凭证失败',
                  icon: 'none'
                })
                return
              }
              console.log('微信登录凭证:', loginRes.code)

              try {
                // 3. LeanCloud 登录
                const user = await AV.User.loginWithWeapp({ code: loginRes.code })
                console.log('LeanCloud 用户登录成功:', user.toJSON())

                // 4. 保存用户信息到 LeanCloud 用户对象
                user.set('nickName', res.userInfo.nickName)
                user.set('avatarUrl', res.userInfo.avatarUrl)
                await user.save()
                console.log('用户信息保存成功:', user.toJSON())
                // 5.更新全局状态
                app.globalData.user = user
                wx.hideLoading()
                wx.switchTab({ url: '/pages/feed/feed' })
                return
              } catch (error) {
                console.error('LeanCloud 登录失败:', error)
                wx.hideLoading()
                wx.showToast({
                  title: `错误 ${error.code || '未知'}: ${error.message || '请重试'}`,
                  icon: 'none'
                })
              }
            },
            fail: (loginErr) => {
              wx.hideLoading()
              wx.showToast({
                title: '微信登录失败',
                icon: 'none'
              })
              console.error('微信登录失败:', loginErr)
            }
          })
        } catch (saveError) {
          console.error('保存用户信息失败:', saveError)
          wx.showToast({
            title: `保存失败: ${saveError.message || '请重试'}`,
            icon: 'none'
          })
        } finally {
          wx.hideLoading()
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('获取用户信息失败:', err)
        wx.showToast({
          title: '需要授权才能继续',
          icon: 'none'
        })
      }
    })
  },
})
