<template>
  <div class="list-container shadow">
    <!-- 边角 -->
    <table-honer></table-honer>
    <div class="content-section">
      <!-- 标题 -->
      <list-table-title :title="titles"></list-table-title>
      <!-- 基础信息维护 -->
      <el-row>
        <el-col :offset="3">
          <span class="xuhao">01</span>
          <label for class="bigTitle middle m-r-10 clean_mc">基础信息维护</label>
        </el-col>
      </el-row>

      <el-form
        label-width="200px"
        :rules="addFormRules"
        ref="addFormRules"
        :model="form"
        style="margin-top: 10px"
      >
        <el-row>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="模板名称" prop="tplName">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入模板名称" v-model="form.tplName"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="模板描述" prop="tplDes">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder="请输入模板描述" v-model="form.tplDes"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="所属基础库" prop="baseStore">
                <div class="input-tpm blue-input new-input">
                  <el-select disabled @change="handleSelChange" v-model="form.baseStore">
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

      <!-- 信息项填充 -->
      <el-row>
        <el-col :offset="3" style="margin-top: -20px">
          <span class="xuhao">02</span>
          <label for class="bigTitle middle m-l-10 clean_mc">信息项填充</label>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6" :offset="4">
          <div class="input-tpm blue-input new-input">
            <el-input placeholder="请选择元数据" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="6" style="margin-top: -20px">
          <el-button class="yellow-btn fl choisetab" type="primary" @click="selMetaData()">选 择</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <div class="table-container wordtable-container pag-position" style="margin-top:0px">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-table :data="infoFillData" height="180">
              <el-table-column
                v-for="item in infoFillHeader"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- <el-button
                    size="small"
                    type="text"
                    :data-index="scope.$index"
                    @click="handleClick(scope.row,1)"
                  >添加</el-button>-->
                  <el-button size="small" type="text" @click="handleClick(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="btn-group footerBtn">
        <el-button class="yellow-btn" @click="tplAddSubmit()">确 定</el-button>
        <el-button class="blue-btn" @click="goBack()">取 消</el-button>
      </div>
    </div>
    <!-- 选择元数据弹框 -->
    <Modal
      title="选择元数据"
      v-model="selMetaDataModal"
      class="cha"
      :closable="false"
      :mask-closable="false"
      width="40%"
    >
      <!-- 查询元数据 -->
      <el-row>
        <el-col :span="14" :offset="4">
          <div class="input-tpm blue-input fr new-input">
            <el-input
              placeholder="请输入元数据英文名称"
              v-model="iptMetaData"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div
            class="add-btn yellow new-btn"
            @click="selByMetaData"
          >查 询
          </div>
        </el-col>
        <el-col :span="3">
          <div class="add-btn yellow new-btn" @click="reset">重 置</div>
        </el-col>
      </el-row>

      <!-- 弹框表格 -->
      <div class="table-container pag-position">
        <el-row>
          <el-col>
            <el-table
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              :data="metaData"
              height="300"
              style="width: 100%"
            >
              <el-table-column width="50" type="selection"></el-table-column>
              <el-table-column
                v-for="item in metaDataHeader"
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
            v-if="true"
            :current-page="cleanAddobj.currentPage"
            :page-size="cleanAddobj.pageSize"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="tabListtotleNum"
            :pager-count="5"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </div>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click="submitMetaData">确 定</el-button>
        <el-button class="blue-btn" @click="cancleModal()">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import api from '../../../../src/api/bigData/daq/metaDataTplManage';

  export default {
    data() {
      return {
        titles: '元数据模板管理/编辑元数据模板',
        tplName: '',
        tplDes: '',
        statevoid: '',
        infoFillData: [],
        infoFillHeader: [
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
        selMetaDataModal: false,
        metaData: [],
        metaDataHeader: [
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
            prop: 'baseLibraryName',
            label: '所属库'
          }
        ],
        radio: '',
        statusList: [],
        form: {
          tplName: '',
          tplDes: '',
          baseStore: ''
        },
        iptMetaData: '',
        currentPage: 1,
        pageSize: 10,
        multipleSelection: [],
        metaDataTplId: '',
        addFormRules: {
          tplName: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ],
          tplDes: [
            { required: true, message: '请输入模板描述', trigger: 'blur' }
          ],
          baseStore: [
            { required: true, message: '请选择基础库', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.init();
      this.selectAllBaseLibrary();
    },
    methods: {
      init() {
        var self = this;
        var tplName = self.$route.query.data.templateName,
          tplDes = self.$route.query.data.templateDescription,
          belongSto = self.$route.query.data.baseLibraryID,
          tplId = self.$route.query.data.id;
        self.form.tplName = tplName;
        self.form.tplDes = tplDes;
        self.form.baseStore = belongSto;
        self.metaDataTplId = tplId;
        api
          .selectMetadataTemplateKey({
            id: tplId
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.infoFillData = res.data.metadataMaintenance;
            }
          });
      },
      selMetaData() {
        var self = this;
        self.selMetaDataModal = true;
        var arr = self.infoFillData;
        var dataList = [];
        arr.forEach(item => {
          dataList.push(item.metadataEnglisName);
        });
        // GET /selectOutsideTemplate 根据元数据模版之外查找元数据
        if (dataList.length == 0) {
          self.selByName('\'\'');
        } else {
          self.selByName(dataList.join(','));
        }
      },
      selByName(params) {
        api
          .selectOutsideTemplate({
            baseLibraryId: this.form.baseStore,
            MetadataMaintenanceNames: params
          })
          .then(res => {
            if (res.code == 'code_200') {
              console.log(res.data);
              this.metaData = res.data;
            }
          });
      },
      cancleModal() {
        this.selMetaDataModal = false;
      },
      //返回
      goBack() {
        this.$router.push({
          path: 'metaDataTplManage',
          query: {
            menuLink: this.$route.query.menuLink
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
      selByMetaData() {
        this.selMetaData();
      },
      reset() {
        this.iptMetaData = '';
        this.selMetaData();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      submitMetaData() {
        var self = this;
        var arr = self.multipleSelection;
        if (arr.length != 0) {
          arr.forEach(item => {
            this.infoFillData.push(item);
          });
          this.selMetaDataModal = false;
        } else {
          //   self.$message({
          //   type: 'error',
          //   message: '请选择元数据'
          // })
        }
      },
      handleClick(i) {
        this.infoFillData.splice(i, 1);
      },
      tplAddSubmit() {
        var self = this;
        var arr = this.infoFillData;
        var metaDataIds = [];
        arr.forEach(item => {
          metaDataIds.push(item.id);
        });

        this.$refs.addFormRules.validate(valid => {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '请填写完整信息',
              customClass: 'zIndex'
            });
            return false;
          } else if (self.infoFillData.length == 0) {
            this.$message({
              type: 'error',
              message: '信息项填充不能为空',
              customClass: 'zIndex'
            });
            return false;
          } else {
            api
              .updateMetadataTemplate({
                id: self.metaDataTplId,
                templateName: self.form.tplName,
                templateDescription: self.form.tplDes,
                baseLibraryID: self.form.baseStore,
                metadataMaintenanceIDS: metaDataIds.join(',')
              })
              .then(res => {
                if (res.code == 'code_200') {
                  this.$notify({
                    tittle: '修改成功!',
                    message: '修改成功!',
                    type: 'success',
                    offset: 100,
                    duration: this.$store.state.el_Duration
                  });
                  self.$router.push({
                    path: 'metaDataTplManage'
                  });
                } else {
                  this.$notify({
                    tittle: '修改失败!',
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
      handleSelChange() {
        var self = this;
        if (self.form.baseStore != '') {
          self.isSelMetaData = false;
        }
        self.infoFillData = [];
      }
    }
  };
</script>
<style lang="less">
  @import "modifyMetaDataTpl.less";

  .zIndex {
    z-index: 3000 !important;
  }
</style>


