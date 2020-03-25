/**
 * Created by Administrator on 2018/7/20.
 */
import http from '../http';
import store from '../../store';

export  default {
  getMeanu(params){
    return http.get(store.state.SERVICE.bigData.basic + '/resource/selectClickModuleTree', params);
  },
}
