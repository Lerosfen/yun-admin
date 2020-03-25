<template>
  <div ref="loading" id="loading"
       v-loading="loading"
       element-loading-text="加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.5)">
  </div>
</template>

<script>
  export default {
    name: "loading",
    data() {
      return {
        loading: true
      }
    },
  }
</script>

<style scoped>
  #loading {
    position: absolute;
    top: 0;
    z-index: 99999;
    height: 100%;
    width: 100%;
  }
</style>
