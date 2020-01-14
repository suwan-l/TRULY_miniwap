Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function () {
    this.getlist();
  },
  
  getlist: function (res) {
    var that = this;
    //获取测肤历史记录
    var openid = wx.getStorageSync('openid')
    wx.request({
      url: "https://platform.itruly.cn/api/Newskintest/getList",
      data: {
        openid: openid,
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       console.log("测肤历史++111", res.data.data)
        var data = res.data.data;
        that.setData({
          items: data
        });

        if (res.data.code != 2) {
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
    })
  },

  detailList: function (e) {
    var id = e.currentTarget.dataset.id;
    var openid = wx.getStorageSync('openid')
    wx.redirectTo({
      url: "../SkinReport/SkinReport?result_id=" + id + "&&" + "openid=" + openid,
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var openid = wx.getStorageSync('openid')

    this.data.items.splice(e.currentTarget.dataset.index, 1)
    //删除测肤历史
    wx.request({
      url: "https://platform.itruly.cn/api/Newskintest/del",
      data: {
        openid: openid,
        id: id,
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.code == 2) {
          wx.showToast({
            title: res.data.msg,
          })
          this.setData({
            items: this.data.items,
          })
          this.getlist();   
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
    })
  },
  onShareAppMessage: function () {
    return {
      title: '一键点击，免费进行专业肌肤测试！',
      imageUrl: 'https://evathumber.vinistyle.cn/upload/201912/20191211173344879.jpg',
    }
  }
})