import http from '../../../http';
import store from '../../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,

  //图表配置列表查询接口(首页接口)
  confList(params) {
    return http.get(`${this.service}/conf/list`, params);
  },
  //图表配置列表(弹出框)
  selectBasicTableManagementKey(params) {
    return http.get(`${this.service}/selectBasicTableManagementKey`, params);
  },
  //图表配置列表(弹出框，筛选条件)
  fieldsList(params) {
    return http.get(`${this.service}/conf/fieldsList`, params);
  },
  //图表配置列表修改(弹出框，筛选条件)
  selectBasicTableManagementNanme(params) {
    return http.get(`${this.service}/selectBasicTableManagementNanme`, params);
  },
  //图表配置编辑更新(弹出框，编辑修改)
  updateTitle(params) {

    return http.put(`${this.service}/conf/updateTitle`, params);
  },
  //图表配置编辑更新(弹出框，下来菜单)
  sign(params) {

    return http.get(`${this.service}/hwtj/sign`, params);
  },
};
