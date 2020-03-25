/**
 * Created by wong on 2018/7/30.
 */

import http from '../../http';
import store from '../../../store';

export default {
  //查询实时记录
  getQualityTestTime(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/qualitytestingrecord/findall', params);
  },

  // //添加
  // addQualityTest(data) {
  //   return http.post(store.state.SERVICE.bigData.daq + '/qualitytesting/savequalitytesting', data);
  // },
  //
  // //删除
  // deleteQualityTest(params) {
  //   return http.post(store.state.SERVICE.bigData.daq + '/qualitytesting/delqualitytesting', params);
  // },
  // //
  // //编辑
  // modifyQualityTest(params) {
  //   return http.put(store.state.SERVICE.bigData.daq + '/qualitytesting/updatequalitytesting', params);
  // },
  // //
  // //执行
  // executeQualityTest(params) {
  //   return http.post(store.state.SERVICE.bigData.daq + '/qualitytesting/testing', params);
  // },

  // //获取所属的系统
  // getSourceSystem(params) {
  //   return http.get(store.state.SERVICE.bigData.basic + '/dictionary/selectOneByPrimaryKey', params);
  // },

  //获取数据库类型
}
