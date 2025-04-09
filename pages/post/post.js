// pages/post/post.js
const AV = require('../../libs/av-core-min.js')
Page({
  data: {
    content: '',
    images: [],
    isSubmitting: false
  },

  // 文本输入
  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  // 添加图片
  async addImage() {
    if (this.data.images.length >= 3) {
      return wx.showToast({ title: '最多上传3张', icon: 'none' })
    }

    const res = await wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed']
    })

    if (res.tempFiles[0]) {
      this.setData({
        images: [...this.data.images, res.tempFiles[0].tempFilePath]
      })
    }
  },
  // 移除图片
  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const newImages = this.data.images.filter((_, i) => i !== index);
    this.setData({ images: newImages });
  },
  // 提交留言
  async handleSubmit() {
    if (this.data.isSubmitting) return
    if (!this.data.content.trim()) {
      return wx.showToast({ title: '请填写内容', icon: 'none' })
    }

    this.setData({ isSubmitting: true })
    wx.showLoading({ title: '发布中', mask: true })

    try {
      const Message = AV.Object.extend('Message')
      const message = new Message()

      // 设置基础字段
      message.set('content', this.data.content.trim())
      message.set('author', AV.User.current())
      message.set('status', 0)

      // 处理图片上传
      if (this.data.images.length > 0) {
        const files = await Promise.all(
          this.data.images.map(async (tempPath) => {
            const file = new AV.File(`img-${Date.now()}`, {
              blob: await wx.getFileSystemManager().readFileSync(tempPath)
            })
            return file.save()
          })
        )
        message.set('images', files)
      }

      // 保存并返回
      await message.save()
      wx.navigateBack()
    } catch (error) {
      wx.showToast({ title: '发布失败', icon: 'none' })
    } finally {
      this.setData({ isSubmitting: false })
      wx.hideLoading()
    }
  }
})