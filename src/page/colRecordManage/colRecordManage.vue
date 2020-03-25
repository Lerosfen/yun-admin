<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="title"></list-table-title>
      <!-- 表格 -->
      <div class="table-container pag-position">
        <template>
          <el-tabs v-model="activeName" @tab-click="tabhandleClick">
            <template>
              <el-row :gutter="15" class="tmp-search">
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <!-- <label for="" class="yellow middle m-r-10">任务名称</label> -->
                    <div class="input-tpm yellow-input new-input">
                      <el-input v-model="searchForm.taskName" placeholder="任务名称"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <!-- <label for="" class="yellow middle m-r-10">开始时间</label> -->
                    <div class="input-tpm yellow-input cleanRecordDialog new-input">
                      <el-date-picker
                        v-model="searchForm.startTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        placeholder="开始时间"
                      ></el-date-picker>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <!-- <label for="" class="yellow middle m-r-10">结束时间</label> -->
                    <div class="input-tpm yellow-input cleanRecordDialog new-input">
                      <el-date-picker
                        type="date"
                        v-model="searchForm.endTime"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        placeholder="结束时间"
                      ></el-date-picker>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="8" :sm="6" :lg="4">
                  <div class="input-data">
                    <!-- <label for="" class="yellow middle m-r-10">结果状态</label> -->
                    <div class="input-tpm yellow-input new-input">
                      <!--<el-input v-model="searchForm.resultState"></el-input>-->
                      <el-select v-model="searchForm.resultState" placeholder="结果状态">
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
                <el-col :xs="10" :sm="8" :lg="6">
                  <div>
                    <div class="add-btn fl yellow new-btn" @click="historyCheck()">查 询</div>
                    <div class="add-btn fl yellow m-l-10 new-btn" @click="historyReset()">重 置</div>
                  </div>
                </el-col>
              </el-row>
            </template>
            <el-tab-pane label="实时记录" data-id="preview" name="first">
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column
                  v-for="item in headerData"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作" v-if="false">
                  <template slot-scope="scope">
                    <el-button
                      @click="handClick(scope.row,list.type)"
                      type="text"
                      size="small"
                      v-for="(list,index) in operate"
                      :key="index"
                    >{{list.txt}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="采集进度">
                  <template slot-scope="scope">
                    <!-- <el-progress :text-inside="true" :stroke-width="16" :percentage="parseFloat(scope.row.daqAmount/scope.row.datanum *100).toFixed(2)"></el-progress> -->
                    <el-progress
                      :text-inside="true"
                      :stroke-width="16"
                      :color="customColor"
                      :percentage="getProgess(scope.row.daqAmount,scope.row.datanum)"
                    ></el-progress>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="历史记录" data-id="history" name="second">
              <el-table :data="historyTableData" stripe style="width: 100%">
                <el-table-column
                  v-for="item in headerData"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  :width="item.width"
                  :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column label="采集进度">
                  <template slot-scope="scope">
                    <el-progress
                      :text-inside="true"
                      :stroke-width="16"
                      :color="customColor"
                      :percentage="getProgess(scope.row.daqAmount,scope.row.datanum)"
                    ></el-progress>
                  </template>
                </el-table-column>

                <el-table-column label width="20">
                  <template>
                    <el-button type="text" size="small"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <!--分页-->
          <el-pagination
            v-if="tableData.length>0 &&recordType==1"
            :current-page="currentPagePreview"
            :page-size="pageSizePreview"
            @size-change="previewSizeChange"
            @current-change="previewCurrentChange"
            layout="prev, pager, next"
            :total="previewTotalNum"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
          <!--分页-->
          <el-pagination
            v-if="tableData.length>0 &&recordType==2"
            :current-page="currentPageHistory"
            :page-size="pageSizeHistory"
            @size-change="historySizeChange"
            @current-change="historyCurrentChange"
            layout="prev, pager, next"
            :total="historyTotalNum"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </template>
        <!--结果预览-->
        <yj-dialog title="结果预览" :visible.sync="checkFiled" width="50%">
          <el-form label-width="100px">
            <div class="table-container pag-position">
              <el-table
                :data="resultTableData"
                stripe
                height="350"
                style="width: 98%;margin:0 auto;"
                header-align="center"
                class="table_scroll"
              >
                <el-table-column prop="Fld" label="Fld" width="100" align="center" id="fixed"></el-table-column>
                <el-table-column
                  v-for="item in yulanheaderDatas"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  width="80"
                  align="center"
                ></el-table-column>
              </el-table>
              <!--分页-->
              <el-pagination
                v-if="resultTableData.length>0"
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
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="blue-btn" @click="checkFiled = false">取 消</el-button>
          </div>
        </yj-dialog>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable indent,spaced-comment */
import api from "../../api/bigData/daq/colRecordManage";
export default {
  name: "metaDataSource",
  data() {
    return {
      lodaing: true,
      customColor: "#018A8D",
      recordType: "", //判断实时记录，历史记录，预览记录数据对应分页的状态
      title: "采集记录管理",
      activeName: "first",
      resultTableData: [], //预览记录数据
      tableData: [], //实时记录，
      historyTableData: [], // 历史记录
      oldTableData: [], // 实时记录表数据
      headerData: [
        {
          prop: "taskName",
          label: "任务名称",
          width: 150
        },
        {
          prop: "startTime",
          label: "开始时间",
          width: 140
        },
        {
          prop: "endTime",
          label: "结束时间",
          width: 140
        },
        {
          prop: "consumeTime",
          label: "消耗时间(秒)"
        },
        {
          prop: "taskState",
          label: "任务状态"
        },
        // {
        //   prop: 'speedOfProgress',
        //   label: '进度'
        // },
        {
          prop: "daqAmount",
          label: "本次采集量"
        },
        {
          prop: "datanum",
          label: "采集总量"
        },
        {
          prop: "resultState",
          label: "结果状态"
        }
      ], // 实时记录表头数据
      operate: [
        {
          type: 1,
          txt: "结果预览"
        }
      ],
      taskStateList: [
        {
          id: "0",
          name: "未知"
        },
        {
          id: "2",
          name: "失败"
        },
        {
          id: "1",
          name: "成功"
        }
      ],
      zhuangtai: [],
      historyData: [], // 历史记录表数据
      oldTableData1: [], // 历史记录表数据
      yulanheaderDatas: [
        {
          prop: "FCertiId",
          label: "FCertiId"
        },
        {
          prop: "FListId",
          label: "FListId"
        },
        {
          prop: "FListName",
          label: "FListName"
        },
        {
          prop: "FTypeId",
          label: "FTypeId"
        },
        {
          prop: "FTypeName",
          label: "FTypeName"
        },
        {
          prop: "FLevelId",
          label: "FLevelId"
        },
        {
          prop: "FLevelName",
          label: "FLevelName"
        },
        {
          prop: "FLeadId",
          label: "FLeadId"
        },
        {
          prop: "FLeadName",
          label: "FLeadName"
        },
        {
          prop: "FState",
          label: "FState"
        },
        {
          prop: "FIsDeleted",
          label: "FIsDeleted"
        },
        {
          prop: "FTime",
          label: "FTime"
        },
        {
          prop: "FOrder",
          label: "FOrder"
        },
        {
          prop: "FIsBase",
          label: "FIsBase"
        },
        {
          prop: "FBaseInfoId",
          label: "FBaseInfoId"
        },
        {
          prop: "FAppDeptId",
          label: "FAppDeptId"
        },
        {
          prop: "FAppDeptName",
          label: "FAppDeptName"
        },
        {
          prop: "FAppTime",
          label: "FAppTime"
        },
        {
          prop: "FCreateTime",
          label: "FCreateTime"
        },
        {
          prop: "FReason",
          label: "FReason"
        },
        {
          prop: "FCancelDate",
          label: "FCancelDate"
        },
        {
          prop: "FIsTemp",
          label: "FIsTemp"
        },
        {
          prop: "FAppId",
          label: "FAppId"
        },
        {
          prop: "FIsPrint",
          label: "FIsPrint"
        },
        {
          prop: "FIsApp",
          label: "FIsApp"
        },
        {
          prop: "FRemark",
          label: "FRemark"
        },
        {
          prop: "FContent",
          label: "FContent"
        },
        {
          prop: "FFileID",
          label: "FFileID"
        },
        {
          prop: "FIsState",
          label: "FIsState"
        },
        {
          prop: "FUserId",
          label: "FUserId"
        },
        {
          prop: "FDepartment",
          label: "FDepartment"
        },
        {
          prop: "FkcsjEmpId",
          label: "FkcsjEmpId"
        },
        {
          prop: "FkcsjIdCard",
          label: "FkcsjIdCard"
        }
      ], // 结果预览表头数据
      totalNum: 1,
      previewTotalNum: 1,
      historyTotalNum: 1,
      pageSize: 10,
      pageSizePreview: 10,
      pageSizeHistory: 10,
      currentPage: 1,
      currentPagePreview: 1,
      currentPageHistory: 1,
      checkFiled: false,
      strategyTableId: "",
      searchForm: {
        taskName: "",
        taskState: "",
        resultState: "",
        startTime: "",
        endTime: ""
      },
      dataProgress: 0,
      //进度条
      progressBar: 0
    };
  },
  mounted: function() {
    // this.$store.commit("showLoading",true);
    this.recordType = 1;
    this.gettimeList();
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.gettimeList();
      }, 3000);
    }
  },
  destroyed: function() {
    clearInterval(this.timer);
  },
  methods: {
    //获取进度条
    getProgess(a,b){
        if(b==0){
            return 100;
        }else{
            return parseFloat((a/b*100).toFixed(2));
        }

    },
    //tab切换；
    tabhandleClick(tab) {
        if (tab.name == "first") {
            this.searchForm.taskName = "";
            this.searchForm.startTime = "";
            this.searchForm.endTime = "";
            this.searchForm.resultState = "";
            this.recordType = 1;
            this.gettimeList();
        }
        if (tab.name == "second") {
            this.searchForm.taskName = "";
            this.searchForm.startTime = "";
            this.searchForm.endTime = "";
            this.searchForm.resultState = "";
            this.searchForm.currentPageHistory = 1;
            this.searchForm.pageSizeHistory = 10;
            this.recordType = 2;
            this.gethistroyList();
        }
    },
    //实时记录数据list;
    gettimeList() {
        var apiInter = api.shishiList({
            taskName: this.searchForm.taskName,
            startTime: this.searchForm.startTime,
            endTime: this.searchForm.endTime,
            resultState: this.searchForm.resultState,
            currentPage: this.currentPagePreview,
            pageSize: this.pageSizePreview
        });
        this.loadData(apiInter, 1);
    },
    //历史记录数据list；
    gethistroyList() {
        var apiInter = api.historyList({
            taskName: this.searchForm.taskName,
            startTime: this.searchForm.startTime,
            endTime: this.searchForm.endTime,
            resultState: this.searchForm.resultState,
            currentPage: this.currentPageHistory,
            pageSize: this.pageSizeHistory
        });
        this.loadData(apiInter, 2);
    },
    //调后台接口
    loadData(apiInter, type) {
      apiInter
        .then(res => {
          if (res.code === "code_200") {
            // this.$store.commit("hideLoading",false);
            res.data.forEach(res => {
                if (res.resultState == "0") {
                res.resultState = "未知";
                } else if (res.resultState == "1") {
                res.resultState = "成功";
                } else if (res.resultState == "2") {
                res.resultState = "失败";
                }

                if (res.taskState == "0") {
                res.taskState = "未知";
                } else if (res.taskState == "1") {
                res.taskState = "成功";
                } else if (res.taskState == "2") {
                res.taskState = "失败";
                }

                if (
                res.startTime == undefined &&
                res.endTime == undefined &&
                res.consumeTime == undefined
                ) {
                    res.startTime = "";
                    res.endTime = "";
                    res.consumeTime = "";
                } else if (
                res.startTime == undefined &&
                res.endTime == undefined &&
                res.consumeTime !== undefined
                ) {
                    res.startTime = "";
                    res.endTime = "";
                } else {
                    let newTime = new Date(res.startTime);
                    let newTime2 = new Date(res.endTime);
                res.startTime = this.formatDate(newTime);
                    if(res.endTime){
                        res.endTime = this.formatDate(newTime2);
                    }else{
                        res.endTime = "未知";
                    }

                }
            });

            if (type == 1) {
              this.previewTotalNum = res.page.totalNumber;
              this.tableData = res.data;
            }
            if (type == 2) {
              this.historyTotalNum = res.page.totalNumber;
              this.historyTableData = res.data;
            }
            // if(type==3) {
            //   this.resultTableData=res.data;
            //   this.totalNum = res.page.totalNumber;
            // }
          } else {
            this.$notify({
                tittle: "失败",
                message: res.msg,
                type: "error",
                offset: 100,
                duration: this.$store.state.el_Duration
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //把时间转换成yyyy-MM-dd hh:mm格式
    formatDate(dates) {
      var oDate = new Date(dates);
      var year = oDate.getFullYear(),
        month = oDate.getMonth() + 1,
        date = oDate.getDate(),
        hour = oDate.getHours(),
        minutes = oDate.getMinutes(),
        second = oDate.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        second
      );
    },
    //查询按钮
    historyCheck() {
      this.currentPagePreview = 1;
      this.currentPageHistory = 1;
      this.pageSizePreview = 10;
      this.pageSizeHistory = 10;
      if (this.recordType == 1) {
        this.gettimeList();
        console.log(this.searchForm.resultState, "res");
      } else if (this.recordType == 2) {
        this.gethistroyList();
      }
    },
    //重置按钮
    historyReset() {
      this.searchForm.taskName = "";
      this.searchForm.resultState = "";
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
      this.currentPagePreview = 1;
      this.currentPageHistory = 1;
      this.pageSizePreview = 10;
      this.pageSizeHistory = 10;
      if (this.recordType == 1) {
        this.gettimeList();
      } else if (this.recordType == 2) {
        this.gethistroyList();
      }
    },
    //结果预览；
    handClick(row, type) {
      this.checkFiled = true;
      this.recordType = 3;
      this.strategyTableId = row.strategyTableId;
      this.resultPreview(this.strategyTableId);
    },
    //结果预览调后台数据
    resultPreview(id) {
      api
        .resultShow({
          strategyTableId: id,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if ((res.code = "code_200")) {
            this.resultTableData = res.data;
            this.totalNum = res.page.totalNumber;
          } else {
            this.$notify({
              tittle: "失败",
              message: res.msg,
              type: "error",
              offset: 100,
              duration: this.$store.state.el_Duration
            });
          }
        });
      // this.loadData( apiInter,3);
    },
    //每页显示数据量编辑
    handleSizeChange: function(val) {
      var self = this;
      self.pageSize = val;
      this.resultPreview(this.strategyTableId);
    },
    //页码编辑
    handleCurrentChange(val) {
      this.currentPage = val;
      this.resultPreview(this.strategyTableId);
      // this.searchForm.currentPage = val;
      // if(this.recordType == 1){
      //   this. gettimeList();
      // }else if(this.recordType == 2){
      //   this.gethistroyList();
      // }else if(this.recordType == 3){
      //   this.resultPreview();
      // }
    },
    previewSizeChange(val) {
      var self = this;
      self.pageSizePreview = val;
      this.gettimeList();
    },
    //页码编辑
    previewCurrentChange(val) {
      var self = this;
      self.currentPagePreview = val;
      this.gettimeList();
    },

    historySizeChange(val) {
      var self = this;
      self.pageSizeHistory = val;
      this.gethistroyList();
    },
    //页码编辑
    historyCurrentChange(val) {
      var self = this;
      self.currentPageHistory = val;
      this.gethistroyList();
    }
  },
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位

      let realVal = parseFloat(value).toFixed(2);

      return realVal;
    }
  }
};
</script>

<style scoped>
@import "colRecordManage.less";
</style>

