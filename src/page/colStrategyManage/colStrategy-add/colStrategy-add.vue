<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>

    <div class="content-section">
      <!--列表标题-->
      <list-table-title v-bind:title="titles" v-bind:isBack="false"></list-table-title>
      <!--新增选项-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRules"
        label-width="100px"
        class="search-template"
      >
        <el-row>
          <el-col :span="6" :xs="11" :sm="8" :lg="6">
            <el-form-item label="策略名称" prop="strategyName">
              <div class="input-tpm blue-input w-150 new-input">
                <el-input placeholder v-model="addForm.strategyName" :disabled="isDisabled"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="11" :sm="8" :lg="6">
            <el-form-item label="数据源" prop="dataSourceId">
              <div class="sel-group sel-blue w-150 new-input">
                <el-select
                  v-model="addForm.dataSourceId"
                  placeholder="请选择"
                  @change="changeSouse"
                  :disabled="types!=0"
                >
                  <el-option
                    v-for="item in SourceArr"
                    :key="item.id"
                    :label="item.sourceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="11" :sm="8" :lg="6">
            <el-form-item label="是否增量" prop="incrementState">
              <div class="sel-group sel-blue w-150 new-input">
                <el-select
                  v-model="addForm.incrementState"
                  placeholder="请选择"
                  :disabled="isDisabled"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="11" :sm="8" :lg="6">
            <el-form-item label="是否定时" prop="timingState">
              <div class="sel-group sel-blue w-150 new-input">
                <el-select
                  v-model="addForm.timingState"
                  placeholder="请选择"
                  :disabled="isDisabled"
                  @change="handleIsTiming"
                >
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="11" :sm="8" :lg="6" v-show="addForm.timingState==1">
            <el-form-item label="定时规则" prop="timingRules">
              <div class="input-tpm blue-input w-150 new-input">
                <el-input
                  disabled
                  placeholder
                  v-model="addForm.timingRules"
                  id="cron"
                  ref="timingRules"
                ></el-input>
              </div>
              <el-button class="blue-btn new-btn" style="position: absolute;top: 2%;right: -5%;" v-if="isEdit"
                         @click="cronModal=true">修 改
              </el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="18" v-show="addForm.timingState==1&&types!=1">
            <el-form-item label="定时器" prop="timing">
              <div class="input-group">
                <div id="selector"></div>
              </div>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row></el-row>
        <!-- <el-row>
          <el-col :span="16">选择列表</el-col>
          <el-col :span="8" >
            <div class="input-group ">
              <label for="" class=" middle m-r-10">搜索</label>
              <div class="input-tpm yellow-input">
                <i class="honer-left"></i>
                <el-input  placeholder="" v-model="tableName"  @keyup.native='searchChange'></el-input>
                <i class="honer-right"></i>
              </div>
            </div>
          </el-col>
        </el-row>-->

        <span>选择列表</span>
        <div class="input-group fr" style="margin-right: 20px">
          <label for class="middle m-r-10">搜索</label>
          <div class="input-tpm yellow-input new-input">
            <el-input placeholder v-model="tableName" @keyup.native="searchChange"></el-input>
          </div>
        </div>
      </el-form>
      <!--列表-->
      <el-row>
        <el-col :span="24">
          <div class="table-container firtTable pag-position">
            <el-table
              v-if="types!=1"
              @select="tableChange"
              @select-all="selAll"
              @selection-change="selChange"
              ref="tableDate"
              height="400"
              :data="tableData"
              class="col-table"
              :highlight-current-row="true"
              style="width: 100%"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                v-for="item in headerData"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
                :show-overflow-tooltip="true"
                width="item.width"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="handleClick(scope.row)"
                    type="text"
                    size="small"
                    ref="isActive"
                    :disabled="scope.row.notCheck"
                  >采集设置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-pagination v-if="tableData.length!=0 && types!=1"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       layout="prev, pager, next"
                       :total="totleNum"
                       prev-text="上一页"
                       next-text="下一页">
            </el-pagination>-->

            <el-table v-if="types==1" :data="searchTableData" class="col-table" style="width: 100%">
              <el-table-column
                v-for="item in searchHeaderData"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
                :show-overflow-tooltip="true"
                width="item.width"
              ></el-table-column>
            </el-table>
            <!-- <el-pagination
              v-if="searchTableData.length!=0 && types==1"
              :current-page="deCurrentPage"
              :page-size="dePageSize"
              @size-change="deSizeChange"
              @current-change="deCurrentChange"
              layout="prev, pager, next"
              :total="deTotleNum"
              prev-text="上一页"
              next-text="下一页"
            ></el-pagination>-->
          </div>
        </el-col>
      </el-row>
      <div class="btn-group" v-if="types!=1">
        <el-button class="yellow-btn" @click="savData()">确 定</el-button>
        <el-button class="blue-btn new-btn" @click="goBack()">取 消</el-button>
      </div>
      <div class="box-center" v-if="types==1">
        <el-button class="blue-btn new-btn" @click="goBack()">关 闭</el-button>
      </div>

      <!--采集设置-->
      <Modal title="采集设置" v-model="colVisible" :closable="false" :mask-closable="false" width="40%">
        <el-row v-show="false">
          <el-col :span="6" :offset="18" class="p-10">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="搜索" v-model="targetField" @keyup.native="searchFild"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="table-container colStrategy-table pag-position">
              <el-table :data="coltableData" stripe style="width: 100%" height="400">
                <el-table-column label="字段" align="center" prop="targetField"></el-table-column>
                <el-table-column label="字段描述" align="center" prop="targetFieldName"></el-table-column>
                <el-table-column label="是否主键" align="center" width="100">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="primaryKeyField"
                      @change.native="partFieldsChange(scope.row,scope.$index)"
                      :label="scope.row.targetField"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="是否增量时间戳" align="center" width="130">
                  <template slot-scope="scope">
                    <el-radio
                      v-model="timestampField"
                      @change.native="timesChange(scope.row,scope.$index)"
                      :label="scope.row.targetField"
                    ></el-radio>
                  </template>
                </el-table-column>
              </el-table>
              <!--<el-col :span="24">-->
              <el-pagination
                v-if="coltableData.length!=0"
                :current-page="colCurrentPage"
                :page-size="colPageSize"
                @size-change="colHandleSizeChange"
                @current-change="colHandleCurrentChange"
                layout="prev, pager, next"
                :total="colTotleNum"
                prev-text="上一页"
                next-text="下一页"
              ></el-pagination>
              <!--</el-col>-->
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button class="yellow-btn" @click="savCol()">保存</el-button>
          <el-button class="blue-btn" @click="closeCol()">关闭</el-button>
        </div>
      </Modal>

      <Modal title="选择定时规则" width="30%" v-model="cronModal" :closable="false" :mask-closable="false">
        <div style="height: 480px;">
          <div class="input-tpm blue-input" style="width: 520px; border: 1px solid #4cbaff">
            <el-input disabled v-model="addForm.timingRules"></el-input>
          </div>
          <cron v-model="addForm.timingRules"></cron>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="yellow-btn" @click="cronModal = false">确 定</el-button>
          <el-button class="blue-btn new-btn" @click="cancelCron">取 消</el-button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  var qs = require('qs');
  import api from '../../../api/bigData/daq/colStrategyManage';
  import cron from '../../../components/cron';
  // import "../../../assets/js/jquery-gentleSelect";
  // import "../../../assets/js/jquery-cron.js";
  export default {
    components: {
      cron
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (this.addForm.timingState == '1' && value === '') {
          callback(new Error('请选择定时规则'));
        } else {
          //            if (this.ruleForm2.checkPass !== '') {
          //              this.$refs.ruleForm2.validateField('checkPass');
          //            }
          callback();
        }
      };
      return {
        isEdit: true,
        timeCron: '',
        cronModal: false,
        srcTableName: '',
        searchTableData: [],
        keyArr: [],
        currRow: [],
        timeStr: '',
        defaulfId: '',
        titles: '',
        totleNum: 1,
        colTotleNum: 1,
        deTotleNum: 1,
        confirmType: '',
        colVisible: false,
        types: this.$route.query.type ? this.$route.query.type : '',
        options: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '2',
            label: '否'
          }
        ],
        options1: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '2',
            label: '否'
          }
        ],
        options2: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '2',
            label: '否'
          }
        ],
        addForm: {
          strategyName: '',
          dataSourceId: '',
          incrementState: '2',
          timingState: '2',
          timingRules: '',
          strategyTableVoList: []
        },
        primaryKeyField: [],
        timestampField: '',
        currentPage: 1,
        colCurrentPage: 1,
        deCurrentPage: 1,
        pageSize: 10,
        colPageSize: 10,
        dePageSize: 10,
        SourceArr: [],
        checkTable: [],
        value: '',
        isDisabled: false,
        isShowTime: false,
        keyDefault: '',
        tacticsName: '',
        tableName: '',
        TimingRule: '',
        dataSource: '',
        isTiming: '',
        tableData: [], //表头1数据
        coltableData: [], //字段表数据
        AllDataTable: [], //所有数据表
        targetField: '',
        oldTableData: [],
        headerData: [
          {
            prop: 'srcTableName',
            label: '表名',
            width: '120'
          },
          {
            prop: 'srcTableCode',
            label: '中文表名',
            width: '120'
          },
          {
            prop: 'timestampField',
            label: '时间戳字段',
            width: '100'
          },
          {
            prop: 'primaryKeyField',
            label: '主键字段',
            width: '180'
          }
        ],
        searchHeaderData: [
          {
            prop: 'srcTableName',
            label: '源表',
            width: '120'
          },
          {
            prop: 'srcTableCode',
            label: '中文表名',
            width: '120'
          },
          {
            prop: 'daqTable',
            label: '目标表',
            width: '100'
          },
          {
            prop: 'srcTableCode',
            label: '目标表描述',
            width: '180'
          },
          {
            prop: 'primaryKeyField',
            label: '主键字段',
            width: '80'
          },
          {
            prop: 'timestampField',
            label: '时间戳字段',
            width: '80'
          },
          {
            prop: 'sccjTime',
            label: '最后采集时间',
            width: '80'
          }
        ],
        operate: [
          {
            type: 1,
            txt: '采集设置'
          }
        ],
        editorStrage: [],
        msg: {},

        //编辑判断条件
        Upstragydata: {
          dataSourceId: '',
          dataSource: {
            id: '',
            lastModifier: '',
            sourceCode: '',
            sourceName: '',
            updateTime: ''
          },
          id: '',
          lastModifier: '',
          strategyName: '',
          timingRules: '',
          timingState: '',
          updateTime: ''
        },
        //添加判断条件
        addStragedata: {
          dataSourceId: '1',
          enableState: '1',
          strategyTableVoList: [
            {
              daqTable: '1',
              daqTableCode: '1',
              daqTableName: '1',
              id: '1',
              primaryKeyField: '1',
              srcTableCode: '1',
              srcTableId: '1',
              srcTableName: '1',
              strategyId: '1',
              timestampField: '1',
              timestampIndex: 0
            }
          ],
          strategyName: '1',
          timingRules: '1',
          timingState: '1'
        },
        addFormRules: {
          strategyName: [
            { required: true, message: '请输入策略名称', trigger: 'blur' }
          ],
          dataSourceId: [
            { required: true, message: '请选择数据源', trigger: 'change' }
          ],
          timingRules: [{ validator: validatePass, trigger: 'blur' }]
        }
      };
    },
    methods: {
      savCron() {
      },
      cancelCron() {
        this.cronModal = false;
        // this.addForm.timingState = "";
      },
      handleIsTiming() {
        // console.log(this.addForm.timingState);
        var self = this;
        var isTime = self.addForm.timingState;
        if (isTime == '1') {
          self.cronModal = true;
        }
      },

      // 关闭
      closeCol() {
        this.colVisible = false;
        this.primaryKeyField = [];
        this.timestampField = '';
        this.targetField = '';
        this.colCurrentPage = 1;
      },
      //      搜索字段
      searchFild() {
        console.log('value', this.targetField);
        this.getFild();
      },

      // 字段选择确认
      savCol() {
        this.colVisible = false;
        this.tableData.forEach(e => {
          if (e.syncTableId == this.defaulfId) {
            e.primaryKeyField = this.primaryKeyField.join(',');
            e.timestampField = this.timestampField;
          }
        });
      },
      // 主键选择
      partFieldsChange(row) {
        console.log('row', this.primaryKeyField);
      },
      // 时间增量选择
      timesChange(row) {
        console.log('danxuan', this.timestampField);
      },
      //每页显示数据量编辑
      handleSizeChange: function (val) {
        var self = this;
        self.pageSize = val;
      },

      //页码编辑
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
      },
      //每页显示数据量编辑
      colHandleSizeChange: function (val) {
        var self = this;
        self.colPageSize = val;
      },
      //详情页码编辑
      deCurrentChange: function (val) {
        var self = this;
        self.deCurrentPage = val;
      },
      //详情每页显示数据量编辑
      deSizeChange: function (val) {
        var self = this;
        self.dePageSize = val;
      },
      //页码编辑
      colHandleCurrentChange: function (val) {
        var self = this;
        self.colCurrentPage = val;
        self.getFild();
      },
      //页面传过来得值
      initColStrange() {
        // 取到路由带过来的参数
        let routerParams = this.$route.params.id;
        // 将数据放在当前组件的数据内
        this.id = routerParams;
      },
      //采集设置选中
      tableChange(val, oldVal) {
        oldVal.notCheck = !oldVal.notCheck;
      },
      //      选中
      selChange(val) {
        console.log('xuanzhong', val);
        this.checkTable = val;
      },
      //      全选
      selAll(val) {
        if (val.length > 0) {
          val.forEach(e => {
            if (e.notCheck) e.notCheck = !e.notCheck;
          });
        } else {
          this.tableData.forEach(e => {
            e.notCheck = true;
          });
        }
      },
      // 采集设置
      handleClick(data) {
        // this.$refs.isActive.value ="22";
        console.log('type', data);
        this.primaryKeyField = [];
        this.timestampField = '';
        this.targetField = '';
        this.colVisible = true;
        //        this.addForm.StrategyTableVo.primaryKeyField=[],
        //        this.addForm.StrategyTableVo.timestampField='',
        this.defaulfId = data.syncTableId;
        this.srcTableName = data.srcTableName;
        this.currRow = data;
        this.getFild();
      },
      //      获取字段
      getFild() {
        var params = {
          dataSourceId: this.addForm.dataSourceId,
          syncTableId: this.defaulfId,
          targetField: this.targetField,
          tableName: this.srcTableName,
          currentPage: this.colCurrentPage,
          pageSize: this.colPageSize
        };
        api.getField(params)
          .then(res => {
            console.log('res', res.data);
            console.log('current', this.currRow);
            if (res.code == 'code_200') {
              this.coltableData = res.data;
              this.colTotleNum = res.page.totalNumber;
              if (this.types == 2) {
                this.timestampField = this.currRow.timestampField;
                this.primaryKeyField = this.currRow.primaryKeyField.split(',');
              }
            }
          });
      },
      //搜索
      searchChange() {
        let self = this;
        console.log('self.tableName', self.tableName);
        if (this.types == 1) {
          var oldTableData = [];
          self.searchTableData.forEach((item, index) => {
            if (
              item.srcTableName.indexOf(self.tableName) != -1 ||
              item.srcTableCode.indexOf(self.tableName) != -1 ||
              item.daqTableName.indexOf(self.tableName) != -1 ||
              item.daqTable.indexOf(self.tableName) != -1
            ) {
              oldTableData.push(item);
            }
          });
          self.searchTableData = oldTableData;
          if (self.tableName == '') {
            self.searchTableData = self.oldSearchTableData;
          }
        } else {
          var oldTableData = [];
          self.tableData.forEach((item, index) => {
            if (
              item.srcTableName.indexOf(self.tableName) != -1 ||
              item.srcTableCode.indexOf(self.tableName) != -1
            ) {
              oldTableData.push(item);
            }
          });
          self.tableData = oldTableData;
          if (self.tableName == '') {
            self.tableData = self.oldTableData;
          }
        }
      },
      //数据源点击事件
      changeSouse(value) {
        let self = this;
        //调用接口
        api.getSourceById({ dataSourceId: value })
          .then(res => {
            if (res.code == 'code_200') {
              self.AllDataTable = res.data;
              this.totleNum = res.page.totalNumber;
              self.tableData = [];
              var type = '';
              self.AllDataTable.forEach(e => {
                switch (e.syncTableType) {
                  case '1':
                    type = '采集源';
                    break;
                  case '2':
                    type = '采集目标';
                    break;
                  case '3':
                    type = '清洗目标';
                    break;
                  case '4':
                    type = '融合目标';
                    break;
                  case '5':
                    type = '数据质量检测';
                    break;
                }
                self.tableData.push({
                  syncTableId: e.id,
                  srcTableName: e.sourceTable,
                  srcTableCode: e.sourceTableMame,
                  syncTableType: type,
                  primaryKeyField: '',
                  timestampField: '',
                  notCheck: true
                });
              });
              console.log('table', this.tableData);
              this.oldTableData = this.tableData;
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          });
      },
      //保存确认
      savData() {
        let self = this;
        this.$refs.addFormRules.validate(valid => {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '请填写完整信息'
            });
            return false;
          } else {
            if (this.checkTable.length <= 0) {
              this.$notify({
                tittle: '采集表不能为空',
                message: '请添加采集表',
                type: 'error',
                offset: 110,
                duration: this.$store.state.el_Duration
              });
              return false;
            }
            if (this.addForm.incrementState == 1 && this.timestampField == '') {
              this.$notify({
                tittle: '增量时间戳不能为空',
                message: '请选择时间戳',
                type: 'error',
                offset: 110,
                duration: this.$store.state.el_Duration
              });
              return false;
            }
            if (this.addForm.timingState == 2) {
              this.addForm.timingRules = '';
            }
            this.confirmType = this.$route.query.type;
            this.addForm.strategyTableVoList = this.checkTable;
            //新增页面保存
            if (self.confirmType == 0) {
              console.log('addForm', this.addForm);

              api.saveColStrage(this.addForm)
                .then(res => {
                  // debugger
                  console.log(res.data);
                  if (res.code == 'code_200') {
                    this.$notify({
                      tittle: '添加成功',
                      message: res.msg,
                      type: 'success',
                      offset: 100,
                      duration: this.$store.state.el_Duration
                    });
                    this.$refs.addFormRules.resetFields();
                    self.$router.push({
                      path: 'colStrategyManage',
                      query: {
                        menuLink: this.$route.query.menuLink
                      }
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
                });
            }

            //保存编辑页面
            if (self.confirmType == 2) {
              var params = {
                id: self.$route.query.obj,
                strategyVo: this.addForm
              };
              api.editorColStrange(this.addForm)
                .then(res => {
                  if (res.code == 'code_200') {
                    self.$router.push({
                      path: 'colStrategyManage',
                      query: {
                        menuLink: this.$route.query.menuLink
                      }
                    });
                    this.$notify({
                      tittle: '编辑成功',
                      message: res.msg,
                      type: 'success',
                      offset: 100,
                      duration: this.$store.state.el_Duration
                    });
                    this.$refs.addFormRules.resetFields();
                    self.$router.push({
                      path: 'colStrategyManage',
                      query: {
                        menuLink: this.$route.query.menuLink
                      }
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
                });
            }
          }
        });
      },
      //返回
      goBack() {
        let self = this;
        self.$router.push({
          path: 'colStrategyManage',
          query: {
            menuLink: this.$route.query.menuLink
          }
        });
      },
      //获取所有数据源名称
      _getSourceName() {
        api.getSourceName({})
          .then(res => {
            this.SourceArr = res.data;
          });
      }
    },

    mounted() {
      const self = this;
      self._getSourceName();
      let type = self.$route.query.type;
      let objs = self.$route.query.obj;
      if (type == 0) {
        this.isDisabled = false;
        self.titles = '采集策略管理-新增';
      }
      if (type == 1) {
        this.isDisabled = true;
        this.isEdit = false;
        self.titles = '采集策略管理-查看';
        api.LookColStrange({ strategyId: objs })
          .then(res => {
            console.log('chakan', res.data);
            if (res.code == 'code_200') {
              self.addForm = res.data;
              self.searchTableData = res.data.strategyTableVoList;
              self.oldSearchTableData = res.data.strategyTableVoList;
              self.deTotleNum = res.page.totalNumber;
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          });
      }
      if (type == 2) {
        this.isDisabled = false;
        self.titles = '采集策略管理-编辑';

        api.LookColStrange({ strategyId: objs })
          .then(res => {
            console.log('chakan', res.data);
            if (res.code == 'code_200') {
              self.addForm = res.data;
              this.checkTable = res.data.strategyTableVoList;
              // self.changeSouse(res.data.dataSourceId)
              res.data.strategyTableVoList.forEach(e => {
                e.notCheck = true;
                // self.tableData.forEach(es=>{
                //   debugger
                //   if(es.srcTableName==e.sourceTable){
                //     es.primaryKeyField=e.primaryKeyField
                //     es.timestampField=e.timestampField
                //     es.notCheck=true;
                //   }
                // })
              });

              self.tableData = res.data.strategyTableVoList;
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          });
      }
      // self.initColStrange();
      // $("#selector").cron({
      //   onChange: function() {
      //     $("#cron").val($(this).cron("value"));
      //     self.addForm.timingRules = $("#cron").val() + " ?";
      //     console.log("timerole", self.addForm.timingRules);
      //   }
      // });
    }
  };
</script>
<style scoped lang="less">
  @import "colStrategy-add.less";

  .activeColor {
    color: #f8ca10 !important;
  }

  .HJ-content {
    overflow-y: auto;
  }
</style>
