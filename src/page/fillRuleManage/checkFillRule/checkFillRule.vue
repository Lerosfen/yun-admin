<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title title="数据填充规则管理/查看规则"></list-table-title>
      <div class="search-template">
        <!-- 规则名称 -->
        <el-row>
          <el-col :span="18" :offset="3" style="margin-top:-40px">
            <div class="input-group">
              <label for class="middle m-r-10 clean_mc bigTitle">
                <span class="xuhao">01</span>基础信息
              </label>
            </div>
            <div class="ulPrt">
              <ul>
                <li>
                  <span class="liName">规则名称:</span>
                  <span class="liChild" v-html="form.ruleName"></span>
                </li>
                <li>
                  <span class="liName">所属库:</span>
                  <span class="liChild" v-html="form.belongSto"></span>
                </li>
                <li>
                  <span class="liName">目标表:</span>
                  <span class="liChild" v-html="form.targetTbl"></span>
                </li>
              </ul>
            </div>
          </el-col>
          <!-- 基础库 -->
          <el-col :span="18" :offset="3" style="margin-top: 10px">
            <div class="input-group">
              <label for class="middle m-r-10 clean_mc bigTitle">
                <span class="xuhao">02</span>目标表信息
              </label>
            </div>
          </el-col>

          <el-row>
            <el-col :span="18" :offset="3">
              <div class="table-container">
                <el-table :data="targetTblData" height="180">
                  <el-table-column
                    v-for="item in targetTblHeader"
                    :prop="item.prop"
                    :label="item.label"
                    :key="item.id"
                  ></el-table-column>
                  <!-- <el-table-column label="主键"></el-table-column> -->
                </el-table>
              </div>
            </el-col>
          </el-row>
          <el-col :span="18" :offset="3">
            <div class="input-group" style="margin-top: -20px">
              <label for class="middle m-r-10 clean_mc bigTitle">
                <span class="xuhao">03</span> 填充表信息
              </label>
            </div>
          </el-col>
          <el-row>
            <el-col :span="18" :offset="3">
              <div class="table-container">
                <el-table :data="fillTblData" height="180">
                  <el-table-column
                    v-for="item in fillTblHeader"
                    :prop="item.prop"
                    :label="item.label"
                    :key="item.key"
                  ></el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <div class="btn-group">
        <el-button class="blue-btn" @click="goBack()">关 闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      targetTblHeader: [
        {
          prop: "enName",
          label: "英文名称"
        },
        {
          prop: "chName",
          label: "中文名称"
        },
        {
          prop: "dataType",
          label: "数据类型"
        },
        {
          prop: "dataFormat",
          label: "数据格式"
        },
        {
          prop: "srcTbl",
          label: "来源表"
        },
        {
          prop: "srcField",
          label: "来源字段"
        }
      ],
      targetTblData: [],
      fillTblHeader: [
        {
          prop: "chName",
          label: "中文名称"
        },
        {
          prop: "enName",
          label: "英文名称"
        },
        {
          prop: "mainTbl",
          label: "主表"
        },
        {
          prop: "mainKey",
          label: "主键"
        },
        {
          prop: "glTbl",
          label: "关联表"
        },
        {
          prop: "glField",
          label: "关联字段"
        }
      ],
      fillTblData: [],
      form: {
        ruleName: "",
        belongSto: "",
        targetTbl: ""
      }
    };
  },
  mounted() {
    var data = this.$route.query.data,
      rName = data.ruleNames,
      bSto = data.baseLibraryName,
      tTbl = data.basicTableManagementName;
    this.form.ruleName = rName;
    this.form.belongSto = bSto;
    this.form.targetTbl = tTbl;
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "fillRuleManage"
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "checkFillRule.less";
</style>


