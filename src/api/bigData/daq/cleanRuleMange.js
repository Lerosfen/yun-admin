import http from '../../http';
import store from '../../../store';

export default {
  // 分页查询
  service: `${store.state.SERVICE.bigData.daq}`,
  service1: `${store.state.SERVICE.bigData.basic}`,

  //清洗数据新增;
  cleanSubmit(params){
    return http.post(`${this.service}/cleaningStrategy/insertCleaningStrategy`, params);
  },
  //按钮权限
  getcleanparams(params){
      return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
  //查看所有
  getAllCleanRole(params){
    return http.get(`${this.service}/CleaningJar/findByPage`, params);
  },
 //查看单个
  getOneCleanRole(params){
    return http.get(`${this.service}/CleaningJar/findOne`, params);
  },
 //启用
  ableCleanRole(params){
    return http.put(`${this.service}/CleaningJar/enable`, params);
  },
  //禁用
  enAbleCleanRole(params){
    return http.put(`${this.service}/CleaningJar/prohibit`, params);
  },
  //删除
  delCleanRole(params){
    return http.delete(`${this.service}/CleaningJar/delete`, params);
  },
  //新增
  AddCleanRole(params){
    return http.post(`${this.service}/CleaningJar/saveRecord`, params);
  },
  getcleanRole(params){
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  }


};
