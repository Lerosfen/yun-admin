<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-data">
              <label class="yellow middle m-r-10">数据表名称</label>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="searchForm.dataSourceName"></el-input>
              </div>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-data">
              <label class="yellow middle m-r-10">数据表类型</label>
              <div class="input-tpm yellow-input new-input">
                <el-select v-model="searchForm.syncTableType" placeholder="全部">
                  <el-option
                    v-for="item in sourceTableType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-data">
              <label class="yellow middle m-r-10">来源表名称</label>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="searchForm.sourceTable"></el-input>
              </div>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="sourceCheck">查询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="sourceRest">重置</div>
        </div>
      </div>
      <!--列表-->
      <div class="table-container pag-position">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                v-if="Btn.selectNewByPage==1"
              >查询
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--结果预览-->
        <Modal
          title="结果预览"
          v-model="checkFiled"
          width="60%"
          :closable="false"
          :mask-closable="false"
        >
          <!-- <el-form label-width="100px"> -->
          <div class="table-container">
            <el-table
              :data="tableData1"
              stripe
              height="400"
              style="width: 100%;margin:0 auto;"
              header-align="center"
              class="table_scroll"
            >
              <!-- <el-table-column  prop="Fld" label="Fld" width="110" align="center" id="fixed">
              </el-table-column>-->
              <el-table-column
                v-for="item in previewHeaderDatas"
                width="110"
                :label="item.label"
                :prop="item.prop"
                :key="item.prop"
                align="center"
                :render-header="labelHead"
                :show-overflow-tooltip="true"
              >
                <!-- <template slot-scope="scope" slot="header">
                  <el-tooltip effect="dark" :content="true" placement="top">
                    <span>{{ item.label }}</span>
                  </el-tooltip>
                </template>-->
              </el-table-column>
            </el-table>
          </div>
          <!-- </el-form> -->
          <div slot="footer" class="dialog-footer">
            <el-button class="blue-btn" @click="checkFiled=false">关 闭</el-button>
          </div>
          <div slot="footer" class="dialog-footer">
            <!--分页-->
            <el-pagination
              v-if="totalNumResult>0"
              :current-page="currentPageResult"
              :page-size="pageSizeResult"
              @size-change="SizeChange"
              @current-change="CurrentChange"
              layout="prev, pager, next"
              :total="totalNumResult"
              prev-text="上一页"
              next-text="下一页"
            ></el-pagination>
          </div>
        </Modal>
        <!--分页-->
        <el-pagination
          v-if="totalNum>0"
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
  import api from '../../api/bigData/daq/monitoringResultSearch';
  import Common from '../../../config/common';

  export default {
    name: 'monitoringResultSearch',
    data() {
      return {
        titles: '数据预览查询',
        type: '',
        tableData: [], //页面表格数据
        tableData1: [],
        headerData: [
          {
            prop: 'namess',
            label: '数据表名称'
          },
          {
            prop: 'sourceTable',
            label: '来源表名称'
          },
          {
            prop: 'sourceTableMame',
            label: '来源表中文名称'
          },
          {
            prop: 'syncTableType',
            label: '同步表类型'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            prop: 'updateTime',
            label: '修改时间'
          },
          // {
          //   prop: "lastModifier",
          //   label: "最后修改人"
          // }
        ], //表头数据
        operate: [
          {
            type: 1,
            txt: '查询'
          }
        ],
        name: '', //，模型名称
        totalNum: 0, //总数据条数
        totalNumResult: 0,
        pageSize: 10, //当前页展示数据条数
        pageSizeResult: 10,
        currentPageResult: 1,
        currentPage: 1, //当前页
        sourceTableType: [], //表类型
        examineFormVisible: false, //查看界面是否显示
        //表格绑定的数据（请求接口）
        addForm: {
          name: '',
          modelId: '',
          remark: ''
        },
        searchForm: {
          dataSourceId: '',
          syncTableType: '',
          dataSourceName: '',
          sourceTable: ''
        },
        checkFiled: false, // 查看弹框是否显示
        previewData: [], //查看数据
        previewHeaderDatas: [], //查看表格头部
        //按钮判断
        Btn: {
          selectNewByPage: 0
        }
      };
    },
    methods: {
      labelHead(h, { column, index }) {
        let l = column.label.length;
        let f = 16; // 每个字的比例值，大概会比字体大小差不多大一点，
        column.minWidth = f * l;
        return h('div', [
          h(
            'span',
            { class: 'table-head', style: { width: '100%' } },
            [column.label]
          ),
          h('prompt-message', {
            style: { position: 'absolute', right: '-2%', top: '2%' },
            props: { messages: [column.label] }
          })
        ]);
      },
      //按钮权限
      getfuseParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api
          .getBtnFusePower({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code == 'code_200') {
              console.log('btns', res.data);
              res.data.forEach(item => {
                if (item.includes('selectNewByPage@GET')) {
                  self.Btn.selectNewByPage = 1;
                }
              });
            }
          });
      },
      //初始化请求数据
      getMonitoringResultSearch(searchForm) {
        this.recordType = 1;
        api
          .getMonitoringResultSearch({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            dataSourceId: searchForm.dataSourceId,
            dataSourceName: searchForm.dataSourceName,
            syncTableType: searchForm.syncTableType,
            sourceTable: searchForm.sourceTable
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.$store.commit('hideLoading', false);
              //状态码装换；
              res.data.forEach(item => {
                switch (item.syncTableType) {
                  case '1':
                    item.syncTableType = Common.tableType.AcquisitionSource;
                    break;
                  case '2':
                    item.syncTableType = Common.tableType.AcquisitionTarget;
                    break;
                  case '3':
                    item.syncTableType = Common.tableType.CleaningTarget;
                    break;
                  case '4':
                    item.syncTableType = Common.tableType.FusionTarget;
                    break;
                  case '5':
                    item.syncTableType = Common.tableType.DataqualityMonitor;
                    break;
                  case '6':
                    item.syncTableType = Common.tableType.moduleTarget;
                    break;
                }
              });
              this.tableData = res.data;
              this.totalNum = res.page.totalNumber;
            }
          });
      },
      //表类型；
      TableType() {
        api.cleanAddtableType({ code: 'TABLEINFO' })
          .then(res => {
            if (res.code === 'code_200') {
              this.sourceTableType = res.data;
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },
      // 查看
      handleClick(index) {
        this.$store.commit('showLoading', true);
        const self = this;
        var id = index.dataSourceId;
        //调取查看接口
        self.getMonitoringResultPreview({
          cleaningTable: index.sourceTable
        });
      },
      //搜索；
      sourceCheck() {
        console.log(this.searchForm);
        if (this.searchForm.syncTableType == 1) {
          this.searchForm.syncTableType = '';
        }
        this.getMonitoringResultSearch(this.searchForm);
      },
      //重置；
      sourceRest() {
        (this.searchForm.dataSourceId = ''),
          (this.searchForm.syncTableType = ''),
          (this.searchForm.dataSourceName = ''),
          (this.searchForm.sourceTable = '');
        this.getMonitoringResultSearch(this.searchForm);
      },
      //查看接口
      getMonitoringResultPreview(obj) {
        // this.$store.commit("showLoading", true);
        this.recordType = 2;
        api.getMonitoringResultPreview(obj)
          .then(res => {
            var testHeader = [];
            if (res.code == 'code_200') {
              this.$store.commit('hideLoading', false);
              this.tableData1 = res.data.value;
              this.previewHeaderDatas = res.data.lie;
              this.checkFiled = true;
              if (res.page) {
                self.totalNumResult = res.page.totalNumber;
              }
            } else {
              this.$store.commit('hideLoading', false);
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },
      //每页显示数据量编辑
      handleSizeChange: function (val) {
        var self = this;
        self.pageSize = val;
      },
      //每页显示数据量编辑
      SizeChange: function (val) {
        var self = this;
        self.pageSizeResult = val;
      },
      //页码编辑
      CurrentChange: function (val) {
        var self = this;
        self.currentPageResult = val;
        this.getMonitoringResultPreview();
      },
      //页码编辑
      handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getMonitoringResultSearch(this.searchForm);
      }
    },
    mounted() {
      //初始化页面
      const self = this;
      self.$store.commit('showLoading', true);
      this.recordType = 1;
      self.getMonitoringResultSearch(this.searchForm);
      //表类型
      this.TableType();
      self.getfuseParams();
    }
  };
</script>

<style lang="less" scoped>
  @import "monitoringResultSearch.less";

  .table-head {
    font-size: 14px !important;
    height: 20px;
  }
</style>
