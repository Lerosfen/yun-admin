<template>
  <div class="list-container shandow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData">新增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <label for="" class="yellow middle m-r-10">模型名称</label>
            <div class="input-tpm yellow-input">
              <i class="honer-left"></i>
              <el-input placeholder="" v-model="name"></el-input>
              <i class="honer-right"></i>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10" @click="Modelsearch()">
            查询
          </div>
          <div class="add-btn fl yellow m-l-10" @click="reset()">
            重置
          </div>
        </div>
      </div>
      <!--列表-->
      <div class="table-container">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row,list.type,scope.$index)" type="text" size="small"
                         v-for="(list,idKey) in operate" :key="idKey">
                {{list.txt}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalNum"
          prev-text="上一页"
          next-text="下一页">
        </el-pagination>
      </div>
    </div>

    <!--新增 添加-->
    <yj-dialog title="数据模型-添加" :visible.sync="addFormVisible" :close-on-click-modal="false" width="50%">
      <el-form :model="addForm" label-width="100px" :rules="addFormResource" ref="addForm">
        <el-row>
          <el-col :span="10">
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="模型名称" prop="name">
                    <div class="input-tpm w-150 blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" v-model="addForm.name"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="模型描述" prop="code">
                    <div class="input-tpm w-150 blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" type="textarea" :rows="4" :disabled="mainDisabled"
                                v-model="addForm.remark"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!--模型属性-->
          <el-col :span="13"  class="right-col" >
            <div class="clearfix">
              <span>模型属性</span>
              <span class="add-child fr" @click="addTpl()">新增</span>
            </div>
            <div class="right-table clearfix">
              <el-table
                :data="addForm.fields"
                style="width: 100%"
                class="right-form" :rules="addFormResource">
                <el-table-column
                  label="属性名称">
                  <template slot-scope="scope">
                    <el-input v-model='scope.row.englishName'></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="属性描述">
                  <template slot-scope="scope">
                    <el-input v-model='scope.row.chineseName'></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="属性类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择" :disabled="mainDisabled">
                      <el-option
                        v-for="(list,idKey) in type" 
                        :key="idKey"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button @click="childDelClick(scope.$index)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="addSubmit">确 定</el-button>
        <el-button class="blue-btn" @click="addFormVisible = false">取 消</el-button>
      </div>
    </yj-dialog>
    <!--查看-->
    <yj-dialog title="数据模型-查看" :visible.sync="examineFormVisible" :close-on-click-modal="false" width="45%">
      <el-form :model="addForm" label-width="100px" :rules="addFormResource" ref="addForm">
        <el-row>
          <el-col :span="10">
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="模型名称" prop="name">
                    <div class="input-tpm w-150 blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" v-model="addForm.name"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="模型描述" prop="code">
                    <div class="input-tpm w-150 blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" type="textarea" :rows="4" :disabled="mainDisabled"
                                v-model="addForm.remark"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!--模型属性-->
          <el-col :span="13"  class="right-col" >
            <div class="clearfix">
              <span>模型属性</span>
              <span class="add-child fr" @click="addTpl()">新增</span>
            </div>
            <div class="right-table clearfix">
              <el-table
                :data="addForm.fields"
                style="width: 100%"
                class="right-form" :rules="addFormResource">
                <el-table-column
                  label="属性名称">
                  <template slot-scope="scope">
                    <el-input v-model='scope.row.englishName'></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="属性描述">
                  <template slot-scope="scope">
                    <el-input v-model='scope.row.chineseName'></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="属性类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择" :disabled="mainDisabled">
                      <el-option
                        v-for="(item,idKey) in type"
                        :key="idKey"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button @click="childDelClick(scope.$index)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </yj-dialog>
    <!--编辑-->
    <yj-dialog title="数据模型-编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="45%">
      <el-form :model="addForm" label-width="100px" :rules="addFormResource" ref="addForm">
        <el-row>
          <el-col :span="10">
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="模型名称" prop="name">
                    <div class="input-tpm w-150 blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" v-model="addForm.name"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="模型描述" prop="code">
                    <div class="input-tpm w-150 blue-input">
                      <i class="honer-left"></i>
                      <el-input placeholder="" type="textarea" :rows="4" :disabled="mainDisabled"
                                v-model="addForm.remark"></el-input>
                      <i class="honer-right"></i>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!--模型属性-->
          <el-col :span="13"  class="right-col" >
            <div class="clearfix">
              <span>模型属性</span>
              <span class="add-child fr" @click="addTpl()">新增</span>
            </div>
            <div class="right-table clearfix">
              <el-table
                :data="addForm.fields"
                style="width: 100%"
                class="right-form"
                :rules="addFormResource">
                <el-table-column
                  label="属性名称">
                  <template slot-scope="scope">
                    <el-input v-model='scope.row.englishName'></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="属性描述">
                  <template slot-scope="scope">
                    <el-input v-model='scope.row.chineseName'></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="属性类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择" :disabled="mainDisabled">
                      <el-option
                        v-for="(item,idKey) in type"
                        :key ="idKey"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button @click="childDelClick(scope.$index)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="editSubmit">确 定</el-button>
        <el-button class="blue-btn" @click="editFormVisible = false">取 消</el-button>
      </div>
    </yj-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  import api from '../../../../api/bigData/daq/dataModel';
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    components: {ElRow},
    name: 'dataModel',
    data() {
      //表单验证
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入有效信息'));
        } else {
          callback();
        }
      };
      return {
        titles: '数据模型',
        // isVisible: false,
        tableData: [],//页面表格数据
        headerData: [
          {
            prop: 'name',
            label: '模型名称'
          },
          {
            prop: 'remark',
            label: '模型描述'
          },
          {
            prop: 'updateTime',
            label: '修改时间'
          },
        ],//表头数据
        operate: [
          {
            type: 1,
            txt: '查看'
          },
          {
            type: 2,
            txt: '编辑'
          },
          {
            type: 3,
            txt: '删除'
          }
        ],//操作按钮的状态
        // listTable: [],
        name: '',//，模型名称
        totalNum: 1,//总数据条数
        pageSize: 10,//当前页展示数据条数
        currentPage: 1,//当前页
        addFormVisible: false,//添加界面是否显示
        editFormVisible: false,//编辑界面是否显示
        examineFormVisible: false,//查看界面是否显示
        mainDisabled:false,
        //表格绑定的数据（请求接口）
        addForm: {
          name: '',
          modelId: '',
          remark: '',
        },
        addFormVisible: false, // 添加界面是否显示
        type:[],
        // 添加、编辑（name不能为空）弹出框里的input数据
        addFormResource: {
          name: [
            {validator: validatePass, trigger: 'blur'}
          ],
          englishName: [
            {validator: validatePass, trigger: 'blur'}
          ],
          type: [
            {validator: validatePass, trigger: 'blur'}
          ],
        },
        //新增添加数据
        addForm: {
          name:'',
          remark:'',
          fields: [],
        },
        //按钮判断
        // btn:{
        //   addDatemodel:0,
        //   checkmodelStrategy:0,
        //   editorDatemodelStrategy:0,
        //   deleteDatemodelStrategy:0,
        // },
      }
    },
    methods: {
      //初始化请求数据
      initDataModel() {
        var self = this;
        api.getModel({
          name: self.name,
          pageSize: self.pageSize,
          currentPage: self.currentPage
        }).then((res) => {
          if (res.code == 'code_200') {
            self.tableData = res.data;
            self.totalNum = res.page.totalNumber;
          }
        });
      },
      //按钮权限
      // getDatemodelParams(){
      //   var self=this;
      //   let routerParams=self.$route.query.menuLink;
      //   let sysCode=sessionStorage["sysCode"];
      //   api.getmodelParams({menuLink:routerParams,sysCode:sysCode}).then(res=>{
      //     if(res.code==='code_200'){
      //       console.log('res',res.data);
      //       res.data.forEach(item=>{
      //         if(item.indexOf('addDatemodel@POST')){
      //           self.btn.addDatemodel=1;
      //         }
      //         if(item.indexOf('checkmodelStrategy@GET')){
      //           self.btn.checkmodelStrategy=1;
      //         }
      //         if(item.indexOf('deleteDatemodelStrategy@DELETE')){
      //           self.btn.deleteDatemodelStrategy=1;
      //         }
      //         if(item.indexOf('editorDatemodelStrategy@PUT')){
      //           self.btn.editorDatemodelStrategy=1;
      //         }
      //       })
      //     }
      //   });
      // },
      // 操作点击事件 type 1 查看 2编辑 3删除
      // 查看 编辑
      handleClick(index, type) {
        const self = this;
        //调取查看接口
        api. getCheckOneData({ id: index.modelId }).then((res) => {
          if (res.code == 'code_200') {
            self.addForm = res.data;
          }
        });
        if (type == 1) {
          //查看
          self.examineFormVisible = true;
        }
        if (type == 2) {
          // 编辑
          self.editFormVisible = true;
        }
        if(type == 3){
          //删除
          self.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning',
            cancelButtonClass: 'blue-btn',// 取消按钮自定义类名
            confirmButtonClass: 'yellow-btn',// 确定按钮自定义类名
            center: true
          }).then(() => {
            self.tableData.splice(index, 1);
            api.deleteColData({id: index.modelId}).then(res => {
              if (res.code === 'code_200') {
                self.initDataModel();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
              }
            }, errorRes => {
              console.log('删除失败的回调', errorRes);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      //查询
      Modelsearch() {
        this.initDataModel();
      },
      //重置
      reset() {
        var self = this;
        self.name = '';
        this.initDataModel()
      },
      //新增
      addData() {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          remark:'',
          fields: [],
        };
      },
      //数据模型增加
      addTpl(){
        var self=this;
        self.addForm.fields.push(
          {
            englishName: '',
            chineseName:'',
            type:'',
          }
        )
      },
      //数据模型删除
      childDelClick(index){
        var self=this;
        self.addForm.fields.splice(index,1)
      },
      // 添加确认
      addSubmit() {
        const self = this;
        let addList = self.addForm;
        console.log('addform',self.addForm)
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            api.getModelAdd(addList).then((res) => {
              if (res.code == 'code_200') {
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                self.addFormVisible = false;
                self.initDataModel();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });
          } else {
            this.$message({
              type: 'error',
              message: '请填写完整信息',
            });
            return false;
          }
        });
      },
      // 编辑确认
      editSubmit() {
        const self = this;
        let addList = self.addForm;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            api.updateData(addList).then((res) => {
              if (res.code == 'code_200') {
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                self.editFormVisible = false;
                self.initDataModel();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });
          } else {
            this.$message({
              type: 'error',
              message: '请填写完整信息',
            });
            return false;
          }
        });
      },
      //每页显示数据量编辑
      handleSizeChange: function (val) {
        var self = this;
        self.pageSize = val;
        self.initDataModel();
      },
      //页码编辑
      handleCurrentChange: function (val) {
        var self = this;
        self.currentPage = val;
        self.initDataModel();
      },
      //获取数据类型（新增下拉）
      getDataSelectType() {
        var self = this;
        api.getDataSelectType({"code": "dataType"}).then((res) => {
          console.log(res, '数据类型');
          self.type = res.data;
        })
      }
    },
    mounted() {
      //初始化页面
      const self = this;
      self.initDataModel();
      self.getDataSelectType();
    },
  };
</script>
<style  lang="less" type="text/less">
  @import "dataModel.less";
</style>

