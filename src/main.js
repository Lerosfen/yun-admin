// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

/* eslint-disable */
import promise from 'es6-promise';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import YJComponent from '@/components/YUNPackages';
import HeadNav from '@/components/headnav/HeadNav';
import ContentView from '@/page/contentView';
import SiderBar from '@/page/SiderBar';
import Router from 'vue-router';
import initRouter from './router';
import App from './App';
import base from './base';
import store from './store';
import VueLazyload from 'vue-lazyload';
import './assets/css/ycon.css';
import './assets/css/global.css';
import './api/http';
import moment from 'moment';
import echarts from 'echarts';
import qs from 'qs';
import JsEncrypt from 'jsencrypt';

Vue.prototype.$jsEncrypt = JsEncrypt;
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';

const Bus = new Vue();
// import emComponent from './components/dialog/dialog'

promise.polyfill();
Vue.use(Router);
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(Vuex);
// Vue.use(Login);
// Vue.use(MainView);
Vue.use(HeadNav);
// Vue.use(IndexView);
Vue.use(SiderBar);
Vue.use(ContentView);
Vue.use(base);
Vue.use(store);
Vue.use(YJComponent);
Vue.use(moment);
Vue.prototype.$echarts = echarts;
Vue.use(VueLazyload, {
  preLoad: 1,
  error: '../static/login_bg2.png',
  loading: '../static/login_bg2.png',
  attempt: 1
});
Vue.use(iView);

const router = initRouter();
let getUrl = window.location.href;
// let getCode = getUrl.split('/?')[0].split('/');
// let getSid = getUrl.split('?')[2].split('#')[0];
// sessionStorage["sysCode"] = getCode[getCode.length - 1];
// sessionStorage["sid"] = getSid;
var test = getUrl.split('#')[0];
var token = test.split('=')[1];
sessionStorage.setItem('token', token);
sessionStorage['sid'] = 10001;
sessionStorage.setItem('sysCode', 'daq-service');
// sessionStorage['name'] = 'admin';
// sessionStorage.setItem('token', '28305a222a9046e69fb1171e0458aa10');


Vue.config.productionTip = false;

if (!sessionStorage.getItem('token')) { //判断本地是否存在access_token
  history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
  });
  let backLink = window.location.href.split('daq-service')[0];
  location.href = backLink + '#/login';
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: { Bus },
  router,
  store,
  axios,
  moment,
  components: { App },
  template: '<App/>',
});


