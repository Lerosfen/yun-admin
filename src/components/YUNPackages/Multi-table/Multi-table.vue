<template>
   <div  class="Multi-table">
     <el-table :data="tableData" ref="multipleTable"   @selection-change="handleSelectionChange">
       <el-table-column type="selection"  ></el-table-column>
       <el-table-column
         v-for="item in  wordsheaderData"
         :label="item.label"
         :prop="item.prop"
         :key="item.id"
         :show-overflow-tooltip=true>
       </el-table-column>
     </el-table>
     <!--分页-->
     <div class="model-pag">
       <el-pagination  v-if="tableData.length!=0"
                       :current-page="cleanwordobj.currentPage"
                       :page-size="cleanwordobj.pageSize"
                       @current-change="handleCurrentChange"
                       layout="prev, pager, next"
                       :total="wordstotleNum"
                       prev-text="上一页"
                       next-text="下一页">
       </el-pagination>
     </div>
   </div>
</template>

<script>
export default {
  name: 'Multi-table',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    wordsheaderData: {
      type: Array,
      required: true
    },
    wordstotleNum: {
      type: Number,
      required: true
    },
    selectDatas:{
      type: Array,
      required: true
    },
  },
  data(){
    return {
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id", // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      //清洗字段查询条件；
      cleanwordobj: {
        tableName: '',
        dataSourceId: '',
        currentPage: 1,
        pageSize: 10
      },
    }
  },
  methods:{
    //select选中；
    handleSelectionChange(val){
      console.log(val,'选中')
      this.multipleSelection=val;
      this.changePageCoreRecordData()
    },
      // 切换页，触发父组件
    handleCurrentChange(val){
      // 切换页之前欠调用既已选择；
      this.cleanwordobj.currentPage = val;
      // 触发父组件分页数据；
      this.$emit('chiosecleanWords', this.cleanwordobj.currentPage)
      this.changePageCoreRecordData();
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        this.$emit('ziduanList', this.multipleSelectionAll);
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
        console.log("jinlaile")
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              this.$emit('ziduanList', this.multipleSelectionAll);
              break;
            }
          }
        }
      });
    },
    // 设置选中的方法
    setSelectRow() {
      this.multipleSelectionAll=this.selectDatas;
      console.log('父组件触发',this.selectDatas,this.multipleSelectionAll);
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
        console.log('jg')
      });
      this.$refs.multipleTable.clearSelection();
      this.$nextTick(function() {
        for (var i = 0; i < this.tableData.length; i++) {
          if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
            console.log('jg1',this.tableData[i][idKey])
            this.$refs.multipleTable.toggleRowSelection(this.tableData[i]);
          }
        }
      })

    },
  },
}
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/css/base.less";
</style>
