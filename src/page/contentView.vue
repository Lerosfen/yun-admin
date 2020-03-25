<template>
  <div ref="mainView" id="mainView" style="overflow:  hidden;">
    <div class="bottom-box">
      <head-nav></head-nav>
      <el-row class="content-sec">
        <el-col :span="4" :offset="1">
          <sider-bar></sider-bar>
        </el-col>
        <el-col :span="17">
          <!--内容区域-->
          <div ref="rightContentHeight" class="rightContent">
            <router-view name="dataView" :key="activeDate"></router-view>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--<div ref ='contentView'  class="content-router">-->

    <!--</div>-->
  </div>
</template>
<script>
  /* eslint-disable */
  import HeadNav from '@/components/headnav/HeadNav';
  import SiderBar from '@/page/SiderBar';
  import useGentleSelect from '../assets/js/jquery-gentleSelect-min';

  export default {
    name: 'MainView',
    components: {
      SiderBar,
      HeadNav
    },
    data() {
      return {
        activeDate: ''
      };
    },
    created() {
      this.activeDate = Date.now();
    },
    mounted() {
      /* eslint-disable */
      const self = this;
      const height = document.documentElement.clientHeight;
      const width = document.documentElement.clientWidth;
      // this.$refs.mainView.style.height = height + 'px';
      this.$refs.rightContentHeight.style.height = height * 0.78 + 'px';
      this.$refs.rightContentHeight.style.width = width * 0.73 + 'px';
      window.onresize = function () {
        let height = document.documentElement.clientHeight;
        // self.$refs.mainView.style.height = height + 'px';
        self.$refs.rightContentHeight.style.height = height * 0.78 + 'px';
      };

      //    const height = this.getWindowHeight().toString();
      //    this.$refs.contentView.style.height = height + 'px';
      //    this.$refs.rightContentHeight.style.height = height*0.77 + 'px';
      //    window.onresize = function(){
      //      const height = self.getWindowHeight();
      //      self.$refs.contentView.style.height = height + 'px';
      //      self.$refs.rightContentHeight.style.height = height*0.77 + 'px';
      //
      //    }
      //    const height = document.documentElement.clientHeight;
      //    this.$refs.contentView.style.height = height + 'px';
      //    this.$refs.rightContentHeight.style.height = height*0.77 + 'px';
      ////    const self = this;
      //    window.onresize = function(){
      //      let height = document.documentElement.clientHeight;
      //      self.$refs.contentView.style.height = height + 'px';
      //      self.$refs.rightContentHeight.style.height = height*0.77 + 'px';
      //
      //    };
    }
  };
</script>
<style lang="less">
  @import "../assets/css/common.less";
  @import "../assets/css/reset.less";
  /*@import "../assets/css/jquery-cron.css";*/
  /*@import "../assets/css/jquery-gentleSelect.css";*/
</style>
<style scoped>
  .content-router {
    margin-top: 40px;
    z-index: 1050;
  }

  #mainView {
    width: 100%;
    background: url("../assets/img/indexView/indexBGI.png") 100% 100% no-repeat;
    position: relative;
    height: 100vh;
  }

  #mainView:before {
    content: "";
    background: url("../assets/img/indexView/systemBox.png") 100% 100%;
    position: absolute;
    opacity: 0.2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .bottom-box {
    position: relative;
    height: 100vh;
  }

  .bottom-box:before {
    content: "";
    /*background: url("../assets/img/indexView/gezi.png") 100% 100%;*/
    position: absolute;
    height: 390px;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .rightContent {
    /* height: calc(100vh - 144px); */
    /* padding-top: 2px; */
    width: 1360px;
    min-width: 950px;
    margin-top: 20px;
  }

  .content-sec {
    margin-top: 60px;
  }

  @media screen and (max-width: 1280px) {
    .rightContent[data-v-68f8c012] {
      width: 930px;
      min-width: 930px;
    }
  }

  @media screen and (max-width: 1152px) {
    .rightContent[data-v-68f8c012] {
      width: 848px;
      min-width: 848px;
    }
  }

  @media screen and (max-width: 1024px) {
    .rightContent[data-v-68f8c012] {
      width: 760px;
      min-width: 760px;
    }
  }
</style>
