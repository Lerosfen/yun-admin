import http from '../../http';
import store from '../../../store';

export default {
    service: `${store.state.SERVICE.bigData.daq}`,
    // 禁用 启用数据填充规则
    ProhibitDataFillingRulese(params) {
        return http.put(`${this.service}/ProhibitDataFillingRulese`, params);
    },
    // 新增数据填充规则管理接口
    insertDataFillingRules(params) {
        return http.post(`${this.service}/insertDataFillingRules`, params);
    },
    // 查询数据填充规则
    selectAllDataFillingRulesk(params) {
        return http.get(`${this.service}/selectAllDataFillingRulesk`, params);
    },
    // 根据ID查看数据填充规则
    selectDataFillingRulesKey(params) {
        return http.get(`${this.service}/selectDataFillingRulesKey`, params);
    },
    // 根据ID查看数据填充规则版本信息
    selectDataFillingRuleseEditionKey(params) {
        return http.get(`${this.service}/selectDataFillingRuleseEditionKey`, params);
    },
    // 修改数据填充规则
    // updateDataFillingRules(params) {
    //     return http.put(`${this.service}/updateDataFillingRules`, params);
    // }
     //查询基础库下拉
    selectAllBaseLibrary(params) {
        return http.get(`${this.service}/selectAllBaseLibrary`, params);
    },
    
    // 选择目标表
    selectAllBasicTableManagement(params) {
        return http.get(`${this.service}/selectAllBasicTableManagement`, params);
    },
    // 根据ID查目标表
    selectBasicTableManagementKey(params) {
        return http.get(`${this.service}/selectBasicTableManagementKey`, params);
    },
    // // 根据目标表查询显示字段
    // selectBasicTableManagementField(params) {
    //     return http.get(`${this.service}/selectBasicTableManagementField`, params);
    // },

     //清洗表查询-表类型；
  cleanAddtableType(params)
  {
    return http.get(`${this.service1}/home/selectDicByCode`, params);
  },
    

  // 清洗列表
  getAllCleanList(params){
    return http.get(`${this.service}/syncTable/selectsoceName`, params);
  },


   // 获取清洗字段
   getAllCleanWords(params){
    return http.get(`${this.service}/syncfield/findByTableModelNamePage`, params);
  },

  

   // 启用
   ProhibitDataFillingRuleseQ(params){
    return http.put(`${this.service}/ProhibitDataFillingRuleseQ`, params);
  },
  // 禁用
  ProhibitDataFillingRuleseJ(params){
    return http.put(`${this.service}/ProhibitDataFillingRuleseJ`, params);
  },


};
