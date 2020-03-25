<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData" v-if="btn.save==1">新增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <!-- <label for class="yellow middle m-r-10">规则名称</label> -->
            <div class="input-tpm yellow-input new-input">
              <el-input v-model="jarName" placeholder="请输入规则名称"></el-input>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <!-- <label for class="yellow middle m-r-10">状态</label> -->
            <div class="input-tpm yellow-input new-input">
              <el-select v-model="statevoid" placeholder="请选择状态">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="Modelsearch()">查询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="reset()">重置</div>
        </div>
      </div>
      <!--列表-->
      <div class="table-container pag-position">
        <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <!--<el-button @click="handelClick(scope.row,1)" type="text" size="small" >查看</el-button>-->
              <el-button
                @click="handelClick(scope.row,1)"
                type="text"
                size="small"
                v-if="scope.row.state=='禁用'&&btn.enable==1 "
              >启用
              </el-button>
              <el-button
                @click="handelClick(scope.row,2)"
                type="text"
                size="small"
                v-if="scope.row.state=='启用'&&btn.prohibit==1 "
              >禁用
              </el-button>
              <!--<el-button @click="handelClick(scope.row,2)" type="text" size="small" v-if="scope.row.state=='禁用' ">编辑</el-button>-->
              <el-button
                @click="handelClick(scope.row,3)"
                type="text"
                size="small"
                v-if="scope.row.state=='禁用'&&btn.delete==1 "
              >删除
              </el-button>
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

    <!-- 添加 -->
    <Modal
      title="清洗规则-添加"
      v-model="auditeVisible"
      width="40%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form
        :model="params"
        label-width="100px"
        ref="addForm"
        class="applicatForm"
        :rules="rules"
      >
        <el-row>
          <el-col :span="24" class="input_label">
            <el-form-item label="规则名称" prop="cleaningName">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="params.cleaningName"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input">
            <el-form-item label="上传jar包" prop="fileUrl">
              <el-upload
                ref="upload"
                class="upload-demo"
                :action="fileUrl()"
                accept="jar"
                :on-change="handleChange"
                :file-list="fileList3"
                :multiple="false"
                :limit="1"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jar文件，且不超过2M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input_label">
            <el-form-item label="规则描述" prop="describes">
              <div class="input-tpm blue-input blue-textarea" id="textHeight">
                <i class="honer-left"></i>
                <el-input placeholder v-model="params.describes" type="textarea"></el-input>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="submitUpload">确 定</el-button>
        <el-button class="blue-btn" @click="cancleModel(1)">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import api from '../../api/bigData/daq/cleanRuleMange';
  import store from '../../store';

  var qs = require('qs');
  var token = sessionStorage['token'];

  export default {
    components: {},
    name: 'modelAudit',
    data() {
      //表单验证
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入有效信息'));
        } else {
          callback();
        }
      };
      return {
        titles: '清洗规则管理',
        jarName: '',
        statevoid: '',
        myHeaders: { Authorization: token },
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
            prop: 'cleaningName',
            label: '规则名称'
          },
          {
            prop: 'jarName',
            label: 'jar包'
          },
          {
            prop: 'state',
            label: '状态'
          },
          {
            prop: 'createDate',
            label: '创建时间'
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
          cleaningName: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 50,
              message: '规则名称字符长度最大为50',
              trigger: 'blur'
            }
          ],
          fileUrl: [{ validator: validatePass, trigger: 'blur' }],
          describes: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 100,
              message: '规则描述字符长度最大为100',
              trigger: 'blur'
            }
          ]
        },
        // 搜索状态
        statusList: [
          {
            id: 0,
            name: '启用中'
          },
          {
            id: 1,
            name: '启用'
          },
          {
            id: 2,
            name: '禁用'
          }
        ]
      };
    },
    mounted() {
      var self = this;
      self.getParams();
      self.init();
    },
    methods: {
      init() {
        var self = this;
        api
          .getAllCleanRole({
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            cleaningName: self.jarName,
            state: self.statevoid
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              self.totalNum = res.page.totalNumber;
              res.data.forEach(res => {
                switch (res.state) {
                  case '0':
                    res.state = '启用中';
                    break;
                  case '1':
                    res.state = '启用';
                    break;
                  case '2':
                    res.state = '禁用';
                    break;
                }
              });
              self.tableData = res.data;
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
        this.auditeVisible = true;
        this.fileList3 = [];
        this.params = {
          cleaningName: '',
          fileUrl: '',
          jarName: ''
        };
      },
      // 上传成功后的回调
      uploadSuccess(response, file, fileList) {
        console.log('上传文件', response);
      },
      // 上传错误
      uploadError(response, file, fileList) {
        console.log('上传失败，请重试！');
      },
      //  上传状态改变
      handleChange(file, fileList) {
        var self = this;
        var fileName = file.name.split('.');
        self.params.jarName = fileName[0];
        let event = this.event || window.event;
        file = event.target.files[0];
        let reader = new FileReader();
        //转base64
        reader.onload = function (e) {
          self.params.fileUrl = e.target.result; //将图片路径赋值给src
        };
        reader.readAsDataURL(file);

        //格式验证
        const extension = fileName[fileName.length - 1] === 'jar';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!extension) {
          this.$message({
            message: '上传文件只能是jar格式!',
            type: 'warning'
          });
          this.fileList3 = this.fileList3.slice(-1);
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小超出限制!',
            type: 'warning'
          });
          this.fileList3 = this.fileList3.slice(-1);
        }

        return extension;
      },
      //  超出限制拦截
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 1个文件，本次选择了 ${
            files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      beforeUpload(file) {
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
      //    上传url
      fileUrl: function () {
        var apis = sessionStorage.getItem('ApiUrl');
        var usls =
          apis +
          '/' +
          store.state.SERVICE.bigData.daq +
          '/CleaningJar/saveRecord';
        return usls;
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
        self.jarName = '';
        self.statevoid = '';
        this.init();
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
      // 操作
      handelClick(row, type) {
        var self = this;
        self.currentId = row.id;
        if (type == 6) {
          api.getOneCleanRole({ id: row.id })
            .then(res => {
              if (res.code == 'code_200') {
                switch (res.data.auditStatus) {
                  case '1':
                    res.data.auditStatus = '已通过';
                    break;
                  case '2':
                    res.data.auditStatus = '申请中';
                    break;
                  case '3':
                    res.data.auditStatus = '已拒绝';
                    break;
                }
                self.addForm = res.data;
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });
        }
        if (type == 7) {
          self.examineFormVisible = true;
          api.getOneCleanRole({ id: row.id })
            .then(res => {
              if (res.code == 'code_200') {
                switch (res.data.state) {
                  case '1':
                    res.data.state = '启用';
                    break;
                  case '2':
                    res.data.state = '禁用';
                    break;
                }
                self.params = res.data;
                self.fileList3[0].name = res.data.jarName + '.jar';
                self.fileList3[0].url = res.data.fileUrl;
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });
        }
        if (type == 1) {
          api.ableCleanRole(qs.stringify({ id: row.id }))
            .then(res => {
              if (res.code == 'code_200') {
                this.$notify({
                  type: 'success',
                  message: '启用成功!',
                  offset: 100
                });
                this.init();
              } else {
                this.$notify({
                  type: 'error',
                  message: res.msg,
                  offset: 100
                });
              }
            });
          // setTimeout(() => {
          //   this.init();
          // }, 500);
        }
        if (type == 2) {
          api.enAbleCleanRole(qs.stringify({ id: row.id }))
            .then(res => {
              if (res.code == 'code_200') {
                this.$notify({
                  type: 'success',
                  message: '禁用成功!',
                  offset: 100
                });
                this.init();
              } else {
                this.$notify({
                  type: 'error',
                  message: res.msg,
                  offset: 100
                });
              }
            });
        }
        if (type == 3) {
          //            self.auditeVisible=true;
          api.delCleanRole({ id: row.id })
            .then(res => {
              if (res.code == 'code_200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.init();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  @import "cleanRuleManage.less";
</style>


