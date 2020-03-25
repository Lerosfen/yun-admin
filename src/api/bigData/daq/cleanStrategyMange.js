import http from '../../http';
import store from '../../../store';

export default {

  // 分页查询
  service: `${store.state.SERVICE.bigData.daq}`,
  service1: `${store.state.SERVICE.bigData.basic}`,
    clearstrategyList(params) {
    return http.get(`${this.service}/cleaningStrategy/selectAllByPage`, params);
  },
  //清洗增加确认
  cleanAddSubmit1(params){
    return http.post(`${this.service}/cleaningStrategy/OnlyCleaningStrategy`,params);
  },
  //操作策略；
  caozuoStrategy(params){
    return http.put(`${this.service}/cleaningStrategy/updateCleaningRecord`, params);
  },
  //操作执行；
  caozuoZhixing(params){
    return http.get(`${this.service}/cleaningStrategy/sendCleaningStrategyMsg`, params);
  },
  //删除主键清洗策略；
  cleartrategy(params){
    return http.delete(`${this.service}/cleaningStrategy/deleteCleaningStrategyById`, params);
  },
  //添加里面获取清洗列表;
  choiseCleanList(params){
    return http.get(`${this.service}/syncTable/selectByPage`, params);
  },
  // 清洗列表
  getAllCleanList(params){
    return http.get(`${this.service}/syncTable/selectsoceName`, params);
  },
  //添加里面获取清洗字段，
  choiseCleanWords(params){
    return http.get(`${this.service}/syncfield/findall`, params);
  },
  // 获取清洗字段
  getAllCleanWords(params){
    return http.get(`${this.service}/syncfield/findByTableModelNamePage`, params);
  },
  //清洗表查询-表类型；
  cleanAddtableType(params)
  {
    return http.get(`${this.service1}/home/selectDicByCode`, params);
  },
  //清洗表查询-数据源；
  cleanAddtableDB(params)
  {
    return http.get(`${this.service}/dataSource/selectAllDataSource`, params);
  },
  // 查询采集源
  getAllcleanTable(params){
    return http.get(`${this.service}/strategy/findAllStrategy`, params);
  },
  //清洗数据新增;
  cleanSubmit(params){
    return http.post(`${this.service}/cleaningStrategy/insertCleaningStrategy`, params);
  },
  //按钮权限
  getcleanparams(params){
      return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
   //启用
   ableClean(params){
    return http.put(store.state.SERVICE.bigData.daq + '/cleaningStrategy/sendCleaningStrategy', params);
  },
  //启用
   EnableClean(params){
    return http.put(store.state.SERVICE.bigData.daq + '/cleaningStrategy/JyCleaningStrategyById', params);
  },
  // 清洗规则
  getAllClean(params){
    return http.get(store.state.SERVICE.bigData.daq + '/CleaningJar/findByAll', params);
  },
  // 详情
  getCleanById(params){
    return http.get(store.state.SERVICE.bigData.daq + '/cleaningStrategy/selectCleaningStrategyById', params);
  },
// 分页查询所有脚本清洗策略
  selectAllScriptByPage(params){
    return http.get(store.state.SERVICE.bigData.daq + '/cleaningStrategy/selectAllScriptByPage', params);
  },

  //获取脚本类型
  getDatabaseType(params)
  {
    return http.get(store.state.SERVICE.bigData.basic +'/home/selectDicByCode', params);
  },
};
