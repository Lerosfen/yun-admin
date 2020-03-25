<template>
  <div class="list-container shandow monior">
    <table-honer></table-honer>
    <div class="content-section">
      <el-row :gutter="20">
        <!-- <el-col :span="12" class='mb-10'>
           <div class="clusterView">
             <div class='title-cont clearfix'>
               <div class='title-left fl'>
                 数据处理机制监控
               </div>
               <div class='title-right fl'>01</div>
             </div>
             <div class="content" ref="content">
               <div class="side">
                 <div></div>
                 <div></div>
                 <div></div>
                 <div></div>
               </div>
               <div id="charts1" ref="main"></div>
             </div>
           </div>
         </el-col>-->
        <el-col :span="12" class='mb-10'>
          <div class="clusterView">
            <div class='title-cont clearfix'>
              <div class='title-left fl'>
                数据处理状态监控
              </div>
              <div class='title-right fl'>01</div>
            </div>
            <div class="content" ref="content">
              <div class="side">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div id="charts2" ref="main"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import api from '../../api/bigData/daq/basicMonitoring';

  let logChart;
  let logTypeChart;
  export default {
    name: 'basicMonitoring',
    data() {
      return {
        option1: {
          grid: {
            show: true,
            left: '10%',
            top: '35%',
            right: '10%',
            bottom: '17%',
            borderWidth: 0,
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontSize: 15,
              color: '#fff',
            },
            formatter: function (params) {
              return params[0].axisValueLabel + '<br/>' +
                params[0].seriesName + ' : ' + params[0].value + '<br/>';
            },
          },
          xAxis: {
            type: 'category',
            data: ['食品', '饮料烟酒', '服装鞋帽'],
            splitLine: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#d0d0d0'
              }
            },
            axisTick: {       //x轴刻度线
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: function (value, index) {

                if (index % 2 != 0) {
                  return '\n\n' + value;
                } else {
                  return value;
                }
              }
            }


          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100,
            },
            {
              start: 0,
              end: 100,
              xAxisIndex: [0],
              filterMode: 'empty',
              show: true,
              height: '5',
              bottom: '5%',
              borderColor: '#6b5df9',
              opacity: '0.5',
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              backgroundColor: new this.$echarts.graphic.LinearGradient(1, 0, 0, 0,
                [{
                  offset: 0, color: '#1bfbfc'
                },
                  {
                    offset: 1, color: '#105DA7'
                  }], false),
              fillerColor: '#1bfbfc',
              handleSize: '200%',
              handleStyle: {
                color: '#616161'
              }
            }
          ],
          color: ['#3FDBC3', '#16E094', '#47B3FE', '#EDF472', '#D8A23F'],
          yAxis: {
            type: 'value',
            name: '条',
            nameTextStyle: {
              padding: [0, 0, 10, -40],
              color: '#616161'
            },
            minInterval: 1,
            axisLine: {       //y轴
              show: false,
              lineStyle: {
                color: '#616161'
              }
            },
            axisTick: {       //y轴刻度线
              show: false
            },
            splitLine: {
              show: false
            }
          },
          series: [{
            stack: 1,
            name: '条数',
            data: [200, 100, 300],
            type: 'bar',
            barWidth: '5',
            barGap: '180%',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(208,163,31,1)'
                  },
                    {
                      offset: 1,
                      color: 'rgba(208,163,31,0)'
                    }
                  ]
                )
              }
            },
            z: 0
          },
            {
              type: 'scatter',
              stack: 1,
              symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABa1BMVEX32hX31xX31xb41xb40xb30xf7oCT8nyT8myb8myX7myX8lyb7lyf8lyf32hX32hX32hX32hX32hX31xb31xb31xb31xX41xX41xb31xX40xf30xb40xf30xf40xb4zxj4zhj4zxj4zhj3zhj3zxj4zxj4zhj4yRn4yRn5yRn5yxr41Rb31hb4yxn4yRr4yRn5wxv4wxv5wxv4wxr4zRn4zhn5xBv4wxv5vR35vRz5vh35wxr5xBv5vR35vRz5tx75tx76tx76th/6tx76sB/6sR/6sCD7qiL7qyH6qyH6qyL6qiH7qyH6qiH7oCT8niT8niX6qSH6qyH7qyL6qiH6pSL7pCP6pSL7pSL7pSP7pSL7pSP7nyT7nyT7oCT7oCT7myX8myX7myX8myX7miX8lyf8lyf8lyb8lyb8lyf8lyb8lyb8lyb4zhj3zhj4zhn5xBr5wxv5wxr6th/6th77qiH8qSH7qiL///+KpUN1AAAAbXRSTlMAAAAAAAAAAAAAAAAAAAQbKjIaETAzMzMzEREzMzMzBDAzMzMzMAQaMzM4p/E4MxsqMzMzpqAzKjIzM/HxMzIyMzPxMSozM6ahGjMzMzin8fE4MzMbBDAzMzMwBBEzMxERMDMzMwQbKjIxKRoE7lnIxwAAAAFiS0dEeNbb5EYAAAAHdElNRQfiCxUOLwcBqQZRAAAA0klEQVQI12NgYGDg4xcQFBQQ4gMyGRiZhEVExUTFRSVEJBmZGVikpKVlZGRl5WSkZaVYGeQVFJWUlVTAhKoag7qGhqaWto6Otq6enoY+g4GhkbFJbl5uvqmRmZE5g4WllaV1QWFRoY2tpa0dg72Do4NTcUlxiZOjo4Mzg4urq5t7aVl5mYebm6sLg6eXt4+vn3+AX2CQd3AIQ2hYeEREeGRkBBBFRTOwxcTGxcYBUWxsbDw7AwdnQmJSUnJyUkpiAhcXAzcPd2paekZmVnYONy83AF32LKVM26zAAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTExLTIxVDE0OjQ3OjA3KzA4OjAwBEs2/QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMS0yMVQxNDo0NzowNyswODowMHUWjkEAAAAASUVORK5CYII=',
              symbolOffset: ['0%', '0'], //相对于原本位置的偏移量
              data: [0, 0, 0],
              label: {
                normal: {
                  show: false,
                }
              },
              symbolSize: 20,
              z: 1
            }]
        },
        option2: {
          legend: {
            show: true,
            icon: 'square',
            bottom: '5%',
            textStyle: {
              color: '#616161'
            },
            data: ['已处理', '未处理', '处理中']
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          color: ['#1489F0', '#FB3292', '#FBD246', '#0E69FE'],
          series: [
            {
              type: 'pie',
              radius: ['30%', '50%'],
              label: {
                formatter: '{b}:  {c}'
              },
              data: [
                { value: 335, name: '已处理' },
                { value: 310, name: '未处理' },
                { value: 234, name: '处理中' },
              ]
            }
          ]
        },
        timer1: '',
        timer2: '',
      };

    },
    created() {
      var self = this;
      self.timer1 = setTimeout(() => {
        self.findLogin();
      }, 2000);
      self.timer2 = setTimeout(() => {
        self.finTypLogin();
      }, 2000);
    },
    destroyed() {
      console.log('timer1', this.timer1);
      console.log('timer2', this.timer2);

      if (this.timer1) {

        clearTimeout(this.timer1); //关闭
        console.log('timer1', this.timer1);
      }
      if (this.timer2) {
        clearTimeout(this.timer2); //关闭
        console.log('timer2', this.timer2);
      }
    },

    mounted() {
      let self = this;
      let chartSize_W = this.$refs.content.offsetWidth;
      let chartSize_H = this.$refs.content.offsetHeight;
      this.$refs.main.style.width = chartSize_W - 100 + 'px';
      this.$refs.main.style.height = chartSize_H - 10 + 'px';

      window.addEventListener('resize', this.onWindowResize, false);
    },
    methods: {
      onWindowResize() {
        let chartSize_W = this.$refs.content.offsetWidth;
        let chartSize_H = this.$refs.content.offsetHeight;
        this.$refs.main.style.width = chartSize_W - 100 + 'px';
        this.$refs.main.style.height = chartSize_H - 10 + 'px';
        logChart.resize();

      },

      findLogin() {
        var self = this;
        api.findLogin()
          .then(res => {
            console.log('loggg', res.data);
            var xdata = [],
              ydata = [],
              ydata2 = [];
            if (res.code == 'code_200') {
              res.data.forEach(e => {
                xdata.push(e.tableName);
                ydata.push(e.count);
                ydata2.push(0);
              });
              self.option1.xAxis.data = xdata;
              self.option1.series[0].data = ydata;
              logChart = self.$echarts.init(document.getElementById('charts1'));
              logChart.setOption(self.option1);
            }
          });
      },

      finTypLogin() {
        var self = this;
        api.finTypLogin()
          .then(res => {
            console.log('logggt', res.data);
            var xdata = [];
            if (res.code == 'code_200') {
              res.data.forEach(e => {
                if (e.name == '1') {
                  e.name = '已处理';
                }
                if (e.name == '2') {
                  e.name = '未处理';
                }
                if (e.name == '3') {
                  e.name = '处理中';
                }
                xdata.push(e.name);
              });
              self.option2.legend.data = xdata;
              self.option2.series[0].data = res.data;
              logTypeChart = self.$echarts.init(document.getElementById('charts2'));
              logTypeChart.setOption(self.option2);
            }
          });
      },
    }

  };
