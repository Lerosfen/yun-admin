/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
/* eslint-disable */
const mutations = {};
const actions = {};
const state = {};

export default new Vuex.Store({
  state:{
    SERVICE:{
      bigData:{
        basic:'basic-service',//基础管理
        daq:'daq-service',//数据采集

      }
    },
    el_Duration:2000,
    LOADING:false,
    //保存法人姓名
    conditionType:"",
    //基础库可视化库ID暂时无用
    visBaseLibId:0,
  },
  getters: {
    visBaseLibId: state => state.visBaseLibId
  },
  actions,
  mutations:{
    set_token(state, token) {
      state.token = token
      sessionStorage.token = token
    },
    del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    //loading
    showLoading(state){
      state.LOADING = true
    },
    hideLoading (state) {
      state.LOADING = false
    },
    SetVisBaseLibId(state, payload) {
      state.visBaseLibId = payload
    }

  },
});

