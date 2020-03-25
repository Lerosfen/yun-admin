<template>
  <div class="list-container shadow modelSetting">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section clearfix" style="position: relative; height: inherit">
      <div class="head_title">
        <list-table-title :title="setTitle" :isBack="false"></list-table-title>
        <!-- <div class="back" @click="back">返回</div> -->
      </div>
      <!--表描述-->
      <div>
        <el-row>
          <el-col :span="8" style="margin-top: 40px;">
            <div class="input-data">
              <div for class="yellow middle m-r-10">模型名称</div>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="modelName" disabled></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="8" style="margin-top: 40px;">
            <div class="input-data">
              <div for class="yellow middle m-r-10">描述</div>
              <div class="input-tpm yellow-input yellow-textarea textHeight">
                <i class="honer-left"></i>
                <el-input type="textarea" v-model="modelDescribe" disabled></el-input>
                <i class="honer-right"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="3" :offset="5" style="margin-top: 50px;">
            <div class="add-btn fl yellow m-l-10" @click="addBtnFn()">新 增</div>
          </el-col>
        </el-row>
      </div>
      <!--添加信息-->
      <div class="drag-list">
        <el-row :gutter="20" class="model-content" v-for="(item,index) in dataArr" :key="index">
          <el-col :span="7">
            <div class="table-container">
              <el-table :data="item[0].mapping" stripe style="width: 100%" height="340">
                <el-table-column label="模型属性" align="center" :show-overflow-tooltip="true">
                  <template slot-scope="scope">{{scope.row.modelChineseName}}</template>
                </el-table-column>
                <el-table-column label="填充属性" align="center">
                  <template slot-scope="scope">
                    <div
                      class="drag-div"
                      :key="scope.row.fillChineseName"
                      @drop="drop($event,scope,item)"
                      @dragover="allowDrop($event)"
                    >{{scope.row.fillChineseName}}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>

          <transition name="bounce">
            <div class="fuseFields" v-if="index!=0 && item[0].isRelationTblShow" transiton="bounce">
              <div class="table-container">
                <el-table :data="item[0].relationMapping" stripe style="width: 100%" height="340">
                  <el-table-column label="模型属性" align="center">
                    <template slot-scope="scope">{{scope.row.leftName}}</template>
                  </el-table-column>
                  <el-table-column label="填充属性" align="center">
                    <template slot-scope="scope">
                      <div
                        v-if="scope.row.leftName"
                        class="drag-div"
                        :key="scope.row.fillChineseName"
                        @drop="drop($event,scope,item)"
                        @dragover="allowDrop($event)"
                      >{{scope.row.fillChineseName}}
                      </div>
                      <div class="drag-divs" v-if="scope.row.leftName==''"></div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </transition>

          <el-col :span="9">
            <div class="selectBtn">
              <!--<div class="selectBtnBg m-r-10" @click="selectDataSource">
                数据源选择
              </div>-->
              <div class="selectBtnBg" @click="selectDataTable(item,index)">数据表选择</div>
              <div v-if="index!=0" class="selectBtnBg" @click="setRelation(item,index)">设置关联关系</div>
              <!--显示字段-->
              <p class="fillPro">可填充的属性:</p>
              <div class="fill-box">
                <div
                  class="select-item"
                  v-for="val in item[0].allDropFields"
                  :key="val.id"
                  draggable="true"
                  @dragstart="drag($event,val,index)"
                >
                  <el-tooltip effect="dark" :content="val.target_field_names" placement="top">
                    <span style="width:90px;border: none">{{val.target_field_names}}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="2" :offset="6">
            <!--右侧移动-->
            <div class="moveBtn" v-if="index!=0">
              <div>
                <img
                  src="../../../assets/img/icon/moveTop.png"
                  height="80"
                  width="79"
                  @click="BtnTop(item,index)"
                />
              </div>
              <div>
                <img
                  src="../../../assets/img/icon/moveDelet.png"
                  height="80"
                  width="79"
                  @click="BtnDel(item,index)"
                />
              </div>
              <div>
                <img
                  src="../../../assets/img/icon/moveBottom.png"
                  height="80"
                  width="79"
                  @click="BtnBottm(item,index)"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- <transition>
    </transition>-->

    <div slot="footer" class="btnPosition">
      <el-button class="yellow-btn" type="primary" @click="saveModelSetting">保 存</el-button>
      <el-button class="blue-btn" @click="cancelRouter()">取 消</el-button>
    </div>
    <!--数据源选择-->
    <yj-dialog
      title="数据源选择"
      :visible.sync="selectDataSourceDialog"
      :close-on-click-modal="false"
      class="data_model_title"
    >
      <div class="right-table clearfix addtable-container">
        <el-table :data="dataSourceList" style="width:100%" height="400">
          <el-table-column>
            <template slot-scope="scope">
              <el-radio
                @change="getDataSourceRow(scope,scope.$index)"
                :label="scope.$index"
                v-model="DataSourceRadio"
              >&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column label="数据源名称">
            <template slot-scope="scope">{{scope.row.namess}}</template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="model-pag">
          <el-pagination
            :current-page="DataSourceCurrentPage"
            :page-size="DataSourcePageSize"
            @current-change="DataSourceCurrentChange"
            layout="prev, pager, next"
            :total="DataSourceTotalNum"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="sourceSubmit">确 定</el-button>
        <el-button class="blue-btn" type="primary" @click.native="selectDataSourceDialog=false">取 消</el-button>
      </div>
    </yj-dialog>

    <!--清洗列表选择-->
    <Modal
      title="清洗列表-列表"
      v-model="selectDataTableDialog"
      class="cha"
      width="40%"
      :closable="false"
      :mask-closable="false"
    >
      <el-form>
        <el-row>
          <el-col :span="9">
            <el-form-item label="表名">
              <div class="input-data fl">
                <div class="input-data">
                  <div class="input-tpm yellow-input new-input" style="width: 100%">
                    <el-input placeholder="请输入表名" v-model="cleanAddobj.sourceTable"></el-input>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="9" style="margin-left: -10px">
            <el-form-item label="表类型">
              <div class="sel-group sel-yellow fl">
                <i class="honer-left"></i>
                <el-select v-model="cleanAddobj.syncTableType" placeholder="全部">
                  <el-option
                    v-for="item in tableLeixing"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="3" :pull="1" style="margin-left: -20px">
            <div class="add-btn fl yellow m-l-10" @click="checkMetaData()">查 询</div>
          </el-col>
          <el-col :span="3">
            <div class="add-btn fl yellow m-l-10" @click="resetMetaData()">重 置</div>
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
        <el-table :data="choisecleanTableData" height="270" style="width: 100%">
          <el-table-column width="40">
            <template slot-scope="scope">
              <!-- class="textRadio" -->
              <el-radio
                @change="getCurrentRow(scope,scope.$index)"
                :label="scope.row.id"
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
            :width="item.width"
          ></el-table-column>
        </el-table>
        <!--分页-->
        <div class="model-pag" style="margin-top: 20px">
          <el-pagination
            v-if="choisecleanTableData.length!=0"
            :current-page="cleanAddobj.currentPage"
            :page-size="cleanAddobj.pageSize"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="tabListtotleNum"
            :pager-count="5"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="tableSubmit">确 定</el-button>
        <el-button class="blue-btn" type="primary" @click="cancleTable">取 消</el-button>
      </div>
    </Modal>

    <!--改为新的-->
    <!--数据表选择-->
    <!--<yj-dialog title="数据表选择" :visible.sync="selectDataTableDialog" :close-on-click-modal="false" width="60%"
               class="data_model_title">
      <div class="right-table clearfix addtable-container">
        <el-table
          :data="dataTableList"
          style="width:100%"
          height="400">
          <el-table-column>
            <template slot-scope="scope">
              <el-radio @change.native="getDataTableRow(scope,scope.$index)" :label="scope.$index"
                        v-model="DataTableRadio">
                &nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="英文表名">
            <template slot-scope="scope">
              {{scope.row.sourceTable}}
            </template>
          </el-table-column>
        </el-table>
        &lt;!&ndash;分页&ndash;&gt;
         <div class="model-pag">
            <el-pagination
              :current-page="DataTableCurrentPage"
              :page-size="DataTablePageSize"
              @current-change="DataTableCurrentChange"
              layout="prev, pager, next"
              :total="DataTableTotalNum"
              prev-text="上一页"
              next-text="下一页">
            </el-pagination>
         </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="tableSubmit">确 定</el-button>
        <el-button class="blue-btn" type="primary" @click.native="selectDataTableDialog=false">取 消</el-button>
      </div>
    </yj-dialog>-->
  </div>
