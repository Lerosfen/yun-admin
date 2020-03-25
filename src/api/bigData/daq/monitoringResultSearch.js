import http from '../../http';
import store from '../../../store';
export default {
  //查询所有数据表 数据预览查询
  getMonitoringResultSearch(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectNewByPage', params);
  },
  //结果预览
  getMonitoringResultPreview(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/hbaseUtils', params);
  },
  //同步表类型；
  cleanAddtableType(params)
  {
    return http.get(store.state.SERVICE.bigData.basic+'/home/selectDicByCode', params);
  },
   //按钮权限
   getBtnFusePower(params){
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
}
