// pages/commentList/commentList.js
const Comment = AV.Object.extend('Comment');

Page({
  data: {
    comments: [],
  },

  onLoad() {
    const query = new AV.Query('Comment');
    query.include('user'); // 包含用户信息
    query.descending('createdAt'); // 按时间倒序排列
    query.find().then(comments => {
      this.setData({
        comments: comments.map(comment => ({
          id: comment.id,
          content: comment.get('content'),
          username: comment.get('user').get('username'),
          createdAt: comment.createdAt,
        })),
      });
    }).catch(error => {
      console.error('查询留言失败', error);
    });
  },
});