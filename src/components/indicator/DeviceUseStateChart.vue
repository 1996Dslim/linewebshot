<template>
  <div>
    <apexchart type="radialBar" 
    :options="chartOptions" 
    :series="seriesData"></apexchart>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'DeviceUseStateChart',
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
    console.log("cir",seriesData);
    console.log("props",props.setup)
    const chartOptions = reactive({
      chart: {
          type: 'radialBar',
          redrawOnParentResize: true,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 5,
              size: '52%',
              background: '#fff',
            },
            track: {
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                blur: 4,
                opacity: 0.15,
              },
            },
            dataLabels: {
              show: true,
              name: {
                offsetY: 30,
                show: true,
                color: '#888',
                fontSize: '15px',
              },
              value: {
                offsetY: -10,
                color: '#111',
                fontSize: '28px',
                fontWeight: 'bold',
                show: true,
              },
            },
          },
        },
        grid: {
          padding: {
            top: -20,
            bottom: -20,
            left: -30,
            right: 0,
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        labels: ['수신율'],
      });

      return {
        seriesData, chartOptions
      }
  }
};
</script>

<style lang="scss" scoped></style>
