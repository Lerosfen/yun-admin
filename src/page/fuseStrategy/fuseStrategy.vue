<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="title"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button-group>
          <el-button class="yellow-btn" @click="addMetaData()" v-if="Btn.insertFuseStrategy==1">列融合</el-button>
          <el-button
            class="yellow-btn"
            @click="checkMetaData()"
            v-if="Btn.insertFuseStrategy==1"
          >行融合</el-button>
        </el-button-group>
        <!--<el-button class="yellow-btn" @click='addMetaData()' >新增</el-button>-->
        <!--<div class="search-right fr">-->
        <!--<div class="input-data fl">-->
        <!--<div class="input-data">-->
        <!--<label class="yellow middle m-r-10">融合机制名称</label>-->
        <!--<div class="input-tpm yellow-input">-->
        <!--<i class="honer-left"></i>-->
        <!--<el-input v-model="cleanRules.strategyName"></el-input>-->
        <!--<i class="honer-right"></i>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="add-btn fl yellow m-l-10" @click="checkMetaData()">-->
        <!--查询-->
        <!--</div>-->
        <!--<div class="add-btn fl yellow m-l-10" @click='resetMetaData()'>-->
        <!--重置-->
        <!--</div>-->
        <!--</div>-->
      </div>

      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-table :row-class-name="tableRowClassName" :data="tableData" style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row,1)"
                type="text"
                size="small"
                v-show="Btn.findByFuseStrategyTableId==1"
              >查看</el-button>
              <el-button
                @click="handleClick(scope.row,2)"
                type="text"
                size="small"
                v-show="scope.row.enableState=='禁用' && Btn.sendFuseStrategy==1"
              >启用</el-button>

              <el-button
                @click="undo(scope.row)"
                type="text"
                size="small"
                v-show="(scope.row.enableState=='启用' || scope.row.enableState=='启用中') && Btn.JyFuseStrategy==1"
              >撤销</el-button>

              <el-button
                @click="handleClick(scope.row,4)"
                type="text"
                size="small"
                v-if="(scope.row.enableState=='启用' || scope.row.enableState=='启用中') && Btn.JyFuseStrategy==1"
              >禁用</el-button>

              <el-button
                @click="handleClick(scope.row,3)"
                type="text"
                size="small"
                v-if="Btn.updateFuseStrategy==1 && scope.row.enableState=='禁用'"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totleNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
        <!--编辑-->
        <yj-dialog title="融合机制-编辑" :visible.sync="stragtegyFormVisible">
          <el-form ref="form" :model="form" label-width="140px">
            <div class="grid-content bg-purple">
              <el-form-item label="融合名称" prop="fuseName">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input placeholder v-model="M_fuseName" disabled></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
            </div>
            <!--<div class="grid-content bg-purple">-->
            <!--<el-form-item label="融合表" prop="fuseTable">-->
            <!--<div class="input-tpm blue-input">-->
            <!--<i class="honer-left"></i>-->
            <!--<el-input placeholder="" v-model="M_fuseTable" disabled></el-input>-->
            <!--<i class="honer-right"></i>-->
            <!--</div>-->
            <!--</el-form-item>-->
            <!--</div>-->
            <!-- <div class="grid-content bg-purple">
                <el-form-item label="启用状态" prop="enableState">
                  <div class="input-tpm blue-input">
                    <i class="honer-left"></i>
                    <el-select v-model="M_fuseState" placeholder="请选择" :disabled="mainDisabled">
                      <el-option label="启用" value="1"></el-option>
                      <el-option label="禁用" value="2"></el-option>
                    </el-select>
                    <i class="honer-right"></i>
                  </div>
                </el-form-item>
            </div>-->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="yellow-btn" type="primary" @click.native="strategySubmit()">确 定</el-button>
            <el-button class="blue-btn" @click="stragtegyFormVisible = false">取 消</el-button>
          </div>
        </yj-dialog>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
var qs = require("qs");
import api from "../../api/bigData/daq/fuseStrategy";

