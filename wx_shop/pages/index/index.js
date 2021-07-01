// 0 引入 promise发送请求的方法 路径补全（微信小程序）
import { request } from "../../request/index.js";
Page({
  data: {
    //轮播图数据
    swiperList:[],
    //导航栏数据
    catesList:[],
    //楼层数据
    floorList:[]
  },
  //options(Object)
  onLoad: function(options) {
    // 异步请求获取轮播图数据，promise解决回调地狱
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    this.getSwisperList();
    this.getCateList();
    this.getFloorList();
  },

  //获取轮播图数据方法
  getSwisperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
      this.setData({
        swiperList:result
      })
    })
  },

  //获取导航栏数据方法
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{
      this.setData({
        catesList:result
      })
    })
  },

  //获取楼层数据方法
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
      this.setData({
        floorList:result
      })
    })
  }
});
  