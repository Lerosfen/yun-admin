<template>
  <!-- 这个功能屏蔽了！ -->
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title title="数据填充规则管理/修改规则"></list-table-title>
      <!-- 规则名称 -->
      <el-row>
        <el-col :span="10" :offset="4" style="margin-top:50px">
          <div class="input-group">
            <div class="input-tpm blue-input" style="width:100%">
              <i class="honer-left"></i>
              <el-input v-model="tplName" class="clean_input"></el-input>
              <i class="honer-right"></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 基础库 -->
      <el-row>
        <el-col :span="10" :offset="4" style="margin-top:20px">
          <div class="input-group">
            <div class="input-tpm blue-input" style="width:100%">
              <i class="honer-left"></i>
              <el-select v-model="statevoid" class="clean_input" @change="handleChange">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <i class="honer-right"></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 选择目标表 -->
      <el-row type="flex" align="middle" style="margin-top:17px">
        <el-col :span="8" :offset="4">
          <div class="input-group">
            <div class="input-tpm blue-input" style="width:100%">
              <i class="honer-left"></i>
              <el-input class="clean_input" v-model="targetTbl" disabled></el-input>
              <i class="honer-right"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="3" style="margin-left:10px">
          <el-button class="blue-btn fl choisetab" type="primary" @click="selTargetTbl()">选择目标表</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->

      <div class="table-container pag-position" style="margin-top: 20px">
        <el-row>
          <el-col :span="16" :offset="3">
            <el-table :data="tableData">
              <el-table-column
                v-for="item in headerData"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
              ></el-table-column>
              <el-table-column label="主键">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.sourceTable" v-model="radio">&nbsp;</el-radio>
                  <!-- @change="getCurrentRow(scope,scope.$index)" -->
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <!-- <div class="clearfix m-t-10"> -->
                <template slot-scope="scope">
                  <span class="add-child" @click="selSource">来源</span>
                </template>
                <!-- </div> -->
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 来源 -->

    <yj-dialog :visible.sync="selSourceView" title="配置填充来源" width="53%" :close-on-click-modal="false">
      <div class="search-section clearfix" style="margin-top: 0">
        <el-button class="yellow-btn" @click="addData">新增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-tpm blue-input">
              <i class="honer-left"></i>
              <el-input></el-input>
              <i class="honer-right"></i>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10">查询</div>
        </div>
      </div>

      <div class="table-container pag-position">
        <el-row>
          <el-col :span="24">
            <el-table :data="sourceTblData" style="width: 100%">
              <el-table-column
                v-for="item in sourceTblHead"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
              ></el-table-column>
              <el-table-column label="操作"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click.native="submitUpload">确 定</el-button>
        <el-button class="blue-btn" @click="resetModel()">重 置</el-button>
        <el-button class="yellow-btn" @click="cancleModal(1)">取 消</el-button>
      </div>
    </yj-dialog>

    <!-- 选择来源表 -->
    <yj-dialog
      :visible.sync="selSourceTblView"
      width="53%"
      title="选择来源表"
      :close-on-click-modal="false"
    >
      <div class="search-section clearfix">
        <div class="input-data fl" style="width: 400px">
          <div class="input-tpm blue-input" style="width: 100%">
            <i class="honer-left"></i>
            <el-input placeholder="请输入来源表名称"></el-input>
            <i class="honer-right"></i>
          </div>
        </div>
        <div class="search-right fr" style="margin-top: -1px">
          <div class="add-btn fl yellow m-l-10">查询</div>
        </div>
      </div>

      <div class="table-container pag-position">
        <el-row>
          <el-col>
            <el-table :data="sourceTableData" style="100%">
              <el-table-column
                v-for="item in sourceTableHead"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
              ></el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="add-child" @click="selField">选字段</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click.native="submitUpload">确 定</el-button>
        <el-button class="blue-btn" @click="resetModel()">重 置</el-button>
        <el-button class="yellow-btn" @click="cancleModal(2)">取 消</el-button>
      </div>
    </yj-dialog>

    <!-- 选择来源字段 -->
    <yj-dialog
      :visible.sync="selFieldView"
      width="53%"
      title="选择来源字段"
      :close-on-click-modal="false"
    >
      <div class="table-container pag-position">
        <el-row>
          <el-col :span="24">
            <el-table
              ref="multipleTable"
              @select-all="wordCheckAll"
              @select-change="wordChecked"
              :data="sourceFieldData"
              style="100%"
            >
              <el-table-column
                v-for="item in sourceFieldHead"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
              ></el-table-column>
              <el-table-column type="selection" label="操作"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click.native="submitUpload">确 定</el-button>
        <el-button class="blue-btn" @click="resetModel()">重 置</el-button>
        <el-button class="yellow-btn" @click="cancleModal(3)">取 消</el-button>
      </div>
    </yj-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tplName: "",
      targetTbl: "",
      statevoid: "",
      statusList: [
        {
          id: 1,
          name: "人口库"
        },
        {
          id: 2,
          name: "法人库"
        },
        {
          id: 3,
          name: "电子证照库"
        },
        {
          id: 4,
          name: "宏观经济库"
        },
        {
          id: 5,
          name: "空间地理库"
        },
        {
          id: 6,
          name: "权利事项库"
        },
        {
          id: 7,
          name: "信用库"
        }
      ],
      headerData: [
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
        }
      ],
      radio: "",
      tableData: [
        {
          enName: "name",
          chName: "姓名",
          dataType: "字符型",
          dataFormat: "a..30"
        }
      ],
      selSourceView: false,
      sourceTblData: [],
      sourceTblHead: [
        {
          prop: "chName",
          label: "表中文名称"
        },
        {
          prop: "tblEnName",
          label: "表英文名称"
        },
        {
          prop: "fieldName",
          label: "字段名"
        },
        {
          prop: "enName",
          label: "英文名"
        },
        {
          prop: "dataType",
          label: "数据类型"
        },
        {
          prop: "tblLength",
          label: "长度"
        }
      ],
      selSourceTblView: false,

      sourceTableHead: [
        {
          prop: "tblName",
          label: "表名称"
        },
        {
          prop: "enName",
          label: "英文名称"
        }
      ],
      sourceTableData: [
        {
          tblName: "人口信息表",
          enName: "RKXXB"
        }
      ],
      selFieldView: false,
      sourceFieldHead: [
        {
          prop: "enName",
          label: "英文名称"
        },
        {
          prop: "zhName",
          label: "中文名称"
        },
        {
          prop: "dataType",
          label: "数据类型"
        },
        {
          prop: "dataFormat",
          label: "数据格式"
        }
      ],
      sourceFieldData: [
        {
          enName: "name",
          zhName: "姓名",
          dataType: "字符型",
          dataFormat: "a..30"
        },
        {
          enName: "name",
          zhName: "姓名",
          dataType: "字符型",
          dataFormat: "a..30"
        },
        {
          enName: "name",
          zhName: "姓名",
          dataType: "字符型",
          dataFormat: "a..30"
        },
        {
          enName: "name",
          zhName: "姓名",
          dataType: "字符型",
          dataFormat: "a..30"
        },
        {
          enName: "name",
          zhName: "姓名",
          dataType: "字符型",
          dataFormat: "a..30"
        },
        {
          enName: "name",
          zhName: "姓名",
          dataType: "字符型",
          dataFormat: "a..30"
        }
      ]
    };
  },
  mounted() {
    this.tplName = this.$route.query.data.ruleName;
    this.targetTbl = this.$route.query.data.targetTab;
  },
  methods: {
    selTargetTbl() {},
    handleChange() {
      //   console.log(this.statevoid);
    },
    selSource() {
      this.selSourceView = true;
    },
    addData() {
      this.selSourceTblView = true;
    },
    selField() {
      this.selFieldView = true;
    },
    cancleModal(type) {
      if (type == 1) {
        this.selSourceView = false;
      }
      if (type == 2) {
        this.selSourceTblView = false;
      }
      if (type == 3) {
        this.selFieldView = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "modifyFillRule.less";
</style>


