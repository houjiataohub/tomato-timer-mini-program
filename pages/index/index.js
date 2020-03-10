//index.js
const app = getApp()

Page({
  data: {
    width: 0,
    height: 0,
    angle: 0,
    leftMin: 25,
    timerTriggered: 0
  },
  
  addTimer: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.width = res.windowWidth
        that.height = res.windowHeight
      } 
    })
  },
  onReady: function () {
    this.drawClock()
    //this.interval = setInterval(this.drawClock, 50);
  },
  drawClock: function() {
    let that = this;
    that.setData({
      timerTriggered: (that.data.timerTriggered + 1) % 1200
    });

    var context = wx.createContext()//创建并返回绘图上下文（获取画笔）
    //设置宽高
    var width = this.width
    var height = this.height
    var R = width / 2 - 55;//设置文字距离时钟中心点距离

    that.setData({
      width: width,
      height: height
    });
    //重置画布函数
    function reset() {
      context.draw();
      context.height = context.height;//每次清除画布，然后变化后的时间补上
      context.translate(width / 2, height / 2 - 70);//设置坐标轴原点
      context.save();//保存中点坐标1
    }
    //绘制中心圆和外面大圆
    function circle() {
      //外面大圆
      context.setLineWidth(5);
      context.beginPath();
      context.arc(0, 0, width / 2 - 30, 0, 2 * Math.PI, true);
      context.closePath();
      context.stroke();
      //外圆内圈
      context.setLineWidth(2);
      context.beginPath();
      context.arc(0, 0, width / 2 - 44, 0, 2 * Math.PI, true);
      context.closePath();
      context.stroke();

      //中心圆
      context.setLineWidth(4);
      context.beginPath();
      context.arc(0, 0, width / 2 - 110, 0, 2 * Math.PI, true);
      context.closePath();
      context.stroke();

      //ears
      context.setLineWidth(5);
      context.beginPath();
      context.arc(0, 0, width / 2 - 10, -1.93, -1.22, true);
      //context.closePath();
      context.stroke();

      context.setLineWidth(5);
      context.beginPath();
      context.arc(0, 0, width / 2 + 5, -1.80, -1.35, false);
      context.stroke();

      context.setLineWidth(7);
      context.beginPath();
      context.arc(0, 0, width / 2 + 12, -1.80, -1.35, false);
      context.stroke();

      context.setLineWidth(4);
      context.beginPath();
      context.arc(-93, -159, 30, -0.5, 2.6, true);
      context.closePath();
      context.stroke();

      context.setLineWidth(4);
      context.beginPath();
      context.arc(-110, -189, 1, -0.5, 2.6, true);
      context.closePath();
      context.stroke();

      context.setLineWidth(4);
      context.beginPath();
      context.arc(93, -158, 30, 0.5, -2.6, true);
      context.closePath();
      context.stroke();

      context.setLineWidth(4);
      context.beginPath();
      context.arc(110, -188, 1, 0.5, -2.6, true);
      context.closePath();
      context.stroke();

    }
    //绘制字体
    function num() {
      // var R = width/2-60;//设置文字距离时钟中心点距离
      context.setFontSize(20)//设置字体样式
      context.textBaseline = "middle";//字体上下居中，绘制时间
      for (var i = 1; i < 13; i++) {
        //利用三角函数计算字体坐标表达式
        var x = R * Math.cos(i * Math.PI / 6 - Math.PI / 2);
        var y = R * Math.sin(i * Math.PI / 6 - Math.PI / 2);
        if (i == 11 || i == 12) {//调整数字11和12的位置
          context.fillText(i * 5, x - 12, y + 2);
        } else {
          context.fillText(i * 5, x - 10, y);
        }
      }
    }
    //绘制小格
    function smallGrid(context) {
      context.setLineWidth(1);
      context.rotate(-Math.PI / 2);//时间从3点开始，倒转90度
      for (var i = 0; i < 60; i++) {
        context.beginPath();
        context.rotate(Math.PI / 30);
        context.moveTo(width / 2 - 30, 0);
        context.lineTo(width / 2 - 40, 0);
        context.stroke();
      }
    }
    //绘制大格
    function bigGrid(context) {
      for (var i = 0; i < 12; i++) {
        context.beginPath();
        context.rotate(Math.PI / 6);
        if (i == 10 || i == 0 || i == 11) {
          context.setLineWidth(10);
          context.moveTo(width / 2 - 10, 0);
          context.lineTo(width / 2 - 25, 0);
          context.stroke();

          if (i == 11) {
            context.setLineWidth(10);
            context.moveTo(width / 2 - 8, 0);
            context.lineTo(width / 2 + 5, 0);
            context.stroke();
          }
        } 
        
        context.setLineWidth(5);
        context.moveTo(width / 2 - 30, 0);
        context.lineTo(width / 2 - 45, 0);
        context.stroke();
      }
    }
    //指针运动函数
    function move() {
      var t = new Date();//获取当前时间
      var h = t.getHours();//获取小时
      h = h > 12 ? (h - 12) : h;//将24小时制转化为12小时制
      var m = t.getMinutes();//获取分针
      var s = t.getSeconds();//获取秒针
      context.save();//再次保存2
      //context.setLineWidth(7);
      //旋转角度=30度*（h+m/60+s/3600）
      //分针旋转角度=6度*（m+s/60）
      //秒针旋转角度=6度*s
      //context.beginPath();
      
      //绘制秒针
      context.setStrokeStyle('#ff6347');
      context.setLineWidth(15);
      context.beginPath();
      context.rotate((Math.PI / 30) * s);
      context.moveTo(142, 0);
      context.lineTo(width / 3 + 32, 0);
      context.closePath();
      context.stroke();
    }
    function drawProgress() {
      var contextProgress = wx.createCanvasContext('canvasProgress', this);
      contextProgress.translate(width / 2, height / 2 - 70);//设置坐标轴原点
      contextProgress.height = that.data.height;//每次清除画布，然后变化后的时间补上
      contextProgress.width = that.data.width;
      contextProgress.save();

      contextProgress.rotate(-Math.PI / 2);

      contextProgress.setLineWidth(12);
      contextProgress.setStrokeStyle("#AAAAAA");
      contextProgress.beginPath();
      // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
      contextProgress.arc(0, 0, that.data.width / 2 - 38, 0, that.data.angle, true);
      contextProgress.stroke();
      contextProgress.draw();

      that.setData({
        angle: (Math.PI / 600 + that.data.angle) % (2 * Math.PI)
      });

      //console.log(that.data.angle);
    }
    function drawLines() {
      var contextProgress = wx.createCanvasContext('canvasLine', this);
      contextProgress.translate(that.data.width / 2, that.data.height / 2 - 70);//设置坐标轴原点
      contextProgress.height = that.data.height;//每次清除画布，然后变化后的时间补上
      contextProgress.width = that.data.width;
      contextProgress.save();
      contextProgress.setLineWidth(1);
      contextProgress.rotate(-Math.PI / 2);//时间从3点开始，倒转90度
      for (var i = 0; i < 60; i++) {
        contextProgress.beginPath();
        contextProgress.rotate(Math.PI / 30);
        contextProgress.moveTo(that.data.width / 2 - 30, 0);
        contextProgress.lineTo(that.data.width / 2 - 40, 0);
        contextProgress.stroke();
      }

      for (var i = 0; i < 12; i++) {
        contextProgress.beginPath();
        contextProgress.rotate(Math.PI / 6);
        contextProgress.setLineWidth(5);
        contextProgress.moveTo(that.data.width / 2 - 30, 0);
        contextProgress.lineTo(that.data.width / 2 - 45, 0);
        contextProgress.stroke();
      }

      contextProgress.draw();
    }
    function showCountDownTime() {
      if (that.data.timerTriggered == 0) {
        let left = that.data.leftMin - 1;
        that.setData({
            leftMin: left
        });
      }

      context.setFontSize(90)//设置字体样式
      context.textBaseline = "middle";//字体上下居中，绘制时间
      context.setFillStyle('#2F4F4F');
      context.fillText(that.data.leftMin, -context.measureText(that.data.leftMin).width * 0.5, -10);
      context.setFillStyle('#A9A9A9');
      context.setFontSize(20)//设置字体样式
      context.textBaseline = "middle";//字体上下居中，绘制时间
      context.fillText("MIN", -15, 50);
      //console.log(width - context.measureText(that.data.leftMin).width);
    }
    //调用
    function drawClock() {
      reset();
      circle();
      num();
      showCountDownTime();
      smallGrid(context);
      bigGrid(context);
    }
    drawClock()//调用运动函数
    drawProgress();
    drawLines();

    if (that.data.leftMin == 0) {
      clearInterval(that.interval);
    }
    // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
    wx.drawCanvas({
      canvasId: 'clock',
      actions: context.getActions()
    })
  },
  onUnload: function () {
    clearInterval(this.interval);
  },

  toggleTimer: function() {
    if (!this.interval) {
      this.interval = setInterval(this.drawClock, 50);
    } else {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  //bussiness part







})
