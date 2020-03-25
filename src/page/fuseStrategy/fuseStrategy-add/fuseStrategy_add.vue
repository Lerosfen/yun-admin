<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <el-row>
        <el-col :span="21">
          <!-- <div class="grid-content " > -->
          <!--列表标题-->
          <list-table-title v-bind:title="titles" v-bind:isBack="false"></list-table-title>

          <div class="search-template">
            <!-- <el-form :inline="true"> -->
            <el-row>
              <el-col :span="18" :offset="3" style="margin-top: -40px">
                <div class="input-group">
                  <span class="xuhao">01</span>
                  <label for class="middle m-r-10 clean_mc" style="width: 125px">/ 融合名称</label>
                  <!-- <el-form-item> -->
                  <div class="input-tpm blue-input new-input">
                    <el-input
                      placeholder
                      v-model="celueName"
                      class="clean_input"
                      :disabled="this.lookDisabled"
                    ></el-input>
                  </div>
                  <!-- </el-form-item> -->
                </div>
              </el-col>
              <el-col :span="18" :offset="3" class="label-margin">
                <div class="input-group">
                  <span class="xuhao">02</span>
                  <label for class="middle m-r-10 clean_mc" style="width: 125px">/ 融合表中文名称</label>
                  <!-- <el-form-item> -->
                  <div class="input-tpm blue-input new-input">
                    <el-input
                      placeholder
                      v-model="celuezwName"
                      class="clean_input"
                      :disabled="this.lookDisabled"
                    ></el-input>
                  </div>
                  <!-- </el-form-item> -->
                </div>
              </el-col>

              <el-col :span="18" :offset="3" class="label-margin">
                <div class="input-group">
                  <span class="xuhao">03</span>
                  <label for class="middle m-r-10 clean_mc" style="width: 125px">/ 融合方式</label>
                  <div class="input-tpm blue-input new-input">
                    <el-select class="clean_input" v-model="fuseType">
                      <el-option
                        v-for="item in fuseTypeList"
                        :label="item.name"
                        :value="item.code"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </el-col>

              <el-col :span="18" :offset="3" class="label-margin">
                <div class="input-group">
                  <span class="xuhao">04</span>
                  <label for class="middle m-r-10 clean_mc" style="width: 125px">/ 融合主表</label>
                  <div class="input-tpm blue-input new-input">
                    <el-input placeholder v-model="cleantabels" class="clean_input" disabled></el-input>
                  </div>
                  <el-button
                    v-show="showType==0"
                    class="blue-btn fl choisetab"
                    type="primary"
                    @click="choiseCleanList()"
                  >选择
                  </el-button>
                </div>
              </el-col>

              <el-col :span="18" :offset="3" class="label-margin">
                <div class="input-group">
                  <span class="xuhao">05</span>
                  <label for class="middle m-r-10 clean_mc" style="width: 125px">/ 融合附表</label>
                  <div class="input-tpm blue-input new-input">
                    <el-input placeholder v-model="fusePartName" class="clean_input" disabled></el-input>
                  </div>
                  <el-button
                    v-show="showType==0"
                    class="blue-btn fl choisetab"
                    type="primary"
                    @click="chiosecleanWords()"
                  >选择
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <!-- </el-form> -->
          </div>
          <div>
            <!-- 所有字段表 -->
            <div class="table-container wordtable-container">
              <el-row>
                <el-col :span="15" :offset="3">
                  <el-table stripe :data="cleanwords" height="250" style="width: 100%">
                    <el-table-column
                      v-for="item in cleanwordsHead"
                      :label="item.label"
                      :prop="item.prop"
                      :key="item.id"
                      :show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column label="操作" v-if="showType != 1">
                      <template slot-scope="scope">
                        <el-button
                          @click="handleClick(scope.$index,cleanwords,list.type)"
                          type="text"
                          size="small"
                          v-for="list in operate"
                          :key="list.type"
                        >{{list.text}}
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="fuseBtn" v-show="!this.qingxiWords ">
            <el-button v-if="showType==0" class="yellow-btn" @click="cleanAddSubmit()">确定</el-button>
            <el-button v-if="showType==0" class="blue-btn" @click="goBack()">取消</el-button>
            <el-button v-if="showType==1" class="blue-btn" @click="goBack()">关闭</el-button>
          </div>
          <!--融合机制-主表-->
          <Modal
            title="融合机制-列表"
            v-model="qingxiList"
            class="cha"
            width="40%"
            :closable="false"
            :mask-closable="false"
          >
            <el-form label-position="right" label-width="60px">
              <el-row>
                <el-col :span="8" style="margin-left: -10px">
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
                <el-col :span="3">
                  <div class="add-btn fl yellow m-l-10 new-btn" @click="checkMetaData()">查询</div>
                </el-col>
                <el-col :span="3" :offset="1">
                  <div class="add-btn fl yellow m-l-10 new-btn" @click="reset()">重置</div>
                </el-col>
              </el-row>
              <el-row>
                <!--<el-col :span="12">-->
                <!--<el-form-item label="采集源名称">-->

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

            <div class="table-container addtable-container">
              <el-table :data="choisecleanTableData" style="width: 100%" height="250">
                <el-table-column width="50">
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
                  @current-change="handleCurrentChangeMain"
                  layout="prev, pager, next"
                  :total="totleNumMain"
                  prev-text="上一页"
                  next-text="下一页"
                ></el-pagination>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button class="yellow-btn" type="primary" @click="liebiaoSubmit()">确 定</el-button>
              <el-button class="blue-btn" @click="cancelMain()">取 消</el-button>
            </div>
          </Modal>
          <!--融合机制-附表-->
          <Modal
            title="融合机制-附表"
            v-model="qingxiWords"
            class="cha"
            width="45%"
            :closable="false"
            :mask-closable="false"
          >
            <el-form label-position="right" label-width="60px">
              <el-row>
                <el-col :span="8" style="margin-left: -10px">
                  <el-form-item label="表名">
                    <div class="input-data fl">
                      <div class="input-data">
                        <div class="input-tpm yellow-input new-input">
                          <el-input v-model="cleanAddobjPart.sourceTable"></el-input>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="表类型">
                    <div class="sel-group sel-yellow fl new-input">
                      <el-select v-model="cleanAddobjPart.syncTableType" placeholder="全部">
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
                <el-col :span="3">
                  <div class="add-btn fl yellow m-l-10 new-btn" @click="checkMetaDataPart()">查询</div>
                </el-col>
                <el-col :span="3" :offset="1">
                  <div class="add-btn fl yellow m-l-10 new-btn" @click="resets()">重置</div>
                </el-col>
              </el-row>
              <el-row>
                <!--<el-col :span="12">-->
                <!--<el-form-item label="采集源名称">-->

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

            <div class="table-container addtable-container">
              <el-table :data="choisecleanwrodsTableData" height="250" style="width: 100%">
                <el-table-column width="50">
                  <template slot-scope="scope">
                    <el-radio
                      @change.native="partFieldsChange(scope,scope.$index)"
                      :label="scope.$index"
                      v-model="PartRadio"
                    >&nbsp;
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="item in  headerData"
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
                  :current-page="cleanAddobjPart.currentPage"
                  :page-size="cleanAddobjPart.pageSize"
                  @current-change="handleCurrentChangePart"
                  layout="prev, pager, next"
                  :total="totleNum"
                  prev-text="上一页"
                  next-text="下一页"
                ></el-pagination>
              </div>
            </div>

            <div slot="footer" class="dialog-footer">
              <el-button class="yellow-btn" type="primary" @click="partTableSubmit()">确 定</el-button>
              <el-button class="blue-btn" @click="cancelPart()">取 消</el-button>
            </div>
          </Modal>
          <!-- </div> -->
        </el-col>
        <el-col :span="3">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
      <!--选择字段右侧弹框-->
      <transition name="fade">
        <div class="fuseFields" v-show="isShowFieldsDialog" transiton="fade">
          <div class="table-container selectWordDialog">
            <el-row>
              <el-col>
                <el-table
                  :data="fuseWordData"
                  stripe
                  height="480"
                  @selection-change="fieldsTableChange"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="50"></el-table-column>
                  <el-table-column
                    v-for="item in fuseHeadWord"
                    :label="item.label"
                    :prop="item.prop"
                    :key="item.id"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column label="关联字段">
                    <template slot-scope="scope">
                      <el-radio
                        @change.native="relatedFieldsFn(scope.row)"
                        v-model="radios"
                        :label="scope.row.id"
                      >&nbsp;
                      </el-radio>

                      <!-- <el-button type="success" plain
                                 size="small"
                                 @click="relatedFieldsFn(scope.row)">关联字段
                      </el-button>-->
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
          <div class="dialog-footer">
            <el-button class="yellow-btn" @click="submitFuseFields()">确认</el-button>
            <el-button class="blue-btn" @click="closeFieldsDialog()">取消</el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import api from '../../../api/bigData/daq/fuseStrategy';
  import Common from '../../../../config/common';

  export default {
    components: {},
    data() {
      return {
        fuseTypeList: [],
        fuseType: '',
        currentPageMain: 1,
        currentPagePart: 1,
        pageSizeMain: 10,
        pageSizePart: 10,
        totleNumMain: 1,
        radios: '',
        titles: '融合策略-列融合',
        valueZl: '',
        radio: '', //主表选中状态
        PartRadio: '', //附表选中状态
        tableWidth: 15, //表格的宽度
        msg: {},
        fuseWordData: [],
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
          // 表头数据
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
        ],
        valueType: '采集源',
        isShowFieldsDialog: false, //字段弹框
        valueSource: 'MYSQL',
        valueSourceid: '',
        isShowTime: false,
        keyDefault: '否',
        celueName: '',
        celuezwName: '',
        tacticsName: '',
        tableName: '',
        TimingRule: '',
        dataSource: '',
        isTiming: '',
        tableData: [],
        cleantabels: '', //融合主表名称
        fusePartName: '', //融合附表名称
        cleanwords: [],
        lookDisabled: false,
        qingxiList: false,
        choisecleanTableData: [],
        tableType: '',
        partType: '',
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
        radioRelated: '', //单选关联字段
        mainTableRelatedName: '', //主表关联表名
        partTableRelatedName: '', //附表关联表名
        mainTableRelatedFields: '', //主表关联字段
        partTableRelatedFields: '', //附表关联字段
        selectFields: [], //选择的字段
        addFuseFields: [], //主表的字段
        partFuseFields: [], //附表的字段
        tableId: '', //主表id
        mainTableId: '',
        tableMinName: '', //主表名称
        partTable: '', //选择的附表
        partTableData: [], //附表
        partTableId: '', //附表id
        otherTableId: '',
        tablepartName: '',
        fieldsArrayType: '', //表字段添加位置

        //  清洗列表添加查询条件；
        cleanAddobj: {
          sourceTable: '',
          dataSourceId: '',
          syncTableType: '',
          currentPage: 1,
          pageSize: 10
        },
        cleanAddobjPart: {
          sourceTable: '',
          dataSourceId: '',
          syncTableType: '',
          currentPage: 1,
          pageSize: 10
        },
        cleanwordsHead: [
          {
            prop: 'targetField',
            label: '英文名'
          },
          {
            prop: 'targetFieldName',
            label: '中文名'
          },
          {
            prop: 'fieldType',
            label: '类型'
          }
        ],
        fuseHeadWord: [
          {
            prop: 'targetField',
            label: '英文名'
          },
          {
            prop: 'targetFieldName',
            label: '中文名'
          }
        ],
        operate: [
          {
            type: 2,
            text: '删除'
          }
        ],
        operate1: [
          {
            type: 1,
            text: '关联字段'
          }
        ],
        wordsheaderData: [
          {
            prop: 'fieldType',
            label: '英文名'
          },
          {
            prop: 'targetFieldName',
            label: '中文名'
          }
        ]
      };
    },
    mounted: function () {
      this.menuLink = this.$route.query.menuLink;
      //获取query值，0-》新增，1-》查看;
      this.showType = this.$route.query.types;
      console.log(this.showType, this.menuLink);
      this.showType == 1
        ? (this.lookDisabled = true)
        : (this.lookDisabled = false);
      if (this.showType == 1) {
        this.tableWidth = 21;
        api
          .getOnlyFuseStrategy({ fuseStrategyId: this.$route.query.rows })
          .then(res => {
            if (res.code === 'code_200') {
              this.celueName = res.data.fuseName;
              this.celuezwName = res.data.fuseTargetTableName;
              this.cleantabels = res.data.fuseMainTable;
              this.fusePartName = res.data.fuseTable;
              this.valueZl = res.data.enableState;
              // this.addFuseFields =JSON.parse(res.data.fuseMainTable) ;  //主表的字段
              // this.partFuseFields =JSON.parse(res.data.fuseTable);  //附表的字段
              this.cleanwords = res.data.syncTableVoList;
              console.log('xxx', this.addFuseFields);
              // this.arrayConcat();
            }
          });
      }

      api.cleanAddtableType({ code: 'FuseType' })
        .then(res => {
          this.fuseTypeList = res.data;
        });
    },
    methods: {
      resets() {
        this.cleanAddobjPart.sourceTable = '';
        this.cleanAddobjPart.syncTableType = '';
        this.cleanWordsshow();
      },

      reset() {
        this.cleanAddobj.sourceTable = '';
        this.cleanAddobj.syncTableType = '';
        this.cleanListshow();
      },
      //主表翻页；
      handleCurrentChangeMain(e) {
        this.cleanAddobj.currentPage = e;
        this.cleanListshow();
      },
      //主表翻页；
      handleCurrentChangePart(e) {
        this.cleanAddobjPart.currentPage = e;
        this.chiosecleanWords();
      },
      // 主表取消
      cancelMain() {
        this.qingxiList = false;
        this.cleanAddobj.sourceTable = '';
        this.cleanAddobjPart.sourceTable = '';
        this.cleantabels = '';
        this.mainTableI = '';
        this.mainTableRelatedNam = '';
        this.tableMinName = '';
        this.currentPageMain = 1;
        this.radio = '';
        this.fuseWordData = [];
      },
      cancelPart() {
        this.qingxiWords = false;
        this.PartRadio = '';
        this.otherTableId = '';
        this.partTableRelatedName = '';
        this.partTableId = '';
        this.tablepartName = '';
        this.fusePartName = '';
        this.currentPagePart = 1;
        this.fuseWordData = [];
      },
      //融合添加主表选择；
      choiseCleanList() {
        //初始化数据
        this.fieldsArrayType = 1;
        this.addFuseFields = [];
        this.mainTableRelatedFields = '';
        this.qingxiList = true;
        //调用表类型，数据源接口；
        this.cleanListshow();
        //获取表类型和数据源；
        api.cleanAddtableType({ code: 'TABLEINFO' })
          .then(res => {
            if (res.code === 'code_200') {
              this.tableLeixing = res.data;
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
        api.cleanAddtableDB()
          .then(res => {
            console.log(res.data);
            if (res.code === 'code_200') {
              this.shujuyuan = res.data;
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
      //融合主表获取；
      cleanListshow() {
        api.getFuseTable(this.cleanAddobj)
          .then(res => {
            if (res.code === 'code_200') {
              this.choisecleanTableData = res.data;
              this.totleNumMain = res.page.totalNumber;
              this.choisecleanTableData.forEach(e => {
                console.log(e.syncTableType);
                switch (e.syncTableType) {
                  case '1':
                    e.syncTableType = Common.tableType.AcquisitionSource;
                    break;
                  case '2':
                    e.syncTableType = Common.tableType.AcquisitionTarget;
                    break;
                  case '3':
                    e.syncTableType = Common.tableType.CleaningTarget;
                    break;
                  case '4':
                    e.syncTableType = Common.tableType.FusionTarget;
                    break;
                  case '5':
                    e.syncTableType = Common.tableType.DataqualityMonitor;
                    break;
                  case '6':
                    e.syncTableType = Common.tableType.moduleTarget;
                    break;
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
      },
      //融合列表添加查询；
      checkMetaData() {
        // this.tableLeixing.forEach(res => {
        //   if (res.name == this.valueType) {
        //     this.cleanAddobj.syncTableType = res.code;
        //   }
        // }),
        //   this.shujuyuan.forEach(res => {
        //     if (res.name == this.valueSource) {
        //       this.cleanAddobj.dataSourceId = res.code;
        //     }
        //   })
        // this.cleanAddobj.sourceTable = this.biaochiosaddSearch;
        if (this.cleanAddobj.syncTableType == 1) {
          this.cleanAddobj.syncTableType = '';
        }
        this.cleanListshow();
      },

      //选中的主表；
      getCurrentRow(row, val) {
        this.mainTableId = row.row.id;
        this.mainTableRelatedName = row.row.sourceTable;
        this.tableId = row.row.dataSourceId;
        this.tableType = row.row.syncTableType;
        this.tableMinName = row.row.sourceTable;
        this.cleantabels = row.row.sourceTableMame;
        if (this.otherTableId == row.row.id) {
          this.$notify({
            tittle: '失败',
            message: '此表不能作为主表',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }
      },
      //融合附表获取
      cleanWordsshow() {
        api.getFuseTable(this.cleanAddobjPart)
          .then(res => {
            if (res.code === 'code_200') {
              this.choisecleanwrodsTableData = res.data;
              this.totleNum = res.page.totalNumber;
              this.choisecleanwrodsTableData.forEach(e => {
                console.log(e.syncTableType);
                switch (e.syncTableType) {
                  case '1':
                    e.syncTableType = Common.tableType.AcquisitionSource;
                    break;
                  case '2':
                    e.syncTableType = Common.tableType.AcquisitionTarget;
                    break;
                  case '3':
                    e.syncTableType = Common.tableType.CleaningTarget;
                    break;
                  case '4':
                    e.syncTableType = Common.tableType.FusionTarget;
                    break;
                  case '5':
                    e.syncTableType = Common.tableType.DataqualityMonitor;
                    break;
                  case '6':
                    e.syncTableType = Common.tableType.moduleTarget;
                    break;
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
      },
      //选择融合附表;
      chiosecleanWords() {
        //初始化数据
        this.partFuseFields = [];
        this.partTableRelatedFields = '';
        this.partTableId = '';
        // this.PartRadio = '';
        if (!this.tableId) {
          this.$notify({
            tittle: '失败',
            message: '请选择主表',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        } else {
          if (this.mainTableRelatedFields == '') {
            this.$notify({
              message: '请选择主表关联字段',
              type: 'error',
              offset: 100,
              duration: this.$store.state.el_Duration
            });
            return;
          }
          this.qingxiWords = true;
          this.isShowFieldsDialog = false;
          this.cleanWordsshow();
        }
      },

      //删除字段
      handleClick(index, rows, type) {
        console.log(index, rows, type);
        switch (type) {
          case 2: //删除
            this.$confirm('是否删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'blue-btn',
              confirmButtonClass: 'yellow-btn',
              type: 'warning',
              center: true
            })
              .then(() => {
                rows.splice(index, 1);
              })
              .catch(err => {
              });
            break;
        }
        console.log(index, rows, type);
      },
      //融合附表添加查询；
      checkMetaDataPart() {
        if (this.cleanAddobj.syncTableType == 1) {
          this.cleanAddobj.syncTableType = '';
        }
        this.cleanWordsshow();
      },

      //选择主表确定；
      liebiaoSubmit() {
        if (!this.tableId || this.partTableId == this.tableId) {
          this.$notify({
            message: '请选择主表',
            type: 'error',
            offset: 110,
            duration: this.$store.state.el_Duration
          });
          return false;
        } else {
          this.qingxiList = false;
          this.cleanwords.length = 0;
          api
            .getAllWords({
              tableType: this.tableType,
              tableName: this.tableMinName
            })
            .then(res => {
              console.log(res.data);
              if (res.code === 'code_200') {
                this.isShowFieldsDialog = true;
                this.fuseWordData = res.data;
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
      },

      //融合增加确认；
      cleanAddSubmit() {
        if (this.celueName == '') {
          this.$message({
            message: '融合名称不能为空',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }
        if (this.celuezwName == '') {
          this.$message({
            message: '融合表中文名称不能为空',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }

        if (this.fuseType == '') {
          this.$message({
            message: '请选择融合方式',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }

        if (
          this.mainTableRelatedFields == '' ||
          this.partTableRelatedFields == ''
        ) {
          this.$message({
            message: '请选择表关联字段',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }

        let mainFields = [];
        let partFields = [];

        this.cleanwords.forEach(item => {
          if (item.mainTableIdent == 1) {
            mainFields.push(item.targetField);
          } else {
            partFields.push(item.targetField);
          }
        });
        let mainId = this.tableMinName;
        let partId = this.tablepartName;
        let resultList = [{}, {}];
        resultList[0][mainId] = mainFields.join();
        resultList[1][partId] = partFields.join();
        console.log(resultList, '字段字段字段字段');
        let dataList = {
          enableState: this.valueZl,
          fuseMainTable: [
            this.mainTableRelatedName,
            this.mainTableRelatedFields
          ].join(','), //主表关联
          fuseName: this.celueName,
          fuseTargetTableName: this.celuezwName,
          fuseTable: [
            this.partTableRelatedName,
            this.partTableRelatedFields
          ].join(','), //附表关联
          fuseTables: resultList,
          fuseStrategyTable: this.cleanwords,
          fuseType: this.fuseType
        };
        api.addFuseStrategy(dataList)
          .then(res => {
            if (res.code === 'code_200') {
              this.$notify({
                tittle: '添加成功',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.$router.push({
                path: 'fuseStrategy',
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
      },
      //返回
      goBack() {
        this.$router.push({
          path: 'fuseStrategy',
          query: {
            menuLink: this.$route.query.menuLink
          }
        });
      },
      //选择的字段
      fieldsTableChange(row) {
        this.selectFields = row;
        console.log(row, '选中主表字段');
      },

      //确认选中的字段
      submitFuseFields() {
        if (this.selectFields.length == 0) {
          this.$notify({
            message: '请选择字段',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }
        if (
          (this.fieldsArrayType == 1 && this.mainTableRelatedFields == '') ||
          (this.fieldsArrayType == 2 && this.partTableRelatedFields == '')
        ) {
          this.$notify({
            message: '请选择表关联字段',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }
        this.isShowFieldsDialog = false;
        switch (this.fieldsArrayType) {
          case 1:
            this.addFuseFields = this.selectFields;
            break;
          case 2:
            this.partFuseFields = this.selectFields;
            break;
        }
        this.arrayConcat();
      },

      //选择附表
      partFieldsChange(row) {
        console.log('row', row);

        this.otherTableId = row.row.id;
        this.partTableRelatedName = row.row.sourceTable;
        this.partType = row.row.syncTableType;
        this.partTableId = row.row.dataSourceId;
        this.tablepartName = row.row.sourceTable;
        this.fusePartName = row.row.sourceTableMame;
        if (this.mainTableId == row.row.id) {
          this.$notify({
            tittle: '失败',
            message: '此表不能作为附表',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          return;
        }
      },

      //选择附表确认；
      partTableSubmit() {
        if (this.partTableId != '') {
          this.qingxiWords = false;
          this.fieldsArrayType = 2;

          api
            .getAllWords({
              tableType: this.partType,
              tableName: this.tablepartName
            })
            .then(res => {
              if (res.code === 'code_200') {
                this.isShowFieldsDialog = true;
                this.fuseWordData = res.data;
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
        } else {
          this.$notify({
            tittle: '失败',
            message: '请选择附表',
            type: 'error',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        }
      },

      //取消选择字段
      closeFieldsDialog() {
        this.isShowFieldsDialog = false;
      },
      //单选关联
      relatedFieldsFn(row) {
        switch (this.fieldsArrayType) {
          case 1:
            this.mainTableRelatedFields = row.targetField;
            break;
          case 2:
            this.partTableRelatedFields = row.targetField;
            break;
        }
      },
      //添加附表字段
      // addPartClick(row) {
      //
      //
      // },

      //合并数数据
      arrayConcat() {
        //添加标识
        console.log('lalalal', this.addFuseFields);
        this.addFuseFields.forEach(item => {
          item.mainTableIdent = 1;
        });

        this.partFuseFields.forEach(item => {
          item.partTableIdent = 2;
        });
        console.log('la22222', this.addFuseFields);
        //合并
        this.cleanwords = [];
        this.cleanwords = this.cleanwords.concat(
          this.addFuseFields,
          this.partFuseFields
        );
        let partDataList = [];
        for (let i = 0; i < this.cleanwords.length; i++) {
          let repeat = false;
          for (let j = 0; j < partDataList.length; j++) {
            if (this.cleanwords[i].targetField == partDataList[j].targetField) {
              repeat = true;
              break;
            }
          }
          if (!repeat) {
            partDataList.push(this.cleanwords[i]);
          }
        }
        console.log(partDataList, '去重后的数据');
        return (this.cleanwords = partDataList);
      }
    },
    watch: {}
  };
</script>
<style scoped lang="less">
  @import "fuseStrategy-add.less";

  .label-margin {
    margin-top: -15px;
  }
</style>


