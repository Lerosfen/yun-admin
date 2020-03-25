import http from '../../../http';
import store from '../../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,
  //列表查询查询库表（概况初始列表）
  queryTableList(params) {
    return http.get(`${this.service}/hwtj/queryTableList`, params);
  },
  //列表查询(概况弹出框)
  queryMeta(params){
    return http.get(`${this.service}/hwtj/queryMeta`, params);
  },
  //列表查询(概况详情列表)
  findByPage(params){
    return http.get(`${this.service}/hwtj/findByPage`, params);
  },
};
