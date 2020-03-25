import http from '../../http';
import store from '../../../store';

export default {
    service: `${store.state.SERVICE.bigData.daq}`,
    // 删除基础表
    deleteBasicTableManagement(params) {
        return http.delete(`${this.service}/deleteBasicTableManagement`, params);
    },
    // 新增基础表
    insertBasicTableManagement(params) {
        return http.post(`${this.service}/insertBasicTableManagement`, params);
    },
    // 查找基础表
    selectAllBasicTableManagement(params) {
        return http.get(`${this.service}/selectAllBasicTableManagement`, params);
    },
    // 查找显示字段
    selectBasicTableManagementField(params) {
        return http.get(`${this.service}/selectBasicTableManagementField`, params);
    },
    // 根据id查看基础表
    selectBasicTableManagementKey(params) {
        return http.get(`${this.service}/selectBasicTableManagementKey`, params);
    },
    // 修改显示字段
    updateBasicTableManagementField(params) {
        return http.get(`${this.service}/updateBasicTableManagementField`, params);
    },
    // 修改基础表
    updateByPrimaryKeySelective(params) {
        return http.put(`${this.service}/updateByPrimaryKeySelective`, params);
    },
    // 查询元数据模板
    selectAllMetadataTemplate(params) {
        return http.get(`${this.service}/selectAllMetadataTemplate`, params);
    },
    // 根据ID查看元数据模版
    selectMetadataTemplateKey(params) {
        return http.get(`${this.service}/selectMetadataTemplateKey`, params);
    },
    // 根据元数据模版之外查找元数据
    selectOutsideTemplate(params) {
        return http.get(`${this.service}/selectOutsideTemplate`, params);
    },
    //查询所有基础库下拉
    selectAllBaseLibrary(params) {
        return http.get(`${this.service}/selectAllBaseLibrary`, params);
    },
    //版本信息
    selectBasicTableManagementEdition(params) {
        return http.get(`${this.service}/selectBasicTableManagementEdition`, params);
    },
    //版本信息详情
    selectBasicTableManagementEditionKey(params) {
        return http.get(`${this.service}/selectBasicTableManagementEditionKey`, params);
    },

};
