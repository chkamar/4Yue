// search.js
var config = require('../../config');
var scan = require('../../utils/scan');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:false,
    loading:false,
    title:'',
    likebooks:[],
    searchhst:[]
  },

  getfocus:function(e){
    //console.log('focus')
    this.setData({
      focus:true,
      searchhst: wx.getStorageSync('searchhst')
    });
    
  },
  lostfocus:function(e){
    //console.log('lost focus')
    this.setData({
      focus: false
    });
  },
  inputValue:function(e){
    //console.log(e)
      this.setData({
        title:e.detail.value
      });
   
  },

  gohist:function(event){
    this.setData({
      title:event.target.dataset.title
    });
    this.searchBook();
  },

  delallhist:function(){
    wx.removeStorageSync('searchhst');
  },

  searchBook:function(){
    var self = this;
    
    if(self.data.title=='')
      return;
    // console.log('title:')
    // console.log(self.data.title)
    wx.navigateTo({
      url: '../category/category?key=title&title='+self.data.title
    });
    //保存到搜索历史缓存
    self.addseachhst(self.data.title);

  },
  //保存到搜索历史缓存
  addseachhst: function (titletmp) {
    var self = this;
    var searchhst = wx.getStorageSync('searchhst');

    //尚无搜索历史缓存
    if (!searchhst) {
      searchhst = new Array(1);
      searchhst[0] = titletmp;
    }
    //存在搜索历史缓存
    else {
      var len = searchhst.length;
      //如果title 已经存在，直接返回不做处理
      for (var i = 0; i < len; i++) {
        if (titletmp == searchhst[i]) {
          return;
        }
      }

      //缓存的title数量不足8个
      if (len < 8) {
        searchhst = searchhst.concat(titletmp);
      }
      //缓存达到8个
      else {
        searchhst.shift();//先进先出，队列方式
        searchhst.push(titletmp);
      }
    }
    wx.setStorageSync('searchhst', searchhst);
    console.log('搜索历史缓存：')
    console.log(wx.getStorageSync('searchhst'));
  },

//扫描书籍二维码
  scanning:function(){
    scan.scanning();
  },

  skip: function (event) {
    wx.navigateTo({
      url: event.target.dataset.url,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    if(!self.data.loading)
    {
      //获得缓存中的数据：用户最近点击过的书籍。
      var tagarr = wx.getStorageSync('liketags');
      self.getlikebooksoftags(tagarr, tagarr.length - 1);
      // var srcharr = wx.getStorageSync('searchhst');
      // self.getlikebooksofsrchtitles(srcharr, srcharr.length - 1);
      
    }

  },

  getlikebooksoftags:function(tagarr,i){
    var self = this;
    var reqUrl = config.tagUrl + '/' + encodeURI(tagarr[i]);
    wx.request({
      url: reqUrl,
      method: 'GET',
      success: function (res) {
        
        var booksResult = res.data.data;
        var len1 = booksResult.length;
        for(var index1=0;index1<len1;index1++)
        {
          var len2 = self.data.likebooks.length;
          var index2 =0 ;
          for(;index2<len2;index2++)
          {
            if(booksResult[index1].isbn==self.data.likebooks[index2].isbn)
            {
              break;
            }
          }
          if(index2==len2)
          {
            self.data.likebooks.push(booksResult[index1]);
          }
         // console.log(len2)
          if(len2>=10)//最多推荐10本书籍
            break;
        }
        self.setData({
          likebooks: self.data.likebooks
        });
        //console.log(self.data.likebooks.length)
        
        if (i > 0 && self.data.likebooks.length<10)
          self.getlikebooksoftags(tagarr,--i);
        
         // console.log('liketagsbooks:');
         // console.log(self.data.likebooksoftag);
          // self.setData({
          //   likebooks: self.data.likebooksofsearchhst.concat(self.data.likebooksoftag)
          // });
          if (i==0&&self.data.likebooks.length > 0)
            self.setData({
              loading: true
            });
        //  console.log('likebooks:')
        //  console.log(self.data.likebooks)
      }})
        
  },

  // getlikebooksofsrchtitles:function(tlearr,j){
  //   //按书名搜索
  //   var self = this;
  //   wx.request({
  //     url: config.searchBookByTitleUrl + encodeURI(tlearr[j]),
  //     success: function (res) {
  //       //console.log(res.data);
  //       var booksTemp = new Array(4);
  //       var booksResult = res.data.data;
  //       booksTemp = booksResult.slice(0, 4);
  //       self.setData({
  //         likebooksofsearchhst: self.data.likebooksofsearchhst.concat(booksTemp)
  //       });
        
  //       if (j > 0 && self.data.likebooksofsearchhst.length < 5)
  //         self.getlikebooksofsrchtitles(tlearr, --j);
        
  //       //console.log('likebooksofsearchhst:');
  //       //console.log(self.data.likebooksofsearchhst);
  //       var tagarr = wx.getStorageSync('liketags');
  //       self.getlikebooksoftags(tagarr, tagarr.length - 1);
  //     }
  //   })
  
  // },
//下拉刷新无效
  // onPullDownRefresh:function(){
  //   console.log('refresh');
  //   wx.showNavigationBarLoading();
  //   wx.stopPullDownRefresh();
  // },

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