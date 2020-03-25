<template>
  <!-- 采集数据源管理 -->
  <div class="list-container shadow">
    <!--<div>-->
    <table-honer></table-honer>
    <div class="content-section" v-if="metaMainView">
      <list-table-title :title="title"></list-table-title>
      <!--搜索-->
      <div class="search-section clearfix">
        <el-button class="yellow-btn" @click="addMetaData" v-if="btn.saveDataSource==1">新 增</el-button>
        <div class="search-right fr">
          <div class="input-data fl">
            <div class="input-data">
              <label class="yellow middle m-r-10">数据源名称</label>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="sourceName"></el-input>
              </div>
            </div>
          </div>
          <div class="input-data fl m-l-10">
            <div class="input-data">
              <label class="yellow middle m-r-10">IP</label>
              <div class="input-tpm yellow-input new-input">
                <el-input v-model="sourceIp"></el-input>
              </div>
            </div>
          </div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="checkMetaData">查 询</div>
          <div class="add-btn fl yellow m-l-10 new-btn" @click="resetMetaData">重 置</div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-container pag-position">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in headerData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row,1)"
                type="text"
                size="small"
                v-if="btn.findByDataSourceId==1"
              >查看
              </el-button>
              <el-button
                @click="handleClick(scope.row,2)"
                type="text"
                size="small"
                v-if="btn.updateDataSource==1"
              >编辑
              </el-button>
              <el-button
                @click="handleClick(scope.row,3)"
                type="text"
                size="small"
                v-if="btn.selectByPage==1"
              >表同步
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="tableData.length!=0"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totleNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
      </div>
    </div>
    <!--</div>-->
    <div class="content-section" v-if="!metaMainView">
      <list-table-title title="检测表同步"></list-table-title>
      <div class="search-section clearfix">
        <div class="add-btn fl yellow m-l-10 new-btn" @click="jcbtb">检测表同步</div>
        <div class="add-btn fl yellow m-l-10 new-btn" @click="metaMainView = !metaMainView">返回</div>
      </div>
      <!--  表格 -->
      <div class="table-container pag-position">
        <el-table :data="syncTableData" stripe style="width: 100%">
          <el-table-column
            v-for="item in childHeaderData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                @click="checkFieldBtn(scope.row,list)"
                type="text"
                size="small"
                v-for="list in operateChild"
                :key="list.txt"
              >{{list.txt}}
              </el-button>
              <el-button type="text" size="small" @click="doSync(scope.row)">执行表同步</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="syncTableData.length!=0"
          :current-page="syncTableCurrentPage"
          :page-size="syncTablePageSize"
          @current-change="syncTableCurrentChange"
          layout="prev, pager, next"
          :total="syncTableTotleNum"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
      </div>
    </div>
    <!--</div>-->
    <!-- 采集数据源新增-->
    <Modal :title="titleName" v-model="mainDialog" :closable="false" :mask-closable="false" width="800">
      <el-form label-width="100px" ref="form" :model="form" :rules="addRules">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="数据源名称" prop="sourceName">
                <div class="input-tpm blue-input new-input">
                  <el-input placeholder v-model="form.sourceName" :disabled="mainDisabled"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="IP地址" prop="sourceIp">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceIp" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="数据库名" prop="sourceExample">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceExample" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light collectionData">
              <el-form-item label="数据库类型" prop="dataBaseType">
                <div class="sel-group sel-blue fl new-input">

                  <el-select
                    v-model="form.dataBaseType"
                    placeholder="请选择"
                    :disabled="mainDisabled"
                    @change="dataBaseTypeChange"
                  >
                    <el-option
                      v-for="item in databaseTypeList"
                      :key="item.id"
                      :label="item.code"
                      :value="item.code"
                    ></el-option>
                  </el-select>

                </div>
                <!--<div class="input-tpm blue-input new-input ">-->
                <!---->
                <!--<el-select v-model="form.dataBaseType" placeholder="请选择" :disabled="mainDisabled">-->
                <!--<el-option-->
                <!--v-for="item in databaseTypeList"-->
                <!--:key="item.id"-->
                <!--:label="item.code"-->
                <!--:value="item.code">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!---->
                <!--</div>-->
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="端口" prop="sourcePort">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourcePort" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="所属系统" prop="sourceSystem">
                <div class="sel-group sel-blue fl new-input">

                  <el-select v-model="form.sourceSystem" placeholder="请选择" :disabled="mainDisabled">
                    <el-option
                      v-for="item in sourceSystemList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>

                </div>
                <!--<div class="input-tpm blue-input new-input">-->
                <!---->
                <!--<el-select v-model="form.sourceSystem" placeholder="请选择" :disabled="mainDisabled">-->
                <!--<el-option-->
                <!--v-for="item in sourceSystemList"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.code">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!---->
                <!--</div>-->
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="用户" prop="sourceAccount">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceAccount" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData">
              <el-form-item label="密码" prop="sourcePass">
                <div class="input-tpm blue-input new-input">

                  <el-input
                    placeholder
                    type="password"
                    v-model="form.sourcePass"
                    :disabled="mainDisabled"
                  ></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple collectionData" v-if="isShowSourceSid">
              <el-form-item label="表空间" prop="sourceSid">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceSid" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple dataSouRemarks">
              <el-form-item label="数据源备注" prop="sourceRemarks">
                <div class="input-tpm blue-input blue-textarea" id="textHeight">

                  <el-input
                    placeholder
                    type="textarea"
                    :disabled="mainDisabled"
                    v-model="form.sourceRemarks"
                  ></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="passWordSubmit">测试连接</el-button>
        <el-button class="yellow-btn" type="primary" @click.native="addMetaDataSure">确 定</el-button>
        <el-button class="blue-btn new-btn" @click="cancelAdd()">取 消</el-button>
      </div>
    </Modal>
    <!-- 采集数据源查看、编辑 -->
    <Modal :title="titleName" v-model="mainDialog1" :closable="false" :mask-closable="false" width="800">
      <el-form label-width="100px" ref="form" :model="form" :rules="addRules">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look">
              <el-form-item label="数据源名称" prop="sourceName">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceName" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look">
              <el-form-item label="IP地址" prop="sourceIp">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceIp" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look">
              <el-form-item label="数据库名" prop="sourceExample">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceExample" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light dataSouRemarks-look">
              <el-form-item label="数据库类型" prop="dataBaseType">
                <div class="sel-group sel-blue fl new-input">

                  <el-select v-model="form.dataBaseType" placeholder="请选择" :disabled="mainDisabled">
                    <el-option
                      v-for="item in databaseTypeList"
                      :key="item.id"
                      :label="item.code"
                      :value="item.code"
                    ></el-option>
                  </el-select>

                </div>

                <!--<div class="input-tpm blue-input new-input ">-->
                <!---->
                <!--&lt;!&ndash;<el-input placeholder="" v-model="form.dataBaseType" :disabled="mainDisabled"></el-input>&ndash;&gt;-->
                <!--<el-select v-model="form.dataBaseType" placeholder="请选择" :disabled="mainDisabled">-->
                <!--<el-option-->
                <!--v-for="item in databaseTypeList"-->
                <!--:key="item.id"-->
                <!--:label="item.code"-->
                <!--:value="item.code">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!---->
                <!--</div>-->
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look">
              <el-form-item label="端口" prop="sourcePort">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourcePort" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look">
              <el-form-item label="所属系统" prop="sourceSystem">
                <div class="sel-group sel-blue fl new-input">

                  <el-select v-model="form.sourceSystem" placeholder="请选择" :disabled="mainDisabled">
                    <el-option
                      v-for="item in sourceSystemList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>

                </div>

                <!--<div class="input-tpm blue-input new-input">-->
                <!---->
                <!--<el-select v-model="form.sourceSystem" placeholder="请选择" :disabled="mainDisabled">-->
                <!--<el-option-->
                <!--v-for="item in sourceSystemList"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.code">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!---->
                <!--</div>-->
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look">
              <el-form-item label="用户" prop="sourceAccount">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceAccount" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look">
              <el-form-item label="密码" prop="sourcePass">
                <div class="input-tpm blue-input new-input">

                  <el-input
                    placeholder
                    v-bind:type="passType"
                    v-model="form.sourcePass"
                    :disabled="mainDisabled"
                  >
                    <el-button slot="append" @click="lookPassWord" v-if="lookP">查看</el-button>
                  </el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple dataSouRemarks-look" v-if="isShowSourceSid">
              <el-form-item label="表空间" prop="sourceSid">
                <div class="input-tpm blue-input new-input">

                  <el-input placeholder v-model="form.sourceSid" :disabled="mainDisabled"></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
          <div v-if="passvalieted">
            <el-col :span="12">
              <div class="grid-content bg-purple dataSouRemarks-look">
                <el-form-item label="密码验证" prop="twoaginPass">
                  <div class="input-tpm blue-input new-input">

                    <el-input
                      placeholder
                      type="password"
                      v-model="twoaginPass"
                      class="passVerification"
                    >
                      <el-button slot="append" @click="loginCeShi">确定</el-button>
                    </el-input>

                  </div>
                </el-form-item>
              </div>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple collectionData-look">
              <el-form-item label="数据源备注" prop="sourceRemarks">
                <div class="input-tpm blue-input blue-textarea" id="sourceRemarks">

                  <el-input
                    placeholder
                    type="textarea"
                    :disabled="mainDisabled"
                    v-model="form.sourceRemarks"
                  ></el-input>

                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          class="yellow-btn"
          type="primary"
          @click.native="passWordSubmit"
          v-if="mainDialogBtnType==3"
        >测试连接
        </el-button>
        <el-button
          class="yellow-btn"
          type="primary"
          @click.native="addMetaDataSure"
          v-if="mainDialogBtnType==3"
        >确 定
        </el-button>
        <el-button class="blue-btn new-btn" @click="cancelAdd()" v-if="mainDialogBtnType==2">关 闭</el-button>
        <el-button class="blue-btn new-btn" @click="cancelAdd()" v-if="mainDialogBtnType==3">取 消</el-button>
      </div>
    </Modal>
    <!-- 表同步查看字段 -->
    <Modal title="数据源管理-查看字段" v-model="checkFiled" :closable="false" :mask-closable="false" width="45%">
      <el-form label-width="100px">
        <div class="table-container fieldScroll pag-position" style="height: 350px">
          <el-table
            :data="fieldsTableData"
            stripe
            style="width: 100%"
            height="300"
            @selection-change="syncFieldsTableDataChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="英文表名">
              <template slot-scope="scope">{{ scope.row.targetField }}</template>
            </el-table-column>
            <el-table-column label="中文表名">
              <template slot-scope="scope">
                <!-- <div v-if="scope.row.targetFieldName!=''">{{ scope.row.targetFieldName }}</div> -->
                <!-- <el-input
                  v-if="scope.row.targetFieldName==''"
                  placeholder="请输入中文表名"
                  v-model="scope.row.targetFieldName"
                  class="clean_input"
                ></el-input>-->
                <el-input
                  v-if="scope.row.targetFieldName"
                  v-model="scope.row.targetFieldName"
                  class="clean_input"
                ></el-input>
                <el-button
                  v-if="!scope.row.targetFieldName"
                  type="text"
                  @click="addFields(scope.row,scope.$index)"
                >添加字段
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <!--  <el-pagination
              v-if="fieldsTableData.length!=0"
              style="bottom: 140px"
              :current-page="fieldCurrentPage"
              :page-size="fieldPageSize"
              @current-change="fieldCurrentChange"
              layout="prev, pager, next"
              :total="zxtbTotleNum"
              prev-text="上一页"
              next-text="下一页"
            ></el-pagination>-->
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" @click="saveTab">保存</el-button>
        <el-button class="blue-btn new-btn" @click="closeTab">关 闭</el-button>
      </div>
    </Modal
    >
    <!-- 表同步执行同步 -->
    <Modal title="采集数据源管理-执行同步" v-model="zxtb" :closable="false" :mask-closable="false" width="800">
      <el-form label-width="100px">
        <div class="table-container pag-position" style="height: 350px">
          <el-table
            :data="syncUnTableData"
            stripe
            style="width: 100%"
            height="350"
            @selection-change="syncUnTableDataChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="英文表名" :show-overflow-tooltip="true" :width="500">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="表类型">
              <template slot-scope="scope">{{ scope.row.type }}</template>
            </el-table-column>
            <el-table-column label="中文表名">
              <template slot-scope="scope">
                <!-- <div v-if="scope.row.remark">{{ scope.row.remark}}</div> -->

                <!-- <el-input style="width:100px"
                 :disabled="scope.row.remark!==''"
                  placeholder="请输入中文表名"
                  v-model="scope.row.remark"
                  class="clean_input"
                ></el-input>-->
                <!-- <Button v-if="!scope.row.remark" type="error">修改  </Button>   -->
                <el-input v-if="scope.row.remark" v-model="scope.row.remark" class="clean_input"></el-input>
                <el-button
                  v-if="!scope.row.remark"
                  type="text"
                  @click="addFieldsList(scope.row,scope.$index)"
                >添加字段
                </el-button>
              </template>
              <!--<template slot-scope="scope">

              </template>-->
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="zxtbFn">执行同步</el-button>
        <el-button class="blue-btn new-btn" @click="zxtb = false">取 消</el-button>
      </div>
    </Modal>

    <yj-dialog
      :title="'请输入' + rowName + '对应字段'"
      :visible.sync="addThisFields"
      :close-on-click-modal="false"
      width="25%"
    >
      <div style="height: 50px">
        <el-row>
          <el-col :span="24" style="margin-top: 10px">
            <div class="input-tpm yellow-input" style="width: 100%">

              <el-input v-model="thisFields"></el-input>

            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="footerPlus">
          <el-button class="yellow-btn" @click.native="goAddFields">确 定</el-button>
          <el-button class="blue-btn" @click="noAddFields">取 消</el-button>
        </div>
      </div>
    </yj-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  var qs = require('qs');
  import api from '../../api/bigData/daq/metaDataSource';
  import '../../assets/js/lodash';

  export default {
    name: 'metaDataSource',

    data() {
      //表单验证
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入有效信息'));
        } else {
          callback();
        }
      };
      //密码验证
      // var valiAginPass = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('请再次输入密码'));
      //   } else if (value !== this.form.sourcePass) {
      //     callback(new Error('两次输入密码不一致!'));
      //   } else {
      //     callback();
      //   }
      // };
      return {
        dataSourcePwd: '',
        addThisFields: false,
        thisFields: '',
        rowName: '',
        addIndex: '',
        addType: 0,
        titleName: '数据源',
        title: '数据源管理',
        sourceName: '',
        sourceIp: '',
        currentPage: 1,
        pageSize: 10,
        syncTableCurrentPage: 1,
        syncTablePageSize: 10,
        fieldCurrentPage: 1,
        fieldPageSize: 10,
        totleNum: 1,
        syncTableTotleNum: 1, //同步表总数
        zxtbTotleNum: 1, //查看字段总数
        isVisible: false,
        modalVisible: true,
        tableData: [], // 表数据
        syncTableData: [], //已同步的表数据
        syncUnTableData: [], //未同步的表数据
        oldTableData: [], // 表数据
        willSyncTableData: [], //要同步的数据
        fieldsTableData: [], //字段表
        onlyRow: '',
        userName: sessionStorage.adminName,
        isShowSourceSid: false, //表空间显示/隐藏
        clickLookField: '', //记录点击查看的字段
        /*fieldsTableHead: [    //字段表头部
              {
                prop: 'targetField',
                label: '英文名',
              },
              {
                prop: 'targetFieldName',
                label: '中文名',
              },
            ],*/
        //添加表单验证
        addRules: {
          sourceName: [{ validator: validatePass, trigger: 'blur' }],
          sourceIp: [{ validator: validatePass, trigger: 'blur' }],
          sourceAccount: [{ validator: validatePass, trigger: 'blur' }],
          dataBaseType: [{ validator: validatePass, trigger: 'change' }],
          sourcePass: [{ validator: validatePass, trigger: 'blur' }],
          sourcePort: [{ validator: validatePass, trigger: 'blur' }],
          sourceSystem: [{ validator: validatePass, trigger: 'change' }],
          sourceSid: [{ validator: validatePass, trigger: 'blur' }],
          sourceRemarks: [
            { validator: validatePass, trigger: 'blur' },
            {
              min: 1,
              max: 100,
              message: '数据源备注字符长度最大为100',
              trigger: blur
            }
          ]
        },
        //按钮权限
        btn: {
          saveDataSource: 0,
          findByDataSourceId: 0,
          deleByPrimaryKey: 0,
          updateDataSource: 0,
          selectByPage: 0
        },
        //所属系统
        sourceSystemList: [],
        //数据库类型
        databaseTypeList: [],
        //表头
        headerData: [
          {
            prop: 'sourceName',
            label: '数据源名称'
          },
          {
            prop: 'sourceExample',
            label: '数据库名'
          },
          {
            prop: 'dataBaseType',
            label: '数据库类型'
          },
          {
            prop: 'sourceAccount',
            label: '用户 '
          },
          {
            prop: 'sourceSid',
            label: '表空间 '
          },
          {
            prop: 'sourceIp',
            label: 'IP地址'
          },
          {
            prop: 'sourcePort',
            label: '端口'
          }
        ], // 表头数据
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
            txt: '表同步'
          }
        ],
        childHeaderData: [
          {
            prop: 'sourceTable',
            label: '英文表名'
          },
          {
            prop: 'sourceTableMame',
            label: '中文表名'
          },
          {
            prop: 'types',
            label: '表类型'
          }
        ],
        childTableData: [],
        operateChild: [
          {
            type: '1',
            txt: '查看字段'
          }
        ],
        cname: '',
        ip: '',
        metaMainView: true, // 显示子页面
        checkFiled: false, // 表同步查看字段页面
        zxtb: false, // 执行同步
        mainDialog: false, // 新增查看编辑页面
        mainDialog1: false, // 查看编辑页面
        aginPass: '', //确认密码
        passvalieted: false, //密码验证
        passType: 'password', //密码类型,
        close: true,
        cancel: true,
        form: {
          sourceName: '',
          sourceIp: '',
          sourceAccount: '',
          dataBaseType: '',
          sourcePass: '',
          sourcePort: '',
          sourceRemarks: '',
          sourceSystem: '',
          sourceSid: '',
          sourceExample: ''
        },
        twoaginPass: '',
        mainDisabled: false,
        mainDialogBtnType: '', // 1 新增 2 查看 3 编辑
        lookP: true, //查看按钮状态,
        insertCollection: true, //新增确定按钮状态
        testConnection: true,
        willFieldsTableData: [],
        resultFieldsTableData: []
      };
    },
    methods: {
      // 加密
      encrypt(password) {
        //公钥
        let publicKey =
          'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcRCS2y6ajKKYurADS07nLmyQBVwOoTr+LACehQIGKE3Pn4S2USUVLmZqw0Kkoib4TPnwFR/v0AF5H7oGORq4hTwNUJmDLduHOFkP+1b0R2Dd/cfR+MH/7TrMmmv+sSUnr1uraLCTLcITcaDIX/GY/8IdI3H62gh0o6tbEGZICvwIDAQAB'; // 从后台获取公钥，这里省略，直接赋值
        let encryptor = new JSEncrypt(); //新疆JsEncrypt对象
        encryptor.setPublicKey(publicKey); //设置公钥
        let rsaPassWord = encryptor.encrypt(password);
        return rsaPassWord;
      },
      // 执行表同步
      doSync(row) {
        var params = {
          dataSourceId: row.dataSourceId,
          tableName: row.sourceTable,
          types: row.types,
          remark: row.sourceTableMame
        };
        console.log(params);
        api.insertOneTable(params)
          .then(res => {
            if (res.code == 'code_200') {
              this.$notify({
                type: 'success',
                message: res.msg
              });
              this._getSyncTableData();
            } else {
              this.$notify({
                type: 'error',
                message: res.msg
              });
            }
          });
      },
      //添加字段
      goAddFields() {
        if (this.addType == 1) {
          if (this.thisFields) {
            this.fieldsTableData[this.addIndex].targetFieldName = this.thisFields;
            //     this.$message({
            //         type: "success",
            //         message: "字段添加成功: " + this.thisFields
            // });
          } else {
            this.$message({
              type: 'error',
              message: '您添加的字段为空，请重新添加字段 '
            });
          }
        } else if (this.addType == 2) {
          if (this.thisFields) {
            this.syncUnTableData[this.addIndex].remark = this.thisFields;
            this.$message({
              type: 'success',
              message: '字段添加成功: ' + this.thisFields
            });
          } else {
            this.$message({
              type: 'error',
              message: '您添加的字段为空，请重新添加字段 '
            });
          }
        }
        this.thisFields = '';
        this.addThisFields = false;
      },

      //取消添加字段
      noAddFields() {
        this.thisFields = '';
        this.addThisFields = false;
        // this.$message({
        //   type: "info",
        //   message: "取消输入"
        // });
      },
      //登录连接
      loginCeShi() {
        const self = this;
        api
          .getLogin({
            soucePassword: self.dataSourcePwd,
            account: self.userName,
            password: self.encrypt(self.twoaginPass)
          })
          .then(res => {
            if (res.code === 'code_200') {
              self.form.sourcePass = res.data;
              self.passType = 'text';
              self.passvalieted = false;
            } else {
              this.$notify({
                message: '密码错误',
                type: 'error',
                offset: 100
              });
            }
          });
      },
      //验证表单 查看字段
      addFields(row, index) {
        this.addType = 1;
        this.addIndex = index;
        this.addThisFields = true;
        this.rowName = row.targetField;

        //   this.$prompt("请输入" + row.targetField + "对应字段", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消"
        //   })
        //     .then(({ value }) => {
        //       row.targetFieldName = value;
        //       this.$message({
        //         type: "success",
        //         message: "字段添加成功: " + value
        //       });
        //     })
        //     .catch(() => {
        //       this.$message({
        //         type: "info",
        //         message: "取消输入"
        //       });
        //     });
      },
      //验证表单 检测表同步
      addFieldsList(row, index) {
        this.addType = 2;
        this.addIndex = index;
        this.addThisFields = true;
        this.rowName = row.name;
        // this.$prompt("请输入" + row.name + "对应字段", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消"
        // })
        //   .then(({ value }) => {
        //     row.remark = value;
        //   if(value){
        //       this.$message({
        //       type: "success",
        //       message: "字段添加成功: " + value
        //   });
        //   }else{
        //       this.$message({
        //       type: "error",
        //       message: "您添加的字段为空，请重新添加字段 "
        //       });
        //   }
        //   })
        //   .catch(() => {
        //     this.$message({
        //       type: "info",
        //       message: "取消输入"
        //     });
        //   });
      },
      closeTab() {
        this.fieldCurrentPage = 1;
        this.checkFiled = false;
      },
      goback() {
        this.metaMainView = !this.metaMainView;
      },
      // 点击选中查看、编辑、表同步
      handleClick(row, type) {
        this.onlyRow = row;
        const self = this;
        self.twoaginPass = '';
        switch (type) {
          case 1:
            self.dataSourcePwd = row.sourcePass;
            self.mainDialog1 = !self.mainDialog1;
            self.mainDialogBtnType = '2';
            self.close = true;
            self.cancel = false;
            self.mainDisabled = true;
            self.passvalieted = false;
            self.passType = 'password';
            api.getOnlyDataSource({ dataSourceId: row.id })
              .then(res => {
                self.form = res.data;
                self.isShowSoourceSid();
              });
            this.titleName = '采集数据源管理-查看';
            break;
          case 2:
            self.dataSourcePwd = row.sourcePass;
            self.mainDialog1 = !self.mainDialog1;
            self.mainDialogBtnType = '3';
            self.mainDisabled = false;
            self.passvalieted = false;
            self.close = false;
            self.cancel = true;
            self.passType = 'password';
            self.lookP = true;
            api.getOnlyDataSource({ dataSourceId: row.id })
              .then(res => {
                self.form = res.data;
                self.currentPwd = res.data.sourcePass;
                self.isShowSoourceSid();
              });

            this.titleName = '采集数据源管理-编辑';
            break;
          case 3: //表同步
            self.mainDisabled = false;
            self.passvalieted = false;
            self.metaMainView = !self.metaMainView;
            this._getSyncTableData(this.onlyRow);
            break;
        }
      },

      //是否显示表空间
      isShowSoourceSid() {
        let that = this;
        switch (that.form.dataBaseType) {
          case 'MYSQL':
            that.isShowSourceSid = false;
            break;
          case 'ORACLE':
            that.isShowSourceSid = true;
            break;
          case 'SQLSERVER':
            that.isShowSourceSid = false;
            break;
        }
      },

      // 新增
      addMetaData() {
        this.mainDialogBtnType = '1';
        this.mainDialog = true;
        this.mainDisabled = false;
        this.testConnection = true;
        this.insertCollection = false;
        this.titleName = '采集数据源管理—新增';
        for (const obj in this.form) {
          this.form[obj] = '';
        }
      },
      //新增、编辑  确认
      addMetaDataSure() {
        const self = this;
        //新增确认
        if (this.mainDialogBtnType === '1') {
          let addList = self.form;
          addList.sourcePass = self.encrypt(addList.sourcePass),
            this.$refs.form.validate(valid => {
              if (valid) {
                api.addDataSource(addList)
                  .then(res => {
                    if (res.code == 'code_201') {
                      this.$message({
                        type: 'success',
                        message: res.msg
                      });
                      self.mainDialog = false;
                      self.initDataResource();
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
        }

        // 编辑确认
        if (this.mainDialogBtnType === '3') {
          var obj = self.form;
          if (self.form.sourcePass === self.currentPwd) {
            delete obj.sourcePass;
          } else {
            obj.sourcePass = self.encrypt(obj.sourcePass);
          }
          api.modifyDataSource(obj)
            .then(res => {
              if (res.code == 'code_201') {
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                self.mainDialog1 = false;
                self.initDataResource();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            });
          // this.oldTableData.forEach((item, index) => {
          //   if (item.id == newObj.id) {
          //     self.oldTableData[index] = newObj;
          //   }
          // });
          // this.$notify({
          //   title: '成功',
          //   message: '编辑完成',
          //   type: 'success',
          //   offset: 10
          // });
          // this.$alert('编辑完成', '提示', {
          //   confirmButtonText: '确定',
          //   confirmButtonClass: 'yellow-btn',
          //   // // callback: action => {
          //   // //   this.$message({
          //   // //     type: 'info',
          //   // //     message: `action: ${ action }`
          //   // //   });
          //   // }
          // });
        } else {
          // newObj.id = Math.random();
          // this.oldTableData.push(newObj);
        }

        // this.tableData = this.oldTableData;
        // for (const obj in this.form) {
        //   this.form[obj] = '';
        // }
        // this.mainDialog = false;
      },
      //验证密码
      lookPassWord() {
        const self = this;
        self.passvalieted = true;
      },
      //测试连接
      passWordSubmit() {
        const self = this;
        api
          .getPassWord({
            dataBaseType: self.form.dataBaseType,
            sourceIp: self.form.sourceIp,
            sourcePort: self.form.sourcePort,
            sourceAccount: self.form.sourceAccount,
            sourcePass: self.form.sourcePass,
            sourceSid: self.form.sourceSid,
            sourceExample: self.form.sourceExample
          })
          .then(res => {
            if (res.data) {
              this.$notify({
                message: '测试连接成功',
                type: 'success',
                offset: 100
              });
              self.insertCollection = true;
              self.testConnection = false;
            } else {
              this.$notify({
                message: '测试连接失败',
                type: 'error',
                offset: 100
              });
            }
          })
          .catch(e => {
            this.$notify({
              message: '测试连接失败',
              type: 'error',
              offset: 100
            });
          });
      },
      // 取消新增
      cancelAdd() {
        for (const obj in this.form) {
          this.form[obj] = '';
        }
        this.mainDialog = false;
        this.mainDialog1 = false;
      },

      // 查看字段
      checkFieldBtn(row, type) {
        this.clickLookField = row;
        this.checkFiled = true;
        if (this.checkFiled == true) {
          var currentPage = this.fieldCurrentPage;
        } else {
          var currentPage = 1;
        }
        api
          .getTableFields({
            pageSize: this.fieldPageSize,
            currentPage: this.fieldCurrentPage,
            syncTableId: this.clickLookField.id
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.fieldsTableData = res.data;
              this.zxtbTotleNum = res.page.totalNumber;
            }
          });
      },

      jcbtb() {
        this.syncUnTableData = [];
        api
          .getUnsyncTableData({
            dataSourceId: this.onlyRow.id
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.syncUnTableData = res.data;
            }
          });
        this.zxtb = true;
      },
      //选未同步的表
      syncUnTableDataChange(item) {
        this.willSyncTableData = item;
      },
      syncFieldsTableDataChange(item) {
        this.willFieldsTableData = item;
      },
      saveTab() {
        this.$nextTick(() => {
          this.willFieldsTableData.map(item => {
            this.resultFieldsTableData.push({
              id: item.id,
              remark: item.targetFieldName
            });
          });
          api.updateReamk(this.resultFieldsTableData)
            .then(res => {
              if (res.code == 'code_200') {
                this.checkFiled = false;
                /*this.$notify({
                    title: '成功',
                    message: '执行同步开始',
                    type: 'success',
                    offset: 100,
                    });*/
              }
            });
        });
      },
      zxtbFn() {
        this.$store.commit('showLoading', true);
        let syncTableName = [];
        let syncTableType = [];
        let syncTableRemark = [];
        this.willSyncTableData.forEach(value => {
          syncTableName.push(value.name);
          syncTableType.push(value.type);
          syncTableRemark.push(value.remark);
        });
        api
          .executeTableSync({
            dataSourceId: this.onlyRow.id,
            syncTableName: syncTableName.join(','),
            syncTableType: syncTableType.join(','),
            remark: syncTableRemark.join(',')
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.$store.commit('hideLoading', false);
              this.$notify({
                message: '执行同步开始',
                type: 'success',
                offset: 100
              });
              this.zxtb = false;
              this._getSyncTableData();
            } else {
              this.$store.commit('hideLoading', false);
              this.$notify({
                message: '执行同步失败',
                type: 'error',
                offset: 100
              });
            }
          }, err => {
            this.$store.commit('hideLoading', false);
          });
      },

      // 初始化数据
      initDataResource() {
        this.$store.commit('showLoading', true);
        // this.$store.commit('showLoading');
        // store.showLoading(state);
        let self = this;
        api
          .getDataSource({
            sourceName: self.sourceName,
            sourceIp: self.sourceIp,
            currentPage: self.currentPage,
            pageSize: self.pageSize
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.$store.commit('hideLoading', false);
              res.data.forEach(value => {
                value.createTime = self.formatDate(value.createTime);
                value.updateTime = self.formatDate(value.updateTime);
              });
              self.tableData = res.data;
              self.totleNum = res.page.totalNumber;
            }
          });
      },
      //获取所属系统
      _getSourceSystem() {
        api.getSourceSystem({ code: 'sysRourceCode' })
          .then(res => {
            this.sourceSystemList = res.data;
          });
      },
      //获取数据库类型
      _getDatabaseType() {
        api.getDatabaseType({ code: 'DB_TYPE' })
          .then(res => {
            this.databaseTypeList = res.data;
          });
      },
      //获取按钮权限
      getBtns() {
        var self = this;
        let routerParams;
        routerParams = self.$route.query.menuLink || sessionStorage['menuLink'];
        let sysCode = sessionStorage['sysCode'];
        api.getBtnMenu({ menuLink: routerParams, sysCode: sysCode })
          .then(res => {
            if (res.code === 'code_200') {
              res.data.forEach(item => {
                if (item.includes('saveDataSource@POST')) {
                  self.btn.saveDataSource = 1;
                }
                if (item.includes('findByDataSourceId@GET')) {
                  self.btn.findByDataSourceId = 1;
                }
                if (item.includes('deleByPrimaryKey@DELETE')) {
                  self.btn.deleByPrimaryKey = 1;
                }
                if (item.includes('updateDataSource@PUT')) {
                  self.btn.updateDataSource = 1;
                }
                if (item.includes('selectByPage@GET')) {
                  self.btn.selectByPage = 1;
                }
              });
            }
          });
      },

      //获取已同步表数据
      _getSyncTableData() {
        api
          .getSyncTableData({
            currentPage: this.syncTableCurrentPage,
            pageSize: this.syncTablePageSize,
            dataSourceId: this.onlyRow.id
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.syncTableData = res.data;
              this.syncTableTotleNum = res.page.totalNumber;
            }
          });
      },

      // 页码变更
      handleCurrentChange(val) {
        this.currentPage = val;
        this.initDataResource();
      },

      //已同步表的表页码改变
      syncTableCurrentChange(val) {
        this.syncTableCurrentPage = val;
        this._getSyncTableData();
      },

      //查看字段页码改变
      fieldCurrentChange(val) {
        this.fieldCurrentPage = val;
        this.checkFieldBtn(this.clickLookField);
      },

      // 查询
      checkMetaData() {
        this.initDataResource();
      },

      // 重置
      resetMetaData() {
        this.sourceName = '';
        this.sourceIp = '';
        this.initDataResource();
      },

      dataBaseTypeChange() {
        let that = this;
        switch (that.form.dataBaseType) {
          case 'MYSQL':
            that.isShowSourceSid = false;
            break;
          case 'ORACLE':
            that.isShowSourceSid = true;
            break;
          case 'SQLSERVER':
            that.isShowSourceSid = false;
            break;
        }
      }
    },
    mounted() {
      this.getBtns();
      this.initDataResource();
      this._getSourceSystem();
      this._getDatabaseType();
    },

    //监听模态框的变化
    watch: {
      mainDialog(val) {
        if (!val) {
          this.$refs.form.resetFields();
        }
      }
    }
  };
</script>
<style lang="less" type="text/less">
  .footerPlus {
    position: absolute;
    left: 29%;
    bottom: 18%;
  }

  @import "metaDataSource.less";
</style>
