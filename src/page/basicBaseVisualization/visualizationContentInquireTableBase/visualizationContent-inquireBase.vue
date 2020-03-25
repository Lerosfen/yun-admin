<template>
  <div class="queryBase">
    <div class="search_condition">
      <div class="condition">
        <span class="search_item">分类：</span>
        <select v-model="category" @change="querySource(category)">
          <option v-for="(item,index) in baseList" :key="index" :value="item.category">{{item.category}}</option>
        </select>
        <span class="search_item">来源：</span>
        <select v-model="id" @change="queryConfig(id)">
          <option v-for="(item,num) in sourceList" :key="num" :value="item.id">{{item.basicTableManagementName}}
          </option>
        </select>
      </div>
      <div class="configCondition">
        <div class="search_config">
          <div v-for="(item,index) in configList" :key="index+ '-num'">
            <!--input-->
            <span class="three">{{item.conditionName}}</span><span>:</span>
            <input type="text" v-model="item.inputConditionalform" v-if="item.conditionalformType=='input'"/>
            <!--date-->
            <input type="date" v-model="item.dateConditionalform1" v-if="item.conditionalformType==='date'">
            <span v-if="item.conditionalformType==='date'">-</span>
            <input type="date" v-model="item.dateConditionalform2" v-if="item.conditionalformType==='date'">
            <!--select-->
            <select class="addSelect" v-model="item.selectOptions.cell" v-if="item.conditionalformType==='select'">
              <option :value="cell" v-for="(cell,num) in item.selectOptions" :key="num">{{cell}}</option>
            </select>
          </div>
        </div>
        <div class="search_button" @click="searchResult" v-show="isSourceDone">检索</div>
      </div>
    </div>
    <div class="search_result" v-show="isResultShow">
      <el-table :data="tableData">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column
          v-for="item in tableHeader"
          :label="item.columnZh"
          :prop="item.columnEn"
          :key="item.id"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleChange"
          layout="prev, pager, next"
          :total="totalNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import api from '../../../api/bigData/daq/basicBaseVisulization/visualizationInqueryBase';

  export default {
    data() {
      return {
        id: '',
        cell: '',
        testData: {
          dataList: [
            1,
            {
              1: [{
                NATIVE_PLACE: 'xian',
                NAME_ZH: '王ss',
                ID: '610124',
                ID_NUMBER: '11234556',
                SEX: '男',
                BIRTHDAY: '1020',
                NAME_EN: 'jack',
              },
                {
                  NATIVE_PLACE: 'xian',
                  NAME_ZH: '里',
                  BIRTHDAY: '1020',
                  NAME_EN: 'jack',
                  ID: '610124',
                  ID_NUMBER: '11234556',
                  SEX: '女',
                }]
            }
          ],
          columnsList: [
            {
              columnZh: '身份证号',
              columnEn: 'ID_NUMBER'
            },
            {
              columnZh: '性别',
              columnEn: 'SEX'
            },
            {
              columnZh: '出生日期',
              columnEn: 'BIRTHDAY'
            },
            {
              columnZh: '英文姓名',
              columnEn: 'NAME_EN'
            },
            {
              columnZh: '籍贯',
              columnEn: 'NATIVE_PLACE'
            },
            {
              columnZh: '中文姓名',
              columnEn: 'NAME_ZH'
            },
            {
              columnZh: 'ID',
              columnEn: 'ID'
            }
          ]
        },
        totalPageData: [],
        selectConditionalform: '',
        selectOptions: [],
        inputConditionalform: '',
        dateConditionalform1: '',
        dateConditionalform2: '',
        conditionalform: '',
        baseLibraryID: '167032c855c5401897a47a76cd515453',
        baseId: '',
        category: '',
        isSourceDone: false,
        configList: [],
        baseList: [
          {
            category: '',
          },
          {
            category: '',
          }
        ],
        errbaseList: [
          {
            category: '',
          },
          {
            category: '',
          }
        ],
        basicTableManagementName: '',
        basicTableManagementID: '925a2c0662024c5183864808863e8e4b',
        sourceList: [
          {
            basicTableManagementName: '',
          },
          {
            basicTableManagementName: '',
          }
        ],
        errsourceList: [
          {
            basicTableManagementName: '',
          },
          {
            basicTableManagementName: '',
          }
        ],
        tableHeader: [
          {
            prop: 'queryNames',
            label: '查询名称'
          },
          {
            prop: 'category',
            label: '类别'
          },
          {
            prop: 'baseLibraryName',
            label: '所属库'
          },
          {
            prop: 'basicTableManagementName',
            label: '表'
          },
          {
            prop: 'pageDisplayUrl',
            label: '页面显示位置'
          }
        ],
        tableData: [],
        totalNum: 20,
        currentPage: 1,
        pageSize: 10,
        options: [],
        selectList: [],
        defaultConfigList: [
          {
            conditionName: '构成1',
            conditionalform: '文本框',
            conditionalformType: 'input',
            correspondingField: 'ZB',
            id: 0,
            inputConditionalform: 'inputValue',
            selectConditionalform: 'selectValue',
            dateConditionalform1: 'dateValue',
            dateConditionalform2: 'dateValue',
          },
          {
            conditionName: '构成2',
            conditionalform: '文本框',
            conditionalformType: 'input',
            correspondingField: 'ZB',
            id: 122,
            inputConditionalform: 'inputValue',
            selectConditionalform: 'selectValue',
            dateConditionalform1: 'dateValue',
            dateConditionalform2: 'dateValue',
          },
          {
            conditionName: '构成3',
            conditionalform: '下拉框',
            conditionalformType: 'select',
            correspondingField: 'ZB',
            id: 1,
            inputConditionalform: 'inputValue',
            selectConditionalform: 'selectValue',
            dateConditionalform1: 'dateValue',
            dateConditionalform2: 'dateValue',
          },
          {
            conditionName: '构成4',
            conditionalform: '日期',
            conditionalformType: 'date',
            correspondingField: 'ZB',
            id: 2,
            inputConditionalform: 'inputValue',
            selectConditionalform: 'selectValue',
            dateConditionalform1: 'dateValue',
            dateConditionalform2: 'dateValue',
          }
        ],
        dateList: [],
        showDate: false,
        showSelect: false,
        showInput: false,
        isResultShow: false,
      };
    },
    mounted() {
      var self = this;
      this.$root.Bus.$on('baseId', function (baseId) {
        self.queryInitClassify(baseId);
        self.baseLibraryID = baseId;
      });
      if (this.$route.query.talbaseId != undefined) {
        //查询维护，条件配置需要根据data.id进行查询
        self.queryInitClassify(this.$route.query.talbaseId);
      }
      ;
    },
    created() {

    },
    beforeDestroy() {
      this.$root.Bus.$off('baseId', this.commonId);
    },
    watch: {
      //需要在watch里面监控visBaseLibId的改变

    },
    computed: {
      ...mapGetters(['visBaseLibId'])
    },
    methods: {
      searchResult() {
        var self = this;
        /* var tempparam = self.arrangeParam();*/
        var list = [];
        list.push({
          value: '王10',
          col: 'NAME_ZH',
          type: 'input'
        });
        var tempparam = JSON.stringify(list);
        var datas = {
          dbId: '167032c855c5401897a47a76cd515453',
          tableId: '925a2c0662024c5183864808863e8e4b',
          pageSize: 10,
          jsonStr: tempparam
        };
        /*   api.queryResultTable({
               whereJson:datas
            }).then(res=>{
              if(res.code=='code_200'){
              }
            });*/
        $.ajax({
          type: 'post',
          url: sessionStorage.getItem('ApiUrl') + '/daq-service/hwtj/findMacroPowerByPage',
          data: {
            whereJson: JSON.stringify(datas)
          },
          success: function (data) {
            self.isResultShow = true;
            self.tableHeader = data.data.columnsList;
            self.totalPageData = data.data;
            self.tableData = data.data.dataList[1][1];
            self.totalNum = self.testData.dataList[0];
          }
        });
      },
      //点击search组装参数
      arrangeParam() {
        let tempList = [];
        let param = '';
        this.configList.forEach(item => {
          switch (item.conditionalformType) {
            case 'input':
              tempList.push({
                type: item.conditionalformType,
                value: item.inputConditionalform,
                col: item.correspondingField
              });
              break;
            case 'select':
              var sex = item.selectOptions.cell;
              var sexMark = '';
              if (sex == '男') {
                sexMark = '1';
              } else {
                sexMark = '2';
              }
              ;
              var mapVal = {};
              mapVal[sex] = sexMark;
              var tempParam = JSON.parse(item.selectConditionalform);
              var mapKey = Object.keys(tempParam)[0];
              var finalParam = {};
              finalParam[mapKey] = mapVal;
              //转成JSON
              var finalParamJson = JSON.stringify(finalParam);
              tempList.push({
                type: item.conditionalformType,
                value: finalParamJson,
                col: mapKey
              });
              break;
            case 'date':
              tempList.push({
                  type: 'dateStart',
                  value: item.dateConditionalform1,
                  col: item.correspondingField
                },
                {
                  type: 'dateEnd',
                  value: item.dateConditionalform2,
                  col: item.correspondingField
                });
              break;
          }
        });
        param = JSON.stringify(tempList);
        return param;
      },
      handleChange(val) {
        this.currentPage = val;
        this.tableData = this.totalPageData[1][val];
      },
      //显示分类下拉框内容
      queryClassify(baseId) {
        api.queryClassify({
          pageSize: 100000,
          currentPage: 1,
          baseLibraryId: baseId
        })
          .then(res => {
            if (res.code == 'code_200') {
              if (res.data.length != 0) {
                var name = res.data[0].category;
                this.category = res.data[0].category;
                this.baseList = res.data;
                this.querySource(name);
              } else {
                this.baseList = this.errbaseList;
              }
            }
          });
      },
      //页面初始显示分类下拉框内容
      queryInitClassify(baseId) {
        api.queryClassify({
          pageSize: 100000,
          currentPage: 1,
          baseLibraryId: baseId
        })
          .then(res => {
            if (res.code == 'code_200') {
              if (res.data.length != 0) {
                var id = res.data[0].baseLibraryID;
                var name = res.data[0].category;
                this.category = res.data[0].category;
                this.baseList = res.data;
                this.queryInitSource(id, name);
              } else {
                this.baseList = this.errbaseList;
                this.sourceList = this.errsourceList;
              }
            }
          });
      },
      //页面初始进入显示来源
      queryInitSource(id, name) {
        if (name == '') {
          this.sourceList = this.errsourceList;
        } else {
          api.queryClassify({
            pageSize: 100000,
            currentPage: 1,
            baseLibraryId: id,
            category: name
          })
            .then(res => {
              if (res.code == 'code_200') {
                if (res.data.length != 0) {
                  this.basicTableManagementName = res.data[0].basicTableManagementName;
                  this.sourceList = res.data;
                } else {
                  this.sourceList = this.errsourceList;
                }
              }
            });
        }

      },
      //点击显示来源
      querySource(category) {
        this.configList = [];
        this.isSourceDone = false;
        this.isResultShow = false;
        api.queryClassify({
          pageSize: 100000,
          currentPage: 1,
          baseLibraryId: this.baseLibraryId,
          category: category
        })
          .then(res => {
            if (res.code == 'code_200') {
              if (res.data.length != 0) {
                this.basicTableManagementName = res.data[0].basicTableManagementName;
                this.sourceList = res.data;
              } else {
                this.sourceList = this.errsourceList;
              }
            }
          });
      },
      //点击来源显示后面配置下拉框
      queryConfig(id) {
        this.configList = [];
        api.queryConfig({
          pageSize: 100000,
          currentPage: 1,
          QueryMaintenanceID: id
        })
          .then(res => {
            if (res.code == 'code_200') {
              this.isSourceDone = true;
              var tempList = [];
              console.log('======================');
              console.log(res.data);
              res.data.forEach(function (obj) {
                let tempObj = {};
                let conditionalformType = '';
                tempObj.id = obj.id;
                tempObj.conditionName = obj.conditionName;
                tempObj.conditionalform = obj.conditionalform;
                switch (obj.conditionalform) {
                  case '下拉框':
                    conditionalformType = 'select';
                    tempObj.selectOptions = [];
                    tempObj.selectConditionalform = obj.correspondingField;
                    break;
                  case '3':
                    conditionalformType = 'select';
                    var tempObjChange = JSON.parse(obj.correspondingField);
                    var tempValue = Object.values(tempObjChange);
                    var temp = tempValue[0];
                    var keys = Object.keys(temp);
                    tempObj.selectOptions = keys;
                    tempObj.selectConditionalform = obj.correspondingField;
                    break;
                  case '日期':
                    conditionalformType = 'date';
                    tempObj.dateConditionalform1 = obj.correspondingField;
                    break;
                  case '文本框':
                    conditionalformType = 'input';
                    tempObj.inputConditionalform = obj.correspondingField;
                    break;
                }
                tempObj.conditionalformType = conditionalformType;
                tempObj.correspondingField = obj.correspondingField;
                tempList.push(tempObj);
              });
              this.configList = tempList;
            }
          });
      },


    },
    components: {}
  };
</script>

<style scoped lang="less">
  @import "../../../assets/css/common.less";
  @import "visualizationContent-inquireBase.less";
</style>

