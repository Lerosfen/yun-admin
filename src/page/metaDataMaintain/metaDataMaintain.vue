<template>
  <!-- 元数据维护 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!-- 新增 搜索 -->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData">新 增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入中文名称" v-model="selChName"></el-input>
            </div>
          </div>
          <div class="input-data fl m-l-20">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入英文名称" v-model="selEnName"></el-input>
            </div>
          </div>
          <div class="input-data fl m-l-20">
            <div class="input-tpm yellow-input new-input">
              <el-select placeholder="请选择所属库" v-model="statevoid">
                <el-option
                  v-for="item in statusList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="searchData">查 询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="resetSearch">重 置</div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-table :data="maintainTblData" stripe style="width: 100%">
          <el-table-column
            v-for="item in maintainTblHeader"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row,1)">编辑</el-button>
              <!-- <el-button type="text" size="small" @click="handleClick(scope.row,2)">删除</el-button> -->
              <el-button type="text" size="small" @click="handleClick(scope.row,3)">版本信息</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="maintainTblData.length!=0"
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

    <!-- 新增 编辑弹框 -->
    <Modal
      v-model="dataMaintainView"
      width="25%"
      :title="modalTitle"
      :closable="false"
      :mask-closable="false"
    >
      <el-form label-width="150px" :rules="addFormRules" ref="addFormRules" :model="form">
        <el-row>
          <el-col :span="24" :pull="4">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="中文名称" prop="metadataName">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-input placeholder="请输入中文名称" v-model="form.metadataName"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="4">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="英文名称" prop="metadataEnglisName">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-input
                    placeholder="请输入英文名称"
                    v-model="form.metadataEnglisName"
                    :disabled="mainDisabled"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="4">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="数据类型" prop="dataType">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-select placeholder="请选择数据类型" v-model="form.dataType" :disabled="mainDisabled">
                    <el-option
                      v-for="item in dataTypeList"
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

        <el-row>
          <el-col :span="24" :pull="4">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="数据格式" prop="dataFormat">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-input
                    placeholder="请输入数据格式"
                    v-model="form.dataFormat"
                    :disabled="mainDisabled"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="4">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="标准或说明" prop="explain">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-input placeholder="请输入采用标准/说明" v-model="form.explain"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :pull="4">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="所属基础库" prop="baseLibraryName">
                <div class="input-tpm blue-input inputMl new-input">
                  <el-select
                    placeholder="请选择所属库"
                    v-model="form.baseLibraryName"
                    :disabled="mainDisabled"
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
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="passWordSubmit">确 认</el-button>
        <el-button class="yellow-btn" type="primary" @click="resetData">重 置</el-button>
        <el-button class="blue-btn" @click="cancleModal(1)">取 消</el-button>
      </div>
    </Modal>

    <!-- 版本信息 -->
    <Modal
      v-model="versionInfoView"
      title="版本信息"
      width="55%"
      :closable="false"
      :mask-closable="false"
    >
      <div class="table-container">
        <el-table :data="versionData" height="300">
          <el-table-column
            v-for="item in maintainTblHeader"
            :prop="item.prop"
            :label="item.label"
            :key="item.id"
          ></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModal(2)">关 闭</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../api/bigData/daq/metaDataMaintain';

  export default {
    data() {
      return {
        titles: '元数据维护',
        selChName: '',
        selEnName: '',
        statevoid: '',
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
        maintainTblHeader: [
          {
            prop: 'metadataName',
            label: '中文名称'
          },
          {
            prop: 'metadataEnglisName',
            label: '英文名称'
          },
          {
            prop: 'dataType',
            label: '数据类型'
          },
          {
            prop: 'dataFormat',
            label: '数据格式'
          },
          {
            prop: 'explain',
            label: '采用标准/说明'
          },
          {
            prop: 'baseLibraryName',
            label: '所属库'
          },
          {
            prop: 'version',
            label: '版本号'
          }
        ],
        maintainTblData: [],
        dataMaintainView: false,
        modalTitle: '',
        form: {
          metadataName: '',
          metadataEnglisName: '',
          dataType: '',
          dataFormat: '',
          explain: '',
          baseLibraryName: '',
          baseLibraryId: ''
        },
        mainDisabled: false,
        dataTypeList: [
          {
            id: 'string',
            name: '字符型(string)'
          },
          {
            id: 'integer',
            name: '整数型(integer)'
          },
          {
            id: 'float',
            name: '浮点型(float)'
          },
          {
            id: 'date',
            name: '日期型(date)'
          },
          {
            id: 'datetime',
            name: '日期时间型(datetime)'
          },
          {
            id: 'boolean',
            name: '布尔型(boolean)'
          },
          {
            id: 'binary',
            name: '二进制(binary)'
          }
        ],
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        addType: 0, //1新增 2编辑
        versionInfoView: false,
        configTitle: '',
        versionData: [],
        versionHeader: [
          {
            prop: 'beforeEdit',
            label: '修改前'
          },
          {
            prop: 'afterEdit',
            label: '修改后'
          },
          {
            prop: 'user',
            label: '用户'
          },
          {
            prop: 'theDate',
            label: '时间'
          }
        ],
        metaDataId: '',
        // 验证
        addFormRules: {
          metadataName: [
            { required: true, message: '请输入基础库名称', trigger: 'blur' }
          ],
          metadataEnglisName: [
            { required: true, message: '请输入基础库英文名称', trigger: 'blur' }
          ],
          dataType: [
            { required: true, message: '请选择数据类型', trigger: 'change' }
          ],
          dataFormat: [
            { required: true, message: '请输入数据格式', trigger: 'blur' }
          ],
          explain: [
            { required: true, message: '请输入采用标准/说明', trigger: 'blur' }
          ],
          baseLibraryName: [
            { required: true, message: '请选择所属库', trigger: 'change' }
          ]
        },

        currentVersion: ''
      };
    },
    mounted() {
      var self = this;
      self.$store.commit('showLoading', true);
      self.init();
      self.selectAllBaseLibrary();
    },
    methods: {
      init() {
        var self = this;
        api
          .selectAllMetadata({
            metadataName: self.selChName,
            metadataEnglisName: self.selEnName,
            baseLibraryId: self.statevoid,
            pageSize: self.pageSize,
            currentPage: self.currentPage
          })
          .then(res => {
              if (res.code == 'code_200') {
                self.$store.commit('hideLoading', false);
                self.maintainTblData = res.data;
                self.totalNum = res.page.totalNumber;
              }
            },
            err => {
              self.$store.commit('hideLoading', false);
            });
      },
      addData() {
        var obj = this.form;
        for (var i in obj) {
          obj[i] = '';
        }
        this.dataMaintainView = true;
        this.mainDisabled = false;
        this.modalTitle = '新增元数据';
        this.addType = 1;
      },
      passWordSubmit() {
        this.form.baseLibraryId = this.form.baseLibraryName;

        this.$refs.addFormRules.validate(valid => {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '请填写完整信息',
              customClass: 'zIndex'
            });
            return false;
          } else {
            if (this.addType == 1) {
              this.insertMetadata();
              this.addType = 0;
            } else {
              this.updateMetadata();
            }
          }
        });
      },
      //    新增
      insertMetadata() {
        api.insertMetadataMaintenance(this.form)
          .then(res => {
            if (res.code === 'code_200') {
              this.$notify({
                tittle: '添加成功!',
                message: '添加成功!',
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.init();
              this.dataMaintainView = false;
              var obj = this.form;
              for (var i in obj) {
                obj[i] = '';
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
      //编辑
      updateMetadata() {
        var self = this;
        api
          .updateMetadataMaintenance({
            id: self.metaDataId,
            metadataName: self.form.metadataName,
            // metadataEnglisName: self.form.metadataEnglisName,
            // dataType: self.form.dataType,
            // dataFormat: self.form.dataFormat,
            explain: self.form.explain,
            // baseLibraryName: self.form.baseLibraryName,
            // baseLibraryId: self.form.baseLibraryId,
            version: self.currentVersion
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.$notify({
                tittle: '编辑成功!',
                message: '编辑成功!',
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.init();
              this.dataMaintainView = false;
              this.resetData();
            } else {
              this.$notify({
                tittle: '编辑失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
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

      resetData() {
        if (this.addType == 1) {
          this.$refs.addFormRules.resetFields();
        } else {
          this.form.metadataName = '';
          this.form.explain = '';
        }
      },
      // 搜索
      searchData() {
        this.init();
      },
      cancleModal(type) {
        if (type == 1) {
          this.dataMaintainView = false;
          this.$refs.addFormRules.resetFields();
          this.addType = 0;
        }
        if (type == 2) {
          this.versionInfoView = false;
        }
      },
      handleClick(row, type) {
        var self = this;
        if (type == 1) {
          // 编辑
          self.mainDisabled = true;
          self.dataMaintainView = true;
          self.modalTitle = '编辑元数据';
          self.form.metadataName = row.metadataName;
          self.form.metadataEnglisName = row.metadataEnglisName;
          self.form.dataType = row.dataType;
          self.form.dataFormat = row.dataFormat;
          self.form.explain = row.explain;
          self.form.baseLibraryName = row.baseLibraryName;
          self.metaDataId = row.id;
          self.currentVersion = row.version;
        }
        if (type == 2) {
          self.deleteMetadata(row.id);
        }
        if (type == 3) {
          self.versionInfoView = true;
          self.configTitle = row.metadataName;

          api
            .selectMetadataMaintenanceEdittonKey({
              metadataMaintenanceID: row.id
            })
            .then(res => {
              if (res.code == 'code_200') {
                self.versionData = res.data;
              }
            });
        }
      },
      //    删除
      deleteMetadata(id) {
        this.$confirm('确定要删除选中的元数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn',
          confirmButtonClass: 'yellow-btn',
          type: 'warning',
          center: true
        })
          .then(() => {
            api.deleteMetadataMaintenance({ id: id })
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

      //    详情
      selectAllMetadataKey(id) {
        var self = this;
        api.selectMetadataKey({ id: id })
          .then(res => {
            if (res.code == 'code_200') {
              self.form = res.data;
            }
          });
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.init();
      },
      resetSearch() {
        // 重置
        this.statevoid = '';
        this.selEnName = '';
        this.selChName = '';
        this.init();
      }
    }
  };
</script>

<style lang="less">
  @import "metaDataMaintain.less";

  .zIndex {
    z-index: 3000 !important;
  }
</style>
