Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],//关注列表
    isShow: false,
    
    number:"", //测试人数
    today_number:"", //新增人数
    name: "",//昵称
    avatarUrl: "",//头像
    unionId: "",//unionId

    winWidth: 0,
    winHeight: 0,
    currentTab: 0, // tab切换
  },

  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    //点击的关注类型
    var tab_num = Number(that.data.currentTab);
    var tab = tab_num+1;

    console.log("tabtabtab+++",tab)
    wx.showLoading({
      title: '数据加载中~',
    });
    that.setData({
      isShow: false
    });
    //请求接口数据
    wx.request({
      url: "https://platform.itruly.cn/api/Newskintest/homepage",
      data: {
        unionid: 'oI2Z85WXdBy9PsogtPrVvhvQPVPk',//unionid 
        // unionid: that.data.unionId,//unionid
        page: 1,//页数
        tab: tab,//切换标签
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log("代理商列表", res)
        var data = res.data.data;
        if(res.data.code == 2){
          that.setData({
            items: data,
            isShow: true
          });
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }       
      },
    }) 
  },

  // 点击收藏和取消收藏
  onCollectionTap: function (event) {
    var that = this;
    // 获取当前点击下标     
    var index = event.currentTarget.dataset.index;
    var openid = event.currentTarget.dataset.openid;
    console.log("点击收藏的下标", index)
    console.log("点击收藏的openid", openid)
    // data中获取列表   
    var list = this.data.items;
    var status = false
    if (list[index].status == 0) {
      status = true
      list[index].status = parseInt(list[index].status) + 1
    } else {
      status = false
      list[index].status = parseInt(list[index].status) - 1
    };
    wx.showToast({
      title: status ? '收藏成功' : '取消收藏',
    })
    //渲染数据
    this.setData({
      items: list,
    })
    
    //请求收藏接口
    wx.request({
      url: "https://platform.itruly.cn/api/Newskintest/collect",
      data: {
        unionid: 'oxCK81ZLP5YbWPtIlYd1oArPVLgU',
        // unionid: '',
        openid: openid,
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("收藏列表", res)
        var list=that.data.items;
        console.log("list", list)
        if (res.data.code == "3" || res.data.code == "4"){
          that.setData({
            items: list,   
          })
        }
        else{
          wx.showLoading({
            title: res.data.msg,
          })
        } 
      },
    })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    var unionId = wx.getStorageSync('unionId');
    that.setData({
      unionId: unionId,
    })
    console.log("代理商unionId", that.data.unionId);
    wx.showLoading({
      title: '数据加载中~',
    });
    that.setData({
      isShow: false
    });
    //请求接口数据
    wx.request({
      url: "https://platform.itruly.cn/api/Newskintest/homepage",
      data: {
        unionid: 'oI2Z85WXdBy9PsogtPrVvhvQPVPk',//unionid 
        // unionid: that.data.unionId,//unionid
        tab: 1,//切换标签
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("代理商列表初始", res)
        var data = res.data.data;
        var number = res.data.number;//测试人数
        var today_number = res.data.today_number; //新增人数
        var avatarUrl = res.data.avatarUrl; //头像
        var name = res.data.name; //昵称
        setTimeout(function () {
          wx.hideLoading();
          that.setData({
            items: data,
            number: number,
            today_number: today_number,
            name: name,
            avatarUrl: avatarUrl,
            isShow: true
          });
        }, 1000)
      },
    })

    /*获取系统信息*/
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  // 截获竖向滑动
  catchTouchMove: function (res) {
    return false
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '一键点击，免费进行专业肌肤测试！',
      imageUrl: 'https://evathumber.vinistyle.cn/upload/201912/20191211173344879.jpg',
    }
  },
})