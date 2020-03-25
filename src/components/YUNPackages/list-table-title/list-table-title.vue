<template>
  <!--列表标题-->
  <div class="list-title clearfix">
    <div class="arr-group">
      <i class="arr-right"></i>
      <i class="arr-right"></i>
      <i class="arr-right"></i>
    </div>
    <div class="fl titles">{{title}}</div>
    <div class="go-back fr" v-if="isBack">
      <div class="square fl"></div>
      <div class="btn-back fr">返回</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default{
    props: {
      title: {
        type: String,
        require: false,
      },
      isBack: {
        type: Boolean,
        require: false,
        default: false,
      }
    },
      methods:{
       
    }
  }


</script>
<style scoped lang="less" type="text/css">
  @import "list-table-title.less";
</style>
