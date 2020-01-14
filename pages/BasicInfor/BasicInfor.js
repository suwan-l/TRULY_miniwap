var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: "", //性别id
    array: ['男', '女'], //性别

    area: [], //地区
    isChecked: false,

    province: '', //当前省份
    city: '', //当前城市
    scene: "", //分享用户scene
    isShow1: false,
    isShow2: false,
  },

  //性别
  bindPickerChange: function(e) {
    var sex = Number(e.detail.value) + 1
    this.setData({
      index: e.detail.value,
      sex: sex
    })
  },
  //日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //城市
  bindRegionChange: function(e) {
    var province = e.detail.value[0];
    var city = e.detail.value[1];
    this.setData({
      area: e.detail.value,
      province: province,
      city: city,
      isChecked: true
    })
  },

  //判读不能为空
  formSubmit: function(e) {
    var openid = wx.getStorageSync('openid');
    var that = this;
    //提交个人信息
    wx.request({
      url: "https://platform.itruly.cn/api/Newskintest/info",
      data: {
        openid: openid,
        gender: this.data.sex, //	性别（1男，2女，3未知）
        birthday: e.detail.value.date, //出生日期
        province: this.data.province, //	省
        city: this.data.city, //	市
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.code == 2) {
          that.setData({
            isShow2: true,
            isShow1: false,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
    })

    //本地储存性别、生日、省、市
    wx.setStorage({
      key: 'BasicInfor',
      data: {
        sex: this.data.sex,
        date: this.data.date,
        province: this.data.province,
        city: this.data.city,
        openid: openid
      }
    })
    // }   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var scene = options.scene
    this.setData({
      scene: scene
    });
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        var that = this;
        //获取凭证
        var code = res.code;
        if (code) {
          wx.setStorageSync('code', code)
          //发送凭证
          wx.request({
            url: "https://platform.itruly.cn/api/Newskintest/code",
            data: {
              js_code: code,
            },
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              var openid = JSON.parse(res.data.data).openid;
              console.log("basicinfor.js获取到的openid为：", openid);

              //判断是否是新用户
              wx.request({
                url: "https://platform.itruly.cn/api/Newskintest/check",
                data: {
                  openid: openid,
                },
                method: 'POST',
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                  console.log("判断是否是新用户", res)
                  if (res.data.code == 3) { 
                    if (res.data.status == 1 && res.data.unionid != ""){
                      wx.redirectTo({
                        //url: "../SkinReport/SkinReport?result_id=" + res.data.result_id + "&&" + "unionid=" + res.data.unionid,
                        url: "../SkinReport/SkinReport?result_id=" + res.data.result_id,
                      }); 
                    }
                    else if (res.data.status == 1 && res.data.unionid == ""){
                      wx.redirectTo({
                        url: "../Register/Register"
                      });   
                    }
                    else{
                      that.setData({
                        isShow2: true,
                      })
                    }       
                  } 
                  else{
                    that.setData({
                      isShow1: true,
                    })
                    wx.showToast({
                      title: res.data.msg,
                    })
                  }
                },
              })
              wx.setStorageSync('openid', openid)
            },
          })
        } else {
      
        }
      }
    });

    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {//如果有新版本

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          })

        })

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });
  },

  //点击测试按钮
  test_btn: function(e) {
    var that = this;
    wx.redirectTo({
      url: "../SkinTest1/SkinTest1?scene=" + that.data.scene
    });
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
  }
})