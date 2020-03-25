<template>
  <!--列表-->
  <div class="table-container">
  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      type="selection"
      v-if="ischeck">
    </el-table-column>
    <el-table-column
      v-for="item in headerData"
      :label="item.label"
      :prop="item.prop"
      :key="item.id"
      :formatter="dateFormat">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      v-if="isOperate">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row,list)" type="text" size="small" v-for="list in operate"  :key="1">
          {{list.txt}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--分页-->
  <el-pagination
    layout="prev, pager, next"
    :total="1000"
    prev-text="上一页"
    next-text="下一页">
  </el-pagination>
</div>
</template>

<script>
/* eslint-disable */
import moment from 'moment';
  export default{
    methods: {
      handleClick(row, list){
        console.log(row, list);
      },
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }if(typeof (date)==="number") {
          return moment(date).format("YYYY-MM-DD");
        }
        return date;
      },

    },
    props: {
      tableData: {
        type: Array,
        require: true,
      },
      headerData: {
        type: Array,
        require: true,
      },
      isOperate: {
        type: Boolean,
        require: false,
        default: false,
      },
      operate: {
        type: Array,
        require: false,
      },
      ischeck: {
        type: Boolean,
        require: false,
        default: false,
      }

    },
    data() {
      return {}
    },
    mounted(){
      var self=this;
//     console.log('tttt', self.props.tableData)
    }
  }

</script>
<style  lang="less" type="text/css">
/* eslint-disable */
  @import "list-table.less";
</style>
