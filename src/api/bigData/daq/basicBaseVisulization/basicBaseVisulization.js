import http from '../../../http';
import store from '../../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,
  //列表查询查询库表（概况初始列表）
  popchart(params) {
    return http.get(`${this.service}/pop/echart`, params);
  },
};
