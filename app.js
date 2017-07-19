//app.js
var config = require('config');
App({
  data: {
    userInfo: null,
    id: null
  },
  onLaunch: function () {

    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);


    var that = this;
    //用户登录并获得用户信息和code
    wx.login({
      success: function (res) {
        if (res.code) {

          //1,换取id
          that.getId(res.code);

          //2,获得用户信息
          wx.getUserInfo({
            success: function (res) {
              // that.setData({
              //   userInfo:res.userInfo
              // })
              that.data.userInfo = res.userInfo;
              //console.log('userInfo:'+that.data.userInfo)
            }
          });//end of wx.getUserInfo

        }//end of if
        else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }//end of success

    })//end of wx.login


  },

  getId: function (code) {
    var that = this;
    //用code向后台服务器换取用户id
    wx.request({
     // url: 'https://www.seventeam.me/users/weixin',
      url:config.idUrl,
      data: {
        'code': code
      },
      method: 'POST',
      success: function (res) {
        // console.log(res.data.data);
        if (res.data.id)
        // that.setData({
        //   id:res.data.id
        // });
          that.data.id = res.data.id;
        else if (res.data.data._id)
          // that.setData({
          //   id:res.data.data._id
          // });
          that.data.id = res.data.data._id;

        //console.log(that.data.id);
      },
      fail: function (res) {
        console.log('fail');
      }

    })
  },

  


})