/**
 * Created by zenjoo on 2018/7/2.
 */

/* eslint-disable */
import http from '../../http';
import store from '../../../store';

export default {
  //查询数据模型数据
  getModel(pageSize, currentPage, params) {
    return http.post(store.state.SERVICE.bigData.daq + '/dpmModel/findByPage?pageSize=' + pageSize + '&currentPage=' + currentPage, params);
  },
  getModelList(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModelRel/findByPage', params);
  },
  //数据模型添加（新增）
  getModelAdd(params) {
    return http.post(store.state.SERVICE.bigData.daq + '/dpmModel/save', params);
  },
  //模型启用;
  ModelState(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/dpmModel/enableOrUn', params);
  },
  //数据模型查看
  getCheckOneData(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModel/findOne', params);
  },
  // 启用
  modelAble(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/dpmModel/enableOrUn', params);
  },
  // 禁用
  modelDisable(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/dpmModel/JyModel', params);
  },
  // 查看主模型
  getDetail(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findall', params);
  },
  //附模型byid获取；
  getAttachedModel(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModelRel/findfieldbyId', params);
  },
  //数据模型编辑
  updateData(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/dpmModel/update', params);
  },
  //数据模型删除
  deleteColData(params) {
    return http.delete(store.state.SERVICE.bigData.daq + '/dpmModel/delete', params);
  },
  //获取数据类型（下拉）
  getDataSelectType(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectDicByCode', params);
  },
  //模型关系分页list;
  getrelationList(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModelRel/findByPage', params);
  },
  //模型关系添加；
  getrelationAdd(params) {
    return http.post(store.state.SERVICE.bigData.daq + '/dpmModelRel/save', params);
  },
  //模型关系编辑;
  getrelationEdit(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/dpmModelRel/update', params);
  },
  //模型关系查看;
  getrelationshow(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModelRel/findOne', params);
  },
  //模型关系删除;
  getrelationRemove(params) {
    return http.delete(store.state.SERVICE.bigData.daq + '/dpmModelRel/delete', params);
  },
  //主表；
  choiseCleanList(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectsoceName', params);
  },
  //模型关系分页list;
  getrelationList(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModelRel/findByPage', params);
  },
  //模型关系添加；
  getrelationAdd(params) {
    return http.post(store.state.SERVICE.bigData.daq + '/dpmModelRel/save', params);
  },
  //模型关系编辑;
  getrelationEdit(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/dpmModelRel/update', params);
  },
  //模型关系查看;
  getrelationshow(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModelRel/findOne', params);
  },
  //模型关系删除;
  getrelationRemove(params) {
    return http.delete(store.state.SERVICE.bigData.daq + '/dpmModelRel/delete', params);
  },
  //字段查询；
  choiseCleanWords(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findByTableModelName', params);
  },
  //字段查询111；
  choiseCleanWordsNew(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findall', params);
  },
  //按钮权限
  getmodelParams(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
  //获取数据类型（下拉）
  getDataSelectType(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectDicByCode', params);
  },
  //获取数据源
  getDataSourceAll(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectsoceName', params);
  },

  //数据模型填充映射管理设置添加
  saveSetting(params) {
    return http.post(store.state.SERVICE.bigData.daq + '/dpmModelMapping/save', params);
  },

  //获取设置字段数据
  getModelSettingList(params) {
    return http.post(store.state.SERVICE.bigData.daq + '/dpmModelMapping/findAll', params);
  },
  //模型关联关系查询；
  getmodalUnit(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dpmModelRel/findAllMoid', params);
  },

  //按钮权限
  getBtnFusePower(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
  //清洗表查询-表类型；
  cleanAddtableType(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectDicByCode', params);
  },
  // 清洗列表
  getAllCleanList(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectsoceName', params);
  },
}




