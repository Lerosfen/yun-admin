<template>
  <!-- 新增行融合 -->
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
            <el-form :rules="addFormRules" ref="addFormRules" :model="addForm" label-width="200px">
              <el-row>
                <el-col :span="18" :offset="3">
                  <div class="input-group">
                    <span class="xuhao">01</span>
                    <label for class="middle m-r-10 clean_mc">/融合名称</label>
                    <el-form-item prop="celueName">
                      <div class="input-tpm blue-input new-input" style="margin-top: 16px">
                        <el-input
                          placeholder
                          v-model="addForm.celueName"
                          disabled
                        ></el-input>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="18" :offset="3">
                  <div class="input-group">
                    <span class="xuhao">02</span>
                    <label for class="middle m-r-10 clean_mc">/融合表中文名称</label>
                    <el-form-item prop="celuezwName">
                      <div class="input-tpm blue-input new-input" style="margin-top: 16px">
                        <el-input
                          placeholder
                          v-model="addForm.celuezwName"
                          disabled
                        ></el-input>
                      </div>
                    </el-form-item>
                    <el-button
                      v-show="showType==0"
                      class="blue-btn choisetab"
                      type="primary"
                      @click="fuseRow()"
                    >选择表</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div>
            <!-- 所有字段表 -->
            <div class="table-container wordtable-container" style="margin-top: 20px">
              <el-row>
                <el-col :span="tableWidth" :offset="3">
                  <el-table stripe :data="dBTableData" height="250" style="width: 100%">
                    <el-table-column
                      v-for="item in cleanwordsHead"
                      :label="item.label"
                      :prop="item.prop"
                      :key="item.id"
                      :show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <div class="btnMove"></div>
                        <span class="check-detail" @click="checkDetail(scope)">查 看</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="fuseBtn">
            <el-button class="blue-btn" @click="goBack()">关闭</el-button>
          </div>

          <transition name="fade">
            <div class="fuseFields" v-show="isfuseDetailShow" transiton="fade">
              <div class="table-container selectWordDialog">
                <el-row>
                  <el-col>
                    <el-table :data="fuseWordTblData" stripe height="480" style="width: 100%">
                      <el-table-column
                        v-for="item in fuseHeadWord"
                        :label="item.label"
                        :prop="item.prop"
                        :key="item.id"
                        :show-overflow-tooltip="true"
                      ></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </div>
              <div class="dialog-footer" style="margin-top: 10px">
                <el-button class="blue-btn" @click="isfuseDetailShow=false">关 闭</el-button>
              </div>
            </div>
          </transition>

          <!--融合机制-主表-->
          <yj-dialog
            title="融合机制-列表"
            :visible.sync="qingxiList"
            class="cha"
            width="55%"
            :close-on-click-modal="false"
          >
            <el-form label-position="right" label-width="60px">
              <el-row>
                <el-col :span="9">
                  <el-form-item label="表名">
                    <div class="input-data fl">
                      <div class="input-data">
                        <div class="input-tpm yellow-input">
                          <i class="honer-left"></i>
                          <el-input v-model="cleanAddobj.sourceTable"></el-input>
                          <i class="honer-right"></i>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
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
                <el-col :span="5">
                  <div class="add-btn fl yellow m-l-10" @click="checkMetaData()">查询</div>
                </el-col>
              </el-row>
              <el-row></el-row>
            </el-form>

            <div class="table-container addtable-container">
              <el-table
                :data="choisecleanTableData"
                style="width: 100%"
                @selection-change="fieldsTableChange1"
                height="400"
              >
                <el-table-column type="selection" width="50"></el-table-column>
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
          </yj-dialog>

          <!-- </div> -->
        </el-col>
        <el-col :span="3">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import api from "../../api/bigData/daq/fuseStrategy";
import Common from "../../../config/common";