</script>
<style scoped lang="less">
  .monior {
    height: calc(100vh - 190px);
  }

  .content-section {
    .mb-10 {
      margin-bottom: 10px;
    }

    .clusterView {
      /*height: 300px;*/

      .title-cont {
        margin-bottom: 10px;
      }

      .title-left {
        width: 250px;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background: url('../../assets/img/icon/monitor-title-left.png') no-repeat;
        background-size: 100% 100%;
      }

      .title-right {
        background: url('../../assets/img/icon/monitor-title-right.png') no-repeat;
        background-size: 100% 115%;
        width: 70px;
        height: 52px;
        line-height: 65px;
        text-align: center;
        margin-top: -8px;
        color: #616161;
        font-size: 20px;
        font-family: fantasy;

      }

      .title {
        width: 300px;
        height: 55px;
        background-image: url("../../assets/img/icon/monitoring_icon-title.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;

        .title_p {
          padding: 10px 10px 10px 23px;
          display: flex;
          justify-content: space-between;

          .num {
            width: 44px;
            height: 35px;
            text-align: center;
            line-height: 35px;
            color: #e4e3e8;
            font-size: 20px;
            font-family: fantasy;
          }
        }

        .title_p .left div:nth-child(1) {
          font-size: 14px;
        }

        .title_p .left div:nth-child(2) {
          font-size: 12px;
        }
      }

      .content {
        position: relative;
        width: 100%;
        height: calc((100vh - 310px) / 2);
        background-color: rgba(4, 21, 41, 0.1);

        .side {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;

          div {
            width: 15px;
            height: 15px;

          }

          div:nth-child(1) {
            position: absolute;
            left: 0;
            top: 0;
            border-left: 2px solid #009ee6;
            border-top: 2px solid #009ee6;
          }

          div:nth-child(2) {
            position: absolute;
            right: 0;
            top: 0;
            border-right: 2px solid #009ee6;
            border-top: 2px solid #009ee6;
          }

          div:nth-child(3) {
            position: absolute;
            right: 0;
            bottom: 0;
            border-right: 2px solid #009ee6;
            border-bottom: 2px solid #009ee6;
          }

          div:nth-child(4) {
            position: absolute;
            left: 0;
            bottom: 0;
            border-left: 2px solid #009ee6;
            border-bottom: 2px solid #009ee6;
          }
        }
      }

      #charts1, #charts2 {
        height: 100%;
        padding: 0 10px;
      }
    }
  }

</style>


