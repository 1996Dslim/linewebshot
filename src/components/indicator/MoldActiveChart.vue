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
import VueApexCharts from 'vue3-apexcharts';
import { CHART } from '../../config';
const moldActColors = ['#ff6050', '#16a8a8', '#8453ff'];

export default {
  name: 'MoldActiveChart',
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
          id: 'MoldActChart',
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
        colors: moldActColors,
        grid: CHART.GRID_OPTIONS,
        plotOptions: {
          bar: {
            columnWidth: '15%',
            // distributed: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          formatter: (val) => {
            return Math.round(val * 100) / 100 + ' %';
          },
        },
        legend: {
          show: false,
        },
        xaxis: {
          type: 'category',
          categories: ['금형 가동률'],
          labels: {
            style: {
              colors: moldActColors,
              fontSize: '12px',
            },
          },
          axisBorder: {
            show: true,
            color: CHART.AXIS_COLOR.X,
          },
          axisTicks: {
            show: true,
            color: CHART.AXIS_COLOR.X,
            height: 4,
          },
        },
        yaxis: [
          {
            seriesName: 'MoldActRate',
            axisBorder: {
              show: true,
              color: CHART.AXIS_COLOR.X,
            },
            axisTicks: {
              show: true,
              color: CHART.AXIS_COLOR.X,
              width: 4,
            },
            labels: {
              style: {
                colors: [CHART.AXIS_COLOR.X],
              },
              formatter: (val) => {
                return Math.round(val * 100) / 100 + ' %';
              },
            },
          },
        ],
        tooltip: {
          enabled: false,
        },
    })

    // goToPage() {
    //   this.$router.push({ name: 'total.indicator.active' });
    // }

    return {
      seriesData, chartOptions
    }
  }
};
</script>

<style lang="scss" scoped></style>
