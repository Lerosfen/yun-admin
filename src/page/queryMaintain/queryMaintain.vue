<template>
  <!-- 查询维护 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <list-table-title title="查询条件维护" :isBack="false"></list-table-title>
    <!-- <div class="search-section clearfix">-->
    <!--<el-button class="yellow-btn" @click="addData" style="position:relative">新 增</el-button>-->
    <!--</div>-->
    <!--查询搜索-->
    <div class="search-section clearfix">
      <el-button class="yellow-btn" @click="addData" style="position:relative">新 增</el-button>
      <div class="search-right fr">
        <div class="input-data fl">
          <div class="input-tpm yellow-input new-input">
            <el-input placeholder="请输入查询名称" v-model="tplName"></el-input>
          </div>
        </div>
        <div class="input-data fl m-l-10">
          <div class="input-tpm yellow-input new-input">
            <el-select v-model="statevoid" placeholder="请选择所属库">
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
        <div class="add-btn fl yellow m-l-10 new-btn" @click="reset()" style="position:relative">重 置</div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container pag-position">
      <el-table :data="tableData" stripe style="width:100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column
          v-for="item in tableHeader"
          :label="item.label"
          :prop="item.prop"
          :key="item.id"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,1)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClick(scope.row,2)" type="text" size="small">删除</el-button>
            <el-button @click="handleClick(scope.row,3)" type="text" size="small">配置条件</el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 新增 编辑-->
    <Modal
      v-model="addMaintainView"
      :title="maintainTitle"
      width="25%"
      :closable="false"
      :mask-closable="false"
    >
      <el-form label-width="200px" :rules="addFormRules" ref="addFormRules" :model="form">
        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="查询名称" prop="queryNames">
                <div class="input-tpm blue-input new-input">
                  <el-input
                    placeholder="请输入查询名称"
                    v-model="form.queryNames"
                    :disabled="mainDisabled"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="类别" prop="category">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入类别" v-model="form.category" :disabled="mainDisabled"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="所属库" prop="baseLibraryID">
                <div class="input-tpm blue-input new-input">
                  <el-select
                    placeholder="请选择所属库"
                    v-model="form.baseLibraryID"
                    :disabled="selectDisabled"
                    @change="changeTable()"
                  >
                    <el-option
                      v-for="item in statusList"
                      :label="item.name"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="表" prop="basicTableManagementID">
                <div class="input-tpm blue-input new-input">
                  <el-select
                    placeholder="请选择表"
                    v-model="form.basicTableManagementID"
                    :disabled="selectDisabled"
                  >
                    <el-option
                      v-for="item in tblList"
                      :label="item.tableNames"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="页面显示位置" prop="pageDisplayUrl">
                <div class="input-tpm blue-input new-input">
                  <el-input
                    placeholder="请输入URL"
                    v-model="form.pageDisplayUrl"
                    :disabled="mainDisabled"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="passWordSubmit">确 认</el-button>
        <el-button class="yellow-btn" type="primary" @click="resetData">重 置</el-button>
        <el-button class="blue-btn" @click="cancleModal()">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../api/bigData/daq/queryMaintain';

  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        var reg = /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/;
        if (!reg.test(value)) {
          callback(new Error('请输入有效的IPV4地址'));
        } else {
          callback();
        }
      };
      return {
        tableid: '',
        tplName: '',
        statevoid: '',
        tableHeader: [
          {
            prop: 'queryNames',
            label: '查询名称'
          },
          {
            prop: 'category',
            label: '类别'
          },
          {
            prop: 'baseLibraryName',
            label: '所属库'
          },
          {
            prop: 'basicTableManagementName',
            label: '表'
          },
          {
            prop: 'pageDisplayUrl',
            label: '页面显示位置'
          }
        ],
        tableData: [
          {
            queryNames: '宏观经济库查询',
            category: '地区生产总值',
            baseLibraryName: '宏观经济库',
            basicTableManagementName: '各市（区）主要经济指标',
            pageDisplayUrl: ''
          }
        ],
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        addMaintainView: false,
        maintainTitle: '',
        form: {
          queryNames: '',
          category: '',
          baseLibraryID: '',
          basicTableManagementID: '',
          pageDisplayUrl: '',
          id: ''
        },
        statusList: [
          {
            id: 1,
            name: '人口库'
          },
          {
            id: 2,
            name: '法人库'
          },
          {
            id: 3,
            name: '电子证照库'
          },
          {
            id: 4,
            name: '宏观经济库'
          },
          {
            id: 5,
            name: '空间地理库'
          },
          {
            id: 6,
            name: '权利事项库'
          },
          {
            id: 7,
            name: '信用库'
          }
        ],
        tblList: [
          {
            id: 1,
            tableNames: '人口基础信息表'
          },
          {
            id: 2,
            tableNames: '人口流动信息表'
          },
          {
            id: 3,
            tableNames: '婚姻登记信息表'
          },
          {
            id: 4,
            tableNames: '子女信息'
          },
          {
            id: 5,
            tableNames: '社保信息'
          },
          {
            id: 6,
            tableNames: '低保信息'
          },
          {
            id: 7,
            tableNames: '房屋登记信息'
          },
          {
            id: 8,
            tableNames: '公积金信息'
          }
        ],
        mainDisabled: false,
        selectDisabled: false,
        addType: 0, //0新增  1编辑
        // 验证
        addFormRules: {
          queryNames: [
            { required: true, message: '请输入查询名称', trigger: 'blur' }
          ],
          category: [{ required: true, message: '请输入类别', trigger: 'blur' }],
          baseLibraryID: [
            { required: true, message: '请选择所属库', trigger: 'change' }
          ],
          basicTableManagementID: [
            { required: true, message: '请选择表', trigger: 'change' }
          ],
          pageDisplayUrl: [
            { required: true, message: '请输入URL', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      addData() {
        this.maintainTitle = '新增查询';
        this.addMaintainView = true;
        this.selectDisabled = false;
        this.addType = 0;
        var obj = this.form;
        for (var i in obj) {
          obj[i] = '';
        }
      },
      handleClick(row, type) {
        this.addType = type;
        this.tableid = row.id;
        this.selectDisabled = true;
        if (type == 1) {
          this.addMaintainView = true;
          this.maintainTitle = '编辑查询';
          this.form = {
            queryNames: row.queryNames,
            category: row.category,
            pageDisplayUrl: row.pageDisplayUrl,
            baseLibraryID: row.baseLibraryID,
            basicTableManagementID: row.basicTableManagementID
          };
        }
        if (type == 2) {
          this.deleteMaintainData(row.id);
        }

        if (type == 3) {
          /*this.queryCondition(row.id);*/
          this.$router.push({
            path: 'configCondition',
            query: {
              data: {
                id: row.id,
                tableId: row.basicTableManagementID
              }
            }
          });
        }
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.init();
      },
      cancleModal() {
        this.addMaintainView = false;
        this.$refs.addFormRules.resetFields();
      },
      resetData() {
        if (this.addType == 0) {
          this.$refs.addFormRules.resetFields();
        } else {
          this.form.queryNames = '';
          this.form.category = '';
          this.form.pageDisplayUrl = '';
        }
      },
      /* //点击配置条件查询
      queryCondition(id){
        var self = this;
        api.findQueryMainById({
          QueryMaintenanceID:id,
        }).then(res=>{
          if(res.code=='code_200'){
            self.$store.conditionName = res.data[0].conditionName;
            self.$store.correspondingField = res.data[0].correspondingField;
          }
        })
      },*/
      //页面初始化进入后查询
      init() {
        var self = this;
        api
          .selectAllQueryMainData({
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            QueryNames: self.tplName,
            baseLibraryId: self.statevoid
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.tableData = res.data;
              self.totalNum = res.page.totalNumber;
            }
          });
      },
      //查询下拉框(所属库下拉框)
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
      //搜索
      Modelsearch() {
        this.init();
      },
      //重置
      reset() {
        var self = this;
        self.tplName = '';
        self.statevoid = '';
        self.init();
      },
      //新增时点击显示表格下拉框
      changeTable() {
        var self = this;
        api
          .selectAllTableLibrary({
            baseLibraryID: self.form.baseLibraryID
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.tblList = res.data;
              //重新选择后重置表数据下拉框
              self.form.basicTableManagementID = '';
            }
          });
      },

      //新增查询
      passWordSubmit() {
        /* this.form.baseLibraryId = this.form.baseLibraryName;*/
        var self = this;
        self.$refs.addFormRules.validate(valid => {
          if (!valid) {
            self.$message({
              type: 'error',
              message: '请填写完整信息'
            });
            return false;
          } else {
            if (self.addType == 0) {
              self.insertMaintainData();
            } else if (self.addType == 1) {
              self.updataMaintainData();
            }
          }
        });
      },
      //新增
      insertMaintainData() {
        var self = this;
        api.insertQueryMainData(self.form)
          .then(res => {
            if (res.code === 'code_200') {
              self.$notify({
                tittle: '添加成功!',
                message: '添加成功!',
                type: 'success',
                offset: 100,
                duration: self.$store.state.el_Duration
              });
              self.init();
              // self.addMaintainView = false;
              self.resetData();
            } else {
              self.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: self.$store.state.el_Duration
              });
            }
          });
      },
      //编辑更新
      updataMaintainData() {
        var self = this;
        self.form.id = self.tableid;
        api.updateQueryMainData(self.form)
          .then(res => {
            if (res.code === 'code_200') {
              self.$notify({
                tittle: '编辑成功!',
                message: '编辑成功!',
                type: 'success',
                offset: 100,
                duration: self.$store.state.el_Duration
              });
              self.init();
              self.addMaintainView = false;
              self.resetData();
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: self.$store.state.el_Duration
              });
            }
          });
      },
      //删除
      deleteMaintainData(id) {
        this.$confirm('确定要删除选中的查询信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn btn-custom-cancel',
          confirmButtonClass: 'yellow-btn btn-custom-confirm',
          type: 'warning',
          center: true
        })
          .then(() =>
            api.deleteQueryMainData({ id: id })
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
              })
          );
      }
    },
    mounted() {
      var self = this;
      self.init();
      self.selectAllBaseLibrary();
      self.changeTable();
    }
  };
</script>

<style scoped lang="less">
  @import "queryMatintain.less";
</style>


