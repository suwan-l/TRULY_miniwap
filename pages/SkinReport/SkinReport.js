var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    q1Show:false,//痘痘
    q2Show: false,//敏感
    q3Show: false,//清洁
    isShow:false,//页面初始化隐藏
    //切换
    winHeight: '100%',
    toView: 'productBox',
    nowstatus: 'productBox',
    //生成分享报告
    maskHidden: false,

    path3: "",//分享报告皮肤测试类型图
    path6: "",//转换到本地的小程序码   
    n2:"",//报告类型
    codeImg:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var result_id = that.data.result_id;
    that.setData({
      result_id: options.result_id//跳转带过来的皮肤类型结果 result_id
    })
    console.log("肤质报告result_id", that.data.result_id)
    var openid = wx.getStorageSync('openid')
    wx.showToast({
      title: '加载测肤结果...',
      icon: 'loading',
      duration: 1000
    });

    setTimeout(function () {
      wx.hideToast()
      //肤质报告接口
      wx.request({
        url: "https://platform.itruly.cn/api/Newskintest/skin_report",
        data: {
          result_id: that.data.result_id,
          openid: openid
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log("报告列表", res)
          var pockmark_num = res.data.data.pockmark_num;// 痘疮数量
          var pore_num = res.data.data.pore_num;//毛孔数量
          var spot_num = res.data.data.spot_num;//斑点数量
          var wrinkle_num = res.data.data.wrinkle_num;//皱纹数量
          var photo_name = res.data.data.photo_name
          var avatarUrl = res.data.user.avatarUrl;//头像
          var name = res.data.user.name;//用户名
          var time = res.data.create_time;//最近测试时间
          var n5_img = res.data.n5_img;//问题根源图片
          var n6_img = res.data.n6_img;//护理建议图片
          var n7_img = res.data.n7_img;//其他建议图片
          var n8_img = res.data.n8_img;//适用成分图片
          var n9_img = res.data.n9_img;//推荐产品图片
          var n4 = res.data.result.n4;//肤质类型
          var n5 = res.data.result.n5;//问题根源文案
          var n6 = res.data.result.n6;//护理建议文案
          var n7 = res.data.result.n7;//其他建议文案
          var n8 = res.data.result.n8;//适用成分文案
          var n1 = res.data.result.n1;//类型
          var n11_img = res.data.result.n11_img;//类型图片   
          var n2 = res.data.result.n2;//分享报告需要的类型
          var n10_img = res.data.result.n10_img;//分享报告类型图片
          var unionid = res.data.user.unionid;//分享报告需要的unionid
          var wxqrcode = res.data.wxqrcode;//代理商二维码

          var n11 = res.data.result.n11;
          var newArry = n11.split(",");
          var n11_0 = newArry[0];
          var n11_1 = newArry[1];
          var n11_2 = newArry[2];
          var n11_3 = newArry[3];
          
          that.setData({
            pockmark_num: pockmark_num,// 痘疮数量
            pore_num: pore_num,//毛孔数量
            spot_num: spot_num,//斑点数量
            wrinkle_num: wrinkle_num,//皱纹数量
            photo_name: photo_name,
            avatarUrl: avatarUrl,
            name: name,
            time: time,
            n5_img: n5_img,
            n6_img: n6_img,
            n7_img: n7_img,
            n8_img: n8_img,
            n9_img: n9_img,
            n4: n4,
            n5: n5,
            n6: n6,
            n7: n7,
            n8: n8,
            n1: n1,
            n11_img: n11_img,
            n10_img: n10_img,
            n2: n2,
            unionid: unionid,
            wxqrcode: wxqrcode,
            n11_0:n11_0,
            n11_1:n11_1,
            n11_2:n11_2,
            n11_3:n11_3,
            isShow:true,
          }, () => {
            var query = wx.createSelectorQuery()
            query.select('#tab-con').boundingClientRect(function (res) {
              that.setData({
                tabScrollTop: res.top  //根据实际需求加减值
              })
            }).exec()
            query.select('#commentBox').boundingClientRect(function (res) { //获取护肤方案距离页面顶部高度
              that.setData({
                commentBoxTop: res.top - 20
              })
            }).exec()
            query.select('#infoBox').boundingClientRect(function (res) { //获取产品定制距离页面顶部高度
              that.setData({
                infoBoxTop: res.top - 20
              })
            }).exec()
            query.select('#tipsBox').boundingClientRect(function (res) { //获取特别提醒距离页面顶部高度
              that.setData({
                tipsBoxTop: res.top - 20
              })
            }).exec()
          });

          // canvas类型图
          wx.downloadFile({
            url: that.data.n10_img, //仅为示例，并非真实的资源
            success: function (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                that.setData({
                  path3: res.tempFilePath
                })
              }
            }
          });
          //判断痘痘敏感清洁隐藏显示
          var q2 = res.data.data.q2;//痘痘护理
          var q3 = res.data.data.q3;//敏感护理
          if (q2 == "痘痘护理") {
            that.setData({
              q1Show: true
            })
          }
          else if (q2 == "清洁提示") {
            that.setData({
              q3Show: true
            })
          }
          if (q3 == "敏感护理") {
            that.setData({
              q2Show: true
            })
          }


          // var unionId = wx.getStorageSync('unionId');
          // console.log("unionid", unionId)
          //获取微信小程序码
          wx.request({
            url: "https://platform.itruly.cn/api/Newskintest/share_result",
            data: {
              unionid: that.data.unionid, 
              n2: that.data.n2,
            },
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: res =>{
               //请求接口转换base64为线上图片地址
              wx.request({
                url: "https://platform.itruly.cn/api/Newskintest/base64imgsave",
                data: {
                  base64: res.data.base64_image,
                },
                method: 'POST',
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                success: res => {
                  that.setData({
                    codeImg: res.data.result
                  });
                  wx.downloadFile({
                    url: that.data.codeImg, //仅为示例，并非真实的资源
                    success: res1 => {
                      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                      if (res.statusCode === 200) {
                        that.setData({
                          path6: res1.tempFilePath
                        })
                      }
                    }
                  });
                },
              });
            },
          });
        }
      });
    }, 1000)
  
    //获取屏幕自适应高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight - (res.windowWidth * 90 / 750) + 'px'
        })
      },
    }); 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  //点击切换标签
  toViewClick: function (e) {
    this.setData({
      toView: e.target.dataset.hash,
      nowstatus: e.target.dataset.hash
    })
  },
  //对比当前滑动的距离和每个部分距顶部的高度
  onPageScroll: function(e) {
    var that = this;
    if (e.detail.scrollTop > that.data.tabScrollTop) {
      that.setData({
        tabFixed: true
      })
    } else {
      that.setData({
        tabFixed: false
      })
    };
    if (e.detail.scrollTop <= that.data.commentBoxTop) {
      that.setData({
        nowstatus: 'productBox',
      })
    };
    if (e.detail.scrollTop > that.data.commentBoxTop -280) {
      that.setData({
        nowstatus: 'commentBox',
      })
    };
    if (e.detail.scrollTop > that.data.infoBoxTop -280) {
      that.setData({
        nowstatus: 'infoBox'
      })
    };
    if (e.detail.scrollTop > that.data.tipsBoxTop -280){
      that.setData({
        nowstatus: 'tipsBox'
      })
    }
  },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function() {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#e0f1f0")
    context.fillRect(0, 0, 375, 667)

    //绘制顶部背景图片
    var path1 = "../../images/1.png";
    context.drawImage(path1, 0, 0, 375, 183);

    //绘制顶部类型和查看自己类型提示
    var path2 = "../../images/2.png";
    var type_name1 = that.data.n2;
    context.drawImage(path2, 40, 40, 240, 90);
    context.setFontSize(14);
    context.setFillStyle('#4c4c4c');
    context.setTextAlign('left');
    context.fillText("我是", 65, 75);
    context.stroke();

    context.setFontSize(14);
    context.setFillStyle('#4c4c4c');
    context.setTextAlign('left');
    context.fillText(type_name1, 95, 75);
    context.stroke();

    context.setFontSize(14);
    context.setFillStyle('#4c4c4c');
    context.setTextAlign('left');
    context.fillText("型肌肤", 142, 75);
    context.stroke();  

    context.setFontSize(14);
    context.setFillStyle('#4c4c4c');
    context.setTextAlign('left');
    context.fillText("快来看看你是什么类型吧！", 65, 110);
    context.stroke();

    //绘制类型
    var type = that.data.n1;
    context.setFontSize(18);
    context.setFillStyle('#555555');
    context.setTextAlign('center');
    context.fillText(type, 185, 215);
    context.stroke();
    context.setFontSize(13);
    context.setFillStyle('#555555');
    context.setTextAlign('center');
    context.fillText("型", 240, 215);
    context.stroke();

    //绘制类型图片
    var path3 = that.data.path3;
    console.log(path3, "path333333")
    context.drawImage(path3, 35, 200, 310, 300); // 在刚刚裁剪的园上画图

    //绘制类型标签1
    var tips1 = "../../images/6.png";
    context.drawImage(tips1, 15, 300, 125, 28);
    //绘制类型标签1名称
    var tips1_name = that.data.n11_0;
    context.setFontSize(16);
    context.setFillStyle('#555555');
    context.setTextAlign('center');
    context.fillText(tips1_name, 80, 320, 125, 28);
    context.stroke();
    
    //绘制类型标签2
    var tips2 = "../../images/6.png";
    context.drawImage(tips2, 25, 390, 125, 28);
    //绘制类型标签2名称
    var tips2_name = that.data.n11_1;
    context.setFontSize(16);
    context.setFillStyle('#555555');
    context.setTextAlign('center');
    context.fillText(tips2_name, 90, 410, 125, 28);
    context.stroke();

    //绘制类型标签3
    var tips3 = "../../images/6.png";
    context.drawImage(tips3, 215, 265, 125, 28);
    //绘制类型标签3名称
    var tips3_name = that.data.n11_2;
    context.setFontSize(16);
    context.setFillStyle('#555555');
    context.setTextAlign('center');
    context.fillText(tips3_name, 276, 285, 125, 28);
    context.stroke();

    //绘制类型标签4
    var tips4 = "../../images/6.png";
    context.drawImage(tips3, 240, 370, 125, 28);
    //绘制类型标签4名称
    var tips4_name = that.data.n11_3;
    context.setFontSize(16);
    context.setFillStyle('#555555');
    context.setTextAlign('center');
    context.fillText(tips4_name, 305, 390, 125, 28);
    context.stroke();
    
    //绘制truly提示语
    context.setFontSize(16);
    context.setFillStyle('#2a9f93');
    context.setTextAlign('center');
    context.fillText("搞定一切你想搞定的“肌肤问题”", 200, 480);
    context.stroke();
    context.setFontSize(16);
    context.setFillStyle('#2a9f93');
    context.setTextAlign('center');
    context.fillText("“TRULY”教你做无暇女人", 188, 505);
    context.stroke();

    //绘制二维码区域文字和背景图
    var path5 = "../../images/5.jpg";
    context.drawImage(path5, 17, 520, 340, 120);
    context.setFontSize(16);
    context.setFillStyle('#8c8c8c');
    context.setTextAlign('left');
    context.fillText("扫描二维码，进入小程序，", 40, 575);
    context.stroke();
    context.setFontSize(16);
    context.setFillStyle('#8c8c8c');
    context.setTextAlign('left');
    context.fillText("开启你的", 40, 600);
    context.stroke();
    context.setFontSize(16);
    context.setFillStyle('#4c4c4c');
    context.setTextAlign('left');
    context.fillText("“蜕变之旅”！", 104, 600);
    context.stroke();

    
    //绘制二维码
    var path6 = that.data.path6;
    console.log(path6, "path666666")
    context.drawImage(path6, 250, 540, 85, 85); 

    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function(res) {

        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存，赶紧分享给好闺蜜吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },
          fail: function(res) {
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function(e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '生成报告中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function() {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },

  //点击重新测试
  retest: function(e) {
    wx.redirectTo({
      url: '../SkinTest1/SkinTest1',
    })
  },
  //测肤历史
  history: function(e) {
    wx.redirectTo({
      url: "../TestHistory/TestHistory"
    })
  },

  //适用产品链接
  sycpLink: function (e) {
    if (this.data.n1 == "T01-DSPT"){
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=45&title=干敏色紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T02-DSNT") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=46&title=干敏非紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T03-DSPW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=47&title=干敏色皱',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T04-DSNW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=48&title=干敏非皱',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T05-OSPT") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=49&title=油敏色紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T06-OSNT") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=50&title=油敏非紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T07-OSPW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=51&title=油敏色皱',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T08-OSNW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=52&title=油敏非皱',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T09-ORPT") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=53&title=油耐色紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T10-ORNT") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=59&title=油耐非紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T11-ORPW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=60&title=油耐色皱',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T12-ORNW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=61&title=油耐非皱',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T13-DRPT") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=62&title=干耐色紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T14-DRNT") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=63&title=干耐非紧',
        envVersion: 'release',
      })
    }
    else if (this.data.n1 == "T15-DRPW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=64&title=干耐色皱',
        envVersion: 'release',
      })
    } 
    else if (this.data.n1 == "T16-DRNW") {
      wx.navigateToMiniProgram({
        appId: 'wx164af89403c08804',
        path: '/pages/index/allTypeGoods?id=68&title=干耐非皱',
        envVersion: 'release',
      })
    } 
  },
  //痘痘产品链接
  q1Link: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx164af89403c08804',
      path: '/pages/index/allTypeGoods?id=66&title=痘痘粉刺',
      envVersion: 'release',
    })
  },
  //敏感产品链接
  q2Link: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx164af89403c08804',
      path: '/pages/index/allTypeGoods?id=67&title=敏感炎症',
      envVersion: 'release',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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