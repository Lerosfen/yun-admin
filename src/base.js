/* eslint-disable */
/***
 * 这里放的都是自定义的公共方法
 */

exports.install = function (Vue, options) {
  // 获取屏幕可用的高度
  Vue.prototype.getWindowHeight = function () {
    var windowHeight = document.documentElement.clientHeight;
    var navHeight = document.getElementsByClassName('headNav')[0].clientHeight;
    let height = windowHeight - navHeight - 40;
    if (height <= 768) {
      height = 768;
    }
    return height;
  };
  //保留两位小数过滤器(不进行四舍五入)
  Vue.filter("rounding", function(value) {
    return Math.floor(value * 100) / 100
  })
// 时间过滤器
  Vue.prototype.formatDate = function (row) {
    // console.log(row,'-0-90-09808')
    let timestamp = row;
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;


  };

  //服务大对象
  Vue.prototype.serviceObj = {
    basic: 'basic-service',//基础管理
    daq: 'daq-service',//数据采集
  };
};