export default {
  data() {
    return {
      title: "数据融合策略",
      sourceIp: "",
      currentPage: 1,
      pageSize: 10,
      isVisible: false,
      modalVisible: true,
      tableData: [], // 表数据
      oldTableData: [], // 表数据
      totleNum: 1,
      M_fuseId: "", //编辑融合机制表主键ID
      M_fuseName: "", //名称
      M_fuseState: "", //状态
      M_fuseTable: "", //表名
      headerData: [
        {
          prop: "fuseName",
          label: "融合名称"
        },
        {
          prop: "fuseTargetTable",
          label: "表名称"
        },
        {
          prop: "fuseTargetTableName",
          label: "表中文名称"
        },
        // {
        //   prop: 'fuseMainTable',
        //   label: '融合主表',
        // },
        // {
        //   prop: 'fuseTable',
        //   label: '融合表 ',
        // },
        {
          prop: "createTime",
          label: "创建时间"
        },
        /*{
            prop: 'updateTime',
            label: '修改时间',
          },*/

        /*{
            prop: 'lastModifier',
            label: '最后操作人',
          },*/
        {
          prop: "createUser",
          label: "创建人"
        },
        {
          prop: "fuseType",
          label: "融合方式"
        },
        {
          prop: "enableState",
          label: "状态"
        },
        {
          prop: "resultState",
          label: "运行状态"
        },
        {
          prop: "datanum",
          label: "数据总量"
        }
      ], // 表头数据
      operate: [
        {
          type: 1,
          txt: "查看"
        },
        {
          type: 2,
          txt: "编辑"
        }
      ],
      childHeaderData: [],
      childTableData: [],
      operateChild: [
        {
          type: "1",
          txt: "查看字段"
        }
      ],
      cname: "",
      ip: "",
      metaMainView: true, // 显示子页面
      checkFiled: false, // 表同步查看字段页面
      zxtb: false, // 执行同步
      mainDialog: false, // 新增查看编辑页面
      form: {
        sourceName: "",
        sourceIp: "",
        sourceAccount: "",
        dataBaseType: "",
        sourcePass: "",
        sourcePort: "",
        sourceRemarks: ""
      },
      mainDisabled: false,
      mainDialogBtnType: "", // 1 新增 2 查看 3 编辑
      cleanRules: {
        currentPage: "1",
        pageSize: "10"
      },
      removeFormVisible: false,
      stragtegyFormVisible: false,
      rowId: "",
      strategy_mc: "",
      addClean: "",
      dingshi: "",
      rowmsg: {},

      //按钮判断
      Btn: {
        insertFuseStrategy: 0,
        findByFuseStrategyTableId: 0,
        updateFuseStrategy: 0,
        sendFuseStrategy: 0,
        JyFuseStrategy: 0
      }
    };
  },
  mounted() {
    this.$store.commit("showLoading", true);
    this._getFuseStrategy();
    this.getfuseParams();
  },
  methods: {
    //执行中，当前行置灰,且 删除、 启动 按钮不可点击
    tableRowClassName({ row, resultState }) {
      resultState = row.resultState;
      if (resultState === "执行中") {
        return "success-row4";
      }
      return "";
    },
    //获取清洗策略list;
    _getFuseStrategy() {
      api.getFuseStrategy(this.cleanRules).then(res => {
        if (res.code === "code_200") {
          this.$store.commit("hideLoading", false);
          res.data.forEach(res => {
            let newTime = new Date(res.createTime);
            let newTime1 = new Date(res.updateTime);
            res.createTime = this.formatDate(newTime, "yyyy-MM-dd hh:mm");
            res.updateTime = this.formatDate(newTime1, "yyyy-MM-dd hh:mm");
            if (res.enableState == 0) {
              res.enableState = "启用中";
            } else {
              res.enableState = res.enableState == 1 ? "启用" : "禁用";
            }
            res.resultState = this.checkRunState(res.resultState);
          });
          res.data.forEach(item => {
            if (item.fuseType == "1") {
              item.fuseType = "行融合";
            } else if (item.fuseType == "0") {
              item.fuseType = "拼接";
            } else if (item.fuseType == "2") {
              item.fuseType = "整合";
            }
          });
          this.tableData = res.data;
          this.totleNum = res.page.totalNumber;
        } else {
          this.$notify({
            tittle: "失败",
            message: res.msg,
            type: "error",
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        }
      });
    },
    checkRunState(state) {
      if (state == "0") {
        state = "未执行";
      } else if (state == "1") {
        state = "已完成";
      } else if (state == "3") {
        state = "执行中";
      } else if (state == "2") {
        state = "失败";
      }
      return state;
    },
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };

      // 遍历这个对象
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          );
        }
      }
      return fmt;
    },
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },

    //按钮权限
    getfuseParams() {
      var self = this;
      let routerParams = self.$route.query.menuLink;
      let sysCode = sessionStorage["sysCode"];
      api
        .getBtnFusePower({ menuLink: routerParams, sysCode: sysCode })
        .then(res => {
          if (res.code === "code_200") {
            console.log("btns", res.data);
            res.data.forEach(item => {
              if (item.includes("insertFuseStrategy@POST")) {
                self.Btn.insertFuseStrategy = 1;
              }
              if (item.includes("findByFuseStrategyTableId@GET")) {
                self.Btn.findByFuseStrategyTableId = 1;
              }
              if (item.includes("updateFuseStrategy@PUT")) {
                self.Btn.updateFuseStrategy = 1;
              }
              if (item.includes("sendFuseStrategy@PUT")) {
                self.Btn.sendFuseStrategy = 1;
              }
              if (item.includes("JyFuseStrategy@PUT")) {
                self.Btn.JyFuseStrategy = 1;
              }
            });
          }
        });
    },

    // 点击选中查看、编辑
    handleClick(row, type) {
      switch (type) {
        case 1:
          //查看；
          if (row.fuseType == "行融合") {
            this.$router.push({
              path: "fuseStrategy-addHC",
              query: {
                menuLink: this.$route.query.menuLink,
                id: row.id
              }
            });
          } else {
            this.$router.push({
              name: "fuseStrategyAdd",
              query: {
                rows: row.id,
                types: type,
                menuLink: this.$route.query.menuLink
              }
            });
          }
          break;
        case 2: //启用；
          this.AbleStragte(row.id);
          // this.stragtegyFormVisible = true;
          // this.M_fuseName = row.fuseName;
          // this.M_fuseId = row.id;
          // this.M_fuseState = row.enableState;
          setTimeout(() => {
            this.$notify({ type: "success", offset: 100, message: "启动成功" });
            this._getFuseStrategy();
          }, 500);
          break;
        case 3: //删除
          // this.stragtegyFormVisible=true
          this.delStrage(row);
          break;
        case 4: //编辑
          this.disableStragte(row.id);
          //           this.stragtegyFormVisible=true
          break;
      }
    },

    // 启用
    AbleStragte(id) {
      // this.$store.commit("showLoading", true);
      api.ableFuse(qs.stringify({ fuseStrategyId: id })).then(
        res => {
          if (res.code == "code_200") {
            // this.$store.commit("hideLoading", false);
            this.$notify({
              tittle: "成功",
              message: res.msg,
              type: "success",
              offset: 100,
              duration: this.$store.state.el_Duration
            });
            this._getFuseStrategy();
          } else {
            // this.$store.commit("hideLoading", false);
            this.$notify({
              tittle: "失败",
              message: res.msg,
              type: "error",
              offset: 100,
              duration: this.$store.state.el_Duration
            });
          }
        },
        err => {
          console.log(err);
          // this.$store.commit("hideLoading", false);
        }
      );
    }, // jinyong
    disableStragte(id) {
      api.disableFuse(qs.stringify({ fuseStrategyId: id })).then(res => {
        if (res.code == "code_200") {
          this.$notify({
            tittle: "成功",
            message: res.msg,
            type: "success",
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          this._getFuseStrategy();
        } else {
          this.$notify({
            tittle: "失败",
            message: res.msg,
            type: "success",
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        }
      });
    },
    undo(row) {
      api.disableFuse(qs.stringify({ fuseStrategyId: row.id })).then(res => {
        if (res.code == "code_200") {
          this.$notify({
            tittle: "成功",
            message: "撤销成功",
            type: "success",
            offset: 100,
            duration: this.$store.state.el_Duration
          });
          this._getFuseStrategy();
        } else {
          this.$notify({
            tittle: "失败",
            message: res.msg,
            type: "success",
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        }
      });
    },

    // 列融合
    addMetaData() {
      let addType = 0;
      //        this.$store.commit('fuseLookType', addType);
      this.$router.push({
        path: "fuseStrategy-add",
        query: {
          types: addType,
          menuLink: this.$route.query.menuLink
        }
      });
    },
    // 行融合
    checkMetaData() {
      let addType = 0;
      //        this.$store.commit('fuseLookType', addType);
      this.$router.push({
        path: "fuseStrategy-addH",
        query: {
          types: addType,
          menuLink: this.$route.query.menuLink
        }
      });
    },
    // 每页显示数据量编辑
    handleSizeChange(val) {
      this.cleanRules.pageSize = val;
      this._getFuseStrategy();
    },

    // 页码编辑
    handleCurrentChange(val) {
      this.cleanRules.currentPage = val;
      this._getFuseStrategy();
    },
    // // 查询
    // checkMetaData() {
    //   this._getFuseStrategy();
    // },
    // resetMetaData() {
    //   // 重置
    //   this.cleanRules.strategyName = "";
    //   this.getclearstrategyList();
    // },
    //编辑确认；
    strategySubmit() {
      api
        .modifyFuseStrategy({
          id: this.M_fuseId,
          enableState: this.M_fuseState
        })
        .then(res => {
          if (res.code === "code_200") {
            console.log(res.data);
            this.stragtegyFormVisible = false;

            this.$notify({
              tittle: "成功",
              message: res.msg,
              type: "success",
              offset: 100,
              duration: this.$store.state.el_Duration
            });
            this._getFuseStrategy();
          } else {
            this.$notify({
              tittle: "失败",
              message: res.msg,
              type: "error",
              offset: 100,
              duration: this.$store.state.el_Duration
            });
          }
        });
    },
    // 删除
    delStrage(row) {
      api
        .delFuseStrategy({
          id: row.id,
          deleteFlag: 2
        })
        .then(res => {
          if (res.code === "code_200") {
            console.log(res.data);
            this.stragtegyFormVisible = false;
            this._getFuseStrategy();
            this.$notify({
              tittle: "成功",
              message: res.msg,
              type: "success",
              offset: 100,
              duration: this.$store.state.el_Duration
            });
          } else {
            this.$notify({
              tittle: "失败",
              message: res.msg,
              type: "error",
              offset: 100,
              duration: this.$store.state.el_Duration
            });
          }
        });
    }
  }
};
</script>
<style  lang="less" type="text/less">
@import "fuseStrategy.less";
</style>
