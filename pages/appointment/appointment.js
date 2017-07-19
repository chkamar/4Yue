// appointment.js

var config = require("../../config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    appointbooks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      appointbooks: wx.getStorageSync('appointbooks')||[]
    });
    if(self.data.appointbooks.length==0)
      return;
   //通过isbn获得预约书籍的状态
    self.getbookstatus(self.data.appointbooks.length-1);
   
  },

  getbookstatus:function(i){
    var self = this;
    if(i<0)
      {
        self.setData(
          {
            appointbooks:self.data.appointbooks,
            loading:true
          }
        );
        // console.log(self.data.appointbooks)
        return;
      }
    //获得书籍的状态信息 
    var booktmp = self.data.appointbooks[i];
    wx.request({
      url: config.bookStatusByIsbnUrl + booktmp.isbn,
      method: 'GET',
      success: function (result) {
        // console.log(result.data.data)
        var resbooks  =result.data.data;
        var j = 0;
        for(;j<resbooks.length;j++)
        {
          if(booktmp.library==resbooks[j].lib_local&&resbooks[j].bookstatus==200)
          {
            self.data.appointbooks[i].status = '有书';
            break;
          }
        }
        if(j==resbooks.length)
          self.data.appointbooks[i].status = '借出';

        self.getbookstatus(--i);
      },

      fail: function ({errMsg}) {
        console.log('request fail', errMsg)

      }
    });
    

  },

  cancleappoint:function(event){
    var self = this;
   
    var delbook = event.target.dataset.delbook;
    var len = self.data.appointbooks.length;

    var index = -1;
    for (var i = 0; i < len; i++) {
      if (delbook == self.data.appointbooks[i]) {
        index = i;
        break;
      }
    }

    for (var j = index; j < len - 1; j++) {
      self.data.appointbooks[j] = self.data.appointbooks[j + 1];
    }

    //update appointbooks and storage
    if (len - 1 == 0) {
      self.setData({
        appointbooks: [],
        loading:false
      });
      wx.removeStorageSync('appointbooks');
    }
    else {
      self.setData({
        appointbooks: self.data.appointbooks.slice(0, len - 1)
      });
      wx.setStorageSync("appointbooks", self.data.appointbooks);
    }


  },
  
  /*
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
