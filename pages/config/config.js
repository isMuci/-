// pages/config/config.js
let app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		configs:wx.getStorageSync('configs'),
		reState:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let me = this
		let configs = me.data.configs
		wx.setStorageSync('configs', configs)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	switchChange(e){
		console.log(e)
		let me = this
		var id = e.currentTarget.id
		var configs = me.data.configs
		var config = configs[id]
		if(!config){
			config = new Object();
			configs[id] = config;
		}
		config.state = e.detail.value
		me.setData({configs:configs,reState:false})
		wx.setStorageSync('configs', configs)
	},
	sliderChange(e){
		let me = this
		var id = e.currentTarget.id
		var configs = me.data.configs
		var config = configs[id]
		if(!config){
			config = new Object();
			configs[id] = config;
		}
		config.time = e.detail.value
		if(id == 0){
			config.desc = "（一）正方一辩进行开篇陈词，时间为 " + e.detail.value +" 秒。\n（二）反方一辩进行开篇陈词，时间为  "+ e.detail.value +" 秒。";
		}else if(id == 1){
			config.desc = "（一）反方二辩驳对方立论，时间为 " + e.detail.value +" 秒。\n（二）正方二辩驳对方立论，时间为 " + e.detail.value +" 秒。";
		}else if(id == 2){
			config.desc = "（一）正方三辩提问反方一、二、四辩各一个问题，反方辩手回答，三个问题累计回答时间为 " + e.detail.value +" 秒。\n（二）反方三辩提问反方一、二、四辩各一个问题，正方辩手回答，三个问题累计回答时间为 " + e.detail.value +" 秒。";
		}else if(id == 3){
			config.desc = "自由辩论阶段采取反方先发言的规则。反方累计用时 " + e.detail.value +" 秒，正方累计用时4分钟。自由辩论必须交替进行，当自由辩论开始时，先由反方任何一名队员起立发言。完毕后，正方的任何一位队员应立即发言，双方依次轮流发言，直到双方时间用完为止。";
		}else if(id == 4){
			config.desc = "（一）反方四辩总结陈词，时间为 " + e.detail.value +" 秒。\n（二）正方四辩总结陈词，时间为 " + e.detail.value +" 秒。";
		}
		me.setData({configs:configs,reState:false})
		wx.setStorageSync('configs', me.data.configs)
	},
	radioChange(e){
		let me = this
		var id = e.currentTarget.id
		var configs = me.data.configs
		var config = configs[id]
		if(!config){
			config = new Object();
			configs[id] = config;
		}
		config.voice = e.detail.value
		me.setData({configs:configs,reState:false})
		wx.setStorageSync('configs', configs)
	},
	recover(){
		let me = this
		let configs = app.globalData.configs
		me.setData({
			configs:configs
		})
		wx.setStorageSync('configs', configs)
	}
})