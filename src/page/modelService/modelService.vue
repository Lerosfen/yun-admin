<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData" v-if="Btn.save==1">新增</el-button>
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
                v-if=" Btn.findOne==1"
              >查看
              </el-button>
              <el-button
                @click="handelClick(scope.row,2)"
                type="text"
                size="small"
                v-if=" Btn.update==1 && scope.row.auditStatus!='已通过'"
              >编辑
              </el-button>
              <el-button
                @click="handelClick(scope.row,3)"
                type="text"
                size="small"
                v-if=" Btn.delete==1 && scope.row.auditStatus!='已通过'"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
      </div>
    </div>
    <!--新增 添加-->
    <Modal
      title="模型服务-添加"
      v-model="addFormVisible"
      width="40%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form
        :model="addForm"
        label-width="100px"
        :rules="addFormResource"
        ref="addForm"
        class="applicatForm"
      >
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="模型名称" prop="modelName">
              <div class="sel-group sel-blue fl new-input">
                <el-select
                  v-model="modelNameSel"
                  value-key="id"
                  @change="modelChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in modelList"
                    :key="item.id"
                    :label="item.sourceTable"
                    :value="item"
                  ></el-option>
                </el-select>
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
            <el-form-item label="申请人部门" prop="deptName">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.deptName"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="联系方式" prop="tel">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.tel"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input">
            <el-form-item label="申请理由" prop="applyApplication">
              <div class="input-tpm blue-input blue-textarea modelHeight textModel">
                <el-input placeholder type="textarea" :rows="4" v-model="addForm.applyApplication"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="addSubmit">确 定</el-button>
        <el-button class="blue-btn" @click="cancleModel(1)">取 消</el-button>
      </div>
    </Modal>
    <!--查看-->
    <Modal
      title="模型服务-查看"
      v-model="examineFormVisible"
      width="40%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form
        :model="addForm"
        label-width="100px"
        :rules="addFormResource"
        ref="addForm"
        class="applicatForm"
      >
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="模型名称" prop="modelName">
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
            <el-form-item label="申请人部门" prop="deptName">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.deptName" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="token" prop="token">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.token" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="状态" prop="auditStatus">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.auditStatus" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="拒绝理由" prop="reasonsRefusal">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.reasonsRefusal" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="联系方式" prop="tel">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.tel" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="申请时间" prop="creationTime">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.creationTime" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input">
            <el-form-item label="接口路径" prop="applyApplication">
              <div class="input-tpm blue-input blue-textarea modelHeight textModel" style="border: 1px solid #009CFF;">
                <i class="honer-left"></i>
                <el-input placeholder v-model="addForm.url" :disabled="true"></el-input>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input" style="margin-top: 45px">
            <el-form-item label="申请理由" prop="applyApplication">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModel(2)">关 闭</el-button>
      </div>
    </Modal>
    <!--编辑-->
    <Modal
      title="模型服务-编辑"
      v-model="editFormVisible"
      width="40%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form
        :model="addForm"
        label-width="100px"
        :rules="addFormResource"
        ref="addForm"
        class="applicatForm"
      >
        <el-row>
          <el-col :span="12" class="input_label">
            <el-form-item label="模型名称" prop="modelNameSel">
              <div class="sel-group sel-blue fl new-input">
                <el-select
                  v-model="modelNameSel"
                  value-key="id"
                  placeholder="请选择"
                  :disabled="true"
                  @change="modelChange"
                >
                  <el-option
                    v-for="item in modelList"
                    :key="item.id"
                    :label="item.sourceTable"
                    :value="item"
                  ></el-option>
                </el-select>
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
            <el-form-item label="申请人部门" prop="deptName">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.deptName"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input_label">
            <el-form-item label="联系方式" prop="tel">
              <div class="input-tpm blue-input new-input">
                <el-input placeholder v-model="addForm.tel"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="input">
            <el-form-item label="申请理由" prop="applyApplication">
              <div class="input-tpm blue-input blue-textarea modelHeight textModel">
                <i class="honer-left"></i>
                <el-input placeholder type="textarea" :rows="4" v-model="addForm.applyApplication"></el-input>
                <i class="honer-right"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="editSubmit">确 定</el-button>
        <el-button class="blue-btn" @click="cancleModel(3)">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  /* eslint-disable */
  import api from '../../api/bigData/daq/modelService';
  import ElRow from 'element-ui/packages/row/src/row';
  import common from '../../../config/common';

  export default {
    components: { ElRow },
    name: 'dataModel',
    data() {
      //表单验证
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入有效信息'));
        } else {
          callback();
        }
      };
      var validatePass1 = (rule, value, callback) => {
        var reg = /^(86|\+86)?1[3456789]\d{9}$/;
        if (value === '' || !reg.test(value)) {
          callback(new Error('请输入有效的电话号码'));
        } else {
          callback();
        }
      };
      return {
        titles: '数据模型服务',
        tableData: [], //页面表格数据
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
        modelName: '', //，模型名称
        modelNameSel: '',
        auditStatus: '', //模型状态
        modelList: [],
        totalNum: 1, //总数据条数
        pageSize: 10, //当前页展示数据条数
        currentPage: 1, //当前页
        addFormVisible: false, //添加界面是否显示
        editFormVisible: false, //编辑界面是否显示
        examineFormVisible: false, //查看界面是否显示

        //新增参数
        addForm: {
          modelName: '',
          modelZwName: '',
          deptName: '',
          tel: '',
          applyApplication: ''
        },
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
        // 验证
        addFormResource: {
          modelNameSel: [{ validator: validatePass, trigger: 'change' }],
          modelZwName: [{ validator: validatePass, trigger: 'blur' }],
          deptName: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 50,
              message: '申请人部门字符长度为1~50',
              trigger: 'blur'
            }
          ],
          tel: [{ validator: validatePass1, trigger: 'blur' }],
          applyApplication: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 100,
              message: '申请理由字符长度为1~100',
              trigger: 'blur'
            }
          ]
        },

        //启用数组;
        stateforms: {
          modelId: '',
          state: ''
        },

        states: false, //模型禁用状态；
        //按钮判断
        Btn: {
          findOne: 0,
          save: 0,
          update: 0,
          delete: 0
        }
      };
    },
    created() {
      // this.initDataModel();
    },
    mounted() {
      //初始化页面
      const self = this;
      // self.$store.commit("showLoading",true);
      self.initDataModel();
      self.getAllModel();
      // self.getDataSelectType();
      // self.getDataSelectYesOrNot();
      self.getfuseParams();
    },
    methods: {
      // 模型选择
      modelChange(val) {
        console.log('change', val);
        this.addForm.modelName = val.sourceTable;
        this.addForm.modelZwName = val.sourceTableMame;
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
                if (item.includes('save@POST')) {
                  self.Btn.save = 1;
                }
                if (item.includes('update@PUT')) {
                  self.Btn.update = 1;
                }
                if (item.includes('delete@DELETE')) {
                  self.Btn.delete = 1;
                }
              });
            }
          });
      },
      //初始化请求数据
      initDataModel() {
        var self = this;
        api
          .getUserApplyModel({
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            modelName: self.modelName,
            AuditStatus: self.auditStatus
          })
          .then(res => {
            if (res.code == 'code_200') {
              console.log('666', res.data);
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
      // 操作
      handelClick(row, type) {
        if (type == 1 || type == 2) {
          api.getApplyModelById({ id: row.id })
            .then(res => {
              if (res.code == 'code_200') {
                console.log('dddddddddddddddddddd', res.data);
                self.addForm = res.data;
                self.modelNameSel = res.data.modelName;
              }
            });
        }
        var self = this;
        if (type == 1) {
          self.examineFormVisible = true;
        }
        if (type == 2) {
          self.editFormVisible = true;
        }
        if (type == 3) {
          // 删除接口
          self.ModalRemove(row.id);
        }
      },
      // 获取所有模型
      getAllModel() {
        var self = this;
        api.getAllModel()
          .then(res => {
            if (res.code == 'code_200') {
              self.modelList = res.data;
            }
          });
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
          self.addFormVisible = false;
        }
        if (type == 2) {
          self.examineFormVisible = false;
        }
        if (type == 3) {
          self.editFormVisible = false;
        }
      },

      // 编辑确认
      editSubmit() {
        const self = this;
        let addList = self.addForm;
        this.$refs.addForm.validate(valid => {
          if (valid) {
            api.updateApply(addList)
              .then(res => {
                if (res.code == 'code_200') {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  });
                  self.editFormVisible = false;
                  self.initDataModel();
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
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
      },
      //删除
      ModalRemove(index) {
        this.$confirm('确认删除该申请吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn',
          confirmButtonClass: 'yellow-btn',
          type: 'warning',
          center: true
        })
          .then(() => {
            api.delApply({ id: index })
              .then(
                res => {
                  if (res.code === 'code_200') {
                    this.initDataModel();
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  } else {
                    this.$message({
                      type: 'error',
                      message: '删除失败!'
                    });
                  }
                },
                errorRes => {
                  // console.log('删除失败的回调', errorRes);
                }
              );
          })
          .catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });
          });
      },
      //查询
      Modelsearch() {
        this.initDataModel();
      },
      //重置
      reset() {
        var self = this;
        self.modelName = '';
        self.auditStatus = '';
        this.initDataModel();
      },
      //新增
      addData() {
        this.addFormVisible = true;
        this.modelNameSel = '';
        this.addForm = {
          modelName: '',
          modelZwName: '',
          deptName: '',
          tel: '',
          applyApplication: ''
        };
      },

      // 添加确认
      addSubmit() {
        const self = this;
        let addList = self.addForm;
        console.log('addForm', self.addForm);
        self.$refs.addForm.validate(valid => {
          if (valid) {
            api.addApply(addList)
              .then(res => {
                if (res.code == 'code_200') {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  });
                  self.addFormVisible = false;
                  self.initDataModel();
                  self.$refs.addForm.resetFields(); // 清空
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
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
      },

      //每页显示数据量编辑
      handleSizeChange: function (val) {
        var self = this;
        self.pageSize = val;
        self.initDataModel();
      },
      //页码编辑
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.initDataModel();
      }
    }
  };
</script>
<style lang="less" type="text/less">
  @import "modelService.less";
</style>

