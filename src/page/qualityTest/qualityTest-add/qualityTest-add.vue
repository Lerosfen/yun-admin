<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <!--列表标题-->
      <list-table-title v-bind:title="titles" v-bind:isBack="false" v-if="showType==0"></list-table-title>
      <list-table-title v-bind:title="titles1" v-bind:isBack="false" v-if="showType==1"></list-table-title>
      <list-table-title v-bind:title="titles2" v-bind:isBack="false" v-if="showType==2"></list-table-title>
      <!--搜索-->
      <div class="search-template cleansAdd">
        <el-row>
          <el-col :span="18" :offset="3">
            <div class="input-group">
              <span class="xuhao">01</span>
              <label for class="middle m-r-10 clean_mc">/检测表名称</label>
              <div class="input-tpm blue-input new-input" style="margin-top: 17px">
                <el-input
                  placeholder
                  v-model="celueName"
                  :disabled="showType=='1'"
                ></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="18" :offset="3">
            <div class="input-group">
              <span class="xuhao">02</span>
              <label for class="middle m-r-10 clean_mc">/选择检测表</label>
              <div class="input-tpm blue-input new-input" style="margin-top: 15px">
                <el-input placeholder v-model="cleantabels" :disabled="true"></el-input>
              </div>
              <el-button
                style="margin-left: 10px"
                class="blue-btn fl choisetab"
                type="primary"
                :disabled="showType=='1'"
                @click="choiseCleanList()"
                v-if="isbtnShow"
              >选择
              </el-button>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18" :offset="3">
            <div class="input-group">
              <span class="xuhao">03</span>
              <label for class="middle m-r-10 clean_mc">/选择检测字段</label>
              <el-button
                :disabled="showType=='1'"
                class="blue-btn fl choisetab choisetab1"
                type="primary"
                @click="chiosecleanWords()"
                v-if="isbtnShow"
              >选择
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <!-- 表格 -->
        <div class="table-container wordtable-container" style="margin-top:30px">
          <el-row :gutter="20">
            <el-col :span="17" :offset="6">
              <el-table
                :data="cleanwords"
                stripe
                height="220"
                style="width: 100%;overflow-x:hidden;"
              >
                <el-table-column
                  v-for="item in cleanwordsHead"
                  v-show="showType==0"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      @click="handleClick(scope.row,scope.$index,0)"
                      type="text"
                      size="small"
                      :class="[setJiance.includes(scope.$index)?'set-jiance-bg':'jiance-bg']"
                    >检测规则
                    </el-button>
                    <el-button
                      @click="handleClick(scope.row,scope.$index,1)"
                      type="text"
                      size="small"
                      v-if="showType!='1'"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="btn-group footerBtn">
      <el-button class="yellow-btn" @click="cleanAddSubmit()" v-if="showType!='1'">确 定</el-button>
      <el-button class="blue-btn" @click="goBack()" v-if="showType!='1'">取 消</el-button>
      <el-button class="blue-btn" @click="goBack()" v-if="showType=='1'">关 闭</el-button>
    </div>
    <!--清洗列表选择-->
    <Modal
      title="检测表-列表"
      v-model="qingxiList"
      class="cha"
      width="40%"
      :closable="false"
      :mask-closable="false"
    >
      <el-form label-position="right" label-width="60px">
        <el-row :gutter="12">
          <el-col :span="8" style="margin-left: -15px">
            <el-form-item label="表名">
              <div class="input-data fl">
                <div class="input-data">
                  <div class="input-tpm yellow-input new-input">
                    <el-input v-model="cleanAddobj.sourceTable"></el-input>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="表类型">
              <div class="sel-group sel-yellow fl new-input">
                <el-select v-model="cleanAddobj.syncTableType" placeholder="全部">
                  <el-option
                    v-for="item in tableLeixing"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="add-btn fl yellow m-l-10 new-btn" @click="checkMetaData()">查询</div>
          </el-col>
          <el-col :span="4">
            <div class="add-btn fl yellow m-l-10 new-btn" @click="resetSearch()">重置</div>
          </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="12">-->
          <!--<el-form-item label="数据源">-->

          <!--<div class="sel-group sel-yellow fl">-->
          <!--<i class="honer-left"></i>-->
          <!--<el-select v-model="cleanAddobj.dataSourceId" placeholder="请选择" >-->
          <!--<el-option-->
          <!--v-for="item in shujuyuan"-->
          <!--:key="item.id"-->
          <!--:label="item.strategyName"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--<i class="honer-right"></i>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
      </el-form>

      <el-row>
        <el-col :span="24" style="margin-top: -10px">
          <div class="table-container addtable-container">
            <el-table :data="choisecleanTableData" height="280" style="width: 100%;">
              <el-table-column width="80">
                <template slot-scope="scope">
                  <el-radio
                    @change.native="getCurrentRow(scope,scope.$index)"
                    :label="scope.$index"
                    v-model="radio"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in headerData"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
            <!--分页-->
            <div class="model-pag">
              <el-pagination
                v-if="choisecleanTableData.length!=0"
                :current-page="cleanAddobj.currentPage"
                :page-size="cleanAddobj.pageSize"
                @current-change="handleCurrentChange($event)"
                layout="prev, pager, next"
                :total="tabListtotleNum"
                prev-text="上一页"
                next-text="下一页"
              ></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click="liebiaoSubmit()">确 定</el-button>
        <el-button class="blue-btn" @click="cancleTable">取 消</el-button>
      </div>
    </Modal>
    <!--清洗字段选择-->
    <Modal
      title="检测字段-字段"
      v-model="qingxiWords"
      class="cha"
      width="40%"
      :closable="false"
      :mask-closable="false"
    >
      <div class="table-container addtable-container" id="wordschoise" style="margin-top: -20px">
        <div class="search-section clearfix"></div>
        <el-table
          ref="multipleTable"
          :data="choisecleanwrodsTableData"
          @selection-change="wordChecked"
          @select-all="wordCheckedALl"
          stripe
          style="width: 100%"
          height="310"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            v-for="item in  wordsheaderData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <!--分页-->
        <div class="model-pag">
          <el-pagination
            v-if="choisecleanwrodsTableData.length!=0"
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="handleCurrentChange1($event)"
            layout="prev, pager, next"
            :total="wordstotleNum"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click="zidaunSubmit()">确 定</el-button>
        <el-button class="blue-btn" @click="cancelWordTable">取 消</el-button>
      </div>
    </Modal>
    <!--清洗规则设置-->
    <Modal
      title="检测规则设置"
      v-model="qingxirulers"
      class="cha"
      :closable="false"
      :mask-closable="false"
      width="40%"
    >
      <div class="table-container rulertable-container">
        <div class="search-section clearfix">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="4" id="rulers-col">
              <div class="grid-content bg-purple rulers-div">
                <div
                  @click="isruleChekced($event,'0')"
                  :class="rulerform.QREV==''?'ruler-List':'ruler-check'"
                >相等
                </div>
                <div
                  @click="isruleChekced($event,'2')"
                  :class="rulerform.QRNE==''?'ruler-List':'ruler-check'"
                >不为空
                </div>
                <div
                  @click="isruleChekced($event,'5')"
                  :class="(rulerform.QRTI.startTime==''&&rulerform.QRTI.endTime=='')?'ruler-List':'ruler-check'"
                >时间区域
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">
                <el-form ref="form" :model="rulerform" label-width="80px">
                  <el-form-item label="比较值">
                    <div class="input-tpm blue-input new-input">
                      <el-input placeholder v-model="rulerform.QREV" :disabled="showType=='1'"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="是否为空">
                    <div class="input-tpm blue-input new-input">
                      <el-select
                        v-model="rulerform.QRNE"
                        placeholder="请选择"
                        :disabled="showType=='1'"
                      >
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item label="开始时间" class="cleanstrategy">
                    <div class="input-tpm blue-input new-input">
                      <el-date-picker
                        type="date"
                        v-model="rulerform.QRTI.startTime"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        placeholder="选择日期"
                        :disabled="showType=='1'"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple ruler-col3">
                <el-form ref="form" :model="rulerform" label-width="80px">
                  <el-form-item label="结束时间" class="cleanstrategy">
                    <div class="input-tpm blue-input new-input">
                      <el-date-picker
                        type="date"
                        v-model="rulerform.QRTI.endTime"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        placeholder="选择日期"
                        :disabled="showType=='1'"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          class="yellow-btn"
          type="primary"
          @click="rulersSubmit()"
          v-if="showType!='1'"
        >确 定
        </el-button>
        <el-button class="blue-btn" @click="rulersCancel()">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /* eslint-disable */
  var moment = require('moment');
  import api from '../../../api/bigData/daq/qualityTest';
  import Common from '../../../../config/common';
  import Dialog from '../../../components/YUNPackages/dialog/dialog';

  export default {
    components: {},
    data() {
      return {
        titles: '数据质量检测-新增',
        titles1: '数据质量检测-查看',
        titles2: '数据质量检测-编辑',
        valueZl: '否',
        radio: '',
        msg: {},
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
        SourceArr: [
          {
            value: '1',
            label: '行政审批系统'
          },
          {
            value: '2',
            label: '一体化平台用表'
          }
        ],
        headerData: [
          {
            prop: 'sourceTable',
            label: '数据库表名'
          },
          {
            prop: 'sourceTableMame',
            label: '描述'
          },
          {
            prop: 'syncTableType',
            label: '表分类 '
          }
        ], // 表头数据
        valueType: '',
        valueSource: '',
        valueSourceid: '',
        isShowTime: false,
        qingxirulers: false,
        keyDefault: '否',
        celueName: '',
        tacticsName: '',
        tableName: '',
        TimingRule: '',
        dataSource: '',
        isTiming: '',
        tableData: [],
        cleantabels: '',
        cleanwords: [],
        cleanWordput: [],
        cleanwordsHead: [
          {
            prop: 'targetField',
            label: '检测字段英文名'
          },
          {
            prop: 'targetFieldName',
            label: '检测字段中文名'
          }
        ],
        wordsheaderData: [
          {
            prop: 'targetField',
            label: '英文名'
          },
          {
            prop: 'targetFieldName',
            label: '中文名'
          }
        ],
        qingxiList: false,
        choisecleanTableData: [],
        biaochiosaddSearch: '',
        biaochiosSearch: '',
        qingxiWords: false,
        choisecleanwrodsTableData: [],
        showType: '',
        tableLeixing: [],
        shujuyuan: [],
        currentPage: 1,
        pageSize: 10,
        totleNum: 1,
        tabListtotleNum: 1,
        wordstotleNum: 1,
        handleSizeChange: '',
        //清洗列表添加查询条件；
        cleanAddobj: {
          sourceTable: '',
          dataSourceId: '',
          syncTableType: '',
          currentPage: 1,
          pageSize: 10
        },
        //清洗字段查询条件；
        cleanwordobj: {
          tableName: '',
          tableType: '',
          dataSourceId: '',
          currentPage: 1,
          pageSize: 10
        },
        tableId: '',
        qualityAdddata: {
          id: '',
          qualityTestingTableVolist: [
            {
              testingField: '',
              testingFieldLength: '',
              testingFieldName: '',
              testingRules: '',
              qualityTestingId: '',
              id: '11'
            }
          ],
          enableState: '1',
          testingName: '1',
          resultState: '1'
        },
        isActive: false,
        isNormal: true,
        rulerform: {
          QREV: '',
          QRNE: '',
          QRTI: {
            startTime: '',
            endTime: ''
          }
        },
        rulerArr: [],
        cleanruleRow: {},
        tName: '',
        multipleSelectionAll: [],
        multipleSelection: [],
        idKey: 'id',
        gzTrue: false,
        setJiance: [],
        isbtnShow: true
      };
    },
    mounted: function () {
      //获取query值，0-》新增，1-》查看;
      this.showType = this.$route.query.type;
      if (this.showType == '1') {
        this.isbtnShow = false;
      }
      this.msg.id = this.$route.query.id;
      let that = this;
      if (this.showType == '1' || this.showType == '2') {
        //查看；编辑
        api.getDetail({ qualityTestingId: this.msg.id })
          .then(res => {
            this.celueName = res.data.testingName;
            this.cleantabels = res.data.testingTable;
            res.data.qualityTestingTableVolist.forEach((res, index) => {
              res.targetField = res.testingField;
              res.targetFieldName = res.testingFieldName;
            });
            this.cleanwords = res.data.qualityTestingTableVolist;
          });
      }
      if (this.showType == '0') {
        //新增；
        this.celueName = '';
      }
    },
    methods: {
      resetSearch() {
        this.cleanAddobj.sourceTable = '';
        this.cleanAddobj.syncTableType = '';
        this.choiseCleanList();
      },
      // 清洗字段取消
      cancelWordTable() {
        this.qingxiWords = false;
        this.cleanwordobj.currentPage = 1;
      },
      // 清洗列表取消
      cancleTable() {
        this.qingxiList = false;
        this.cleanAddobj.sourceTable = '';
        this.cleanAddobj.dataSourceId = '';
        this.cleanAddobj.syncTableType = '';
        this.cleanAddobj.currentPage = 1;
        this.tableId = '';
        this.tName = '';
        this.cleantabels = '';
        this.radio = '';
      },
      //选择检测列表；
      choiseCleanList() {
        this.qingxiList = true;
        //调用表类型，数据源接口；
        this.cleanListshow();
        //获取表类型和数据源；
        api.cleanAddtableType({ code: 'TABLEINFO' })
          .then(res => {
            if (res.code === 'code_200') {
              this.tableLeixing = res.data;
            } else {
              this.tips('失败', 'error', res.msg);
            }
          });
        api.getAllcleanTable()
          .then(res => {
            if (res.code === 'code_200') {
              this.shujuyuan = res.data;
            } else {
              this.tips('失败', 'error', res.msg);
            }
          });
      },
      //检测列表接口；
      cleanListshow() {
        api.getAllCleanList(this.cleanAddobj)
          .then(res => {
            if (res.code === 'code_200') {
              // res.data.forEach(e => {
              //   if (e.syncTableType == 1) {
              //     e.syncTableType = Common.tableType.AcquisitionSource;
              //   } else if (e.syncTableType == 2) {
              //     e.syncTableType = Common.tableType.AcquisitionTarget;
              //   } else if (e.syncTableType == 3) {
              //     e.syncTableType = Common.tableType.CleaningTarget;
              //   } else if (e.syncTableType == 4) {
              //     e.syncTableType = Common.tableType.FusionTarget;
              //   } else {
              //     e.syncTableType = Common.tableType.DataqualityMonitor;
              //   }
              // });
              res.data.forEach(item => {
                switch (parseInt(item.syncTableType)) {
                  case 2:
                    item.syncTableType = '采集目标';
                    break;
                  case 3:
                    item.syncTableType = '清洗目标';
                    break;
                  case 4:
                    item.syncTableType = '融合目标';
                    break;
                }
              });
              this.choisecleanTableData = res.data;
              this.tabListtotleNum = res.page.totalNumber;
            } else {
              this.tips('失败', 'error', res.msg);
            }
          });
      },
      //检测列表翻页；
      handleCurrentChange(e) {
        this.cleanAddobj.currentPage = e;
        this.cleanListshow();
      },
      //检测列表添加查询；
      checkMetaData() {
        if (this.cleanAddobj.syncTableType == 1) {
          this.cleanAddobj.syncTableType = '';
        }
        this.cleanListshow();
      },
      //列表选中；
      getCurrentRow(row, val) {
        this.tableId = row.row.dataSourceId;
        this.tableType = row.row.syncTableType;
        this.cleantabels = row.row.sourceTable;
        this.tName = row.row.sourceTable;
      },
      //选择检测字段;
      chiosecleanWords() {
        if (this.cleantabels) {
          this.qingxiWords = true;
          //        this.cleanwordobj.dataSourceId=this.tableId;
          this.cleanwordobj.tableType = this.tableType;
          this.cleanwordobj.tableName = this.tName;
          api.getAllCleanWords(this.cleanwordobj)
            .then(res => {
              if (res.code === 'code_200') {
                this.choisecleanwrodsTableData = res.data;
                this.wordstotleNum = res.page.totalNumber;
                this.setSelectRow();
              } else {
                this.tips('失败', 'error', res.msg);
              }
            });
        } else {
          this.$message({
            type: 'error',
            message: '请选择检测表'
          });
        }
      },
      //检测字段列表翻页；
      handleCurrentChange1(e) {
        this.changePageCoreRecordData();
        this.cleanwordobj.currentPage = e;
        this.chiosecleanWords();
      },
      //检测字段选中；
      wordChecked(val) {
        this.multipleSelection = val;
      },
      //检测字段全选；
      wordCheckedALl(val) {
        this.multipleSelection = val;
      },
      //检测字段；
      zidaunSubmit() {
        this.changePageCoreRecordData();
        this.qingxiWords = false;
      },
      // 记忆选择核心方法
      changePageCoreRecordData() {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let that = this;
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.multipleSelectionAll.length <= 0) {
          this.multipleSelectionAll = this.multipleSelection;
          this.cleanwords = this.multipleSelectionAll;
          return;
        }
        // 总选择里面的key集合
        let selectAllIds = [];
        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row[idKey]);
        });
        let selectIds = [];
        // 获取当前页选中的id
        this.multipleSelection.forEach(row => {
          selectIds.push(row[idKey]);
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.multipleSelectionAll.push(row);
          }
        });
        let noSelectIds = [];
        // 得到当前页没有选中的id
        this.choisecleanwrodsTableData.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey]);
          }
        });
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.multipleSelectionAll.length; i++) {
              if (that.multipleSelectionAll[i][idKey] == id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.multipleSelectionAll.splice(i, 1);
                break;
              }
            }
          }
        });
      },
      // 设置选中的方法
      setSelectRow() {
        if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
          return;
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let selectAllIds = [];
        let that = this;
        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row[idKey]);
        });
        this.$refs.multipleTable.clearSelection();
        this.$nextTick(function () {
          for (var i = 0; i < this.choisecleanwrodsTableData.length; i++) {
            if (
              selectAllIds.indexOf(this.choisecleanwrodsTableData[i][idKey]) >= 0
            ) {
              this.$refs.multipleTable.toggleRowSelection(
                this.choisecleanwrodsTableData[i]
              );
            }
          }
        });
      },
      //检测列表确定；
      liebiaoSubmit() {
        this.qingxiList = false;
      },
      //检测规则；
      handleClick(row, rowIndex, type) {
        switch (type) {
          case 0:
            //设置检测规则；
            this.qingxirulers = true;
            this.cleanruleRow.id = row.id;
            if (this.showType == '1' || this.showType == '2') {
              if (row.testingRules) {
                let _obj = JSON.parse(row.testingRules);
                this.rulerform.QREV = _obj.QREV;
                this.rulerform.QRNE = _obj.QRNE;
                this.rulerform.QRTI.startTime = _obj.QRTI.startTime;
                this.rulerform.QRTI.endTime = _obj.QRTI.endTime;
              }
            } else {
              if (!row.rulers) {
                this.rulerform.QREV = '';
                this.rulerform.QRNE = '';
                this.rulerform.QRTI.startTime = '';
                this.rulerform.QRTI.endTime = '';
              } else {
                this.rulerform = row.rulers;
              }
            }
            break;
          case 1:
            //删除；
            this.cleanwords.forEach((item, index) => {
              if (item.id == row.id) {
                this.cleanwords.splice(index, 1);
                this.setJiance.splice(index, 1);
              }
            });
            break;
        }
      },
      //检测规则提交；
      rulersSubmit() {
        let m = {
          QREV: '',
          QRNE: '',
          QRTI: {
            startTime: '',
            endTime: ''
          }
        };
        let that = this;
        console.log(this.rulerArr.length);
        if (this.rulerArr.length < 1) {
          this.tips('请完善规则设置', 'error', '请完善规则设置');
          this.qingxirulers = true;
        }
        if (this.rulerArr.length > 0) {
          m.QREV = this.rulerform.QREV;
          m.QRNE = this.rulerform.QRNE;
          m.QRTI['startTime'] = this.rulerform.QRTI['startTime'];
          m.QRTI['endTime'] = this.rulerform.QRTI['endTime'];
          if (
            this.rulerform.QREV == '' &&
            this.rulerform.QRNE == '' &&
            this.rulerform.QRTI.startTime == '' &&
            this.rulerform.QRTI.endTime == ''
          ) {
            this.tips('请完善规则设置', 'error', '请完善规则设置');
            this.qingxirulers = true;
          } else {
            this.tips('规则设置成功!', 'success', '规则设置成功');
            this.qingxirulers = false;
          }
        }
        //把清洗规则添加到字段列表数据中；
        this.cleanwords.forEach(res => {
          if (res.id == that.cleanruleRow.id) {
            res.rulers = m;
          }
        });
        this.gzTrue = true;
        let checkedArr = [];
        this.cleanwords.forEach((res, index) => {
          if (res.rulers) {
            if (
              !(
                res.rulers.QREV == '' &&
                res.rulers.QRNE == '' &&
                res.rulers.QRTI.startTime == '' &&
                res.rulers.QRTI.endTime == ''
              )
            ) {
              checkedArr.push(index);
              this.setJiance = checkedArr.filter(function (element, index, self) {
                return self.indexOf(element) === index;
              });
            }
          } else {
            this.setJiance.splice(index, 1);
          }
        });
      },
      //清洗规则取消；
      rulersCancel() {
        this.qingxirulers = false;
      },
      isruleChekced(event, key) {
        event.preventDefault();
        let target = event.target;
        let className = target.getAttribute('class');
        if (className == 'ruler-List') {
          target.setAttribute('class', 'ruler-check');
          this.rulerArr.push(key);
        }
        if (className == 'ruler-check') {
          target.setAttribute('class', 'ruler-List');
          this.rulerArr.forEach((item, index) => {
            if (item == key) {
              this.rulerArr.splice(index, 1);
            }
          });
        }
      },
      //检测增加确认；
      cleanAddSubmit() {
        if (this.celueName == '') {
          this.$message({
            type: 'error',
            message: '检测表名称不能为空'
          });
        } else if (this.cleantabels == '') {
          this.$message({
            type: 'error',
            message: '检测表不能为空'
          });
        } else if (this.cleanwords.length == '') {
          this.$message({
            type: 'error',
            message: '请选择检测字段'
          });
        } else if (!this.gzTrue) {
          this.$message({
            type: 'error',
            message: '请设置检测规则'
          });
        } else {
          this.qualityAdddata.testingTable = this.cleantabels; //名称；
          this.qualityAdddata.testingName = this.celueName; //名称；
          this.qualityAdddata.resultState = this.keyDefault; //名称；
          this.qualityAdddata.id = this.msg.id;
          this.qualityAdddata.qualityTestingTableVolist.splice(
            0,
            this.qualityAdddata.qualityTestingTableVolist.length
          );
          if (this.cleanwords.length > 0) {
            this.cleanwords.forEach(res => {
              let m = {};
              m.testingField = res.targetField;
              m.testingFieldLength = res.isTimestamp;
              m.testingFieldName = res.targetFieldName;
              //清洗字段规则；
              m.testingRules = JSON.stringify(res.rulers);
              this.qualityAdddata.qualityTestingTableVolist.push(m);
            });
          }
          //新增
          if (this.showType == '0') {
            api.addQualityTest(this.qualityAdddata)
              .then(res => {
                this.tips('添加成功', 'success', res.msg);
                if (res.code === 'code_200') {
                  this.$router.push({
                    path: 'qualityTest',
                    query: {
                      menuLink: this.$route.query.menuLink
                    }
                  });
                } else {
                  this.tips('失败', 'error', res.msg);
                }
              });
          }
          //编辑;
          if (this.showType == '2') {
            api.modifyQualityTest(this.qualityAdddata)
              .then(res => {
                this.tips('添加成功', 'success', res.msg);
                if (res.code === 'code_200') {
                  this.$router.push({
                    path: 'qualityTest',
                    query: {
                      menuLink: this.$route.query.menuLink
                    }
                  });
                } else {
                  this.tips('失败', 'error', res.msg);
                }
              });
          }
        }
      },
      tips(title, state, msg) {
        this.$notify({
          tittle: title,
          message: msg,
          type: state,
          offset: 110,
          duration: this.$store.state.el_Duration
        });
      },
      //返回
      goBack() {
        this.$router.push({
          path: 'qualityTest',
          query: {
            menuLink: this.$route.query.menuLink
          }
        });
      }
    }
  };
</script>
<style scoped lang="less">
  @import "qualityTest-add.less";
</style>


