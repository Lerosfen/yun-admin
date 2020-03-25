<template>
  <!-- 填充任务管理 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles"></list-table-title>
      <!-- 新增搜索填充任务 -->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData">新 增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入任务名称" v-model="iptTaskName"></el-input>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-tpm yellow-input new-input">
              <el-select v-model="statevoid" placeholder="请选择任务状态">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="modelsearch">查 询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="reset">重 置</div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in dataHeader"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="170">
            <template slot-scope="scope">
              <el-button size="small" @click="handelClick(scope.row,1)" type="text">查看</el-button>
              <el-button
                size="small"
                @click="handelClick(scope.row,2)"
                type="text"
                v-if="scope.row.states=='禁用'"
              >编辑
              </el-button>
              <el-button
                size="small"
                @click="handelClick(scope.row,5)"
                type="text"
                v-if="scope.row.states=='启用'"
              >手动启动
              </el-button>
              <el-button
                size="small"
                @click="handelClick(scope.row,3)"
                type="text"
                v-if="scope.row.states=='禁用'"
              >启用
              </el-button>
              <el-button
                size="small"
                @click="handelClick(scope.row,4)"
                type="text"
                v-if="scope.row.states=='启用'"
              >禁用
              </el-button>
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

    <!-- 新增填充任务弹框 -->
    <Modal
      width="40%"
      :title="modalTitle"
      v-model="fillTaskView"
      id="addTaskModel"
      :closable="false"
      :mask-closable="false"
    >
      <el-form label-width="200px" :rules="addFormRules" ref="addFormRules" :model="form">
        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="任务名称" prop="taskName">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-input placeholder="请输入任务名称" :disabled="isDisabled" v-model="form.taskName"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="任务规则" prop="taskRule">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-select v-model="form.taskRule" :disabled="isDisabled">
                    <el-option
                      v-for="item in taskRuleList"
                      :key="item.id"
                      :label="item.ruleNames"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="是否定时" prop="isTiming">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-select v-model="form.isTiming" :disabled="isDisabled">
                    <el-option
                      v-for="item in isTimingList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2" v-show="form.isTiming == 1">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="定时规则" prop="timingRule">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-input
                    disabled
                    placeholder
                    id="cron"
                    v-model="form.timingRule"
                    ref="timingRule"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2" v-if="isTimingShow" v-show="form.isTiming == 1">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="定时器" prop="timing">
                <div class="input-group">
                  <div id="selector"></div>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
        <el-button class="blue-btn" type="primary" v-if="btnType == 2" @click="cancleModal(1)">关 闭</el-button>
        <el-button
          class="blue-btn"
          type="primary"
          v-if="btnType == 3"
          @click.native="submitUpload"
        >确 定
        </el-button>
        <el-button class="blue-btn" v-if="btnType == 3" @click="resetModal()">重 置</el-button>
        <el-button class="yellow-btn" v-if="btnType == 3" @click="cancleModal(1)">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  const qs = require('qs');
  import api from '../../../src/api/bigData/daq/fillTaskManage';
  import '../../assets/js/jquery-gentleSelect';
  import '../../assets/js/jquery-cron.js';

  export default {
    data() {
      return {
        titles: '数据填充任务管理',
        modalTitle: '',
        iptTaskName: '',
        statevoid: '',
        storevoid: '',
        dataHeader: [
          {
            prop: 'taskName',
            label: '任务名称'
          },
          {
            prop: 'dataFillingRulesName',
            label: '填充规则'
          },
          {
            prop: 'states',
            label: '状态'
          },
          {
            prop: 'createTime',
            label: '创建时间'
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
        isTimingList: [
          {
            id: 1,
            name: '是'
          },
          {
            id: 2,
            name: '否'
          }
        ],
        tableData: [],
        btn: {
          enable: 1, // 初始为0
          forbidden: 1
        },
        fillTaskView: false,
        EditfillTaskView: false,
        form: {
          taskName: '',
          baseStore: '',
          targetTbl: '',
          taskRule: '',
          isTiming: '',
          timingRule: '',
          timer: ''
        },
        isDisabled: false,
        btnType: '',
        btn: {
          // 默认为0
          enable: 1,
          forbidden: 1
        },
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        taskRuleList: [],
        // 验证
        addFormRules: {
          taskName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          taskRule: [
            { required: true, message: '请选择任务规则', trigger: 'change' }
          ],
          isTiming: [
            { required: true, message: '请选择是否定时', trigger: 'change' }
          ]
        },
        isTimingShow: true,
        addType: 0 // 1新增
      };
    },
    mounted() {
      var self = this;
      self.$store.commit('showLoading', true);
      self.selectAllBaseLibrary();
      self.init();
      self.selectAllDataFillingRulesk();
    },
    methods: {
      init() {
        var self = this;
        api
          .selectAllDataFillingTask({
            currentPage: self.currentPage,
            pageSize: self.pageSize,
            taskName: self.iptTaskName,
            states: self.statevoid
            // baseLibraryID: self.storevoid
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              self.tableData = res.data;
              self.tableData.forEach(item => {
                if (item.states == 1) {
                  item.states = '启用';
                }
                if (item.states == 2) {
                  item.states = '禁用';
                }
                // 将时间戳转换为时间
                // item.createTime = new Date(item.createTime).toLocaleString().replace(/:\d{1,2}$/,' ');
                item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false });
              });
            }
          }, err => {
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
      // 查询填充规则
      selectAllDataFillingRulesk() {
        api.selectAllDataFillingRulesk()
          .then(res => {
            if (res.code == 'code_200') {
              this.taskRuleList = res.data;
            }
          });
      },

      addData() {
        var self = this;
        self.modalTitle = '新增数据填充任务';
        var obj = self.form;
        for (var i in obj) {
          obj[i] = '';
        }
        self.isTimingShow = true;
        self.isDisabled = false;
        self.btnType = 3;
        self.fillTaskView = true;

        this.$nextTick(function () {
          $('#selector')
            .cron({
              onChange: function () {
                self.form.timingRule = $(this)
                  .cron('value') + '?';
              }
            });
        });
        self.addType = 1;
      },
      handelClick(row, type) {
        var self = this;
        switch (type) {
          case 1:
            // 查看
            self.modalTitle = '查看数据填充任务';
            self.fillTaskView = true;
            self.isDisabled = true;
            self.btnType = 2;
            self.isTimingShow = false;
            self.form = {
              taskName: row.taskName,
              taskRule: row.dataFillingRulesName,
              isTiming: parseInt(row.isNoTiming),
              timingRule: row.timingRule
              // timer: row.timer
            };
            break;
          case 2:
            // 编辑
            self.modalTitle = '编辑数据填充任务';

            self.fillTaskView = true;
            self.isDisabled = false;
            self.btnType = 3;
            self.isTimingShow = true;

            self.$nextTick(function () {
              $('#selector')
                .cron({
                  onChange: function () {
                    self.form.timingRule = $(this)
                      .cron('value') + '?';
                  }
                });
            });

            self.form = {
              taskName: row.taskName,
              taskRule: row.dataFillingRulesName,
              isTiming: parseInt(row.isNoTiming),
              timingRule: row.timingRule
            };

            break;
          case 3:
            // 启用
            api
              .ProhibitDataFillingTaskQ(qs.stringify({ id: row.id }))
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
              });
            break;
          case 4:
            api
              .ProhibitDataFillingTaskJ(qs.stringify({ id: row.id }))
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
              });
            break;
          case 5:
            self.$confirm('原表数据会清空，是否仍手动启动此次任务？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'blue-btn',
              confirmButtonClass: 'yellow-btn',
              type: 'warning',
              center: true
            })
              .then(() => {
                api.StartTask(qs.stringify({ id: row.id }))
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
                  });
              });
            break;
        }
      },
      reset() {
        //重置搜索条件
        this.iptTaskName = '';
        this.statevoid = '';
        this.storevoid = '';
        this.init();
      },

      closeModal() {
        this.EditfillTaskView = false;
      },

      resetModal() {
        var obj = this.form;
        for (var i in obj) {
          obj[i] = '';
        }
        this.$refs.addFormRules.resetFields();
      },
      cancleModal(type) {
        if (type == 1) {
          this.fillTaskView = false;
          this.$refs.addFormRules.resetFields();
          if (this.addType == 1) {
            this.addType = 0;
          }
        }
        if (type == 2) {
          this.EditfillTaskView = false;
        }
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        // self.init();
      },
      modelsearch() {
        this.init();
      },

      submitUpload() {
        var self = this;
        self.$refs.addFormRules.validate(valid => {
          if (!valid) {
            self.$message({
              type: 'error',
              message: '请填写完整信息'
            });
            return false;
          } else {
            var postParams = {
              taskName: self.form.taskName,
              dataFillingRulesID: self.form.taskRule,
              isNoTiming: self.form.isTiming,
              timingRule: self.form.timingRule
            };
            if (self.form.isTiming == 2) {
              delete postParams.timingRule;
            }

            if (self.addType == 1) {
              // 新增
              api.insertDataFillingTask(postParams)
                .then(res => {
                  if (res.code == 'code_200') {
                    self.fillTaskView = false;
                    self.init();
                    self.addType = 0;
                    self.$notify({
                      message: res.msg,
                      type: 'success'
                    });
                  } else {
                    self.$notify({
                      message: res.msg,
                      type: 'error'
                    });
                  }
                });
            } else {
              // 修改
              api.updateDataFillingTask(postParams)
                .then(res => {
                  if (res.code == 'code_200') {
                    self.fillTaskView = false;
                    self.init();
                    self.$notify({
                      type: 'success',
                      message: res.msg
                    });
                  } else {
                    self.$notify({
                      type: 'error',
                      message: res.msg
                    });
                  }
                });
            }
          }
        });
      },
      submitEdit() {
        var self = this;
        api
          .updateDataFillingTask({
            taskName: self.form.taskName,
            dataFillingRulesID: self.form.taskRule,
            isNoTiming: self.form.isTiming
            // timingRule: self.form.timingRule,
            // 定时器
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.fillTaskView = false;
              self.init();
              self.$notify({
                message: res.msg,
                type: 'success'
              });
            } else {
              self.$notify({
                message: res.msg,
                type: 'error'
              });
            }
          });
      }
    }
  };
</script>

<style scoped lang="less">
  @import "fillTaskManage.less";
</style>


