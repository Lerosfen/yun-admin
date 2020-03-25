<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <list-table-title :title="titles" :isBack="false"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addData" v-if="Btn.save==1">新增</el-button>
        <!--TODO  1期不做-->
        <!-- <el-button class="yellow-btn" @click="stateOpen($event)">{{stateName}}</el-button>
        <el-button class="yellow-btn" @click="stateClose($event)">禁用</el-button>-->
        <div class="search-right fr">
          <div class="input-data fl">
            <label for class="yellow middle m-r-10">模型中文名称</label>
            <div class="input-tpm yellow-input new-input">
              <el-input placeholder v-model="name"></el-input>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="Modelsearch()">查询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="reset()">重置</div>
        </div>
      </div>
      <!--列表-->
      <div class="table-container pag-position">
        <el-table
          :row-class-name="tableRowClassName"
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="stateSelectionChange"
        >
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <!--0未设置-》编辑，设置。删除1启用-》查看 禁用。2禁用-》查看，启用。删除-->
              <el-button
                @click="ModalShow(scope.row)"
                type="text"
                size="small"
                v-if="Btn.findOne==1"
              >查看
              </el-button>
              <el-button @click="ModalSet(scope.row)" type="text" size="small">设置</el-button>
              <el-button
                @click="ModalEditor(scope.row)"
                type="text"
                size="small"
                v-show="scope.row.state!='启用' && Btn.update==1"
              >编辑
              </el-button>
              <el-button
                @click="ModalAble(scope.row)"
                type="text"
                size="small"
                v-show="scope.row.state=='禁用' && Btn.enableOrUn==1"
              >启用
              </el-button>
              <el-button
                @click="ModalDisable(scope.row)"
                type="text"
                size="small"
                v-show="scope.row.state=='启用' && Btn.JyModel==1"
              >禁用
              </el-button>

              <el-button
                @click="undo(scope.row)"
                type="text"
                size="small"
                v-show="scope.row.state=='启用' && Btn.JyModel==1"
              >撤销
              </el-button>

              <el-button
                @click="ModalRemove(scope.row)"
                type="text"
                size="small"
                v-show="scope.row.state!='启用' && Btn.delete==1"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
      </div>
    </div>
    <!--新增 添加-->
    <Modal
      title="数据模型-添加"
      v-model="addFormVisible"
      width="50%"
      class="data_model_title"
      :closable="false"
      :mask-closable="false"
    >
      <el-form
        :model="addForm"
        label-width="100px"
        :rules="addFormResource"
        ref="addForm"
        label-position="left"
      >
        <el-row class="data_model_row">
          <el-col :span="7" :offset="1">
            <el-row style="margin-left: -15px">
              <el-col :span="24" class="input_label">
                <!--<div class="grid-content bg-purple-light">-->
                <el-form-item label="模型名称" prop="modelTable"></el-form-item>
                <!--</div>-->
              </el-col>

              <el-col :span="22" class="input">
                <div class="input-tpm w-150 blue-input new-input">
                  <el-input placeholder v-model="addForm.modelTable" :disabled="mainDisabled"></el-input>
                </div>
              </el-col>
              <el-col :span="24" class="input_label">
                <!--<div class="grid-content bg-purple-light">-->
                <el-form-item label="模型中文名称" prop="name"></el-form-item>
                <!--</div>-->
              </el-col>

              <el-col :span="22" class="input">
                <div class="input-tpm w-150 blue-input new-input">
                  <el-input placeholder v-model="addForm.name" :disabled="mainDisabled"></el-input>
                </div>
              </el-col>
              <el-col :span="24" class="input_label">
                <!--<div class="grid-content bg-purple-light">-->
                <el-form-item label="模型描述" prop="remark"></el-form-item>
                <!--</div>-->
              </el-col>
              <el-col :span="22" class="input">
                <div class="input-tpm w-150 blue-input blue-textarea modelHeight">
                  <el-input
                    placeholder
                    type="textarea"
                    :rows="1"
                    :disabled="mainDisabled"
                    v-model="addForm.remark"
                    style="width: 280px"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!--模型属性-->
          <el-col :span="15" class="right-col">
            <div class="clearfix">
              <span>模型属性</span>
              <span class="add-child fr" @click="addTpl()">新增</span>
              <span class="add-childs fr" style="width: 161px" @click="autoCreate()">快速生成属性及填充</span>
              <!-- <div class="input-tpm blue-input fr" style="margin-right: 10px;margin-top: -2px" v-if="isAutoNameShow">
                <i class="honer-left"></i>
                <el-input v-model="autoCreateName" disabled style="overflow: hidden"></el-input>
                <i class="honer-right"></i>
              </div>-->
              <div v-if="isAutoNameShow" class="fr auto-name">
                <el-tooltip effect="dark" :content="autoCreateName" placement="top" :offset="4">
                  <span>{{autoCreateName}}</span>
                </el-tooltip>
              </div>
            </div>
            <div class="right-table clearfix">
              <el-table
                :data="addForm.fields"
                style="width: 100%"
                height="250"
                class="right-form"
                :rules="addFormResource"
              >
                <el-table-column label="属性名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.englishName" :disabled="mainDisabled"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="属性描述">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.chineseName" :disabled="mainDisabled"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="属性类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" placeholder="字符类型" :disabled="mainDisabled">
                      <el-option
                        v-for="item in type"
                        :label="item.name"
                        :value="item.code"
                        :key="item.code"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="是否唯一">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.isKey" placeholder="否" :disabled="mainDisabled">
                      <el-option
                        v-for="item in isKey"
                        :label="item.name"
                        :value="item.code"
                        :key="item.code"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
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
        <el-button class="blue-btn" @click="cancelAddModal">取 消</el-button>
      </div>
    </Modal>
    <!--查看-->
    <Modal
      title="数据模型-查看"
      v-model="examineFormVisible"
      :closable="false"
      :mask-closable="false"
      width="50%"
      class="data_model_title"
    >
      <el-form :model="addForm" label-width="100px" :rules="addFormResource" ref="addForm">
        <el-row class="data_model_row">
          <el-col :span="7" :offset="1">
            <el-row>
              <el-col :span="24" class="input_label">
                <el-form-item label="模型名称" prop="name"></el-form-item>
              </el-col>
              <el-col :span="24" :offset="2" class="input">
                <div class="input-tpm w-150 blue-input new-input">
                  <el-input placeholder v-model="addForm.name" :disabled="mainDisabled"></el-input>
                </div>
              </el-col>
              <el-col :span="24" class="input_label">
                <el-form-item label="模型描述" prop="code"></el-form-item>
              </el-col>
              <el-col :offset="2" class="input">
                <div class="input-tpm w-150 blue-input blue-textarea modelHeight">
                  <el-input
                    placeholder
                    type="textarea"
                    :rows="4"
                    :disabled="mainDisabled"
                    v-model="addForm.remark"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!--模型属性-->
          <el-col :span="15" class="right-col">
            <div class="clearfix">
              <span>模型属性</span>
              <!-- <span class="add-child fr" @click="addTpl()">新增</span> -->
            </div>
            <div class="right-table clearfix">
              <el-table
                :data="addForm.fields"
                style="width: 100%"
                height="250"
                class="right-form"
                :rules="addFormResource"
              >
                <el-table-column label="属性名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.englishName" :disabled="mainDisabled"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="属性描述">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.chineseName" :disabled="mainDisabled"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="属性类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择" :disabled="mainDisabled">
                      <el-option
                        v-for="item in type"
                        :label="item.name"
                        :value="item.code"
                        :key="item.code"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="是否唯一">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.isKey" placeholder="请选择" :disabled="mainDisabled">
                      <el-option
                        v-for="item in isKey"
                        :label="item.name"
                        :value="item.code"
                        :key="item.code"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="examineFormVisible = false">关 闭</el-button>
      </div>
    </Modal>
    <!--编辑-->
    <Modal
      title="数据模型-编辑"
      v-model="editFormVisible"
      :closable="false"
      :mask-closable="false"
      width="50%"
      class="data_model_title"
    >
      <el-form :model="addForm" label-width="100px" :rules="addFormResource" ref="addForm">
        <el-row class="data_model_row">
          <el-col :span="7" :offset="1">
            <el-row>
              <el-col :span="24" class="input_label">
                <!--<div class="grid-content bg-purple-light">-->
                <el-form-item label="模型名称" prop="name"></el-form-item>
                <!--</div>-->
              </el-col>
              <el-col :span="24" :offset="2" class="input">
                <div class="input-tpm w-150 blue-input new-input">
                  <el-input placeholder v-model="addForm.name"></el-input>
                </div>
              </el-col>
              <el-col :span="24" class="input_label">
                <!--<div class="grid-content bg-purple-light">-->
                <el-form-item label="模型描述" prop="code"></el-form-item>
                <!--</div>-->
              </el-col>
              <el-col :offset="2" class="input">
                <div class="input-tpm w-150 blue-input blue-textarea modelHeight">
                  <el-input placeholder type="textarea" :rows="4" v-model="addForm.remark"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!--模型属性-->
          <el-col :span="15" class="right-col">
            <div class="clearfix">
              <span>模型属性</span>
              <span class="add-child fr" @click="addTpl()">新增</span>
            </div>
            <div class="right-table clearfix">
              <el-table
                :data="addForm.fields"
                style="width: 100%"
                height="250"
                class="right-form"
                :rules="addFormResource"
              >
                <el-table-column label="属性名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.englishName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="属性描述">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.chineseName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="属性类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择">
                      <el-option
                        v-for="item in type"
                        :label="item.name"
                        :value="item.code"
                        :key="item.code"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="是否唯一">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.isKey" placeholder="请选择">
                      <el-option
                        v-for="item in isKey"
                        :label="item.name"
                        :value="item.code"
                        :key="item.code"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
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
    </Modal>

    <!-- 表数据-列表 -->
    <Modal title="表数据-列表" width="50%" v-model="tblDataListModal" :closable="false" :mask-closable="false">
      <el-form label-position="right" label-width="60px">
        <el-row>
          <el-col :span="9" style="margin-left: -20px">
            <el-form-item label="表名">
              <div class="input-data fl">
                <div class="input-data">
                  <div class="input-tpm yellow-input new-input">
                    <el-input v-model="cleanAddobj.sourceTable"></el-input>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="表类型">
              <div class="sel-group sel-yellow fl new-input">
                <el-select v-model="cleanAddobj.syncTableType" placeholder="全部">
                  <el-option
                    v-for="item in tableLeixing"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div
              class="add-btn fl yellow m-l-10 new-btn"
              @click="checkMetaData()"
              style="margin-left: -5px"
            >查 询
            </div>
          </el-col>
          <el-col :span="3">
            <div class="add-btn fl yellow m-l-10 new-btn" @click="resetSearch()">重 置</div>
          </el-col>
        </el-row>
        <el-row></el-row>
      </el-form>

      <el-row>
        <el-col style="margin-top: -10px">
          <div class="table-container addtable-container">
            <el-table :data="choisecleanTableData" height="205" style="width: 100%;">
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <el-radio
                    @change="getCurrentRow(scope.row)"
                    :label="scope.row.id"
                    v-model="radio"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in tblDataheaderData"
                align="center"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
                :width="item.width"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
            <!--分页-->
            <div class="model-pag" style="margin-top: 15px">
              <el-pagination
                v-if="choisecleanTableData.length!=0"
                :current-page="cleanAddobj.currentPage"
                :page-size="cleanAddobj.pageSize"
                @current-change="handleCurrentChanges"
                layout="prev, pager, next"
                :total="tabListtotleNum"
                :pager-count="5"
                prev-text="上一页"
                next-text="下一页"
              ></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click="autoCreateSubmit">确 定</el-button>
        <el-button class="blue-btn" @click="autoCreateCancel">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  /* eslint-disable */
  var qs = require('qs');

  import api from '../../api/bigData/daq/dataModel';
  import ElRow from 'element-ui/packages/row/src/row';
  import Common from '../../../config/common';

  export default {
    components: { ElRow },
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
        isAutoNameShow: false,
        radio: '',
        tabListtotleNum: 1,
        tblDataheaderData: [
          {
            prop: 'sourceTable',
            label: '数据库表名',
            width: 350
          },
          /*{
              prop: 'dataSourceId',
              label: '表分类 ',
            },*/
          {
            prop: 'sourceTableMame',
            label: '描述'
          },
          {
            prop: 'syncTableType',
            label: '表分类 '
          }
        ],
        choisecleanTableData: [],
        tableLeixing: [],
        // 表数据列表-弹框
        cleanAddobj: {
          sourceTable: '',
          dataSourceId: '',
          syncTableType: '',
          currentPage: 1,
          pageSize: 10
        },
        tblDataListModal: false,
        titles: '数据模型管理',
        type: '',
        tableData: [], //页面表格数据
        headerData: [
          {
            prop: 'modelTable',
            label: '模型名称'
          },
          {
            prop: 'name',
            label: '模型中文名称'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            prop: 'createName',
            label: '创建人'
          },
          {
            prop: 'state',
            label: '状态'
          },
          {
            prop: 'resultState',
            label: '运行状态'
          },
          {
            prop: 'datanum',
            label: '数据总量'
          }
        ], //表头数据
        operate: [
          {
            type: 0,
            txt: '设置'
          },
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
        ],
        name: '', //，模型名称
        stateName: '启用',
        modalOpend: true,
        modalClose: false,
        totalNum: 1, //总数据条数
        pageSize: 10, //当前页展示数据条数
        currentPage: 1, //当前页
        addFormVisible: false, //添加界面是否显示
        editFormVisible: false, //编辑界面是否显示
        examineFormVisible: false, //查看界面是否显示
        mainDisabled: false, //文本框的是否为空
        //表格绑定的数据（请求接口）
        addForm: {
          name: '',
          modelId: '',
          remark: ''
        },
        addFormVisible: false, // 添加界面是否显示
        // 添加、编辑（name不能为空）弹出框里的input数据
        addFormResource: {
          modelTable: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 50,
              message: '模型名称字符长度不能大于50',
              trigger: 'blur'
            }
          ],
          name: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 50,
              message: '模型名称字符长度不能大于50',
              trigger: 'blur'
            }
          ],
          remark: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 100,
              message: '模型描述字符长度不能大于100',
              trigger: 'blur'
            }
          ]
        },
        //新增添加数据
        addForm: {
          name: '',
          remark: '',
          fields: [],
          modelTable: ''
        },
        isKey: [],
        //启用数组;
        stateforms: {
          modelId: '',
          state: ''
        },
        checkedArr: [],
        states: false, //模型禁用状态；
        //按钮判断
        Btn: {
          findOne: 0,
          save: 0,
          update: 0,
          delete: 0,
          enableOrUn: 0,
          JyModel: 0
        },
        autoCreateName: '',
        autoCreateId: ''
      };
    },
    created() {
      // this.initDataModel();
    },
    mounted() {
      //初始化页面
      const self = this;
      self.$store.commit('showLoading', true);
      self.initDataModel();
      self.getDataSelectType();
      self.getDataSelectYesOrNot();
      self.getfuseParams();
    },
    methods: {
      cancelAddModal() {
        var self = this;
        self.addFormVisible = false;
        self.isAutoNameShow = false;
        self.radio = '';
        self.autoCreateName = '';
        self.autoCreateId = '';
        self.$refs.addForm.resetFields();
      },
      autoCreateSubmit() {
        if (this.radio != '') {
          this.tblDataListModal = false;
          this.isAutoNameShow = true;

        } else {
          this.$message({
            type: 'error',
            message: '请选择表数据'
          });
        }
      },
      autoCreateCancel() {
        this.tblDataListModal = false;
        this.radio = '';
        this.autoCreateId = '';

      },

      getCurrentRow(row) {
        // this.tableType = row.row.syncTableType;
        // this.tName = row.row.sourceTable;
        // this.cleantabels = row.row.sourceTable;
        // this.rulerform.shijian = row.row.updateTime;
        // this.rulerform.id = row.row.id;
        this.autoCreateName = row.sourceTable;
        this.autoCreateId = row.id;
      },

      handleCurrentChanges(e) {
        this.cleanAddobj.currentPage = e;
        this.autoCreate();
      },

      autoCreate() {
        this.tblDataListModal = true;
        api.getAllCleanList(this.cleanAddobj)
          .then(res => {
            if (res.code === 'code_200') {
              console.log('ressssssssssssss', res.data);

              this.choisecleanTableData = res.data;
              this.choisecleanTableData.forEach(e => {
                switch (e.syncTableType) {
                  case '1':
                    e.syncTableType = Common.tableType.AcquisitionSource;
                    break;
                  case '2':
                    e.syncTableType = Common.tableType.AcquisitionTarget;
                    break;
                  case '3':
                    e.syncTableType = Common.tableType.CleaningTarget;
                    break;
                  case '4':
                    e.syncTableType = Common.tableType.FusionTarget;
                    break;
                  case '5':
                    e.syncTableType = Common.tableType.DataqualityMonitor;
                    break;
                  case '6':
                    e.syncTableType = Common.tableType.moduleTarget;
                    break;
                  default:
                    break;
                }
              });

              this.tabListtotleNum = res.page.totalNumber;
            } else {
              this.tips('失败', 'error', res.msg);
            }
          });
        api.cleanAddtableType({ code: 'TABLEINFO' })
          .then(res => {
            if (res.code === 'code_200') {
              this.tableLeixing = res.data;
              for (var key in this.tableLeiXxing) {
                if (key.code == 1) {
                  this.cleanAddobj.syncTableType = '';
                }
              }
            } else {
              this.tips('失败', 'error', res.msg);
            }
          });
      },

      //执行中，当前行置灰,且 删除、 启动 按钮不可点击
      tableRowClassName({ row, resultState }) {
        resultState = row.resultState;
        if (resultState === '执行中') {
          return 'success-row2';
        }
        return '';
      },
      //按钮权限
      getfuseParams() {
        var self = this;
        let routerParams = self.$route.query.menuLink;
        let sysCode = sessionStorage['sysCode'];
        api
          .getBtnFusePower({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              console.log('btns', res.data);
              res.data.forEach(item => {
                if (item.includes('findOne@GET')) {
                  self.Btn.findOne = 1;
                }
                if (item.includes('save@POST')) {
                  self.Btn.save = 1;
                }
                if (item.includes('update@PUT')) {
                  self.Btn.update = 1;
                }
                if (item.includes('delete@DELETE')) {
                  self.Btn.delete = 1;
                }
                if (item.includes('enableOrUn@PUT')) {
                  self.Btn.enableOrUn = 1;
                }
                if (item.includes('JyModel@PUT')) {
                  self.Btn.JyModel = 1;
                }
              });
            }
          });
      },
      //初始化请求数据
      initDataModel() {
        var self = this;
        api
          .getModel(self.pageSize, self.currentPage, { name: self.name })
          .then(res => {
            if (res.code == 'code_200') {
              self.$store.commit('hideLoading', false);
              self.totalNum = res.page.totalNumber;
              res.data.forEach(value => {
                value.resultState = self.checkRunState(value.resultState);
              });
              self.tableData = res.data.forEach(res => {
                switch (res.state) {
                  case 0:
                    res.state = Common.moduleState['unSet'];
                    break;
                  case 1:
                    res.state = Common.moduleState['start'];
                    break;
                  case 2:
                    res.state = Common.moduleState['close'];
                    break;
                }
              });
              self.tableData = res.data;
              console.log(self.tableData, 'datalist');
              this.$nextTick(function () {
                self.tableData.forEach((item, index) => {
                  if (item.state == 1) {
                    //选中状态；
                    self.$refs.multipleTable.toggleRowSelection(
                      self.tableData[index],
                      true
                    );
                    console.log(self.$refs.multipleTable, 'table');
                  }
                });
              });
            }
          });
      },
      checkRunState(state) {
        if (state == '0') {
          state = '未执行';
        } else if (state == '1') {
          state = '已完成';
        } else if (state == '3') {
          state = '执行中';
        } else if (state == '2') {
          state = '失败';
        }
        return state;
      },
      ModalSet(index) {
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', this);
        this.$router.push({
          path: 'dataModel_setting',
          query: {
            modelId: index.modelId,
            menuLink: this.$route.query.menuLink
          }
        });
        console.log(
          'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
          this.$router
        );
      },
      //查看；
      ModalShow(index) {
        console.log(index, 'chachao');
        api.getCheckOneData({ id: index.modelId })
          .then(res => {
            if (res.code == 'code_200') {
              this.addForm = res.data;
            }
          });
        this.examineFormVisible = true;
        this.mainDisabled = true; //查看输入框为禁用状态
      },
      //编辑打开
      ModalEditor(index) {
        // 编辑
        this.editFormVisible = true;
        api.getCheckOneData({ id: index.modelId })
          .then(res => {
            if (res.code == 'code_200') {
              console.log(res, 'bbbbbbbbb');
              this.addForm = res.data;
            }
          });
      },
      ModalAble(index) {
        setTimeout(() => {
          this.$notify({ type: 'success', offset: 100, message: '启动成功' });
          this.initDataModel();
        }, 500);
        api.modelAble(qs.stringify({ id: index.modelId }))
          .then(res => {
            if (res.code == 'code_200') {
              this.$notify({
                tittle: '成功',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.initDataModel();
              // console.log(res,'bbbbbbbbb')
              // this.addForm = res.data;
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },
      ModalDisable(index) {
        api.modelDisable(qs.stringify({ id: index.modelId }))
          .then(res => {
            if (res.code == 'code_200') {
              this.$notify({
                tittle: '成功',
                message: res.msg,
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.initDataModel();
              // console.log(res,'bbbbbbbbb')
              // this.addForm = res.data;
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },
      undo(row) {
        api.modelDisable(qs.stringify({ id: row.modelId }))
          .then(res => {
            if (res.code == 'code_200') {
              this.$notify({
                tittle: '成功',
                message: '撤销成功',
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.initDataModel();
              // console.log(res,'bbbbbbbbb')
              // this.addForm = res.data;
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },
      // 编辑确认
      editSubmit() {
        const self = this;
        let addList = self.addForm;
        this.$refs.addForm.validate(valid => {
          if (valid) {
            api.updateData(addList)
              .then(res => {
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
              message: '请填写完整信息'
            });
            return false;
          }
        });
      },
      //删除；
      ModalRemove(index) {
        this.$confirm('确认删除选中记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn',
          confirmButtonClass: 'yellow-btn',
          type: 'warning',
          center: true
          // type: 'warning',
          // cancelButtonClass: 'blue-btn',// 取消按钮自定义类名
          // confirmButtonClass: 'yellow-btn',// 确定按钮自定义类名
          // center: true
        })
          .then(() => {
            // self.tableData.splice(index, 1);
            this.$store.commit('showLoading', true);
            api.deleteColData({ id: index.modelId })
              .then(
                res => {
                  if (res.code === 'code_200') {
                    this.$store.commit('hideLoading', false);
                    this.initDataModel();
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
                },
                errorRes => {
                  console.log('删除失败的回调', errorRes);
                }
              );
          })
          .catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });
          });
      },
      //查询
      Modelsearch() {
        this.initDataModel();
      },
      //重置
      reset() {
        var self = this;
        self.name = '';
        this.initDataModel();
      },
      //新增
      addData() {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          remark: '',
          fields: []
        };
      },
      //数据模型增加
      addTpl() {
        var self = this;
        self.addForm.fields.push({
          value: '',
          type: '',
          isKey: ''
        });
      },
      //启用select选中;
      stateSelectionChange(e) {
        console.log(e);
        this.checkedArr = e;
        console.log(this.checkedArr, 'ooo');
        if (this.checkedArr.length != '') {
          if (this.checkedArr.length > 1) {
            this.checkedArr.forEach(res => {
              this.stateforms.modelId += res.modelId + ',';
              if (res.state == '0') {
                //禁用状态
                this.states = false;
                // this.stateforms.state="1";
              }
              if (res.state == '1') {
                //启用状态
                this.states = true;
                // this.stateforms.state="0";
              }
              console.log(this.stateforms, 'asas');
            });
          } else {
            this.stateforms.modelId = this.checkedArr[0].modelId;
            if (this.checkedArr[0].state == '0') {
              this.stateforms.state = '0';
              this.states = false;
            }
            if (this.checkedArr[0].state == '1') {
              this.stateforms.state = '1';
              this.states = true;
            }
            console.log(this.stateforms, 'asas');
          }
        }
      },
      //模型启用;
      stateOpen(e) {
        console.log(e);
        if (this.checkedArr.length == '') {
          this.$message('请选择模型');
        } else {
          console.log(this.states, 'stateaa');
          if (this.states) {
            //true是启用，
            this.$message('已启用！');
          } else {
            this.stateforms.state = '1';
            this.stateDeals('启用'); //已禁用，能启用；
          }
        }
      },
      //模型禁用;
      stateClose(e) {
        console.log(e);
        if (this.checkedArr.length == '') {
          this.$message('请选择模型');
        } else {
          if (this.states) {
            //已启用，能禁用；
            this.stateforms.state = '0';
            this.stateDeals('禁用');
          } else {
            this.$message('已禁用！');
          }
        }
      },
      //模型状态操作；
      stateDeals(name) {
        api.ModelState(this.stateforms)
          .then(res => {
            console.log(res.data, '22');
            if (res.code === 'code_200') {
              this.$notify({
                tittle: name + '成功!',
                message: name + '成功!',
                type: 'success',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
              this.initDataModel();
            } else {
              this.$notify({
                tittle: '失败',
                message: res.msg,
                type: 'error',
                offset: 100,
                duration: this.$store.state.el_Duration
              });
            }
          });
      },
      //数据模型删除
      childDelClick(index) {
        var self = this;
        self.addForm.fields.splice(index, 1);
      },
      // 添加确认
      addSubmit() {
        const self = this;
        let addList = self.addForm;
        if (this.autoCreateId != '') {
          addList.automatic = this.autoCreateId;
        }
        this.$refs.addForm.validate(valid => {
          if (valid) {
            api.getModelAdd(addList)
              .then(res => {
                if (res.code == 'code_200') {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  });
                  self.addFormVisible = false;
                  self.isAutoNameShow = false;
                  self.autoCreateName = '';
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
              message: '请填写完整信息'
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
      //获取属性类型（新增下拉）
      getDataSelectType() {
        var self = this;
        api.getDataSelectType({ code: 'data_type' })
          .then(res => {
            self.type = res.data;
          });
      },
      //是否唯一标识（新增下拉）
      getDataSelectYesOrNot() {
        var self = this;
        api.getDataSelectType({ code: 'is_Not' })
          .then(res => {
            console.log(res.data, '0909809809879078907');
            self.isKey = res.data;
          });
      }
    }
  };
</script>
<style lang="less" type="text/less">
  @import "dataModel.less";

  .el-form-item__error {
    top: 100%;
    left: 38%;
  }

  .add-btn {
    width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .auto-name {
    display: inline-block;
    width: 145px;
    height: 30px;
    margin-right: 20px;
    margin-top: -2px;
    color: #616161;
    line-height: 30px;
    font-size: 14px;
    padding: 0 5px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid #009CFF;
    box-shadow: 0px 0px 20px 0px rgb(11, 153, 226, .1) inset;
  }
</style>

