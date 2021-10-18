<template>
  <div>
    <apexchart
      type="bar"
      :height="ctComplianceOpts.chart.height"
      :width="ctComplianceOpts.chart.width"
      :options="ctComplianceOpts"
      :series="ctComplianceSeries"
    ></apexchart>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import VueApexCharts from 'vue3-apexcharts';
import { CHART } from '../../config';
const ctColors = ['#ff6050', '#16a8a8', '#8453ff'];

export default {
  name: 'CtComplianceChart',
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
    const ctComplianceSeries = reactive(props.series);

    const ctComplianceOpts = reactive({
      chart: {
          id: 'CtComplianceChart',
          type: 'bar',
          redrawOnParentResize: true,
          // height: '90%',
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
        colors: ctColors,
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
          categories: ['데이터 수집 금형', '기준 C/T 범위 이내', '기준 C/T 초과', '기준 C/T 미만'],
          labels: {
            style: {
              colors: ctColors,
              fontSize: '10px',
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
            seriesName: 'CtComplianceCnt',
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
                if (isNaN(parseInt(val))) {
                  return 0;
                }
                return parseInt(val);
              },
            },
            title: {
              text: '금형수(개)',
              style: {
                color: CHART.AXIS_COLOR.X,
              },
              offsetX: 3,
            },
          },
        ],
        tooltip: {
          enabled: false,
        },
    })

    // goToPage() {
    //   this.$router.push({ name: 'total.indicator.ct' });
    // },

    return {
      ctComplianceSeries, ctComplianceOpts
    }
  }
};
</script>

<style lang="scss" scoped></style>
