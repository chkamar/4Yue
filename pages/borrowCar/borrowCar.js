// borrowCar.js
var app = getApp();
var config = require("../../config");
var QR = require("../../utils/qrcode");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booksincar:null,
    loading:false,

    maskHidden: true,
    imagePath: '',
    placeholder: '',//默认二维码生成文本
    loadingcode:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //console.log(wx.getStorageSync('borrowcar'))
   // console.log('test JSON:')
   
    
    //开发工具扫码失败，以下模拟存在借阅车
    // if (!wx.getStorageSync('borrowcar') ){
    //   var jiade = new Array(5);
    //   for(var i=0;i<5;i++)
    //   {var temp = new String('{"_id": "5936aaf30f74de4dda8bd04c","title": "推荐系统实践","author": ["项亮","chdfffff","hfffdsdang"]}') 
    //     // jiade[i+1] = JSON.parse('{"test":"test"}');     
    //     jiade[i] = JSON.parse
    //     (
    //       // new String('{"_id": "5936aaf30f74de4dda8bd04c","title": "推荐系统实践","author": ["项亮"]}')
    //       temp
    //     )
    //   }
    //   wx.setStorageSync("borrowcar", jiade);
    // }
      var getcar = wx.getStorageSync('borrowcar'); 
      if(!getcar)
        getcar = null;
    //console.log(getcar)
      self.setData({
        booksincar: getcar,
        loading:true
      });
    
    // console.log('car :')
    // console.log(self.data.booksincar);


  },

  deletebook:function(event){
    var self = this;
    //console.log(self.data.booksincar);
    var delbook = event.target.dataset.delbook;
    var len = self.data.booksincar.length;
    
    var index = -1;
    for(var i=0;i<len;i++)
    {
      if(delbook==self.data.booksincar[i])
      {
        index = i;
        break;
      }
    }

    for(var j=index;j<len-1;j++)
    {
      self.data.booksincar[j] = self.data.booksincar[j+1];
    }
    
    //update booksincar and storage
    if(len-1==0){
      self.setData({
        booksincar: null
      });
      wx.removeStorageSync('borrowcar');
    }
    else{
      self.setData({
        booksincar:self.data.booksincar.slice(0,len-1)
      });
      wx.setStorageSync("borrowcar", self.data.booksincar);
    }
    
  },
  //borrow books
  submitcar:function(){
    var self = this;
    //1,取用户id
    var userid = app.data.id;
    //console.log('userid:')
   // console.log(userid);
    //2,取借阅车中书籍的_id，构成数组。
    var len = self.data.booksincar.length;
    var idArr = new Array(len);
    for(var i=0;i<len;i++)
    {
      idArr[i] = self.data.booksincar[i]._id;
    }
    //3，获得当前日期 yyyy-mm-dd
    var date = new Date();

    var yyyy = date.getFullYear();
    var mm = date.getMonth()+1;
    var dd = date.getDate();

    var borrdate = new String(yyyy+'-'+mm+'-'+dd);
    
    //console.log(borrdate);
    //发起借阅请求
    wx.request({
      url: config.borrowBooksUrl,
      method: 'POST',
      data:{
        'userid':userid,
        'booklist':idArr,
        'borrowdate':borrdate
      }
      ,
      success:function(res){
        console.log(res);
        if(res.data.code==0){

          //0,展示提示信息
          wx.showToast({
            title: res.data.msg
          });

          //1,清空借阅车及缓存
          self.setData({
            booksincar:null
          });
          //wx.setStorageSync('borrowcar', null);
          wx.removeStorageSync('borrowcar');

          //2，生成二维码，给管理员扫，以便管理员确认同意借阅。
          self.formSubmit();

        }
      },
      fail:function(errSmg){
        console.log('borrow failed!');
      }
    })
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log("********" + tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  formSubmit: function () {
    var that = this;
    var userid = app.data.id;
    // var obj = new Object({ "userid": userid });
    // console.log(obj.userid)
    // var url = obj.toString();
    var url = '{' + '"userid"'+':'+userid+'}';
    console.log(url)
    that.setData({
      maskHidden: false,
      loadingcode:true
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 2000)

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