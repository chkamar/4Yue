// nowBorrow.js
var config = require('../../config');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getNowBorrowBookByUserid: '',
    loading:false,
    allBooks:[]//_id,borrowdate,returndate,title
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self =this;
    self.setData({
      getNowBorrowBookByUserid:config.nowBorrowBookUrl + app.data.id + '?status=202'
    });
    //console.log(self.data.getNowBorrowBookByUserid);
    wx.request({
      url: self.data.getNowBorrowBookByUserid,
      success:function(res){
       // console.log(res.data.data);
       
        var orders = res.data.data;
        if(orders.length==0)
          return;
        var index = 0;
        for(var i=0;i<orders.length;i++)
        {
          for(var j=0;j<orders[i].booklist.length;j++)
          {
            var booktemp = new Object();
            booktemp._id = orders[i].booklist[j];
            booktemp.title = null;
            
            booktemp.borrowdate = orders[i].borrowdate;
            booktemp.returndate = orders[i].returndate;
            self.data.allBooks[index++] = booktemp;
            //self.data.allBooks[index++] = orders[i].booklist[j];
          }
        }
        self.setData({
          allBooks:self.data.allBooks
          
        });
      //  console.log(self.data.allBooks);
       self.changetotitle(self.data.allBooks.length-1);
      },
      fail:function(res){
        console.log('get borrow books failed!');
      }
    })
  },

  changetotitle:function(i){
    if(i<0)
      return;
    var self = this;
    var booktemp = self.data.allBooks[i];
    console.log(booktemp)
    wx.request({
      url: config.booksinfoBy_idUrl+booktemp._id,
      success:function(res){
        var isbntemp = res.data.isbn;
        // console.log(res.data)
        self.getTitleByIsbn(i,isbntemp);
        
      },
      fail:function(res){
        console.log('get bookinfo by _id failed!');
      }
    })
  },

  getTitleByIsbn:function(i,isbn){
    var self = this;
    if (i < 0) {
      self.setData({
        allBooks: self.data.allBooks,
        loading: true
      });
      return;
      // console.log(self.data.allBooks)
    }
    wx.request({
      url: config.bookInfoByIsbnUrl+isbn,
      success:function(res){
        self.data.allBooks[i].title = res.data.title;
        
        self.changetotitle(--i);
        
      },
      fail:function(res){
        console.log('get title by isbn failed!');
      }
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