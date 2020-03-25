/**
 * Created by wong on 2018/7/30.
 */

import http from '../../http';
import store from '../../../store';

export default {
  // 查询所有数据质量检测
  getAllQualityTest(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/qualitytesting/findall`, params);
  },

  // 添加
  addQualityTest(data) {
    return http.post(`${store.state.SERVICE.bigData.daq}/qualitytesting/savequalitytesting`, data);
  },
  // 删除
  deleteQualityTest(params) {
    return http.delete(`${store.state.SERVICE.bigData.daq}/qualitytesting/delqualitytesting`, params);
  },
  // 编辑
  modifyQualityTest(params) {
    return http.put(`${store.state.SERVICE.bigData.daq}/qualitytesting/updatequalitytesting`, params);
  },
  // 执行
  executeQualityTest(params) {
    return http.post(`${store.state.SERVICE.bigData.daq}/qualitytesting/testing`, params);
  },
  // 添加里面获取清洗列表;
  choiseCleanList(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/syncTable/selectByPage`, params);
  },
  // 添加里面获取清洗字段，
  choiseCleanWords(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/syncfield/findall`, params);
  },
  // 获取清洗字段
  getAllCleanWords(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/syncfield/findByTableModelNamePage`, params);
  },
  // 清洗表查询-表类型；
  cleanAddtableType(params) {
    return http.get(`${store.state.SERVICE.bigData.basic}/home/selectDicByCode`, params);
  },
  // 清洗表查询-数据源；
  cleanAddtableDB(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/dataSource/selectAllDataSource`, params);
  },
  // 查询采集源
  getAllcleanTable(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/strategy/findAllStrategy`, params);
  },
  // 清洗列表
  getAllCleanList(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/syncTable/selectsoceName`, params);
  },

  // 获取数据库类型

  // 获取按钮权限
  getqualityparams(params) {
    return http.get(`${store.state.SERVICE.bigData.basic}/home/selectBtnForMenu`, params);
  },
  // 查看
  getDetail(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/qualitytesting/findqualityTestTable`, params);
  },
  // 预览内容
  getViewDataById(params) {
    return http.get(`${store.state.SERVICE.bigData.daq}/qualitytestingrecord/findbyrecordid`, params);
  },
};
