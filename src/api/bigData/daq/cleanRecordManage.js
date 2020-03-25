import http from '../../http';
import store from '../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,

  //清洗实时记录
  cleanTimeList(params) {
    return http.get(`${this.service}/cleaningRecord/selectCurrentCleaningRecordByPage`, params);
  },

  //清洗历史记录
  cleanHistoryList(params) {
    return http.get(`${this.service}/cleaningRecord/findByPage`, params);
  },

  //清洗结果预览
  cleanResultShow(params){
    return http.get(`${this.service}/`,params)
  }

};
