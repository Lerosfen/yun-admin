<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <div class="search-right fr">
          <div class="input-data fl">
            <label for class="yellow middle m-r-10">模型名称</label>
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder v-model="modelName"></el-input>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <label for class="yellow middle m-r-10">申请状态</label>
            <div class="input-tpm yellow-input new-input">
              <el-select v-model="auditStatus" placeholder="申请状态">
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
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                @click="handelClick(scope.row,1)"
                type="text"
                size="small"
                v-if="Btn.findOne==1"
              >查看
              </el-button>

              <el-button
                @click="handelClick(scope.row,2)"
                type="text"
                size="small"
                v-if="scope.row.auditStatus=='申请中'&&Btn.AuditStatus==1 "
              >通过
              </el-button>
              <el-button
                @click="handelClick(scope.row,3)"
                type="text"
                size="small"
                v-if="scope.row.auditStatus=='申请中'&&Btn.Refusal==1 "
              >拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
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
    <!--查看-->
    <Modal
      title="模型服务-查看"
      v-model="examineFormVisible"
      width="50%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form :model="addForm" label-width="100px" ref="addForm" class="applicatForm">
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="模型名称" prop="name">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.modelName" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="模型中文名称" prop="modelZwName">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.modelZwName" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="申请人部门" prop="name">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.deptName" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="联系方式" prop="name">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.tel" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="token" prop="token">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.token" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="input_label">
            <el-form-item label="状态" prop="name">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.auditStatus" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="申请时间" prop="name">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.creationTime" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="拒绝理由" prop="name">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.reasonsRefusal" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input">
            <el-form-item label="接口路径" prop="applyApplication">
              <div class="input-tpm blue-input blue-textarea textModel" style="border: 1px solid #009CFF;">
                <i class="honer-left"></i>
                <el-input placeholder v-model="addForm.url" :disabled="true"></el-input>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input">
            <el-form-item label="申请理由" prop="name">
              <div class="input-tpm blue-input blue-textarea modelHeight textModel">
                <i class="honer-left"></i>
                <el-input
                  placeholder
                  type="textarea"
                  :rows="4"
                  v-model="addForm.applyApplication"
                  :disabled="true"
                ></el-input>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="addForm.auditStatus=='已拒绝' ">
          <el-col :span="24" class="input">
            <el-form-item label="拒绝理由" prop="name">
              <div class="input-tpm blue-input blue-textarea modelHeight textModel">
                <i class="honer-left"></i>
                <el-input
                  placeholder
                  type="textarea"
                  :rows="4"
                  v-model="addForm.reasonsRefusal"
                  :disabled="true"
                ></el-input>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModel(1)">关 闭</el-button>
      </div>
    </Modal>
    <!-- 审核 -->
    <Modal
      title="模型服务-审核"
      v-model="auditeVisible"
      width="40%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form
        :model="ruleForm"
        label-width="100px"
        :rules="rules"
        ref="addForm"
        class="applicatForm"
      >
        <!-- <el-row >
                    <el-col :span="12" class="input_label">
                        <el-form-item label="审核结果" prop="name">
                             <div class="sel-group sel-blue fl ">
                                <i class="honer-left"></i>
                                <el-select v-model="status" placeholder="请选择" >
                                    <el-option label="通过"  value="1"></el-option>
                                    <el-option label="拒绝" value="2"></el-option>
                                </el-select>
                                <i class="honer-right"></i>
                                </div>
                        </el-form-item>
                    </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="24" class="input">
            <el-form-item label="拒绝理由" prop="refusal">
              <div class="input-tpm blue-input blue-textarea modelHeight textModel">
                <i class="honer-left"></i>
                <el-input placeholder type="textarea" :rows="4" v-model="refusal"></el-input>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="auditSbumit">确 定</el-button>
        <el-button class="blue-btn" @click="cancleModel(2)">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import api from '../../api/bigData/daq/modelService';

  var qs = require('qs');

  export default {
    components: {},
    name: 'modelAudit',
    data() {
      return {
        titles: '数据模型审核',
        modelName: '',
        auditStatus: '',
        status: '',
        refusal: '',
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        tableData: [
          {
            modelName: '111'
          }
        ],
        headerData: [
          {
            prop: 'modelName',
            label: '模型名称'
          },
          {
            prop: 'modelZwName',
            label: '模型中文名'
          },

          {
            prop: 'deptName',
            label: '申请人部门'
          },
          {
            prop: 'tel',
            label: '联系方式'
          },
          {
            prop: 'userName',
            label: '申请人'
          },
          {
            prop: 'auditStatus',
            label: '申请状态'
          },

          {
            prop: 'creationTime',
            label: '创建时间'
          },
          {
            prop: 'url',
            label: '接口路径'
          }
        ],
        examineFormVisible: false,
        auditeVisible: false,
        currentId: '',
        //按钮判断
        Btn: {
          findOne: 0,
          Refusal: 0,
          AuditStatus: 0
        },
        addForm: {},
        // 搜索状态
        statusList: [
          {
            id: 1,
            name: '已通过'
          },
          {
            id: 2,
            name: '申请中'
          },
          {
            id: 3,
            name: '已拒绝'
          }
        ],
        rules: {
          refusal: [
            { required: true, message: '请输入拒绝理由', trigger: 'blur' }
          ]
        },
        ruleForm: {
          refusal: ''
        }
      };
    },
    mounted() {
      var self = this;
      self.init();
      self.getfuseParams();
    },
    methods: {
      init() {
        var self = this;
        api
          .getApplyModel({
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            modelName: self.modelName,
            AuditStatus: self.auditStatus
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              self.totalNum = res.page.totalNumber;
              res.data.forEach(res => {
                switch (res.auditStatus) {
                  case '1':
                    res.auditStatus = '已通过';
                    break;
                  case '2':
                    res.auditStatus = '申请中';
                    break;
                  case '3':
                    res.auditStatus = '已拒绝';
                    break;
                }
              });
              self.tableData = res.data;
            }
          });
      },
      //按钮权限
      getfuseParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api
          .getBtnFusePower({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              console.log('btns', res.data);
              res.data.forEach(item => {
                if (item.includes('findOne@GET')) {
                  self.Btn.findOne = 1;
                }
                if (item.includes('Refusal@PUT')) {
                  self.Btn.Refusal = 1;
                }
                if (item.includes('AuditStatus@PUT')) {
                  self.Btn.AuditStatus = 1;
                }
              });
            }
          });
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
        self.modelName = '';
        self.auditStatus = '';
        this.init();
      },
      // 取消模型
      cancleModel(type) {
        var self = this;
        self.addForm = {
          modelName: '',
          deptName: '',
          tel: '',
          applyApplication: ''
        };
        if (type == 1) {
          self.examineFormVisible = false;
        }
        if (type == 2) {
          self.auditeVisible = false;
        }
      },
      // 操作
      handelClick(row, type) {
        var self = this;
        self.currentId = row.id;
        if (type == 1) {
          self.examineFormVisible = true;
          api.getApplyModelById({ id: row.id })
            .then(res => {
              console.log('detailll', res.data);
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
        if (type == 2) {
          api.auditApply(qs.stringify({ id: row.id }))
            .then(res => {
              console.log('tongguo');
              if (res.code == 'code_200') {
                this.$message({
                  type: 'success',
                  message: '审核成功!'
                });
                self.init();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });
        }
        if (type == 3) {
          self.auditeVisible = true;
        }
      },
      auditSbumit() {
        var self = this;
        api
          .auditRefuse(
            qs.stringify({ id: self.currentId, ReasonsRefusal: self.refusal })
          )
          .then(res => {
            console.log('jujue');
            if (res.code == 'code_200') {
              this.$message({
                type: 'success',
                message: '审核成功!'
              });
              self.auditeVisible = false;
              self.init();
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          });
      }
    }
  };
</script>
<style lang="less" scoped>
  @import "modelAudit.less";
</style>


