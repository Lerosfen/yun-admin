import http from '../../http';
import store from '../../../store';

export default {
  service: `${store.state.SERVICE.bigData.daq}`,

  //查询基础库
  selectAllBaseLibrary(params) {
    return http.get(`${this.service}/selectAllBaseLibrary`, params);
  },
  //查询基础库-id
  selectBaseLibraryKey(params) {
    return http.get(`${this.service}/selectBaseLibraryKey`, params);
  },
  //基础库编辑
  updateBaseLibrary(params) {
    return http.put(`${this.service}/updateBaseLibrary`, params);
  },
  //基础库添加
  insertBaseLibrary(params) {
    return http.post(`${this.service}/insertBaseLibrary`, params);
  },
 //基础库删除
  deleteBaseLibrary(params) {
    return http.delete(`${this.service}/deleteBaseLibrary`, params);
  },

 //添加基础库页签
 insertBaseLibraryConfig(params) {
    return http.post(`${this.service}/insertBaseLibraryConfig`, params);
  },
 //查询基础库页签
 findBaseLibraryConfig(params) {
    return http.get(`${this.service}/findBaseLibraryConfig`, params);
  },
};
