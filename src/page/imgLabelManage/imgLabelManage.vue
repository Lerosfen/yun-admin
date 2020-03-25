<template>
  <!--  画像的标签管理 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <list-table-title title="画像标签管理" :isBack="false"></list-table-title>
    <div class="search-section clearfix">
      <el-button class="yellow-btn" @click="addData" style="position:relative">新 增</el-button>
      <div class="search-right fr">
        <div class="input-data fl">
          <div class="input-tpm yellow-input new-input">
            <el-input placeholder="请输入查询名称" v-model="labelName"></el-input>
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
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,1)" type="text" size="small">编辑</el-button>
            <!--<el-button @click="handleClick(scope.row,2)" type="text" size="small">启用</el-button>
            <el-button @click="handleClick(scope.row,3)" type="text" size="small">删除</el-button>
            <el-button @click="handleClick(scope.row,4)" type="text" size="small">配置方式</el-button>-->
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
              <el-form-item label="标签名称" prop="labelName">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入标签名称" v-model="form.labelName" :disabled="mainDisabled"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="标签值" prop="labelValue">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入标签值" v-model="form.labelValue" :disabled="mainDisabled"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="标签类别" prop="labelType">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入标签类别" v-model="form.labelType" :disabled="mainDisabled"></el-input>
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
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button class="yellow-btn" type="primary" @click.native="passWordSubmit">确 认</el-button>
        <el-button class="yellow-btn" type="primary" @click="resetData">重 置</el-button>
        <el-button class="blue-btn" @click="cancleModal()">取 消</el-button>
      </div>
    </Modal>

    <yj-dialog
      :visible.sync="matchingWayView"
      :title="matchingWayViewTitle"
      :close-on-click-modal="false"
      width="30%"
    >
      <div slot="footer" style="text-align: center">
        <el-button class="yellow-btn" type="primary" @click.native="matchingWaySubmit">确 认</el-button>
        <el-button class="yellow-btn" type="primary" @click="matchingWayResetData">重 置</el-button>
        <el-button class="blue-btn" @click="matchingWayCancleModal()">取 消</el-button>
      </div>
    </yj-dialog>
  </div>
</template>

<script>
import api from '../../api/bigData/daq/imgLabelManage/imgLabelManage';

