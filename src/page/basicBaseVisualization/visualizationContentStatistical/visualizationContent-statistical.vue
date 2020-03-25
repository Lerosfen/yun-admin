<template>
  <div class="full-vis-statical">
    <div class="vis-statical">
      <component v-if="currentView" :is="currentView"></component>
    </div>
  </div>
</template>

<script>
  import populationBaseCharts from './populationBaseCharts.vue'
  import "../../../assets/js/lodash"
  export default {
    data() {
      return {
        currentView: "populationBaseCharts",
      };
    },
    mounted() {
    },
    components: {
      //声明组件
      populationBaseCharts,
    },
    methods: {
    },
  }
</script>

<style scoped lang="less" type="text/less">
  @import "visualizationContent-statistical.less";
</style>
