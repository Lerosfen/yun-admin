<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData" v-if="btn.saveStrategy==1">新增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <label for class="yellow middle m-r-10">策略名称</label>
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder v-model="strategyName"></el-input>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="search()">查询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="reset()">重置</div>
        </div>
      </div>
      <!--列表-->
      <div class="table-container pag-position">
        <el-table :row-class-name="tableRowClassName" :data="tableData" style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :key="item.id"
            :show-overflow-tooltip="true"
            :highlight-current-row="true"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="160"
            v-if="btn.queryStrategyTable||btn.updateStrategy||btn.deleteStrategy||btn.startStrategy"
          >
            <template slot-scope="scope">
              <!--<el-button @click="handleClick(scope.row,list.type,scope.$index)" type="text" size="small"-->
              <!--v-for="list in operate">-->
              <!--{{list.txt}}-->
              <!--</el-button>-->
              <el-button
                @click="handleClick(scope.row,1)"
                type="text"
                size="small"
                v-if="btn.queryStrategyTable==1"
              >查看
              </el-button>
              <el-button
                @click="handleClick(scope.row,2)"
                type="text"
                size="small"
                v-if="btn.updateStrategy==1 && scope.row.runState=='未执行' "
              >编辑
              </el-button>
              <el-button
                @click="handleClick(scope.row,3)"
                type="text"
                size="small"
                v-if="btn.deleteStrategy==1"
              >删除
              </el-button>
              <el-button
                @click="handleClick(scope.row,4)"
                type="text"
                size="small"
                v-if="btn.startStrategy==1"
              >{{scope.row.enableState=='2'?'启动':'撤销'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  var qs = require('qs');
  import api from '../../api/bigData/daq/colStrategyManage';
  import Vue from 'vue';

  export default {
    name: 'olStrategyManage',
    data() {
      return {
        titles: '采集策略管理',
        isVisible: false,
        startNum: true,
        tableData: [], //
        oldTableData: [],
        disabledflag: false,
        headerData: [
          {
            prop: 'strategyName',
            label: '策略名称',
            width: ''
          },
          {
            prop: 'dataSource.sourceName',
            label: '数据源',
            width: ''
          },
          {
            prop: 'timingState',
            label: '是否定时',
            width: ''
          },
          {
            prop: 'timingRules',
            label: '定时规则',
            width: ''
          },
          {
            prop: 'runState',
            label: '运行状态',
            width: ''
          },
          //  {
          //    prop: 'reslutState',
          //    label: '结果状态',
          //     width:'',
          //  },
          /* {
              prop: 'createTime',
              label: '创建时间'
            },*/
          {
            prop: 'updateTime',
            label: '修改时间',
            width: ''
          }
        ],
        operate: [
          {
            type: 1,
            txt: '查看'
          },
          {
            type: 2,
            txt: '编辑'
          },
          {
            type: 3,
            txt: '删除'
          },
          {
            type: 4,
            txt: '启动'
          }
        ],
        listTable: [],
        strategyName: '', //策略名称
        // runningState:'',//启用状态
        selArr: [],
        totalNum: 1,
        pageSize: 10,
        currentPage: 1,
        isDisabled: true,
        addFormVisible: false, //添加界面是否显示
        editFormVisible: false, //编辑界面是否显示
        examineFormVisible: false, //查看界面是否显示
        //添加相关数据
        // addFormResource: {
        //   configName: [
        //     {validator: true, message: '配置名称', trigger: 'blur'}
        //   ],
        //   configKey: [
        //     {validator: true, message: '配置键', trigger: 'blur'}
        //   ],
        //
        //   configValue: [
        //     {validator: true, message: '配置值', trigger: 'blur'}
        //   ],
        //   configDes: [
        //     {validator: true, message: '配置描述', trigger: 'blur'}
        //   ]
        // },
        //添加绑定的数据
        // addForm: {
        //   configName: '',
        //   configKey: '',
        //   configValue: '',
        //   configDesc: '',
        //   runningState: ''//启用状态
        // },
        //按钮判断
        btn: {
          saveStrategy: 0,
          queryStrategyTable: 0,
          updateStrategy: 0,
          deleteStrategy: 0,
          startStrategy: 0
        }
      };
    },
    methods: {
      //执行中，当前行置灰,且 删除、 启动 按钮不可点击
      tableRowClassName({ row, runState }) {
        runState = row.runState;
        if (runState === '执行中') {
          return 'success-row1';
        }
        return '';
      },
      //初始化请求数据
      initColStrange() {
        var self = this;
        api
          .getColStrange({
            strategyName: self.strategyName,
            pageSize: self.pageSize,
            currentPage: self.currentPage
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              res.data.forEach(value => {
                value.createTime = self.formatDate(value.createTime);
                value.updateTime = self.formatDate(value.updateTime);
                value.timingState = value.timingState == 1 ? '是' : '否';
                value.runState = self.checkRunState(value.runState);
                value.reslutState = self.checkResultState(value.reslutState);
              });
              console.log('data', res);
              self.tableData = res.data;
              self.totalNum = res.page.totalNumber;
            }
          });
      },
      checkRunState(state) {
        if (state == '0') {
          state = '未执行';
        } else if (state == '1') {
          state = '执行中';
        } else if (state == '2') {
          state = '已完成';
        } else {
          state = '失败';
        }
        return state;
      },
      checkResultState(state) {
        if (state == '0') {
          state = '未知';
        } else if (state == '1') {
          state = '成功';
        } else {
          state = '失败';
        }
        return state;
      },

      //搜索
      // search(){
      //   var self=this;
      //   self.tableData = [];
      //   self.listTable.forEach((item, index)=>{
      //     if(item.strategyName == self.strategyName){
      //       self.tableData.push(item);
      //     }
      //
      //   })
      //
      // },
      //操作点击事件 tyoe 1 查看 2编辑
      handleClick(data, type) {
        // return;
        var self = this;
        if (type == 1 || type == 2) {
          console.log('row', data);
          self.$router.push({
            path: 'colStrategyAdd',
            query: {
              type: type,
              menuLink: this.$route.query.menuLink,
              obj: data.id
            }
          });
        }
        if (type == 3) {
          self
            .$confirm('确定要删除选中的采集策略吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'blue-btn btn-custom-cancel',
              confirmButtonClass: 'yellow-btn btn-custom-confirm', // 以上两个按钮添加btn-custom-XXX来控制按钮位置
              type: 'warning',
              center: true
              // type: 'warning',
              //   confirmButtonText: '确定',
              //   cancelButtonText: '取消',
              //   cancelButtonClass: 'blue-btn btn-custom-cancel',
              //   confirmButtonClass: 'yellow-btn btn-custom-confirm',// 以上两个按钮添加btn-custom-XXX来控制按钮位置
              // center: true
            })
            .then(() => {
              //            self.tableData.splice(index, 1);
              api.deleteColStrate({ strategyId: data.id })
                .then(
                  res => {
                    if (res.code === 'code_200') {
                      self.initColStrange();
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      self.initColStrange();
                    } else {
                      this.$message({
                        type: 'error',
                        message: '删除失败!'
                      });
                    }
                  },
                  errorRes => {
                    console.log('删除失败的回调', errorRes);
                  }
                );
            })
            .catch(() => {
            });
        }
        if (type == 4) {
          if (data.enableState == '2') {
            this.able(data);
            setTimeout(() => {
              this.$notify({ type: 'success', offset: 100, message: '启动成功' });
              this.initColStrange();
            }, 500);
          }
          if (data.enableState == '1') {
            this.disable(data);
          }
        }
      },

      // 启动
      able(data) {
        // this.$store.commit("showLoading", true);
        api.StartColSrtage(qs.stringify({ strategyId: data.id }))
          .then(res => {
            if (res.code === 'code_200') {
              // self.initColStrange();
              // this.$store.commit("hideLoading", false);
              // this.$notify({
              //   tittle: "成功",
              //   message: res.msg,
              //   type: "success",
              //   offset: 100,
              //   duration: this.$store.state.el_Duration
              // });
              this.initColStrange();
            } else {
              // this.$store.commit("hideLoading", false);
              this.$notify({
                type: 'error',
                message: res.msg
              });
            }
          });
      },
      // 撤销
      disable(data) {
        api
          .disableColStrange(
            qs.stringify({ strategyId: data.id, enableState: '2' })
          )
          .then(
            res => {
              if (res.code === 'code_200') {
                // self.initColStrange();

                this.$notify({
                  tittle: '成功',
                  message: res.msg,
                  type: 'success',
                  offset: 100,
                  duration: this.$store.state.el_Duration
                });

                this.initColStrange();
              } else {
                // this.$notify({
                //     tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
                //   });
                this.$message({
                  type: 'error',
                  message: '撤销失败!'
                });
              }
            },
            errorRes => {
              //    this.$notify({
              //         tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
              //       });
              console.log('删除失败的回调', errorRes);
            }
          )
          .catch(() => {
            console.log('删除失败的回调', errorRes);
          });
      },
      //查询
      search() {
        // var self = this;
        // self.currentPage = 2;
        this.initColStrange();
      },

      //重置
      reset() {
        var self = this;
        self.strategyName = '';
        this.initColStrange();
      },
      //多选
      selChange(selection) {
        var self = this;
        self.selArr = selection;
      },
      //新增
      addData() {
        this.addFormVisible = true;
        var self = this;
        self.$router.push({
          path: 'colStrategyAdd',
          query: {
            type: 0,
            menuLink: this.$route.query.menuLink
          }
        });
      },

      //每页显示数据量编辑
      handleSizeChange: function (val) {
        var self = this;
        self.pageSize = val;
        self.initColStrange();
      },

      //页码编辑
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.initColStrange();
      },
      //获取按钮权限
      getParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api
          .getBtnPower({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              console.log('res', res.data);
              res.data.forEach(item => {
                if (item.includes('saveStrategy@POST')) {
                  self.btn.saveStrategy = 1;
                }
                if (item.includes('queryStrategyTable@GET')) {
                  self.btn.queryStrategyTable = 1;
                }
                if (item.includes('deleteStrategy@DELETE')) {
                  self.btn.deleteStrategy = 1;
                }
                if (item.includes('updateStrategy@PUT')) {
                  self.btn.updateStrategy = 1;
                }
                if (item.includes('startStrategy@GET')) {
                  self.btn.startStrategy = 1;
                }
              });
            }
          });
      }
    },
    mounted() {
      const self = this;
      self.$store.commit('showLoading', true);
      self.initColStrange();
      self.getParams();
    }
  };
</script>
<style lang="less" type="text/less">
  @import "colStrategyManage.less";
</style>