</template>
<script>
  /* eslint-disable */
  import Vue from 'vue';
  import api from '../../../api/bigData/daq/dataModel';
  import apis from '../../../api/bigData/daq/cleanStrategyMange';
  import Common from '../../../../config/common';
  // import draggable from 'vuedraggable';

  let dom = '';
  export default {
    name: 'dataModel_setting',
    data() {
      return {
        isSettingRelation: false,
        modelArr: [
          {
            name: '111',
            value: ''
          },
          {
            name: '111',
            value: ''
          }
        ],
        fildList: [
          {
            id: 1,
            value: 'xixixi'
          },
          {
            id: 2,
            value: 'hahah'
          }
        ],
        setTitle: '数据模型设置',
        DataSourceCurrentPage: 1,
        DataSourcePageSize: 10,
        DataSourceTotalNum: 0,
        DataTableCurrentPage: 1,
        DataTablePageSize: 10,
        DataTableTotalNum: 0,
        modelId: '',
        fillProperty: {}, //填充属性
        modelName: '', //模型名称
        modelDescribe: '', //模型描述
        selectDataSourceDialog: false, //数据源选择
        selectDataTableDialog: false, //数据表选择
        DataSourceRadio: '',
        DataTableRadio: '',
        selectSourceId: '', //选择的数据源id
        selectTableId: '', //选择的表id
        dataSourceList: [], //数据源
        dataTableList: [], //数据表
        tableData: [], //字段数据
        modelTableData: [], //模型表字段数据
        subTableList: [], //提交的属性表数据
        tableFieldsList: [], //数据表字段数据
        dropTableFields: '', //拖拽的数据的英文字段
        dropTableChineseFields: '', //拖拽的数据的中文字段
        modelMappingData: [], //获取映射的数据
        dataArr: [], //数据整合
        drapIndex: '', //拖拽重复的标识
        fillPropertyIndex: '', //点击选择可填充属性的标识
        selectDataTableIndex: '', //点击选择的数据表
        dropListIndex: '',
        currentRow: {},
        // modelList: {
        //   fillProperty: '',
        // },

        /*headerData: [  //字段表头
            {
              prop: 'target_field_names',
              label: '模型属性'
            },
            {
              prop: 'name',
              label: '填充属性'
            },
          ],*/
        headerData: [
          {
            prop: 'sourceTable',
            label: '数据库表名',
            width: 400
          },
          /*{
             prop: 'dataSourceId',
             label: '表分类 ',
             },*/
          {
            prop: 'sourceTableMame',
            label: '描述'
          },
          {
            prop: 'syncTableType',
            label: '表分类 ',
            width: 100
          }
        ],
        cleanAddobj: {
          sourceTable: '',
          dataSourceId: '',
          syncTableType: '',
          currentPage: 1,
          pageSize: 10
        },
        tableLeixing: [],
        choisecleanTableData: [],
        tabListtotleNum: 1,
        radio: '',
        // isConfigDialogShow: false
        mainTblList: []
      };
    },
    components: {
      // draggable
    },
    mounted() {
      this.$store.commit('showLoading', true);
      this.modelId = this.$route.query.modelId;
      //获取表数据
      api.getCheckOneData({ id: this.modelId })
        .then(res => {
          if (res.code == 'code_200') {
            this.modelTableData = res.data;
            this.modelName = res.data.name;
            this.modelDescribe = res.data.remark;
            this._resDataManage();
          }
        });

      //获取映射的数据
      // api.getModelSettingList({modelId: this.modelId}).then((res) => {
      //   this.modelMappingData = res.data;
      //   // this.selectSourceId = res.data,
      //   // this.selectTableId = res.data,
      // });

      //      //获取字段

      api
        .choiseCleanWordsNew({
          syncTableId: this.modelId
          //        syncTableId: this.modelId
        })
        .then(res => {
          if (res.code == 'code_200') {
            this.tableData = res.data;
          }
        });
      this._getFillProperty();
    },

    methods: {
      // 拖拽
      drop(event, row, item) {
        var thisIndexs = this.selectDataTableIndex;
        var thisData = JSON.parse(JSON.stringify(this.dataArr))[thisIndexs][0];
        if (thisData.isRelationTblShow || this.selectDataTableIndex == 0) {
          let dataList = this.dataArr[this.dropListIndex][0].mapping;
          event.preventDefault();
          if (row.row != '') {
            for (var i = 0; i < dataList.length; i++) {
              if (dataList[i].fillChineseName == this.dropTableChineseFields) {
                dataList[i].fillChineseName = '';
                dataList[i].fillEnglishName = '';
              }
            }
            row.row.fillChineseName = this.dropTableChineseFields;
            row.row.fillEnglishName = this.dropTableFields;
          }

          var i = row.$index;
          // item[0].relationMapping[
          //   row.$index
          // ].fillChineseName = this.dropTableChineseFields;
          var newRow = item[0].relationMapping[row.$index];
          item[0].relationMapping.splice(i, 1, newRow);
        } else {
          this.$message({
            type: 'error',
            message: '请设置关联关系'
          });
          return;
        }
      },
      // drops(event, row) {
      //   let dataList = this.dataArr[this.dropListIndex][0].mapping;
      //   event.preventDefault();
      //   for (var i = 0; i < dataList.length; i++) {
      //     if (dataList[i].fillChineseName == this.dropTableChineseFields) {
      //       dataList[i].fillChineseName = "";
      //       dataList[i].fillEnglishName = "";
      //     }
      //   }
      //   row.row.fillChineseName = this.dropTableChineseFields;
      //   row.row.fillEnglishName = this.dropTableFields;
      // },
      drag(event, row, index) {
        dom = event.currentTarget;
        this.dropTableFields = row.targetField;
        this.dropTableChineseFields = row.target_field_names;
        this.dropListIndex = index;
      },
      allowDrop(event) {
        event.preventDefault(); // 方法阻止元素发生默认的行
      },

      //返回
      cancelRouter() {
        this.$router.push({
          path: 'dateModel',
          query: {
            menuLink: this.$route.query.menuLink
          }
        });
      },

      //数据整合=======================
      addData() {
        this.dataArr.push([
          {
            mapping: [],
            sourceId: '',
            tableId: '',
            allDropFields: [],
            relationMapping: [],
            isRelationTblShow: false
          }
        ]);
      },

      _resDataManage() {
        //===============================
        if (this.modelMappingData.length == 0) {
          this.dataArr.push([
            {
              mapping: [],
              sourceId: '',
              tableId: '',
              allDropFields: [],
              relationMapping: [],
              isRelationTblShow: false
            }
          ]);
          if (this.modelTableData.fields) {
            this.modelTableData.fields.forEach(item => {
              this.dataArr[0][0].mapping.push({
                //  模型属性中英
                modelChineseName: item.chineseName,
                modelEnglishName: item.englishName,
                //  填充属性中英
                fillChineseName: '',
                fillEnglishName: ''
              });
            });
          }
          if (this.dataArr[0][0].mapping.length != 0) {
            this.$store.commit('hideLoading', false);
          }
        }
        //=================
        for (let i = 0; i < this.modelMappingData.length; i++) {
          this.addData();
        }

        this.modelMappingData.forEach((item, index) => {
          // api.choiseCleanWords({
          //   tableType: this.currentRow.syncTableType,
          //   tableName: this.currentRow.sourceTable,
          // }).then((res) => {
          //   if (res.code == 'code_200') {
          //     this.dataArr[index][0].allDropFields = res.data;
          //     this.dataArr[index][0].sourceId = item.sourceId;
          //     this.dataArr[index][0].tableId = item.tableId;
          //     JSON.parse(item.mapping).forEach((value, index1) => {
          //       for (let val in value) {
          //         res.data.forEach((num) => {
          //           let data1 = num.targetField.replace(/[\s\n\t]+$/g, "");
          //           let data2 = value[val].replace(/[\s\n\t]+$/g, "");
          //           if (data1 === data2) {
          //             this.dataArr[index][0].mapping.push({
          //               //  模型属性中英
          //               modelChineseName: this.tableData[index1].target_field_names,
          //               modelEnglishName: val,
          //               //  填充属性中英
          //               fillChineseName: num.target_field_names.replace(/[\s\n\t]+$/g, ""),
          //               fillEnglishName: value[val],
          //             })
          //           }
          //         })
          //       }
          //     })
          //   }
          // });
        });
      },

      //===============================
      cancleTable() {
        this.selectDataTableDialog = false;
        this.cleanAddobj.sourceTable = '';
        this.cleanAddobj.dataSourceId = '';
        this.cleanAddobj.syncTableType = '';
        this.cleanAddobj.currentPage = 1;
        this.tableId = '';
        this.tName = '';
        this.cleantabels = '';
        this.radio = '';
        this.isSettingRelation = false;
      },
      //清洗列表添加查询；
      checkMetaData() {
        if (this.cleanAddobj.syncTableType == 1) {
          this.cleanAddobj.syncTableType = '';
        }
        this.cleanListshow();
      },
      resetMetaData() {
        this.cleanAddobj.sourceTable = '';
        this.cleanAddobj.dataSourceId = '';
        this.cleanAddobj.syncTableType = '';
        this.cleanListshow();
      },
      //选择数据源
      selectDataSource() {
        this.selectDataSourceDialog = true;
        // this.DataSourceRadio = '';
        api
          .getDataSourceAll({
            currentPage: this.DataSourceCurrentPage,
            pageSize: this.DataSourcePageSize
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.dataSourceList = res.data;
              this.DataSourceTotalNum = res.page.totalNumber;
            }
          });
      },
      //获取数据源
      getDataSourceRow(row, index) {
        this.selectSourceId = row.row.id;
      },
      //清洗列表翻页；
      handleCurrentChange(e) {
        this.cleanAddobj.currentPage = e;
        this.cleanListshow();
      },
      //数据源确认
      sourceSubmit() {
        if (!this.selectSourceId) {
          this.$message({
            type: 'error',
            message: '请选择数据源'
          });
          return;
        }
        this.selectDataSourceDialog = false;
      },
      //列表选中；
      getCurrentRow(row, val) {
        //this.tableType=row.row.syncTableType;
        //this.tName=row.row.sourceTable;
        //this.cleantabels=row.row.sourceTable;

        this.selectTableId = row.row.id;
        this.currentRow = row.row;
      },
      //清洗列表接口；
      cleanListshow() {
        apis.getAllCleanList(this.cleanAddobj)
          .then(res => {
            if (res.code === 'code_200') {
              this.choisecleanTableData = res.data;
              this.choisecleanTableData.forEach(e => {
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
                  case '5':
                    e.syncTableType = Common.tableType.DataqualityMonitor;
                    break;
                  case '6':
                    e.syncTableType = Common.tableType.moduleTarget;
                    break;
                }
              });

              this.tabListtotleNum = res.page.totalNumber;
            } else {
              this.tips('失败', 'error', res.msg);
            }
          });
      },
      //选择数据表
      selectDataTable(item, index) {
        this.selectDataTableDialog = true;
        this.fillPropertyIndex = index;
        this.selectDataTableIndex = index;

        //调用表类型，数据源接口；

        this.cleanListshow();
        //获取表类型和数据源；
        apis.cleanAddtableType({ code: 'TABLEINFO' })
          .then(res => {
            if (res.code === 'code_200') {
              this.tableLeixing = res.data;
            } else {
              this.tips('失败', 'error', res.msg);
            }
          });
        /*apis.getAllcleanTable().then(res=>{
            if (res.code === 'code_200') {
              this.shujuyuan=res.data;
            }
            else {
              this.tips('失败','error',res.msg);
            }
          });*/
      },
      //原来代码
      //选择数据表
      /*selectDataTable(item, index) {
          this.selectTableId = '';
          this.DataTableRadio='';
          this.selectDataTableIndex = index;
          if (!this.selectSourceId) {
            this.$message({
              type: 'error',
              message: '请选择数据源',
            });
            return;
          }

          this.selectDataTableDialog = true;
          this.fillPropertyIndex = index;
          api.choiseCleanList({
            dataSourceId: this.selectSourceId,
            currentPage: this.DataTableCurrentPage,
            pageSize: this.DataTablePageSize
          }).then((res) => {
            if (res.code == 'code_200') {
              this.dataTableList = res.data;
              this.DataTableTotalNum = res.page.totalNumber
            }

          })
        }
        ,*/
      //原来的
      //获取数据表
      /*getDataTableRow(row, index) {
          this.selectTableId = row.row.id;
          this.currentRow=row.row;


        },*/

      //数据表确认
      tableSubmit() {
        if (this.radio == '') {
          this.$message({
            type: 'error',
            message: '请选择数据表'
          });
          return;
        }
        // this.dataArr=[];
        (this.pageSize = 10),
          (this.currentPage = 1),
          api
            .choiseCleanWords({
              tableType: this.currentRow.syncTableType,
              tableName: this.currentRow.sourceTable
            })
            .then(res => {
              if (res.code == 'code_200') {
                this.selectDataTableDialog = false;
                this.dataArr[this.fillPropertyIndex][0].allDropFields = res.data;
                if (this.fillPropertyIndex == 0) {
                  this.mainTblList = res.data;
                }
                this.radio = '';
              }
            });
        this.dataArr[this.selectDataTableIndex][0].sourceId = this.selectSourceId;
        this.dataArr[this.selectDataTableIndex][0].tableId = this.selectTableId;
      },

      // 设置关联关系
      setRelation(item, index) {
        var thisData = JSON.parse(JSON.stringify(this.dataArr))[index][0];
        if (thisData.tableId != '') {
          var addLen = thisData.mapping.length;
          for (var i = 0; i < addLen; i++) {
            this.dataArr[index][0].relationMapping.push({
              leftName: '',
              leftEnName: ''
            });
          }
          item[0].isRelationTblShow = true;
        } else {
          this.$message({
            type: 'error',
            message: '请选择数据表'
          });
        }
      },
      //查询可填充的属性
      _getFillProperty() {
        // api.choiseCleanWords({
        //   tableType: this.currentRow.syncTableType,
        //   tableName: this.currentRow.sourceTable,
        // }).then((res) => {
        //   if (res.code == 'code_200') {
        //     this.selectDataTableDialog = false;
        //     // this.dataArr[this.fillPropertyIndex][0].allDropFields = res.data;
        //     this.selFillProperty = res.data;
        //     // this.totalNum = res.page.totalNumber
        //   }
        // })
      },

      //数据处理
      dataDispose() {
        this.dataArr.forEach((item, index) => {
          this.subTableList.push({
            mapping: [],
            sourceId: item[0].sourceId,
            tableId: item[0].tableId,
            priority: index + 1,
            tableMapping: []
          });
          item[0].mapping.forEach((value, num) => {
            if (value.fillEnglishName) {
              let modelEnglishName = value.modelEnglishName;
              let fillEnglishName = value.fillEnglishName;
              // if(value.fillEnglishName){
              var obj = {};
              obj[modelEnglishName] = fillEnglishName;
              this.subTableList[index].mapping.push(obj);
            }
          });
          item[0].relationMapping.forEach((value, num) => {
            if (value != undefined) {
              if (value.fillEnglishName) {
                let modelEnglishName = value.leftEnName;
                let fillEnglishName = value.fillEnglishName;
                var obj = {};
                obj[modelEnglishName] = fillEnglishName;
                this.subTableList[index].tableMapping.push(obj);
              }
            }
          });
        });
        delete this.subTableList[0].tableMapping;

        //  this.subTableList.forEach((e,i)=>{
        //     e.mapping.forEach((es,index)=>{
        //       debugger
        //       if(es==''){
        //          e.mapping.splice(index,1)
        //       }
        //     })
        //   })
      },
      //数据保存
      saveModelSetting() {
        this.dataDispose();
        var subTblList = JSON.parse(JSON.stringify(this.subTableList))[0];
        if (subTblList.mapping.length != 0 && subTblList.tableId != '') {
          api
            .saveSetting({
              mappingList: this.subTableList,
              modelId: this.modelId
            })
            .then(res => {
              if (res.code == 'code_200') {
                this.$notify({
                  type: 'success',
                  message: '设置成功'
                });
                this.$router.push({
                  path: 'dateModel',
                  query: {
                    menuLink: this.$route.query.menuLink
                  }
                });
              } else {
                this.$notify({
                  type: 'error',
                  message: res.msg
                });
              }
            });
        } else {
          this.$message({
            type: 'error',
            message: '请完善信息'
          });
        }
      },
      //数据新增
      addBtnFn() {
        this.Create();
      },
      Create() {
        // 填充属性为空时不能新增
        var currentList = JSON.parse(JSON.stringify(this.dataArr));
        var crtListLen = currentList.length - 1;
        var fillProp = currentList[crtListLen][0].mapping;
        var isCreate = false;
        fillProp.forEach(item => {
          if (item.fillChineseName != '') {
            isCreate = true;
          }
        });
        if (isCreate) {
          this.dataArr.push([
            {
              mapping: [],
              sourceId: '',
              tableId: '',
              allDropFields: [],
              isRelationTblShow: false,
              relationMapping: []
            }
          ]);
          this.modelTableData.fields.forEach(item => {
            this.dataArr[this.dataArr.length - 1][0].mapping.push({
              //  模型属性中英
              modelChineseName: item.chineseName,
              modelEnglishName: item.englishName,
              //  填充属性中英
              fillChineseName: '',
              fillEnglishName: ''
            });
          });

          var currentIndex = this.selectDataTableIndex;
          // 去重
          var thisMapping = JSON.parse(JSON.stringify(this.dataArr))[
            currentIndex
            ][0].mapping;
          var len = thisMapping.length;
          for (var i = len - 1; i >= 0; i--) {
            if (thisMapping[i].fillChineseName != '') {
              thisMapping.splice(i, 1);
            }
          }
          this.dataArr[currentIndex + 1][0].mapping = thisMapping;
          // 设置关联关系表格第一列
          var arrLists = JSON.parse(JSON.stringify(this.dataArr))[0][0].mapping;
          arrLists.forEach(item => {
            if (item.fillChineseName != '') {
              this.dataArr[currentIndex + 1][0].relationMapping.push({
                leftName: item.fillChineseName,
                leftEnName: item.fillEnglishName
              });
            }
          });
          // console.log(this.dataArr[currentIndex + 1][0].relationMapping);
        } else {
          this.$message({
            type: 'error',
            message: '当前行填充属性不能为空'
          });
        }
      },

      // 数据源页码编辑
      DataSourceCurrentChange(val) {
        const self = this;
        self.DataSourceCurrentPage = val;
        self.selectDataSource();
      },

      //数据表页码编辑
      DataTableCurrentChange(val) {
        const self = this;
        self.DataTableCurrentPage = val;
        self.selectDataTable();
      },

      //上移
      BtnTop(item, index) {
        if (index == 1) {
          return;
        }
        this.dataArr.push(this.dataArr.shift());
      },

      //删除
      BtnDel(item, index) {
        // console.log('console.log()', this.selectDataTableIndex);

        this.dataArr.splice(index, 1);
        this.selectDataTableIndex = index - 1;
      },

      //下移
      BtnBottm(item, index) {
        if (index == this.dataArr.length - 1) {
          return;
        }
        this.dataArr.unshift(this.dataArr.pop());
      }
    },

    watch: {
      // dataArr: {
      //
      //   handler: function (val, oldval) {
      //   },
      // },
      // colors: {
      //   handler: function (val, oldval) {
      //   },
      //   deep: true
      // },
    }
  };
