module.exports = {
  proxy: {
    '/api/' : {    //将http://192.168.0.23:8757印射为/apis
      target: 'http://192.168.0.23:8757',  // 接口域名
      changeOrigin: false,  //是否跨域
      pathRewrite: {
        '^/api': ''   //需要rewrite的,
      }
    }
  }
}
