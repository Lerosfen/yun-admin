<template>
  <div class="list-container shadow">
    <table-honer></table-honer>
    <div class="content-section">
      <el-row>
        <el-col :span="21">
          <list-table-title title="数据填充规则管理/新增规则"></list-table-title>
          <div class="search-template">
            <!-- 规则名称 -->
            <el-form label-width="170px" :rules="addFormRules" ref="addFormRules" :model="form">
              <el-row>
                <el-col :span="18" :offset="3" style="margin-top:20px">
                  <div class="input-group">
                    <span class="xuhao">01</span>
                    <label for class="middle clean_mc">/规则名称</label>
                    <el-form-item prop="ruleName">
                      <div class="input-tpm blue-input new-input r-input">
                        <el-input placeholder="请输入规则名称" v-model="form.ruleName"></el-input>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
                <!-- 基础库 -->
                <el-col :span="18" :offset="3">
                  <div class="input-group">
                    <span class="xuhao">02</span>
                    <label for class="middle clean_mc">/所属库</label>
                    <el-form-item prop="belongSto">
                      <div class="input-tpm blue-input new-input r-input">
                        <el-select
                          placeholder="请选择所属库"
                          v-model="form.belongSto"
                          @change="handleSelTargetTbl"
                        >
                          <el-option
                            v-for="item in statusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
                <!-- 选择目标表 -->
                <el-col :span="18" :offset="3">
                  <div class="input-group">
                    <span class="xuhao">03</span>
                    <label for class="middle clean_mc">/目标表</label>
                    <el-form-item>
                      <div class="input-tpm blue-input new-input r-input">
                        <el-input
                          placeholder="请选择目标表"
                          v-model="placeHdtargetTblName"
                          disabled
                        ></el-input>
                      </div>
                    </el-form-item>
                    <el-button
                      class="blue-btn fl choisetab"
                      type="primary"
                      @click="selTargetTbl()"
                      style="position: absolute;right: 48%;top:73%"
                    >选择目标表
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <!-- 主页表格 -->
          <div v-if="tableData.length!=0" class="table-container wordtable-container">
            <el-row>
              <el-col :span="15" :offset="2">
                <el-table ref="multipleTables" :data="tableData" height="410">
                  <!-- <el-table-column type="selection"></el-table-column> -->
                  <el-table-column
                    v-for="item in headerData"
                    :label="item.label"
                    :prop="item.prop"
                    :key="item.id"
                    :width="item.width"
                  ></el-table-column>
                  <el-table-column label="主键" width="50">
                    <template slot-scope="scope">
                      <el-radio
                        disabled
                        v-model="targetTblMainKey"
                        :label="scope.row.metadataEnglisName"
                      >&nbsp;
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <span
                        @click="selSource(scope.row, scope.$index)"
                        :class="[indexList.includes(scope.$index)?'add-source-clicked':'add-source']"
                      >来 源</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content"></div>
        </el-col>
      </el-row>

      <div class="btn-group">
        <el-button class="yellow-btn" @click="addFillRuleSubmit()">确 定</el-button>
        <el-button class="blue-btn" @click="goBack()">取 消</el-button>
      </div>
      <!-- 配置表 -->
      <transition name="right">
        <div class="fuseFields" v-show="isConfigDialogShow" transiton="right">
          <span style="display: inline-block;color:#616161;transform: translateY(-20px);">配置表</span>
          <div class="table-container selectWordDialog">
            <el-row>
              <el-col :span="24">
                <el-table :data="configTblData" style="width: 100%" height="480">
                  <el-table-column
                    v-for="item in configTblHeader"
                    :label="item.label"
                    :prop="item.prop"
                    :key="item.id"
                    width="100"
                    v-if="item.label"
                    :show-overflow-tooltip="true"
                    :width="145"
                  ></el-table-column>
                  <el-table-column label="操作" :prop="mainTbl">
                    <template slot-scope="scope">
                      <div style="margin:5px 0">
                        <el-button
                          type="text"
                          :data-index="scope.$index"
                          @click="setAsMain(scope.row, scope.$index)"
                        >设为主表
                        </el-button>
                        <span
                          class="add-child-main-key"
                          v-if="scope.row.mainTbl"
                          @click="mainKeySrc(scope.row)"
                        >主键来源</span>
                        <span
                          class="add-child yellow"
                          v-if="scope.row.mainTbl == false && btnShow"
                          @click="aboutField(scope.row)"
                        >关联字段</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </div>
      </transition>
    </div>
    <!-- 选择目标表弹框 -->
    <Modal v-model="selTblView" title="选择目标表" width="40%" :closable="false" :mask-closable="false">
      <el-row>
        <el-col :span="18">
          <div class="input-tpm blue-input new-input fr">
            <el-input
              placeholder="请输入目标表名称"
              v-model="targetTblName"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="new-btn" @click="searchTargetTbl">查 询</div>
        </el-col>
        <el-col :span="3">
          <div class="new-btn" @click="resetModal">重 置</div>
        </el-col>
      </el-row>
      <div class="table-container">
        <el-row>
          <el-col>
            <el-table :data="targetTblData" height="250" style="width: 100%">
              <el-table-column width="60">
                <template slot-scope="scope">
                  <el-radio
                    @change="getCurrentRow(scope.row)"
                    :label="scope.row.tableEnglishNames"
                    v-model="radio"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in targetTblHeader"
                :key="item.id"
                :prop="item.prop"
                :label="item.label"
              ></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
        <el-button class="blue-btn" type="primary" @click.native="submitTargetTbl">确 定</el-button>
        <el-button class="yellow-btn" @click="cancleModal(1)">取 消</el-button>
      </div>
    </Modal>
    <!-- 主键来源 -->
    <Modal v-model="mainSrcView" title="配置目标表主键" :closable="false" :mask-closable="false" width="50%">
      <el-row>
        <el-col>
          <div class="table-container pag-position">
            <el-table :data="mainKeySrcData" height="350">
              <el-table-column
                v-for="item in mainKeySrcHeader"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
              ></el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <span class="add-source yellow" @click="selprimaryKeySource(scope.row)">来 源</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModal(2)">关 闭</el-button>
      </div>
    </Modal>
    <!-- /*********************************************************/ -->
    <!-- 来源 配置填充来源 -->

    <Modal v-model="selSourceView" title="配置填充来源" width="50%" :closable="false" :mask-closable="false">
      <div class="search-section clearfix" style="margin-top: 0">
        <el-button class="yellow-btn" @click="addData">新 增</el-button>
      </div>
      <div class="table-container pag-position">
        <el-row>
          <el-col :span="24">
            <el-table :data="sourceTblData" style="width: 100%" height="300">
              <el-table-column
                v-for="item in sourceTblHead"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
                :width="item.width"
              ></el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <div>
                    <span
                      :data-index="scope.$index"
                      @click="delThisRow(scope.$index)"
                      class="move-btn yellow"
                    >删除</span>
                    <span
                      :data-index="scope.$index"
                      @click="turnTop(scope.$index)"
                      v-if="scope.$index!=0"
                      class="move-btn yellow"
                    >上移</span>
                    <span
                      :data-index="scope.$index"
                      @click="turnBottom(scope.$index)"
                      v-if="scope.$index!=sourceTblData.length-1"
                      class="move-btn yellow"
                    >下移</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer" style="margin-top: 8px">
        <el-button class="blue-btn" @click.native="submitFillSrc">确 定</el-button>
        <el-button class="yellow-btn" @click="cancleModal(4)">取 消</el-button>
      </div>
    </Modal>

    <!-- 配置目标表主键填充来源 -->
    <Modal
      v-model="targetTblmainKeySrcView"
      title="配置目标表主键填充来源"
      width="50%"
      :closable="false"
      :mask-closable="false"
    >
      <div class="search-section clearfix" style="margin-top: 0">
        <el-button class="yellow-btn" @click="addmainKeyData">新 增</el-button>
      </div>

      <div class="table-container pag-position">
        <el-row>
          <el-col :span="24">
            <el-table :data="targetTblmainKeySrcData" style="width: 100%" height="300">
              <el-table-column
                v-for="item in targetTblmainKeySrcHeader"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
                :width="item.width"
              ></el-table-column>
              <el-table-column label="操作" width="60" align="center">
                <template slot-scope="scope">
                  <div>
                    <span
                      :data-index="scope.$index"
                      @click="delThisRows(scope.$index)"
                      class="move-btn yellow"
                    >删除</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 8px">
        <el-button class="blue-btn" @click.native="submitMainKeySrc">确 定</el-button>
        <el-button class="yellow-btn" @click="cancleModal(10)">取 消</el-button>
      </div>
    </Modal>

    <!-- 选择来源表 -->
    <Modal v-model="selSourceTblView" title="选择来源表" :closable="false" :mask-closable="false" width="50%">
      <el-form label-position="right" label-width="60px" class="fr">
        <el-row>
          <el-col :span="8" :pull="1">
            <el-form-item label="表名">
              <div class="input-tpm yellow-input new-input">
                <el-input placeholder="请输入表名" v-model="cleanAddobj.sourceTable"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="表类型">
              <div class="sel-group sel-yellow fl new-input">
                <el-select v-model="cleanAddobj.syncTableType" placeholder="请选择表类型">
                  <el-option
                    v-for="item in tableLeixing"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="1">
            <div class="new-btn" @click="checkMetaData()">查 询</div>
          </el-col>
          <el-col :span="3" style="margin-left: 10px;">
            <div class="new-btn" @click="resetMetaData()">重 置</div>
          </el-col>
        </el-row>
        <el-row></el-row>
      </el-form>
      <el-row>
        <el-col>
          <div class="table-container pag-position" style="margin-top:-10px">
            <el-row>
              <el-col>
                <el-table :data="sourceTableData" height="325">
                  <el-table-column
                    v-for="item in sourceTableHead"
                    :prop="item.prop"
                    :label="item.label"
                    :key="item.id"
                    :width="item.width"
                  ></el-table-column>

                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <span class="add-child1" @click="selField(scope.row)">选字段</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <!-- /**************************************************************** -->
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModal(5)">关 闭</el-button>
      </div>
    </Modal>

    <!-- 新增目标表主键填充来源 -->
    <Modal v-model="selmainKeySourceTblView" title="选择主键来源" :closable="false" :mask-closable="false" width="50%">
      <el-form label-position="right" label-width="60px" class="fr">
        <el-row>
          <el-col :span="8" :pull="1">
            <el-form-item label="表名">
              <div class="input-tpm yellow-input new-input">
                <el-input placeholder="请输入表名" v-model="mainKeySrcTbl.sourceTable"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="表类型">
              <div class="sel-group sel-yellow fl new-input">
                <el-select v-model="mainKeySrcTbl.syncTableType" placeholder="请选择">
                  <el-option
                    v-for="item in tableLeixing"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="1">
            <div class="new-btn" @click="checkMetaDatas()">查 询</div>
          </el-col>
          <el-col :span="3" style="margin-left: 10px;">
            <div class="new-btn" @click="resetMetaDatas()">重 置</div>
          </el-col>
        </el-row>
        <el-row></el-row>
      </el-form>
      <el-row>
        <el-col>
          <div class="table-container pag-position" style="margin-top:-10px">
            <el-row>
              <el-col>
                <el-table :data="mainkeySrcTblData" style="100%" height="330">
                  <el-table-column
                    v-for="item in mainKeySrcTblHeader"
                    :prop="item.prop"
                    :label="item.label"
                    :key="item.id"
                    :width="item.width"
                  ></el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <span class="add-child1" @click="selmainKeyField(scope.row)">选字段</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="cancleModal(11)">关 闭</el-button>
      </div>
    </Modal>

    <!-- 选择来源字段 -->
    <Modal v-model="selFieldView" title="选择来源字段" :closable="false" :mask-closable="false" width="50%">
      <div class="table-container pag-position">
        <el-row>
          <el-col :span="24">
            <el-table :data="sourceFieldData" height="355">
              <el-table-column
                v-for="item in sourceFieldHead"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
              ></el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selSrcField"
                    @change="handleSelField(scope.row)"
                    :label="scope.row.targetField"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click.native="submitSrcField">确 定</el-button>
        <!-- <el-button class="blue-btn" @click="resetModel()">重 置</el-button> -->
        <el-button class="yellow-btn" @click="cancleModal(6)">取 消</el-button>
      </div>
    </Modal>

    <!-- 选择主键来源字段 -->
    <Modal v-model="selmainKeyFieldView" title="选择主键来源字段" width="50%" :closable="false" :mask-closable="false">
      <div class="table-container pag-position">
        <el-row>
          <el-col :span="24">
            <el-table :data="mainKeySrcFieldData" style="100%" height="360">
              <el-table-column
                v-for="item in mainKeySrcFieldHeader"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
              ></el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selmainKeySrcField"
                    @change="handleMainkeySelField(scope.row)"
                    :label="scope.row.targetField"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click.native="submitMainKeySrcField">确 定</el-button>
        <!-- <el-button class="blue-btn" @click="resetModel()">重 置</el-button> -->
        <el-button class="yellow-btn" @click="cancleModal(12)">取 消</el-button>
      </div>
    </Modal>

    <!-- 关联字段选择来源字段 -->
    <Modal v-model="fieldView" title="配置关联字段" width="50%" :closable="false" :mask-closable="false">
      <div class="table-container pag-position">
        <el-row type="flex" align="middle">
          <el-col :span="3">
            <span>请选择源表</span>
          </el-col>
          <el-col :span="18">
            <div class="input-tpm blue-input">
              <select
                placeholder
                v-model="selFieldSrcTbl"
                @change="handleSelFieldSrcTbl"
                style="width: 663px; margin-top: 5px"
              >
                <option
                  v-for="item in srcTblList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></option>
              </select>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" style="margin-top: 10px">
            <el-table
              ref="multipleTable"
              :data="configAboutFieldData"
              style="100%"
              height="330"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                v-for="item in configAboutFieldHeader"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
                :width="item.width"
              ></el-table-column>
              <el-table-column label="关联字段" width="110">
                <template slot-scope="scope">
                  <div class="input-tpm blue-input">
                    <span
                      class="add-sources yellow"
                      @click="selAboutTbl(scope.row, scope.$index)"
                    >{{ scope.row.fieldData }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="submitAboutField">确 定</el-button>
        <el-button class="yellow-btn" @click="cancleModal(3)">取 消</el-button>
      </div>
    </Modal>

    <!-- 关联字段选择关联表 -->
    <Modal v-model="selAboutTblView" title="配置关联字段(表)" width="50%" :closable="false" :mask-closable="false">
      <div class="table-container pag-position">
        <el-row>
          <el-col style="margin-top: 20px">
            <el-table :data="configAboutFieldtblData" style="100%" height="350">
              <el-table-column
                v-for="item in configAboutFieldtblHeader"
                :prop="item.prop"
                :label="item.label"
                :key="item.id"
                :width="item.width"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selaboutFieldTbl"
                    @change="handleSelAboutFieldTbl(scope.row)"
                    :label="scope.row.targetField"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="submitAboutFieldTbl">确 定</el-button>
        <!-- <el-button class="blue-btn" @click="resetModel()">重 置</el-button> -->
        <el-button class="yellow-btn" @click="cancleModal(13)">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../../../src/api/bigData/daq/fillRuleManage';
  import Common from '../../../../config/common';

  export default {
    data() {
      return {
        form: {
          ruleName: '',
          belongSto: ''
        },
        addFormRules: {
          // ruleName: {},
          // belongSto: {}
          ruleName: [
            { required: true, message: '请输入规则名称', trigger: 'blur' }
          ],
          belongSto: [
            { required: true, message: '请选择基础库', trigger: 'change' }
          ]
        },
        statusList: [],
        headerData: [
          {
            prop: 'metadataEnglisName',
            label: '英文名称'
          },
          {
            prop: 'metadataName',
            label: '中文名称'
          },
          {
            prop: 'dataType',
            label: '数据类型'
          },
          {
            prop: 'dataFormat',
            label: '数据格式',
            width: 130
          }
        ],
        tableData: [],
        selTblView: false,
        targetTblHeader: [
          {
            prop: 'tableNames',
            label: '表名称'
          },
          {
            prop: 'tableEnglishNames',
            label: '英文名称'
          },
          {
            prop: 'primarykeys',
            label: '主键'
          },
          {
            prop: 'baseLibraryName',
            label: '所属库'
          }
        ],
        targetTblName: '',
        radio: '',
        targetTblData: [],
        configTblHeader: [
          {
            prop: 'chName',
            label: '中文名称'
          },
          {
            prop: 'tblEnName',
            label: '英文名称'
          },
          {
            prop: 'mainTbl'
          }
        ],
        configTblData: [],
        isConfigDialogShow: false,
        sourceOrField: '',
        isSourceBtnShow: false,
        isFieldBtnShow: false,
        btnShow: false,
        mainTbl: '',
        mainSrcView: false,
        fieldView: false,
        mainKeySrcHeader: [
          {
            prop: 'enName',
            label: '英文名称'
          },
          {
            prop: 'chName',
            label: '中文名称'
          },
          {
            prop: 'dataType',
            label: '数据类型'
          },
          {
            prop: 'dataFormat',
            label: '数据格式'
          }
        ],
        mainkeySrcRadio: '',
        mainTblName: '人口基本信息表', //test
        mainKeySrcData: [],
        selFieldSrcTbl: '',
        configFieldRadio: '',
        configFieldHeader: [
          {
            prop: 'enName',
            label: '英文名称'
          },
          {
            prop: 'chName',
            label: '中文名称'
          },
          {
            prop: 'dataType',
            label: '数据类型'
          },
          {
            prop: 'dataFormat',
            label: '数据格式'
          }
        ],
        configFieldData: [],
        targetTblMainKey: '',
        srcTblList: [],

        sourceTblHead: [
          {
            prop: 'chName',
            label: '表中文名称'
          },
          {
            prop: 'tblEnName',
            label: '表英文名称'
          },
          {
            prop: 'fieldName',
            label: '字段名'
          },
          {
            prop: 'enName',
            label: '英文名'
          },
          {
            prop: 'dataType',
            label: '数据类型'
          }
          // {
          //   prop: "tblLength",
          //   label: "长度"
          // }
        ],

        sourceTblData: [],
        sourceTableHead: [
          {
            prop: 'sourceTable',
            label: '数据库表名',
            width: '400'
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
        sourceTableData: [],
        sourceFieldHead: [
          {
            prop: 'targetField',
            label: '英文名称'
          },
          {
            prop: 'targetFieldName',
            label: '中文名称'
          },
          {
            prop: 'fieldType',
            label: '数据类型'
          }
          // {
          //   prop: "dataFormat",
          //   label: "数据格式"
          // }
        ],
        sourceFieldData: [],
        selSourceView: false,
        selSourceTblView: false,
        selFieldView: false,
        targetTblPage: {
          currentPage: 1,
          pageSize: 10
        },
        selTargetTblId: '',
        placeHdtargetTblName: '',
        isSelTargetTbl: true,
        cleanAddobj: {
          sourceTable: '',
          // dataSourceId:'',
          syncTableType: '',
          currentPage: 1,
          pageSize: 10
        },
        //清洗字段查询条件；
        cleanwordobj: {
          tableName: '',
          tableType: '',
          currentPage: 1,
          pageSize: 10
        },
        tableLeixing: [
          {
            id: 2,
            name: '采集目标'
          },
          {
            id: 3,
            name: '清洗目标'
          },
          {
            id: 4,
            name: '融合目标'
          }
        ],
        selSrcField: '',
        selmainKeySrcField: '',
        selaboutField: '',
        // 很关键
        currentField: '',
        currentMainKeyField: '',
        tblNames: '',
        mainKeyTblNames: '',
        srcFieldList: [],
        // 目标表主键信息
        primaryInfo: {
          pkEnName: '',
          pkChName: '',
          pkdataType: '',
          pkdataFormat: ''
        },

        //配置目标表主键填充来源弹框
        targetTblmainKeySrcView: false,
        targetTblmainKeySrcData: [],
        targetTblmainKeySrcHeader: [
          {
            prop: 'chName',
            label: '表中文名称'
          },
          {
            prop: 'tblEnName',
            label: '表英文名称'
          },
          {
            prop: 'fieldName',
            label: '字段名'
          },
          {
            prop: 'enName',
            label: '英文名'
          },
          {
            prop: 'dataType',
            label: '数据类型'
          }
        ],
        // 新增目标表主键填充来源
        selmainKeySourceTblView: false,
        mainKeySrcTbl: {
          sourceTable: '',
          syncTableType: '',
          currentPage: 1,
          pageSize: 10
        },
        mainkeySrcTblData: [],
        mainKeySrcTblHeader: [
          {
            prop: 'sourceTable',
            label: '数据库表名',
            width: '400'
          },
          {
            prop: 'sourceTableMame',
            label: '描述'
          },
          {
            prop: 'syncTableType',
            label: '表分类 '
          }
        ],
        //
        selmainKeyFieldView: false,
        mainKeySrcFieldData: [],
        mainKeySrcFieldHeader: [
          {
            prop: 'targetField',
            label: '英文名称'
          },
          {
            prop: 'targetFieldName',
            label: '中文名称'
          },
          {
            prop: 'fieldType',
            label: '数据类型'
          }
        ],
        // 关联字段选择来源字段
        configAboutFieldData: [],
        configAboutFieldHeader: [
          {
            prop: 'targetField',
            label: '英文名称'
          },
          {
            prop: 'targetFieldName',
            label: '中文名称',
            width: 200
          },
          {
            prop: 'fieldType',
            label: '数据类型'
          }
        ],
        tableTypess: '',
        selAboutTblView: false,
        //
        configAboutFieldtblData: [],
        configAboutFieldtblHeader: [
          {
            prop: 'targetField',
            label: '英文名称'
          },
          {
            prop: 'targetFieldName',
            label: '中文名称',
            width: 230
          },
          {
            prop: 'fieldType',
            label: '数据类型'
          }
        ],
        selaboutFieldTbl: '',
        showSelField: '',
        tblTargetIndex: '',

        myRowDetail: '',
        myId: '',
        // 传参
        paramsFillSrc: {},
        // 当前表名
        currentTblName: '',

        paramsPkeyFillSrc: {},

        paramsAboutField: [],

        currentTableName: '',

        indexList: []
      };
    },
    mounted() {
      this.selectAllBaseLibrary();
    },
    methods: {
      searchTargetTbl() {
        this.selTargetTbl();
      },
      //    查询基础库下拉
      selectAllBaseLibrary() {
        api
          .selectAllBaseLibrary({
            pageSize: 100000,
            currentPage: 1
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.statusList = res.data;
            }
          });
      },
      // 选择目标表
      selTargetTbl() {
        var self = this;
        if (self.form.belongSto != '') {
          self.selTblView = true;
          api
            .selectAllBasicTableManagement({
              currentPage: self.targetTblPage.currentPage,
              pageSize: self.targetTblPage.pageSize,
              tableNames: self.targetTblName,
              // tableEnglishNames: '',
              baseLibraryID: self.form.belongSto
            })
            .then(res => {
              if (res.code == 'code_200') {
                self.targetTblData = res.data;
              }
            });
        } else {
          self.$message({
            type: 'error',
            message: '请选择所属库',
            customClass: 'zZindex'
          });
        }
      },

      resetModal() {
        this.targetTblName = '';
        this.radio = '';
        this.selTargetTbl();
      },
      cancleModal(type) {
        switch (type) {
          case 1:
            this.selTblView = false;
            break;
          case 2:
            this.mainSrcView = false;
            break;
          case 3:
            this.fieldView = false;
            break;
          case 4:
            this.selSourceView = false;
            if (this.sourceTblData.length == 0) {
              var i = this.tblTargetIndex;
              this.tableData[i].isSelSrc = true;
            }
            break;
          case 5:
            this.selSourceTblView = false;
            break;
          case 6:
            this.selFieldView = false;
            this.tableTypess = '';
            break;
          case 10:
            this.targetTblmainKeySrcView = false;
            break;
          case 11:
            this.selmainKeySourceTblView = false;
            break;
          case 12:
            this.selmainKeyFieldView = false;
            break;
          case 13:
            this.selAboutTblView = false;
        }
      },
      configTbl() {
        this.isConfigDialogShow = true;
      },
      closeConfigDialog() {
        this.isConfigDialogShow = false;
      },
      setAsMain(row, index) {
        var arr = this.configTblData;
        for (var i = 0; i < arr.length; i++) {
          arr[i].mainTbl = false;
          arr[index].mainTbl = true;
        }
        this.btnShow = true;
      },
      mainKeySrc(row) {
        // 主键来源
        var self = this;
        self.mainSrcView = true;
        // 配置参数
        self.paramsPkeyFillSrc[row.tblEnName] = {};

        api
          .selectBasicTableManagementKey({
            id: self.selTargetTblId
          })
          .then(res => {
            if (res.code == 'code_200') {
              var pkName = res.data.primarykeys;
              var dataList = res.data.metadataMaintenance;
              var arrList = [];
              for (var i = 0; i < dataList.length; i++) {
                if (dataList[i].metadataEnglisName == pkName) {
                  arrList.push({
                    enName: dataList[i].metadataEnglisName,
                    chName: dataList[i].metadataName,
                    dataType: dataList[i].dataType,
                    dataFormat: dataList[i].dataFormat
                  });
                }
              }
              self.mainKeySrcData = arrList;
            }
          });
      },
      selprimaryKeySource(row) {
        // 配置目标表主键来源
        var self = this;
        self.targetTblmainKeySrcView = true;
        // 配置参数
        var currentpkTblName = Object.getOwnPropertyNames(
          self.paramsPkeyFillSrc
        )[1];
        self.paramsPkeyFillSrc[currentpkTblName] = {};
        self.paramsPkeyFillSrc[currentpkTblName][row.enName] = {};
      },

      aboutField(row) {
        ///////////////////////////////////////////////////
        var self = this;
        self.fieldView = true;
        // 配置参数
        // 当前表名
        self.currentTableName = row.tblEnName;
        var arr = self.paramsAboutField;
        self.paramsAboutField.push({
          [row.tblEnName]: {}
        });
        api
          .getAllCleanWords({
            tableName: row.tblEnName,
            tableType: self.tableTypess,
            currentPage: 1,
            pageSize: 10
          })
          .then(res => {
            if (res.code === 'code_200') {
              self.configAboutFieldData = res.data;
              self.configAboutFieldData.forEach(item => {
                item.fieldData = '选 择';
              });
            }
          });
        // 关联表名
        var arr = self.configTblData;
        if (self.srcTblList.length == 0) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].chName != row.chName) {
              self.srcTblList.push({
                id: i,
                name: arr[i].chName
              });
            }
          }
        }
      },
      selSource(row, index) {
        // 配置填充来源
        var self = this;
        self.tblTargetIndex = index;
        if (row.metadataEnglisName == self.primaryInfo.pkEnName) {
          self.$message({
            message: '此处主键不能配置来源',
            type: 'error',
            customClass: 'zZindex'
            // offset: 100,
            // duration: this.$store.state.el_Duration
          });
          return false;
        }
        if (row.isSelSrc) {
          self.selSourceView = true;
          row.isSelSrc = false;
          self.currentTblName = row.metadataEnglisName;
          self.paramsFillSrc[self.paramsTargetTbl][row.metadataEnglisName] = [];
        } else {
          self.$message({
            type: 'error',
            message: '此处来源只能配置一次',
            customClass: 'zZindex'
          });
        }
      },
      addData() {
        var self = this;
        self.selSourceTblView = true;
        // 选择清洗表
        self.cleanListshow();
      },

      //清洗列表接口；
      cleanListshow() {
        api.getAllCleanList(this.cleanAddobj)
          .then(res => {
            if (res.code === 'code_200') {
              this.sourceTableData = res.data;
              this.sourceTableData.forEach(e => {
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
                }
              });

              this.tabListtotleNum = res.page.totalNumber;
            }
          });
      },
      checkMetaData() {
        this.cleanListshow();
      },
      resetMetaData() {
        var self = this;
        self.cleanAddobj.sourceTable = '';
        self.cleanAddobj.syncTableType = '';
        self.cleanListshow();
      },

      selField(row) {
        // 选字段
        var self = this;
        self.selFieldView = true;
        // 需要把表名添加到配置填充来源列表中
        self.tblNames = row.sourceTable;
        self.tableTypess = row.syncTableType;
        api
          .getAllCleanWords({
            tableName: row.sourceTable,
            tableType: row.syncTableType,
            currentPage: 1,
            pageSize: 10
          })
          .then(res => {
            if (res.code === 'code_200' && res.page) {
              self.sourceFieldData = res.data;
            }
          });
      },

      turnTop(index) {
        // 上移
        console.log(index);
        if (index == 0) {
          return;
        }
        this.sourceTblData.push(this.sourceTblData.shift());
      },
      delThisRow(index) {
        // 删除该行
        console.log(index);
        this.sourceTblData.splice(index, 1);
      },
      turnBottom(index) {
        // 下移
        console.log(index);
        if (index == this.sourceTblData.length - 1) {
          return;
        }
        this.sourceTblData.unshift(this.sourceTblData.pop());
      },

      turnTops(index) {
        // 上移
        console.log(index);
        if (index == 0) {
          return;
        }
        this.targetTblmainKeySrcData.push(this.targetTblmainKeySrcData.shift());
      },
      delThisRows(index) {
        // 删除该行
        console.log(index);
        this.targetTblmainKeySrcData.splice(index, 1);
      },
      turnBottoms(index) {
        // 下移
        console.log(index);
        if (index == this.targetTblmainKeySrcData.length - 1) {
          return;
        }
        this.targetTblmainKeySrcData.unshift(this.targetTblmainKeySrcData.pop());
      },

      goBack() {
        this.$router.push({
          path: 'fillRuleManage'
        });
      },
      handleSelTargetTbl() {
        var self = this;
        if (self.form.belongSto != '') {
          self.isSelTargetTbl = false;
        }
        self.tableData = [];
        self.placeHdtargetTblName = '';
        self.targetTblName = '';
        self.radio = '';
        self.isConfigDialogShow = false;
      },
      getCurrentRow(row) {
        var self = this;
        self.selTargetTblId = row.id;
        self.placeHdtargetTblName = row.tableNames;
      },
      submitTargetTbl() {
        // 根据ID查看目标表
        var self = this;
        if (self.radio == '') {
          self.$message({
            type: 'error',
            message: '请选择目标表',
            customClass: 'zZindex'
          });
        } else {
          // 填充来源参数配置第一步
          self.paramsTargetTbl = self.radio;
          self.paramsFillSrc[self.paramsTargetTbl] = {};

          api
            .selectBasicTableManagementKey({
              id: self.selTargetTblId
            })
            .then(res => {
              if (res.code == 'code_200') {
                self.tableData = res.data.metadataMaintenance;
                var pkeys = res.data.primarykeys;
                self.tableData.forEach((item, index) => {
                  item.isSelSrc = true;
                  if (item.metadataEnglisName == pkeys) {
                    // 默认主键一行的来源背景色为灰色
                    self.indexList.push(index);
                  }
                });
                self.targetTblMainKey = res.data.primarykeys;
                self.primaryInfo.pkEnName = res.data.primarykeys;
                self.selTblView = false;
              }
            });
        }
      },
      handleSelField(row) {
        var self = this;
        self.currentField = row;
      },
      submitSrcField() {
        var self = this;
        if (self.selSrcField != '') {
          self.selFieldView = false;
          self.selSourceTblView = false;
          // 将数据添加到配置填充来源列表中
          var obj = {
            chName: self.tblNames,
            tblEnName: self.tblNames,
            fieldName: self.currentField.targetFieldName,
            enName: self.currentField.targetField,
            dataType: self.currentField.fieldType,
            tblType: self.tableTypess
          };
          self.sourceTblData.push(obj);
          self.selSrcField = '';
        } else {
          self.$message({
            type: 'error',
            message: '请选择来源字段',
            customClass: 'zZindex'
          });
        }
      },
      /*********************************************************** */
      submitFillSrc() {
        // 配置填充来源添加到配置表
        var self = this;
        if (self.sourceTblData.length != 0) {
          self.indexList.push(self.tblTargetIndex);
          self.indexList.filter(function (ele, i, item) {
            return item.indexOf(ele) === i;
          });

          self.selSourceView = false;
          var tblArr = self.sourceTblData;
          // 配置填充来源数组去重
          for (var i = 0; i < tblArr.length; i++) {
            for (var j = i + 1; j < tblArr.length; j++) {
              if (tblArr[i].tblEnName === tblArr[j].tblEnName) {
                tblArr.splice(j, 1);
                j = j - 1;
              }
            }
          }
          // 需要再去重一次 - -
          var thisLen = self.configTblData.length;
          if (thisLen != 0) {
            var nameList = [];
            self.configTblData.forEach(item => {
              nameList.push(item.tblEnName);
            });
            tblArr.forEach((item, index) => {
              if (nameList.indexOf(item.tblEnName) == -1) {
                self.configTblData.push({
                  chName: item.chName,
                  tblEnName: item.tblEnName,
                  dataType: self.currentField.fieldType,
                  mainTbl: false
                });
              }
            });
          } else {
            tblArr.forEach((item, index) => {
              self.configTblData.push({
                chName: item.chName,
                tblEnName: item.tblEnName,
                dataType: self.currentField.fieldType,
                mainTbl: false
              });
            });
          }

          self.isConfigDialogShow = true;

          // 将数据保存 first params
          var currentTargetTblName = Object.getOwnPropertyNames(
            self.paramsFillSrc
          )[1];
          var arr = self.sourceTblData;
          arr.forEach((item, index) => {
            self.paramsFillSrc[currentTargetTblName][self.currentTblName].push(
              item.tblEnName + '%' + item.enName + '#' + (index + 1)
            );
          });
          // 将数据添加到配置表之后清空此表
          self.sourceTblData = [];

          var srcIndex = self.tblTargetIndex;
          self.$refs.multipleTables.toggleRowSelection();
          self.$refs.multipleTables.clearSelection();
        } else {
          self.$message({
            type: 'error',
            message: '填充来源不能为空',
            customClass: 'zZindex'
          });
        }
      },
      cleanListshows() {
        api.getAllCleanList(this.mainKeySrcTbl)
          .then(res => {
            if (res.code === 'code_200') {
              this.mainkeySrcTblData = res.data;
              this.mainkeySrcTblData.forEach(e => {
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
                }
              });
            }
          });
      },
      checkMetaDatas() {
        this.cleanListshows();
      },
      resetMetaDatas() {
        var self = this;
        self.mainKeySrcTbl.sourceTable = '';
        self.mainKeySrcTbl.syncTableType = '';
        self.cleanListshows();
      },

      // 配置目标表主键来源新增
      addmainKeyData() {
        var self = this;
        var len = self.targetTblmainKeySrcData.length;
        if (len != 0) {
          self.$message({
            type: 'error',
            message: '主键填充来源只能有一个字段',
            customClass: 'zZindex'
          });
        } else {
          self.cleanListshows();
          self.selmainKeySourceTblView = true;
        }
      },

      selmainKeyField(row) {
        // 主键来源表选字段
        var self = this;
        self.selmainKeyFieldView = true;
        self.mainKeyTblNames = row.sourceTable;

        api
          .getAllCleanWords({
            tableName: row.sourceTable,
            tableType: row.syncTableType,
            currentPage: 1,
            pageSize: 10
          })
          .then(res => {
            if (res.code === 'code_200' && res.page) {
              self.mainKeySrcFieldData = res.data;
            }
          });
      },
      handleMainkeySelField(row) {
        this.currentMainKeyField = row;
      },
      submitMainKeySrc() {
        // 配置目标表主键填充来源=>确定
        var self = this;
        if (self.targetTblmainKeySrcData.length != 0) {
          // second params
          var currentpKeyTblName = Object.getOwnPropertyNames(
            self.paramsPkeyFillSrc
          )[1];
          var currentObj = self.paramsPkeyFillSrc[currentpKeyTblName];
          var currentData = self.targetTblmainKeySrcData[0];
          Object.keys(currentObj)
            .forEach(key => {
              currentObj[key] = currentData.tblEnName + '%' + currentData.enName;
            });

          self.targetTblmainKeySrcView = false;
          self.mainSrcView = false;
          self.$notify({
            message: '配置成功',
            type: 'success',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        } else {
          self.$message({
            message: '主键填充来源不能为空',
            type: 'error',
            customClass: 'zZindex',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        }
      },
      submitMainKeySrcField() {
        var self = this;
        if (self.selmainKeySrcField != '') {
          self.selmainKeyFieldView = false;
          self.selmainKeySourceTblView = false;
          // 将数据添加到配置填充来源列表中
          var obj = {
            chName: self.mainKeyTblNames,
            tblEnName: self.mainKeyTblNames,
            fieldName: self.currentMainKeyField.targetFieldName,
            enName: self.currentMainKeyField.targetField,
            dataType: self.currentMainKeyField.fieldType
          };
          self.targetTblmainKeySrcData.push(obj);
          self.selmainKeySrcField = '';
        } else {
          self.$message({
            type: 'error',
            message: '请选择主键来源字段',
            customClass: 'zZindex'
          });
        }
      },
      // 关联字段选择来源字段
      handleSelAboutField(row) {
        console.log(row.id);
      },
      submitAboutField() {
        var self = this;
        var currentTbl = self.currentTableName;
        var thisArr = [];
        self.paramsAboutField.forEach(item => {
          var tblName = Object.getOwnPropertyNames(item)[0];
          if (tblName == currentTbl) {
            var arrField = self.configAboutFieldData;
            var tbl1Name = [];
            var tbl2Name = [];
            arrField.forEach(val => {
              if (/[a-zA-Z]/g.test(val.fieldData)) {
                tbl1Name.push(val.targetField);
                tbl2Name.push(val.fieldData);
                thisArr.push(val.fieldData);
              }
            });
            item[tblName] =
              tblName +
              '#' +
              tbl1Name.toString() +
              '%' +
              self.selFieldSrcTbl +
              '#' +
              tbl2Name;
          }
        });

        if (thisArr.length != 0) {
          self.fieldView = false;
          self.$notify({
            message: '配置成功',
            type: 'success',
            offset: 100,
            duration: this.$store.state.el_Duration
          });
        } else {
          self.$message({
            type: 'error',
            message: '关联字段不能为空',
            customClass: 'zZindex'
          });
        }
      },

      addFillRuleSubmit() {
        var self = this;
        // 填充来源参数
        var objFillSrc = self.paramsFillSrc;
        Object.keys(objFillSrc)
          .forEach(function (key) {
            var testObj = objFillSrc[key];
            for (var i in testObj) {
              if (Object.prototype.toString.call(testObj[i]) == '[object Array]') {
                testObj[i] = testObj[i].join('&');
              }
            }
          });
        // console.log("填充来源: ", JSON.stringify(objFillSrc));
        // 目标表主键填充来源参数
        var objmainKeyFillSrc = self.paramsPkeyFillSrc;
        // console.log("主键填充来源: ", JSON.stringify(objmainKeyFillSrc));
        // 关联字段参数
        var arrAboutField = self.paramsAboutField;
        var objAboutField = [];
        arrAboutField.forEach((item, index) => {
          var crtName = Object.getOwnPropertyNames(item)[0];
          if (JSON.stringify(item[crtName]) == '{}') {
            arrAboutField = arrAboutField.splice(index, 1);
          }
          objAboutField.push({
            configurationTable: crtName,
            tableMapping: item
          });
        });
        // console.log("关联字段: ", objAboutField);

        var jsonP1 = JSON.stringify(objFillSrc);
        var jsonP2 = JSON.stringify(objmainKeyFillSrc);

        self.$refs.addFormRules.validate(valid => {
          if (
            !valid ||
            jsonP1 == '{}' ||
            jsonP2 == '{}' ||
            objAboutField.length == 0
          ) {
            self.$message({
              type: 'error',
              message: '请填写完整信息',
              customClass: 'zZindex'
            });
            return false;
          } else {
            // 调接口
            api
              .insertDataFillingRules({
                ruleNames: self.form.ruleName,
                baseLibraryID: self.form.belongSto,
                basicTableManagementID: self.selTargetTblId,
                columnMapping: jsonP1,
                masterTable: jsonP2,
                dataFillingRulesTableMapping: objAboutField
              })
              .then(res => {
                if (res.code == 'code_200') {
                  self.$notify({
                    message: res.msg,
                    type: 'success',
                    offset: 100,
                    duration: this.$store.state.el_Duration
                  });
                  self.$router.push({
                    path: 'fillRuleManage'
                  });
                } else {
                  self.$notify({
                    message: res.msg,
                    type: 'error',
                    offset: 100,
                    duration: this.$store.state.el_Duration
                  });
                }
              })
              .catch(err => {
                self.$notify({
                  message: '添加失败',
                  type: 'error',
                  offset: 100,
                  duration: this.$store.state.el_Duration
                });
                console.log(err);
              });
          }
        });
      },

      selAboutTbl(row, index) {
        // 选择关联表
        var self = this;

        if (self.selFieldSrcTbl != '') {
          self.myRowDetail = row;
          self.myId = index;
          this.$store.commit('showLoading', true);
          self.selAboutTblView = true;
          if (self.srcTblList.length != 0) {
            this.$store.commit('hideLoading', false);
          }
        } else {
          self.$message({
            type: 'error',
            message: '请选择源表',
            customClass: 'zZindex'
          });
        }
      },

      handleSelFieldSrcTbl() {
        var self = this;
        api
          .getAllCleanWords({
            tableName: self.selFieldSrcTbl,
            tableType: self.tableTypess,
            currentPage: 1,
            pageSize: 10
          })

          .then(res => {
            if (res.code === 'code_200' && res.page) {
              self.configAboutFieldtblData = res.data;
            }
          });
      },
      handleSelAboutFieldTbl() {
      },
      handleSelectionChange() {
      },
      submitAboutFieldTbl() {
        var self = this;
        if (self.selaboutFieldTbl != '') {
          self.selAboutTblView = false;
          var id = self.myId;
          var row = self.myRowDetail;
          row.fieldData = self.selaboutFieldTbl;
          self.configAboutFieldData[id] = row;
          self.$refs.multipleTable.toggleRowSelection(
            self.configAboutFieldData[id],
            false
          );
          self.$refs.multipleTable.toggleRowSelection(
            self.configAboutFieldData[id],
            true
          );
          self.selaboutFieldTbl = '';
        } else {
          self.$message({
            type: 'error',
            message: '请选择关联字段',
            customClass: 'zZindex'
          });
        }
      }
    }
  };
</script>
<style lang="less">
  @import "addFillRule.less";

  .zZindex {
    z-index: 3000 !important;
  }

  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }

  .bounce-leave-active {
    animation: bounce-in 0.5s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .right-enter, .right-leave-to {
    transform: translate3d(100%, 0, 0)
  }

  .right-leave, .right-enter-to {
    transform: translate3d(0, 0, 0)
  }

  .right-enter-active, .right-leave-active {
    transition: all .2s
  }
</style>


