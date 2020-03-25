<template>
  <!--  画像的标签管理 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <list-table-title title="图表配置" :isBack="false"></list-table-title>
    <!-- 表格 -->
    <div class="table-container pag-position">
      <el-table :data="tableData" stripe style="width:100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column
          v-for="item in tableHeader"
          :label="item.label"
          :prop="item.prop"
          :key="item.id"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,1)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClick(scope.row,2)" type="text" size="small">配置</el-button>
            <!--<el-button @click="handleClick(scope.row,3)" v-show="scope.row.isCall==1" type="text" size="small">统计</el-button>-->
            <!--<el-button @click="handleClick(scope.row,3)" v-show="scope.row.isCall==2" type="text" size="small" style="display: inline-block ;width: 25px"></el-button>
            <el-button @click="handleClick(scope.row,4)" type="text" size="small">启用</el-button>-->
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

    <!-- 编辑 -->
    <Modal
      v-model="editMaintainView"
      :title="maintainTitle"
      width="25%"
      :closable="false"
      :mask-closable="false"
    >
      <el-form label-width="200px" :rules="addFormRules" ref="addFormRules" :model="form">
        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="图表标题" prop="title">
                <div class="input-tpm blue-input new-input">
                  <el-input
                    placeholder="请输入图表标题"
                    v-model="form.title"
                    :disabled="enable"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="图表编码" prop="chartNumber">
                <div class="input-tpm blue-input new-input">
                  <el-input
                    placeholder="请输入图表编码"
                    v-model="form.chartNumber"
                    :disabled="disabled"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="图表类型" prop="chartType">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入图表类型" v-model="form.chartType" :disabled="disabled"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="表名" prop="enTableName">
                <div class="input-tpm blue-input new-input">
                  <el-input
                    placeholder="请输入表名"
                    v-model="form.enTableName"
                    :disabled="disabled"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="passWordSubmit">确 认</el-button>
        <el-button class="yellow-btn" type="primary" @click="resetData">重 置</el-button>
        <el-button class="blue-btn" @click="cancleModal()">取 消</el-button>
      </div>
    </Modal>
    <!-- 配置字段 -->
    <Modal
      v-model="fieldsConfig"
      title="配置字段"
      width="40%"
      :closable="false"
      :mask-closable="false"
    >
      <div class="table-container pag-position">
        <el-row>
          <el-col>
            <el-table
              ref="multipleTable"
              @selection-change="fieldsConfigleSelectionChange"
              :data="NewArrs"
              height="280"
              style="width: 100%"
            >
              <el-table-column width="40" type="selection"></el-table-column>
              <el-table-column
                v-for="item in modelHeaderData"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"

                :show-overflow-tooltip="true"
                :width="item.width"
              ></el-table-column>

              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <div class="input-data fl m-l-10">
                    <div class="input-tpm yellow-input new-input">
                      <el-select v-if="scope.row.sign" v-model="scope.row.sign" size="mini"
                                 @change="changeClick(scope.row,1)" placeholder="唯一标识">
                        <el-option
                          v-for="item in filterSelect"
                          :key="item.id"
                          :label="item.zhName"
                          :value="item.sign"
                          size="small"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer footerBtn">
        <el-button class="blue-btn" type="primary" @click.native="fieldsConfigSubmit">确 定</el-button>
        <el-button class="yellow-btn" @click="fieldsConfigCancle()">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../api/bigData/daq/chartConfig/chartConfig';
  import '../../assets/js/lodash';

  export default {
    data() {
      return {
        tableHeader: [
          {
            prop: 'chartNumber',
            label: '图表编码'
          },
          {
            prop: 'title',
            label: '图表标题'
          },
          {
            prop: 'chartType',
            label: '图表类型'
          },
          {
            prop: 'enTableName',
            label: '表名'
          },
        ],
        tableData: [],
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        editMaintainView: false,
        maintainTitle: '',
        form: {
          chartNumber: '',
          title: '',
          chartType: '',
          enTableName: '',
        },
        enable: false, //可以输入
        disabled: true, //不能输入
        // 验证
        addFormRules: {
          chartNumber: [
            { required: true, message: '请输入图表标题', trigger: 'blur' }
          ],
          title: [{ required: true, message: '请输入图表编码', trigger: 'blur' }],
          chartType: [
            { required: true, message: '请输入图表类型', trigger: 'blur' }
          ],
          enTableName: [
            { required: true, message: '请输入表名', trigger: 'blur' }
          ],
        },
        editId: '',
        fieldsConfigTitle: '配置字段',
        fieldsConfig: false,
        initFilterData: [],
        modelHeaderData: [
          {
            prop: 'enFieldsName',
            label: '英文名',
          },
          {
            prop: 'metadataName',
            label: '中文名',
          },
          {
            prop: 'dataType',
            label: '数据类型',
          },
          {
            prop: 'dataFormat',
            label: '数据格式',
          },
        ],
        modelTableData: [],
        enFieldsName: '',
        uniqueIdList: [
          {
            id: '111',
            name: 'SEX'
          },
          {
            id: '222',
            name: 'AGE'
          },
          {
            id: '333',
            name: 'ID'
          },
          {
            value: '444',
            id: 'DATE'
          },
        ],
        multipleSelection: [],
        newArr: [],
        allNewArr: [],
        allNewChange: [],
        NewArrs: [],
        mergeData: [],
        showArry: [],
        filterSelect: [],
        resultsMerge: [],
        ConfigId: '',
      };
    },
    methods: {
      handleClick(row, type) {
        if (type == 1) {
          this.maintainTitle = '编辑标签';
          this.editMaintainView = true;
          this.form = {
            chartNumber: row.chartNumber,
            title: row.title,
            chartType: row.chartType,
            enTableName: row.enTableName
          };
          this.editId = row.id;
        }
        if (type == 2) {
          this.fieldsConfig = true;
          this.filterConfigData(row.enTableName, row.chartNumber);
        }
        if (type == 3) {
        }

        if (type == 4) {
        }
      },
      handleCurrentChange: function (val) {
        this.mergeData = val;
        console.log('this.mergeData ', this.mergeData);
        // self.init();
      },
      cancleModal() {
        this.editMaintainView = false;
      },
      resetData() {
        var obj = this.form;
        this.form.title = '';
      },
      //页面初始化进入后查询
      init() {
        var self = this;
        api.confList({})
          .then(res => {
            if (res.code == 'code_200') {
              self.tableData = res.data;
              // self.totalNum = res.page.totalNumber;
            }
          });
        api.sign({})
          .then(res => {
            if (res.code == 'code_200') {
              this.filterSelect = res.data;
              //this.filterSelect.push({sign: '',zhName: '请选择'});
              //console.log('999',this.filterSelect)
              // self.totalNum = res.page.totalNumber;
            }
          });

      },
      //编辑确定
      passWordSubmit(id) {
        var self = this;
        self.$refs.addFormRules.validate(valid => {
          if (!valid) {
            self.$message({
              type: 'error',
              message: '请填写完整信息'
            });
            return false;
          } else {
            self.updateTitle(id);
          }
        });
      },
      //编辑更新
      updateTitle() {
        var self = this;
        $.ajax({
          url: sessionStorage.getItem('ApiUrl') + '/daq-service/conf/updateTitle',
          type: 'PUT',
          data: {
            title: self.form.title,
            id: self.editId,
          },
          success: function (data) {
            if (res.code == 'code_200') {
              this.editMaintainView = false;
            }
          }
        });
        /*api.updateTitle({
         title: self.form.title,
         id: self.editId,
         }).then(res => {
         /!*if (res.code == "code_200") {
         this.editMaintainView =true
         }*!/
         }).catch((error) => {
         console.log(error)
         });*/
      },
      //删除
      deleteMaintainData(id) {
      },
      fieldsConfigSubmit() {
        //console.dir(this.resultsMerge)
        var params = {};
        params.chartNumber = this.ConfigId;
        params.fields = _.map(this.resultsMerge, o => _.omit(o, ['chartNumber']));
        console.log('params', params);
        var json = JSON.stringify(params);
        $.ajax({
          url: sessionStorage.getItem('ApiUrl') + '/daq-service/conf/save',
          type: 'POST',
          data: {
            whereJson: JSON.stringify(json)
          },
          success: function () {
            //alert(data);
          }
        });
        this.fieldsConfig = false;
      },
      fieldsConfigCancle() {
        this.fieldsConfig = false;
      },
      changeClick() {
      },
      fieldsConfigleSelectionChange(val) {
        this.resultsMerge = val;
        console.log('this.resultsMerge ', this.resultsMerge);
      },
      fieldsConfigInit() {
        if (this.NewArrs.length != 0) {
          var nameList = [];
          this.NewArrs.forEach(item => {
            nameList.push(item.enFieldsName);
          });
          this.initFilterData.forEach(item => {
            this.allNewArr.push(item.metadataEnglisName);
          });

          this.initFilterData.forEach((item, index) => {
            if (nameList.length) {
              if (nameList.indexOf(item.metadataEnglisName) > -1) {

                this.newArr.push({
                  enFieldsName: item.metadataEnglisName,
                  metadataName: item.metadataName,
                  dataType: item.dataType,
                  dataFormat: item.dataFormat
                });
              }
            }
          });
          var difference = _.difference(this.allNewArr, nameList);
          //console.log('difference', difference);

          this.initFilterData.forEach((item, index) => {
            if (difference.length) {
              if (difference.indexOf(item.metadataEnglisName) > -1) {
                this.allNewChange.push({
                  enFieldsName: item.metadataEnglisName,
                  metadataName: item.metadataName,
                  dataType: item.dataType,
                  dataFormat: item.dataFormat
                });
              }
            }
          });

          var arrNewChange = [];
          this.allNewChange.map(((item, index) => {
            arrNewChange.push(Object.assign({}, item, { isNo: false }, { sign: 'YJHH_SEX' }));
          }));
          if (this.newArr.length != 0) {
            var merged = _(this.NewArrs)
              .concat(this.newArr)
              .groupBy('enFieldsName')
              .map(_.spread(_.merge))
              .value();
            this.NewArrs = merged;
            this.NewArrs.map(((item, index) => {
              this.showArry.push(Object.assign({}, item, { isNo: true }));
            }));
            this.NewArrs = this.showArry.slice(-3);
            console.log('111', this.NewArrs);
            console.log('2222', arrNewChange);
            this.resultsMerge = _.unionBy(this.NewArrs, arrNewChange, 'enFieldsName');
            this.NewArrs = this.resultsMerge;
            //this.resultsMerge= this.NewArrs.push(arrNewChange);
            console.log('3333', this.resultsMerge);
            this.$nextTick(function () {
              this.NewArrs.forEach((item, index) => {
                if (item.isNo == true) {
                  this.$refs.multipleTable.toggleRowSelection(
                    this.NewArrs[index],
                    true
                  );
                }
              });
            });
          } else if (this.newArr.length == 0) {
            this.NewArrs.length = 0;
          }

        }
      },
      fieldsConfigInitLength() {

        this.initFilterData.forEach((item, index) => {
          this.allNewChange.push({
            enFieldsName: item.metadataEnglisName,
            metadataName: item.metadataName,
            dataType: item.dataType,
            dataFormat: item.dataFormat
          });
        });

        var arrNewChange = [];
        this.allNewChange.map(((item, index) => {
          arrNewChange.push(Object.assign({}, item, { isNo: false }, { sign: 'YJHH_SEX' }));
        }));
        //console.log('arrNewChange',arrNewChange)
        this.resultsMerge = arrNewChange;
        this.NewArrs = arrNewChange;
        this.$nextTick(function () {
          this.NewArrs.forEach((item, index) => {
            if (item.isNo == true) {
              this.$refs.multipleTable.toggleRowSelection(
                this.NewArrs[index],
                true
              );
            }
          });
        });
      },
      filterConfigData(enTableName, chartNumber) {
        api.selectBasicTableManagementNanme({
          BasicTableNanme: enTableName,
        })
          .then(res => {
            if (res.code == 'code_200') {
              this.initFilterData = res.data.metadataMaintenance;
              console.log('开始 initFilterData', this.initFilterData);
              api.fieldsList({
                chartNumber: chartNumber,
              })
                .then(res => {
                  if (res.code == 'code_200') {

                    this.ConfigId = chartNumber;
                    if (res.data.length != 0) {
                      this.NewArrs = res.data;
                      this.fieldsConfigInit();
                    } else if (res.data.length == 0) {
                      this.fieldsConfigInitLength();
                    }
                  }
                });
            }
          });

      },
    },
    mounted() {
      var self = this;
      self.init();
    }
  };
</script>

<style scoped lang="less" type="text/less">
  @import "chartConfig.less";
</style>
