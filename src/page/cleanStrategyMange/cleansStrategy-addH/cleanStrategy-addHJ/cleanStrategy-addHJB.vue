<template>
  <!-- 编辑-脚本清洗 -->
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <!--列表标题-->
      <list-table-title v-bind:title="titles" v-bind:isBack="false"></list-table-title>
      <div class="search-template cleansAdd">
        <el-form ref="addForm" :rules="rules" label-width="200px" :model="insertObj">
          <el-row :gutter="20">
            <el-col>
              <el-row>
                <el-col :span="18" :offset="2">
                  <div class="input-group">
                    <span class="xuhao">01</span>
                    <label for class="middle m-r-10 clean_mc">/任务名称</label>
                    <el-form-item prop="strategyName">
                      <div class="input-tpm blue-input new-input" style="margin-top: 16px">
                        <el-input v-model="insertObj.strategyName" placeholder></el-input>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="18" :offset="2">
                  <div class="input-group">
                    <span class="xuhao">02</span>
                    <label for class="middle m-r-10 clean_mc">/脚本类型</label>
                    <el-form-item prop="cleaningType">
                      <div class="sel-group sel-blue fl new-input" style="margin-top: 16px">
                        <el-select
                          v-model="insertObj.cleaningType"
                          placeholder="全部"
                        >
                          <el-option
                            v-for="item in tableLeixing"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="18" :offset="2">
                  <div class="input-group">
                    <span class="xuhao">03</span>
                    <label for class="middle m-r-10 clean_mc">/脚本</label>
                    <el-form-item prop="cleaningScript">
                      <div class="input-tpm blue-input blue-textarea">
                        <el-input
                          type="textarea"
                          v-model="insertObj.cleaningScript"
                          class="clean_inputArea"
                          style="width:300%"
                          :rows="10"
                          placeholder="请输入内容"
                        ></el-input>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="btn-group">
        <el-button class="yellow-btn" @click="addSubmit()">确 定</el-button>
        <el-button class="blue-btn" @click="goBack">取 消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  var qs = require('qs');
  var moment = require('moment');
  import api from '../../../../api/bigData/daq/cleanStrategyMange';
  import Common from '../../../../../config/common';
  import Dialog from '../../../../components/YUNPackages/dialog/dialog';
  import { Collapse } from 'element-ui';

  export default {
    components: {},
    data() {
      return {
        titles: '数据清洗-脚本清洗-编辑',
        tableLeixing: [],
        insertObj: {
          strategyName: '',
          cleaningType: '',
          cleaningScript: '',
          id: ''
        },
        rules: {
          strategyName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          cleaningType: [
            { required: true, message: '请选择脚本类型', trigger: 'blur' }
          ],
          cleaningScript: [{ required: true, message: ' ', trigger: 'blur' }]
        }
      };
    },
    computed: {},
    mounted() {
      var data = this.$route.query.data;
      this.insertObj.id = data.id;
      this.insertObj.strategyName = data.strategyName;
      this.insertObj.cleaningType = data.cleaningType;
      this.insertObj.cleaningScript = data.cleaningScript;
      api.getDatabaseType({ code: 'CLEANING_TYPE' })
        .then(res => {
          if (res.code == 'code_200') {
            this.tableLeixing = res.data;
          }
        });
    },
    methods: {
      addSubmit() {
        this.$refs.addForm.validate(val => {
          if (!val) {
            this.$message({
              message: '请输入完整信息',
              type: 'error'
            });
          } else {
            api.caozuoStrategy(this.insertObj)
              .then(res => {
                if (res.code == 'code_200') {
                  this.$notify({
                    message: '编辑成功',
                    type: 'success'
                  });
                  this.goBack();
                } else {
                  this.$notify({
                    message: '编辑失败',
                    type: 'error'
                  });
                }
              });
          }
        });
      },
      goBack() {
        this.$router.push({
          path: 'cleansStrategy-addH',
          query: { menuLink: this.$route.query.menuLink }
        });
      }
    }
  };
</script>
<style scoped lang="less">
  @import "cleanStrategy-addHJ.less";
</style>


