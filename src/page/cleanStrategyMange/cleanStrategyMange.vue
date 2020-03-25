<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="title"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button-group>
          <el-button
            class="yellow-btn"
            @click="addMetaData()"
            v-if="btn.insertCleaningStrategy==1"
          >规则清洗
          </el-button>
          <el-button
            class="yellow-btn"
            @click="addMetaDataJ()"
            v-if="btn.insertCleaningStrategy==1"
          >脚本清洗
          </el-button>
        </el-button-group>

        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-data">
              <label class="yellow middle m-r-10">清洗策略名</label>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="cleanrules.strategyName"></el-input>
              </div>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="checkMetaData()">查询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="resetMetaData()">重置</div>
        </div>
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
                v-show="btn.selectCleaningStrategyById==1"
              >查看
              </el-button>
              <el-button
                @click="handleClick(scope.row,4)"
                type="text"
                size="small"
                v-show="btn.sendCleaningStrategy==1 && scope.row.enableState=='禁用'"
              >启用
              </el-button>

              <el-button
                @click="undo(scope.row)"
                type="text"
                size="small"
                v-show="scope.row.enableState=='启用' || scope.row.enableState=='启用中' "
              >撤销
              </el-button>

              <el-button
                @click="handleClick(scope.row,5)"
                type="text"
                size="small"
                v-if="scope.row.enableState=='启用' || scope.row.enableState=='启用中' "
              >禁用
              </el-button>

              <el-button
                @click="handleClick(scope.row,2)"
                type="text"
                size="small"
                v-if="btn.updateCleaningRecord==1 && scope.row.enableState=='禁用'"
              >编辑
              </el-button>
              <el-button
                @click="handleClick(scope.row,3)"
                type="text"
                size="small"
                v-if="btn.deleteCleaningStrategyById==1 && scope.row.enableState=='禁用'"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event)"
          layout="prev, pager, next"
          :total="totleNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
        <!--策略-->
        <Modal title="数据清洗策略-编辑" v-model="stragtegyFormVisible" width="30%" :closable="false" :mask-closable="false">
          <el-form ref="form" :model="form" label-width="140px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="清洗策略名称">
                  <div class="input-tpm blue-input new-input">
                    <el-input placeholder v-model="strategy_mc"></el-input>
                  </div>
                  <!-- <el-input v-model="strategy_mc"   class="cleancelue_input"></el-input> -->
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="是否增量清洗">
                  <div class="input-tpm blue-input">
                    <i class="honer-left"></i>
                    <el-select v-model="addClean" placeholder="请选择">
                      <el-option label="是" value="1"></el-option>
                      <el-option label="否" value="2"></el-option>
                    </el-select>
                    <i class="honer-right"></i>
                  </div>
                  <el-select v-model="addClean" >
                    <el-option label="是" value=""></el-option>
                    <el-option label="否" value=""></el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
            </el-row>
            <!-- <el-row>
                <el-col :span='12'>
                  <el-form-item label="是否定时">
                    <div class="input-tpm blue-input">
                      <i class="honer-left"></i>
                      <el-select v-model="dingshi" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                      </el-select>
                      <i class="honer-right"></i>
                    </div>
                    <el-select v-model="dingshi" >
                      <el-option label="是" value=""></el-option>
                      <el-option label="否" value=""></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
            </el-row>-->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="yellow-btn" type="primary" @click.native="strategySubmit()">确 定</el-button>
            <el-button class="blue-btn" @click="stragtegyFormVisible = false">取 消</el-button>
          </div>
        </Modal>
        <!--删除-->
        <yj-dialog title="数据清洗策略-删除" :visible.sync="removeFormVisible">
          <div>确认删除吗？</div>
          <div slot="footer" class="dialog-footer">
            <el-button class="yellow-btn" type="primary" @click.native="removeSubmit()">确 定</el-button>
            <el-button class="blue-btn" @click="removeFormVisible = false">取 消</el-button>
          </div>
        </yj-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  var qs = require('qs');
  import api from '../../api/bigData/daq/cleanStrategyMange';
  import YjDialog from '../../components/YUNPackages/dialog/modal';

  export default {
    name: 'metaDataSource',
    data() {
      return {
        清洗策略名称: '',
        titleName: '数据源',
        title: '数据清洗策略',
        sourceIp: '',
        currentPage: 1,
        pageSize: 10,
        isVisible: false,
        modalVisible: true,
        tableData: [], // 表数据
        oldTableData: [], // 表数据
        totleNum: 1,

        //按钮判断
        btn: {
          insertCleaningStrategy: 0,
          selectCleaningStrategyById: 0,
          updateCleaningRecord: 0,
          deleteCleaningStrategyById: 0,
          sendCleaningStrategy: 0,
          JyCleaningStrategyById: 0
        },

        headerData: [
          {
            prop: 'strategyName',
            label: '策略名称'
          },
          {
            prop: 'cleaningTable',
            label: '表名称'
          },
          {
            prop: 'srcTableName',
            label: '表中文名称'
          },
          {
            prop: 'cleaningNewTable',
            label: '清洗表名称'
          },
          /*{
              prop: 'dataBaseType',
              label: '是否定时',
            },
            {
              prop: 'timingRules',
              label: '定时规则 ',
            },*/
          {
            prop: 'createTime',
            label: '创建时间'
          },
          /*{
              prop: 'resultState',
              label: '结果状态',
            },*/
          {
            prop: 'createName',
            label: '创建人'
          },
          /*{
              prop: 'createTime',
              label: '创建时间',
            },*/
          /*{
              prop: 'updateTime',
              label: '修改时间',
            }*/
          {
            prop: 'enableState',
            label: '状态'
          },
          {
            prop: 'resultState',
            label: '运行状态'
          },
          {
            prop: 'datanum',
            label: '数据总量'
          }
        ], // 表头数据
        operate: [
          {
            type: 1,
            txt: '查看'
          },
          {
            type: 2,
            txt: '策略'
          },
          {
            type: 3,
            txt: '删除'
          }
        ],
        childHeaderData: [],
        childTableData: [],
        operateChild: [
          {
            type: '1',
            txt: '查看字段'
          }
        ],
        cname: '',
        ip: '',
        metaMainView: true, // 显示子页面
        checkFiled: false, // 表同步查看字段页面
        zxtb: false, // 执行同步
        mainDialog: false, // 新增查看编辑页面
        form: {
          sourceName: '',
          sourceIp: '',
          sourceAccount: '',
          dataBaseType: '',
          sourcePass: '',
          sourcePort: '',
          sourceRemarks: ''
        },
        mainDisabled: false,
        mainDialogBtnType: '', // 1 新增 2 查看 3 编辑
        cleanrules: {
          strategyName: null,
          currentPage: '1',
          pageSize: '10'
        },
        removeFormVisible: false,
        stragtegyFormVisible: false,
        rowId: '',
        strategy_mc: '',
        addClean: '',
        dingshi: '',
        rowmsg: {},
        celueEdit: {
          id: '',
          strategyName: ''
        },
        celueId: ''
      };
    },
    mounted() {
      this.$store.commit('showLoading', true);
      this.getclearstrategyList();
      sessionStorage.removeItem('cleanStrages');
      this.getParams();
    },
    methods: {
      //执行中，当前行置灰,且 删除、 启动 按钮不可点击
      tableRowClassName({ row, resultState }) {
        resultState = row.resultState;
        if (resultState === '执行中') {
          return 'success-row3';
        }
        return '';
      },
      //获取清洗策略list;
      getclearstrategyList() {
        api.clearstrategyList({ currentPage: '1', pageSize: '10' })
          .then(res => {
            if (res.code === 'code_200') {
              this.$store.commit('hideLoading', false);
              if (res.data) {
                res.data.forEach(res => {
                  let newTime = new Date(res.createTime);
                  let newTime1 = new Date(res.updateTime);
                  res.createTime = this.formatDate(newTime, 'yyyy-MM-dd hh:mm');
                  res.updateTime = this.formatDate(newTime1, 'yyyy-MM-dd hh:mm');
                  if (res.enableState == '0') {
                    res.enableState = res.enableState = '启用中';
                  } else {
                    res.enableState = res.enableState == '1' ? '启用' : '禁用';
                  }
                });
                this.tableData = res.data;
                this.tableData.forEach(value => {
                  value.resultState = this.checkRunState(value.resultState);
                });
                this.totleNum = res.page.totalNumber;
              } else {
                this.tableData = [];
              }
              // else {
              //   this.$notify({
              //     tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
              //   });
              // }
            }
          });
      },
      checkRunState(state) {
        if (state == '0') {
          state = '未执行';
        } else if (state == '1') {
          state = '已完成';
        } else if (state == '3') {
          state = '执行中';
        } else if (state == '2') {
          state = '失败';
        }
        return state;
      },
      //按钮权限
      getParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api
          .getcleanparams({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              res.data.forEach(item => {
                if (item.includes('insertCleaningStrategy@POST')) {
                  self.btn.insertCleaningStrategy = 1;
                }
                if (item.includes('selectCleaningStrategyById@GET')) {
                  self.btn.selectCleaningStrategyById = 1;
                }
                if (item.includes('updateCleaningRecord@GET')) {
                  self.btn.updateCleaningRecord = 1;
                }
                if (item.includes('deleteCleaningStrategyById@DELETE')) {
                  self.btn.deleteCleaningStrategyById = 1;
                }
                if (item.includes('sendCleaningStrategy@PUT')) {
                  self.btn.sendCleaningStrategy = 1;
                }
                if (item.includes('JyCleaningStrategyById@PUT')) {
                  self.btn.JyCleaningStrategyById = 1;
                }
              });
            }
          });
      },
      checkclearstrategyList() {
        api.clearstrategyList(this.cleanrules)
          .then(res => {
            if (res.code === 'code_200') {
              if (res.data) {
                res.data.forEach(res => {
                  let newTime = new Date(res.createTime);
                  let newTime1 = new Date(res.updateTime);
                  res.createTime = this.formatDate(newTime, 'yyyy-MM-dd hh:mm');
                  res.updateTime = this.formatDate(newTime1, 'yyyy-MM-dd hh:mm');
                  if (res.enableState == '0') {
                    res.enableState = res.enableState = '启用中';
                  } else {
                    res.enableState = res.enableState == '1' ? '启用' : '禁用';
                  }
                });
                this.tableData = res.data;
                this.totleNum = res.page.totalNumber;
                this.tableData.forEach(value => {
                  value.resultState = this.checkRunState(value.resultState);
                });
              } else {
                this.tableData = [];
              }
              // else {
              //   this.$notify({
              //     tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
              //   });
              // }
            }
            // else{
            //   this.$notify({
            //     tittle: '失败', message: res.msg, type: 'error', offset: 100, duration: this.$store.state.el_Duration
            //   });
            // }
          });
      },
      //当前页；
      handleCurrentChange(e) {
        // alert(e);
        this.cleanrules.currentPage = e;
        this.checkclearstrategyList();
      },
      formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
          );
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        };

        // 遍历这个对象
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length === 1 ? str : this.padLeftZero(str)
            );
          }
        }
        return fmt;
      },
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
      },
      finishDate(e) {
      },
      // 点击选中查看、编辑、表同步
      handleClick(row, type) {
        switch (type) {
          case 1:
            //查看；
            sessionStorage.setItem('cleanStrages', JSON.stringify(row.id));
            this.$router.push({
              path: 'cleanStrategyAdd',
              query: {
                type: 1,
                menuLink: this.$route.query.menuLink
              }
            });
            break;
          case 2:
            //编辑；
            this.stragtegyFormVisible = true;
            this.celueId = row.id;
            this.strategy_mc = '';
            this.addClean = row.resultState;
            this.dingshi = row.enableState;
            break;
          // case 3:
          //   //执行；
          //   this.executeStrategy();
          //   break;
          case 3:
            //删除；

            this.rowId = row.id;
            this.delCleanStragte(row.id);
            break;
          case 4:
            // this.$store.commit("showLoading", true);
            this.AbleStragte(row.id);
            setTimeout(() => {
              this.$notify({ type: 'success', offset: 100, message: '启动成功' });
              this.getclearstrategyList();
            }, 500);
            break;
          case 5:
            this.enableStragte(row.id);
            break;
        }
      },
      // 删除
      delCleanStragte(id) {
        this.$confirm('确认删除该策略吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn',
          confirmButtonClass: 'yellow-btn',
          type: 'warning',
          center: true
        })
          .then(() => {
            api.cleartrategy({ id: id })
              .then(res => {
                if (res.code === 'code_200') {
                  // this.removeFormVisible = false;
                  this.$notify({
                    tittle: '删除成功!',
                    message: '删除成功!',
                    type: 'success',
                    offset: 100,
                    duration: this.$store.state.el_Duration
                  });
                  this.getclearstrategyList();
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
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });
          });
      },
      // 启用
      AbleStragte(id) {
        api.ableClean(qs.stringify({ cleaningStrategyId: id }))
          .then(res => {
            if (res.code == 'code_200') {
              // this.$store.commit("hideLoading", false);
              this.$notify({
                tittle: '成功',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.getclearstrategyList();
            } else if (res.code == 'code_404') {
              // this.$store.commit("hideLoading", false);
              this.$notify({
                tittle: '失败',
                message: '此清洗表已经存在启用任务,请禁用所有已启用的数据',
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            } else {
              // this.$store.commit("hideLoading", false);
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
      // 禁用
      enableStragte(id) {
        api.EnableClean(qs.stringify({ id: id }))
          .then(res => {
            if (res.code == 'code_200') {
              this.$notify({
                tittle: '成功',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.getclearstrategyList();
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },

      undo(row) {
        api.EnableClean(qs.stringify({ id: row.id }))
          .then(res => {
            if (res.code == 'code_200') {
              this.$notify({
                // tittle: "成功",
                message: '撤销成功',
                type: 'success',
                offset: 100
                // duration: this.$store.state.el_Duration
              });
              this.getclearstrategyList();
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },

      // 规则清洗
      addMetaData() {
        this.$router.push({
          path: 'cleanStrategyAdd',
          query: {
            type: 0,
            menuLink: this.$route.query.menuLink
          }
        });
      },
      // 脚本清洗
      addMetaDataJ() {
        this.$router.push({
          path: 'cleansStrategy-addH',
          query: {
            type: 0,
            menuLink: this.$route.query.menuLink
          }
        });
      },
      // 每页显示数据量编辑
      handleSizeChange(val) {
      },
      // 查询
      checkMetaData() {
        this.cleanrules.currentPage = 1;
        this.checkclearstrategyList();
      },
      resetMetaData() {
        // 重置
        this.cleanrules.strategyName = '';
        this.getclearstrategyList();
      },
      //策略；
      strategySubmit() {
        this.celueEdit.id = this.celueId;
        this.celueEdit.strategyName = this.strategy_mc;

        api.caozuoStrategy(this.celueEdit)
          .then(res => {
            if (res.code === 'code_200') {
              this.$notify({
                tittle: '编辑成功！',
                message: '编辑成功！',
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.stragtegyFormVisible = false;
              this.getclearstrategyList();
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
      //执行；
      executeStrategy() {
        api.caozuoZhixing()
          .then(res => {
            if (res.code === 'code_200') {
              this.$notify({
                tittle: '成功',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
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
      //删除；
      removeSubmit() {
      },
      editSubmit() {
        api.cleartrategy({ id: this.rowId })
          .then(res => {
            if (res.code === 'code_200') {
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
      }
    }
  };
</script>

<style lang="less" type="text/less">
  @import "cleanStrategyMange.less";
</style>
