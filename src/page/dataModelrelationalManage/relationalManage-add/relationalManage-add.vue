<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <el-row>
        <el-col :span="21">
          <div class="grid-content ">
            <!--列表标题-->
            <list-table-title v-bind:title="titles" v-bind:isBack="false" v-show="showType==0"></list-table-title>
            <list-table-title v-bind:title="titles1" v-bind:isBack="false" v-show="showType==1"></list-table-title>
            <list-table-title v-bind:title="titles2" v-bind:isBack="false" v-show="showType==2"></list-table-title>
            <!--搜索-->
            <div class="search-template">
              <el-row>
                <el-col :span="18" :offset="3">
                  <div class="input-group ">
                    <span class="xuhao">01</span>
                    <label for="" class=" middle m-r-10 clean_mc">/ 数据模型关联主表</label>
                    <div class="input-tpm blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" v-model="zhutabels" class="clean_input"></el-input>
                      <i class="honer-right"></i>
                    </div>
                    <el-button v-show="showType==0||showType==1" class="blue-btn  fl  choisetab" type="primary"
                               @click="choiseCleanLists()">选择
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="18" :offset="3">
                  <div class="input-group ">
                    <span class="xuhao">02</span>
                    <label for="" class=" middle m-r-10 clean_mc">/ 数据模型关联主表字段</label>
                    <div class="input-tpm blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" v-model="zhuTbalessWords" class="clean_input"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="18" :offset="3">
                  <div class="input-group ">
                    <span class="xuhao">03</span>
                    <label for="" class=" middle m-r-10  clean_mc">/数据模型关联附表</label>
                    <div class="input-tpm blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" v-model="cleantabels" class="clean_input"></el-input>
                      <i class="honer-right"></i>
                    </div>
                    <el-button class="blue-btn  fl  choisetab choisetab1 " type="primary"
                               @click="chiosecleanWords()"  v-show="showType==0||showType==1">选择
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="18" :offset="3">
                  <div class="input-group ">
                    <span class="xuhao">04</span>
                    <label for="" class=" middle m-r-10 clean_mc">/ 数据模型关联附表字段</label>
                    <div class="input-tpm blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" v-model="unitfubiaoWords" class="clean_input"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="fuseBtn" v-show="!this.qingxiWords">
              <el-button    class="yellow-btn" @click="cleanAddSubmit()"  v-show="showType==0||showType==1" >保存</el-button>
              <el-button    class="blue-btn" @click="goBack()">返回</el-button>
            </div>
            <!--融合机制-主表-->
            <yj-dialog title="关联关系-列表" :visible.sync="qingxiList" class="cha" width="55%" :close-on-click-modal="false">
              <div class="table-container   addtable-container">
                <div class="search-section clearfix">
                  <div class="search-right">
                    <div class="input-data  fl">
                      <div class="input-data">
                        <label class="yellow middle  fl">表名:  </label>
                        <div class="input-tpm yellow-input">
                          <i class="honer-left"></i>
                          <el-input v-model="biaochiosaddSearch"></el-input>
                          <i class="honer-right"></i>
                        </div>
                      </div>
                    </div>
                    <div class="add-btn fl yellow m-l-10" @click="checkMetaData()">
                      查询
                    </div>
                  </div>
                </div>
                <el-table
                  :data="choisecleanTableData"
                  style="width: 100%">
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-radio @change.native="getCurrentRow(scope,scope.$index)" :label="scope.$index"
                                v-model="radio">
                        &nbsp;
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="item in headerData"
                    :label="item.label"
                    :prop="item.prop"
                    :key="item.id">
                  </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="choisecleanTableData.length!=0"
                               :current-page="currentPage"
                               :page-size="pageSize"
                               @size-change="handleSizeChange"
                               @current-change="mainhandleCurrentChange"
                               layout="prev, pager, next"
                               :total="maintabTotleNum"
                               prev-text="上一页"
                               next-text="下一页">
                </el-pagination>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="yellow-btn" type="primary" @click="liebiaoSubmit()">确 定</el-button>
                <el-button class="blue-btn" @click="qingxiList = false">取 消</el-button>
              </div>
            </yj-dialog>
            <!--融合机制-附表-->
            <yj-dialog title="关联关系-附表" :visible.sync="qingxiWords" class="cha" :close-on-click-modal="false">
              <div class="table-container   addtable-container">
                <div class="search-section clearfix">
                  <div class="search-right">
                    <div class="input-data  fr">
                    </div>
                  </div>
                </div>
                <!--@select="partFieldsChange"-->
                <el-table
                  :data="choisecleanwrodsTableData"
                  stripe
                  style="width: 100%">
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-radio @change.native="partFieldsChange(scope,scope.$index)" :label="scope.$index"
                                v-model="radio">
                        &nbsp;
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="item in  headerData"
                    :label="item.label"
                    :prop="item.prop"
                    :key="item.id">
                  </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="choisecleanwrodsTableData.length!=0"
                               :current-page="currentPage"
                               :page-size="pageSize"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               layout="prev, pager, next"
                               :total="futabTotleNum"
                               prev-text="上一页"
                               next-text="下一页">
                </el-pagination>
              </div>

              <div slot="footer" class="dialog-footer">
                <el-button class="yellow-btn" type="primary" @click="partTableSubmit()">确 定</el-button>
                <el-button class="blue-btn" @click="qingxiWords = false">取 消</el-button>
              </div>
            </yj-dialog>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
          </div>
        </el-col>
      </el-row>
      <!--选择字段右侧弹框-->
      <div class="fuseFields" v-show="isShowFieldsDialog">
        <div class="table-container selectWordDialog">
          <el-row>
            <el-col>
              <!--@selection-change="fieldsTableChange"-->
              <el-table
                :data="fuseWordData"
                stripe
                style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <el-radio @change.native="fieldsTableChange(scope,scope.$index)" :label="scope.$index"
                              v-model="radio">
                      &nbsp;
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="item in fuseHeadWord"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id">
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
    </div>

  </div>
