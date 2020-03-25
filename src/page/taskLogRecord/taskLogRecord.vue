<template>
  <!-- 任务日志记录 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title title="任务日志记录"></list-table-title>
      <div class="table-container pag-position">
        <template>
          <el-tabs v-model="activeName" @tab-click="tabhandleClick">
            <template>
              <el-row :gutter="10" class="tmp-search">
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <div class="input-tpm yellow-input new-input">
                      <el-input v-model="searchForm.searchMan" placeholder="请输入操作人"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <div class="input-tpm yellow-input new-input">
                      <el-input v-model="searchForm.searchIP" placeholder="请输入操作IP"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <div class="input-tpm yellow-input new-input">
                      <el-input v-model="searchForm.searchTaskName" placeholder="请输入任务名称"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <div class="input-tpm yellow-input new-input">
                      <el-select v-model="searchForm.searchTaskState" placeholder="请选择任务状态">
                        <el-option
                          v-for="item in taskStateList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <div class="input-tpm yellow-input new-input">
                      <el-select v-model="searchForm.searchStore" placeholder="请选择所属库">
                        <el-option
                          v-for="item in storeList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>
                    <div
                      class="add-btn fl yellow new-btn"
                      @click="historyCheck()"
                      style="margin-left:-10px"
                    >查 询
                    </div>
                    <div class="add-btn fl yellow new-btn" @click="searchReset" style="margin-left:15px">重 置</div>
                  </div>
                </el-col>
              </el-row>
            </template>
            <el-tab-pane label="实时记录" data-id="preview" name="first">
              <el-table :data="tableData" stripe style="width: 100%" height="480">
                <el-table-column
                  v-for="item in dataHeader"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  :show-overflow-tooltip="true"
                  :width="item.width"
                ></el-table-column>
              </el-table>
              <el-pagination
                v-if="tableData.length!=0 && recordType == 1"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                :total="totalNum"
                prev-text="上一页"
                next-text="下一页"
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="历史记录" data-id="history" name="second">
              <el-table :data="historyData" stripe style="width: 100%" height="630">
                <el-table-column
                  v-for="item in historyTblHeader"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  :show-overflow-tooltip="true"
                  :width="item.width"
                ></el-table-column>
              </el-table>
              <el-pagination
                v-if="historyData.length!=0 && recordType == 2"
                :current-page="currentPages"
                :page-size="pageSizes"
                @current-change="handleCurrentChanges"
                layout="prev, pager, next"
                :total="totalNums"
                prev-text="上一页"
                next-text="下一页"
              ></el-pagination>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../src/api/bigData/daq/taskLogRecord';

  export default {
    data() {
      return {
        recordType: '',
        activeName: 'first',
        searchForm: {
          searchMan: '',
          searchIP: '',
          searchTaskName: '',
          searchTaskState: '',
          searchStore: ''
        },
        taskStateList: [
          {
            id: 1,
            name: '成功'
          },
          {
            id: 2,
            name: '失败'
          }
        ],
        storeList: [],
        tableData: [],
        dataHeader: [
          {
            prop: 'taskName',
            label: '任务名称'
          },
          {
            prop: 'baseLibraryID',
            label: '所属库'
          },
          {
            prop: 'statrtTime',
            label: '开始时间',
            width: 155
          },
          {
            prop: 'endTime',
            label: '结束时间',
            width: 155
          },
          {
            prop: 'consumptionTime',
            label: '消耗时间'
          },
          {
            prop: 'reslutState',
            label: '任务状态'
          },
          {
            prop: 'numberFillings',
            label: '本次填充量'
          },
          {
            prop: 'operatorUser',
            label: '操作人'
          },
          {
            prop: 'operatorIP',
            label: '操作IP'
          }
        ],
        historyData: [],
        historyTblHeader: [
          {
            prop: 'taskName',
            label: '任务名称'
          },
          {
            prop: 'baseLibraryID',
            label: '所属库'
          },
          {
            prop: 'statrtTime',
            label: '开始时间',
            width: 155
          },
          {
            prop: 'endTime',
            label: '结束时间',
            width: 155
          },
          {
            prop: 'consumptionTime',
            label: '消耗时间'
          },
          {
            prop: 'reslutState',
            label: '结果状态'
          },
          {
            prop: 'numberFillings',
            label: '本次填充量'
          },
          {
            prop: 'operatorUser',
            label: '操作人'
          },
          {
            prop: 'operatorIP',
            label: '操作IP'
          }
        ],
        totalNum: 1,
        totalNums: 1,
        currentPage: 1,
        currentPages: 1,
        pageSize: 10,
        pageSizes: 10
      };
    },
    mounted() {
      var self = this;
      self.$store.commit('showLoading', true);
      self.recordType = 1;
      self.getCurrentList();
      self.selectAllBaseLibrary();
    },
    methods: {
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
      getCurrentList() {
        var self = this;
        api
          .selectCurrentDataFillingTaskRecord({
            currentPage: self.currentPage,
            pageSize: self.pageSize,
            OperatorIP: self.searchForm.searchIP,
            OperatorUser: self.searchForm.searchMan,
            dataFillingTaskID: self.searchForm.searchTaskName,
            baseLibraryID: self.searchForm.searchStore,
            reslutState: self.searchForm.searchTaskState
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              self.tableData = res.data;
              self.totalNum = res.page.totalNumber;
              self.tableData.forEach(item => {
                item.endTime = new Date(item.endTime).toLocaleString('chinese', {
                  hour12: false
                });
                item.statrtTime = new Date(item.statrtTime).toLocaleString(
                  'chinese',
                  { hour12: false }
                );
              });
            }
          });
      },
      getHistoryList() {
        var self = this;
        api
          .selectDataFillingTaskRecord({
            currentPage: self.currentPages,
            pageSize: self.pageSizes,
            OperatorIP: self.searchForm.searchIP,
            OperatorUser: self.searchForm.searchMan,
            dataFillingTaskID: self.searchForm.searchTaskName,
            baseLibraryID: self.searchForm.searchStore,
            reslutState: self.searchForm.searchTaskState
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.historyData = res.data;
              self.totalNums = res.page.totalNumber;
              self.historyData.forEach(item => {
                item.endTime = new Date(item.endTime).toLocaleString('chinese', {
                  hour12: false
                });
                item.statrtTime = new Date(item.statrtTime).toLocaleString(
                  'chinese',
                  { hour12: false }
                );
              });
            }
          });
      },
      //tab切换；
      tabhandleClick(tab) {
        var self = this;
        if (tab.name == 'first') {
          self.searchForm.searchMan = '';
          self.searchForm.searchIP = '';
          self.searchForm.searchTaskName = '';
          self.searchForm.searchTaskState = '';
          self.searchForm.searchStore = '';
          self.recordType = 1;
          //调用实时记录接口；
          self.getCurrentList();
        }
        if (tab.name == 'second') {
          self.searchForm.searchMan = '';
          self.searchForm.searchIP = '';
          self.searchForm.searchTaskName = '';
          self.searchForm.searchTaskState = '';
          self.searchForm.searchStore = '';
          self.searchForm.currentPages = 1;
          self.searchForm.pageSizes = 10;
          self.recordType = 2;
          //调用历史记录接口；
          self.getHistoryList();
        }
      },
      searchReset() {
        var self = this;
        self.searchForm.searchMan = '';
        self.searchForm.searchIP = '';
        self.searchForm.searchTaskName = '';
        self.searchForm.searchTaskState = '';
        self.searchForm.searchStore = '';
        self.currentPage = 1;
        self.currentPages = 1;
        self.pageSize = 10;
        self.pageSizes = 10;
        if (self.recordType == 1) {
          self.getCurrentList();
        } else if (self.recordType == 2) {
          self.getHistoryList();
        }
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.getCurrentList();
      },
      handleCurrentChanges: function (val) {
        var self = this;
        self.currentPages = val;
        self.getHistoryList();
      },
      historyCheck() {
        var self = this;
        self.currentPage = 1;
        self.currentPages = 1;
        self.pageSize = 10;
        self.pageSizes = 10;
        if (this.recordType == 1) {
          self.getCurrentList();
        } else if (this.recordType == 2) {
          self.getHistoryList();
        }
      }
    }
  };
</script>

<style scoped lang="less">
  @import "taskLogRecord.less";
</style>


