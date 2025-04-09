// pages/feed/feed.js
const AV = require('../../libs/av-core-min.js')
Page({
  data: {
    messages: [],
    isLoading: false,
    hasMore: true
  },

  page: 0,
  pageSize: 10,

  onLoad() {
    this.loadData()
  },

  // 加载数据
  // 加载数据
async loadData() {
  if (!this.data.hasMore || this.data.isLoading) {
    console.log('loadData: No more data or already loading');
    return;
  }

  this.setData({ isLoading: true });
  try {
    console.log('loadData: Starting to load data');

    const query = new AV.Query('Message')
      .equalTo('status', 0)
      .include(['author', 'images'])
      .descending('createdAt')
      .skip(this.page * this.pageSize)
      .limit(this.pageSize);

    console.log('loadData: Query constructed:', query);

    const results = await query.find();
    console.log('loadData: Query results:', results);

    const newMessages = results.map(msg => ({
      id: msg.id,
      content: msg.get('content'),
      author: {
        nickName: msg.get('author').get('nickName'),
        avatarUrl: msg.get('author').get('avatarUrl')
      },
      images: (msg.get('images') || []).map(f => f.url),
      createdAt: msg.createdAt.toLocaleDateString()
    }));

    console.log('loadData: New messages:', newMessages);

    this.setData({
      messages: this.page === 0 ? newMessages : [...this.data.messages, ...newMessages],
      hasMore: results.length >= this.pageSize
    });
    console.log('loadData: Data updated, hasMore:', this.data.hasMore);

    this.page++;
    console.log('loadData: Page incremented to:', this.page);
  } catch (error) {
    console.error('loadData: Error occurred:', error);
    wx.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    this.setData({ isLoading: false });
    console.log('loadData: Loading completed, isLoading set to false');
    wx.stopPullDownRefresh(); // Stop the pull-down refresh animation
  }
},

  // 触底加载
  onReachBottom() {
    this.loadData()
  },

  // 下拉刷新
  onPullDownRefresh() {
    console.log('onPullDownRefresh: Pull down refresh triggered');
    this.page = 0; // Reset the page number
    this.setData({
      messages: [], // Clear existing messages
      hasMore: true // Reset hasMore flag
    });
    this.loadData(); // Reload data
  }
})