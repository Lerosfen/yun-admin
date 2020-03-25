<template>
  <div class="visheadNav">
      <div class="headContent">
        <div class="totalVistor">
          <div class="vistorNum">{{vistorNum}}</div>
          <div class="numCard" v-for="(cell,index)  in  cellData"   :key="index">
            <div class="cellblock">{{cell.number}}</div>
          </div>
          <div class="visitorUnit">{{unit}}</div>
        </div>
        <div class="sysTitle">
          {{sysTitle}}
        </div>
        <div class="time">
          <div class="currentTime">
            <div class="dayTime" id="dayTime"></div>
            <img src="../../assets/img/basicbaseVisul/time.png">
            <div class="nowTime" id="nowTime"></div>
          </div>
          <div class="timeLine"></div>
          <router-link to="/daq/baseStoreManage">
            <div class="returnback">{{returnback}}</div>
          </router-link>
        </div>
      </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';

  export default {
    name: 'HeadNav',
    data(){
      return{
        vistorNum:"累计访问数据",
        sysTitle:"政务大数据平台云服务",
        returnback:"返回",
        unit:"GB",
        cellData: [
          {number:7},
          {number:8},
          {number:5},
          {number:2},
          {number:2},
          {number:4},
          {number:4}
        ],
      }
    },


    mounted() {
      //获取当前时间
      var self = this;
      setInterval(function() {self.mytime()},1000);
      this.myDate();
    },
    methods:{
       mytime(){
        var newDate = new Date();
        var h = newDate.getHours();
        var m = newDate.getMinutes();
        var s = newDate.getSeconds();
        if(m<10){m="0"+m}else{m}
        if(s<10){s="0"+s}else{s}
        $("#nowTime").html(h+":"+m+":"+s)
      },
      myDate(){
        var myDate = new Date();
        var y = myDate.getFullYear();
        var m = myDate.getMonth()+1;
        var d = myDate.getDate();
        var w = myDate.getDay();
        switch (w){
          case 0:
            w="星期日";
            break;
          case 1:
            w="星期一";
            break;
          case 2:
            w="星期二";
            break;
          case 3:
            w="星期三";
            break;
          case 4:
            w="星期四";
            break;
          case 5:
            w="星期五";
            break;
          case 6:
            w="星期六";
            break;
        }
        $("#dayTime").html(y+"-"+m+"."+d+"/"+w);
      },
    },
    watch: {

    }
  };
</script>
<style  lang="less">
  .visheadNav {
    height: 17%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background: url("../../assets/img/basicbaseVisul/title_bg.png") no-repeat;
    .headContent{
      display: flex;
      background: url("../../assets/img/basicbaseVisul/title_img.png") no-repeat;
      width: 95%;
      background-size: 100%;
      .totalVistor{
        display: flex;
        flex-direction: row;
        letter-spacing: 2px;
        width: 36%;
        .vistorNum{
          margin-top: 5%;
        }
        .numCard{
          height: 45px;
          width: 30px;
          background: url("../../assets/img/basicbaseVisul/num_bg.png") no-repeat;
          margin-top: 4%;
          text-align: center;
          background-size: contain;
          margin-inline-start: 1%;
          .cellblock{
            margin-top: 25%;
          }
        }
        .visitorUnit{
          margin-top: 8%;
          font-size: 13px;
        }
      }
      @font-face {
        font-family: 'PMZDT';  //旁门正道体
        src: url('../../assets/css/PMZDT.ttf');  //引入字体
        font-weight: normal;
        font-style: normal;
      }
      .sysTitle{
        font-family: PMZDT;
        font-size: 30px;
        background-size: contain;
        line-height: 80px;
        letter-spacing: 5px;
        text-indent: 38px;
        position: absolute;
        margin-left: 37%;
       /* position: absolute;
        margin-left: 40%;*/
      }
      .time{
        position: absolute;
        margin-left: 78.5%;
        margin-top: 1%;
        width: 18%;
        height: 60%;
        .currentTime{
          display: flex;
          margin-left: 5%;
          .dayTime{

          }
          img{
            margin-left: 10%;
            margin-right: 3%;
          }
          .nowTime{

          }
        }
        .timeLine{
          background: url("../../assets/img/basicbaseVisul/time_line.png") no-repeat;
          height: 12%;
          width: 90%;
          background-size: contain;
        }
        .returnback{
          height: 30px;
          width: 158px;
          border: solid 1px #0b5791;
          border-radius: 50px;
          background-color: #0c263d;
          line-height: 30px;
          text-align: center;
          letter-spacing: 10px;
          margin-left: 38%;
          cursor: pointer;
        }
      }
    }
  }


  @media screen and (max-width: 1600px) {
    .headNav-logo {
      position: absolute;
      left: 43%;
      top: 0;
      transform: translateX(-50%);
      cursor: pointer;
    }

    .head-btn-long {
      display: inline-block;
      background: url("../../assets/img/headNav/longBtn.png") 100% 100% no-repeat;
      width: 215px;
      height: 35px;
      background-size: 100% 100%;
    }

    .align-center span {
      display: inline-block;
      // margin-right: 8px;
      font-size: 14px;
    }

    .head-user {
      width: 20px;
      height: 20px;
      margin-left: 30px;
      background: url(../../assets/img/icon/user.png) 100% 100% no-repeat;
      background-size: 100%;
    }

    .header-close {
      width: 20px;
      height: 20px;
      background: url(../../assets/img/icon/backIcon.png) 100% 100% no-repeat;
      margin-left: 25px;
      background-size: 100%;
    }

    .header-search {
      width: 20px;
      height: 20px;
      background: url(../../assets/img/icon/search.png) 100% 100% no-repeat;
      margin-left: 25px;
      background-size: 100%;
    }

    .head-btn-sort {
      display: inline-block;
      background: url("../../assets/img/headNav/sortBtn.png") 100% 100% no-repeat;
      width: 125px;
      height: 35px;
      background-size: 100%;
    }

  }

</style>
