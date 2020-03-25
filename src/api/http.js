'use strict'
/* eslint-disable */
import axios from 'axios'
import store from "../store";
import  "./env";
import { Message } from 'element-ui'
// import AppConfig from '../../static/app.config'
// http response 拦截器
// let AppConfig = sessionStorage.getItem("ApiUrl");
// console.log()


axios.defaults.timeout = 0;
// 添加请求拦截器
axios.interceptors.request.use(config => {
// 在发送请求之前做些什么
//判断是否存在token，如果存在将每个页面header都添加token
  if (store.state.token) {
    config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    config.headers.common['Authorization'] = store.state.token;
    // config.headers.get['Content-Type'] = '*/*;charset=UTF-8';
    // config.headers.Authorization = store.state.token;
    // config.headers = {
    //     'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    //     "X-Requested-With": "XMLHttpRequest",
    //     // 'Access-Control-Allow-Origin':'*',
    //     // 'Content-Type': 'text/html;charset=utf-8',
    //     'Authentication': store.state.token,
    // };
    // config.request.setContentType = 'application/x-www-form-urlencoded;charset=utf-8';
  }

  return config;
}, error => {
// 对请求错误做些什么
  return Promise.reject(error);
});

// http response 拦截器
let self=this;
axios.interceptors.response.use(

  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {

        case 'code_401':
          this.$store.commit('del_token');
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
          });
              break;
          case 500:
            // Message({
            //   type: 'error',
            //   message: '服务器异常',
            // });
            console.log("服务器异常");
              break;
      }
    }
    return Promise.reject(error)
  });

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  // if (response && (response.status === "code_201" || response.status === 304 || response.status === 400)) {
  return response
  // 如果不需要除了data之外的数据，可以直接 return response.data
  // }
  // 异常状态下，把错误信息返回去
  // return {
  //     status: -404,
  //     msg: '网络异常'
  // }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
  }
  if (res.data && (res.data.errcode != 0)) {
  }
  return res.data
}
// axios.defaults.timeout = 10000
export default {

  post(url, data) {
    // var qs = require('qs');
    return axios({
      method: 'post',
      baseURL: sessionStorage.getItem("ApiUrl"),
      url: url,
      // data:qs.stringify(data),
      data,
      withCredentials: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },


  postt(url, data) {
    var qs = require('qs');
    return axios({
      method: 'post',
      baseURL: sessionStorage.getItem("ApiUrl"),
      url: url,
      data:qs.stringify(data),
      withCredentials: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params = {}) {
    return axios({
      method: 'GET',
      baseURL: sessionStorage.getItem("ApiUrl"),
      url: url,
      params, // get 请求时带的参数
      withCredentials: true,
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  put(url, data) {

    return axios({
      method: 'PUT',
      baseURL: sessionStorage.getItem("ApiUrl"),
      url: url,
      data:data,
      withCredentials: true
    }).then(
      (response) => {

        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  delete(url, params = {}) {
    return axios({
      method: 'delete',
      baseURL: sessionStorage.getItem("ApiUrl"),
      url: url,
      params,
      withCredentials: true
    }).then(
      (response) => {

        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
