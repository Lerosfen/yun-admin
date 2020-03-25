/**
 * Created by zenjoo on 2018/7/2.
 */

/* eslint-disable */
import http from '../../http';
import store from '../../../store';

export default {
  // 查询所有模型
  getAllModel(params){
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/Modename', params);
  },
  //查询所有申请
  getUserApplyModel(params){
    return http.get(store.state.SERVICE.bigData.daq + '/ApplydpmModel/findUserByPage', params);
  },
  // 查询单个申请
  getApplyModelById(params){
    return http.get(store.state.SERVICE.bigData.daq + '/ApplydpmModel/findOne', params);
  },

  //按钮权限
  getBtnFusePower(params){
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
  // 查询所有管理员申请
  getApplyModel(params){
    return http.get(store.state.SERVICE.bigData.daq + '/ApplydpmModel/findByPage', params);
  },
  // 添加
  addApply(params){
    return http.post(store.state.SERVICE.bigData.daq + '/ApplydpmModel/saveRecord', params);
  },
  // 修改
  updateApply(params){
    return http.put(store.state.SERVICE.bigData.daq + '/ApplydpmModel/update', params);
  },
  // 删除
  delApply(params){
    return http.delete(store.state.SERVICE.bigData.daq + '/ApplydpmModel/delete', params);
  },
  // 审核通过
  auditApply(params){
    return http.put(store.state.SERVICE.bigData.daq + '/ApplydpmModel/AuditStatus', params);
  },
  // 审核拒绝
  auditRefuse(params){
    return http.put(store.state.SERVICE.bigData.daq + '/ApplydpmModel/Refusal', params);
  },
  // 删除申请
  delRefuse(params){
    return http.delete(store.state.SERVICE.bigData.daq + '/ApplydpmModel/delete', params);
  },

}
