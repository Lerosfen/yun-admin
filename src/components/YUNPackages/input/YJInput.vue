<template>
  <div class="input-border " :class="[color]">
    <i class="honer-left"></i>
    <input type="text">
    <i class="honer-right"></i>
  </div>
</template>
<script>
/* eslint-disable */
  export default{
    props: {
      color: {
        require: false,
        type: String,
        default: 'input-yellow',
      },
    },
    data(){
      return {}


    }
  }

</script>
<style lang="less">
/* eslint-disable */
  @import "YJInput.less";
</style>
