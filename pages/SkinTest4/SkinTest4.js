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
    answer5: 0, //第五题答案
    answer6: 0, //第六题答案
    answer7: "", //第七题答案


    total4: 0,//第四步答案总和

    total1: '',//第一步答案总和
    total2: '',//第二步答案总和

    wrinkled: "W",//皱纹性皮肤
    tight: "T",//皱纹性皮肤
    type4:"",//第四题类型
    typelist:"",//前四题答题类型
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

  //选择题第五题
  ans_btn5: function (e) {
    this.setData({
      answer5: e.target.dataset.idx5
    });
    this.count_price();//调用计算分数总和
  },

  //选择题第六题
  ans_btn6: function (e) {
    this.setData({
      answer6: e.target.dataset.idx6
    });
    this.count_price();//调用计算分数总和
  },

  //选择题第七题
  ans_btn7: function (e) {
    this.setData({
      answer7: e.target.dataset.idx7
    });
    this.count_price();//调用计算分数总和
  },

  //计算分数总和
  count_price: function () {
    var score1 = Number(this.data.answer1);
    var score2 = Number(this.data.answer2);
    var score3 = Number(this.data.answer3);
    var score4 = Number(this.data.answer4);
    var score5 = Number(this.data.answer5);
    var score6 = Number(this.data.answer6);
    var score7 = Number(this.data.answer7);

    var total_num = score1 + score2 + score3 + score4 + score5 + score6 + score7;

    var type4 = "";//皮肤类型
    if (total_num >= 25) {
      this.setData({
        type4: this.data.wrinkled
      })
    }
    else {
      this.setData({
        type4: this.data.tight
      })
    }
    console.log("第四题+++++", total_num);
    this.setData({
      total4: total_num,
      type4: this.data.type4
    })  
  },

  //上一页 跳转到第三题
  prve: function (e) {
    wx.redirectTo({
      url: "../SkinTest3/SkinTest3"
    })
  },

  //下一页 跳转到附加题
  next: function (e) {
    if (this.data.answer1 == 0 || this.data.answer2 == 0 || this.data.answer3 == 0 || this.data.answer4 == 0 || this.data.answer5 == 0 || this.data.answer6 == 0 || this.data.answer7 == "") {
      wx.showToast({ //显示消息提示框  此处是提升用户体验的作用
        title: '请先回答问题',
        icon: 'loading',
        mask: true,
        duration: 500,
      });
    } 
    else{
      //判断第一步答案>=21 或者 第二步答案<=19 则跳转到第五步附加题
      if (this.data.total1 >= 21 || this.data.total2 >= 19){
        wx.redirectTo({
          url: "../SkinTest5/SkinTest5?scene=" + this.data.scene
        })
      }
      //否则跳到拍照页
      else{
        wx.redirectTo({
          url: "../Picture/Picture?scene=" + this.data.scene
        })
      }
  
      //本地存储第四步答案总和
      var typelist = this.data.type1 + this.data.type2 + this.data.type3 + this.data.type4; //前四步的皮肤类型
      wx.setStorage({
        key: 'TestTotal4',
        data: {
          total4: this.data.total4,
          type4: this.data.type4,
          typelist: typelist
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