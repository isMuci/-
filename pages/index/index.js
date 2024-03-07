const app = getApp()

Page({
	data: {
		stageIndex: 0,		
		proState: false,	
		proTimes: 0,			
		conState: false,	
		conTimes: 0,			
		proCoverState: false,
		conCoverState: false,
		stageState: true,	
		matchState: false,
		debateStage: [],
		count: 0,
		count_c: 0,
		countTimer: null,
		countTimer_c: null,
		countDownHeight: 0,
		src:"../../assets/sound/countdown.mp3"
	},
	onLoad() {
		let that = this
		wx.createSelectorQuery()
			.select('#proBg')
			.boundingClientRect()
			.exec(function (res) {
				console.log(res)
				that.setData({
					proPointX: (res[0].right - res[0].left) / 2,
					proPointY: (res[0].bottom - res[0].top) / 2,
					circle_r: res[0].height / 2
				})
				that.drawProgressbg();
			})

		wx.createSelectorQuery()
			.select('#conBg')
			.boundingClientRect()
			.exec(function (res) {
				console.log(res)
				that.setData({
					conPointX: (res[0].right - res[0].left) / 2,
					conPointY: (res[0].bottom - res[0].top) / 2,
				})
				that.drawProgressbg_c();
			})

			this.audioCtx = wx.createAudioContext('myAudio')
	},
	onShow() {
		let that = this
		let configs = wx.getStorageSync('configs')
		var debateStage = []
		for (var i in configs) {
			var config = configs[i]
			if (config.state) {
				debateStage.push(config.name);
			}
		}
		that.setData({
			debateStage: debateStage,
			configs: wx.getStorageSync('configs')
		})
		let stageIndex = that.data.stageIndex
		let time = that.data.configs[stageIndex].time
		that.setData({
			progress_txt: time + ' 秒',
			progress_txt_c: time + ' 秒'
		})
	},
	onReady() {

	},
	change_stage(e) {
		let that = this
		if (that.data.stageState) {
			wx.showModal({
				title: '警告',
				content: '该阶段未结束！是否仍要切换！',
				complete: (res) => {
					if (res.confirm) {
						let stageIndex = e.detail.value
						let time = that.data.configs[stageIndex].time
						that.setData({
							stageIndex: e.detail.value,
							progress_txt: time + " 秒",
							progress_txt_c: time + ' 秒',
							stageState: false,
							count: 0,
							count_c: 0,
							proCoverState: true,
							conCoverState: true,
							stageState: true
						})
						clearInterval(that.countTimer)
					}
				}
			})
		} else {
			let stageIndex = e.detail.value
			let time = that.data.configs[stageIndex].time
			that.setData({
				stageIndex: e.detail.value,
				progress_txt: time + " 秒",
				progress_txt_c: time + ' 秒',
				count: 0,
				count_c: 0,
				proTimes: 0,
				conTimes: 0,
				proCoverState: true,
				conCoverState: true,
				stageState: true
			})
		}
	},
	nextStage() {
		let that = this
		var stageIndex = that.data.stageIndex
		stageIndex++
		let time = that.data.configs[stageIndex].time
		that.setData({
			stageIndex: stageIndex,
			stageState: true,
			progress_txt: time + " 秒",
			progress_txt_c: time + ' 秒',
			count: 0,
			count_c: 0,
			proTimes: 0,
			conTimes: 0,
			proCoverState: true,
			conCoverState: true,
		})
	},

	start(e) {
		let that = this
		let stageIndex = that.data.stageIndex
		let role = e.currentTarget.id
		let proState = that.data.proState
		let conState = that.data.conState
		let proTimes = that.data.proTimes
		let conTimes = that.data.conTimes
		if (stageIndex == 0) {
			if (role == "pro") {
				if (!proState) {
					proTimes++
					that.setData({
						matchState: true,
						stageState: true,
						proState: true,
						proCoverState: false,
						proTimes: proTimes
					})
					that.countInterval();

				} else if (proState || conState) {
					wx.showModal({
						title: '提示',
						content: '立论阶段发言不允许打断！',
						showCancel: false
					})
				}
			} else {
				if (proState || conState) {
					wx.showModal({
						title: '提示',
						content: '立论阶段发言不允许打断！',
						showCancel: false
					})
				} else if (that.data.proTimes == 0) {
					wx.showModal({
						title: '提示',
						content: '正方一辩请先发言！',
						showCancel: false
					})
				} else {
					that.setData({
						conState: true,
						conCoverState: false,
					})
					that.countInterval_c();
				}
			}

		} else if (stageIndex == 1) {
			if (role == "con") {
				if (!conState) {
					that.countInterval_c();
					conTimes++;
					that.setData({
						matchState: true,
						stageState: true,
						conState: true,
						conTimes: conTimes
					})
					setTimeout(() => {
						that.setData({
							conCoverState: false,
						})
					}, 1100)
				} else if (proState || conState) {
					wx.showModal({
						title: '提示',
						content: '驳立论阶段发言不允许打断！',
						showCancel: false
					})

				}
			} else {
				if (proState || conState) {
					wx.showModal({
						title: '提示',
						content: '驳立论阶段发言不允许打断！',
						showCancel: false
					})
				} else if (that.data.conTimes == 0) {
					wx.showModal({
						title: '提示',
						content: '反方二辩请先发言！',
						showCancel: false
					})
				} else {
					that.countInterval();
					that.setData({
						proState: true,
					})
					setTimeout(() => {
						that.setData({
							proCoverState: false,
						})
					}, 1100)

				}
			}
		} else if (stageIndex == 2) {
			if(role == "pro"){
				if(conTimes == 0){
					wx.showModal({
					  title: '提示',
					  content: '请反方一、二、四辩先进行回答',
					  showCancel:false
					})
				} else if(!proState) {
					clearInterval(that.countTimer_c);
					proTimes++;
					that.setData({
						proState:true,
						conState:false,
						proTimes:proTimes
					})
					setTimeout(() => {
						that.setData({
							proCoverState: false,
						})
					}, 1100)
					that.countInterval();
				}
			}else{
				if(!proState && !conState){
					conTimes++;
					that.setData({
						matchState:true,
						stageState:true,
						conState:true,
						conTimes:conTimes,
					})
					setTimeout(() => {
						that.setData({
							conCoverState: false,
						})
					}, 1100)
					that.countInterval_c();
				}else if(!conState){
					clearInterval(that.countTimer);
					conTimes++;
					that.setData({
						conState:true,
						proState:false,
						conTimes:conTimes
					})
					setTimeout(() => {
						that.setData({
							conCoverState: false,
						})
					}, 1100)
					that.countInterval_c();
				}
			}
		} else if (stageIndex == 3) {
			if(role == "pro"){
				if(conTimes == 0){
					wx.showModal({
					  title: '提示',
					  content: '请反方先进行发言',
					  showCancel:false
					})
				} else if(!proState) {
					clearInterval(that.countTimer_c);
					proTimes++;
					that.setData({
						proState:true,
						conState:false,
						proTimes:proTimes
					})
					setTimeout(() => {
						that.setData({
							proCoverState: false,
						})
					}, 1100)
					that.countInterval();
				}
			}else{
				if(!proState && !conState){
					conTimes++;
					that.setData({
						matchState:true,
						stageState:true,
						conState:true,
						conTimes:conTimes,
					})
					setTimeout(() => {
						that.setData({
							conCoverState: false,
						})
					}, 1100)
					that.countInterval_c();
				}else if(!conState){
					clearInterval(that.countTimer);
					conTimes++;
					that.setData({
						conState:true,
						proState:false,
						conTimes:conTimes
					})
					setTimeout(() => {
						that.setData({
							conCoverState: false,
						})
					}, 1100)
					that.countInterval_c();
				}
			}
		} else if (stageIndex == 4) {
			if (role == "con") {
				if (!conState) {
					that.countInterval_c();
					conTimes++;
					that.setData({
						matchState: true,
						stageState: true,
						conState: true,
						conTimes: conTimes
					})
					setTimeout(() => {
						that.setData({
							conCoverState: false,
						})
					}, 1100)
				} else if (proState || conState) {
					wx.showModal({
						title: '提示',
						content: '总结陈词阶段发言不允许打断！',
						showCancel: false
					})

				}
			} else {
				if (proState || conState) {
					wx.showModal({
						title: '提示',
						content: '总结陈词阶段发言不允许打断！',
						showCancel: false
					})
				} else if (that.data.conTimes == 0) {
					wx.showModal({
						title: '提示',
						content: '反方四辩请先进行总结！',
						showCancel: false
					})
				} else {
					that.countInterval();
					that.setData({
						proState: true,
					})
					setTimeout(() => {
						that.setData({
							proCoverState: false,
						})
					}, 1100)

				}
			}
		}
	},

	countInterval: function () {
		let that = this
		let stageIndex = that.data.stageIndex
		let time = that.data.configs[stageIndex].time
		let warnTime = that.data.configs[stageIndex].voice
		that.countTimer = setInterval(() => {
			if (that.data.count <= time) {
				that.drawProgressCircle(that.data.count / (time / 2));
				that.setData({
					progress_txt: time - (that.data.count++) + ' 秒'
				});
				if((time - that.data.count )< warnTime ){
					this.audioCtx.play()
				}
			} else {
				that.setData({
					progress_txt: "时间到！"
				})
				if (that.data.stageIndex == 0 || 1 || 2 || 3 || 4) {
					that.setData({ proState: false })
					if (stageIndex == 4) {
						that.setData({
							matchState: false
						})
						wx.showModal({
							title: '提示',
							content: '本场辩论赛已结束！',
							showCancel: false
						})
					}
				}
				if (that.data.count_c > time) {
					that.setData({ stageState: false })
				}
				this.audioCtx.pause()
				clearInterval(that.countTimer);
			}
		}, 1000)
	},
	drawProgressbg: function () {
		let that = this
		var X = that.data.proPointX
		var Y = that.data.proPointY
		var circle_r = that.data.circle_r
		var ctx = null;
		wx.createSelectorQuery()
			.select("#proBg")
			.context(function (res) {
				console.log("节点实例：", res);
				ctx = res.context;
				ctx.setLineWidth(6);
				ctx.setStrokeStyle('#ffffff');
				ctx.setLineCap('round')
				ctx.beginPath();
				ctx.arc(X, Y, circle_r - 2, 0, 2 * Math.PI, false);
				ctx.stroke();
				ctx.draw();
			})
			.exec();
	},
	drawProgressCircle: function (step) {
		let that = this
		var X = that.data.proPointX
		var Y = that.data.proPointY
		var circle_r = that.data.circle_r
		var ctx = null;
		wx.createSelectorQuery()
			.select("#pro")
			.context(function (res) {
				console.log("节点实例：", res);
				ctx = res.context;
				var gradient = ctx.createLinearGradient(0, 0, 100, 100);
				gradient.addColorStop("0", "#FF0000");
				gradient.addColorStop("0.5", "#FF0000");
				gradient.addColorStop("1.0", "#FF0000");
				ctx.setLineWidth(8);
				ctx.setStrokeStyle(gradient);
				ctx.setLineCap('round')
				ctx.beginPath();
				ctx.arc(X, Y, circle_r - 2, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
				ctx.stroke();
				ctx.draw();
			})
			.exec();
	},
	countInterval_c: function () {
		let that = this
		let stageIndex = that.data.stageIndex
		let time = that.data.configs[stageIndex].time
		let warnTime = that.data.configs[stageIndex].voice
		that.countTimer_c = setInterval(() => {
			if (that.data.count_c <= time) {
				that.drawProgressCircle_c(that.data.count_c / (time / 2));
				that.setData({
					progress_txt_c: time - (that.data.count_c++) + ' 秒'
				});
				if((time - that.data.count )< warnTime ){
					this.audioCtx.play()
				}
			} else {
				that.setData({
					progress_txt_c: "时间到！"
				});
				if (that.data.stageIndex == 0 || 1 || 2 || 3 || 4) {
					that.setData({ conState: false })
				}
				if (that.data.count > time) {
					that.setData({ stageState: false })
				}
				clearInterval(that.countTimer_c);
			}
		}, 1000)
	},
	drawProgressbg_c: function () {
		let that = this
		var X = that.data.conPointX
		var Y = that.data.conPointY
		var circle_r = that.data.circle_r
		var ctx = null;
		wx.createSelectorQuery()
			.select("#conBg")
			.context(function (res) {
				console.log("节点实例：", res);
				ctx = res.context;
				ctx.setLineWidth(6);
				ctx.setStrokeStyle('#ffffff');
				ctx.setLineCap('round')
				ctx.beginPath();
				ctx.arc(X, Y, circle_r - 2, 0, 2 * Math.PI, false);
				ctx.stroke();
				ctx.draw();
			})
			.exec();
	},
	drawProgressCircle_c: function (step) {
		let that = this
		var X = that.data.conPointX
		var Y = that.data.conPointY
		var circle_r = that.data.circle_r
		var ctx = null;
		wx.createSelectorQuery()
			.select("#con")
			.context(function (res) {
				console.log("节点实例：", res);
				ctx = res.context;
				var gradient = ctx.createLinearGradient(0, 0, 100, 100);
				gradient.addColorStop("0", "#FF0000");
				gradient.addColorStop("0.5", "#FF0000");
				gradient.addColorStop("1.0", "#FF0000");
				ctx.setLineWidth(8);
				ctx.setStrokeStyle(gradient);
				ctx.setLineCap('round')
				ctx.beginPath();
				ctx.arc(X, Y, circle_r-2, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
				ctx.stroke();
				ctx.draw();
			})
			.exec();
	},
})