import http from '../../../http';
import store from '../../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,
  //根据库ID查询分类下拉框
  queryClassify(params) {
    return http.get(`${this.service}/selectAllQueryMaintenance`, params);
  },
  //根据来源查询其他配置
  queryConfig(params){
    return http.get(`${this.service}/findQueryMaintenancePztj`, params);
  },
  //根据参数查询结果表
 /* queryResultTable(params){
    return http.postt(`${this.service}/hwtj/findMacroPowerByPage`,params);
  }*/
};