export default {
  data() {
    return {
      tableid: '',
      labelName: '',
      statevoid: '', // 选择所属库
      tableHeader: [
        {
          prop: 'labelName',
          label: '标签定义',
        },
        {
          prop: 'labelValue',
          label: '标签值',
        },
        {
          prop: 'labelType',
          label: '标签类别',
        },
        {
          prop: 'baseLibraryID',
          label: '所属库',
        },
        {
          prop: 'matchingState',
          label: '匹配状态',
        },
      ],
      tableData: [
        {
          labelName: '婚姻状况',
          labelValue: '标签值',
          labelType: '标签类别',
          baseLibraryID: '人口库',
          matchingState: '正常',
        },
      ],
      totalNum: 1,
      currentPage: 1,
      pageSize: 10,
      addMaintainView: false,
      maintainTitle: '',
      form: {
        labelName: '',
        labelValue: '',
        labelType: '',
        baseLibraryID: '',
        matchingState: '',
      },
      statusList: [
        {
          id: 1,
          name: '人口库',
        },
        {
          id: 2,
          name: '法人库',
        },
        {
          id: 3,
          name: '电子证照库',
        },
        {
          id: 4,
          name: '宏观经济库',
        },
        {
          id: 5,
          name: '空间地理库',
        },
        {
          id: 6,
          name: '权利事项库',
        },
        {
          id: 7,
          name: '信用库',
        },
      ],
      mainDisabled: false, // 不能输入
      selectDisabled: false,
      addType: 0, // 0新增  1编辑
      // 验证
      addFormRules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 50, message: '标签名称为1~50个字符', trigger: 'blur' },
        ],
        labelValue: [
          { required: true, message: '请输入标签值', trigger: 'blur' },
          { min: 1, max: 50, message: '标签值为1~50个字符', trigger: 'blur' },
        ],
        labelType: [
          { required: true, message: '请输入标签类别', trigger: 'change' },
          { min: 1, max: 50, message: '标签类别为1~50个字符', trigger: 'blur' },
        ],
        baseLibraryID: [
          { required: true, message: '请选择所属库', trigger: 'change' },
        ],
      },
      matchingWayView: false,
      matchingWayViewTitle: '匹配方式',
    };
  },
  methods: {
    addData() {
      this.maintainTitle = '新增标签';
      this.addMaintainView = true;
      this.selectDisabled = false;
      this.addType = 0;
      const obj = this.form;
      for (const i in obj) {
        obj[i] = '';
      }
    },
    handleClick(row, type) {
      this.addType = type;
      this.tableid = row.id;
      this.selectDisabled = true;
      if (type == 1) {
        this.addMaintainView = true;
        this.maintainTitle = '编辑标签';
        this.form = {
          labelName: row.labelName,
          labelValue: row.labelValue,
          labelType: row.labelType,
          baseLibraryID: row.baseLibraryID,
        };
      }
      if (type == 3) {
        this.deleteMaintainData(row.id);
      }

      if (type == 4) {
        this.matchingWayView = true;
        /* this.queryCondition(row.id); */
        /* this.$router.push({
              path: "configCondition",
              query: {
                data: {
                  id: row.id,
                  tableId: row.baseLibraryID
                }
              }
            }); */
      }
    },
    handleCurrentChange(val) {
      const self = this;
      self.currentPage = val;
      // self.init();
    },
    cancleModal() {
      this.addMaintainView = false;
    },
    resetData() {
      const obj = this.form;
      for (const i in obj) {
        obj[i] = '';
      }
    },
    // 页面初始化进入后查询
    init() {
      const self = this;
      /* api
            .selectAllQueryMainData({
              pageSize: self.pageSize,
              currentPage: self.currentPage,
              labelName: self.labelName,
              labelType: self.statevoid
            })
            .then(res => {
            if (res.code == "code_200") {
              self.tableData = res.data;
              self.totalNum = res.page.totalNumber;
            }
          }); */
    },
    // 查询下拉框(所属库下拉框)
    selectAllBaseLibrary() {
      /* api
            .selectAllBaseLibrary({
              pageSize: 100000,
              currentPage: 1
            })
            .then(res => {
            if (res.code == "code_200") {
              this.statusList = res.data;
            }
          }); */
    },
    // 搜索
    Modelsearch() {
      this.init();
    },
    // 重置
    reset() {
      const self = this;
      self.tplName = '';
      self.statevoid = '';
      self.init();
    },
    // 新增时点击显示表格下拉框
    changeTable() {
      const self = this;
      /* api
            .selectAllTableLibrary({
              labelType: self.form.labelType
            })
            .then(res => {
            if (res.code == "code_200") {
              //重新选择后重置表数据下拉框
              self.form.baseLibraryID = "";
            }
          }); */
    },

    // 新增查询
    passWordSubmit() {
      const self = this;
      /* self.$refs.addFormRules.validate(valid => {
            if (!valid) {
              self.$message({
                type: "error",
                message: "请填写完整信息"
              });
              return false;
            } else {
              if (self.addType == 0) {
                self.insertMaintainData();
              } else if (self.addType == 1) {
                self.updataMaintainData();
              }
            }
          }); */
    },
    // 新增
    insertMaintainData() {
      const self = this;
      /* api.insertQueryMainData(self.form).then(res => {
            if (res.code === "code_200") {
              self.$notify({
                tittle: "添加成功!",
                message: "添加成功!",
                type: "success",
                offset: 100,
                duration: self.$store.state.el_Duration
              });
              self.init();
              self.addMaintainView = false;
              self.resetData();
            } else {
              self.$notify({
                tittle: "失败",
                message: res.msg,
                type: "error",
                offset: 100,
                duration: self.$store.state.el_Duration
              });
            }
          }); */
    },
    // 编辑更新
    updataMaintainData() {
      const self = this;
      // self.form.id = self.tableid;
      /* api.updateQueryMainData(self.form).then(res => {
            if (res.code === "code_200") {
              self.$notify({
                tittle: "编辑成功!",
                message: "编辑成功!",
                type: "success",
                offset: 100,
                duration: self.$store.state.el_Duration
              });
              self.init();
              self.dataMaintainView = false;
              self.resetData();
            } else {
              this.$notify({
                tittle: "失败",
                message: res.msg,
                type: "error",
                offset: 100,
                duration: self.$store.state.el_Duration
              });
            }
          }); */
    },
    // 删除
    deleteMaintainData(id) {
      /* this.$confirm("确定要删除选中的查询信息吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            cancelButtonClass: "blue-btn btn-custom-cancel",
            confirmButtonClass: "yellow-btn btn-custom-confirm", // 以上两个按钮添加btn-custom-XXX来控制按钮位置
            type: "warning",
            center: true
          }).then(() =>
          api.deleteQueryMainData({ id: id }).then(res => {
            if (res.code === "code_200") {
              console.log(res.data);
              this.$notify({
                tittle: "删除成功!",
                message: "删除成功!",
                type: "success",
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.init();
            } else {
              this.$notify({
                tittle: "失败",
                message: res.msg,
                type: "error",
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          })
        ); */
    },
    matchingWaySubmit() {
      // 成功后关闭
    },
    matchingWayCancleModal() {
      this.matchingWayView = false;
    },
  },
  mounted() {
    const self = this;
    self.init();
    // self.selectAllBaseLibrary();
    self.changeTable();
  },
};
</script>

<style scoped lang="less">
  @import "imgLabelManage.less";
</style>
