<template>
  <div class="visualization-general">
    <div class="aside">
      <div class="title">
        <span class="bg-img"></span>
        <span class="iocn-left"></span>
        <div>部门来源</div>
      </div>
      <div class="list">
        <div class="larger-list" v-if="departmentList.length">
          <div class="asideList-bg"  v-for="(list,index) in departmentList" :key="index">
            <div class="topDepartment-title">
              <span>ROLICE</span>
              <!--<span>{{list.number}}条</span>-->
            </div>
            <div class="bottomDepartment-title">
              <span><img src="../../../assets/img/basicbaseVisul/general/sideIcon.png" alt=""></span>
              <span>{{list.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="row-title">
        <span>
          <img src="../../../assets/img/basicbaseVisul/general/leftmAsideTitle.png" alt="">
          <img class="icon" src="../../../assets/img/basicbaseVisul/general/titleIconDepartment.png" alt="">
          <div>部门来源</div>
        </span>
        <div>
          <el-button size="small" @click="detailsTo" v-if="modelData">概览</el-button>
          <span v-if="modelTotleNum">总计<b>{{modelTotleNum}}</b>条</span>
        </div>
      </div>
      <div class="row">
        <div class="col" v-for="(list,index) in dataList">
          <div class="bg-purple" :class="{active:index==active}" @click="popoutC(index)">
            <h5>{{list.tableNames}}</h5>
            <h4>{{list.totalRecords}}</h4>
            <p>
              更新于
            </p>
            <div>{{list.lastTime}}</div>
          </div>
        </div>
      </div>
      <div class="list-container page-bottom">
        <div class="content-section">
          <div class="table-container pag-position">
            <!--分页-->
            <el-pagination
              v-if="dataList.length!=0"
              :current-page="allCurrentPage"
              :page-size="allPageSize"
              @current-change="allChange"
              layout="prev, pager, next"
              :total="allTotleNum"
              prev-text="上一页"
              next-text="下一页">
            </el-pagination>
          </div>
        </div>
      </div>
      <el-dialog
        class="model-bg"
        :modal-append-to-body="true"
        v-dialogDrag
        :title="thisTitle"
        :close-on-click-modal="false"
        :visible.sync="modelData"
        width="60%"
        :modal="false"
        center
        :before-close="handleClose">
        <img src="../../../assets/img/basicbaseVisul/general/popLine.png" alt="">
        <div class="list-container">
          <div class="content-section">
            <div class="table-container pag-position">
              <el-table
                :data="modelTableData"
                stripe
                style="width: 100%">
                <el-table-column v-for="item in modelHeaderData"
                                 :label="item.label"
                                 :prop="item.prop"
                                 :key="item.id"
                                 :show-overflow-tooltip=true>
                </el-table-column>
              </el-table>
              </el-pagination>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import api from '../../../api/bigData/daq/basicBaseVisulization/visualizationContentGeneral';
  import store from "../../../store";
  // v-dialogDrag: 弹窗拖拽
  Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header');
      const dragDom = el.querySelector('.el-dialog');
      dialogHeaderEl.style.cursor = 'move';

      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

      dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;

        // 获取到的值带px 正则匹配替换
        let styL, styT;

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
        } else {
          styL = +sty.left.replace(/\px/g, '');
          styT = +sty.top.replace(/\px/g, '');
        };
        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX;
          const t = e.clientY - disY;

          // 移动当前元素
          dragDom.style.left = `${l + styL}px`;
          dragDom.style.top = `${t + styT}px`;

          //将此时的位置传出去
          //binding.value({x:e.pageX,y:e.pageY})
        };

        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  });
  export default {
    data() {
      return {
        titles: "",
        allCurrentPage: 1, //第几页
        allPageSize: 21,  //一页多少条
        allTotleNum: 1, //共多少页
        departmentList: [
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
          {name: '公积金管理中心', number: 33222},
        ],
        dataList: [],
        thisTitle: '人口基础信息',
        modelData: false,
        active: -1,
        modelHeaderData: [
          {
            prop: 'metadataEnglisName',
            label: '英文名',
          },
          {
            prop: 'metadataName',
            label: '中文名',
          },
          {
            prop: 'dataType',
            label: '数据类型',
          },
          {
            prop: 'dataFormat',
            label: '数据格式',
          },
        ],
        modelTableData: [],
        listData: [],
        modelDataList: [],
        initID: '',
        modelTotleNum: '',
        tableId:'',
      }
    },
    props: {
      byValue: String,
      address: String,
      required: true
    },
    watch: {
      byValue(newName, oldName) {
        this.initID = newName;
      },
      'initID':function () {
        //this.$emit('updateInitID', this.initID)
       this.init();
      },
    },
    beforeDestroy () {
      this.initID='';
    },
    methods: {
      allChange:function (val) {
        var self = this;
        self.allCurrentPage = val;
        api.queryTableList({
          dbId: this.initID,
          currentPage: self.allCurrentPage,
          pageSize: this.allPageSize,
        }).then(res=>{
          if(res.code=='code_200'){
            var self =this;
            self.dataList=res.data;
            self.allTotleNum=res.page.totalPage;
            self.modelTotleNum=res.page.totalNumber;
            self.tableId=res.data[0].id;
          }else if(res.code=='code_500') {
            var self =this;
            self.dataList ='';
            self.modelTotleNum ='';
            this.$message({
              type: 'error',
              message: res.msg
            });
          }else if(res.code=='code_400') {
            var self =this;
            self.dataList ='';
            self.modelTotleNum ='';
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
      },
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
      },
      init(){
        this.queryTableList();
      },
      queryTableList(baseId){
       if(this.initID ==''){
         if(this.$route.query.talbaseId){
           this.initID=this.$route.query.talbaseId
         }else if(!this.$route.query.talbaseId){
           return
         }
       }
        api.queryTableList({
          dbId: this.initID,
          currentPage: this.allCurrentPage,
          pageSize: this.allPageSize,
        }).then(res=>{
          if(res.code=='code_200'){
            var self =this;
            self.dataList=res.data;
            self.allTotleNum=res.page.totalPage;
            self.modelTotleNum=res.page.totalNumber;
            self.tableId=res.data[0].id;

          }else if(res.code=='code_500') {
            var self =this;
            self.dataList ='';
            self.modelTotleNum ='';
            this.$message({
              type: 'error',
              message: res.msg
            });
          }else if(res.code=='code_400') {
            var self =this;
            self.dataList ='';
            self.modelTotleNum ='';
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
      },
      popoutC: function (value) {
        var self = this;
        self.modelData = true;
        self.active = value;
        api.queryMeta({
          dbId: this.initID,
          tableId: self.tableId,
        }).then(res=>{
          if(res.code=='code_200'){
            var self =this;
            self.modelTableData=res.data;
          }else if(res.code=='code_500') {
            var self =this;
            self.dataList ='';
            /*this.$message({
              type: 'error',
              message: res.msg
            });*/
          }
        })
      },
      detailsTo: function () {
        var self = this;
        var id= this.initID;
        self.$router.push({
          path: 'generalDatail',
          query:{
            id: this.initID,
            tableId: this.tableId,
          }
        });
      },
      handleClose: function () {
        var self = this;
        self.modelData = false;
        self.active = -1;
      },
    },
    mounted() {
      const self = this;
      self.init();
    },
  };
</script>
<style lang="less">
  @import "../../../assets/css/common.less";
</style>
<style scoped lang="less" type="text/less">
  @import "visualization-general.less";
</style>
