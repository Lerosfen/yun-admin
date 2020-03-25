<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="title"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click='addMetaData' v-if="Btn.savequalitytesting">
          新增
        </el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-data">
              <label class="yellow middle m-r-10">检测名称</label>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="searchForms.testingName"></el-input>
              </div>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-data">
              <label class="yellow middle m-r-10">检测表</label>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="searchForms.testingTable"></el-input>
              </div>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-data">
              <label class="yellow middle m-r-10">结果状态</label>
              <div class="input-tpm yellow-input new-input">
                <el-select v-model="searchForms.resultState" @change="getResulteState">
                  <el-option label="成功" value="1"></el-option>
                  <el-option label="失败" value="2"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="checkMetaData">
            查询
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click='resetMetaData'>
            重置
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip=true>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row,2)"
                         type="text" size="small"
                         v-if='Btn.findqualityTestTable==1'
                         >
                查看
              </el-button>
              <el-button @click="handleClick(scope.row,1)"
                         type="text" size="small"
                         v-if="Btn.testing==1"
                         >
                执行
              </el-button>
              <el-button @click="handleClick(scope.row,4)"
                         type="text" size="small"
                         v-if="Btn.updatequalitytesting==1"
                         >
                编辑
              </el-button>
              <el-button @click="handleClick(scope.row,5)"
                         type="text" size="small"
                         v-if="Btn.findbyrecordid==1"
                         >
                预览
              </el-button>
              <el-button @click="handleClick(scope.row,3)"
                         type="text" size="small"
                         v-if="Btn.delqualitytesting==1"
                         >
                         删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination v-if="tableData.length!=0"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       layout="prev, pager, next"
                       :total="totleNum"
                       prev-text="上一页"
                       next-text="下一页">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="质量报告" :visible.sync="dialogTableVisible">
      <div class="chart">
        <div id="chart" style="width:100%;height:200px;"></div>
      </div>
      <div>
        <el-table :data="viewTableData" height="350">
          <el-table-column
            v-for="item in  viewTableColumn"
            :label="item.name"
            :prop="item.filed"
            :key="item.filed"
            :show-overflow-tooltip=true>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
  import api from '../../api/bigData/daq/qualityTest';
  export default {
    data() {
      //表单验证
      var validatePass = (rule, value, callback) => {
        console.log(rule, value);
        if (value === '') {
          callback(new Error('请输入有效信息'));
        } else {
          callback();
        }
      };
      return {
        titleName: '数据源',
        title: '数据质量检测',
        currentPage: 1,
        pageSize: 10,
        tableData: [], // 表数据
        headerData: [
          {
            prop: 'testingName',
            label: '检测名称',
          },
          {
            prop: 'testingTable',
            label: '检测表',
          },
          {
            prop: 'enableState',
            label: '运行状态',
          },
          {
            prop: 'resultState',
            label: '结果状态',
          },
          {
            prop: 'updateTime',
            label: '修改时间',
          },
          {
            prop: 'lastModifier',
            label: '修改人',
          },
        ], // 表头数据
        operate: [
          {
            type: 1,
            txt: '执行',
          },
          {
            type: 2,
            txt: '编辑',
          },
          {
            type: 3,
            txt: '删除',
          },
        ],
        childHeaderData: [
          {
            prop: 'ename',
            label: '英文名',
          },
          {
            prop: 'cname',
            label: '中文名',
          },
        ],
        childTableData: [],
        operateChild: [
          {
            type: '1',
            txt: '查看字段',
          },
        ],
        cname: '',
        ip: '',
        metaMainView: true, // 显示子页面
        checkFiled: false, // 表同步查看字段页面
        zxtb: false, // 执行同步
        mainDialog: false, // 新增查看编辑页面
        form: {
          sourceName: '',
          sourceIp: '',
          sourceAccount: '',
          dataBaseType: '',
          sourcePass: '',
          sourcePort: '',
          sourceRemarks: '',
          sourceSystem: '',
        },
        mainDisabled: false,
        mainDialogBtnType: '', // 1 执行 2 编辑 3 删除

        //按钮判断
        Btn: {
          savequalitytesting: 0,
          findqualityTestTable: 0,
          updatequalitytesting: 0,
          delqualitytesting: 0,
          testing: 0
        },
        searchForms: {
          testingName: '',
          resultState: '',
          testingTable: ''
        },
        dialogTableVisible: false,
        viewTableColumn: [],
        viewTableData: []
      };
    },
    mounted() {
      this.$store.commit('showLoading', true);
      this.initQualityTest(this.searchForms);
      this.getqualityParams();
      sessionStorage.removeItem('jianceRow');
    },
    methods:{
      // 点击选中查看、编辑、表同步
      handleClick(row, type) {
        const self = this;
        switch (type) {
          case 1:
            self.$confirm('是否执行？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'blue-btn',
              confirmButtonClass: 'yellow-btn',
              type: 'warning',
              center: true
            })
              .then(() => {
                let qs = require('qs');
                let TestId = qs.stringify({ qualityTestingId: row.id });
                console.log(TestId, 'TestId');
                api.executeQualityTest(TestId)
                  .then((res) => {
                    if (res.code == 'code_200') {
                      this.initQualityTest(this.searchForms);
                    }
                  });
              })
              .catch(() => {

              });
            break;
          case 2:
            this.$router.push({
              path: 'qualityTestAdd',
              query: {
                type: 1,
                id: row.id,
                menuLink: this.$route.query.menuLink,
              }
            });
            break;
          case 3:   //表同步
            this.$confirm('是否删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'blue-btn',
              confirmButtonClass: 'yellow-btn',
              type: 'warning',
              center: true
            })
              .then(() => {
                api.deleteQualityTest({ qualityTestingId: row.id })
                  .then(res => {
                    if (res.code === 'code_200') {
                      this.initQualityTest(this.searchForms);
                      this.$notify({
                        tittle: '成功',
                        message: res.msg,
                        type: 'success',
                        offset: 100,
                        duration: this.$store.state.el_Duration
                      });
                    } else {
                      this.$notify({
                        tittle: '失败',
                        message: res.msg,
                        type: 'error',
                        offset: 100,
                        duration: this.$store.state.el_Duration
                      });
                    }
                  }, errorRes => {
                  });
              })
              .catch((err) => {
              });
            break;
          case 4:   //编辑
            this.$router.push({
              path: 'qualityTestAdd',
              query: {
                type: 2,
                id: row.id,
                menuLink: this.$route.query.menuLink,
              }
            });
            break;
          case 5:   //预览
            this.dialogTableVisible = true
            this.getViewDataById(row.id)
            break;
        }
      },

      // 新增
      addMetaData() {
        this.$router.push({
          path: 'qualityTestAdd',
          query: {
            type: 0,
            menuLink: this.$route.query.menuLink,
          }
        });
      },
      //按钮权限
      getqualityParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api.getqualityparams({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              console.log('res', res.data);
              res.data.forEach(item => {
                if (item.includes('savequalitytesting@POST')) {
                  self.Btn.savequalitytesting = 1;
                }
                if (item.includes('findqualityTestTable@GET')) {
                  self.Btn.findqualityTestTable = 1;
                }
                if (item.includes('delqualitytesting@DELETE')) {
                  self.Btn.delqualitytesting = 1;
                }
                if (item.includes('updatequalitytesting@PUT')) {
                  self.Btn.updatequalitytesting = 1;
                }
                if (item.includes('testing@POST')) {
                  self.Btn.testing = 1;
                }

              });
            }
          });
      },

      //新增、编辑  确认
      addMetaDataSure() {
        const self = this;
        //新增确认
        if (this.mainDialogBtnType === '1') {
          let addList = self.form;
          this.$refs.form.validate((valid) => {
            if (valid) {
              api.addDataSource(addList)
                .then((res) => {
                  if (res.code == 'code_201') {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    });
                    self.mainDialog = false;
                    self.initDataResource();
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    });
                  }
                });
            } else {
              this.$message({
                type: 'error',
                message: '请填写完整信息',
              });
              return false;
            }
          });
        }

        // 编辑确认
        if (this.mainDialogBtnType === '3') {
          api.modifyDataSource(self.form)
            .then((res) => {
              if (res.code == 'code_201') {
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                self.mainDialog = false;
                self.initDataResource();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });

        } else {
        }

      },

      // 取消新增
      cancelAdd() {
        for (const obj in this.form) {
          this.form[obj] = '';
        }
        this.mainDialog = false;
      },
      // 初始化数据
      initQualityTest(searchForm) {
        let self = this;
        api.getAllQualityTest({
          testingName: searchForm.testingName,
          resultState: searchForm.resultState,
          testingTable: searchForm.testingTable,
          currentPage: self.currentPage,
          pageSize: self.pageSize,
        })
          .then((res) => {
            if (res.code == 'code_200') {
              this.$store.commit('hideLoading', false);
              res.data.forEach((value) => {
                value.createTime = self.formatDate(value.createTime);
                value.updateTime = self.formatDate(value.updateTime);
                if (value.enableState == 1) {
                  value.enableState = '启用';
                } else if (value.enableState == 2) {
                  value.enableState = '禁用';
                }
                if (value.resultState == 1) {
                  value.resultState = '成功';
                } else if (value.resultState == 2) {
                  value.resultState = '未知';
                }

              });
              self.tableData = res.data;
              self.totleNum = res.page.totalNumber;
            }
          });
      },
      // 每页显示数据量编辑
      handleSizeChange(val) {
        const self = this;
        self.pageSize = val;
        self.initQualityTest(this.searchForms);
      },

      // 页码编辑
      handleCurrentChange(val) {
        const self = this;
        self.currentPage = val;
        self.initQualityTest(this.searchForms);
      },
      getResulteState(e) {
        this.searchForms.resultState = e;
      },
      // 查询
      checkMetaData() {
        this.initQualityTest(this.searchForms);
      },

      // 重置
      resetMetaData() {
        this.searchForms.testingName = '';
        this.searchForms.resultState = '';
        this.searchForms.testingTable = '';
        this.initQualityTest(this.searchForms);
      },
      // 预览
      getViewDataById(viewId) {
        api.getViewDataById({id:viewId}).then(res => {
          // console.log(res)
          if (res.code === 'code_200') {
            this.getPieData(JSON.parse(res.data.value.result))
            this.getTableData(res.data.key,JSON.parse(res.data.value.resultData))
          }
        })
      },
      // 预览弹窗饼状图
      getPieData(dataValue) {
        // 处理返回数据
        let pieDataValue = []
        for (let item in dataValue) {
          if (item === 'checkNum') {
            pieDataValue.push({
              value: dataValue[item],
              name: '符合'
            })
          } else {
            pieDataValue.push({
              value: Number(dataValue[item]) - Number(dataValue['checkNum']),
              name: '不符合'
            })
          }
        }
         let pieOption = {
          // title: {
          //   text: '某站点用户访问来源',
          //   subtext: '纯属虚构',
          //   left: 'center'
          // },
          legend: {
            // orient: 'vertical',
            selectedMode:false,
            left: 'center',
            data: ['符合', '不符合']
          },
          series: [
            {
              name: '质量报告',
              type: 'pie',
              radius: '65%',
              center: ['50%', '60%'],
              data: pieDataValue,
              // data: [
              //   {value: 335, name: '符合'},
              //   {value: 310, name: '不符合'}
              // ],
              emphasis: {
                itemStyle: {
                  fontSize: 14,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          textStyle:{
             fontSize:10
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
        };
        this.$nextTick(() => {
          this.$echarts.init(document.getElementById('chart')).setOption(pieOption);
        })
      },
      // 弹窗table列表
      getTableData(columnData,resultData) {
        this.viewTableColumn = columnData
        this.viewTableData = resultData
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  /*@import "./metaDataSource.less";*/
  .chart{
    margin-bottom: 1rem;
  }
</style>
