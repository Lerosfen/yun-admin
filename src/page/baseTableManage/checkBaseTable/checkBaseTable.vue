<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <list-table-title title="基础表管理/查看基础表"></list-table-title>
    <!-- 1.表基础信息 -->
    <el-row>
      <el-col :offset="3">
        <span class="xuhao">01</span>
        <label for class="bigTitle middle m-r-10 clean_mc">表基础信息</label>
      </el-col>
    </el-row>

    <!-- 表名称 -->
    <el-form label-width="200px" ref="form" :model="form" style="margin-top: 10px">
      <el-row>
        <el-col :span="10" :offset="2" style="margin-left: 77px">
          <div class="grid-content bg-purple collectionData">
            <el-form-item label="表名称" v-model="form.tblName" prop="tblName">
              <div class="input-tpm blue-input m-l-20 new-input">
                <el-input disabled v-model="form.tblName"></el-input>
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
              <div class="input-tpm blue-input m-l-20 new-input">
                <el-input disabled v-model="form.enName"></el-input>
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
              <div class="input-tpm blue-input m-l-20 new-input">
                <el-select disabled v-model="form.belongSto"></el-select>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 2.表字段查看 -->
    <el-row>
      <el-col :offset="3" style="margin-top: -20px">
        <span class="xuhao">02</span>
        <label for class="bigTitle middle m-l-10 clean_mc">表字段</label>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <div class="table-container wordtable-container pag-position" style="margin-top:10px">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-table :data="tableData" stripe height="320">
            <el-table-column
              v-for="item in tableHeader"
              :prop="item.prop"
              :label="item.label"
              :key="item.id"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="主键">
              <template slot-scope="scope">
                <el-radio
                  :label="scope.row.metadataEnglisName"
                  v-model="isPrimaryKey"
                  disabled
                >&nbsp;
                </el-radio>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div class="dialog-footer box-center">
      <el-button class="blue-btn" @click="closeCheck()">关 闭</el-button>
    </div>
  </div>
</template>

<script>
  import api from '../../../../src/api/bigData/daq/baseTableManage';

  export default {
    data() {
      return {
        tableData: [],
        tableHeader: [
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
        form: {
          tblName: '',
          enName: '',
          belongSto: ''
        },
        isPrimaryKey: ''
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        var self = this;
        var data = self.$route.query.data,
          tName = data.tableNames,
          eName = data.tableEnglishNames,
          bStore = data.baseLibraryName,
          tblId = data.id;
        console.log(tblId);
        self.form.tblName = tName;
        self.form.enName = eName;
        self.form.belongSto = bStore;
        // 根据Id查基础表
        api
          .selectBasicTableManagementKey({
            id: tblId
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.tableData = res.data.metadataMaintenance;
              self.isPrimaryKey = res.data.primarykeys;
            }
          });
      },
      closeCheck() {
        this.$router.push({
          path: 'baseTableManage'
        });
      }
    }
  };
</script>

<style scoped lang="less">
  @import "checkBaseTable.less";
</style>


