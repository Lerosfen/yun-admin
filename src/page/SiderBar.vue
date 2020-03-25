<template>
  <div ref="sider_container" class="sider-container" style="position: relative">
    <div class="sider-menu">
      <!--<img src="../assets/img/siderBar/menu-logo.png" alt class="cp-logo" />-->
    </div>

    <div style="overflow-y: scroll;position: relative" ref="slider" class="slider">
      <div v-for="(item, index) in linkData.children" :key="item.id">
        <div :class="[item.showChild? iceYellow:iceBlue]" @click="octagonFn(index)">
          <div class="octagon">
            <div class="octagon-content">
              <p
                class="menuName"
                style="margin: 0;text-align: center;user-select:none;margin-left: -10px;"
              >{{item.cname}}</p>
              <span :class="[item.showChild? yjArrowActive : yjArrowNormal]"></span>
            </div>
          </div>
        </div>
        <transition-group v-if="item.showChild&&item.children.length>0" class="childrenList" style>
          <li
            v-for="list in item.children"
            :key="list.id"
            style="list-style: none"
            v-if="list.menuLink!=''"
          >
            <router-link :to="{path:list.menuLink,query:{menuLink: list.menuLink}}">
              <span class="txtShadow" style="user-select:none;">{{list.cname}}</span>
            </router-link>
          </li>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import api from '../api/bigData/getMeanu';

  export default {
    name: 'SiderBar',
    data() {
      return {
        iceYellow: 'iceYellow',
        iceBlue: 'iceBlue',
        yjArrowNormal: 'yj-arrow-normal',
        yjArrowActive: 'yj-arrow-active',
        meanuData: [],
        linkData: [],
        link: ''
      };
    },
    methods: {
      initMeanu() {
        var sid = sessionStorage.sid;
        api.getMeanu({ sysId: sid })
          .then(res => {
            if (res.code == 'code_200') {
              var list = res.data;
              var firstArr = list.filter(item => {
                return !item.pid;
              });
              firstArr.forEach(e => {
                e.children = [];
                list.forEach(item => {
                  if (e.id == item.pid) {
                    e.children.push(item);
                    e.children.forEach(se => {
                      se.children = [];
                      se.showChild = false;
                      list.forEach(item => {
                        if (se.id == item.pid) {
                          se.children.push(item);
                          se.children.forEach(th => {
                            th.children = [];
                            list.forEach(item => {
                              if (th.id == item.pid) {
                                th.children.push(item);
                              }
                            });
                          });
                        }
                      });
                    });
                  }
                });
              });
              var index = parseInt(sessionStorage['menuIndex']);
              // e.children[0].showChild=true
              //                    console.log('e',e.children)
              //                    debugger
              index
                ? (firstArr[0].children[index].showChild = true)
                : (firstArr[0].children[0].showChild = true);
              this.link = sessionStorage.link;
              this.linkData = firstArr[0];
            }
          });
      },
      octagonFn(index) {
        const self = this;
        sessionStorage['menuIndex'] = index;
        if (this.linkData.children[index].showChild == true) {
          this.linkData.children[index].showChild = false;
          return;
        }
        this.linkData.children.forEach(function (value, indexs) {
          self.linkData.children[indexs].showChild = false;
        });
        this.linkData.children[index].showChild = true;
      }
      // flushCom(){
      //   this.$router.go(0)
      // },
    },
    mounted() {
      this.initMeanu();
      //  this.height = document.documentElement.clientHeight * 0.8 + "px";
      //  this.$refs.sider_container.style.height = this.height;

      const height = document.documentElement.clientHeight;
      this.$refs.sider_container.style.height = height * 0.8 + 'px';
      this.$refs.slider.style.height = height * 0.8 - 110 + 'px';
      window.onresize = function () {
        let height = document.documentElement.clientHeight;
        this.$refs.sider_container.style.height = height * 0.8 + 'px';
        this.$refs.slider.style.height = height * 0.8 - 110 + 'px';
      };
    },
    watch: {
      // '$route':function(to, from) {
      //   this.initMeanu();
      // }
    }
  };
