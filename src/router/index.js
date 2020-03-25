/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import api from '../api/bigData/getMeanu';

Vue.use(Router);
if (sessionStorage.getItem('token')) {
  store.commit('set_token', sessionStorage.getItem('token'));
  sessionStorage['menuLink'] = 'metaDataSource';
}
var defaultLink;

function getMenu() {
  var sid = sessionStorage.sid;
  api.getMeanu({ sysId: sid })
    .then(res => {
      if (res.code == 'code_200') {
        var list = res.data;
        var firstArr = list.filter(item => {
          return !item.pid;
        });
        firstArr.forEach(e => {
          e.children = [];
          list.forEach(item => {
            if (e.id == item.pid) {
              e.children.push(item);
              e.children.forEach(se => {
                se.children = [];
                se.showChild = false;
                list.forEach(item => {
                  if (se.id == item.pid) {
                    se.children.push(item);
                    se.children.forEach(th => {
                      th.children = [];
                      list.forEach(item => {
                        if (th.id == item.pid) {
                          th.children.push(item);
                        }
                      });
                    });
                  }
                });
                var index = localStorage['menuIndex'];
                index ? e.children[index].showChild = true : e.children[0].showChild = true;
              });
            }
          });
        });
      }
      defaultLink = firstArr[0].children[0].children[0].menuLink;
    });
}

