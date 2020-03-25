/**
 * Created by Administrator on 2018/7/20.
 */
import http from '../../http';

export default {
  // 查询数据机制模型日志
  findLogin(params) {
    return http.get('daq-service/dpmModel/findLogin', params);
  },
  // 查询数据机制处理情况
  finTypLogin(params) {
    return http.get('daq-service/dpmModel/finTypLogin', params);
  },

};
