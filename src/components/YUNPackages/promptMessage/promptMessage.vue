<template>
  <div class="tooltip">
    <el-tooltip effect="dark" placement="top">
      <div slot="content">
        <p v-for="item in messages" :key="item">{{item}}</p>
      </div>
      <i class="el-icon-question" style="color:#409eff;margin-left:5px;font-size:15px;"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "promptMessage",
  props: ["messages"]
};
</script>