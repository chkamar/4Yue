// book.js
var config = require('../../config');
var scan = require('../../utils/scan');
//
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    isbn: null,
    info: null,
    authors:null,
    summary:null,
    tag:null,
    status:[],
    num:null
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this
    //console.log(options)
    self.setData({
      isbn:options.isbn
    })
    // console.log(options.isbn);

    //获得书籍的具体信息
    wx.request({
      url: config.bookInfoByIsbnUrl + self.data.isbn,
      method:'GET',
      success:function(result){
        self.setData({
          info:result.data.data
        });
        // console.log('book info:')
        // console.log(self.data.info)
        var len = self.data.info['author'].length;
        var arr = self.data.info['author'];
        var index = 0;
        var s = "";
        while(index<len)
        {
          s += arr[index++]+' ';
        }
        self.setData({
          authors:s,
          tag:self.data.info.tag
        })
       
        if(self.data.info['summary'].length>100)
        {
          self.setData({
            summary: self.data.info['summary'].slice(0, 100) + "..."
          }); 
        }
        else
          self.setData({
            summary: self.data.info['summary']
          }); 
          
          //保存tag到缓存，作为推荐阅读来源
          self.addliketag(self.data.tag);

      },
      fail: function ({errMsg}){
        console.log('request fail', errMsg)

      }
    })


    //获得书籍的状态信息 
    wx.request({
      url: config.bookStatusByIsbnUrl+self.data.isbn,
      method: 'GET',
      data: {

      },
      success: function (result) {
       //console.log('book statu: '); console.log(result);
        self.setData({
          status:result.data.data
        });
        //console.log('book status: ');console.log(self.data.status);
        self.setData({
          loading: true
        });
      },

      fail: function ({errMsg}) {
        console.log('request fail', errMsg)

      }
     });

  },

  //扫描书籍二维码
  scanning: function () {
   scan.scanning();
  },

    //预约书籍
  appoint:function(event){
    var self = this;
    var appointbooks = wx.getStorageSync('appointbooks')||[];
    
    if (appointbooks.length<3){
      var tmp = new Object();
      tmp.isbn = self.data.isbn;
      tmp.title = self.data.info.title;
      tmp.library = event.target.dataset.library;
      tmp.status = '加载中';
      var alexist = false;
      for(var i=0;i<appointbooks.length;i++)
      {
        if(tmp.isbn==appointbooks[i].isbn&&tmp.library==appointbooks[i].library)
        {
          alexist = true;
          wx.showToast({
            title: '重复预约!!!',
            icon:'loading'
          });
          return;

        }
      }
      appointbooks.push(tmp);
      wx.setStorageSync('appointbooks', appointbooks);
      wx.showToast({
        title: '预约成功！',
        icon:'success'
      })
    }
    else{
      wx.showToast({
        title: '不得预约超过3本书籍！',
        icon: 'loading'
      });
    }

  },

  //保存tag到缓存，作为推荐阅读来源
  addliketag:function(tagtmp){
    var self = this;
    var liketags = wx.getStorageSync('liketags');

    //尚无tag缓存
    if (!liketags) {
      liketags = new Array(1);
      liketags[0] = tagtmp;
    }
    //存在tag缓存
    else {
        var len = liketags.length;
        //如果tag 已经存在，直接返回不做处理
        for (var i = 0; i < len; i++) {
          if (tagtmp == liketags[i]) {
            return;
          }
        }

        //缓存的tag数量不足3个
        if (len < 3) {
          liketags = liketags.concat(tagtmp);
        }
        //缓存达到3个
        else {
          liketags.shift();//先进先出，队列方式
          liketags.push(tagtmp);
        }
      }
      wx.setStorageSync('liketags', liketags);
      console.log('标签缓存：')
      console.log(wx.getStorageSync('liketags'));
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
