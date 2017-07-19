var scan = {
  //扫描书籍二维码
  scanning: function () {
    var self = this;
    //console.log(1)
    wx.scanCode({
      fail:function(res3){
        console.log('fail')
      },
      success: function (res1) {
        //二维码内容
        var bookinfo = JSON.parse(res1.result);
        var author = bookinfo.author[0];
        if(bookinfo.author.length>0)
          author +='等';
        var s = '书名：' + bookinfo.title + '\r\n' + '作者: ' + author;//开发者工具不会换行，手机上会。
        //弹出窗口 确认加入借阅车 
        wx.showModal({
          title: '加入借阅车',
          content: s,
          success: function (res2) {
            if (res2.confirm) {
              //将 bookinfo对象 加入借阅车;借阅车存储在缓存中
                self.addbooktocar(bookinfo);
            }
          }
        })
      }
    })

  },

  addbooktocar: function (bookinfo) {
    //console.log(bookinfo)
    var self = this;
    var borrowcar = wx.getStorageSync('borrowcar');
    if (!borrowcar) {
      borrowcar = new Array(1);
      borrowcar[0] = bookinfo;
      wx.setStorageSync('borrowcar', borrowcar);
    }
    else {
      var len = borrowcar.length;
      if (len >= 5) {
        //提示借阅车已满5本
        wx.showToast({
          title: '借阅车已满5本',
          icon:'loading'
        })
      }
      else {
        //判断是否重复加入书籍
        for (var i = 0; i < len; i++) {
          if (bookinfo._id == borrowcar[i]._id) {
            wx.showToast({
              title: '该书已经加入借阅车了!',
              icon:'loading'
            })
            return;
          }
        }
        borrowcar = borrowcar.concat(bookinfo);
        wx.setStorageSync('borrowcar', borrowcar);
      }
    }
  }
 
}

module.exports = scan