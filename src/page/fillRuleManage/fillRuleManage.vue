<template>
  <!-- 填充规则管理 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles"></list-table-title>
      <!-- 新增 搜索 -->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData">新 增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入规则名称" v-model="iptRuleName"></el-input>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-tpm yellow-input new-input">
              <el-select v-model="statevoid" placeholder="请选择规则状态">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-tpm yellow-input new-input">
              <el-select v-model="storevoid" placeholder="请选择所属库">
                <el-option
                  v-for="item in storeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="Modelsearch()">查 询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="reset()">重 置</div>
        </div>
      </div>

      <!-- 列表 -->
      <div class="table-container pag-position">
        <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :width="item.width"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row,1)" type="text" size="small">查看</el-button>
              <!-- <el-button
                @click="handleClick(scope.row,2)"
                type="text"
                size="small"
                v-if="scope.row.ruleStatus=='禁用'&& btn.enable == 1 "
              >编辑</el-button>-->
              <el-button
                @click="handleClick(scope.row,3)"
                type="text"
                size="small"
                v-if="scope.row.states=='禁用'"
              >启用
              </el-button>
              <el-button
                @click="handleClick(scope.row,3)"
                type="text"
                size="small"
                v-if="scope.row.states=='启用'"
              >禁用
              </el-button>
              <!-- <el-button @click="handleClick(scope.row,5)" type="text" size="small">版本信息</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
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
  var qs = require('qs');
  import api from '../../api/bigData/daq/fillRuleManage';

  export default {
    data() {
      return {
        titles: '数据填充规则管理',
        iptRuleName: '',
        statevoid: '',
        storevoid: '',
        headerData: [
          {
            prop: 'ruleNames',
            label: '规则名称'
          },
          {
            prop: 'basicTableManagementName',
            label: '目标表'
          },
          // {
          //   prop: "masterTable",
          //   label: "采集主表"
          // },
          // {
          //   prop: "columnMapping",
          //   label: "采集副表"
          // },
          {
            prop: 'states',
            label: '状态'
          },
          {
            prop: 'baseLibraryName',
            label: '所属库'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: 150
          },
          {
            prop: 'createUser',
            label: '创建人'
          }
        ],
        statusList: [
          {
            id: 1,
            name: '启用'
          },
          {
            id: 2,
            name: '禁用'
          }
        ],
        storeList: [],
        tableData: [],
        // btn: {
        //   enable: 1, // 初始为0
        //   forbidden: 1
        // },
        totalNum: 1,
        currentPage: 1,
        pageSize: 10
      };
    },
    mounted() {
      var self = this;
      self.$store.commit('showLoading', true);
      self.init();
      self.selectAllBaseLibrary();
    },
    methods: {
      init() {
        var self = this;
        api
          .selectAllDataFillingRulesk({
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            RuleNames: self.iptRuleName,
            states: self.statevoid,
            baseLibraryID: self.storevoid
          })
          .then(res => {
              if (res.code == 'code_200') {
                self.$store.commit('hideLoading', false);
                // self.totalNum = res.page.totalNumber;
                res.data.forEach(item => {
                  switch (item.states) {
                    case '1':
                      item.states = '启用';
                      break;
                    case '2':
                      item.states = '禁用';
                      break;
                  }
                });
                self.tableData = res.data;
                self.tableData.forEach(item => {
                  // 将时间戳转换为时间
                  // item.createTime = new Date(item.createTime).toLocaleString().replace(/:\d{1,2}$/,' ');
                  item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false });
                });
              }
            },
            err => {
              self.$store.commit('hideLoading', false);
            });
      },
      //    查询基础库下拉
      selectAllBaseLibrary() {
        api
          .selectAllBaseLibrary({
            pageSize: 100000,
            currentPage: 1
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.storeList = res.data;
            }
          });
      },
      isBtnShow() {
        // 设置按钮权限..
      },

      addData() {
        this.$router.push({
          path: 'addFillRule'
        });
      },
      handleClick(row, type) {
        if (type == 1) {
          this.$router.push({
            path: 'checkFillRule',
            query: {
              data: row
            }
          });
        }
        if (type == 2) {
          // this.$router.push({
          //   path: "modifyFillRule",
          //   query: {
          //     menuLink: this.$route.query.menuLink,
          //     data: row
          //   }
          // });
        }

        if (type == 3) {
          // api
          //   .ProhibitDataFillingRulese({
          //     id: row.id,
          //     states: row.states == "启用" ? "2" : "1"
          //   })
          //   .then(res => {
          //     if (res.code == "code_200") {
          //       this.$notify({
          //         type: "success",
          //         message: res.message,
          //         offset: 100,
          //         duration: this.$store.state.el_Duration
          //       });
          //       this.init();
          //     } else {
          //       this.$notify({
          //         type: "error",
          //         message: res.msg,
          //         offset: 100,
          //         duration: this.$store.state.el_Duration
          //       });
          //     }
          //   });

          var self = this;
          var thisId = row.id;
          if (row.states == '禁用') {
            api
              .ProhibitDataFillingRuleseQ(qs.stringify({ id: thisId }))
              .then(res => {
                if (res.code == 'code_200') {
                  self.$notify({
                    type: 'success',
                    message: res.msg
                  });
                  self.init();
                } else {
                  self.$notify({
                    type: 'error',
                    message: res.msg
                  });
                }
              })
              .catch(err => {
                self.$notify({
                  type: 'error',
                  message: '启用失败'
                });
              });
          }
          if (row.states == '启用') {
            api
              .ProhibitDataFillingRuleseJ(qs.stringify({ id: thisId }))
              .then(res => {
                if (res.code == 'code_200') {
                  self.$notify({
                    type: 'success',
                    message: res.msg
                  });
                  self.init();
                } else {
                  self.$notify({
                    type: 'error',
                    message: res.msg
                  });
                }
              })
              .catch(err => {
                self.$notify({
                  type: 'error',
                  message: '禁用失败'
                });
              });
          }
        }
        // if (type == 4) {
        //   api
        //     .ProhibitDataFillingRulese({
        //       id: row.id,
        //       states: row.states == "启用" ? "1" : "2"
        //     })
        //     .then(res => {
        //       if (res.code == "code_200") {
        //         this.$message({
        //           type: "success",
        //           message: res.message
        //         });
        //         this.init();
        //       } else {
        //        this.$notify({
        //           type: "error",
        //           message: res.msg,
        //           offset: 100,
        //           duration: this.$store.state.el_Duration
        //         });
        //       }
        //     });
        // }
      },
      reset() {
        this.iptRuleName = '';
        this.statevoid = '';
        this.storevoid = '';
        this.init();
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        // self.init();
      },
      Modelsearch() {
        this.init();
      }
    }
  };
</script>

<style scoped lang="less">
  @import "fillRuleManage.less";
</style>


