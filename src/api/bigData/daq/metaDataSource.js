
import http from '../../http';
import store from '../../../store';

export default {
  //查询所有数据源
  getDataSource(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dataSource/findAll', params);
  },

  //添加数据
  addDataSource(data) {
    return http.post(store.state.SERVICE.bigData.daq + '/dataSource/saveDataSource', data);
  },

  //删除数据源信息
  // deleteDataSource(params) {
  //   return http.post(store.state.SERVICE.bigData.daq + '/dataSource/saveDataSource', params);
  // },

  //编辑数据源信息
  modifyDataSource(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/dataSource/updateDataSource', params);
  },

  //单体查询
  getOnlyDataSource(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dataSource/findByDataSourceId', params);
  },

  //获取所属的系统
  getSourceSystem(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectDicByCode', params);
  },

  //获取数据库类型
  getDatabaseType(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectDicByCode', params);
  },

  //获取已同步的表数据
  getSyncTableData(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncTable/selectByPage', params);
  },

  //未同步表的数据
  getUnsyncTableData(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dataSource/findSourceNotSyncTable', params)
  },

  //表同步执行
  executeTableSync(params) {
    return http.post(store.state.SERVICE.bigData.daq + '/syncTable/insertSyncTable' + '?' + 'dataSourceId=' + params.dataSourceId + '&syncTableName=' + params.syncTableName + '&types=' + params.syncTableType + '&remark=' + params.remark)
  },

  //查看表字段
  getTableFields(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/syncfield/findall', params)
  },
  //按钮权限
  getBtnMenu(params) {
    return http.get(store.state.SERVICE.bigData.basic + '/home/selectBtnForMenu', params);
  },
  //密码验证
  getLogin(params) {
    return http.get(store.state.SERVICE.bigData.daq  + '/dataSource/authenticateUsers', params);
  },
  //测试连接
  getPassWord(params) {
    return http.get(store.state.SERVICE.bigData.daq + '/dataSource/testConnectionByInfo', params)
  },
  //同步字段接口
  updateReamk(params) {
    return http.put(store.state.SERVICE.bigData.daq + '/syncfield/updateReamk', params)
  },
  //执行同步单个表对象         
  insertOneTable(params) {
    return http.post(store.state.SERVICE.bigData.daq + '/syncTable/insertOneTable' + '?' + 'dataSourceId=' + params.dataSourceId + '&tableName=' + params.tableName + '&types=' + params.types + '&remark=' + params.remark)
  },
}
