import http from '../../http';
import store from '../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,

  //查询元模板数据
  selectAllMetadataTemplate(params) {
    return http.get(`${this.service}/selectAllMetadataTemplate`, params);
  },
  //查询元模板数据-id
  selectMetadataTemplateEitionKey(params) {
    return http.get(`${this.service}/selectMetadataTemplateEitionKey`, params);
  },
  //元数据模板编辑
  updateMetadataTemplate(params) {
    return http.put(`${this.service}/updateMetadataTemplate`, params);
  },
  //元数据模板添加
  insertMetadataTemplate(params) {
    return http.post(`${this.service}/insertMetadataTemplate`, params);
  },
 //基础库删除
 deleteMetadataTemplate(params) {
    return http.delete(`${this.service}/deleteMetadataTemplate`, params);
  }, 

  // 查找元数据
  selectAllMetadataMaintenance(params) {
    return http.get(`${this.service}/selectAllMetadataMaintenance`, params);
  },
  // / 根据ID查看元数据模版
  selectMetadataTemplateKey(params) {
    return http.get(`${this.service}/selectMetadataTemplateKey`, params);
  },
  //查询基础库下拉
  selectAllBaseLibrary(params) {
    return http.get(`${this.service}/selectAllBaseLibrary`, params);
  },
  //根据元数据模版之外查找元数据
  selectOutsideTemplate(params) {
    return http.get(`${this.service}/selectOutsideTemplate`, params);
  },
  
};
