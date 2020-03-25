<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <div class="grid-left">
        <div>
          <img src="../../../assets/img/basicbaseVisul/statical/bg-frame-1.png" width="100%" height="249px" alt="">
          <div class="title">{{populationList.title}}</div>
          <canvas class="chart" :id="populationList.id"
                  :width="populationList.widths" :height="populationList.heights">
          </canvas>
        </div>
        <div>
          <img src="../../../assets/img/basicbaseVisul/statical/bg-frame-1.png" width="100%" height="249px" alt="">
          <div class="title">{{densityList.title}}</div>
          <div class="middle">
            <span>
              <div class="middle-title"><span>750</span> 人</div>
              <p>/km<sup>2</sup></p>
              <p>2015</p>
            </span>
            <span>
              <div class="middle-title"><span>750</span> 人</div>
              <p>/km<sup>2</sup></p>
              <p>2015</p>
            </span>
            <span>
              <div class="middle-title"><span>750</span> 人</div>
              <p>/km<sup>2</sup></p>
              <p>2015</p>
            </span>
            <span>
              <div class="middle-title"><span>750</span> 人</div>
              <p>/km<sup>2</sup></p>
              <p>2015</p>
            </span>
          </div>
        </div>
        <div>
          <img src="../../../assets/img/basicbaseVisul/statical/bg-frame-1.png" width="100%" height="249px" alt="">
          <div class="title">{{employmentList.title}}</div>
          <div class="bottom">
            <span>
              <img src="../../../assets/img/basicbaseVisul/statical/figure.png" alt="">
              <div class="markedness-title"><span>4.1</span>%</div>
              <p>2015年</p>
            </span>
            <span>
              <img src="../../../assets/img/basicbaseVisul/statical/figure.png" alt="">
              <div class="markedness-title"><span>4.1</span>%</div>
              <p>2015年</p>
            </span>
            <span>
              <img src="../../../assets/img/basicbaseVisul/statical/figure.png" alt="">
              <div class="markedness-title"><span>4.1</span>%</div>
              <p>2015年</p>
            </span>
            <span>
              <img src="../../../assets/img/basicbaseVisul/statical/figure.png" alt="">
              <div class="markedness-title"><span>4.1</span>%</div>
              <p>2015年</p>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-center">
        <img class="" src="../../../assets/img/basicbaseVisul/statical/bg-frame-2.png" width="100%" height="817px"
             alt="">
        <div class="title">{{ringList.title}}</div>
        <div class="select">
          <div class="input-data fl m-l-10">
            <div class="input-tpm yellow-input">
              <i class="honer-left"></i>
              <el-select v-model="year" placeholder="请选择" @change="changeYear()">
                <el-option
                  v-for="item in yearListValue"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <i class="honer-right"></i>
            </div>
          </div>
        </div>
        <div class="chart">
          <canvas class="chart" :id="ringList.id"
                  :width="ringList.width" :height="ringList.height"></canvas>
        </div>
        <div class="ring-bottom">
          <canvas class="chart" :id="pieList.id"
                  :width="pieList.widths" :height="pieList.heights"></canvas>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-right">
        <div>
          <img src="../../../assets/img/basicbaseVisul/statical/bg-frame-3.png" width="100%" height="538px" alt="">
          <div class="title">{{analyzeList.title}}</div>
          <div class="chart">
            <canvas class="chart" :id="analyzeList.id"
                    :width="analyzeList.widths" :height="analyzeList.heights">
            </canvas>
          </div>
        </div>
        <div>
          <img src="../../../assets/img/basicbaseVisul/statical/bg-frame-1.png" width="100%" height="249px" alt="">
          <div class="middle">
            <span>
              <div class="middle-title"><span>750</span>%</div>
              <p>423231人</p>
              <p>2015</p>
            </span>
            <span>
              <div class="middle-title"><span>750</span> 人</div>
              <p>/km<sup>2</sup></p>
              <p>2015</p>
            </span>
            <span>
              <div class="middle-title"><span>750</span> 人</div>
              <p>/km<sup>2</sup></p>
              <p>2015</p>
            </span>
            <span>
              <div class="middle-title"><span>750</span> 人</div>
              <p>/km<sup>2</sup></p>
              <p>2015</p>
            </span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  const qs = require("qs");
  import api from "../../../../src/api/bigData/daq/basicBaseVisulization/basicBaseVisulization";
  export default {
    data() {
      return {
        titles: "",
        populationList: {
          title: '人口统计总数',
          id: 'populationID',
          heights: 230,
          widths: 600,
        },
        ringList: {
          title: '人口金字塔',
          id:'optTower',
          width: 570,
          height: 470,
        },
        pieList: {
          id: 'pieList',
          widths: '600',
          heights: '230',
        },
        analyzeList: {
          title: '人口动态统计分析',
          id: 'analyzeDiv',
          heights: 500,
          widths: 600,
        },
        densityList: {
          title: '人口密度变化情况',
        },
        employmentList: {
          title: '人口就业变化',
        },
        //人口库统计
        populationOptionBar: {
          tooltip: {},
          legend: {
            data: ['年份'],
            textStyle: {
              color: '#fff',
            },
          },
          xAxis: {
            //  改变x轴颜色
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff',
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#fff',
              },
            },
            //data: ["2015", "2016", "2017", "2018", "2019"],
            data: [],
          },
          yAxis: {
            type: 'value',
            name: '人口',
            nameTextStyle: {
              color: '#fff',
            },
            axisLabel: {
              textStyle: {color: "#d0d0d0"}, //纵坐标颜色
            },
            //  隐藏y轴
            axisLine: {show: false},
            // 去除y轴上的刻度线
            axisTick: {
              show: true
            },
            splitLine: {
              show: true,
              //  改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: "rgba(2,65,92,0.9)",
              }
            },
          },
          series: [{
            name: '年份',
            type: 'bar',
            itemStyle: {
              normal: {
                //color: "rgba(0,155,158,1)" //柱状图的背景颜色
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: "rgba(0,155,158,1)" // 0% 处的颜色
                  }, {
                    offset: 1, color: 'transparent' // 100% 处的颜色
                  }],
                }
              }
            },
            barWidth: 20,  //柱状图宽度
            //data: [78911, 18911,30000,70000],
            data: [],
          }],
        },
        year: '',
        yearListValue: [],
        populationAnalyzeOption: {
          legend: {
            data: ['死亡率', '出生率', '自然生长率'],
            textStyle: {
              color: '#fff',
            },
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            //  改变x轴颜色
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff',
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#fff',
              },
            },
            data: ["2015", "2016", "2017", "2018", "2019"]
          },
          yAxis: {
            nameTextStyle: {
              color: '#fff',
            },
            axisLabel: {
              textStyle: {color: "#d0d0d0"}, //纵坐标颜色
            },
            //  隐藏y轴
            axisLine: {show: false},
            // 去除y轴上的刻度线
            axisTick: {
              show: true
            },
            splitLine: {
              show: true,
              //  改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: "rgba(2,65,92,0.9)",
              }
            },
          },
          series: [
            {
              name: '死亡率',
              type: 'bar',
              itemStyle: {
                normal: {
                  //color: "rgba(0,155,158,1)" //柱状图的背景颜色
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: "rgba(0,155,158,1)" // 0% 处的颜色
                    }, {
                      offset: 1, color: 'transparent' // 100% 处的颜色
                    }],
                  }
                }
              },
              barWidth: 20,  //柱状图宽度
              data: ['2014', '2015', '2016', '2013', '2018'],
            },
            {
              name: '出生率',
              type: 'bar',
              itemStyle: {
                normal: {
                  //color: "rgba(11,73,111,1)" //柱状图的背景颜色
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: "rgba(11,73,111,1)" // 0% 处的颜色
                    }, {
                      offset: 1, color: 'transparent' // 100% 处的颜色
                    }],
                  }
                }
              },
              barWidth: 20,  //柱状图宽度
              data: ['2014', '2015', '2016', '2013', '2018'],
            },
            {
              name: '自然生长率',
              type: 'bar',
              itemStyle: {
                normal: {
                  //color: "rgba(150,105,40,1)" //柱状图的背景颜色
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: "rgba(150,105,40,1)" // 0% 处的颜色
                    }, {
                      offset: 1, color: 'transparent' // 100% 处的颜色
                    }],
                  }
                }
              },
              barWidth: 20,  //柱状图宽度
              data: ['2014', '2015', '2016', '2013', '2018'],
            },
          ]
        },
        pyramid:{},
        youthPercentageList:[],
        middlePercentageList:[],
        oldPercentageList:[],
        nanPercentageList:[],
        nvPercentageList:[],
        populationid:{},
        populationCountArr: [],
        populationYearArr:[],
        analyzePopulationId:{},
      };
    },
    methods: {
      init() {
        api.popchart({
          chartIds: 'RK_00001,RK_00004,RK_00006,RK_00005,',
        }).then(res => {
          var string_1= 'RK_00001';
          var string_4= 'RK_00004';
          var string_6= 'RK_00006';
          if (res.code == "code_200") {
            this.pyramid=res.data[string_6];

            this.initPyramid(this.pyramid);
            this.populationid = res.data[string_1]
            console.log('this.populationid',this.populationid);
            this.populationid.forEach((item,val) => {
              this.populationCountArr.push(item.count);
              this.populationYearArr.push(item.year);
            })
            //console.log('234',this.populationCountArr,this.populationYearArr);
            this.initpopulation();
            this.analyzePopulationId= res.data[string_4];
            //console.log('4',this.populationAnalyzeId)
            this.analyzePopulation();

          }
        });
      },
      changeYear(){
        this.initPyramid(this.year);
      },
      initPyramid(){
        this.yearListValue = Object.keys(this.pyramid);
        if(!this.year){
          this.year =this.yearListValue[0];
        }
        console.log('年',this.year);
        //0-19岁少年儿童占比
        this.youthPercentageList.push({value: this.pyramid[this.year]['0-19岁少年儿童占比']['男'],name:'男'});
        this.youthPercentageList.push({value: this.pyramid[this.year]['0-19岁少年儿童占比']['女'],name:'女'});
        this.youthPercentageList.push({value:1 - this.pyramid[this.year]['0-19岁少年儿童占比']['合计']});
        //20-59岁青壮年占比
        this.middlePercentageList.push({value: this.pyramid[this.year]['20-59岁青壮年占比']['男'],name:'男'});
        this.middlePercentageList.push({value: this.pyramid[this.year]['20-59岁青壮年占比']['女'],name:'女'});
        this.middlePercentageList.push({value: this.pyramid[this.year]['20-59岁青壮年占比']['合计']});
        //60岁以上老年人占比
        this.oldPercentageList.push({value: this.pyramid[this.year]['60岁以上老年人占比']['男'],name:'男'});
        this.oldPercentageList.push({value: this.pyramid[this.year]['60岁以上老年人占比']['女'],name:'女'});
        this.oldPercentageList.push({value: this.pyramid[this.year]['60岁以上老年人占比']['合计']});
        console.log('percentageList13232',this.youthPercentageList, this.middlePercentageList,this.oldPercentageList)
        this.nanPercentageList =this.pyramid[this.year]['nan'];
        this.nvPercentageList =this.pyramid[this.year]['nv'];
        //console.log(this.nanPercentageList,this.nvPercentageList);
        var ageArea = ['0~4', '5~9', '10~14', '15~19', '20~24', '25~29','30~34', '35~39','40~44', '45~49', '35~39','50~54', '55~59','60~14', '65~19', '70~74', '75~79','80~84','85~89','90~94', '95~99','100以上'];
        var Moption = {
          tooltip: {
            trigger: 'axis'
          },
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params, ticket) {
            var res = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              res += '<br/>' + params[i].seriesName + ' : ' + Math.abs(params[i].value);
            }
            return params;
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              axisLabel: {
                textStyle: {color: "#d0d0d0"},
                formatter: function (value) {
                  return Math.abs(value);
                }
              },
              splitLine: {
                show: false,
              },
              type: 'value'
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              axisLabel: {
                formatter: "{value}",
                textStyle: {color: "#d0d0d0"},
              },
              data: ageArea
            }
          ],
          legend: {
            data: ['男', '女'],
            textStyle: {
              color: '#fff',
            },
          },
          series: [
            {
              name: '男',
              type: 'bar',
              stack: '性别',
              barWidth: 20,  //柱状图宽度
              itemStyle: {
                normal: {
                  //color: "rgba(0,155,158,1)" //柱状图的背景颜色
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                      offset: 0, color: "rgba(0,157,165,1)" // 0% 处的颜色
                    }, {
                      offset: 1, color: 'transparent' // 100% 处的颜色
                    }],
                  }
                }
              },
              label: {
                normal: {show: true, position: 'right',}
              },
              data: this.nanPercentageList
            },
            {
              name: '女',
              type: 'bar',
              stack: '性别',
              barWidth: 20,  //柱状图宽度
              itemStyle: {
                normal: {
                  //color: "rgba(0,155,158,1)" //柱状图的背景颜色
                  color: {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 0,
                    colorStops: [{
                      offset: 0, color: "rgba(96,23,54,1)" // 0% 处的颜色
                    }, {
                      offset: 1, color: 'transparent' // 100% 处的颜色
                    }],
                  }
                }
              },
              label: {
                normal: {
                  show: true, position: 'left',
                  formatter: function (v) {
                    return Math.abs(v.data)
                  }
                }
              },
              data: this.nvPercentageList
            },
          ],
        };
        this.$echarts.init(document.getElementById(this.ringList.id)).setOption(Moption);
        var pieOption = {
          id:'ringOption',
          widths:'600',
          heights:'230',
          graphic: [
            { // graphic 是原生图形元素组件  每个饼图标题
              type: 'text', // 一个图形元素，类型是 text
              top: 'top',
              left: '16%',
              color:'#fff',
              style: {
                text: '60岁以上\n\n老人占比',
                textAlign: 'center',
                width:50,
                height:60,
                fontSize: 12,
                fill: '#fff', //字体颜色
              }
            },
            { // graphic 是原生图形元素组件
              type: 'text', // 一个图形元素，类型是 text
              top: 'top',
              left: '45%',
              style: {
                text: '20岁到50岁\n\n青中年占比',
                textAlign: 'center',
                fontSize: 12,
                fill: '#fff', //字体颜色
              }
            },
            { // graphic 是原生图形元素组件
              type: 'text', // 一个图形元素，类型是 text
              top: 'top',
              left: '74%',
              style: {
                text: '0岁到19岁\n\n少年儿童占比',
                textAlign: 'center',
                fontSize: 12,
                fill: '#fff', //字体颜色
              }
            }
          ],
          tooltip : {
            show: true,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          //图例组件。(图表下面选项)
          legend: {
            x : 'center',
            data:['男','女'],
            y : 'bottom',
            textStyle: {
              color: '#fff',
            },
          },
          toolbox: {
            show : false,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable:false,
          series : [
            {
              name:'1',
              type:'pie',
              center: ['20%', '60%'],
              radius : [40,50],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              data:this.youthPercentageList,
              itemStyle: {//系列级个性化
                normal: {
                  color: function(params) {
                    var colorList = [
                      '#02436b','#29832c','#9a7324',
                    ];
                    return colorList[params.dataIndex]
                  },
                  labelLine:{//饼图不显示线条
                    show: true,
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                  },
                  label:{//饼图不显示文字
                    show:true,
                    position : 'inner',//饼图图上显示百分比
                    formatter : function (params) {
                      return (params.percent - 0).toFixed(0) + '%'
                    },
                    textStyle:{
                      fontSize:14
                    },
                  }
                },
              }
            },
            {
              name:'2',
              type:'pie',
              center: ['50%', '60%'],
              radius : [40,50],
              data:this.middlePercentageList,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              itemStyle: {//系列级个性化
                normal: {
                  color: function(params) {
                    var colorList = [
                      '#02436b','#29832c','#9a7324',
                    ];
                    return colorList[params.dataIndex]
                  },
                  labelLine:{//饼图不显示线条
                    length:2,
                    show:false
                  },
                  label:{//饼图不显示文字
                    show:true,
                    position : 'inner',//饼图图上显示百分比
                    formatter : function (params) {
                      return (params.percent - 0).toFixed(0) + '%'
                    },
                    textStyle:{
                      fontSize:14
                    }
                  }
                }
              }
            },
            {
              name:'3',
              type:'pie',
              center: ['80%', '60%'],
              radius : [40,50],
              data:this.oldPercentageList,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              itemStyle: {//系列级个性化
                normal: {
                  color: function(params) {
                    var colorList = [
                      '#02436b','#29832c','#9a7324',
                    ];
                    return colorList[params.dataIndex]
                  },
                  labelLine:{//饼图不显示线条
                    length:2,
                    show:false
                  },
                  label:{//饼图不显示文字
                    show:true,
                    position : 'inner',//饼图图上显示百分比
                    formatter : function (params) {
                      return (params.percent - 0).toFixed(0) + '%'
                    },
                    textStyle:{
                      fontSize:14
                    }
                  }
                }
              }
            }
          ]
        };
        this.$echarts.init(document.getElementById(this.pieList.id)).setOption(pieOption);
      },
      initpopulation(){
        this.populationOptionBar.xAxis.data = this.populationYearArr;
        this.populationOptionBar.series[0].data = this.populationCountArr;
        setTimeout(() => {
          this.$echarts.init(document.getElementById(this.populationList.id)).setOption(this.populationOptionBar);
        }, 100);

      },
      analyzePopulation(){
        setTimeout(() => {
          this.$echarts.init(document.getElementById(this.analyzeList.id)).setOption(this.populationAnalyzeOption);
        }, 100);
      },
    },
    mounted() {
      this.init();
    },
  }
</script>
<style lang="less">
  @import "../../../assets/css/common.less";
  @import "../../../assets/css/reset.less";
</style>
<style scoped lang="less" type="text/less">
  @import "populationBaseCharts.less";
</style>
