<template>
  <div class="infoCard">
    <div class="cardtop">
      <div class="peopleName" style="transform: translateY(4px);">{{peopleData.NAME_ZH}}</div>
      <div class="peopleIndex" style="transform: translateY(4px);">{{peopleData.ID}}</div>
    </div>
    <div class="cardMes">
      <div class="peopleImg">
        <div class="img">
          {{peopleData.NAME_ZH}}
        </div>
      </div>
      <div class="rightMes">
        <div class="peopleMes">
          <ul>
            <li>
              <span>性别：</span>
              <span>{{peopleData.SEX}}</span>
            </li>
            <li>
              <span>身份证号码：</span>
              <span>{{peopleData.ID_NUMBER}}</span>
            </li>
            <li>
              <span>民族：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
            <li>
              <span>出生日期：</span>
              <span>{{peopleData.BIRTHDAY}}</span>
            </li>
            <li>
              <span>户口性质：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
            <li>
              <span>文化程度：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
          </ul>
          <ul>
            <li>
              <span>婚姻状况：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
            <li>
              <span>出生地：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
            <li>
              <span>户籍地：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
            <li>
              <span>现居住地：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
            <li>
              <span>电话：</span>
              <span>{{peopleData.NATIVE_PLACE}}</span>
            </li>
          </ul>
        </div>
        <div class="detailButton" @click="showDetail">详细信息</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'infoCard',
    props:['peopleData'],
    data(){
      return{
        /*peopleData:{
          name:"李明",
          id:"-01",
          gender:"男",
          Idcard:"6101124199505556789",
          national:"汉",
          birthday:"1992-01-20",
          home:"城镇",
          culture:"本科",
          marrige:"未婚",
          birthplace:"西安",
          domicile:"西安",
          living:"西安",
          phone:"13545678952"
        }*/
      }
    },


    mounted() {
      //获取当前时间

    },
    methods:{
      //点击详情触发
      showDetail(){

      }
    },
    watch: {

    }
  };
</script>
<style  lang="less">
.infoCard{
 /* height: 47%;
  width: 49%;*/
  background: url("../../assets/img/basicbaseVisul/cardbg.png") no-repeat;
  background-size: 100% 100%;
  margin: 1% 0 0 0;
  .cardtop{
    width: 85%;
    height: 13%;
    margin-left: 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .cardMes{
    width: 100%;
    height: 87%;
    display: flex;
    flex-direction: row;
    .peopleImg{
     /* background: url("../../assets/img/basicbaseVisul/peoplebg.png") no-repeat;*/
      width: 30%;
      height: 50%;
      background-size: contain;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .img{
        width: 40%;
        height: 100%;
        margin-top: 15%;
         background: url("../../assets/img/basicbaseVisul/peoplebg.png") no-repeat;
        background-size: contain;
        text-align: center;
        line-height: 147px;
      }
    }
    .rightMes{
      font-size: 12px;
      .peopleMes{
        display: flex;
        flex-direction: row;
        ul{
          li{
            line-height: 28px;
            list-style-type: none;
            padding: 0;
            margin: 0;
            &:nth-child(even){
              color: #20cbf7;
            }

          }
        }
      }
      .detailButton{
        width: 100px;
        height: 26px;
        background-color: orange;
        border-radius: 5px;
        line-height: 26px;
        text-align: center;
        margin-left: 25%;
        margin-top: -3%;
        cursor: pointer;
      }
    }

  }
}

</style>
