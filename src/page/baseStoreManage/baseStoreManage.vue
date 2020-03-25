<template>
  <!-- 基础库管理 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>

      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData">新 增</el-button>
        <div class="search-right fr">
          <div class="input-data fl m-l-10">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入基础库名称" v-model="statevoid"></el-input>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="searchData()">查 询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="resetSearch()">重 置</div>
        </div>
      </div>

      <div class="table-container pag-position">
        <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :width="item.width"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row,1)" type="text" size="small">查看</el-button>
              <el-button @click="handleClick(scope.row,2)" type="text" size="small">编辑</el-button>
              <el-button @click="handleClick(scope.row,3)" type="text" size="small">删除</el-button>
              <!--<el-button @click="handleClick(scope.row,4)" type="text" size="small">可视化配置</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
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
    </div>
    <!-- 3 -->
    <!-- 新增基础库 -->
    <Modal
      title="新增基础库"
      v-model="addBaseView"
      width="35%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form
        :model="form"
        label-width="100px"
        :rules="addFormRules"
        ref="addFormRules"
        class="applicatForm"
      >
        <el-row>
          <el-col :span="24" class="input_label">
            <el-form-item label="名称" prop="storeName">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder="请输入基础库名称" v-model="form.storeName"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple dataSouRemarks">
              <el-form-item label="描述" prop="storeDes">
                <div class="input-tpm blue-input blue-textarea" id="textHeight">
                  <!-- <i class="honer-left"></i> -->
                  <el-input type="textarea" :autosize="{ minRows: 4}" v-model="form.storeDes"></el-input>
                  <!-- <i class="honer-right"></i> -->
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" type="primary" @click.native="submit">确 定</el-button>
        <el-button class="blue-btn" @click="resetModel">重 置</el-button>
        <el-button class="yellow-btn" @click="cancleModal(1)">取 消</el-button>
      </div>
    </Modal>

    <!-- 查看 编辑基础库 -->
    <Modal
      width="35%"
      :title="thisTitle"
      v-model="baseStoreView"
      :closable="false"
      :mask-closable="false"
    >
      <el-form label-width="100px" :rules="addFormRules" ref="addFormRules" :model="form">
        <el-form-item label="名称" prop="storeName">
          <div class="input-tpm blue-input new-input">
            <!-- <i class="honer-left"></i> -->
            <el-input placeholder v-model="form.storeName" :disabled="isDisabled"></el-input>
            <!-- <i class="honer-right"></i> -->
          </div>
        </el-form-item>

        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple dataSouRemarks">
              <el-form-item label="描述" prop="storeDes">
                <div class="input-tpm blue-input blue-textarea" id="textHeight">
                  <!-- <i class="honer-left"></i> -->
                  <el-input
                    placeholder
                    type="textarea"
                    v-model="form.storeDes"
                    :disabled="isDisabled"
                    :autosize="{ minRows: 4}"
                  ></el-input>
                  <!-- <i class="honer-right"></i> -->
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
        <el-button class="blue-btn" type="primary" v-if="btnType == 2" @click="closeModal()">关闭</el-button>
        <el-button
          class="blue-btn"
          type="primary"
          v-if="btnType == 3"
          @click.native="modifyBaseStore"
        >确 定
        </el-button>
        <el-button class="blue-btn" v-if="btnType == 3" @click="resetModel()">重 置</el-button>
        <el-button class="yellow-btn" v-if="btnType == 3" @click="cancleModal(2)">取 消</el-button>
      </div>
    </Modal>

    <!-- 可视化配置 -->
    <Modal
      v-model="visualConfigView"
      width="35%"
      title="可视化配置"
      :closable="false"
      :mask-closable="false"
    >
      <div class="search-section clearfix" style="margin-top: 0px">
        <el-row>
          <el-col :span="9">
            <div class="input-tpm blue-input new-input">
              <el-input placeholder="请输入页签名称" v-model="iptTabsName"></el-input>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="input-tpm blue-input new-input">
              <el-input placeholder="请输入页面显示位置" v-model="iptShowPosition"></el-input>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="add-btn fl yellow new-btn" @click="addToVisualTbl">添 加</div>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-row>
          <el-col style="margin-top: 5px">
            <el-table width="100%" :data="visualData" height="230">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column
                v-for="item in visualHeader"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
              ></el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <div>
                    <span
                      :data-index="scope.$index"
                      @click="delThisRow(scope.$index)"
                      class="move-btn yellow"
                    >删除</span>
                    <span
                      :data-index="scope.$index"
                      @click="turnTop(scope.$index)"
                      v-if="scope.$index!=0"
                      class="move-btn yellow"
                    >上移</span>
                    <span
                      :data-index="scope.$index"
                      @click="turnBottom(scope.$index)"
                      v-if="scope.$index!=visualData.length-1"
                      class="move-btn yellow"
                    >下移</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" type="primary" @click.native="submitVisual">确 定</el-button>
        <el-button class="yellow-btn" @click="cancleModal(3)">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../api/bigData/daq/baseStoreManage';
  import store from '../../store';

  var qs = require('qs');
  var token = sessionStorage['token'];
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入有效信息'));
        } else {
          callback();
        }
      };
      return {
        titles: '基础库管理',
        thisTitle: '',
        jarName: '',
        statevoid: '',
        // myHeaders:{Authorization: token},
        form: {
          storeName: '',
          storeDes: ''
        },
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        headerData: [
          {
            prop: 'name',
            label: '库名称'
          },
          {
            prop: 'describe',
            label: '描述',
            width: '700%'
          }
        ],
        //按钮判断
        btn: {
          save: 0,
          enable: 0,
          delete: 0,
          prohibit: 0
        },
        // 验证
        addFormRules: {
          // storeName: [
          //   { required: true, message: "请输入基础库名称", trigger: "blur" }
          // ],
          // storeDes: [
          //   { required: true, message: "请输入基础库描述", trigger: "blur" }
          // ]
          storeName: [{ validator: validatePass, trigger: 'blur' }],
          storeDes: [{ validator: validatePass, trigger: 'blur' }]
        },
        // 搜索状态
        statusList: [],
        isDisabled: false,
        addBaseView: false,
        baseStoreView: false,

        btnType: '', // 1.新增 2.查看 3.编辑
        visualConfigView: false,
        visualData: [],
        visualHeader: [
          {
            prop: 'pageName',
            label: '页签'
          },
          {
            prop: 'pageurl',
            label: '页面显示位置'
          }
        ],
        iptTabsName: '',
        iptShowPosition: '',
        configBaseStoId: '',
        storeId: '',
        configTitle: ''
      };
    },
    mounted() {
      var self = this;
      self.$store.commit('showLoading', true);
      self.init();
    },
    methods: {
      init() {
        var self = this;
        api
          .selectAllBaseLibrary({
            name: self.statevoid,
            pageSize: self.pageSize,
            currentPage: self.currentPage
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              self.tableData = res.data;
              self.totalNum = res.page.totalNumber;

            }
          }, err => {
            self.$store.commit('hideLoading', false);
          });
      },
      // 新增
      addData() {
        // var obj = this.form;
        this.addBaseView = true;
        for (var i in this.form) {
          this.form[i] = '';
        }
      },
      submit() {
        var self = this;
        self.$refs.addFormRules.validate(valid => {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '请填写完整信息',
              customClass: 'zIndex'
            });
            return false;
          } else {
            api
              .insertBaseLibrary({
                describe: self.form.storeDes,
                name: self.form.storeName
              })
              .then(res => {
                if (res.code == 'code_200') {
                  self.addBaseView = false;
                  self.init();
                  self.$notify({
                    tittle: '添加成功!',
                    message: '添加成功!',
                    type: 'success',
                    offset: 100,
                    duration: self.$store.state.el_Duration
                  });
                  // self.$router.push({
                  //   path: "baseStoreManage"
                  // });
                } else {
                  self.$notify({
                    tittle: '添加失败',
                    message: res.msg,
                    type: 'error',
                    offset: 100,
                    duration: self.$store.state.el_Duration
                  });
                }
              });
          }
        });
      },
      modifyBaseStore() {
        var self = this;

        self.$refs.addFormRules.validate(valid => {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '请填写完整信息',
              customClass: 'zIndex'
            });
            return false;
          } else {
            api
              .updateBaseLibrary({
                describe: self.form.storeDes,
                name: self.form.storeName,
                id: self.storeId
              })
              .then(res => {
                if (res.code == 'code_200') {
                  self.baseStoreView = false;
                  this.$notify({
                    // tittle: "修改成功!",
                    message: '修改成功!',
                    type: 'success'
                    // offset: 100,
                    // duration: this.$store.state.el_Duration
                  });
                  self.init();
                } else {
                  this.$notify({
                    tittle: '修改失败',
                    message: res.msg,
                    type: 'error',
                    offset: 100,
                    duration: this.$store.state.el_Duration
                  });
                }
              });
          }
        });
      },
      // 搜索
      searchData() {
        this.init();
      },
      // 重置搜索
      resetSearch() {
        this.statevoid = '';
        this.init();
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.init();
      },

      // 关闭弹框
      closeModal() {
        this.baseStoreView = false;
      },
      // 取消弹框
      cancleModal(type) {
        var self = this;
        for (const obj in self.form) {
          self.form[obj] = '';
        }
        if (type == 1) {
          self.addBaseView = false;
          self.$refs.addFormRules.resetFields();
        }
        if (type == 2) {
          self.baseStoreView = false;
          self.$refs.addFormRules.resetFields();
        }
        if (type == 3) {
          self.visualConfigView = false;
        }
      },
      // 重置
      resetModel() {
        var self = this;
        var obj = this.form;
        for (var i in obj) {
          obj[i] = '';
        }
        self.$refs.addFormRules.resetFields();
      },
      selectBaseLibraryKey(id) {
        var self = this;
        api.selectBaseLibraryKey({ id: id })
          .then(res => {
            if (res.code == 'code_200') {
              self.form.storeName = res.data.name;
              self.form.storeDes = res.data.describe;
            }
          });
      },
      handleClick(row, type) {
        var self = this;
        // self.currentId = row.id;
        if (type == 1) {
          // 查看
          self.thisTitle = '查看基础库';
          self.selectBaseLibraryKey(row.id);

          self.baseStoreView = true;
          self.btnType = 2;
          self.isDisabled = true;
        }
        if (type == 2) {
          // 编辑
          self.thisTitle = '编辑基础库';
          self.selectBaseLibraryKey(row.id);
          self.storeId = row.id;

          self.baseStoreView = true;
          self.isDisabled = false;
          self.btnType = 3;
          /**/
        }
        if (type == 3) {
          // 删除
          self.deleteBaseLibrary(row.id);
        }
        if (type == 4) {
          // 可视化配置
          self.visualConfigView = true;
          self.configBaseStoId = row.id;
          self.configTitle = row.name;
          api.findBaseLibraryConfig({ baselibraryID: row.id })
            .then(res => {
              if (res.code == 'code_200') {
                self.visualData = res.data.RIGHT;
              }
            });
        }
      },

      deleteBaseLibrary(id) {
        console.log(id);
        this.$confirm('确定要删除选中的基础库吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn',
          confirmButtonClass: 'yellow-btn',
          type: 'warning',
          center: true
        })
          .then(() => {
            api.deleteBaseLibrary({ id: id })
              .then(res => {
                if (res.code === 'code_200') {
                  console.log(res.data);
                  this.$notify({
                    tittle: '删除成功!',
                    message: '删除成功!',
                    type: 'success',
                    offset: 100,
                    duration: this.$store.state.el_Duration
                  });
                  this.init();
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
          })
          .catch(() => {
          });
      },
      addToVisualTbl() {
        var self = this;
        if (self.iptTabsName && self.iptShowPosition) {
          self.visualData.push({
            pageName: self.iptTabsName,
            pageurl: self.iptShowPosition
          });
          self.iptTabsName = '';
          self.iptShowPosition = '';
        } else {
          self.$message({
            type: 'error',
            message: '请输入完整信息',
            customClass: 'zIndex'
          });
        }
      },
      turnTop(index) {
        // 上移
        if (index == 0) {
          return;
        }
        this.visualData.push(this.visualData.shift());
      },
      delThisRow(index) {
        // 删除该行
        this.visualData.splice(index, 1);
      },
      turnBottom(index) {
        // 下移
        if (index == this.visualData.length - 1) {
          return;
        }
        this.visualData.unshift(this.visualData.pop());
      },
      // 提交可视化配置
      submitVisual() {
        var self = this;
        var arrList = self.visualData;

        if (arrList.length != 0) {
          var configList = [];
          for (var i = 0; i < arrList.length; i++) {
            configList.push({
              baselibraryID: self.configBaseStoId,
              pageName: arrList[i].pageName,
              pageurl: arrList[i].pageurl,
              serialNumber: i + 1
            });
          }
          api
            .insertBaseLibraryConfig(configList)
            .then(res => {
              if (res.code == 'code_200') {
                self.visualConfigView = false;
                self.$notify({
                  type: 'success',
                  message: '配置成功'
                });
              } else {
                self.$notify({
                  type: 'error',
                  message: res.msg
                });
              }
            })
            .catch(res => {
              self.$notify({
                type: 'error',
                message: res.msg
              });
            });
        } else {
          self.$message({
            type: 'error',
            message: '可视化配置信息不能为空',
            customClass: 'zIndex'
          });
        }
      }
    }
  };
</script>

<style lang="less" type="text/less">
  @import "./baseStoreManage.less";

  .zIndex {
    z-index: 3000 !important;
  }
</style>


