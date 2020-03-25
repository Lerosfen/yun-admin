<template>
  <div class="list-container">
    <div class="content-section">
      <list-table-title :title="title"></list-table-title>
      <!-- 表格 -->
      <!--出现白条.table-container-->
      <div class="table-container pag-position">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.columnZh"
            :prop="item.columnEn"
            :key="item.id"
            :show-overflow-tooltip=true>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totleNum"
          prev-text="上一页"
          next-text="下一页">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../api/bigData/daq/basicBaseVisulization/visualizationContentGeneral';
  export default {
    name: 'metaDataSource',
    data() {
      return {
        title: '人口库表',
        currentPage: 1, //第几页
        pageSize: 10,  //一页多少条
        totleNum: 100, //共多少条
        headerData: [],
        tableData: [],
        dataList: [],
        id: '',
      };
    },
    watch: {
      'currentPage':function () {
        //this.$emit('updateInitID', this.initID)
        this.init();
      },
    },
    methods: {
      handleCurrentChange: function (clickPage) {
        var self = this;
        self.currentPage = clickPage;
      },
      init:function () {
        this.findByPage();
      },
      findByPage(){
        var self= this;
        api.findByPage({
          dbId: self.$route.query.id,
          tableId: self.$route.query.tableId,
          pageSize: 10,
        }).then(res=>{
          if(res.code=='code_200'){

            var self =this;
            self.dataList=res.data.dataList;
            self.headerData=res.data.columnsList;
            var self = this;
            var currentPage = self.currentPage;
            self.tableData=self.dataList[1][currentPage];
            //self.allTotleNum=res.page.totalPage;
            //self.modelTotleNum=res.page.totalNumber;
          }else if(res.code=='code_500') {
            var self =this;
            self.dataList ='';
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
      },
    },
    mounted() {
      const self = this;
      self.init();
    },
  };
</script>
<style lang="less" type="text/less">
  @import "../../../assets/css/common.less";
</style>
<style scoped lang="less" type="text/less">
  @import "visualizationContentportrayal-datail.less";
</style>
