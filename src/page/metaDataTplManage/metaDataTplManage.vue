<template>
  <!-- 元数据模板管理 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!-- 1. -->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData">新 增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入模板名称" v-model="tplName"></el-input>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-tpm yellow-input new-input">
              <el-select v-model="statevoid" placeholder="请选择基础库">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="Modelsearch()">查 询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="reset()">重 置</div>
        </div>
      </div>
      <!-- 2 -->
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
              <!-- <el-button @click="handleClick(scope.row,3)" type="text" size="small">版本信息</el-button> -->
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
      <!-- 3 -->
    </div>
  </div>
</template>

<script>
  import api from '../../api/bigData/daq/metaDataTplManage';

  var qs = require('qs');
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
        titles: '元数据模板管理',
        tplName: '',
        metaDataName: '',
        statevoid: '',
        // myHeaders:{Authorization: token},
        params: {
          cleaningName: '',
          fileUrl: '',
          jarName: '',
          describes: ''
        },
        action: '',
        status: '',
        refusal: '',
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        headerData: [
          {
            prop: 'templateName',
            label: '模板名称'
          },
          {
            prop: 'templateDescription',
            label: '描述'
          },
          // {
          //   prop: "metadataMaintenanceIDS",
          //   label: "含元数据"
          // },
          {
            prop: 'baseLibraryName',
            label: '所属库'
          }
        ],
        fileList3: [{ name: '', url: '' }],
        examineFormVisible: false,
        auditeVisible: false,
        currentId: '',
        //按钮判断
        btn: {
          save: 0,
          enable: 0,
          delete: 0,
          prohibit: 0
        },
        addForm: {
          jarName: '',
          fileUrl: ''
        },
        // 验证
        rules: {
          cleaningName: [{ validator: validatePass, trigger: 'blur' }],
          fileUrl: [{ validator: validatePass, trigger: 'blur' }],
          describes: [{ validator: validatePass, trigger: 'blur' }]
        },
        // 搜索状态
        statusList: []
      };
    },
    mounted() {
      var self = this;
      self.$store.commit('showLoading', true);
      // self.getParams();
      self.init();
      self.selectAllBaseLibrary();
    },
    methods: {
      init() {
        var self = this;
        api
          .selectAllMetadataTemplate({
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            TemplateName: self.tplName,
            baseLibraryId: self.statevoid
          })
          .then(res => {
              if (res.code == 'code_200') {
                self.$store.commit('hideLoading', false);
                self.tableData = res.data;
                // self.totalNum = res.page.totalNumber;
              }
            },
            err => {
              self.$store.commit('hideLoading', false);
            });
      },
      //    查询基础库下拉
      selectAllBaseLibrary() {
        api
          .selectAllBaseLibrary({
            pageSize: 100000,
            currentPage: 1
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.statusList = res.data;
            }
          });
      },
      //按钮权限
      getParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api
          .getcleanRole({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              res.data.forEach(item => {
                if (item.includes('saveRecord@POST')) {
                  self.btn.save = 1;
                }
                if (item.includes('enable@PUT')) {
                  self.btn.enable = 1;
                }
                if (item.includes('prohibit@DELETE')) {
                  self.btn.prohibit = 1;
                }
                if (item.includes('delete@DELETE')) {
                  self.btn.delete = 1;
                }
              });
            }
          });
      },
      // 新增
      addData() {
        // this.addFormVisible = true;
        var self = this;
        self.$router.push({
          path: 'addMetaDataTpl',
          query: {
            type: 0,
            menuLink: this.$route.query.menuLink
          }
        });
      },

      //  提交
      submitUpload() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            api.AddCleanRole(this.params)
              .then(res => {
                if (res.code == 'code_200') {
                  this.$notify({
                    tittle: '成功',
                    message: res.msg,
                    type: 'success',
                    offset: 100,
                    duration: this.$store.state.el_Duration
                  });
                  this.auditeVisible = false;
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
          } else {
            this.$message({
              type: 'error',
              message: '请填写完整信息'
            });
            return false;
          }
        });

        //    this.$refs.upload.submit();
      },

      // 搜索
      Modelsearch() {
        this.init();
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.init();
      },
      // 重置
      reset() {
        var self = this;
        self.tplName = '';
        self.metaDataName = '';
        self.statevoid = '';
        self.init();
      },
      // 取消模型

      cancleModel(type) {
        var self = this;
        self.params = {
          cleaningName: '',
          fileUrl: '',
          jarName: ''
        };
        if (type == 1) {
          self.auditeVisible = false;
        }
        if (type == 2) {
          self.examineFormVisible = false;
        }
      },

      // 重置
      resetModel() {
        this.params.cleaningName = '';
        this.params.describes = '';
      },
      handleClick(row, type) {
        var self = this;
        self.currentId = row.id;
        if (type == 1) {
          self.$router.push({
            path: 'checkMetaDataTpl',
            query: {
              row: row
            }
          });
        }
        if (type == 2) {
          self.$router.push({
            path: 'modifyMetaDataTpl',
            query: {
              data: row
            }
          });
        }
        if (type == 3) {
          var id = row.id;
          // self.$confirm("确定要删除选中的元数据模板吗？", "提示", {
          //   confirmButtonText: "确定",
          //   cancelButtonText: "取消",
          //   cancelButtonClass: "blue-btn btn-custom-cancel",
          //   confirmButtonClass: "yellow-btn btn-custom-confirm", // 以上两个按钮添加btn-custom-XXX来控制按钮位置
          //   type: "warning",
          //   center: true
          // });
          this.deleteMetadataTemplate(id);
        }
        if (type == 2) {
        }
      },

      //    删除
      deleteMetadataTemplate(id) {
        this.$confirm('确定要删除选中的元数据模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn',
          confirmButtonClass: 'yellow-btn',
          type: 'warning',
          center: true
        })
          .then(() => {
            api.deleteMetadataTemplate({ id: id })
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
      }
    }
  };
</script>

<style>
</style>
