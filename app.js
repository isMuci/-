// app.js
App({
	onLaunch() {
		var configs = wx.getStorageSync('config');
		if (!configs) {
			configs = this.globalData.configs
			wx.setStorageSync('configs', configs)
		}
	},
	
	globalData: {
		time:[90,22],
		configs: {
			0: {name: "立论阶段", state: true, time: 60, voice: 15,desc:"（一）正方一辩开篇立论，时间为 60 秒。\n（二）反方一辩开篇立论，时间为 60 秒。"},
			1: {name: "驳立论阶段", state: true, time: 90, voice: 15,desc:"（一）反方二辩驳对方立论，时间为 90 秒。\n（二）正方二辩驳对方立论，时间为 90 秒。"},
			2: {name: "质辩环节", state: true, time: 90, voice: 15,desc:"（一）正方三辩提问反方一、二、四辩各一个问题，反方辩手回答，三个问题累计回答时间为 90 秒。\n（二）反方三辩提问正方一、二、四辩各一个问题，正方辩手分别应答。三个问题累计回答时间为 90 秒。"},
			3: {name: "自由辩论", state: true, time: 240, voice: 15,desc:"（一）自由辩论"},
			4: {name: "总结陈词", state: true, time: 120, voice: 15,desc:"（一）反方四辩总结陈词，时间为 120 秒。\n（二）正方四辩总结陈词，时间为 120 秒。"}
		}
	},
	timer: null,
	// 开始计时  
	startDebate: function () {
		const debateStage = this.globalData.debateStage;
		if (debateStage === 'opening') {
			this.globalData.debateTime = 3 * 60;
			this.debateTimeHandler();
		} else if (debateStage === 'cross-examination') {
			this.globalData.debateTime = 1.5 * 60;
			this.debateTimeHandler();
		} else if (debateStage === 'free debate') {
			this.globalData.debateTime = 4 * 60;
			this.debateTimeHandler();
		} else if (debateStage === 'summary') {
			this.globalData.debateTime = 2 * 60;
			this.debateTimeHandler();
		}
	},

	// 停止计时  
	stopDebate: function () {
		clearTimeout(this.timer);
		this.timer = null;
	},
})
