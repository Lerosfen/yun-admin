<template>
  <div class="query">
    <!--二级标题部分-->
    <div class="secondTitle">
      <img src="../../../assets/img/basicbaseVisul/secondTitlebg.png">
      <div class="queryBase">{{queryBase}}</div>
    </div>
    <!--搜索框部分-->
    <div class="search-section">
        <div class="searchimg">
          <img src="../../../assets/img/basicbaseVisul/search_bg.png">
        </div>
        <div class="input-tpm blue-input">
          <select v-model="basicTableManagementID"  class="selectBase" @change="getTableId(basicTableManagementID)">
            <option v-for="(cell,index) in baseList" :key="index" class="optionBase" :value="cell.basicTableManagementID">
              {{cell.basicTableManagementName}}
            </option>
          </select>
        </div>
        <input placeholder="请输入姓名、身份证号码家庭住址等，多个关键词用逗号隔开，如：李明，西安" class="selectInput" v-model="selectKey">
        <div class="queryButton" @click="searchMes()">
          查询
        </div>
    </div>
    <!--地球动态图部分-->
    <div class="earth-section" v-show="!isResultPageShow">
      <div class="earthgif">

      </div>
    </div>
    <!--底部背景图片部分-->
    <div class="bottom-section">
    </div>
    <!--查询结果界面-->
    <div class="inqueryResult" v-show="isResultPageShow">
      <div class="resultContent" >
        <div class="resultBlock" v-for="(cell,index) in peoplePage" :key="index">
          <infoCard :peopleData=cell></infoCard>
        </div>
      </div>
      <div class="page" style="margin-top: 10px">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
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
  import infoCard from '@/components/visuliation/infoCard';
  import api from '../../../api/bigData/daq/basicBaseVisulization/visualizationInquery';
    export default {
        data() {
            return {
              peoplePage:[],
              noPeoplePage:[
                {
                  SEX:"暂无数据",
                  ID_NUMBER:"暂无数据",
                  NATIVE_PLACE:"暂无数据",
                  BIRTHDAY:"暂无数据",
                  NAME_ZH:"暂无数据",
                  ID:"暂无数据"
                }
              ],
              totalPageData:[],
              baseId:0,
              tableName:0,
              tableId:0,
              isResultPageShow:false,
              selectKey:"",
              totalNum: 1,
              currentPage: 1,
              pageSize: 4,
              peopleData:{
                NAME_ZH:"李明",
                ID:"-01",
                SEX:"男",
                ID_NUMBER:"6101124199505556789",
                NATIVE_PLACE:"汉",
                BIRTHDAY:"1992-01-20",
                phone:"13545678952"
              },
              queryBase:"人口库查询",
              titles: "",
              basicTableManagementName:"人口表查询",
              basicTableManagementID:"1",
              baseList:[
                {
                  basicTableManagementName:"人口表查询",
                },
                {
                  basicTableManagementName:"婚姻表查询",
                }
              ]
            };
        },
        mounted() {
          var self = this;
          this.$root.Bus.$on("baseId",function (baseId) {
              self.querytableSelect(baseId);
              self.baseId = baseId;
          });
          if(this.$route.query.talbaseId != undefined){
            //查询维护，条件配置需要根据data.id进行查询
            self.isResultPageShow = false;
            self.querytableSelect(this.$route.query.talbaseId);
            self.baseId = this.$route.query.talbaseId;
          }
        },
      beforeDestroy () {
        this.$root.Bus.$off('baseId', this.commonId)
      },
        methods: {
          handleCurrentChange: function(val) {
            this.currentPage = val;
            const tempContent = this.totalPageData[1][val];
            const tempPage = [];
            tempContent.forEach((obj) => {
              tempPage.push(obj.data);
            });
            this.peoplePage = tempPage;
          },
          //点击select获取当前点击表格id
          getTableId(id){
              this.tableId = id;
          },
          //查询
          searchMes(){
            $(".earthgif").addClass("earthgifMove");
            api.queryResultPage({
              pageSize:4,
              tableId:this.tableId,
              keywords:this.selectKey,
            }).then(res=>{
              if(res.code=='code_200'){
                $(".search-section").css("margin-top","-40px");
                $(".bottom-section").css("margin-top","20%");
                // $(".earthgif").removeClass("earthgifMove");
                this.isResultPageShow = true;
                if(res.data.length != 0){
                  this.totalNum = res.data[0] * 4;
                  console.log(this.totalNum);
                  this.totalPageData = res.data;
                  const tempContent = res.data[1][1];
                  const tempPage = [];
                  tempContent.forEach((obj) => {
                    tempPage.push(obj.data);
                  });
                  this.peoplePage = tempPage;
                }else {
                  this.peoplePage = this.noPeoplePage;
                }
              }
            })
          },
          //查询下拉框
          querytableSelect(id){
            api.queryTableName({
              pageSize:100000,
              currentPage: 1,
              baseLibraryId:id
            }).then(res=>{
              if(res.code=='code_200'){
                  if(res.data.length!=0){
                    this.basicTableManagementName = res.data[0].basicTableManagementName;
                    this.baseList = res.data;
                  }
              }
            });
          },
        },
        components:{
          infoCard
        }
    };
</script>

<style scoped lang="less" type="text/less">
  @import "visualizationContent-inquire.less";
  @import "../../../assets/css/common.less";
</style>
