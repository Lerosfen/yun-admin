import http from '../http';
import store from '../../store';

export default {

  //修改密码
  modifyUserPassword(params) {
    return http.put(store.state.SERVICE.bigData.basic + '/user/updateUserPassWord', params);
  },

  //获取用户信息
  getUserInfo(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/user/selectById', params);
  },

  //获取部门信息
  getDepartmentName(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/department/selectOneByPrimaryKey', params)
  },
  // 获取配置信息
  getTitle(params){
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectConfigByKey', params)
  }
}

