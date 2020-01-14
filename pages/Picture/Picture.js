import WeCropper from '../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio
const height = device.windowHeight - 70
const fs = width / 750 * 2

Page({
  data: {
    isShow: true,
    picShow:false,
    prossShow:false,
    tempFilePaths: '',//确定裁剪后的图片
    typelist: "", //基本肌肤类型
    type5_1: "", //痘痘类型
    type5_2: "", //敏感问题

    photo_name: "",//返回的图片
    result_id: "",//返回的肤质报告


    cropperOpt: {
      id: 'cropper',
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 250) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: (height * 0.5 - 250 * 0.5), // 裁剪框y轴期起点
        width: 250, // 裁剪框宽度
        height: 250// 裁剪框高度
      }
    },
  },

  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },

  //上传照片
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        self.setData({
          tempFilePaths: tempFilePaths,
          isShow: false,
          picShow:true, 
        });

        self.wecropper.pushOrign(tempFilePaths);
      }
    })
  },

  getCropperImage() {
    let that = this;
    var openid = wx.getStorageSync('openid');
    wx.showToast({
      title: '上传中',
      icon: 'loading',
      duration: 20000
    })
    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    this.wecropper.getCropperImage((tempFilePaths) => {
      if (tempFilePaths) {
        that.setData({
          tempFilePaths: tempFilePaths
        })

        //上传图片接口
        wx.uploadFile({
          url: 'https://platform.itruly.cn/api/Newskintest/question', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            openid: openid,
            q1: that.data.typelist,
            q2: that.data.type5_1,
            q3: that.data.type5_2,
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            wx.hideToast();
            var photo_name = JSON.parse(res.data).photo_name
            var result_id = JSON.parse(res.data).result_id
            
            if (JSON.parse(res.data).code === 4) {
              that.setData({
                photo_name: photo_name,
                result_id: result_id,
                isShow: false,
                picShow: false,
                prossShow:true
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: "../Register/Register?result_id=" + that.data.result_id + "&&" + "scene=" + that.data.scene,
                })
              }, 2000)

            } else {
              that.setData({
                photo_name: photo_name,
                result_id: result_id,
                isShow: true,
                picShow: false,
                prossShow: false
              })
              wx.showToast({
                title: JSON.parse(res.data).msg,
              })
            }
          }
        })
      }
      else {

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {

      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })

    //刷新画面
    this.wecropper.updateCanvas()

  },
  onShow: function () {
    var that = this;
    //取第五步的答案
    wx.getStorage({
      key: 'TestTotal5',
      success: function (res) {
        that.setData({
          type5_1: res.data.type5_1,
          type5_2: res.data.type5_2,
        })
      }
    })
    //取第四步的答案总和
    wx.getStorage({
      key: 'TestTotal4',
      success: function (res) {
        that.setData({
          typelist: res.data.typelist,
        })
      }
    })
    //取第一步的基本信息
    wx.getStorage({
      key: 'BasicInfor',
      success: function (res) {
        that.setData({
          sex: res.data.sex,
          date: res.data.date,
          province: res.data.province,
          city: res.data.city
        })
      }
    })
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