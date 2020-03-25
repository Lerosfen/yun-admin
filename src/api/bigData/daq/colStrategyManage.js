/**
 * Created by zenjoo on 2018/7/2.
 */
/* eslint-disable */

import http from '../../http';
import store from '../../../store';

export default {
  //查询所有采集策略管理
  getColStrange(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/strategy/findAll', params);
  },

  //查询所有数据源
  getSourceName(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dataSource/selectAllDataSource', params);
  },
  // 根据数据源id查询数据
  getSourceById(params){
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectAllByPage', params);
  },

  //删除数据源
  deleteColStrate(params) {
    return http.delete(store.state.SERVICE.bigData.daq + '/strategy/deleteStrategy', params);
  },
// 查看
  LookColStrange(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/strategy/queryStrategyTable', params);
  },
// 编辑 修改
  editorColStrange(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/strategy/updateStrategy', params);
  },
  // 撤销
  disableColStrange(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/strategy/updateChStrategy', params);
  },
//  新增数据源
  AddColStrage(params){
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectByPage', params);
  },
  //保存数据源
  saveColStrage(params){
    return http.post(store.state.SERVICE.bigData.daq + '/strategy/saveStrategy', params);
  },

// 策略启动
  StartColSrtage(params){
    return http.put(store.state.SERVICE.bigData.daq + '/strategy/sendStrategy', params);
  },
  //按钮权限
  getBtnPower(params){
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
  // 获取表字段
  getSyncfield(params){
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findall', params);
  },
  // 获取字段
  getField(params){
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findByTableName', params);
  }


}
