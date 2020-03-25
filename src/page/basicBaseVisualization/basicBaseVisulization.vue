<template>
  <!-- 基础库可视化查询 -->
  <div id="basicVisul" ref="basicVisul">
    <visulHeadNav></visulHeadNav>
    <div class="visulContent">
      <div class="contentTitle">
        <div class="searchText">
          <img src="../../assets/img/basicbaseVisul/searchimg.png">
          <div class="search">
            <div class="queryLibrary">{{queryLibraryEn}}</div>
            <div class="queryText">{{queryLibraryCh}}</div>
          </div>
        </div>
        <div class="breadpath">
          <!--<el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          </el-breadcrumb>-->
        </div>
        <div class="baseSelect">
          <div class="selectBlock" @click="showList">
            <div>{{selectName}}</div>
            <img src="../../assets/img/rightList/triangle.png" v-show="!isListShow">
            <img src="../../assets/img/rightList/downtriangle.png" v-show="isListShow">
          </div>
          <ul class="mhide" v-show="isListShow">
            <li v-for="(item,index) in selList" :key="index" class="semenu">
              <div @click="changeList(item)">{{item.name}}</div>
              <img src="../../assets/img/basicbaseVisul/lisep.png">
            </li>
          </ul>
        </div>
        <div class="menuList">
          <ul>
            <div
              v-for="(cell,index)  in  menuList"
              :key="index"
              @click="byValue(cell)"
              class="menuItem"
            >
              <li :class="{active:cell.isActive}" @click="activeFun(cell)">{{cell.pageName}}</li>
            </div>
          </ul>
        </div>
      </div>
    </div>
    <div class="lightContent">
      <div class="advance">
        <div class="advanced_search" v-show="isQueryTbl">
          <img src="../../assets/img/basicbaseVisul/secondTitlebg.png">
          <div>高级搜索</div>
        </div>
        <div class="light"></div>
        <div class="advanced_block" v-show="isQueryTbl"></div>
      </div>
    </div>
    <div class="content">
      <div ref="mainContentHeight" class="mainContent">
        <router-view name="dataView" :byValue="commonId" :address.sync="commonId" :key="activeDate"></router-view>
      </div>
    </div>
    <!--左右刻度线-->
    <div class="rulers ruler-left"></div>
    <div class="rulers ruler-right"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import visulHeadNav from '@/components/headnav/visulHeadNav';
import api from '../../api/bigData/daq/basicBaseVisulization/basicBaseVisulization';

export default {
  name: 'basicBaseVisulization',
  data() {
    return {
      isQueryTbl: false,
      queryLibraryEn: 'RENKOUKU',
      queryLibraryCh: '人口库',
      activeName: 'second',
      isListShow: false,
      baseId: 0,
      // 右侧菜单切换URL
      subMenuUrl: '',
      // 右侧菜单点击选中
      subMenuSelected: '概况',
      selList: [
        {
          id: 1,
          name: '人口库',
        },
        {
          id: 2,
          name: '法人库',
        },
        {
          id: 3,
          name: '电子证照库',
        },
      ],
      selectName: '人口库',
      menuList: [
        {
          pageName: '概况',
          pageurl: 'general',
        },
        {
          pageName: '查询',
          pageurl: 'inquire',
        },
        {
          pageName: '统计',
          pageurl: 'statistical',
        },
        {
          pageName: '预测',
          pageurl: 'forecast',
        },
        {
          pageName: '画像',
          pageurl: 'portrayal',
        },
      ],
      commonId: '',
    };
  },
  methods: {
    ...mapMutations(['SetVisBaseLibId']),
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showList() {
      if (this.isListShow == true) {
        this.isListShow = false;
      } else {
        this.isListShow = true;
      }
    },
    changeList(item) {
      this.$root.Bus.$emit('baseId', item.id);
      // 控制dom显示隐藏
      this.isListShow = false;
      this.selectName = item.name;
      this.queryLibraryCh = item.name;
      this.selectSubMenu(item);
      this.commonId = item.id;
      this.SetVisBaseLibId(item.id);
    },
    // 点击下拉菜单显示右侧菜单高亮
    clickChangeList(menuList) {
      const selectedMenu = this.subMenuSelected;
      menuList.forEach(function (obj) {
        const self = this;
        obj.isActive = false;
        if (obj.pageName == selectedMenu) {
          obj.isActive = true;
        }
      });
    },
    // 右侧菜单点击高亮
    activeFun(data) {
      this.menuList.forEach((obj) => {
        obj.isActive = false;
      });
      data.isActive = !data.isActive;
    },
    init() {
      this.selectAllBaseLibrary();
    },
    // 进入页面显示下拉框
    selectAllBaseLibrary() {
      api
        .selectAllBaseLibrary({
          pageSize: 100000,
          currentPage: 1,
        })
        .then((res) => {
          if (res.code == 'code_200') {
            this.selList = res.data;
            // 以下为界面显示
            this.selectName = res.data[0].name;
            this.queryLibraryCh = res.data[0].name;
            this.selectSubMenu(res.data[0]);
            this.commonId = res.data[0].id;
          }
        });
    },
    // 查询对应库右侧菜单
    selectSubMenu(item) {
      api
        .selectSubMenu({
          baselibraryID: item.id,
        })
        .then((res) => {
          if (res.code == 'code_200') {
            this.queryLibraryEn = res.data.LEFT;
            this.menuList = res.data.RIGHT;
            // 当前子菜单为查询时才会进行页面跳转
            if (this.subMenuUrl == 'inquireBase' || this.subMenuUrl == 'inquire') {
              this.showDiferQueryPage(this.menuList[1].pageurl);
            }
            this.clickChangeList(this.menuList);
          }
        });
    },
    // 根据库名显示不同查询界面,宏观经济库、权利事项库、社会信用库显示表格页面
    showDiferQueryPage(item) {
      if (item == 'inquireBase') {
        this.isQueryTbl = true;
      } else if (item == 'inquire') {
        this.isQueryTbl = false;
      }
      this.$router.push({
        path: item,
        query: {
          talbaseId: this.commonId,
        },
      });
    },
    byValue(value) {
      this.commonId = value.baselibraryID;
      this.$router.push({
        path: value.pageurl,
        query: {
          talbaseId: this.commonId,
        },
      });
      this.subMenuUrl = value.pageurl;
      this.subMenuSelected = value.pageName;
      if (this.subMenuUrl == 'inquireBase') {
        this.isQueryTbl = true;
      } else {
        this.isQueryTbl = false;
      }
    },
  },
  created() {
    this.activeDate = Date.now();
  },
  mounted() {
    const self = this;
    self.init();
    window.onresize = function(){
        if(document.documentElement.clientHeight<768){
          self.$refs.basicVisul.style.height = "969px";
        }else{
          self.$refs.basicVisul.style.height = "100vh";
        };
    };
  },
  beforeDestroy() {
    /* this.$root.Bus.$emit("baseId", this.commonId); */
  },
  components: {
    visulHeadNav,
  },
};
</script>

<style scoped lang="less">
@import "basicBaseVisulization.less";
</style>

