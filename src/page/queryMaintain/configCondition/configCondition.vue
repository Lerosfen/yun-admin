<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <list-table-title title="查询维护/配置条件"></list-table-title>
    <div class="right-col">
      <div class="clearfix m-t-10">
        <span class="add-newChild fr" @click="addTblData(1)">新 增</span>
      </div>
    </div>
    <div class="right-table clearfix" style="margin-top: 40px">
      <el-row>
        <el-col :span="24">
          <!--表格提交开始-->
          <el-table :data="tableData" height="450" :row-class-name="rowClassName">
            <el-table-column prop="conditionName" label="条件名称">
              <template slot-scope="scope">
                <div class="input-tpm blue-input new-input">
                  <el-input
                    placeholder="请输入条件名称"
                    :disabled="isCanEdit"
                    v-model="scope.row.conditionName"
                  ></el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="conditionalform" label="条件形式">
              <template slot-scope="scope">
                <div class="input-tpm blue-input new-input">
                  <el-select
                    placeholder="请选择"
                    :disabled="isCanEdit"
                    v-model="scope.row.conditionalform"
                    @change="selConditions(scope.row)"
                  >
                    <el-option
                      v-for="item in formList"
                      :label="item.name"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <span
                  class="add-newOptions"
                  @click="addConditions(scope.row)"
                  v-if="isAddConditionBtn && scope.row.conditionalform == 3"
                >添加选项</span>
              </template>
            </el-table-column>

            <el-table-column prop="field" label="对应字段">
              <template slot-scope="scope">
                <div class="clearfix">
                  <!-- <span>name</span> -->
                  <span class="add-child" @click="selField(scope.row)" :style="scope.row.optionWidth">{{scope.row.chooseOption}}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="handleClick(scope.row, 1)" v-if="isSave">保存</el-button>
                <el-button type="text" @click="handleClick(scope.row, 2)" v-if="isModify">编辑</el-button>-->
                <el-button type="text" @click="handleClick(scope.$index, 3)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--表格提交结尾-->
        </el-col>
      </el-row>
    </div>

    <div class="dialog-footer box-center">
      <el-button class="blue-btn" @click.native="submitUpload(0)">保 存</el-button>
      <el-button class="yellow-btn" @click="goBack">取 消</el-button>
    </div>

    <!-- 选择字段弹框 -->
    <Modal
      v-model="selFieldView"
      title='选择对应字段'
      :closable="false"
      :mask-closable="false"
      width="40%"
    >
      <!--      + ' '+'—' + ' ' + fieldTitle-->
      <el-row>
        <el-col :span="24">
          <div class="table-container pag-position">
            <!-- @select-all="wordCheckAll"
            @select-change="wordChecked"-->
            <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="fieldData" height="300"
                      style="100%">
              <el-table-column
                v-for="item in fieldHeader"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
                v-if="item.label"
              ></el-table-column>
              <!--    <el-table-column type="selection">-->
              <el-table-column label="操 作">
                <template slot-scope="scope">
                  <el-radio
                    :label="scope.row.metadataName"
                    v-model="radio"
                    @click.native="savename(scope.row.metadataEnglisName)">&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
            </el-table>
            <!-- @current-change="handleCurrentChange" -->
            <!-- <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="totalNum"
              prev-text="上一页"
              next-text="下一页"
            ></el-pagination>-->
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" scope="scope">
        <el-button class="blue-btn" @click.native="submitUpload(1)">确 定</el-button>
        <el-button class="blue-btn" @click="resetModel()">重 置</el-button>
        <el-button class="yellow-btn" @click="cancleModal(1)">取 消</el-button>
      </div>
    </Modal>
    <!-- 添加选项弹框 -->
    <yj-dialog
      :visible.sync="addOptionsView"
      :title="'添加下拉框选项'  + ': '+ ConditionTitle"
      :close-on-click-modal="false"
    >
      <div class="search-section">
        <el-row>
          <el-col :span="8">
            <span>Key</span>
            <div class="input-tpm blue-input m-l-10">
              <i class="honer-left"></i>
              <el-input placeholder="请输入Key值" v-model="iptOption.keyVal"></el-input>
              <i class="honer-right"></i>
            </div>
          </el-col>
          <el-col :span="8" :offset="2">
            <span>Value</span>
            <div class="input-tpm blue-input m-l-10">
              <i class="honer-left"></i>
              <el-input placeholder="请输入Value值" v-model="iptOption.val"></el-input>
              <i class="honer-right"></i>
            </div>
          </el-col>
          <el-col :span="2" :offset="4">
            <span class="ok_label" @click="addOptions(1)">添 加</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="table-container">
              <el-table :data="optionsData" height="220">
                <el-table-column
                  v-for="item in optionsHeader"
                  :prop="item.prop"
                  :label="item.label"
                  :key="item.id"
                ></el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <div>
                      <span
                        :data-index="scope.$index"
                        @click="delThisRow(scope.$index)"
                        class="move-btn yellow"
                      >删除</span>
                      <span
                        :data-index="scope.$index"
                        @click="turnTop(scope.$index)"
                        v-if="scope.$index!=0"
                        class="move-btn yellow"
                      >上移</span>
                      <span
                        :data-index="scope.$index"
                        @click="turnBottom(scope.$index)"
                        v-if="scope.$index!=optionsData.length-1"
                        class="move-btn yellow"
                      >下移</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click.native="submitUpload(2)">确 定</el-button>
        <el-button class="yellow-btn" @click="cancleModal(2)">取 消</el-button>
      </div>
    </yj-dialog>
  </div>
