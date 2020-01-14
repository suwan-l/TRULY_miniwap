// pages/SkinTest2/SkinTest2.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    answer1: 0,//第一题答案
    answer2: 0, //第二题答案
    answer3: 0, //第三题答案
    answer4: 0, //第四题答案

    total3: 0,//答案总和

    pigmented: "P",//色素沉着性皮肤
    npigmented: "N",//非色素沉着性皮肤
    type3: "",//第三题类型
  },
  //选择题第一题
  ans_btn1: function (e) {
    this.setData({
      answer1: e.target.dataset.idx1,
    });
    this.count_price();//调用计算分数总和
  },

  //选择题第二题
  ans_btn2: function (e) {
    this.setData({
      answer2: e.target.dataset.idx2,
    });
    this.count_price();//调用计算分数总和
  },

  //选择题第三题
  ans_btn3: function (e) {
    this.setData({
      answer3: e.target.dataset.idx3,
    });
    this.count_price();//调用计算分数总和
  },

  //选择题第四题
  ans_btn4: function (e) {
    this.setData({
      answer4: e.target.dataset.idx4
    });
    this.count_price();//调用计算分数总和
  },

  //计算分数总和
  count_price: function () {
    var score1 = Number(this.data.answer1);
    var score2 = Number(this.data.answer2);
    var score3 = Number(this.data.answer3);
    var score4 = Number(this.data.answer4);
    var total_num = score1 + score2 + score3 + score4;
    var type3 = "";
    if (total_num >= 21) {
      this.setData({
        type3: this.data.pigmented
      })
    }
    else {
      this.setData({
        type3: this.data.npigmented
      })
    }
    console.log("第三题+++++", total_num);
    this.setData({
      total3: total_num,
      type3: this.data.type3
    })
  },

  //上一页 跳转到第二题
  prve: function (e) {
    wx.redirectTo({
      url: "../SkinTest2/SkinTest2"
    })
  },

  //下一页 跳转到第四题
  next: function (e) {
    if (this.data.answer1 == 0 || this.data.answer2 == 0 || this.data.answer3 == 0 || this.data.answer4 == 0) {
      wx.showToast({ //显示消息提示框  此处是提升用户体验的作用
        title: '请先回答问题',
        icon: 'loading',
        mask: true,
        duration: 500,
      });
    } else {
      wx.redirectTo({
        url: "../SkinTest4/SkinTest4?scene=" + this.data.scene
      })
      //本地存储第三步答案总和
      wx.setStorage({
        key: 'TestTotal3',
        data: {
          total3: this.data.total3,
          type3: this.data.type3
        }
      })
    }
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
    //取第二步的答案总和
    wx.getStorage({
      key: 'TestTotal2',
      success: function (res) {
        console.log(res.data)
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