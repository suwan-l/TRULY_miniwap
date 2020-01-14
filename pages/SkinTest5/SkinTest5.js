// pages/SkinTest2/SkinTest2.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    answer1: "",//附加题第一题答案
    answer2: "", //附加题第二题答案

    tips1: "痘痘护理",//痘痘粉刺
    tips2: "敏感护理",//敏感炎症
    tips3: "清洁提示",//清洁提示

    type5_1: "",// 痘痘类型
    type5_2:"",// 敏感类型
  },
  //选择题第一题
  ans_btn1: function (e) {
    this.setData({
      answer1: e.target.dataset.idx1,
    });

    //判断敏感问题
    var type5_2 = "" //敏感类型
    if (this.data.answer1 == "B" || this.data.answer1 == "C" || this.data.answer1 == "D") {
      this.setData({
        type5_2: this.data.tips2
      })
    } 
  },

  //选择题第二题
  ans_btn2: function (e) {  
    this.setData({
      answer2: e.target.dataset.idx2,
    });

    //判断痘痘问题
    var type5_1 = "" //痘痘类型
    if(this.data.answer2 == "B"){
      this.setData({
        type5_1: this.data.tips3
      })
    }
    else if (this.data.answer2 == "C" || this.data.answer2 == "D"){
      this.setData({
        type5_1: this.data.tips1
      })
    }
  },

  //上一页 跳转到第四题
  prve: function (e) {
    wx.redirectTo({
      url: "../SkinTest4/SkinTest4"
    })
  },

  //下一页 跳转到拍照测肤页
  next: function (e) {
    wx.redirectTo({
      url: "../Picture/Picture?scene=" + this.data.scene
    })
    wx.setStorage({
      key: 'TestTotal5',
      data: {
        type5_1: this.data.type5_1,
        type5_2: this.data.type5_2,
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var scene = options.scene;
    that.setData({
      scene: scene
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
    var that = this;
    //取第四步的答案总和
    wx.getStorage({
      key: 'TestTotal4',
      success: function (res) {
        that.setData({
          total4: res.data.total4,
          type4: res.data.type4,
          typelist:res.data.typelist,
        })
      }
    })
    //取第三步的答案总和
    wx.getStorage({
      key: 'TestTotal3',
      success: function (res) {
        that.setData({
          total3: res.data.total3,
          type3: res.data.type3
        })
      }
    })
    //取第二步的答案总和
    wx.getStorage({
      key: 'TestTotal2',
      success: function (res) {
        that.setData({
          total2: res.data.total2,
          type2: res.data.type2
        })
      }
    })
    //取第一步的答案总和
    wx.getStorage({
      key: 'TestTotal1',
      success: function (res) {
        that.setData({
          total1: res.data.total1,
          type1: res.data.type1
        })
      }
    })
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
    return {
      title: '一键点击，免费进行专业肌肤测试！',
      imageUrl: 'https://evathumber.vinistyle.cn/upload/201912/20191211173344879.jpg',
    }
  }
})