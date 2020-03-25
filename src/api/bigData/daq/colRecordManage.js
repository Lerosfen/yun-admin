import http from '../../http';
import store from '../../../store';

export default {
  // 分页查询
  service: `${store.state.SERVICE.bigData.daq}`,
  historyList(params) {
    return http.get(`${this.service}/record/findByPage`, params);
  },
  shishiList(params) {
    return http.get(`${this.service}/record/selectCurrentRecordByPage`, params);
  },
  // 结果预览
  resultShow(params) {
    return http.get(`${this.service}/record/selectRecordPreview`, params);
  },
};
