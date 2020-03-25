<template>
  <div class="list-container shadow">
    <!--边角-->
    <table-honer></table-honer>
    <div class="content-section">
      <!--列表标题-->
      <list-table-title v-bind:title="titles" v-bind:isBack="false" v-if="showType==0"></list-table-title>
      <list-table-title v-bind:title="titles1" v-bind:isBack="false" v-else-if="showType==1"></list-table-title>
      <div class="search-template cleansAdd">
        <el-row :gutter="20">
          <el-col>
            <el-row>
              <el-col :span="18" :offset="2">
                <div class="input-group">
                  <span class="xuhao">01</span>
                  <label for class="middle m-r-10 clean_mc">/清洗策略名称</label>
                  <div class="input-tpm blue-input new-input" style="margin-top: 14px">
                    <el-input
                      placeholder
                      v-model="celueName"
                      :disabled="showType==1"
                    ></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="18" :offset="2">
                <div class="input-group">
                  <span class="xuhao">02</span>
                  <label for class="middle m-r-10 clean_mc">/选择清洗表</label>
                  <div class="input-tpm blue-input new-input" style="margin-top: 14px">
                    <el-input
                      placeholder
                      v-model="cleantabels"
                      :disabled="true"
                    ></el-input>
                  </div>
                  <el-button
                    v-show="showType==0"
                    class="blue-btn fl choisetab new-btn"
                    type="primary"
                    @click="choiseCleanList()"
                  >选择
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18" :offset="2" v-show="showType==0">
                <div class="input-group">
                  <span class="xuhao">03</span>
                  <label for class="middle m-r-10 clean_mc">/选择清洗字段</label>
                  <el-button
                    v-show="showType==0"
                    class="blue-btn fl choisetab choisetab1 new-btn"
                    type="primary"
                    @click="chiosecleanWords1()"
                  >选择
                  </el-button>
                  <div class="input-tpm blue-input" v-show="showType==1">
                    <i class="honer-left"></i>
                    <el-input placeholder v-model="tacticsName" class="clean_input"></el-input>
                    <i class="honer-right"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="8" v-if="isShowTime">
                <div class="input-group">
                  <label for class="middle m-r-10">/定时规则</label>
                  <div class="input-tpm blue-input">
                    <i class="honer-left"></i>
                    <el-input placeholder v-model="TimingRule"></el-input>
                    <i class="honer-right"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div>
        <!-- 表格 -->
        <div
          class="table-container wordtable-container pag-position"
          style="margin-top:150px"
          v-show="showType==0"
        >
          <el-row :gutter="20">
            <el-col :span="20" :offset="2">
              <el-table
                :data="cleanwords"
                stripe
                :class="{qingxiDealbtn: isActives}"
                height="220"
                style="width: 100%;overflow-x:hidden;"
              >
                <el-table-column
                  v-for="item in cleanwordsHead"
                  v-show="showType==0"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作" width="250">
                  <template slot-scope="scope">
                    <el-button
                      size="medium"
                      type="text"
                      :data-index="scope.$index"
                      @click="qingxiRolers(scope.row,scope.$index)"
                      ref="rules"
                      :class="[setJiance.includes(scope.$index)?'set-jiance-bg':'jiance-bg']"
                    >清洗规则
                    </el-button>
                    <el-button size="medium" type="text" @click="qingxiDelet(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div
          class="table-container wordtable-container1 pag-position"
          style="margin-top:150px"
          v-show="showType==1"
        >
          <el-row :gutter="20">
            <el-col :span="20" :offset="2">
              <el-table
                :data="cleanwords"
                stripe
                id="qingxiDealbtn2"
                height="220"
                style="width: 100%;overflow-x:hidden;"
              >
                <el-table-column
                  v-for="item in cleanwordsHead1"
                  :label="item.label"
                  :prop="item.prop"
                  :key="item.id"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column width="250" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="medium"
                      type="text"
                      @click="handleClick1(scope.row,scope.$index)"
                    >清洗规则
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="btn-group footerBtn">
      <el-button v-show="showType==0" class="yellow-btn" @click="cleanAddSubmit()">确定</el-button>
      <el-button v-if="showType==0" class="blue-btn" @click="goBack()">取消</el-button>
      <el-button v-if="showType==1" class="blue-btn" @click="goBack()">关闭</el-button>
    </div>
    <!--清洗列表选择-->
    <Modal
      title="清洗列表-列表"
      v-model="qingxiList"
      class="cha"
      width="50%"
      :closable="false"
      :mask-closable="false"
    >
      <el-form label-position="right" label-width="60px">
        <el-row>
          <el-col :span="10" style="margin-left: -20px">
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
          <el-col :span="10">
            <el-form-item label="表类型">
              <div class="sel-group sel-blue w-150 new-input">
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
          <el-col :span="4">
            <div class="add-btn fl m-l-10 new-btn" @click="checkMetaData()">查询</div>
          </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="12">-->
          <!--<el-form-item label="采集源名称">-->

          <!--<div class="sel-group sel-yellow fl">-->
          <!--<i class="honer-left"></i>-->
          <!--<el-select v-model="cleanAddobj.dataSourceId" placeholder="请选择" >-->
          <!--<el-option-->
          <!--v-for="item in shujuyuan"-->
          <!--:key="item.id"-->
          <!--:label="item.strategyName"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--<i class="honer-right"></i>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
      </el-form>

      <el-row>
        <el-col style="margin-top: -10px">
          <div class="table-container addtable-container">
            <el-table :data="choisecleanTableData" height="250" style="width: 100%;">
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <!-- class="textRadio" -->
                  <el-radio
                    @change="getCurrentRow(scope,scope.$index)"
                    :label="scope.row.id"
                    v-model="radio"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in headerData"
                align="center"
                :label="item.label"
                :prop="item.prop"
                :key="item.id"
                :width="item.width"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
            <!--分页-->
            <div class="model-pag">
              <el-pagination
                v-if="choisecleanTableData.length!=0"
                :current-page="cleanAddobj.currentPage"
                :page-size="cleanAddobj.pageSize"
                @current-change="handleCurrentChange"
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
        <el-button class="yellow-btn" type="primary" @click="liebiaoSubmit()">确 定</el-button>
        <el-button class="blue-btn new-btn" @click="cancleTable" v-if="cancel">取 消</el-button>
      </div>
    </Modal>
    <!--清洗字段选择-->
    <Modal
      title="清洗字段-字段"
      v-model="qingxiWords"
      class="cha"
      width="45%"
      :closable="false"
      :mask-closable="false"
    >
      <div class="table-container addtable-container" id="wordschoise">
        <div class="search-section clearfix"></div>
        <el-table
          v-if="addType==0"
          ref="multipleTable"
          :data="choisecleanwrodsTableData"
          :key="addType"
          height="400"
          @select-all="wordCheckedALl"
          @selection-change="wordChecked"
          :row-key="getRowKeys"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            v-for="item in  wordsheaderData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-table
          v-if="addType==1"
          ref="multipleTable"
          :data="choisecleanwrodsTableData"
          :key="addType"
          height="400"
          @select-all="wordCheckedALl0"
          @selection-change="wordChecked0"
          :row-key="getRowKeys"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            v-for="item in  wordsheaderData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-table
          v-if="addType==2"
          ref="multipleTable"
          :data="choisecleanwrodsTableData"
          :key="addType"
          height="400"
          @select-all="wordCheckedALl"
          @selection-change="wordChecked"
          :row-key="getRowKeys"
          stripe
          style="width: 100%"
        >
          <el-table-column>
            <template slot-scope="scope">
              <!-- class="textRadio" -->
              <el-radio
                @change="wordChecked1(scope.row)"
                :label="scope.row.id"
                v-model="radio"
              >&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in  wordsheaderData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-table
          v-if="addType==3"
          ref="multipleTable"
          :data="choisecleanwrodsTableData"
          :key="addType"
          height="400"
          @select-all="wordCheckedALl"
          @selection-change="wordChecked"
          :row-key="getRowKeys"
          stripe
          style="width: 100%"
        >
          <el-table-column>
            <template slot-scope="scope">
              <!-- class="textRadio" -->
              <el-radio
                @change="wordChecked2(scope.row)"
                :label="scope.row.targetFieldName"
                v-model="radio"
              >&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in  wordsheaderData"
            :label="item.label"
            :prop="item.prop"
            :key="item.id"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <!--分页-->
        <div class="model-pag">
          <el-pagination
            v-if="choisecleanwrodsTableData.length!=0"
            :current-page="cleanwordobj.currentPage"
            :page-size="cleanwordobj.pageSize"
            @current-change="handleCurrentChange1"
            layout="prev, pager, next"
            :total="wordstotleNum"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click="zidaunSubmit()">确 定</el-button>
        <el-button class="blue-btn" @click="cancelWordTable">取 消</el-button>
      </div>
    </Modal>
    <!--清洗规则设置-->
    <Modal
      title="清洗规则设置"
      v-model="qingxirulers"
      width="50%"
      class="cha"
      :closable="false"
      :mask-closable="false"
    >
      <div class="table-container rulertable-container pag-position">
        <div class="clearfix">
          <div v-if="true" class="rule-title">系统规则</div>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="4" id="rulers-col">
              <div class="grid-content bg-purple rulers-div">
                <div
                  :class="(rulerform.morenz!='')?'ruler-check':'ruler-List'"
                  ref="ref1"
                  @click="isruleChekced($event,'2')"
                >添加默认值
                </div>
                <div
                  :class="rulerform.quchu==''?'ruler-List':'ruler-check'"
                  ref="ref2"
                  @click="isruleChekced($event,'4')"
                >去除两端空格
                </div>
                <div
                  :class="(rulerform.biaodas!='')?'ruler-check':'ruler-List'"
                  ref="ref3"
                  @click="isruleChekced($event,'7')"
                >替换
                </div>
                <div
                  :class="(rulerform.quchong!=''&&rulerform.shijian!='')?'ruler-check':'ruler-List'"
                  ref="ref4"
                  @click="isruleChekced($event,'8')"
                >去重
                </div>
                <div
                  :class="(rulerform.id!='')?'ruler-check':'ruler-List'"
                  ref="ref5"
                  @click="isruleChekced($event,'9')"
                >性别清洗
                </div>
                <div
                  :class="(rulerform.date!='')?'ruler-check':'ruler-List'"
                  ref="ref6"
                  @click="isruleChekced($event,'10')"
                >日期清洗
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">
                <el-form ref="form" :model="rulerform" label-width="85px">
                  <el-form-item label="默认值">
                    <div class="input-tpm blue-input new-input">
                      <el-input placeholder v-model="rulerform.morenz" :disabled="mrCheck"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="是否去除">
                    <div class="sel-group sel-blue fl new-input">
                      <el-select v-model="rulerform.quchu" placeholder="请选择" :disabled="qcCheck">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item label="原有值">
                    <div class="input-tpm blue-input new-input">
                      <el-input placeholder v-model="rulerform.biaodas" :disabled="zzCheck"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="去重字段">
                    <div class="input-tpm blue-input new-input">
                      <el-input
                        placeholder
                        v-model="rulerform.quchong"
                        :disabled="qchCheck"
                        @focus="quchongField"
                      ></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="身份证号">
                    <div class="input-tpm blue-input new-input">
                      <el-input
                        placeholder
                        v-model="rulerform.id"
                        :disabled="xbCheck"
                        @focus="getId"
                      ></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="日期格式">
                    <div class="input-tpm blue-input new-input">
                      <el-input placeholder v-model="rulerform.date" :disabled="rqCheck"></el-input>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple ruler-col3">
                <el-form ref="form" :model="rulerform" label-width="85px">
                  <el-form-item label="替换值">
                    <div class="input-tpm blue-input new-input">
                      <el-input placeholder v-model="rulerform.tihuanz" :disabled="zzCheck"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="时间字段">
                    <div class="input-tpm blue-input new-input">
                      <el-input
                        placeholder
                        v-model="rulerform.shijian"
                        :disabled="qchCheck"
                        @focus="getTimeField"
                      ></el-input>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
          <div v-if="true" class="rule-title">自定义规则</div>
          <el-row v-if="true">
            <el-col :span="8" :offset="6">
              <el-form ref="form" :model="rulerform" label-width="85px">
                <el-form-item label="规则名称">
                  <div class="sel-group sel-blue fl new-input">
                    <el-select
                      v-model="rulerform.QXJAR"
                      placeholder="请选择"
                      :disabled="showType==1"
                      @change="selRule"
                    >
                      <el-option
                        v-for="item in jarList"
                        :label="item.cleaningName"
                        :value="item.jarName"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <div class="rule-des">{{describes}}</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          class="yellow-btn"
          type="primary"
          @click="rulersSubmit()"
          v-show="showType==0"
        >确 定
        </el-button>
        <el-button class="blue-btn" @click="qxSubmit()">取 消</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /* eslint-disable */
  var qs = require('qs');
  var moment = require('moment');
  import api from '../../../api/bigData/daq/cleanStrategyMange';
  import Common from '../../../../config/common';
  import Dialog from '../../../components/YUNPackages/dialog/dialog';
  import { Collapse } from 'element-ui';

  export default {
    components: {},
    data() {
      return {
        addType: 0, //清洗规则
        shijian_1: '',
        shijian_2: '',
        id_1: '',
        id_2: '',
        titles: '数据清洗-规则清洗',
        titles1: '数据清洗-查看',
        valueZl: '2',
        radio: '',
        cancel: true,
        msg: {},
        options: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '2',
            label: '否'
          }
        ],
        options1: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '2',
            label: '否'
          }
        ],
        options2: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '2',
            label: '否'
          }
        ],
        SourceArr: [
          {
            value: '1',
            label: '行政审批系统'
          },
          {
            value: '2',
            label: '一体化平台用表'
          }
        ],
        headerData: [
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
        // 表头数据
        valueType: '',
        valueSource: '',
        valueSourceid: '',
        isShowTime: false,
        qingxirulers: false,
        keyDefault: '否',
        celueName: '',
        tacticsName: '',
        tableName: '',
        TimingRule: '',
        dataSource: '',
        isTiming: '',
        tableData: [],
        cleantabels: '',
        cleanwords: [],
        cleanWordput: [],
        cleanWordcheck: [],
        // cleanwordstrue:[],
        cleanwordsHead: [
          {
            prop: 'targetField',
            label: '英文名'
          },
          {
            prop: 'targetFieldName',
            label: '中文名'
          },
          {
            prop: 'fieldType',
            label: '类型'
          },
          {
            prop: 'isTimestamp',
            label: '长度'
          }
        ],
        cleanwordsHead1: [
          {
            prop: 'cleaningField',
            label: '英文名'
          },
          {
            prop: 'cleaningFieldName',
            label: '中文名'
          },
          // {
          //   prop: 'cleaningStrategyId',
          //   label: '类型',
          // },
          {
            prop: 'cleaningFieldLength',
            label: '长度'
          }
        ],
        wordsheaderData: [
          {
            prop: 'targetField',
            label: '英文名'
          },
          {
            prop: 'targetFieldName',
            label: '中文名'
          }
        ],
        qingxiList: false,
        choisecleanTableData: [],
        biaochiosaddSearch: '',
        biaochiosSearch: '',
        qingxiWords: false,
        choisecleanwrodsTableData: [],
        showType: '',
        tableLeixing: [],
        shujuyuan: [],
        currentPage: 1,
        pageSize: 10,
        totleNum: 1,
        tabListtotleNum: 1,
        wordstotleNum: 1,
        handleSizeChange: '',
        //清洗列表添加查询条件；
        cleanAddobj: {
          sourceTable: '',
          dataSourceId: '',
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
        tableId: '',
        cleanAdddata: {
          cleaningIncrement: '1',
          cleaningStrategyTables: [
            {
              cleaningField: '',
              cleaningFieldLength: '',
              cleaningFieldName: '',
              cleaningRules: '',
              cleaningStrategyId: '',
              id: '11'
            }
          ],
          cleaningTable: '1',
          strategyName: '1',
          timingRules: '11',
          timingState: '1'
        },
        //清洗规则key-list;
        cleanRules: [
          {
            key: '2',
            name: '添加默认值'
          },
          {
            key: '4',
            name: '去除两端空格'
          },
          {
            key: '7',
            name: '替换'
          },
          {
            key: '8',
            name: '去重'
          },
          {
            key: '9',
            name: '性别清洗'
          },
          {
            key: '10',
            name: '日期清洗'
          }
        ],
        isActive: false,
        isNormal: true,
        rulerform: {
          biaodas: '',
          morenz: '',
          quchu: '',
          tihuanz: '',
          quchong: '',
          shijian: '',
          id: '',
          quchong1: '',
          shijian1: '',
          id1: '',
          date: '',
          QXJAR: ''
        },
        rulerArr: [],
        cleanruleRow: {},
        cleanruleArr: [],
        //查看清洗规则；
        cleaningRules: {},
        // class1:"ruler-List",
        rowIndex: 0,
        isActives: true,
        hasError: false,
        gzNum: 0,
        gzArr: [],
        gzTrue: false,
        mrCheck: true,
        qcCheck: true,
        zzCheck: true,
        qchCheck: true,
        xbCheck: true,
        rqCheck: true,
        getRowKeys(row) {
          return row.id;
        },
        multipleSelectionAll: [],
        multipleSelection: [],
        multipleSelectionAll0: [],
        multipleSelection0: [],
        idKey: 'id',
        setJiance: [],
        jarList: '',
        describes: ''
      };
    },
    computed: {
      rulerforms: function () {
        return this.rulerform;
      }
    },
    mounted: function () {
      //获取query值，0-》新增，1-》查看;
      this.showType = this.$route.query.type;
      this.getJar();
      //type=1时，获取详情页里面的数据信息；
      if (this.showType == '1') {
        //查看；
        this.msg = JSON.parse(sessionStorage.getItem('cleanStrages'));
        //查看清洗规则回显;
        api.getCleanById({ id: this.msg })
          .then(res => {
            if (res.code == 'code_200') {
              this.celueName = res.data.strategyName;
              this.cleantabels = res.data.cleaningTable;
              //字段列表获取；
              this.cleanwords.splice(0, 1);
              this.cleanwords = res.data.cleaningStrategyTables;
            }
          });
      }
      if (this.showType == '0') {
        //新增；
        this.celueName = '';
      }
    },
    methods: {
      //取消清洗规则设置
      qxSubmit() {
        this.qingxirulers = false;
        if (this.rulerform.morenz == '') {
          this.$refs.ref1.setAttribute('class', 'ruler-List');
        }
        if (this.rulerform.quchu == '') {
          this.$refs.ref2.setAttribute('class', 'ruler-List');
        }
        if (this.rulerform.biaodas == '' && this.rulerform.tihuanz == '') {
          this.$refs.ref3.setAttribute('class', 'ruler-List');
        }
        if (this.rulerform.quchong == '' && this.rulerform.shijian == '') {
          this.$refs.ref4.setAttribute('class', 'ruler-List');
        }
        if (this.rulerform.id == '') {
          this.$refs.ref5.setAttribute('class', 'ruler-List');
        }
        if (this.rulerform.date == '') {
          this.$refs.ref6.setAttribute('class', 'ruler-List');
        }
      },
      selRule() {
      },
      //去重字段
      quchongField() {
        this.qingxiWords = true;
        this.addType = 1;
      },
      //时间字段
      getTimeField() {
        this.qingxiWords = true;
        this.addType = 2;
      },
      //身份证
      getId() {
        this.qingxiWords = true;
        this.addType = 3;
      },
      // 清晰字段取消
      cancelWordTable() {
        this.qingxiWords = false;
        this.cleanwordobj.currentPage = 1;
      },
      // 清洗列表取消
      cancleTable() {
        this.qingxiList = false;
        this.cleanAddobj.sourceTable = '';
        this.cleanAddobj.dataSourceId = '';
        this.cleanAddobj.syncTableType = '';
        this.cleanAddobj.currentPage = 1;
        this.tableId = '';
        this.tName = '';
        this.cleantabels = '';
        this.radio = '';
      },
      //获取自定义清洗规则
      getJar() {
        api
          .getAllClean({
            state: 1
          })
          .then(res => {
            if (res.code == 'code_200') {
              this.jarList = res.data;
            }
          });
      },
      //选择清洗列表；
      choiseCleanList() {
        this.qingxiList = true;
        //调用表类型，数据源接口；
        this.cleanListshow();
        //获取表类型和数据源；
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
        /*api.getAllcleanTable().then(res=>{
            if (res.code === 'code_200') {
              this.shujuyuan=res.data;
            }
            else {
              this.tips('失败','error',res.msg);
            }
          });*/
      },
      //清洗列表接口；
      cleanListshow() {
        api.getAllCleanList(this.cleanAddobj)
          .then(res => {
            if (res.code === 'code_200') {
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
      },
      //清洗列表翻页；
      handleCurrentChange(e) {
        this.cleanAddobj.currentPage = e;
        this.cleanListshow();
      },
      //清洗列表添加查询；
      checkMetaData() {
        if (this.cleanAddobj.syncTableType == 1) {
          this.cleanAddobj.syncTableType = '';
        }
        this.cleanListshow();
      },
      //列表选中；
      getCurrentRow(row, val) {
        this.tableType = row.row.syncTableType;
        this.tName = row.row.sourceTable;
        this.cleantabels = row.row.sourceTable;
        this.rulerform.shijian = row.row.updateTime;
        this.rulerform.id = row.row.id;
      },
      //选择清洗字段;
      chiosecleanWords() {
        if (this.tName == '') {
          this.tips('请选择清洗表', 'error', '请选择清洗表');
        } else {
          this.qingxiWords = true;
          this.cleanwordobj.tableType = this.tableType;
          this.cleanwordobj.tableName = this.tName;
          this.gzArr.splice(0, this.gzArr.length - 1);
          api.getAllCleanWords(this.cleanwordobj)
            .then(res => {
              if (res.code === 'code_200' && res.page) {
                this.choisecleanwrodsTableData = res.data;
                this.wordstotleNum = res.page.totalNumber;
                this.setSelectRow();
              } else {
                this.tips('失败', 'error', res.msg);
              }
            });
        }
      },
      //选择清洗字段添加判断
      chiosecleanWords1() {
        if (this.cleantabels != '') {
          api
            .cleanAddSubmit1(qs.stringify({ souceTable: this.tName }))
            .then(res => {
              if (res.code === 'code_200') {
                this.tips('添加成功', 'success', res.msg);
                if (this.tName == '') {
                  this.tips('请选择清洗表', 'error', '请选择清洗表');
                } else {
                  this.qingxiWords = true;
                  this.cleanwordobj.tableType = this.tableType;
                  this.cleanwordobj.tableName = this.tName;
                  this.gzArr.splice(0, this.gzArr.length - 1);
                  api.getAllCleanWords(this.cleanwordobj)
                    .then(res => {
                      if (res.code === 'code_200' && res.page) {
                        this.choisecleanwrodsTableData = res.data;
                        this.wordstotleNum = res.page.totalNumber;
                        this.setSelectRow();
                      } else {
                        this.tips('失败', 'error', res.msg);
                      }
                    });
                }
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
            message: '请选择清洗表'
          });
        }
      },
      //清洗字段列表翻页；
      handleCurrentChange1(e) {
        if (this.addType == 0) {
          this.changePageCoreRecordData();
        } else if (this.addType == 1) {
          this.changePageCoreRecordData0();
        }
        this.cleanwordobj.currentPage = e;
        this.chiosecleanWords();
      },
      //清洗字段全选；
      wordCheckedALl(val) {
        this.multipleSelection = val;
      },
      wordCheckedALl0(val) {
        this.multipleSelection0 = val;
      },
      // 记忆选择核心方法
      changePageCoreRecordData() {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let that = this;
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.multipleSelectionAll.length <= 0) {
          this.multipleSelectionAll = this.multipleSelection;
          this.cleanwords = this.multipleSelectionAll;
          return;
        }
        // 总选择里面的key集合
        let selectAllIds = [];
        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row[idKey]);
        });
        let selectIds = [];
        // 获取当前页选中的id
        this.multipleSelection.forEach(row => {
          selectIds.push(row[idKey]);
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.multipleSelectionAll.push(row);
          }
        });
        let noSelectIds = [];
        // 得到当前页没有选中的id
        this.choisecleanwrodsTableData.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey]);
          }
        });
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.multipleSelectionAll.length; i++) {
              if (that.multipleSelectionAll[i][idKey] == id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.multipleSelectionAll.splice(i, 1);
                break;
              }
            }
          }
        });
      },

      changePageCoreRecordData0() {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let that = this;
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.multipleSelectionAll0.length <= 0) {
          this.multipleSelectionAll0 = this.multipleSelection0;
          return;
        }
        // 总选择里面的key集合
        let selectAllIds = [];
        this.multipleSelectionAll0.forEach(row => {
          selectAllIds.push(row[idKey]);
        });
        let selectIds = [];
        // 获取当前页选中的id
        this.multipleSelection0.forEach(row => {
          selectIds.push(row[idKey]);
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.multipleSelectionAll0.push(row);
          }
        });
        let noSelectIds = [];
        // 得到当前页没有选中的id
        this.choisecleanwrodsTableData.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey]);
          }
        });
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.multipleSelectionAll0.length; i++) {
              if (that.multipleSelectionAll0[i][idKey] == id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.multipleSelectionAll0.splice(i, 1);
                break;
              }
            }
          }
        });
      },

      // 设置选中的方法
      setSelectRow() {
        if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
          // this.cleanwords=this.multipleSelectionAll;
          return;
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let selectAllIds = [];
        let that = this;
        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row[idKey]);
        });
        this.$refs.multipleTable.clearSelection();
        // this.$nextTick(function() {
        //   for (var i = 0; i < this.choisecleanwrodsTableData.length; i++) {
        //     if (selectAllIds.indexOf(this.choisecleanwrodsTableData[i][idKey]) >= 0) {
        //       this.$refs.multipleTable.toggleRowSelection(this.choisecleanwrodsTableData[i]);
        //     }
        //   }
        // })
      },
      wordChecked(val) {
        this.multipleSelection = val;
      },
      wordChecked0(val) {
        this.multipleSelection0 = val;
      },
      wordChecked1(row) {
        // this.multipleSelection1=row;
        this.shijian_1 = row.targetFieldName;
        this.shijian_2 = row.targetField;
        console.log('rnmdcb', row.targetFieldName);
      },
      wordChecked2(row) {
        this.id_1 = row.targetFieldName;
        this.id_2 = row.targetField;
      },
      //清洗字段；
      zidaunSubmit() {
        var self = this;
        if (self.addType == 0) {
          self.changePageCoreRecordData();
        } else if (self.addType == 1) {
          self.rulerform.quchong = '';
          var quchongList = [];
          var quchongList1 = [];
          for (var i = 0, len = self.multipleSelection0.length; i < len; i++) {
            quchongList.push(self.multipleSelection0[i].targetFieldName);
            quchongList1.push(self.multipleSelection0[i].targetField);
          }
          for (var i = 0, len = self.multipleSelectionAll0.length; i < len; i++) {
            quchongList.push(self.multipleSelectionAll0[i].targetFieldName);
            quchongList1.push(self.multipleSelectionAll0[i].targetField);
          }
          self.rulerform.quchong = quchongList.join(',');
          self.rulerform.quchong1 = quchongList1.join(',');
          self.multipleSelection0 = '';
          self.multipleSelectionAll0 = '';
          // self.addType = 0;
        } else if (self.addType == 2) {
          self.rulerform.shijian = '';
          self.rulerform.shijian = self.shijian_1;
          self.rulerform.shijian1 = self.shijian_2;
          self.shijian_1 = '';
          self.shijian_2 = '';
          // self.addType = 0;
        } else if (self.addType == 3) {
          self.rulerform.id = '';
          self.rulerform.id = self.id_1;
          self.rulerform.id1 = self.id_2;
          self.id_1 = '';
          self.id_2 = '';
          // self.addType = 0;
        }

        this.cleanwordobj.currentPage = 1;
        this.chiosecleanWords();
        self.qingxiWords = false;
      },
      //清洗列表确定；
      liebiaoSubmit() {
        this.qingxiList = false;
      },
      //清洗规则；
      qingxiRolers(row, index) {
        this.qingxirulers = true;
        if (this.rulerform.morenz == '') {
          this.mrCheck = true;
        }
        if (this.rulerform.quchu == '') {
          this.qcCheck = true;
        }
        if (this.rulerform.biaodas == '' && this.rulerform.tihuanz == '') {
          this.zzCheck = true;
        }
        if (this.rulerform.quchong == '' && this.rulerform.shijian == '') {
          this.qchCheck = true;
        }
        if (this.rulerform.id == '') {
          this.xbCheck = true;
        }
        if (this.rulerform.date == '') {
          this.rqCheck = true;
        }
        this.rowIndex = index;
        this.cleanruleRow = row;
        //清洗规则添加,编辑回显;
        if (!row.rulers) {
          this.rulerform.biaodas = '';
          this.rulerform.morenz = '';
          this.rulerform.quchu = '';
          this.rulerform.tihuanz = '';
          this.rulerform.quchong = '';
          this.rulerform.shijian = '';
          this.rulerform.id = '';
          this.rulerform.date = '';
          this.rulerform.QXJAR = '';
        } else {
          this.rulerform.biaodas = row.rulers.CRRR['CRRRR'];
          this.rulerform.morenz = row.rulers.morenz;
          this.rulerform.quchu = row.rulers.CRDTES;
          this.rulerform.tihuanz = row.rulers.CRRR['CRRRV'];
          this.rulerform.quchong = row.rulers.DISTINCT['FIED'];
          this.rulerform.shijian = row.rulers.DISTINCT['DATA'];
          this.rulerform.id = row.rulers.SEX;
          this.rulerform.date = row.rulers.DATE;
          this.rulerform.QXJAR = row.rulers.QXJAR;
        }
      },
      //删除清洗规则；
      qingxiDelet(row) {
        this.$confirm('确认要删除选中的清洗字段吗，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'blue-btn btn-custom-cancel',
          confirmButtonClass: 'yellow-btn btn-custom-confirm', // 以上两个按钮添加btn-custom-XXX来控制按钮位置
          type: 'warning',
          center: true
        })
          .then(() => {
            this.cleanwords.forEach((item, index) => {
              if (item.id == row.id) {
                this.cleanwords.splice(index, 1);
                this.setJiance.splice(index, 1);
              }
            });
            this.cleanWordput.forEach((items, num) => {
              if (items.id == row.id) {
                this.cleanWordput.splice(num, 1);
                this.setJiance.splice(index, 1);
              }
            });
            this.$notify({
              type: 'success',
              message: '删除成功'
            });
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消删除"
            // });
          });
      },
      //查看清洗规则；
      handleClick1(row) {
        this.qingxirulers = true;
        if (row.cleaningRules) {
          this.cleaningRules = JSON.parse(row.cleaningRules);
          this.rulerform.biaodas = this.cleaningRules.CRRR['CRRRR'];
          this.rulerform.morenz = this.cleaningRules.morenz;
          this.rulerform.quchu = this.cleaningRules.CRDTES;
          this.rulerform.tihuanz = this.cleaningRules.CRRR['CRRRV'];
          this.rulerform.quchong = this.cleaningRules.DISTINCT['FIED'];
          this.rulerform.shijian = this.cleaningRules.DISTINCT['DATA'];
          this.rulerform.id = this.cleaningRules.SEX;
          this.rulerform.date = this.cleaningRules.DATE;
          this.rulerform.QXJAR = this.cleaningRules.QXJAR;
          this.jarList.forEach(e => {
            if (e.id == this.cleaningRules.QXJAR) {
              this.describes = e.describes;
            }
          });
        }
      },
      //清洗规则提交；
      rulersSubmit() {
        let mm = {
          CRRR: {
            CRRRR: '',
            CRRRV: ''
          },
          morenz: '',
          CRDTES: '',
          DISTINCT: {
            FIED: '',
            DATA: ''
          },
          SEX: '',
          DATE: '',
          QXJAR: ''
        };
        if (this.rulerArr.length > 0 || this.rulerform.QXJAR) {
          mm.CRRR['CRRRR'] = this.rulerform.biaodas;
          mm.morenz = this.rulerform.morenz;
          mm.CRDTES = this.rulerform.quchu;
          mm.CRRR['CRRRV'] = this.rulerform.tihuanz;
          mm.DISTINCT['FIED'] = this.rulerform.quchong1;
          mm.DISTINCT['DATA'] = this.rulerform.shijian1;
          mm.QXJAR = this.rulerform.QXJAR;
          mm.SEX = this.rulerform.id1;
          mm.DATE = this.rulerform.date;
          this.qingxirulers = false;
          //  if(this.rulerform.biaodas==''&&this.rulerform.morenz==''&&this.rulerform.quchu==''&&this.rulerform.tihuanz==''){
          //    this.tips('请完善规则设置2','error','请完善规则设置2');
          //    this.qingxirulers=true;
          //  }
          //  else{
          //    this.tips('清洗规则设置成功!','success','清洗规则设置成功');
          //    this.qingxirulers=false;
          //  }
        } else {
          this.tips('请完善规则设置', 'error', '请完善规则设置');
        }
        //把清洗规则添加到字段列表数据中；v-model，bug;
        this.cleanwords.forEach(res => {
          if (res.id == this.cleanruleRow.id) {
            res.rulers = mm;
          }
        });
        this.gzTrue = true;
        let checkedArr = [];
        this.cleanwords.forEach((res, index) => {
          if (res.rulers) {
            if (
              !(
                res.rulers.CRDTES == '' &&
                res.rulers.morenz == '' &&
                res.rulers.CRRR.CRRRR == '' &&
                res.rulers.CRRR.CRRRV == '' &&
                res.rulers.DISTINCT.FIED == '' &&
                res.rulers.DISTINCT.DATA == '' &&
                res.rulers.QXJAR == '' &&
                res.rulers.SEX == '' &&
                res.rulers.DATE == ''
              )
            ) {
              checkedArr.push(index);
              this.setJiance = checkedArr.filter(function (element, index, self) {
                return self.indexOf(element) === index;
              });
            }
          } else {
            this.setJiance.splice(index, 1);
          }
        });
        this.rulerform.quchong1 = '';
        this.rulerform.shijian1 = '';
        this.rulerform.id1 = '';
        this.rulerform.quchong = '';
        this.rulerform.shijian = '';
        this.rulerform.id = '';
        this.rulerArr.length = 0;
        this.rulerform.QXJAR = '';
      },
      isruleChekced(event, key) {
        if (this.showType == '0') {
          event.preventDefault();
          let target = event.target;
          let className = target.getAttribute('class');
          if (className == 'ruler-List') {
            switch (key) {
              case '2':
                // this.rulerform.biaodas=""
                // this.rulerform.tihuanz=""
                this.rulerform.morenz = '';
                this.mrCheck = false;
                // this.zzCheck=true
                target.setAttribute('class', 'ruler-check');
                break;
              case '4':
                this.qcCheck = false;
                target.setAttribute('class', 'ruler-check');
                break;
              case '7':
                // this.rulerform.morenz=""
                this.rulerform.biaodas = '';
                this.rulerform.tihuanz = '';
                this.zzCheck = false;
                // this.mrCheck=true
                target.setAttribute('class', 'ruler-check');
                break;
              case '8':
                this.rulerform.quchong = '';
                this.rulerform.shijian = '';
                this.rulerform.quchong1 = '';
                this.rulerform.shijian1 = '';
                this.qchCheck = false;
                target.setAttribute('class', 'ruler-check');
                break;
              case '9':
                this.rulerform.id = '';
                this.rulerform.id1 = '';
                this.xbCheck = false;
                target.setAttribute('class', 'ruler-check');
                break;
              case '10':
                this.rulerform.date = '';
                this.rqCheck = false;
                target.setAttribute('class', 'ruler-check');
                break;
            }
            this.rulerArr.push(key);
            this.rulerArr = this.uniq(this.rulerArr); //去重
          }
          if (className == 'ruler-check') {
            switch (key) {
              case '2':
                // this.rulerform.quchu=""
                this.mrCheck = true;
                target.setAttribute('class', 'ruler-List');
                break;
              case '4':
                this.qcCheck = true;
                // this.rulerform.morenz=""
                target.setAttribute('class', 'ruler-List');
                break;
              case '7':
                // this.rulerform.biaodas=""
                // this.rulerform.tihuanz=""
                this.zzCheck = true;
                target.setAttribute('class', 'ruler-List');
                break;
              case '8':
                // this.rulerform.quchong=""
                // this.rulerform.shijian=""
                this.qchCheck = true;
                target.setAttribute('class', 'ruler-List');
                break;
              case '9':
                // this.rulerform.id=""
                this.xbCheck = true;
                target.setAttribute('class', 'ruler-List');
                break;
              case '10':
                // this.rulerform.biaodas=""
                // this.rulerform.tihuanz=""
                this.rqCheck = true;
                target.setAttribute('class', 'ruler-List');
                break;
            }
            this.rulerArr.forEach((item, index) => {
              if (item == key) {
                this.rulerArr.splice(index, 1);
              }
            });
          }
        }
      },
      uniq(array) {
        let temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
          }
        }
        return temp;
      },
      //清洗增加确认；
      cleanAddSubmit() {
        var len1 = this.cleanwords.length;
        var test1 = JSON.parse(JSON.stringify(this.setJiance.length));
        if (len1 == test1) {
          if (this.celueName == '') {
            this.tips('清洗策略名称不能为空', 'error', '清洗策略名称不能为空');
          } else if (this.cleantabels == '') {
            this.tips('清洗策略名称不能为空', 'error', '清洗策略名称不能为空');
          } else if (this.cleanwords.length == '') {
            this.tips('请选择清洗字段', 'error', '请选择清洗字段');
          } else if (!this.gzTrue) {
            this.tips('请设置清洗规则', 'error', '请设置清洗规则');
          } else {
            this.cleanAdddata.cleaningTable = this.tName; //名称；
            this.cleanAdddata.cleaningIncrement = this.valueZl; //名称；
            this.cleanAdddata.strategyName = this.celueName; //名称；
            this.cleanAdddata.timingState = this.keyDefault; //名称；
            this.cleanAdddata.cleaningStrategyTables.splice(
              0,
              this.cleanAdddata.cleaningStrategyTables.length
            );
            if (this.cleanwords.length > 0) {
              this.cleanwords.forEach(res => {
                let m = {};
                m.cleaningField = res.targetField;
                m.cleaningFieldLength = res.isTimestamp;
                m.cleaningFieldName = res.targetFieldName;
                //清洗字段规则；
                m.cleaningRules = JSON.stringify(res.rulers);
                this.cleanAdddata.cleaningStrategyTables.push(m);
              });
            }
            api.cleanSubmit(this.cleanAdddata)
              .then(res => {
                this.tips('添加成功', 'success', res.msg);
                if (res.code === 'code_200') {
                  this.$router.push({
                    path: 'cleanStrategyMange',
                    query: {
                      menuLink: this.$route.query.menuLink
                    }
                  });
                } else {
                  this.tips('失败', 'error', res.msg);
                }
              });
          }
        } else {
          this.$message({
            type: 'error',
            message: '请完善清洗规则！'
          });
        }
      },
      //tips
      tips(title, state, msg) {
        this.$notify({
          tittle: title,
          message: msg,
          type: state,
          offset: 110,
          duration: this.$store.state.el_Duration
        });
      },
      //返回
      goBack() {
        this.$router.push({
          path: 'cleanStrategyMange',
          query: {
            menuLink: this.$route.query.menuLink
          }
        });
      }
    }
  };
</script>
<style scoped lang="less">
  @import "cleansStrategy-add.less";
</style>