</script>

<style scoped lang="less">
  .modelSetting {
    .add-btn {
      width: 100px;
      height: 30px;
      border: 1px solid #009CFF;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      box-shadow: 0px 0px 20px 0px rgb(11, 153, 226, 0.5) inset;
    }

    .textHeight {
      width: 70%;
      height: 56px;
    }

    .head_title {
      display: flex;
      justify-content: space-between;

      .back {
        background: url("../../../assets/img/icon/back.png") 100% 100% no-repeat;
        width: 179px;
        height: 37px;
        text-align: center;
        line-height: 38px;
        font-weight: bold;
        cursor: pointer;
      }
    }

    .drag-list {
      margin: 10px -20px;
      height: 72%;
      overflow-x: hidden;
      overflow-y: scroll;

      .model-content {
        background: rgba(11, 153, 226, .1);
        padding: 20px 0;
        margin-bottom: 20px;
        padding-left: 20px;
      }
    }

    .btnPosition {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 22px;
      z-index: 100;
      left: 6%;
    }

    .selectBtn {
      margin-top: 15px;

      .selectBtnBg {
        margin-left: 12px;
        cursor: pointer;
        height: 36px;
        width: 150px;
        line-height: 36px;
        text-align: center;
        display: inline-block;
        color: #f5c710;
        background: url("../../../assets/img/siderBar/bigBtn.png") 100% 100% no-repeat;
      }
    }

    /*拖拽css*/

    .fill-box {
      width: 360px;
      height: 250px;
      overflow-y: scroll;
    }

    .select-item {
      display: inline-block;
      // float: left;
      text-align: center;
      border: 1px solid #009CFF;
      background: #009CFF;
      cursor: pointer;
      padding: 5px;
      width: 90px;
      color: #616161;
      margin: 7px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 5px;
    }

    .cursored {
      cursor: default;
    }

    .project-content,
    .people-content {
      margin: 30px 50px;
    }

    .people-content {
      margin-top: 30px;
    }

    .drag-div {
      border-bottom: 1px solid #1484bb;
      cursor: pointer;
      height: 45px;
      line-height: 45px;
      text-align: center;
    }

    .drag-divs {
      height: 45px;
    }

    .select-project-item {
      display: inline-block;
      text-align: center;
      border-radius: 3px;
    }

    .drag-people-label {
      margin-bottom: 0;
      padding-right: 10px;
    }

    [v-cloak] {
      display: none;
    }

    /**/

    .fillPro {
      color: #10d1db;
      margin-left: 10px;
    }

    .moveBtn img {
      cursor: pointer;
      width: 60px;
      height: 60px;
    }

    .input-data {
      display: flex;
    }

    .input-data [type="textarea"] {
      width: 200px;
    }

    .fuseFields {
      padding: 30px 15px 0 15px;
      width: 27%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 90px;
      background: rgba(11, 153, 226, .1);
      z-index: 100000;
      //border-left: 1px solid #38fcff;


    }

    .bounce-enter-active {
      animation: bounce-in 0.5s;
    }

    .bounce-leave-active {
      animation: bounce-in 0.5s reverse;
    }

    @keyframes bounce-in {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.5);
      }
      100% {
        transform: scale(1);
      }
    }
  }
</style>
