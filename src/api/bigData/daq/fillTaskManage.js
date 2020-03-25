import http from '../../http';
import store from '../../../store';

export default {
    service: `${store.state.SERVICE.bigData.daq}`,
    // 禁用/启用数据填充任务
    ProhibitDataFillingTask(params) {
        return http.put(`${this.service}/ProhibitDataFillingTask`, params);
    },
    // 启动任务
    StartTask(params) {
        return http.put(`${this.service}/StartTask`, params);
    },
    // 删除数据填充任务
    deleteDataFillingTask(params) {
        return http.delete(`${this.service}/deleteDataFillingTask`, params);
    },
    // 添加数据填充任务
    insertDataFillingTask(params) {
        return http.post(`${this.service}/insertDataFillingTask`, params);
    },
    // 查询数据填充任务
    selectAllDataFillingTask(params) {
        return http.get(`${this.service}/selectAllDataFillingTask`, params);
    },
    // 根据ID查看数据填充任务版本信息
    selectDataFillingTaskEditionKey(params) {
        return http.get(`${this.service}/selectDataFillingTaskEditionKey`, params);
    },
    // 根据ID查看数据填充任务
    selectDataFillingTaskKey(params) {
        return http.get(`${this.service}/selectDataFillingTaskKey`, params);
    },
    // 修改数据填充任务
    updateDataFillingTask(params) {
        return http.put(`${this.service}/updateDataFillingTask`, params);
    },
    //查询基础库下拉
  selectAllBaseLibrary(params) {
    return http.get(`${this.service}/selectAllBaseLibrary`, params);
  },
  
  // 查询填充规则 selectAllDataFillingRulesk
  selectAllDataFillingRulesk(params) {
    return http.get(`${this.service}/selectAllDataFillingRulesk`, params);
  },

  // 启用
  ProhibitDataFillingTaskQ(params) {
    return http.put(`${this.service}/ProhibitDataFillingTaskQ`, params);
  },
  // 禁用
  ProhibitDataFillingTaskJ(params) {
    return http.put(`${this.service}/ProhibitDataFillingTaskJ`, params);
  },

  // 手动启动
  StartTask(params) {
    return http.put(`${this.service}/StartTask`, params);
  }
};
