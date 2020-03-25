import http from '../../http';
import store from '../../../store';

export default {
  //查询融合机制表数据
  getFuseStrategy(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/fuseStrategy/findallFusegyService', params);
  },

  // 单体查询融合机制表数据
  getOnlyFuseStrategy(data) {
    return http.get(store.state.SERVICE.bigData.daq + '/fuseStrategy/findByFuseStrategyId', data);
  },

  // 新增融合机制表数据
  addFuseStrategy(data) {
    return http.post(store.state.SERVICE.bigData.daq + '/fuseStrategy/insertFuseStrategy', data);
  },

  // 修改融合机制表的状态
  modifyFuseStrategy(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/fuseStrategy/updateFuseStrategy', params);
  },
  // 删除
  delFuseStrategy(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/fuseStrategy/updateFuseStrategy', params);
  },


  //操作执行；
  // caozuoZhixing(params) {
  //   return http.get(store.state.SERVICE.bigData.daq+'/cleaningStrategy/sendCleaningStrategyMsg', params);
  // },
  //删除主键清洗策略；
  // cleartrategy(params) {
  //   return http.get(store.state.SERVICE.bigData.daq+'/cleaningStrategy/deleteCleaningStrategyById', params);
  // },
  //添加里面获取列表;
  choiseCleanList(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectByPage', params);
  },
  // 获取融合主表
  getFuseTable(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectsoceName', params);
  },
  //添加里面获取字段，
  choiseCleanWords(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findall', params);
  },
  // 选择字段列表
  getAllWords(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findByTableModelName', params);
  },
  //清洗表查询-表类型；
  cleanAddtableType(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectDicByCode', params);
  },
  //清洗表查询-数据源；
  cleanAddtableDB(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dataSource/selectAllDataSource', params);
  },
  //清洗数据新增;
  // cleanSubmit(params) {
  //   return http.post(`${this.service}/cleaningStrategy/insertCleaningStrategy`, params);
  // },

  //按钮权限
  getBtnFusePower(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
  // 启用接口
  ableFuse(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/fuseStrategy/sendFuseStrategy', params);
  },
  // 禁用接口
  disableFuse(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/fuseStrategy/JyFuseStrategy', params);
  },




  // 根据主键ID查询行融合机制表数据
  findByHangFuseStrategyId(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/fuseStrategy/findByHangFuseStrategyId', params);
  },








}