</script>

<style scoped lang="less" type="text/less">
  @import "../assets/css/base";

  @texAlign: center;
  .router-link-active .txtShadow {
    text-shadow: 0 0 30px #FF9600;
    color: #FF9600;
  }

  // .menu-logo{
  //   max-width: 100px;
  //   >img{
  //     width: 100%;
  //     height: 100%;
  //   }
  // }
  .box-center() {
    .positionAbsolute();
    left: 50%;
    transform: translateX(-50%);
  }

  .box-middle-center() {
    .positionAbsolute();
    top: 50%;
    transform: translateY(-50%);
  }

  .box-hor-ver-center {
    .positionAbsolute();
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  .sider-menu {
    position: relative;
    height: 110px;
    border-bottom: 2px solid #009CFF;
    border-radius: 20px;
    // background: url('../assets/img/siderBar/menu-logo.png') no-repeat;
  }

  /*.sider-menu:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 26px;
    top: -12px;
    left: 0;
    background: url("../assets/img/siderBar/menuTop.png") no-repeat;
  }*/
  .sider-menu-head {
    width: 90%;
    .box-hor-ver-center();
  }

  .sider-menu-head-bottom :first-child {
    display: inline-block;
    height: 4px;
    width: 30%;
    background: -prefix-linear-gradient(left, #0aa8f3, #00eef2);
    background: linear-gradient(to right, #0aa8f3, #00eef2);
    border-radius: 4px;
  }

  .sider-menu-head-bottom :last-child {
    display: inline-block;
    height: 5px;
    width: 5px;
    background: #009CFF;
    border-radius: 5px;
  }

  .cp-logo {
    width: 80%;
    height: 70%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .iceBlue {
    width: 89%;
    height: 81px;
    background: url("../assets/img/siderBar/iceBlueReact.png") no-repeat;
    background-size: contain;
    margin: 12px 23px;
  }

  .iceYellow {
    width: 80%;
    height: 81px;
    background: url("../assets/img/siderBar/iceBlueReact.png") no-repeat;
    background-size: contain;
    margin: 15px auto;
  }

  .p(@text-align: @texAlign, @Margin:0 0 0 0) {
    margin: @Margin;
    text-align: @text-align;
  }

  .yj-arrow-right {
    color: @iceBlue;
    margin: 0 20px;
    font-size: 1.5em;
    vertical-align: middle;
  }

  .yj-arrow-right:before {
    content: "\A649";
  }

  .positionRelative() {
    position: relative;
  }

  .positionAbsolute() {
    position: absolute;
  }

  .sider-style(@color: @iceBlue,@borderSize: 1px) {
    text-align: center;
    border: @borderSize solid #009CFF;
    /*-webkit-box-shadow: 0px 0px 100px 0px @color inset;
    box-show: 0px 0px 100px 0px @color inset;*/
  }

  .sider-container {
    /*.sider-style(@iceBlue, 2px);*/
    text-align: center;
    /*height: 681px;*/
    margin-left: 50px;
    margin-right: 30px;
    margin-top: 10px;
    // height: 780px;
    letter-spacing: 2px;
    border-radius: 32px 26px 25px 25px;
    border-top: none;
    background: #fff;
    // height: calc(100vh - 160px);
  }

  .slider {
    // height: calc(100vh - 280px);
    background: url("../assets/img/siderBar/menubg.png") 100% 100% no-repeat !important;
    width: 249px;
    margin-left: -4px;
    margin-top: -1px;
  }

  .sider-choose {
    .sider-style(@iceYellow, 2px);
    width: 100px;
    height: 50px;
  }

  .iceBlue .octagon {
    width: 100%;
    margin: 0;
    height: 81px;
    .positionRelative();
    /* -webkit-box-shadow: 0px 0px 55px 0px @iceBlue inset;
     box-shadow: 0px 0px 55px 0px @iceBlue inset;*/
    box-sizing: border-box;
    border-radius: 22px;
    cursor: pointer;
  }

  .iceBlue .menuIcon {
    display: inline-block;
    background: url("../assets/img/siderBar/blueMenuIcon.png") no-repeat 100% 100%;
    background-size: contain;
    width: 16px;
    height: 8px;
  }

  .iceYellow .octagon {
    width: 100%;
    margin: 0;
    height: 81px;
    .positionRelative();
    /*-webkit-box-shadow: 0px 0px 55px 0px @iceYellow inset;
    box-shadow: 0px 0px 55px 0px @iceYellow inset;*/
    box-sizing: border-box;
    border-radius: 22px;
    cursor: pointer;
  }

  .iceYellow .menuIcon {
    display: inline-block;
    background: url("../assets/img/siderBar/yellowMenuIcon.png") no-repeat 100% 100%;
    background-size: contain;
    width: 16px;
    height: 8px;
  }

  .octagon:active .yj-arrow-normal {
    animation: activeOc 0.2s ease-in-out 0s 1 alternate forwards;
  }

  @keyframes activeOc {
    0% {
      transform: rotate(0deg);
      transform-origin: 50% 50%;
      -ms-transform: rotate(0deg);
      -ms-transform-origin: 50% 50%;
      -moz-transform: rotate(0deg);
      -moz-transform-origin: 50% 50%;
      -webkit-transform: rotate(0deg);
      -webkit-transform-origin: 50% 50%;
      -o-transform: rotate(0deg);
      -o-transform-origin: 50% 50%;
    }
    50% {
      transform: rotate(20deg);
      -ms-transform: rotate(20deg);
      -ms-transform-origin: 50% 50%;
      -moz-transform: rotate(20deg);
      -moz-transform-origin: 50% 50%;
      -webkit-transform: rotate(20deg);
      -webkit-transform-origin: 50% 50%;
      -o-transform: rotate(20deg);
      -o-transform-origin: 50% 50%;
    }
    100% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      background: url("../assets/img/siderBar/left-arrow.png") 100% 100% no-repeat;
    }
  }

  .iceBlue .octagon p:first-child {
    color: #009CFF;
    font-size: 16px;
    font-weight: bold;
    .p(left, 0 0 0 20px);
  }

  .iceYellow .octagon p:first-child {
    color: #009CFF;
    font-size: 16px;
    font-weight: bold;
    .p(left, 0 0 0 20px);
  }

  .octagon-content {
    width: 100%;
    .box-middle-center();
  }

  .yj-arrow() {
    .box-middle-center();
    right: 39px;
    display: inline-block;
    width: 15px;
    height: 13px;
  }

  .yj-arrow-normal {
    .yj-arrow();
    background: url("../assets/img/siderBar/left-arrow.png") 100% 100% no-repeat;
  }

  .yj-arrow-active {
    .yj-arrow();
    background: url("../assets/img/siderBar/left-arrow.png") 100% 100% no-repeat;
    transform: rotate(90deg);
    margin-top: -8px;
  }

  .iceYellow .octagon .menuEName {
    color: #f7ca1e;
    font-family: "Agency FB";
    font-weight: bold;
    .p(left, 0 0 0 20px);
  }

  .iceBlue .octagon .menuEName {
    color: #02878c;
    font-family: "Agency FB";
    font-weight: bold;
    .p(left, 0 0 0 20px);
  }

  .childrenList {
    display: inline-block;
    width: 89%;
    padding: 10px 0;
    border: 2px solid #009CFF;
    /* -webkit-box-shadow: 0px 0px 55px 0px #cca81e inset;
     box-shadow: 0px 0px 55px 0px #cca81e inset;*/
    border-radius: 19px 19px 0 0;
  }

  .childrenList li {
    width: 82%;
    margin: 0 auto;
    border-top: 1px solid #009CFF;
    padding: 10px 0;
    position: relative;
  }

  .childrenList li:before {
    content: "";
    width: 10px;
    height: 3px;
    position: absolute;
    top: -2px;
    left: 0;
    background: #009CFF;
  }

  .childrenList li:after {
    content: "";
    width: 10px;
    height: 3px;
    position: absolute;
    top: -2px;
    right: 0;
    background: #009CFF;
  }

  .childrenList li:first-child {
    margin-top: 10px;
  }

  .childrenList li:last-child {
    border-bottom: 1px solid #009CFF;
    margin-bottom: 10px;
  }

  .childrenList span:last-child:before {
    content: "";
    width: 10px;
    height: 3px;
    position: absolute;
    bottom: -2px;
    left: 0;
    background: #009CFF;
  }

  .childrenList span:last-child:after {
    content: "";
    width: 10px;
    height: 3px;
    position: absolute;
    bottom: -2px;
    right: 0;
    background: #009CFF;
  }

  .childrenList span {
    width: 100%;
    display: inline-block;
    color: #009CFF;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1.5px;
    padding: 2px 0;
  }

  .octagonModel (@color: @iceBlue) {
    width: 100px;
    height: 100px;
    background: @color;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      border-bottom: 29px solid @color;
      border-left: 29px solid rgba(0, 0, 0, 0.5);
      border-right: 29px solid rgba(0, 0, 0, 0.5);
      width: 42px;
      height: 0;
    }
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      border-top: 29px solid @color;
      border-left: 29px solid rgba(0, 0, 0, 0.5);
      border-right: 29px solid rgba(0, 0, 0, 0.5);
      width: 42px;
      height: 0;
    }
  }

  .octagonNormal {
    .octagonModel();
  }

  .octagonChoose {
    .octagonModel(@iceYellow);
  }

  @media screen and (max-width: 1600px) {
    .sider-container {
      width: 200px;
      text-align: center;
      border: 2px solid #009CFF;
      /*-webkit-box-shadow: 0px 0px 100px 0px #01c4c8 inset;*/
      /*box-shadow: 0px 0px 100px 0px #01c4c8 inset;*/
      margin-left: 30px;
      margin-right: 30px;
      margin-top: 10px;
      // height: calc(100vh - 160px);
      // height: 600px;
      letter-spacing: 2px;
      border-radius: 23px 22px 25px 25px;
      border-top: none;
    }

    /*  .sider-menu:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 26px;
        top: -9px;
        left: 0;
        background: url("../assets/img/siderBar/menuTop.png") no-repeat;
        background-size: contain;
      }*/
    .iceBlue .octagon {
      width: 100%;
      margin: 0;
      height: 61px;
      position: relative;
      -webkit-box-shadow: 0px 0px 55px 0px #01c4c8 inset;
      box-shadow: 0px 0px 55px 0px #01c4c8 inset;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 17px;
      cursor: pointer;
    }

    .iceYellow .octagon {
      width: 100%;
      margin: 0;
      height: 61px;
      .positionRelative();
      -webkit-box-shadow: 0px 0px 55px 0px @iceYellow inset;
      box-shadow: 0px 0px 55px 0px @iceYellow inset;
      box-sizing: border-box;
      border-radius: 17px;
      cursor: pointer;
    }

    .iceBlue {
      width: 89%;
      height: 62px;
      background: url("../assets/img/siderBar/iceBlueReact.png") no-repeat;
      background-size: 100% 100%;
      margin: 15px auto;
    }

    .iceYellow {
      width: 80%;
      height: 62px;
      background: url("../assets/img/siderBar/iceBlueReact.png") no-repeat;
      background-size: contain;
      margin: 8px auto;
    }
  }

  @media screen and (max-width: 1280px) {
    .sider-container {
      left: -24%;
      overflow: auto;
    }
  }

  @media screen and (max-width: 1152px) {
    .sider-container {
      left: -31%;
      overflow: auto;
    }
  }

  @media screen and (max-width: 1024px) {
    .sider-container {
      left: -39%;
      overflow: auto;
    }
  }

  .sider-menu {
    background: url("../assets/img/siderBar/menuheader.png") no-repeat !important;
  }
</style>
