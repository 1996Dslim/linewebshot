<template>
  <div>
    <apexchart type="bar" 
    :options="chartOptions" 
    :series="seriesData"></apexchart>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import VueApexCharts from 'vue3-apexcharts';
import { CHART } from '../../config';

export default {
  name: 'MoldOutputChart',
  props: {
    series: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    apexchart: VueApexCharts,
  },
  setup(props) {
    const seriesData = reactive(props.series);

    const chartOptions = reactive({
      chart: {
          id: 'MoldOutputChart',
          type: 'bar',
          redrawOnParentResize: true,
          offsetY: 5,
          stacked: false,
          events: {
            dataPointSelection: () => {
              this.goToPage();
            },
          },
          toolbar: {
            show: false,
          },
        },
        colors: [CHART.AXIS_COLOR.X],
        grid: {
          ...CHART.GRID_OPTIONS,
        },
        plotOptions: {
          bar: {
            columnWidth: '15%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        legend: {
          show: false,
        },
        xaxis: {
          type: 'category',
          categories: ['금형 생산량'],
          labels: {
            style: {
              colors: [CHART.AXIS_COLOR.X],
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
            seriesName: 'MoldOutputCnt',
            axisBorder: {
              show: true,
              color: CHART.LABEL_COLOR.Y,
            },
            axisTicks: {
              show: true,
              color: CHART.LABEL_COLOR.Y,
              width: 4,
            },
            labels: {
              style: {
                colors: [CHART.LABEL_COLOR.Y],
              },
              formatter: (val) => {
                if (isNaN(val) || val === Infinity) {
                  return 1;
                }
                return new Intl.NumberFormat().format(parseInt(val));
              },
            },
          },
        ],
        tooltip: {
          enabled: false,
        },
    });

    // this.chartOptions = {
    //   ...this.chartOptions,
    //   dataLabels: {
    //     enabled: true,
    //     formatter: function (val) {
    //       if (val === null || val === 0 || isNaN(val)) return '';
    //       // return this.$n(val);
    //       return new Intl.NumberFormat().format(parseInt(val));
    //     }.bind(this),
    //     offsetY: -20,
    //   },

    // goToPage() {
    //   this.$router.push({ name: 'total.indicator.output' });
    // },

    return {
      chartOptions, seriesData
    }
  }
};
</script>

<style lang="scss" scoped>
// ::v-deep .apexcharts-grid > rect {
//   // width: 220px;
//   fill: transparent;
// }
// ::v-deep text.apexcharts-xaxis-label {
//   transform: translate(10px, 0);
// }
// ::v-deep line.apexcharts-gridline {
//   stroke: none;
// }
</style>
