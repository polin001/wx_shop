/*
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条事件
  2 判断还有没有下一页数据
    1.获取总页数
      总页数 = Math.ceil(总条数 / 页容量)
            = Math.ceil(23 / 10) = 3
    2.获取当前页码 pagenum
    3.判断当前页码是否大于等于总页数
      表示 没有下一页数据
  3 假如没有下一页数据 弹出提示
  4 假如还有下一页数据 加载下一页数据
    1 当前页码 ++
    2 重新发送请求
    3 数据请求回来 对data数组进行拼接
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面json配置事件
    找到 触发下拉刷新的事件
  2 重置 数据 数组
  3 重置页面 设置为1
  4 重新发送请求
  5 数据请求完毕 关闭下拉
*/

import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList()

    wx.showLoading({
      title: '加载中',
    })
    
    setTimeout(function () {
      wx.hideLoading()
    }, 5000)
    
  },

  // 获取商品列表的数据
  getGoodsList(){
    request({
      url:"/goods/search",
      data:this.QueryParams
    })
    .then(res=>{
      // 获取总条数
      const total = res.total;
      // 获取总页数
      this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
      // console.log(this.totalPages)
      this.setData({
        goodsList:[...this.data.goodsList,...res.goods]
      })

      // 关闭下拉刷新窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
      wx.stopPullDownRefresh();
    })
  },


  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    // console.log(e);
    // 1 获取被点击标题的索引
    const {index} = e.detail;
    // 2 修改源数组
    let {tabs} = this.data;
    tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  
  //页面上滑 滚动条触底事件
  onReachBottom(){
    // console.log("hello")
    if(this.QueryParams.pagenum>=this.totalPages){
      // console.log("没有下一页")
      wx.showToast({title: '没有下一页数据了'})
    }else{
      // console.log("还有下一页")
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh(){
    // console.log("hello")
    // 1 重置数组
    this.setData({
      goodsList:[]
    }),
    // 2 重置页码
    this.QueryParams.pagenum = 1,
    //3 发送请求
    this.getGoodsList()
    
  }
})