// getMenu()
// console.log('defaultLink', defaultLink)
// const defaultCompoment = {
//   template: '<div>User</div>'
// }
export default function () {
  // 路由配置
  let router = new Router({
    routes: [
      {
        path: '/',
        redirect: '/daq',//路由重定向
      },
      {
        path: '/daq',
        components:
          {
            default: resolve => require(['@/page/contentView'], resolve),
            content: resolve => require(['@/page/contentView'], resolve)
          },
        children: [
          {
            path: '/',
            redirect: defaultLink ? defaultLink : 'metaDataSource',//路由重定向
          },
          {
            path: 'colStrategyAdd',
            components: {
              dataView: resolve => require(['@/page/colStrategyManage/colStrategy-add/colStrategy-add'], resolve)
            }
          },
          {
            path: 'colRecordManage',
            components: {
              dataView: resolve => require(['@/page/colRecordManage/colRecordManage'], resolve)
            }
          },
          {
            path: 'colStrategyManage',
            components: {
              dataView: resolve => require(['@/page/colStrategyManage/colStrategyManage'], resolve)
            }
          },
          {
            path: 'metaDataSource',
            components: {
              dataView: resolve => require(['@/page/metaDataSource/metaDataSource'], resolve)
            }
          },

          {
            path: 'cleanStrategyMange',
            components: {
              dataView: resolve => require(['@/page/cleanStrategyMange/cleanStrategyMange'], resolve)
            }
          },
          {
            path: 'cleanStrategyAdd',
            components: {
              dataView: resolve => require(['@/page/cleanStrategyMange/cleansStrategy-add/cleansStrategy-add'], resolve)
            }
          },
          {
            path: 'cleansStrategy-addH',
            components: {
              dataView: resolve => require(['@/page/cleanStrategyMange/cleansStrategy-addH/cleansStrategy-addH'], resolve)
            }
          },
          {
            path: 'cleansStrategyAddHJ',
            components: {
              dataView: resolve => require(['@/page/cleanStrategyMange/cleansStrategy-addH/cleanStrategy-addHJ/cleanStrategy-addHJ'], resolve)
            }
          },
          // 查看
          {
            path: 'cleansStrategyAddHJC',
            components: {
              dataView: resolve => require(['@/page/cleanStrategyMange/cleansStrategy-addH/cleanStrategy-addHJ/cleanStrategy-addHJC'], resolve)
            }
          },
          // 编辑
          {
            path: 'cleansStrategyAddHJB',
            components: {
              dataView: resolve => require(['@/page/cleanStrategyMange/cleansStrategy-addH/cleanStrategy-addHJ/cleanStrategy-addHJB'], resolve)
            }
          },
          {
            path: 'qualityTest',  //质量检测
            components: {
              dataView: resolve => require(['@/page/qualityTest/qualityTest'], resolve)
            }
          },
          {
            path: 'qualityTestRecord',  //质量检测记录
            components: {
              dataView: resolve => require(['@/page/qualityTestRecord/qualityTestRecord'], resolve)
            }
          },
          {
            path: 'fuseStrategy',  //数据融合
            components: {
              dataView: resolve => require(['@/page/fuseStrategy/fuseStrategy'], resolve)
            }
          },
          {
            path: 'fuseStrategy-add',  //数据融合添加
            name: 'fuseStrategyAdd',
            components: {
              dataView: resolve => require(['@/page/fuseStrategy/fuseStrategy-add/fuseStrategy_add'], resolve)
            }
          },
          {
            path: 'fuseStrategy-addH',  //数据融合行融合
            name: 'fuseStrategyAddH',
            components: {
              dataView: resolve => require(['@/page/fuseStrategy/fuseStrategy-addH/fuseStrategy_addH'], resolve)
            }
          },
          {
            path: 'fuseStrategy-addHC',  //数据融合行融合查看
            components: {
              dataView: resolve => require(['@/page/fuseStrategy/fuseStrategy-addHC'], resolve)
            }
          },

          {
            path: 'qualityTestAdd',  //质量检测添加
            components: {
              dataView: resolve => require(['@/page/qualityTest/qualityTest-add/qualityTest-add'], resolve)
            }
          },
          {
            path: 'dateModel',  //数据模型
            components: {
              dataView: resolve => require(['@/page/dataModel/dataModel'], resolve)
            }
          },
          {
            path: 'dataModel_setting',  //数据模型设置
            name: 'dataModel_setting',
            components: {
              dataView: resolve => require(['@/page/dataModel/dataModel_setting/dataModel_setting'], resolve)
            }
          },
          {
            path: 'relationalManage',  //数据模型关联管理
            components: {
              dataView: resolve => require(['@/page/dataModelrelationalManage/relationalManage'], resolve)
            }
          },

          {
            path: 'relationalManageAdd',  //数据模型关联管理新增
            components: {
              dataView: resolve => require(['@/page/dataModelrelationalManage/relationalManage-add/relationalManage-add'], resolve)
            }
          },
          {
            path: 'monitoringResultSearch',  //数据服务监控结果查询
            components: {
              dataView: resolve => require(['@/page/severMonitoring/monitoringResultSearch'], resolve)
            }
          },
          {
            path: 'modelService',  //模型申请
            components: {
              dataView: resolve => require(['@/page/modelService/modelService'], resolve)
            }
          },
          {
            path: 'modelAudit',  //模型审核
            components: {
              dataView: resolve => require(['@/page/modelAudit/modelAudit'], resolve)
            }
          },
          {
            path: 'cleanRuleManage',  //模型审核
            components: {
              dataView: resolve => require(['@/page/cleanRuleManage/cleanRuleManage'], resolve)
            }
          },


          /****************************************基础库管理**************************************/
          {
            path: 'baseStoreManage',  //基础库管理
            components: {
              dataView: resolve => require(['@/page/baseStoreManage/baseStoreManage'], resolve)
            }
          },
          {
            path: 'metaDataMaintain',  //元数据维护
            components: {
              dataView: resolve => require(['@/page/metaDataMaintain/metaDataMaintain'], resolve)
            }
          },
          {
            path: 'metaDataTplManage',  //元数据模板管理
            components: {
              dataView: resolve => require(['@/page/metaDataTplManage/metaDataTplManage'], resolve)
            }
          },
          {
            path: 'addMetaDataTpl',     // 新增元数据模板
            components: {
              dataView: resolve => require(['@/page/metaDataTplManage/addMetaDataTpl/addMetaDataTpl'], resolve)
            }
          },
          {
            path: 'checkMetaDataTpl',     // 查看元数据模板
            components: {
              dataView: resolve => require(['@/page/metaDataTplManage/checkMetaDataTpl/checkMetaDataTpl'], resolve)
            }
          },
          {
            path: 'modifyMetaDataTpl',     // 编辑元数据模板
            components: {
              dataView: resolve => require(['@/page/metaDataTplManage/modifyMetaDataTpl/modifyMetaDataTpl'], resolve)
            }
          },
          {
            path: 'baseTableManage', // 基础表管理
            components: {
              dataView: resolve => require(['@/page/baseTableManage/baseTableManage'], resolve)
            }
          },
          {
            path: 'addBaseTable',    // 新增基础表
            components: {
              dataView: resolve => require(['@/page/baseTableManage/addBaseTable/addBaseTable'], resolve)
            }
          },
          {
            path: 'checkBaseTable',    // 查看基础表
            components: {
              dataView: resolve => require(['@/page/baseTableManage/checkBaseTable/checkBaseTable'], resolve)
            }
          },
          {
            path: 'modifyBaseTable',    // 编辑基础表
            components: {
              dataView: resolve => require(['@/page/baseTableManage/modifyBaseTable/modifyBaseTable'], resolve)
            }
          },
          {
            path: 'fillRuleManage',  // 填充规则管理
            components: {
              dataView: resolve => require(['@/page/fillRuleManage/fillRuleManage'], resolve)
            }
          },
          {
            path: 'addFillRule',  // 新增填充规则
            components: {
              dataView: resolve => require(['@/page/fillRuleManage/addFillRule/addFillRule'], resolve)
            }
          },
          {
            path: 'modifyFillRule',  // 修改填充规则
            components: {
              dataView: resolve => require(['@/page/fillRuleManage/modifyFillRule/modifyFillRule'], resolve)
            }
          },
          {
            path: 'checkFillRule',  // 查看填充规则
            components: {
              dataView: resolve => require(['@/page/fillRuleManage/checkFillRule/checkFillRule'], resolve)
            }
          },
          {
            path: 'fillTaskManage',  // 填充任务管理
            components: {
              dataView: resolve => require(['@/page/fillTaskManage/fillTaskManage'], resolve)
            }
          },
          // {
          //   path: 'addFillTask',  // 添加填充任务
          //   components: {
          //     dataView: resolve => require(['@/page/fillTaskManage/addFillTask/addFillTask'], resolve)
          //   }
          // },

          {
            path: 'taskLogRecord',  // 任务日志记录
            components: {
              dataView: resolve => require(['@/page/taskLogRecord/taskLogRecord'], resolve)
            }
          },
          /*{
            path: 'queryMaintain',  // 查询维护
            components: {
              dataView: resolve => require(['@/page/queryMaintain/queryMaintain'], resolve)
            }
          },
          {
            path: 'configCondition',  // 查询维护 => 配置条件
            components: {
              dataView: resolve => require(['@/page/queryMaintain/configCondition/configCondition'], resolve)
            }
          },
          {
            path: 'imgLabelManage',  //图像标签管理
            components: {
              dataView: resolve => require(['@/page/imgLabelManage/imgLabelManage'], resolve)
            }
          },
          {
            path: 'chartConfig',  //图像配置
            components: {
              dataView: resolve => require(['@/page/chartConfig/chartConfig'], resolve)
            }
          },*/
          {
            path: 'basicMonitoring',  //图像配置
            components: {
              dataView: resolve => require(['@/page/basicMonitoring/basicMonitoring'], resolve)
            }
          },
          // {
          //   path:'basicBaseVisulization', //基础库可视化
          //   components:{
          //     default: resolve => require(['@/page/basicBaseVisualization/basicBaseVisulization'], resolve),
          //     // dataView: resolve => require(['@/page/basicBaseVisualization/basicBaseVisulization'], resolve)
          //   }
          // },
        ]
      },
      /*********************************************基础库可视化*************************************************/
      /*
      基础库可视化平台   catalog                                                      8    2019-04-30 14:54:08
        基础库可视化            menu      /basicBaseVisulization               1    2019-04-30 16:50:02
          可视化统计记录         btn         /VisualStatistical         GET      1    2019-10-15 15:05:00
      */
      {
        path: '/basicBaseVisulization', //基础库可视化
        name: 'basicBaseVisulization',
        components: {
          default: resolve => require(['@/page/basicBaseVisualization/basicBaseVisulization'], resolve),
          content: resolve => require(['@/page/basicBaseVisualization/basicBaseVisulization'], resolve)
        },
        children: [
          {
            path: '/',
            redirect: defaultLink ? defaultLink : 'general',//路由重定向
          },
          {
            path: 'general', //概况
            components: {
              dataView: resolve => require(['@/page/basicBaseVisualization/visualizationContentGeneral/visualization-general'], resolve)
            }
          },
          {
            path: 'inquire', //查询
            components: {
              dataView: resolve => require(['@/page/basicBaseVisualization/visualizationContentInquire/visualizationContent-inquire'], resolve)
            }
          },
          {
            path: 'inquireBase', //宏观经济库，权利事项库，社会信用库
            components: {
              dataView: resolve => require(['@/page/basicBaseVisualization/visualizationContentInquireTableBase/visualizationContent-inquireBase'], resolve)
            }
          },
          {
            path: 'statistical',  //统计
            components: {
              dataView: resolve => require(['@/page/basicBaseVisualization/visualizationContentStatistical/visualizationContent-statistical'], resolve)
            }
          },
          {
            path: 'forecast',  //预测
            components: {
              dataView: resolve => require(['@/page/basicBaseVisualization/visualizationContentForecast/visualizationContent-forecast'], resolve)
            }
          },
          {
            path: 'portrayal',  //画像
            components: {
              dataView: resolve => require(['@/page/basicBaseVisualization/visualizationContentPortrayal/visualizationContent-portrayal'], resolve)
            }
          },
          {
            path: 'generalDatail',  //概况详情
            components: {
              dataView: resolve => require(['@/page/basicBaseVisualization/visualizationContentportrayalDatail/visualizationContentportrayal-datail'], resolve)
            }
          },
        ],
      },
    ]
  });
  router.beforeEach((to, from, next) => {
    if (sessionStorage['token']) {
      next();
    } else {
      let hrefTest = window.location.href.split('/')[2];
      window.location.href = hrefTest;
    }
  });
  return router;
}