</template>

<script>
  import api from '../../../api/bigData/daq/configCondition';

  export default {
    data() {
      return {
        conditionalform: '',
        addOptionId: '',
        //条件形式下拉框查询值
        selectOptionVal: '',
        /*conditionName:"",
        conditionForm:"",*/
        // tableHeader: [
        //     {
        //         prop: 'conditionName',
        //         label: '条件名称'
        //     },
        //     {
        //         prop: 'conditionForm',
        //         label: '条件形式'
        //     }
        // ]
        //暂存点击对应字段
        oldCorresField: '',
        //点击对应字段出现弹框后点击radio暂存中文名称
        radioOptionEnName: '',
        radio: '',
        chooseOption: '选 择',
        /* form:[{
           conditionName:"",
           conditionalform:"",
           correspondingField:"",
           id:"",
           queryMaintenanceID:""
         }],*/
        form: [{}, {}],
        formList: [
          {
            id: 1,
            name: '文本框'
          },
          {
            id: 2,
            name: '日期'
          },
          {
            id: 3,
            name: '下拉框'
          }
        ],
        tableData: [],
        selFieldView: false,

        fieldHeader: [
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
        fieldData: [
          {
            metadataEnglisName: 'name',
            metadataName: '姓名',
            dataType: '字符型',
            dataFormat: 'a..30'
          }
          /*{
            enName: "name",
            chName: "姓名",
            dataType: "字符型",
            dataFormat: "a..30"
          },
          {
            enName: "number of ID certificate",
            chName: "身份证",
            dataType: "字符型",
            dataFormat: "an..18"
          },
          {
            enName: "number",
            chName: "数字",
            dataType: "字符型",
            dataFormat: "an..18"
          }*/
        ],
        currentPage: 1,
        pageSize: 10,
        totalNum: 1,
        isSave: true,
        isModify: false,
        isCanEdit: false,
        isAddConditionBtn: false,
        selConditionsVal: '',
        addOptionsView: false,
        optionsHeader: [
          {
            prop: 'keyVal',
            label: 'Key'
          },
          {
            prop: 'val',
            label: 'Value'
          }
        ],
        optionsData: [],
        iptOption: {
          keyVal: '',
          val: ''
        },
        ConditionTitle: '',
        fieldTitle: ''
      };
    },
    mounted() {
      var self = this;
      if (this.$route.query.data != undefined) {
        //查询维护，条件配置需要根据data.id进行查询
        self.queryCondition(this.$route.query.data.id);
        //查询维护点击弹窗用data.tableId
        self.chooseCorrespField(this.$route.query.data.tableId);
      }
    },
    methods: {
      //获取索引信息
      rowClassName({ row, rowIndex }) {
        row.id = rowIndex;
      },
      //数据4
      savename(name) {
        this.radioOptionEnName = name;
      },
      //查询条件配置界面
      queryCondition(id) {
        api.findQueryMainById({
          QueryMaintenanceID: id,
        })
          .then(res => {
            if (res.code == 'code_200') {
              for (var i = 0; i < res.data.length; i++) {
                //数据1
                this.conditionName = res.data[i].conditionName;
                this.conditionalform = res.data[i].conditionalform;
                this.selectOptionVal = res.data[i].correspondingField;
                try {
                  var selectVal = JSON.parse(this.selectOptionVal);
                  var arr = Object.keys(selectVal);
                  this.chooseOption = arr[0];
                } catch (err) {
                  this.chooseOption = res.data[i].correspondingField;
                }
                this.addTblData(0);
                //点击保存
              }
            }
          });
      },
      addTblData(type) {
        var m =
          {
            selectOptionVal: '',
            conditionName: '',
            conditionalform: '',
            correspondingField: '',
            queryMaintenanceID: this.$route.query.data.id
          };
        if (type == 1) {
          m.chooseOption = '选 择';
          m.conditionName = '';
          m.optionWidth = {
            width: '100px',
          };
        } else if (type == 0) {
          if (this.conditionalform == 1) {
            this.conditionalform = '文本框';
          } else if (this.conditionalform == 2) {
            this.conditionalform = '日期';
          } else if (this.conditionalform == 3) {
            this.conditionalform = '下拉框';
          }
          m.conditionName = this.conditionName;
          m.chooseOption = this.chooseOption;
          m.conditionalform = this.conditionalform;
          m.correspondingField = this.chooseOption;
          m.selectOptionVal = this.selectOptionVal;
          m.optionWidth = {
            width: 'auto',
          };
        }
        //数据4
        this.tableData.push(m);
      },
      //点击配置条件界面新增
      selField(cdName) {
        this.selFieldView = true;
        // 弹框标题为条件名称
        this.fieldTitle = cdName.conditionName;
        this.oldCorresField = cdName.id;
      },
      //选择对应字段查询      数据4
      chooseCorrespField(id) {
        api.findCorresField({
          id: id,
        })
          .then(res => {
            this.fieldData = res.data.metadataMaintenance;
          });
      },
      handleClick(row, type) {
        if (type == 1) {
          this.isSave = false;
          this.isModify = true;
          this.isCanEdit = true;
        }
        if (type == 2) {
          // 编辑
          this.isSave = true;
          this.isModify = false;
          this.isCanEdit = false;
        }
        if (type == 3) {
          // 删除
          this.tableData.splice(row, 1);
        }
      },
      cancleModal(type) {
        if (type == 1) {
          this.selFieldView = false;
        }
        if (type == 2) {
          this.addOptionsView = false;
        }
      },
      //配置维护条件保存
      saveConfig(configData) {
        api.insertQueryMainById(configData)
          .then(res => {
            if (res.code === 'code_200') {
              this.$notify({
                tittle: '添加成功!',
                message: '添加成功!',
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              /*self.init();
              self.addMaintainView = false;
              self.resetData();*/
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
      submitUpload(type) {
        var self = this;
        if (type == 0) {
          //配置查询维护保存
          var isNullFlag = false;
          var savaData = this.tableData;
          for (var index in this.tableData) {
            var obj = this.tableData[index];
            if (obj.chooseOption == '' || obj.conditionName == '' || obj.conditionalform == '' || obj.correspondingField == '') {
              isNullFlag = true;
              break;
            }
          }
          if (!isNullFlag) {
            self.saveConfig(savaData);
            self.goBack();
          } else {
            self.$notify({
              tittle: '输入值不能为空',
              type: 'error',
              offset: 100,
              message: '输入值不能为空'
            });
          }

        } else if (type == 1) {
          //点击新增选择后的确定按钮
          this.chooseOption = this.radioOptionEnName;
          this.selFieldView = false;
          //点击条件是下拉框
          this.tableData[this.oldCorresField].chooseOption = this.chooseOption;
          //点击条件形式如果非下拉框
          this.tableData[this.oldCorresField].correspondingField = this.chooseOption;
        } else if (type == 2) {
          //点击下拉框确定
          this.addSelectData();
        }
      },

      //点击下拉框确定保存添加选项    数据3
      addSelectData() {
        var tempContent = {};
        var key = this.chooseOption;
        var tempValue = {};
        tempContent[key] = tempValue;
        for (var i = 0; i < this.optionsData.length; i++) {
          tempValue[this.optionsData[i].keyVal] = this.optionsData[i].val;
        }
        this.addOptionsView = false;
        //点击条件形式为下拉框
        this.tableData[this.addOptionId].correspondingField = JSON.stringify(tempContent);
      },
      goBack() {
        this.$router.push({
          path: 'queryMaintain'
        });
      },
      selConditions(row) {       //数据2
        if (row.conditionalform == 3) {
          this.isAddConditionBtn = true;
        }
        ;
        this.$store.conditionType = row.conditionalform;
      },
      //点击添加选项按钮
      addConditions(cdName) {
        this.addOptionsView = true;
        // 弹框标题为条件名称
        this.ConditionTitle = cdName.conditionName;
        //获取当前列id
        this.addOptionId = cdName.id;
        //点击添加选项显示已有的添加下拉框选项
        this.addOptions(0, this.addOptionId);
      },
      turnTop(index) {
        // 上移
        if (index == 0) {
          return;
        }
        this.optionsData.push(this.optionsData.shift());
      },
      delThisRow(index) {
        // 删除该行
        this.optionsData.splice(index, 1);
        this.delSelectOption();
      },
      //添加下拉框选项删除
      delSelectOption() {
        var selectFinalJson = {};
        var tempJson = {};
        for (var i = 0; i < this.optionsData.length; i++) {
          tempJson[this.optionsData[i].keyVal] = this.optionsData[i].val;
        }
        selectFinalJson[this.radioOptionEnName] = tempJson;
        this.tableData[this.addOptionId].correspondingField = JSON.stringify(selectFinalJson);
      },
      turnBottom(index) {
        // 下移
        if (index == this.optionsData.length - 1) {
          return;
        }
        this.optionsData.unshift(this.optionsData.pop());
      },
      //点击添加按钮新增法人名称
      addOptions(type, id) {
        if (type == 1) {
          var iptKey = this.iptOption.keyVal,
            iptval = this.iptOption.val;
          if (iptKey != '' && iptval != '') {
            this.optionsData.push({
              keyVal: iptKey,
              val: iptval
            });
            this.iptOption = {
              keyVal: '',
              val: ''
            };
          }
        } else if (type == 0) {
          this.optionsData = [];
          for (var i = 0; i < this.tableData.length; i++) {
            if (id == i) {
              try {
                var tempObject = JSON.parse(this.tableData[i].selectOptionVal);
                var mykey = Object.keys(tempObject)[0];
                var val = tempObject[mykey];
                var keys = Object.keys(val);
                var values = Object.values(val);
                for (var x in keys) {
                  var temp = {};
                  temp.keyVal = keys[x];
                  temp.val = values[x];
                  this.optionsData.push(temp);
                }
              } catch (e) {
                console.log(e + '存储为非选择框数据');
              }
            }
          }
        }
      },

      handleSelectionChange(val) {
        /* this.chooseOption = val[0].chName;*/
      },
      resetModel() {
        //清空选中状态
        this.radio = false;
      },
    }
  };
</script>

<style scoped lang="less">
  @import "configCondition.less";
</style>


