<template>
  <div class="sel-group">
    <i class="honer-left"></i>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <i class="honer-right"></i>
  </div>
</template>
<script>
/* eslint-disable */
  export default{
    props:{
      options:{
        require: true,
        type: Array,
      }
    },
    data(){
      return {
        titles: "采集策略管理-新增",
        value: ''
      }


    }
  }
</script>
<style lang="less">
/* eslint-disable */
  @import "YJSelect.less";
</style>
