// category.js
var config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    key:'',
    tag: null,
    title:null,
    books: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    var self = this;

    //按tag展示书籍
    if(options.key=='tag'){
      self.setData({
        tag: options.tag
      });
      wx.request({
        url: config.tagUrl+'/' +encodeURI(self.data.tag),
        method: 'GET',
        data: {},
        success: function (result) {
          self.setData({
            books: result.data.data,
            loading: true
          });
          // //保存tag到缓存，作为推荐阅读来源
          // self.addliketag(self.data.tag);
        },
      })
    }

    //按title搜索书籍
    else if(options.key=='title'){
      self.setData({
        title:options.title
      });
      //按书名搜索
      wx.request({
        url: config.searchBookByTitleUrl + encodeURI(self.data.title),
        success: function (res) {
          //console.log(res.data);
          self.setData({
            books: res.data.data,
            loading: true
          });
          //如果搜索到的内容非空，存入搜索历史
          // if(self.data.books.length>0){
          //   self.addseachhst(self.data.title);
          // }
        }
      })
    }

  },

  //保存到搜索历史缓存
  // addseachhst:function(titletmp){
  //   var self = this;
  //   var searchhst = wx.getStorageSync('searchhst');

  //   //尚无搜索历史缓存
  //   if (!searchhst) {
  //     searchhst = new Array(1);
  //     searchhst[0] = titletmp;
  //   }
  //   //存在搜索历史缓存
  //   else {
  //     var len = searchhst.length;
  //     //如果title 已经存在，直接返回不做处理
  //     for (var i = 0; i < len; i++) {
  //       if (self.data.title == searchhst[i]) {
  //         return;
  //       }
  //     }

  //     //缓存的title数量不足3个
  //     if (len < 3) {
  //       searchhst = searchhst.concat(titletmp);
  //     }
  //     //缓存达到3个
  //     else {
  //       searchhst.shift();//先进先出，队列方式
  //       searchhst.push(titletmp);
  //     }
  //   }
  //   wx.setStorageSync('searchhst', searchhst);
  //   console.log('搜索历史缓存：')
  //   console.log(wx.getStorageSync('searchhst'));
  // },


 //保存tag到缓存，作为推荐阅读来源
  // addliketag:function(tagtmp){
  //   var self = this;
  //   var liketags = wx.getStorageSync('liketags');

  //   //尚无tag缓存
  //   if (!liketags) {
  //     liketags = new Array(1);
  //     liketags[0] = tagtmp;
  //   }
  //   //存在tag缓存
  //   else {
  //       var len = liketags.length;
  //       //如果tag 已经存在，直接返回不做处理
  //       for (var i = 0; i < len; i++) {
  //         if (self.data.tag == liketags[i]) {
  //           return;
  //         }
  //       }

  //       //缓存的tag数量不足3个
  //       if (len < 3) {
  //         liketags = liketags.concat(tagtmp);
  //       }
  //       //缓存达到3个
  //       else {
  //         liketags.shift();//先进先出，队列方式
  //         liketags.push(tagtmp);
  //       }
  //     }
  //     wx.setStorageSync('liketags', liketags);
  //     console.log('标签缓存：')
  //     console.log(wx.getStorageSync('liketags'));
  //   },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  skip: function (event) {
    wx.navigateTo({
      url: event.target.dataset.url,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})