import http from '../../http';
import store from '../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,

  //删除查询维护
  deleteQueryMainData(params) {
    return http.delete(`${this.service}/deleteQueryMaintenance`, params);
  },
  //根据维护ID查询配置条件
  findQueryMainById(params) {
    return http.get(`${this.service}/findQueryMaintenancePztj`, params);
  },
  //添加查询维护
  insertQueryMainData(params) {
    return http.post(`${this.service}/insertQueryMaintenance`, params);
  },

  //查询维护
  selectAllQueryMainData(params) {
    return http.get(`${this.service}/selectAllQueryMaintenance`, params);
  },
  //修改查询维护
  updateQueryMainData(params) {
    return http.put(`${this.service}/updateQueryMaintenance`, params);
  },
  //查询基础库信息（所属库下拉框选择list）
  selectAllBaseLibrary(params) {
    return http.get(`${this.service}/selectAllBaseLibrary`, params);
  },
  //查询基础表(点击新增时显示表格)
  selectAllTableLibrary(params) {
    return http.get(`${this.service}/selectAllBasicTableManagement`, params);
  },

};
