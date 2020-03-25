<template>
  <!-- 查看-脚本清洗 -->
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <!--列表标题-->
      <list-table-title v-bind:title="titles" v-bind:isBack="false"></list-table-title>
      <div class="search-template cleansAdd">
        <el-row :gutter="20">
          <el-col>
            <el-row>
              <el-col :span="18" :offset="2">
                <div class="input-group">
                  <span class="xuhao">01</span>
                  <label for class="middle m-r-10 clean_mc">/任务名称</label>
                  <div class="input-tpm blue-input new-input" style="margin-top:16px">
                    <el-input
                      disabled
                      v-model="insertObj.strategyName"
                      placeholder
                    ></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="18" :offset="2">
                <div class="input-group">
                  <span class="xuhao">02</span>
                  <label for class="middle m-r-10 clean_mc">/脚本类型</label>
                  <div class="sel-group sel-blue fl new-input" style="margin-top:16px">
                    <el-select
                      disabled
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
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18" :offset="2">
                <div class="input-group">
                  <span class="xuhao">03</span>
                  <label for class="middle m-r-10 clean_mc">/脚本</label>
                  <div class="input-tpm blue-input blue-textarea">
                    <el-input
                      disabled
                      type="textarea"
                      v-model="insertObj.cleaningScript"
                      class="clean_inputArea"
                      style="width:300%"
                      :rows="10"
                      placeholder="请输入内容"
                    ></el-input>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div class="btn-group">
        <el-button class="blue-btn" @click="goBack">关 闭</el-button>
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
        titles: '数据清洗-脚本清洗-查看',
        tableLeixing: [],
        insertObj: {
          strategyName: '',
          cleaningType: '',
          cleaningScript: ''
        }
      };
    },
    computed: {},
    mounted() {
      var data = this.$route.query.data;
      this.insertObj.strategyName = data.strategyName;
      this.insertObj.cleaningType = data.cleaningType;
      this.insertObj.cleaningScript = data.cleaningScript;
    },
    methods: {
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


