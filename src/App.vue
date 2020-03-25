<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
    <loading v-if='LOADING'/>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import loading from '../src/components/YUNPackages/loading/loading';
  import $ from 'jquery';
export default {
  computed:{
    ...mapState([
      'LOADING'
    ])
  },
  name: 'App',
  data(){
    return{
    };
  },
  components:{
    loading
  },
  mounted(){
    $(window).resize(function(){
      console.log("width:", $(window).width());
      console.log("height:", $(window).height());

      // if($(window).width() < 1375){
      //   $(".sider-container").hide();
      // }else{
      //   $(".sider-container").show();
      // }
      // $(".sider-container").css("width", $(window).width()*0.2);
      // $(".rightContent").css("width", $(window).width()*0.5);
    })
  }
};
</script>


<style  scoped lang="less">
  @import "assets/css/base.less";
  @import "assets/css/global.css";
  @import 'assets/css/ycon.css';
  #app {
    color: #616161;
    width: 100%;
  }

</style>
