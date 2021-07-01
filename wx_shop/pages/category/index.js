// pages/category/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的菜单数据
    rightContent:[],
    //被点击的左侧的菜单
    currentIndex:0,
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    1 判断本地是否已缓存数据
      {time:Data.now(),data:[...]}
    2 无，发送新请求
    3 有且旧数据无过期，使用本地数据
    */
    // 1 获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if(!Cates){
      //不存在 发送请求数据
      this.getCates();
    }else{
      // 有旧的数据 定义过期时间 过期的旧数据
      if(Date.now()-Cates.time>1000*10){
        this.getCates();
      }else{
        // console.log("可以使用旧数据")
        this.Cates=Cates.data;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
      
  },
  
  //获取分类数据
  getCates(){
    request({
      url:"/categories"
    })
    .then(res=>{
      this.Cates=res;
      
      //存入接口数据到本地中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

      //构造左侧大菜单数据
      let leftMenuList = this.Cates.map(v=>v.cat_name);
 
      //构造右侧商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    })

  },
  //左侧菜单的点击事件
  handleItemTap(e){
    // console.log(e)
    /*
    1.获取被点击的标题身上的索引
    2.给data中的currentIndex赋值
    3.根据不同的索引渲染 
    */
   const { index } = e.currentTarget.dataset;

   let rightContent = this.Cates[index].children;
   this.setData({
    currentIndex:index,
    rightContent,
    //重新设置 右侧内容的scroll-view标签的距离顶部的距离
    scrollTop:0

   })
   

  }
})