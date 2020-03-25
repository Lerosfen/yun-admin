<template>
  <div class="list-container shadow">
    <!-- 边角 -->
    <table-honer></table-honer>
    <div class="content-section">
      <!-- 标题 -->
      <list-table-title :title="titles"></list-table-title>
      <!-- 基础信息 -->
      <el-row>
        <el-col :offset="3">
          <span class="xuhao">01</span>
          <label for class="bigTitle middle m-r-10 clean_mc">基础信息</label>
        </el-col>
      </el-row>
      <!-- 模板名称 -->

      <el-form
        label-width="200px"
        ref="form"
        :model="form"
        style="margin-top: 10px; margin-left: -30px"
      >


        <el-row>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="模板名称" prop="tplName">
                <div class="input-tpm blue-input m-l-20 new-input">
                  <el-input v-model="form.tplName" disabled></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="模板描述" prop="tplDes">
                <div class="input-tpm blue-input m-l-20 new-input">
                  <el-input v-model="form.tplDes" disabled></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="所属基础库" prop="baseStore">
                <div class="input-tpm blue-input m-l-20 new-input">
                  <el-select v-model="form.baseStore" disabled>
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

      <!-- 信息项 -->
      <el-row>
        <el-col :offset="3" style="margin-top: -20px">
          <span class="xuhao">02</span>
          <label for class="bigTitle middle m-l-10 clean_mc">信息项</label>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-table :data="metaDatatblData" height="220">
              <el-table-column
                v-for="item in metaDataHead"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
              ></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="btn-group">
        <el-button class="blue-btn" @click="goBack()">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../../../src/api/bigData/daq/metaDataTplManage';

  export default {
    data() {
      return {
        titles: '元数据模板管理/查看元数据模板',
        metaDatatblData: [],
        metaDataHead: [
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
        statusList: [],
        form: {
          tplName: '',
          tplDes: '',
          baseStore: ''
        }
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        // 显示加载中
        var self = this;
        self.$store.commit('showLoading', true);
        var tName = self.$route.query.row.templateName,
          tDes = self.$route.query.row.templateDescription,
          tStore = self.$route.query.row.baseLibraryName,
          tplId = self.$route.query.row.id;
        self.form = {
          tplName: tName,
          tplDes: tDes,
          baseStore: tStore
        };
        api
          .selectMetadataTemplateKey({
            id: tplId
          })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              self.metaDatatblData = res.data.metadataMaintenance;
            }
          });
      },
      //返回
      goBack() {
        this.$router.push({
          path: 'metaDataTplManage',
          query: {
            menuLink: this.$route.query.menuLink
          }
        });
      }
    }
  };
</script>
<style scoped lang="less">
  @import "checkMetaDataTpl.less";
</style>


