// utils/auth.js
const loginWithWechat = async () => {
    try {
      // 获取微信登录凭证
      const { code } = await wx.login()
      
      // LeanCloud 微信登录
      const user = await AV.User.loginWithWeapp({ 
        code,
        preferUnionId: true // 优先使用 unionId
      })
      
      // 更新用户信息
      const { userInfo } = await wx.getUserProfile({ desc: '用于留言功能' })
      user.set('nickName', userInfo.nickName)
      user.set('avatarUrl', userInfo.avatarUrl)
      await user.save()
      
      return user
    } catch (error) {
      console.error('登录失败:', error)
      throw new Error(error.message)
    }
  }