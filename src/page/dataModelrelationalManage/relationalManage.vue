<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="title"></list-table-title>
      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="addUnition(scope.row,'1')"
                :id="qingxiDealbtn"
                v-if="Btn.findOne==1"
              >查看
              </el-button>
              <el-button
                type="text"
                size="medium"
                @click="addUnition(scope.row,'2')"
                :id="qingxiDealbtn"
                v-if="Btn.update==1"
              >设置关联关系
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event)"
          layout="prev, pager, next"
          :total="totleNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
        <!--添加关系-->
        <Modal
          title="模型关联关系-设置关联关系"
          v-model="addFormVisible"
          :closable="false"
          :mask-closable="false"
          width="40%"
        >
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-row>
              <el-col :span="10">
                <el-form-item label="模型名称">
                  <div class="input-tpm blue-input new-input">
                    <el-input v-model="formInline.mainModelname" :disabled="!isUnit"></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="模型属性描述">
                  <div class="input-tpm blue-input new-input">
                    <el-input v-model="formInline.mainModelpara" :disabled="!isUnit"></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <span class="add-child fr" @click="addFumodel()" v-if="isUnit">新增</span>
              </el-col>
            </el-row>
          </el-form>

          <div class="right-col" style="margin-top: -10px">
            <div class="table-container">
              <el-table :data="addformList" height="400">
                <el-table-column label="主模型属性">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.mKey"
                      @change="zhumodaldataChange"
                      :disabled="!isUnit"
                    >
                      <el-option
                        v-for="item in mainWordsdata"
                        :key="item.id"
                        :label="item.targetFieldName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="附模型名称">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.vModelId"
                      @change="fumodalChange($event,scope.row,scope.$index)"
                      :disabled="!isUnit"
                    >
                      <el-option
                        v-for="item in fuModaldata"
                        :key="item.id"
                        :label="item.name"
                        :value="item.modelId"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="附模型属性">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.vKey"
                      @change="fumodaldataChange"
                      :disabled="!isUnit"
                    >
                      <el-option
                        v-for="item in scope.row.fuWordsdata"
                        :key="item.id"
                        :label="item.targetFieldName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" v-if="isHandleShow" width="100" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="removeFumodel(scope.$index)"
                      id="qingxiDealbtn3"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="yellow-btn" type="primary" @click.native="addSubmit" v-if="isUnit">确 定</el-button>
            <el-button class="blue-btn" @click="addFormVisible=false">取 消</el-button>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import api from '../../api/bigData/daq/dataModel';
  import YjDialog from '../../components/YUNPackages/dialog/modal';

  export default {
    name: 'metaDataSource',
    data() {
      return {
        isHandleShow: false,
        titleName: '数据源',
        title: '模型关联管理',
        sourceIp: '',
        currentPage: 1,
        pageSize: 10,
        isVisible: false,
        modalVisible: true,
        tableData: [], // 表数据
        oldTableData: [], // 表数据
        totleNum: 1,
        totleNum1: 1,
        headerData: [
          {
            prop: 'name',
            label: '模型名称'
          },
          {
            prop: 'remark',
            label: '模型属性描述'
          },
          {
            prop: 'updateTime',
            label: '修改时间'
          }
        ],
        childHeaderData: [],
        childTableData: [],
        operateChild: [
          {
            type: '1',
            txt: '查看字段'
          }
        ],
        cname: '',
        ip: '',
        metaMainView: true, // 显示子页面
        checkFiled: false, // 表同步查看字段页面
        zxtb: false, // 执行同步
        mainDialog: false, // 新增查看编辑页面
        mainDisabled: false,
        mainDialogBtnType: '', // 1 新增 2 查看 3 编辑
        cleanrules: {
          strategyName: null,
          currentPage: 1,
          pageSize: 10
        },
        addFormVisible: false,
        stragtegyFormVisible: false,
        rowId: '',
        strategy_mc: '',
        addClean: '',
        dingshi: '',
        rowmsg: {},
        celueId: '',
        formInline: {
          mainModelname: '',
          mainModelpara: ''
        },
        formInline1: {
          mainModelname: '',
          mainModelpara: '',
          mainModelwords: ''
        },
        ifadd: false,
        addformList: [],
        //主字，附字，附字；
        mainWordsdata: [],
        fuModaldata: [],
        fuWordsdata: [],
        totals: 0,
        mainmodalId: '',
        fumodalId: '',
        wordsForm: {
          syncTableId: '',
          currentPage: 1,
          pageSize: 10
        },
        Mkey: '',
        Vkey: '',
        Vmodelid: '',
        qingxiDealbtn: 'qingxiDealbtn',
        target: {},
        idName: '',
        isUnit: true,
        Btn: {
          findOne: 0,
          update: 0
        }
      };
    },
    mounted() {
      this.$store.commit('showLoading', true);
      this.getclearstrategyList('list', 10, 1);
      sessionStorage.removeItem('params');
      //      this.getmodalWords(10);
      this.getfuseParams();
    },
    methods: {
      //按钮权限
      getfuseParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api
          .getBtnFusePower({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              res.data.forEach(item => {
                if (item.includes('findOne@GET')) {
                  self.Btn.findOne = 1;
                }
                if (item.includes('update@PUT')) {
                  self.Btn.update = 1;
                }
              });
            }
          });
      },
      //获取关联表list;
      getclearstrategyList(type, pageSize, current) {
        api.getModel(pageSize, current, {})
          .then(res => {
            if (res.code === 'code_200') {
              this.$store.commit('hideLoading', false);
              if (res.data) {
                res.data.forEach(res => {
                  res.updateTime = this.formatDate(res.updateTime);
                });
                this.totleNum1 = res.page.totalNumber;
                if (type == 'list') {
                  this.tableData = res.data;
                  this.totleNum = res.page.totalNumber;
                }
                if (type == 'add') {
                  this.fuModaldata = res.data;
                }
              } else {
                this.$notify({
                  tittle: '失败',
                  message: res.msg,
                  type: 'error',
                  offset: 100,
                  duration: this.$store.state.el_Duration
                });
              }
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
      checkclearstrategyList() {
        api.getModel(10, this.cleanrules.currentPage, {})
          .then(res => {
            if (res.code === 'code_200') {
              if (res.data) {
                res.data.forEach(res => {
                  res.updateTime = this.formatDate(res.updateTime);
                });
                this.tableData = res.data;
                this.totleNum = res.page.totalNumber;
              } else {
                this.$notify({
                  tittle: '失败',
                  message: res.msg,
                  type: 'error',
                  offset: 100,
                  duration: this.$store.state.el_Duration
                });
              }
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
      //当前页；
      handleCurrentChange(e) {
        this.cleanrules.currentPage = e;
        this.checkclearstrategyList();
      },
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
      },
      finishDate(e) {
        //        console.log(e);
      },
      //模型关联show；
      addUnition(row, type) {
        if (type == 1) {
          this.isHandleShow = false;
        } else {
          this.isHandleShow = true;
        }
        this.addFormVisible = true;
        this.formInline.mainModelname = row.name;
        this.formInline.mainModelpara = row.remark;
        this.mainmodalId = row.modelId;
        this.isUnit = type == '1' ? false : true;
        //关联tableList;
        api.getmodalUnit({ Moid: this.mainmodalId })
          .then(res => {
            if (res.code === 'code_200') {
              console.log(res.data, 'ljljjl');
              if (res.data) {
                this.addformList = res.data;
                res.data.forEach((e, i) => {
                  this.getAttachedModel(e.vModelId, this.addformList[i]);
                });
                console.log('addformList', this.addformList);
                //关联tableList、

                //获取主模型属性list;
                this.getmodalWords();
                //获取附模型名称list;
                this.getclearstrategyList('add', this.totleNum, 1);
                //              res.data.forEach(e=>{
                //                this.getAttachedModel(e.vModelId);
                //            })
                //获取附模型属性list;
                //              this.getAttachedModel(this.fumodalId);
              } else {
                this.$notify({
                  tittle: '失败',
                  message: res.msg,
                  type: 'error',
                  offset: 100,
                  duration: this.$store.state.el_Duration
                });
              }
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
        //调三个接口，存值；
        //        this.getmodalWords(this.totleNum1);
      },
      //附模型选中；
      fumodalChange(e, row, index) {
        console.log('sel', e, row, index);
        this.fumodalId = e;
        this.getAttachedModel(e, row);
      },
      //主模型属性；
      zhumodaldataChange(e) {
        //        this.Mkey=e;
      },
      //附模型属性；
      fumodaldataChange(e) {
        //        this.Vkey=e;
        console.log('fufufuf', e);
      },
      //主模型list；
      getmodalWords() {
        this.wordsForm.syncTableId = this.mainmodalId;
        api.getAttachedModel({ id: this.mainmodalId })
          .then(res => {
            if (res.code === 'code_200') {
              if (res.data) {
                //              this.totleNum1=res.page.totalNumber;
                //              console.log(this.totleNum1,"字段总页数");
                this.mainWordsdata = res.data;
                //              this.getAttachedModel(this.fumodalId);
              } else {
                this.$notify({
                  tittle: '失败',
                  message: res.msg,
                  type: 'error',
                  offset: 100,
                  duration: this.$store.state.el_Duration
                });
              }
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
      //获取附模型属性；
      getAttachedModel(ids, item) {
        api.getAttachedModel({ id: ids })
          .then(res => {
            if (res.code === 'code_200') {
              console.log('888', res.data);
              item.fuWordsdata = res.data;
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
      //添加附模型；
      addFumodel() {
        this.ifadd = true;
        let m = {};
        m.mKey = '';
        m.vKey = '';
        m.wname = '';
        m.vModelId = '';
        m.fuWordsdata = [];
        //主模型属性list,附模型list,主模型属性list；
        this.addformList.push(m);
        console.log(this.addformList, '关联数据');
      },
      //模型关联删除；
      removeFumodel(index) {
        this.addformList.splice(index, 1);
      },
      //模型关联提交；
      addSubmit() {
        this.addformList.forEach(res => {
          delete res.index;
          delete res.createTime;
          delete res.mModelId;
          delete res.updateTime;
        });
        api
          .getrelationAdd({
            mModelId: this.mainmodalId,
            mapping: this.addformList
          })
          .then(res => {
            if (res.code === 'code_200') {
              this.addFormVisible = false;
              this.$notify({
                tittle: '关联关系添加成功!',
                message: '关联关系添加成功!',
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.getclearstrategyList('list', 10, 1);
              this.addformList.splice(0, this.addformList.length);
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
  };
</script>
<style lang="less" type="text/less">
  @import "./relationalManage.less";
</style>
