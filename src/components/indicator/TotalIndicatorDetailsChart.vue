<template>
  <apexchart type="line" :height="chartOptions.chart.height" :options="chartOptions" :series="seriesData"></apexchart>
</template>

<script>
import _ from 'lodash';
import VueApexCharts from 'vue-apexcharts';
import Counter from '../../api/counter';
import { CHART } from '../../config';

const colors = ['#0ccb8f', '#8453ff', '#d94785'];

export default {
  name: 'TotalIndicatorDetailsChart',
  props: {
    series: {
      type: Array,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
    },
    day: {
      type: String,
    },
    counter: {
      type: String,
    },
  },
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      viewData: [],
      seriesData: [
        {
          name: 'SHOT COUNT',
          type: 'line',
          data: [],
        },
        {
          name: 'C/T',
          type: 'column',
          data: [],
        },
        {
          name: '온도',
          type: 'column',
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: 'line',
          stacked: false,
          redrawOnParentResize: true,
          height: '97%',
          width: '97%',
          toolbar: {
            show: true,
            offsetY: 10,
          },
        },
        stroke: {
          width: [4, 1, 1],
          curve: 'smooth',
        },
        plotOptions: {
          bar: {
            columnWidth: '80%',
          },
        },
        grid: CHART.GRID_OPTIONS,
        legend: {
          fontSize: '14pt',
          position: 'top',
          labels: {
            colors: '#6d88d5',
          },
          itemMargin: {
            horizontal: 28,
            vertical: 0,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 5,
        },
        colors: colors,
        xaxis: {
          type: 'category',
          categories: [],
          labels: {
            style: {
              colors: CHART.LABEL_COLOR.X,
              fontSize: '12px',
            },
          },
          axisBorder: {
            show: true,
            color: CHART.LABEL_COLOR.X,
          },
          axisTicks: {
            show: true,
            color: CHART.LABEL_COLOR.X,
            height: 4,
          },
        },
        yaxis: [
          {
            seriesName: 'ShotCount',
            axisBorder: {
              show: true,
              color: colors[0],
            },
            axisTicks: {
              show: true,
              color: colors[0],
              width: 4,
            },
            labels: {
              style: {
                colors: [colors[0]],
              },
              formatter: (val) => {
                if (val && val === 0) return 0;
                return new Intl.NumberFormat().format(parseInt(val));
              },
            },
          },
          {
            seriesName: 'CT',
            opposite: true,
            axisBorder: {
              show: true,
              color: colors[1],
            },
            axisTicks: {
              show: true,
              color: colors[1],
              width: 4,
            },
            labels: {
              style: {
                colors: [colors[1]],
              },
            },
          },
          {
            seriesName: 'Temp',
            opposite: true,
            axisBorder: {
              show: true,
              color: colors[2],
            },
            axisTicks: {
              show: true,
              color: colors[2],
              width: 4,
            },
            labels: {
              style: {
                colors: [colors[2]],
              },
            },
          },
        ],
      },
    };
  },
  created() {
    const cate = [];
    this.series.forEach((item) => {
      cate.push(item.shotHour);
      this.seriesData[0].data.push(item.shotCount);
      this.seriesData[1].data.push(item.ct);
      this.seriesData[2].data.push(item.temp);
    });
    this.chartOptions.xaxis.categories = cate;
    if (this.title) {
      this.chartOptions.title = this.title;
    }
    this.getCdata();
  },
  methods: {
    getRowData(idx, data, vm) {
      if (!data || !data.counter_id) {
        return;
      }

      let dailyShotCnt = 0;
      _.map(new Array(10), function (el, i) {
        let ix = i + 1;
        if (data['shot_' + ix] !== '*') {
          dailyShotCnt += parseInt(data['shot_' + ix]);
        }
      });

      const tmp = '<div style="display: grid; align-items: center; justify-items: center; width: 200px; height: 30px;';
      let titleOut = tmp + ' background-color: ' + colors[idx] + '">';
      let listDiv = '';

      if (idx === 0) {
        titleOut += '<span style="font-size: 12pt; font-weight: 500;"> SHOT';
        titleOut += '(' + vm.$n('' + dailyShotCnt) + ')';
        if (data.ct) {
          titleOut += ' - C/T(' + data.ct + ')';
        }
        titleOut += '</span></div>';
        listDiv += '<div style="width: 200px; background-color:' + colors[idx] + '; padding: 5px; opacity: 0.7;">';
        listDiv += '<ul>';
        _.map(new Array(10), function (el, i) {
          let ix = i + 1;
          if (data['shot_' + ix] !== 0) {
            listDiv += '<li>' + ix + ': SHOT(' + vm.$n(data['shot_' + ix]) + ')';
            if (data['ct_' + ix] !== 0) {
              listDiv += ' - C/T(' + data['ct_' + ix].toFixed(1) + ')</li>';
            } else {
              listDiv += '</li>';
            }
          }
        });
        listDiv += '</ul></div>';
      } else if (idx === 1) {
        titleOut += '<span style="font-size: 12pt; font-weight: 500;"> C/T';
        if (data.ct) {
          titleOut += '(' + data.ct + ')';
        }
        titleOut += ' - SHOT(' + vm.$n('' + dailyShotCnt) + ')';
        titleOut += '</span></div>';
        listDiv += '<div style="width: 200px; background-color: ' + colors[idx] + '; padding: 5px; opacity: 0.7;">';
        listDiv += '<ul>';
        _.map(new Array(10), function (el, i) {
          let ix = i + 1;
          if (data['ct_' + ix] !== 0) {
            listDiv += '<li>' + ix + ': C/T(' + data['ct_' + ix].toFixed(1) + ')';
            if (data['shot_' + ix] !== 0) {
              listDiv += ' - SHOT(' + vm.$n(data['shot_' + ix]) + ')</li>';
            } else {
              listDiv += '</li>';
            }
          }
        });
        listDiv += '</ul></div>';
      } else if (idx === 2) {
        titleOut += '<span style="font-size: 12pt; font-weight: 500;"> 온도';
        if (data.temp_current) {
          titleOut += '(' + data.temp_current + ')';
        }
        titleOut += '</span></div>';
        listDiv += '<div style="width: 200px; background-color: ' + colors[idx] + '; padding: 5px; opacity: 0.9;">';
        listDiv += '<ul>';
        _.map(new Array(5), function (el, i) {
          const ix = i + 1;
          if (data['temp_' + ix] !== 0) {
            listDiv += '<li>' + ix + ': ' + data['temp_' + ix] + '</li>';
          }
        });
        listDiv += '</ul></div>';
      }
      return titleOut + listDiv;
    },
    async getCdata() {
      try {
        if (this.day && this.counter) {
          const res = await Counter.getCdataByCounterAndData(this.counter, this.day);
          if (res && res.data) {
            const viewData = res.data;
            this.chartOptions = {
              ...this.chartOptions,
              ...{
                tooltip: {
                  shared: false,
                  intersect: false,
                  custom: function ({ seriesIndex, dataPointIndex }) {
                    // { series, seriesIndex, dataPointIndex, w }
                    if (viewData[dataPointIndex] && viewData[dataPointIndex].counter_id) {
                      return this.getRowData(seriesIndex, viewData[dataPointIndex], this);
                    }
                    return '';
                  }.bind(this),
                },
              },
            };
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.top_title {
  display: flex;
  align-items: center;
  align-content: center;
  // justify-content: space-between;
  padding-left: 19px;
  width: 1344px;
  height: 59px;
  background-color: #4640a1;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
}
</style>
