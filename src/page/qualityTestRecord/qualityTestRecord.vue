<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="title"></list-table-title>
      <!-- 表格 -->
      <div class="table-container">
        <template>
          <el-tabs v-model="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="实时记录" name="first">
              <!--<div class="search-section clearfix">-->
                <!--<div class="search-right">-->
                  <!--<div class="input-data fl">-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">任务名称</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--<el-input v-model="searchForm.taskName"></el-input>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">任务结果状态</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--&lt;!&ndash;<el-input v-model="searchForm.taskState"></el-input>&ndash;&gt;-->
                        <!--<el-select v-model="searchForm.taskState" placeholder="请选择">-->
                          <!--<el-option-->
                            <!--v-for="item in taskStateList"-->
                            <!--:key="item.id"-->
                            <!--:label="item.name"-->
                            <!--:value="item.name">-->
                          <!--</el-option>-->
                        <!--</el-select>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">开始时间</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--&lt;!&ndash;<el-input v-model="searchForm.taskName"></el-input>&ndash;&gt;-->
                        <!--<el-date-picker-->
                          <!--v-model="searchForm.startTime"-->
                          <!--type="date"-->
                          <!--placeholder="选择日期">-->
                        <!--</el-date-picker>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">结束时间</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--<el-date-picker-->
                          <!--v-model="searchForm.endTime"-->
                          <!--type="date"-->
                          <!--placeholder="选择日期">-->
                        <!--</el-date-picker>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<div class="input-data fl m-l-10">-->

                  <!--</div>-->
                  <!--<div class="add-btn fl yellow m-l-10" @click="historyCheck()">-->
                    <!--查看-->
                  <!--</div>-->
                  <!--<div class="add-btn fl yellow m-l-10" @click="historyReset()">-->
                    <!--重置-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                  v-for="item in headerData"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handClick(scope.row,list.type)" type="text" size="small"
                               v-for="(list,index) in operate" :key="index">
                      {{list.txt}}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

            </el-tab-pane>
            <el-tab-pane label="历史纪录" name="second">
              <!--<div class="search-section clearfix">-->
                <!--<div class="search-right">-->
                  <!--<div class="input-data fl">-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">任务名称</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--<el-input v-model="searchForm.taskName"></el-input>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">任务结果状态</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--<el-input v-model="searchForm.taskState"></el-input>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">开始时间</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--<el-date-picker-->
                          <!--v-model="searchForm.startTime"-->
                          <!--type="date"-->
                          <!--format="yyyy-MM-dd"-->
                          <!--value-format="timestamp"-->
                          <!--placeholder="选择日期">-->
                        <!--</el-date-picker>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="input-data f1">-->
                      <!--<label for="" class="yellow middle m-r-10">结束时间</label>-->
                      <!--<div class="input-tpm yellow-input">-->
                        <!--<i class="honer-left"></i>-->
                        <!--<el-date-picker-->
                          <!--type="date"-->
                          <!--v-model="searchForm.endTime"-->
                          <!--format="yyyy-MM-dd"-->
                          <!--value-format="timestamp"-->
                          <!--placeholder="选择日期" @change="finishDate($event)">-->
                        <!--</el-date-picker>-->
                        <!--<i class="honer-right"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<div class="input-data fl m-l-10">-->

                  <!--</div>-->
                  <!--<div class="add-btn fl yellow m-l-10" @click="historyCheck()">-->
                    <!--查看-->
                  <!--</div>-->
                  <!--<div class="add-btn fl yellow m-l-10" @click="historyReset()">-->
                    <!--重置-->
                  <!--</div>-->
                <!--</div>-->

              <!--</div>-->
              <el-table
                :data="historytableData"
                stripe
                style="width: 100%">
                <el-table-column
                  v-for="item in headerData1"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label=""
                  width="20">
                  <template slot-scope="scope">
                    <el-button type="text" size="small"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>

        </template>
        <!--结果预览-->
        <yj-dialog title="结果预览" :visible.sync="checkFiled" width="50%">
          <el-form>
            <div class="table-container">
              <el-table
                :data="yulanData"
                stripe
                style="width: 100%">
                <el-table-column
                  fixed prop="ID" label="ID" id="leftS">
                  <template slot-scope="scope">
                    <el-button type="text" size="small"></el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="item in yulanheaderDatas"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id">
                </el-table-column>
              </el-table>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!--<el-button class="blue-btn" @click="checkFiled = false">取 消</el-button>-->
            <!--分页-->
            <!--<el-pagination-->
              <!--:current-page="currentPage"-->
              <!--:page-size="pageSize"-->
              <!--@size-change="handleSizeChange"-->
              <!--@current-change="handleCurrentChange"-->
              <!--layout="prev, pager, next"-->
              <!--:total="totleNumRes"-->
              <!--prev-text="上一页"-->
              <!--next-text="下一页">-->
            <!--</el-pagination>-->
          </div>
        </yj-dialog>
        <!--分页-->
        <el-pagination v-if="tableData.length!=0 || historytableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="pageNum"
          prev-text="上一页"
          next-text="下一页">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api/bigData/daq/qualityTestRecord';
  import YjDialog from '../../components/YUNPackages/dialog/modal';

  export default {
    name: 'metaDataSource',
    data() {
      return {
        title: '质量检测记录',
        activeName: 'second',
        tableData: [],
        recordType: '',
        historytableData: [],
        totleNumRes:1,
        pageNum: 0,
        currentPage: 1,
        pageSize:10,
        checkFiled: false,
        taskStateList: [
          {
            id: '1',
            name: '未知'
          },
          {
            id: '2',
            name: '失败'
          },
          {
            id: '3',
            name: '成功'
          },
        ],
        // 实时记录表数据
        oldTableData: [], // 实时记录表数据
        headerData: [
          {
            prop: 'taskName',
            label: '任务名称'
          },
         /* {
            prop: 'createTime',
            label: '创建时间'
          },*/
          {
            prop: 'endTime',
            label: '结束时间'
          },
          {
            prop: 'consumeTime',
            label: '消耗时间(秒)'
          },
          {
            prop: 'taskState',
            label: '任务状态'
          },
          {
            prop: 'resultState',
            label: '结果状态'
          },
          // {
          //   prop: 'cleaningAmount',
          //   label: '本次清洗量'
          // },
          // {
          //   prop: 'createTime',
          //   label: '创建时间'
          // },
        ], // 实时记录表头数据
        operate: [
          {
            type: 1,
            txt: '结果预览'
          }
        ],
        historyData: [], // 历史记录表数据
        oldTableData1: [], // 历史记录表数据
        headerData1: [
          {
            prop: 'taskName',
            label: '任务名称'
          },
         /* {
            prop: 'createTime',
            label: '创建时间'
          },*/
          {
            prop: 'endTime',
            label: '结束时间'
          },
          {
            prop: 'consumeTime',
            label: '消耗时间(秒)'
          },
          {
            prop: 'taskState',
            label: '任务状态'
          },
          {
            prop: 'resultState',
            label: '结果状态'
          },
        ], // 历史记录表头数据
        options: [{
          value: '选项1',
          label: '未知'
        }, {
          value: '选项2',
          label: '失败'
        }, {
          value: '选项3',
          label: '成功'
        }],
        options1: [{
          value: '选项1',
          label: '未知'
        }, {
          value: '选项2',
          label: '失败'
        }, {
          value: '选项3',
          label: '成功'
        }],
        value: '',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        yulanData: [
          // {
          //   id: 1,
          //   ID: 'rere',
          //   BANKNUM: '8989',
          //   BUSSTATUS: 'oioipo'
          // }, {
          //   id: 2,
          //   ID: 'BANKNUM',
          // }, {
          //   id: 3,
          //   ID: 'BUSSTATUS',
          // }, {
          //   id: 4,
          //   ID: 'CERT_APPROVAL_NO',
          // }, {
          //   id: 5,
          //   ID: 'ENPOSITION',
          // },
        ], // 结果预览表数据
        yulanheaderDatas: [
          // {
          //   prop: 'ID',
          //   label: 'ID'
          // },
          {
            prop: 'BANKNUM',
            label: 'BANKNUM'
          },
          {
            prop: 'BUSSTATUS',
            label: 'BUSSTATUS'
          },
          {
            prop: 'CERT_APPROVAL_NO',
            label: 'CERT_APPROVAL_NO'
          },
          {
            prop: 'ENPOSITION',
            label: 'ENPOSITION'
          },
          {
            prop: 'CERT_AUTHORITY',
            label: 'CERT_AUTHORITY'
          },
          {
            prop: 'CERTCODE',
            label: 'CERTCODE'
          },
          {
            prop: 'CERT_DEADLINE',
            label: 'CERT_DEADLINE'
          },
          {
            prop: 'CERT_REVIEW_UNIT',
            label: 'CERT_REVIEW_UNIT'
          },
          // {
          //   prop: 'CERT_SCANS',
          //   label: 'CERT_SCANS'
          // },
          // {
          //   prop: 'CERT_SCANS_CODE',
          //   label: 'CERT_SCANS_CODE'
          // },
          // {
          //   prop: 'CERT_STATUS',
          //   label: 'CERT_STATUS'
          // },
          // {
          //   prop: 'CERT_STATUS_ALTER_TIME',
          //   label: 'CERT_STATUS_ALTER_TIME'
          // },
          // {
          //   prop: 'CERT_STATUS_OPERATOR',
          //   label: 'CERT_STATUS_OPERATOR'
          // },
          // {
          //   prop: 'CERT_TYPE',
          //   label: 'CERT_TYPE'
          // },
          // {
          //   prop: 'CERT_COPY_NUM',
          //   label: 'CERT_COPY_NUM'
          // },
          // {
          //   prop: 'ENECONOMICTYPE',
          //   label: 'ENECONOMICTYPE'
          // }, {
          //   prop: 'ENECONOMICTYPE1',
          //   label: 'ENECONOMICTYPE1'
          // }, {
          //   prop: 'ENECONOMICTYPE2',
          //   label: 'ENECONOMICTYPE2'
          // }, {
          //   prop: 'ENECONOMICTYPE3',
          //   label: 'ENECONOMICTYPE3'
          // }, {
          //   prop: 'ENECONOMICTYPE4',
          //   label: 'ENECONOMICTYPE4'
          // },
        ], // 结果预览表头数据

        searchForm: {
          taskName: "",  //任务名称
          taskState: "",   //任务状态
          startTime: '',   //开始时间
          endTime: '',//结束时间
        }
      }
    },
    mounted() {
      this.recordType = 2;
      this.getHistoryList();
    },
    methods: {
      //tab切换；
      tabHandleClick(tab) {
        this.searchForm.taskName = ""; //任务名称
        this.searchForm.taskState = "";   //任务状态
        this.searchForm.startTime = '';   //开始时间
        this.searchForm.endTime = '';//结束时间
        if (tab.name == "first") {
          //调用实时记录接口；
          this.recordType = 1;
          this. currentPage=1,
          this.getTimeList();
        }
        if (tab.name == "second") {
          //调用历史记录接口；
          this.recordType = 2;
          this. currentPage=1,
          this.getHistoryList();

        }
      },
      //实时记录数据list;
      getTimeList() {
        api.getQualityTestTime({
          currentPage:this.currentPage,
          pageSize:this.pageSize
        }).then(res => {
          console.log(res,'质量检测实时记录数据');
          if (res.code === 'code_200') {
            res.data.forEach((res) => {
              let newTime = new Date(res.startTime);
              let newTime1 = new Date(res.consumeTime);
              let newTime2 = new Date(res.endTime);
              let newTime3 = new Date(res.createTime);
              res.startTime = this.formatDate(newTime, 'yyyy-MM-dd hh:mm');
              res.consumeTime = this.formatDate(newTime1, 'yyyy-MM-dd hh:mm');
              res.endTime = this.formatDate(newTime2, 'yyyy-MM-dd hh:mm');
              res.createTime = this.formatDate(newTime3, 'yyyy-MM-dd hh:mm');
              res.taskState = res.taskState == 1 ? '成功' : '失败';
            })
            this.tableData = res.data;
            this.pageNum = res.page.totalNumber;
          } else {
            this.$notify({
              tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
            });
          }
        });
      },
      //历史记录数据list；
      getHistoryList() {
        api.getQualityTestTime({
          currentPage:this.currentPage,
          pageSize:this.pageSize
        }).then((res) => {
          console.log(res,'质量检测历史记录')
          if (res.code === 'code_200') {
            res.data.forEach((item) => {
              // item.startTime = this.formatDate(item.startTime);
              item.consumeTime = this.formatDate(item.consumeTime);
              item.endTime = this.formatDate(item.endTime);
              item.createTime = this.formatDate(item.createTime);
              item.taskState = item.taskState == 1 ? '成功' : '失败';
            })
            this.historytableData = res.data;
            this.pageNum = res.page.totalNumber;
          } else {
            this.$notify({
              tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
            });
          }
        });
      },

      historyCheck() {
        if (this.recordType == 1) {
          this.getTimeList()
        } else if (this.recordType == 2) {
          console.log(this.searchForm,'searchFormsearchForm')
          this.getHistoryList();
        }
      },
      // 新增
      addMetaData() {
        this.mainDialogBtnType = '1';
        this.mainDialog = true;
        this.titleName = '数据源-添加';
      },


      historyReset() {
        this.searchForm.taskName = ""; //任务名称
        this.searchForm.taskState = "";   //任务状态
        this.searchForm.startTime = '';   //开始时间
        this.searchForm.endTime = '';//结束时间
        if (this.recordType == 1) {
          this.getTimeList()
        } else if (this.recordType == 2) {
          this.getHistoryList();
        }
      },
      //结果预览；
      handClick(row, type) {
        console.log(row, type);
        // this.checkFiled = true;
        // api.cleanResultShow({}).then(res => {
        //   console.log(res.data);
        //   if (res.code === 'code_200') {
        //     console.log(res.data);
        //     res.data.forEach((res) => {
        //       let newTime = new Date(res.startTime);
        //       let newTime1 = new Date(res.consumeTime);
        //       let newTime2 = new Date(res.endTime);
        //       res.startTime = this.formatDate(newTime, 'yyyy-MM-dd hh:mm');
        //       res.consumeTime = this.formatDate(newTime1, 'yyyy-MM-dd hh:mm');
        //       res.endTime = this.formatDate(newTime2, 'yyyy-MM-dd hh:mm');
        //     })
        //     this.yulanData = res.data;
        //     console.log(this.yulanData);
        //     this.pageNum = res.data.length;
        //     this.pageCount = (res.data.length / 10) + 1;
        //   }
        //   else {
        //     this.$notify({
        //       tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
        //     });
        //   }
        // });
      },
      // 每页显示数据量编辑
      handleSizeChange(val) {
        const self = this;
        self.pageSize = val;
      },

      // 页码编辑
      handleCurrentChange(val) {
        const self = this;
        self.currentPage = val;
        if (self.recordType == 1) {
          self.getTimeList()
        } else if (self.recordType == 2) {
          self.getHistoryList();
        }

      },
    },
    components: {
      YjDialog
    },
    // watch: {
    //   tab(name) {
    //     console.log(tab.name, 'namename')
    //
    //   }
    // }
  }
</script>

<style scoped lang="less">
 @import "qualityTestRecord.less";


</style>

