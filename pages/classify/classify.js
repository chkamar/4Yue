// classify.js
var config = require('../../config');
// var srchfuns = require('../../utils/srchfuns');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    //getTagUrl: `http://api.seventeams.cn/books/tag`,
    tags: [],
    books:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //获得所有tag
    wx.request({
      url: config.tagUrl,
      method: 'GET',
      data: {

      },
      success: function (result) {
        self.setData({
          tags: result.data.data
        });
        var arrlen = result.data.data.length;
        var tag_idarr = new Array(arrlen);
        for (var i = 0; i < arrlen;i++)
          tag_idarr[i] = result.data.data[i]._id
        
        //向后台请求所有tag下的若干(暂定4)本书
        self.getBooks(0);
       
        //console.log(self.data.books);

      },
      fail: function ({errMsg}) {
        console.log('request fail', errMsg)
      }
    });


  },
  //递归请求各个TAG下的书籍
  getBooks:function(i){
    var self = this;
    var reqUrl = config.tagUrl +'/'+encodeURI(self.data.tags[i]._id);
   // console.log(reqUrl);
    wx.request({
      url: reqUrl,
      method:'GET',
      success:function(res){//在安卓手机返回的数据仍然是object
        var data = res.data;
        
        var booksTemp = new Array(4);
        var booksResult = data.data; //console.log('reslut-book:'); console.log(booksResult);
        booksTemp = booksResult.slice(0, 4); 
        self.data.books[i] = booksTemp;
        self.setData({
          books: self.data.books
        });
        //console.log(res.data);

        if(i+1<self.data.tags.length)
          self.getBooks(++i);
        else  
          self.setData({
            books:self.data.books,
            loading:true
          });
          
      },


    })
  },

  skip: function (event) {
    wx.navigateTo({
      url: event.target.dataset.url,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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