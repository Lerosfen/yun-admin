import http from '../../http';
import store from '../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,

  //查询元数据
  selectAllMetadata(params) {
    return http.get(`${this.service}/selectAllMetadataMaintenance`, params);
  },
  //查询基础库-id
  selectMetadataKey(params) {
    return http.get(`${this.service}/selectMetadataMaintenanceKey`, params);
  },
  //基础库编辑
  updateMetadataMaintenance(params) {
    return http.put(`${this.service}/updateMetadataMaintenance`, params);
  },
  //基础库添加
  insertMetadataMaintenance(params) {
    return http.post(`${this.service}/insertMetadataMaintenance`, params);
  },
 //基础库删除
  deleteMetadataMaintenance(params) {
    return http.delete(`${this.service}/deleteMetadataMaintenance`, params);
  },
 //查询基础库下拉
  selectAllBaseLibrary(params) {
    return http.get(`${this.service}/selectAllBaseLibrary`, params);
  },

  // 版本信息
  selectMetadataMaintenanceEdittonKey(params) {
    return http.get(`${this.service}/selectMetadataMaintenanceEdittonKey`, params);
  },


};
