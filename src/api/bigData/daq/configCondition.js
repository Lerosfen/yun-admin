import http from '../../http';
import store from '../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,


  //根据维护ID查询配置条件
  findQueryMainById(params) {
    return http.get(`${this.service}/findQueryMaintenancePztj`, params);
  },
  //查询对应字段
  findCorresField(params){
    return http.get(`${this.service}/selectBasicTableManagementKey`, params);
  },
  //添加查询维护配置条件
  insertQueryMainById(params) {
    return http.post(`${this.service}/insertQueryMaintenancePztj`, params);
  },
};
