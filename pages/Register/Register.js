var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    result_id: '',

    hasUserInfo: false, //提示获取头像和名称语
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    phone: '', //手机号
    code: '', //验证码
    codename: '获取验证码',
    avavatarUrl: "", //微信头像
    nickName: "", //微信名
    openid:"",//获取到的openid
    unionId: "",//获取用户的unionId
    scene: "",//分享用户scene
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      result_id: options.result_id,
      scene: options.scene
    })
  },
 
  //点击自动授权获取个人信息
  getUserInfo: function(e) {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res_user) {
              console.log("111", res_user)
              wx.request({
                //后台接口地址
                url: 'https://platform.itruly.cn/api/Newskintest/auth',
                data: {
                  code: res.code,
                  rawData: res_user.rawData,
                  encryptedData: res_user.encryptedData,
                  iv: res_user.iv,
                  signature: res_user.signature
                },
                method: 'POST',
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  var openid = res.data.data.openId
                  that.setData({
                    nickName: res.data.data.nickName,
                    avatarUrl: res.data.data.avatarUrl,
                    openid: openid,
                    unionId: res.data.data.unionId,
                    hasUserInfo:true     
                  })
                  wx.setStorageSync('获取个人信息接口nickName', that.data.nickName);
                  wx.setStorageSync('获取个人信息接口avatarUrl', that.data.avatarUrl);
                  wx.setStorageSync('获取个人信息接口unionId', that.data.unionId); 
                }
              })
            }, 
            fail: function () {
              //用户按了拒绝按钮
              wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法获取到测肤报告，请授权之后再获取!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                  // 用户没有授权成功，不需要改变 isHide 的值
                  if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                  }
                }
              });
            }, 
            complete: function (res) {
            }
          })
        }
      }
    })  
  },

  //输入手机号
  getPhoneValue: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //输入验证码
  getCodeValue: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取验证码
  getCode: function() {
    var phone = this.data.phone;
    var that = this;
    var myreg = /^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|1|2|3|5|6|7|8]|18[0-9]|19[8|9])\d{8}$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        url: "https://platform.itruly.cn/api/Newskintest/sendCode",
        data: {
          mobile: this.data.phone,
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          var num = 60;
          var timer = setInterval(function() {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              that.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              that.setData({
                codename: num + "s",
                disabled: true
              })
            }
          }, 1000)
        }
      })
    }
  },
  //获取验证码
  getVerificationCode() {
    this.getCode();
  },
  //提交表单信息
  register: function(res) {
    var that = this;
    var myreg = /^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|1|2|3|5|6|7|8]|18[0-9]|19[8|9])\d{8}$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } 
    
    else {
      wx.request({
        url: "https://platform.itruly.cn/api/Newskintest/reg",
        data: {
          scene: that.data.scene,//分享用户
          phoneNumber: this.data.phone, //手机号码
          code: this.data.code, //	验证码
          u_unionid: this.data.unionId, //被分享用户
          name: this.data.nickName, //用户昵称
          avatarUrl: this.data.avatarUrl, //头像
          openid: this.data.openid,
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          wx.setStorageSync('openid', that.data.openid);
          if (res.data.code === 4) {
            wx.redirectTo({
              url: "../SkinReport/SkinReport?result_id=" + that.data.result_id,  
            })
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }
          wx.setStorageSync('unionId', that.data.unionId);
        }
      })
    }
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
  onShareAppMessage: function () {
    return {
      title: '一键点击，免费进行专业肌肤测试！',
      imageUrl: 'https://evathumber.vinistyle.cn/upload/201912/20191211173344879.jpg',
    }
  }
})