// pages/comment/comment.js
const Comment = AV.Object.extend('Comment');

Page({
  data: {
    content: '',
  },

  inputContent(e) {
    this.setData({
      content: e.detail.value,
    });
  },

  submitComment() {
    const comment = new Comment();
    comment.set('content', this.data.content);
    comment.set('user', AV.User.current()); // 当前登录用户

    comment.save().then(() => {
      console.log('留言成功');
      // 清空输入框或跳转到留言列表页面
      this.setData({ content: '' });
    }).catch(error => {
      console.error('留言失败', error);
    });
  },
});