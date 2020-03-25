<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <!-- 标题 -->
      <list-table-title :title="titles"></list-table-title>
      <!-- 1.表信息维护 -->
      <el-row>
        <el-col :offset="3">
          <span class="xuhao">01</span>
          <label for class="bigTitle middle m-r-10 clean_mc">表信息维护</label>
        </el-col>
      </el-row>
      <!-- 表名称 -->
      <el-form
        label-width="200px"
        :rules="addFormRules"
        ref="addFormRules"
        :model="form"
        style="margin-top: 6px"
      >
        <el-row>
          <el-col :span="10" :offset="2" style="margin-left: 77px">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="表名称" prop="tblName">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入表名称" v-model="form.tblName"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <!-- 英文名称 -->
        <el-row>
          <el-col :span="10" :offset="2" style="margin-left: 77px">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="英文名称" prop="enName">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入表英文名称" v-model="form.enName"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <!-- 所属基础库 -->
        <el-row>
          <el-col :span="10" :offset="2" style="margin-left: 77px">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="所属基础库" prop="belongSto">
                <div class="input-tpm blue-input new-input">
                  <el-select placeholder="请选择基础库" v-model="form.belongSto">
                    <el-option
                      v-for="item in statusList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 2.表字段选择 -->
      <el-row>
        <el-col :offset="3" style="margin-top: -20px">
          <span class="xuhao">02</span>
          <label for class="bigTitle middle m-l-10 clean_mc">表字段选择</label>
        </el-col>
      </el-row>
      <el-row>
        <div style="margin-top: -20px">
          <el-col :span="6" :offset="3">
            <div class="input-tpm blue-input new-input">
              <el-input placeholder="请选择元数据模板" v-model="iptTplName" disabled></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <el-button class="yellow-btn choisetab" type="primary" @click="selMetaData()">选 择</el-button>
          </el-col>
          <el-col :span="6">
            <span class="add-newChild" @click="addMetaData">新 增</span>
          </el-col>
        </div>
      </el-row>
      <div class="table-container wordtable-container pag-position" style="margin-top:0px">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-table :data="selTableData" stripe height="320">
              <el-table-column
                v-for="item in selTableHead"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column label="主键">
                <template slot-scope="scope">
                  <el-radio
                    @change="getSelCurrentRow(scope.row)"
                    :label="scope.row.metadataEnglisName"
                    v-model="selTabRadio"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="medium" type="text" @click="delSelTable(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="btn-group">
        <el-button class="yellow-btn" @click="submitStoreTbl()">物化库表</el-button>
        <el-button class="blue-btn" @click="goBack()">取 消</el-button>
      </div>
    </div>
    <!-- 选择元数据/元数据模板 弹框 -->
    <Modal
      title="选择元数据模板"
      v-model="selMetaDataTplView"
      class="cha"
      width="45%"
      :closable="false"
      :mask-closable="false"
    >
      <!-- 查询元数据 -->
      <!-- 元数据模板名称 -->
      <el-row>
        <el-col :span="18">
          <div class="input-tpm blue-input fr new-input">
            <el-input
              placeholder="请输入元数据模板名称"
              v-model="selByTplName"
            ></el-input>
          </div>
        </el-col>
        <!-- <el-col :span="4" :offset="1">
          <div class="add-btn yellow" style="margin-top: 18px;">元数据</div>
        </el-col>-->
        <el-col :span="3">
          <div
            class="yellow new-btn"
            @click="selTblByTplName"
          >查 询
          </div>
        </el-col>
        <el-col :span="2">
          <div
            class="yellow new-btn"
            @click="resetSel"
          >重 置
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <div class="table-container">
        <el-row>
          <el-col :span="24">
            <el-table :data="tplTableData" height="250" style="width: 100%">
              <el-table-column width="60">
                <template slot-scope="scope">
                  <el-radio
                    @change="getTplCurrentRow(scope.row,scope.$index)"
                    :label="scope.row.templateName"
                    v-model="tplRadio"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in tplDataHeader"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!--分页-->
        <!-- <div class="model-pag">
          <el-pagination
            :current-page="metaDataTplTable.currentPage"
            :page-size="metaDataTplTable.pageSize"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="metaDataTplTable.totalNum"
            :pager-count="5"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </div>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click="submitTpl">确 定</el-button>
        <el-button class="blue-btn" @click="cancelModal(1)">取 消</el-button>
      </div>
    </Modal>
    <!-- 选择元数据 -->
    <Modal
      title="选择元数据"
      v-model="selMetaDataView"
      class="cha"
      width="45%"
      :closable="false"
      :mask-closable="false"
    >
      <!-- 查询元数据 -->
      <el-row>
        <el-col :span="18">
          <div class="input-tpm blue-input fr new-input">
            <el-input placeholder="请输入元数据英文名称"></el-input>
          </div>
        </el-col>
        <!-- <el-col :span="4" :offset="1">
          <div class="add-btn yellow" style="margin-top: 18px;">元数据</div>
        </el-col>-->
        <el-col :span="3">
          <div class="yellow new-btn">查 询</div>
        </el-col>
        <el-col :span="2">
          <div class="yellow new-btn">重 置</div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <div class="table-container">
        <el-row>
          <el-col>
            <el-table
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              :data="metaDataTableData"
              height="250"
              style="width: 100%"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                v-for="item in selTableHead"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click="submitMetaData">确 定</el-button>
        <el-button class="blue-btn" @click="cancelModal(2)">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import api from '../../../api/bigData/daq/baseTableManage';

  export default {
    data() {
      return {
        titles: '基础表管理/新增基础表',
        tblName: '',
        enName: '',
        statusList: [],
        selMetaDataTplView: false,
        radio: '',
        selTabRadio: '',
        tplDataHeader: [
          {
            prop: 'templateName',
            label: '元数据模板'
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
        tplTableData: [],
        selTableHead: [
          {
            prop: 'metadataEnglisName',
            label: '英文名'
          },
          {
            prop: 'metadataName',
            label: '中文名'
          },
          {
            prop: 'dataType',
            label: '数据类型'
          },
          {
            prop: 'dataFormat',
            label: '数据格式'
          }
        ],
        selTableData: [],
        form: {
          tblName: '',
          enName: '',
          belongSto: ''
        },
        selMetaDataView: false,
        selByTplName: '',
        // 元数据模板列表分页
        metaDataTplTable: {
          currentPage: 1,
          pageSize: 10,
          totalNum: 1
        },
        metaDataTableData: [],
        tplId: '',
        iptTplName: '',
        baseLibId: '',
        tplRadio: '',
        selMetaDataList: [],
        newMetaDataList: [],
        submitPKey: '',
        // 验证
        addFormRules: {
          tblName: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
          enName: [
            { required: true, message: '请输入表英文名称', trigger: 'blur' }
          ],
          belongSto: [
            { required: true, message: '请选择基础库', trigger: 'change' }
          ]
        }
      };
    },
    mounted() {
      var self = this;
      self.selectAllBaseLibrary();
    },
    methods: {
      // 查询基础库下拉
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
      selMetaData() {
        var self = this;
        if (self.form.belongSto != '') {
          // 查询元数据模板
          api
            .selectAllMetadataTemplate({
              currentPage: self.metaDataTplTable.currentPage,
              pageSize: self.metaDataTplTable.pageSize,
              templateName: self.selByTplName,
              baseLibraryId: self.form.belongSto
            })
            .then(res => {
              self.tplTableData = res.data;
              //
              self.tplId = res.data[0].id;
              //
              self.baseLibId = res.data[0].baseLibraryID;
            });
          self.selMetaDataTplView = true;
        } else {
          self.$message({
            type: 'error',
            message: '请选择基础库'
          });
        }
      },
      cancelModal(type) {
        if (type == 1) {
          this.selMetaDataTplView = false;
        }

        if (type == 2) {
          this.selMetaDataView = false;
        }
      },
      goBack() {
        this.$router.push({
          path: 'baseTableManage'
        });
      },
      addMetaData() {
        // 新增元数据
        var self = this;
        if (self.tplRadio == '') {
          self.$message({
            type: 'error',
            message: '请选择元数据模板'
          });
        } else {
          self.selMetaDataView = true;
          var tbl = self.selTableData;
          var nameList = [];
          if (tbl.length > 0) {
            var len = tbl.length;
            for (var i = 0; i < len; i++) {
              nameList.push(tbl[i].metadataEnglisName);
            }
            api
              .selectOutsideTemplate({
                baseLibraryId: self.baseLibId,
                MetadataMaintenanceNames: nameList.join(',')
              })
              .then(res => {
                this.metaDataTableData = res.data;
              });
          } else {
            api
              .selectOutsideTemplate({
                baseLibraryId: self.baseLibId,
                MetadataMaintenanceNames: ','
              })
              .then(res => {
                this.metaDataTableData = res.data;
              });
          }
        }
      },
      handleCurrentChange(val) {
        this.metaDataTplTable.currentPage = val;
      },
      getTplCurrentRow(row, i) {
        this.tplId = row.id;
        this.iptTplName = row.templateName;
      },
      submitTpl() {
        var self = this;
        if (self.tplRadio == '') {
          self.$message({
            type: 'error',
            message: '请选择元数据模板'
          });
        } else {
          if (self.tplId) {
            api
              .selectMetadataTemplateKey({
                id: self.tplId
              })
              .then(res => {
                self.selTableData = res.data.metadataMaintenance;
                self.selMetaDataTplView = false;
              });
          }
        }
      },
      selTblByTplName() {
        this.selMetaData();
      },
      getCurrentRow() {
      },
      handleSelectionChange(val) {
        this.selMetaDataList = val;
      },
      submitMetaData() {
        var arr = this.selMetaDataList;
        for (var i = 0; i < arr.length; i++) {
          this.selTableData.push(arr[i]);
        }
        this.selMetaDataView = false;
      },
      getSelCurrentRow(row) {
        this.submitPKey = row.metadataEnglisName;
      },
      submitStoreTbl() {
        var self = this;
        self.$refs.addFormRules.validate(valid => {
          if (!valid) {
            self.$message({
              type: 'error',
              message: '请填写完整信息'
            });
            return false;
          } else if (self.selTableData.length == 0) {
            self.$message({
              type: 'error',
              message: '表字段不能为空'
            });
            return false;
          } else if (self.selTabRadio == '') {
            self.$message({
              type: 'error',
              message: '请选择主键'
            });
            return false;
          } else {
            // 物化库表
            var tbl = self.selTableData;
            if (tbl.length == 0) {
              self.$message({
                type: 'error',
                message: '表字段不能为空'
              });
            } else {
              self.$store.commit('showLoading', true);

              var metaDataList = [];
              tbl.forEach(item => {
                metaDataList.push(item.id);
              });
              api
                .insertBasicTableManagement({
                  tableNames: self.form.tblName,
                  tableEnglishNames: self.form.enName,
                  baseLibraryID: self.form.belongSto,
                  primarykeys: self.submitPKey,
                  metadataMaintenanceIDS: metaDataList.join(',')
                })
                .then(res => {
                  self.$store.commit('hideLoading', false);
                  if (res.code == 'code_200') {
                    self.$notify({
                      tittle: '添加成功!',
                      message: '添加成功!',
                      type: 'success',
                      offset: 100,
                      duration: self.$store.state.el_Duration
                    });
                    self.$router.push({
                      path: 'baseTableManage'
                    });
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
          }
        });
      },
      delSelTable(index) {
        this.selTableData.splice(index, 1);
        this.selTabRadio = '';
      },
      // 选择元数据模板查询重置
      resetSel() {
        this.selByTplName = '';
        this.tplRadio = '';
        this.selMetaData();
      }
    }
  };
</script>
<style scoped lang="less">
  @import "addBaseTable.less";
</style>
