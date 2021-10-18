<template>
  <div>
    <apexchart
      type="bar"
      :height="chartOptions.chart.height"
      :width="chartOptions.chart.width"
      :options="chartOptions"
      :series="seriesData"
    ></apexchart>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import VueApexCharts from "vue3-apexcharts";
import { CHART } from '~/config';
const moldUseColors = ['#e66b5f', '#3c71f9', '#c058eb', '#77b52f', '#00da96'];

export default {
  name: 'MoldUsageChart',
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
          id: 'MoldUseChart',
          type: 'bar',
          redrawOnParentResize: true,
          width: '400px',
          offsetY: 5,
          events: {
            dataPointSelection: () => {
              // console.log(chart, e, opts);
              this.goToPage();
            },
          },
          toolbar: {
            show: false,
            // offsetY: 5,
          },
        },
        colors: moldUseColors,
        grid: CHART.GRID_OPTIONS,
        plotOptions: {
          bar: {
            columnWidth: '50%',
            distributed: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
        },
        legend: {
          show: false,
        },
        xaxis: {
          type: 'category',
          categories: ['전체금형수', '수신금형수', '휴식금형수', '보관금형수'],
          labels: {
            style: {
              colors: moldUseColors,
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
            seriesName: 'MoldUseCnt',
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
                if (parseInt(val) === 0) return '';
                return parseInt(val);
              },
            },
            title: {
              text: '금형수(개)',
              style: {
                color: CHART.LABEL_COLOR.Y,
              },
              offsetX: 3,
            },
          },
        ],
        tooltip: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
    })

    return {
      chartOptions, seriesData
    }
  }
};
</script>

<style lang="scss" scoped></style>