</template>
<script>
  /* eslint-disable */
  import api from '../../../api/bigData/daq/dataModel';
  export default {
    components: {},
    data() {
      return {
        titles: "模型关联关系-设置关联关系",
        titles1: "模型关联关系-编辑",
        titles2: "模型关联关系-查看",
        valueZl: '',
        radio: '',
        msg: {},
        fuseWordData: [],
        options: [
          {
            value: '1',
            label: '是'
          }, {
            value: '2',
            label: '否'
          }],
        options1: [
          {
            value: '1',
            label: '是'
          }, {
            value: '2',
            label: '否'
          }],
        options2: [
          {
            value: '1',
            label: '是'
          }, {
            value: '2',
            label: '否'
          }],
        SourceArr: [
          {
            value: '1',
            label: '行政审批系统'
          }, {
            value: '2',
            label: '一体化平台用表'
          }
        ],
        headerData: [  // 表头数据
          {
            prop: 'name',
            label: '数据库表名',
          },
          {
            prop: 'remark',
            label: '描述',
          },
          {
            prop: 'state',
            label: '表分类 ',
          }
        ],
        valueType: '采集源',
        isShowFieldsDialog: false,//字段弹框
        valueSource: 'MYSQL',
        valueSourceid: '',
        isShowTime: false,
        keyDefault: '否',
        celueName: '',
        tacticsName: '',
        tableName: '',
        TimingRule: '',
        dataSource: '',
        isTiming: '',
        tableData: [],
        // cleantabels: '',
        cleanwords: [],
        qingxiList: false,
        choisecleanTableData: [],
        biaochiosaddSearch: '',
        biaochiosSearch: '',
        qingxiWords: false,
        choisecleanwrodsTableData: [],
        showType: "",
        // tableLeixing: [],
        // shujuyuan: [],
        currentPage: 1,
        pageSize: 10,
        totleNum: 1,
        maintabTotleNum:1,
        futabTotleNum:1,
        handleSizeChange: '',
        addFuseFields: [],  //主表的字段
        partFuseFields: [],  //附表的字段
        tableId: '',  //主表id
        partTable: '',  //选择的附表
        partTableData: [],//附表
        partTableId: [],  //附表id
        //  清洗列表添加查询条件；
        cleanAddobj: {
          // params:'',
          idNotIn:'',
          currentPage: 1,
          pageSize: 10
        },
        fuseHeadWord: [
          {
            prop: 'targetField',
            label: '英文名',
          },
          {
            prop: 'targetFieldName',
            label: '中文名',
          },
        ],
        operate: [
          {
            type: 2,
            text: "删除",
          },
        ],
        wordsheaderData: [
          {
            prop: 'fieldType',
            label: '英文名',
          },
          {
            prop: 'targetFieldName',
            label: '中文名',
          },
        ],
        zhutabels:'',
        zhuTbalessWords:'',
        cleantabels:"",
        cleantabelsId:"",
        unitfubiaoWords:"",
        units:{
          "mModelId":"",
          "mKey":"",
          "vModelId":"",
          "vKey":""
        },
        unitshowMsg:"",
        iftable:"",
      }
    },
    mounted: function () {
      this.showType = this.$route.query.type;
      //list的ID;
      this.unitshowMsg=sessionStorage.getItem('params');
      if(this.showType=="1")
      {
        this.checkMsg();
      }
      if(this.showType=="2")
      {
        this.checkMsg();
      }
    },
    methods: {
      //联合添加主表选择；
      choiseCleanLists() {
        this.qingxiList = true;
        //主表；
        this.cleanListshow();
      },
      //查看；
      checkMsg(){
        this.unitshowMsg=this.unitshowMsg+"";
        api.getrelationshow({"id":this.unitshowMsg}).then(res => {
          if (res.code === 'code_200') {
            this.zhutabels=res.data.mModelId;//主表id
            this.zhuTbalessWords=res.data.mKey;//主表字段英文名称
            this.cleantabels=res.data.vModelId;//附表id
            this.unitfubiaoWords=res.data.vKey;//附表字段英文名称
          }
          else {
            this.$notify({
              tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
            });
          }
        })
      },
      //联合主表获取；
      cleanListshow() {
        api.getModel(this.cleanAddobj).then(res => {
          if (res.code === 'code_200') {
            this.choisecleanTableData = res.data;
            this.maintabTotleNum=res.page.totalNumber;
          }
          else {
            this.$notify({
              tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
            });
          }
        })
      },
      //主表翻页；
      mainhandleCurrentChange(e)
      {
        this.cleanAddobj.currentPage=e;
        this.cleanListshow();
      },
      //主表查询；
      checkMetaData()
      {
        this.cleanAddobj.idNotIn = this.biaochiosaddSearch;
        this.cleanListshow();
      },
      //选中的主表；
      getCurrentRow(row, val)
      {
        this.tableId = row.row.modelId;
        this.zhutabels = row.row.name;
      },
      //主表字段list；
      liebiaoSubmit()
      {
          this.qingxiList = false;
          this.biaochiosaddSearch="";//确定后，查询条件清空；
          api.choiseCleanWords({
            "syncTableId": this.tableId
          }).then(res => {
            if (res.code === 'code_200') {
              this.isShowFieldsDialog = true;
              this.fuseWordData = res.data;
            }
            else {
              this.$notify({
                tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
              });
            }
          });
      },
      //字段选中；
      fieldsTableChange(row,index) {
        if(this.iftable=="1")
        {
          this.unitfubiaoWords=row.row.targetField;
        }
        else
        {
          this.zhuTbalessWords=row.row.targetField;
        }
      },
      //确认选中主表的字段
      submitFuseFields() {
          this.isShowFieldsDialog = false;

            if(this.iftable=="")
            {
              if(this.fuseWordData.length<=1)
              {
              this.zhuTbalessWords=this.fuseWordData[0].targetField;
              }
            }
            else
            {
              if(this.fuseWordData.length<=1)
              {
                this.unitfubiaoWords = this.fuseWordData[0].targetField;
              }
            }
      },
      //附表list;
      chiosecleanWords()
      {
        this.cleanAddobj.mainId=this.tableId;
        if (!this.tableId)
        {
          this.$notify({
            tittle: '失败', message: '请选择主表', type: 'error', offset: 100, duration: this.$store.state.el_Duration
          });
        }
        else {
          this.qingxiWords = true;
          this.isShowFieldsDialog = false;
          this.fubiaoList();
        }
      },
      //附表list;
      fubiaoList(){
        api.getModel(this.cleanAddobj).then(res => {
          if (res.code === 'code_200') {
            this.choisecleanwrodsTableData = res.data;
            this.futabTotleNum=res.page.totalNumber;
          }
          else {
            this.$notify({
              tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
            });
          }
        })
      },
      //附表翻页；
      handleCurrentChange(e)
      {
        this.cleanAddobj.currentPage=e;
        this.cleanAddobj.mainId=this.tableId;
        this.fubiaoList();
      },
      //选择附表
      partFieldsChange(scope,index) {
          if (scope.row.modelId == this.tableId)
          {
            this.$notify({
              tittle: '失败', message: '此表不能作为附表', type: 'error', offset: 100, duration: this.$store.state.el_Duration
            });
          }
          else {
            //获取附表的id和名称；
             this.cleantabels=scope.row.name;
             this.cleantabelsId=scope.row.modelId;
             this.iftable="1";
          }
      },
      //选择附表确认获取字段；
      partTableSubmit() {
        this.qingxiWords = false;
        this.isShowFieldsDialog=true;
        this.addPartClick();
      },
      //取消选择字段
      closeFieldsDialog() {
        this.isShowFieldsDialog = false;
      },
      //附表字段list
      addPartClick() {
        api.choiseCleanWords({
          "syncTableId":this.cleantabelsId
        }).then(res => {
          if (res.code === 'code_200') {
            this.isShowFieldsDialog = true;
            this.fuseWordData = res.data;
          }
          else {
            this.$notify({
              tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
            });
          }
        });
      },
      //联合增加确认；
      cleanAddSubmit() {
        if (this.zhutabels == ""||this.zhuTbalessWords == ""||this.cleantabels == ""||this.unitfubiaoWords == "")
        {
          this.$notify({
            tittle: '请完善联合表信息！', message:'请完善联合表信息！', type: 'success', offset: 100, duration: this.$store.state.el_Duration
          });
        }
        else {
          this.units.mModelId=this.zhutabels;//主表id
          this.units.mKey=this.zhuTbalessWords;//主表字段英文名称
          this.units.vModelId=this.cleantabels;//附表id
          this.units.vKey=this.unitfubiaoWords;//附表字段英文名称
          //新增；
          if(this.showType=="0")
          {
            api.getrelationAdd(this.units).then(res => {
              if (res.code === 'code_200') {
                this.$notify({
                  tittle: '添加成功', message: res.msg, type: 'success', offset: 100, duration: this.$store.state.el_Duration
                });
                this.$router.push({
                  path: '/daq/relationalManage',
                });
              }
              else {
                this.$notify({
                  tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
                });
              }
            });
          }
          //编辑
          if(this.showType=="1")
          {
            this.units.id=this.unitshowMsg;
            api.getrelationEdit(this.units).then(res => {
              if (res.code === 'code_200') {
                this.$notify({
                  tittle: '添加成功', message: res.msg, type: 'success', offset: 100, duration: this.$store.state.el_Duration
                });
                this.$router.push({
                  path: '/daq/relationalManage',
                });
              }
              else {
                this.$notify({
                  tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
                });
              }
            });
          }
        }
      },
      //返回
      goBack() {
        this.$router.push({
          path: '/daq/relationalManage',
        });
      }

    }
  }
</script>
<style scoped lang="less">
  @import "relationalManage-add.less";
</style>


