<template>
  <!-- 基础表管理 -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!-- 新增搜索 -->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addTable">新 增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入表名称" v-model="selTableName"></el-input>
            </div>
          </div>

          <div class="input-data fl m-l-20">
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder="请输入表英文名称" v-model="selTableEnName"></el-input>
            </div>
          </div>

          <div class="input-data fl m-l-20">
            <!-- <label for=""></label> -->
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

          <div class="add-btn fl yellow m-l-10 new-btn" @click="searchTbl">查 询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="reset">重 置</div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
            :width="item.width"
          ></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row, 1)">查看</el-button>
              <el-button type="text" size="small" @click="handleClick(scope.row, 2)">编辑</el-button>
              <el-button type="text" size="small" @click="handleClick(scope.row, 3)">删除</el-button>
              <!--<el-button type="text" size="small" @click="handleClick(scope.row, 4)">可视化配置</el-button>-->
              <el-button type="text" size="small" @click="handleClick(scope.row, 5)">版本信息</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
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
    <!-- 可视化配置 -->
    <Modal
      v-model="visualConfigView"
      title="配置页面显示字段"
      :closable="false"
      :mask-closable="false"
      width="40%"
    >
      <div class="table-container">
        <el-table
          ref="multipleTable"
          @selection-change="handleChange"
          :data="visualData"
          height="300"
        >
          <el-table-column
            v-for="item in visualHeader"
            :prop="item.prop"
            :label="item.label"
            :key="item.id"
          ></el-table-column>
          <el-table-column type="selection"></el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button class="yellow-btn" type="primary" @click.native="configSubmit">确 认</el-button>
        <!-- <el-button class="yellow-btn" type="primary" @click="resetData">重 置</el-button> -->
        <el-button class="blue-btn" @click="cancleModal(1)">取 消</el-button>
      </div>
    </Modal>

    <!-- 版本信息 -->
    <Modal
      v-model="versionInfoView"
      title="版本信息"
      :closable="false"
      :mask-closable="false"
      width="50%"
    >
      <div class="table-container">
        <el-table :data="versionData" height="310">
          <el-table-column
            v-for="item in versionDataHeader"
            :prop="item.prop"
            :label="item.label"
            :key="item.id"
            :width="item.width"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span class="check-this" @click="checkVersionDetail(scope.row)">详 情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModal(2)">关 闭</el-button>
      </div>
    </Modal>

    <!-- 版本信息详情 -->
    <Modal v-model="versionDetailView" title="版本信息详情" :closable="false" :mask-closable="false" width="50%">
      <div class="table-container">
        <el-table :data="versionDetailData" height="310">
          <el-table-column
            v-for="item in versionDetailHeader"
            :prop="item.prop"
            :label="item.label"
            :key="item.id"
            :width="item.width"
          ></el-table-column>
          <el-table-column label="主键" width="70">
            <template slot-scope="scope">
              <el-radio :label="scope.row.metadataEnglisName" v-model="isPrimaryKey" disabled>&nbsp;</el-radio>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModal(3)">关 闭</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import api from '../../api/bigData/daq/baseTableManage';

  export default {
    data() {
      return {
        titles: '基础表管理',
        selTableName: '',
        selTableEnName: '',
        statevoid: '',
        statusList: [],
        headerData: [
          {
            prop: 'tableNames',
            label: '表名称'
          },
          {
            prop: 'tableEnglishNames',
            label: '英文名称',
            width: 200
          },
          {
            prop: 'primarykeys',
            label: '主键'
          },
          {
            prop: 'baseLibraryName',
            label: '所属基础库'
          },
          {
            prop: 'version',
            label: '版本号'
          }
        ],
        versionDataHeader: [
          {
            prop: 'tableNames',
            label: '表名称'
          },
          {
            prop: 'tableEnglishNames',
            label: '英文名称',
            width: 180
          },
          {
            prop: 'primarykeys',
            label: '主键',
            width: 100
          },
          {
            prop: 'baseLibraryName',
            label: '所属基础库'
          },
          {
            prop: 'version',
            label: '版本号'
          }
        ],
        tableData: [],
        totalNum: 1,
        currentPage: 1,
        pageSize: 10,
        visualConfigView: false,
        visualHeader: [
          {
            prop: 'metadataEnglisName',
            label: '英文名称'
          },
          {
            prop: 'metadataName',
            label: '中文名称'
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
        visualData: [],
        configTitle: '',
        multipleSelection: [],
        // baseLibraryID: ""
        statevoid: '',
        versionInfoView: false,
        versionData: [],
        tblId: '',
        indexList: [],
        versionDetailView: false,
        versionDetailData: [],
        versionDetailHeader: [
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
        isPrimaryKey: ''
      };
    },
    mounted() {
      var self = this;
      self.$store.commit('showLoading', true);
      self.init();
      self.selectAllBaseLibrary();
    },
    // watch: {
    //   multipleTable() {
    //     this.$nextTick(() => {
    // this.$refs.multipleTable.toggleRowSelection(
    //   this.visualData[0],
    //   true
    //       );
    //     });
    //   }
    // },
    methods: {
      init() {
        var self = this;
        api
          .selectAllBasicTableManagement({
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            tableNames: self.selTableName,
            tableEnglishNames: self.selTableEnName,
            baseLibraryID: self.statevoid
          })
          .then(res => {
              if (res.code == 'code_200') {
                self.$store.commit('hideLoading', false);
                self.tableData = res.data;
                self.totalNum = res.page.totalNumber;
              }
            },
            err => {
              self.$store.commit('hideLoading', false);
            });
      },

      addTable() {
        this.$router.push({
          path: 'addBaseTable',
          query: {}
        });
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.init();
      },
      reset() {
        this.selTableName = '';
        this.selTableEnName = '';
        this.statevoid = '';
        this.init();
      },
      delBaseTbl(id) {
        this.$confirm('确定要删除选中的基础表吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn btn-custom-cancel',
          confirmButtonClass: 'yellow-btn btn-custom-confirm', // 以上两个按钮添加btn-custom-XXX来控制按钮位置
          type: 'warning',
          center: true
        })
          .then(() => {
            api.deleteBasicTableManagement({ id: id })
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
          });
      },
      visualConfig(id) {
        // 可视化配置
        var self = this;
        api
          .selectBasicTableManagementField({ basicTableManagementField: id })
          .then(res => {
            self.visualData = res.data;
            self.$nextTick(function () {
              self.visualData.forEach((item, index) => {
                if (item.isNo == 1) {
                  self.$refs.multipleTable.toggleRowSelection(
                    this.visualData[index],
                    true
                  );
                }
              });
            });
          });
      },
      toggleThis() {
        this.$refs.multipleTable.toggleRowSelection(this.visualData[1], true);
      },
      handleClick(row, type) {
        var self = this;
        if (type == 1) {
          self.$router.push({
            path: 'checkBaseTable',
            query: {
              data: row
            }
          });
        }
        if (type == 2) {
          self.$router.push({
            path: 'modifyBaseTable',
            query: {
              data: row
            }
          });
        }
        if (type == 3) {
          // 删除基础表
          self.delBaseTbl(row.id);
        }
        if (type == 4) {
          // 可视化配置
          self.visualConfigView = true;
          self.configTitle = row.tableNames;
          self.visualConfig(row.id);
          self.tblId = row.id;
        }
        if (type == 5) {
          // 版本信息
          self.versionInfoView = true;
          self.configTitle = row.tableNames;
          api
            .selectBasicTableManagementEdition({ basicTableManagementID: row.id })
            .then(res => {
              if (res.code == 'code_200') {
                self.versionData = res.data;
              }
            });
        }
      },
      configSubmit() {
        // 提交可视化配置
        var self = this;
        var arr = self.multipleSelection;
        if (arr.length != 0) {
          var idList = [];
          arr.forEach(item => {
            idList.push(item.id);
          });
          api
            .updateBasicTableManagementField({
              ids: idList.join(','),
              id: self.tblId
            })
            .then(res => {
              if (res.code == 'code_200') {
                self.$notify({
                  tittle: '配置成功!',
                  message: '配置成功!',
                  type: 'success',
                  offset: 100,
                  duration: self.$store.state.el_Duration
                });
                self.visualConfigView = false;
              } else {
                self.$notify({
                  tittle: '配置失败',
                  message: res.msg,
                  type: 'error',
                  offset: 100,
                  duration: self.$store.state.el_Duration
                });
              }
            });
        } else {
          self.$message({
            type: 'error',
            message: '请选择显示字段',
            customClass: 'zIndex'
          });
        }
      },
      // resetData() {
      //   this.statevoid = "";
      //   this.selTableName = "";
      //   this.selTableEnName = "";
      //   this.init();
      // },
      cancleModal(type) {
        if (type == 1) {
          this.visualConfigView = false;
        }
        if (type == 2) {
          this.versionInfoView = false;
        }
        if (type == 3) {
          this.versionDetailView = false;
        }
      },
      handleChange(val) {
        this.multipleSelection = val;
      },
      searchTbl() {
        this.init();
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
      checkVersionDetail(row) {
        var self = this;
        // self
        self.versionDetailView = true;
        api.selectBasicTableManagementEditionKey({ id: row.id })
          .then(res => {
            if (res.code == 'code_200') {
              self.versionDetailData = res.data.metadataMaintenance;
              self.isPrimaryKey = res.data.primarykeys;
            }
          });
      }
    }
  };
</script>

<style lang="less">
  .check-this {
    display: inline-block;
    width: 60px;
    height: 22px;
    line-height: 22px;
    border: 1px solid #009CFF;
    text-align: center;
    box-shadow: 0px 0px 20px 0px rgb(11, 153, 226, .1) inset;
    cursor: pointer;
    position: absolute;
    right: 25%;
    top: 5px;
  }

  .zIndex {
    z-index: 3000 !important;
  }

  @import "baseTableManage.less";
</style>