export default {
  components: {},
  data() {
    return {
      dBTableData: [],
      isfuseDetailShow: false,
      currentPageMain: 1,
      currentPagePart: 1,
      pageSizeMain: 10,
      pageSizePart: 10,
      totleNumMain: 1,
      radios: "",
      titles: "融合策略-查看行融合",
      valueZl: "",
      radio: "", //主表选中状态
      PartRadio: "", //附表选中状态
      tableWidth: 15, //表格的宽度
      msg: {},
      fuseWordData: [],
      options: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      options1: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      options2: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      SourceArr: [
        {
          value: "1",
          label: "行政审批系统"
        },
        {
          value: "2",
          label: "一体化平台用表"
        }
      ],
      headerData: [
        // 表头数据
        {
          prop: "sourceTable",
          label: "数据库表名"
        },
        {
          prop: "sourceTableMame",
          label: "描述"
        },
        {
          prop: "syncTableType",
          label: "表分类 "
        }
      ],
      valueType: "采集源",
      isShowFieldsDialog: false, //字段弹框
      valueSource: "MYSQL",
      valueSourceid: "",
      isShowTime: false,
      keyDefault: "否",
      addForm: {
        celueName: "",
        celuezwName: ""
      },
      tacticsName: "",
      tableName: "",
      TimingRule: "",
      dataSource: "",
      isTiming: "",
      tableData: [],
      cleantabels: "", //融合主表名称
      fusePartName: "", //融合附表名称
      cleanwords: [],
      cleanwords1: [], //行融合 附表
      lookDisabled: false,
      qingxiList: false,
      choisecleanTableData: [],
      tableType: "",
      partType: "",
      biaochiosaddSearch: "",
      biaochiosSearch: "",
      qingxiWords: false,
      choisecleanwrodsTableData: [],
      showType: "",
      tableLeixing: [],
      shujuyuan: [],
      currentPage: 1,
      pageSize: 10,
      totleNum: 1,
      radioRelated: "", //单选关联字段
      mainTableRelatedName: "", //主表关联表名
      partTableRelatedName: "", //附表关联表名
      mainTableRelatedFields: "", //主表关联字段
      partTableRelatedFields: "", //附表关联字段
      selectFields: [], //选择的字段
      selectFields1: [], //行融合选择的字段
      addFuseFields: [], //主表的字段
      partFuseFields: [], //附表的字段
      tableId: "", //主表id
      mainTableId: "",
      tableMinName: "", //主表名称
      partTable: "", //选择的附表
      partTableData: [], //附表
      partTableId: "", //附表id
      otherTableId: "",
      tablepartName: "",
      fieldsArrayType: "", //表字段添加位置

      //  清洗列表添加查询条件；
      cleanAddobj: {
        sourceTable: "",
        dataSourceId: "",
        syncTableType: "",
        currentPage: 1,
        pageSize: 10
      },
      cleanAddobjPart: {
        sourceTable: "",
        dataSourceId: "",
        syncTableType: "",
        currentPage: 1,
        pageSize: 10
      },
      cleanwordsHead: [
        {
          prop: "sourceTable",
          label: "数据库表名"
        },
        {
          prop: "sourceTableMame",
          label: "描述"
        },
        {
          prop: "syncTableType",
          label: "表分类"
        }
      ],
      fuseHeadWord: [
        {
          prop: "targetField",
          label: "英文名"
        },
        {
          prop: "targetFieldName",
          label: "中文名"
        }
      ],
      operate: [
        {
          type: 2,
          text: "删除"
        }
      ],
      operate1: [
        {
          type: 1,
          text: "关联字段"
        }
      ],
      wordsheaderData: [
        {
          prop: "fieldType",
          label: "英文名"
        },
        {
          prop: "targetFieldName",
          label: "中文名"
        }
      ],
      fuseWordTblData: [],
      addFormRules: {
        //  celueName: "",
        // celuezwName: ""
        celueName: [
          { required: true, message: "请输入融合名称", trigger: "blur" }
        ],
        celuezwName: [
          { required: true, message: "请输入融合表中文名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted: function() {
    var fId = this.$route.query.id;
    api.findByHangFuseStrategyId({ fuseStrategyId: fId }).then(res => {
      if (res.code == "code_200") {
        console.log("resssssssssssss", res.data);
        this.addForm.celueName = res.data.fuseName;
        this.addForm.celuezwName = res.data.fuseTargetTableName;
        res.data.listSyncTable.forEach(item => {
          switch (parseInt(item.syncTableType)) {
            case 2:
              item.syncTableType = "采集目标";
              break;
            case 3:
              item.syncTableType = "清洗目标";
              break;
            case 4:
              item.syncTableType = "融合目标";
              break;
          }
        });
        this.dBTableData = res.data.listSyncTable;
      }
    });

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
          if (res.code === "code_200") {
            this.celueName = res.data.fuseName;
            this.celuezwName = res.data.fuseTargetTableName;
            this.cleantabels = res.data.fuseMainTable;
            this.fusePartName = res.data.fuseTable;
            this.valueZl = res.data.enableState;
            // this.addFuseFields =JSON.parse(res.data.fuseMainTable) ;  //主表的字段
            // this.partFuseFields =JSON.parse(res.data.fuseTable);  //附表的字段
            this.cleanwords = res.data.syncTableVoList;
            console.log("xxx", this.addFuseFields);
            // this.arrayConcat();
          }
        });
    }
  },
  methods: {
    checkDetail(row) {
      this.isfuseDetailShow = true;
      api
        .getAllWords({
          tableType: row.row.syncTableType,
          tableName: row.row.sourceTable
        })
        .then(res => {
          if (res.code == "code_200") {
            this.fuseWordTblData = res.data;
          }
        });
    },

    //向上移动
    moveUp(index, row) {
      var that = this;
      if (index > 0) {
        let upDate = that.cleanwords1[index - 1];
        that.cleanwords1.splice(index - 1, 1);
        that.cleanwords1.splice(index, 0, upDate);
      } else {
        this.$message({
          type: "warning",
          message: "已经是第一条，不可上移"
        });
      }
    },
    //向下移动
    moveDown(index, row) {
      var that = this;
      if (index + 1 === that.cleanwords1.length) {
        this.$message({
          type: "warning",
          message: "已经是最后一条，不可下移"
        });
      } else {
        let downDate = that.cleanwords1[index + 1];
        that.cleanwords1.splice(index + 1, 1);
        that.cleanwords1.splice(index, 0, downDate);
      }
    },
    //行融合选择
    fuseRow() {
      this.qingxiList = true;
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
      this.cleanAddobj.sourceTable = "";
      this.cleanAddobjPart.sourceTable = "";
      this.cleantabels = "";
      this.mainTableI = "";
      this.mainTableRelatedNam = "";
      this.tableMinName = "";
      this.currentPageMain = 1;
      this.radio = "";
      this.fuseWordData = [];
    },
    cancelPart() {
      this.qingxiWords = false;
      this.PartRadio = "";
      this.otherTableId = "";
      this.partTableRelatedName = "";
      this.partTableId = "";
      this.tablepartName = "";
      this.fusePartName = "";
      this.currentPagePart = 1;
      this.fuseWordData = [];
    },
    //融合添加主表选择；
    choiseCleanList() {
      //初始化数据
      this.fieldsArrayType = 1;
      this.addFuseFields = [];
      this.mainTableRelatedFields = "";
      this.qingxiList = true;
      //调用表类型，数据源接口；
      this.cleanListshow();
      //获取表类型和数据源；
      api.cleanAddtableType({ code: "TABLEINFO" }).then(res => {
        if (res.code === "code_200") {
          this.tableLeixing = res.data;
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
      api.cleanAddtableDB().then(res => {
        console.log(res.data);
        if (res.code === "code_200") {
          this.shujuyuan = res.data;
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
    },
    //融合主表获取；
    cleanListshow() {
      api.getFuseTable(this.cleanAddobj).then(res => {
        if (res.code === "code_200") {
          this.choisecleanTableData = res.data;
          this.totleNumMain = res.page.totalNumber;
          this.choisecleanTableData.forEach(e => {
            console.log(e.syncTableType);
            switch (e.syncTableType) {
              case "1":
                e.syncTableType = Common.tableType.AcquisitionSource;
                break;
              case "2":
                e.syncTableType = Common.tableType.AcquisitionTarget;
                break;
              case "3":
                e.syncTableType = Common.tableType.CleaningTarget;
                break;
              case "4":
                e.syncTableType = Common.tableType.FusionTarget;
                break;
              case "5":
                e.syncTableType = Common.tableType.DataqualityMonitor;
                break;
              case "6":
                e.syncTableType = Common.tableType.moduleTarget;
                break;
            }
          });
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
        this.cleanAddobj.syncTableType = "";
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
          tittle: "失败",
          message: "此表不能作为主表",
          type: "error",
          offset: 100,
          duration: this.$store.state.el_Duration
        });
        return;
      }
    },

    //删除字段
    handleClick(index, rows, type) {
      console.log(index, rows, type);
      switch (type) {
        case 2: //删除
          this.$confirm("是否删除？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            cancelButtonClass: "blue-btn",
            confirmButtonClass: "yellow-btn",
            type: "warning",
            center: true
          })
            .then(() => {
              rows.splice(index, 1);
            })
            .catch(err => {});
          break;
      }
      console.log(index, rows, type);
    },

    //选择行融合表确定；
    liebiaoSubmit() {
      this.cleanwords1 = this.selectFields1;
      this.qingxiList = false;
    },

    //行融合表增加确认；
    cleanAddSubmit() {
      this.$refs.addFormRules.validate(valid => {
        if (!valid) {
          this.$message({
            message: "请填写完整信息",
            type: "error"
          });
        } else {
          var arrList = this.cleanwords1;
          var paramasArr = [];
          arrList.forEach((item, index) => {
            paramasArr.push({
              [item.sourceTable]: index + 1
            });
          });
          api
            .addFuseStrategy({
              fuseName: this.addForm.celueName,
              fuseTargetTableName: this.addForm.celuezwName,
              fuseTables: paramasArr,
              fuseType: 1
            })
            .then(res => {
              if (res.code == "code_200") {
                this.$notify({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "fuseStrategy",
                  query: {
                    menuLink: this.$route.query.menuLink
                  }
                });
              } else {
                this.$notify({
                  message: res.msg,
                  type: "error"
                });
              }
            });
        }
      });
    },
    //返回
    goBack() {
      this.$router.push({
        path: "fuseStrategy",
        query: {
          menuLink: this.$route.query.menuLink
        }
      });
    },
    //选择的字段
    fieldsTableChange(row) {
      this.selectFields = row;
      console.log(row, "选中主表字段");
    },
    //行融合选择的字段
    fieldsTableChange1(row) {
      this.selectFields1 = row;
      console.log(row, "选中行融合字段");
    },

    //确认选中的字段
    submitFuseFields() {
      if (this.selectFields.length == 0) {
        this.$notify({
          message: "请选择字段",
          type: "error",
          offset: 100,
          duration: this.$store.state.el_Duration
        });
        return;
      }
      if (
        (this.fieldsArrayType == 1 && this.mainTableRelatedFields == "") ||
        (this.fieldsArrayType == 2 && this.partTableRelatedFields == "")
      ) {
        this.$notify({
          message: "请选择表关联字段",
          type: "error",
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
    //确认选中的行融合字段
    submitFuseFields1() {},

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

    //合并数数据
    arrayConcat() {
      //添加标识
      console.log("lalalal", this.addFuseFields);
      this.addFuseFields.forEach(item => {
        item.mainTableIdent = 1;
      });

      this.partFuseFields.forEach(item => {
        item.partTableIdent = 2;
      });
      console.log("la22222", this.addFuseFields);
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
      console.log(partDataList, "去重后的数据");
      return (this.cleanwords = partDataList);
    }
  },
  watch: {}
};
</script>
<style scoped lang="less">
@import "fuseStrategy-addHC.less";
.check-detail {
  display: inline-block;
  width: 50px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #009CFF;
  text-align: center;
  cursor: pointer;
  color: #616161;
  position: absolute;
  right: 30%;
  top: 31%;
}
</style>


