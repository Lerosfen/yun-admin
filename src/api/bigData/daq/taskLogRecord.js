import http from '../../http';
import store from '../../../store';

export default {
    service: `${store.state.SERVICE.bigData.daq}`,
    // 添加数据填充任务记录
    insertDataFillingTaskRecord(params) {
        return http.post(`${this.service}/insertDataFillingTaskRecord`, params);
    },
    // 查询当前数据填充任务记录
    selectCurrentDataFillingTaskRecord(params) {
        return http.get(`${this.service}/selectCurrentDataFillingTaskRecord`, params);
    },
    // 查询数据填充任务记录
    selectDataFillingTaskRecord(params) {
        return http.get(`${this.service}/selectDataFillingTaskRecord`, params);
    },
    //查询所有基础库下拉
    selectAllBaseLibrary(params) {
        return http.get(`${this.service}/selectAllBaseLibrary`, params);
    },

};
