<template>
    <div class="chart">
        <YearMonth @renderCalendar="renderCalendar"/>  
    </div>
      <apexchart
        type="line"
        :height="chartOptions.chart.height"
        :options="chartOptions"
        :series="series"
      ></apexchart>
</template>

<script>
import YearMonth from "~/components/YearMonth.vue";
import _ from 'lodash';
import VueApexCharts from 'vue3-apexcharts';
import { reactive, ref } from '@vue/reactivity';
import { CHART } from '~/config';
import { computed } from '@vue/runtime-core';
import StatisticApi from "~/apis/statistic";

export default {
    props: {
        id: {
            type: Number,
            required: true,
        }
    },
    components: {
        apexchart: VueApexCharts,
        YearMonth
    },
    setup(props, {emit}) {
        const todayDate = new Date;
        const today = String(todayDate.getFullYear()) + String(("0" + (todayDate.getMonth())).slice(-2))
        const year = ref();
        const month = ref();
        const loading = ref(false);
        const selectedMonth = ref(null);
        const chartOptions = ref({
            chart: {
                type: 'line',
                redrawOnParentResize: true,
                stacked: false,
                height: 500,
                // locales: [require('apexcharts/dist/locales/en.json'), require('apexcharts/dist/locales/ko.json')],
                // defaultLocale: 'ko',
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
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
            markers: {
                size: [4, 4, 4, 4, 4],
            },
            colors: CHART.X_COLORS,
            stroke: {
                width: [3, 3, 3, 1, 1],
                curve: 'smooth',
            },
            fill: {
                type: 'solid',
                opacity: [1, 1, 1, 0.3, 1],
            },
            tooltip: {
                y: {
                    formatter: function (value, { seriesIndex }) {
                    if (isNaN(value) || value === 0) {
                        return '';
                    }
                    if (seriesIndex === 3) {
                        return value;
                    }
                    if (seriesIndex === 4) {
                        return value;
                    }
                    return value + '%';
                    }
                },
            },
            xaxis: {
                type: 'category',
                categories: [],
            },
            yaxis: [
                {
                    title: {
                    // text: '률 (%)',
                    // offsetX: -7,
                    style: {
                        color: CHART.AXIS_COLOR.X,
                        fontSize: '12px',
                    },
                    },
                    labels: {
                    // offsetX: -7,
                    style: {
                        colors: CHART.AXIS_COLOR.X,
                    },
                    formatter: (val) => {
                        return val + '%';
                    },
                    },
                    axisBorder: {
                    show: true,
                    color: CHART.AXIS_COLOR.X,
                    },
                },
                { show: false },
                { show: false },
                { show: false },
                { show: false },
                {
                    opposite: true,
                    title: {
                    text: 'SHOT 수',
                    style: {
                        color: CHART.X_COLORS[3],
                        fontSize: '10px',
                    },
                    },
                    labels: {
                        style: {
                            colors: CHART.X_COLORS[3],
                        },
                        formatter: (val) => {
                            return val;
                        },
                    },
                    axisBorder: {
                        show: true,
                        color: CHART.X_COLORS[3],
                    },
                },
                {
                    opposite: true,
                    title: {
                    text: 'C/T',
                    style: {
                        color: CHART.X_COLORS[4],
                        fontSize: '10px',
                    },
                    },
                    labels: {
                        style: {
                            colors: CHART.X_COLORS[4],
                        },
                        formatter: (val) => {
                            return val.toFixed(1);
                        },
                    },
                    axisBorder: {
                        show: true,
                        color: CHART.X_COLORS[4],
                    },
                },
            ],
            tooltip: {
                style: {
                    fontSize: '10pt',
                },
            }
        });
        console.log("first", props.id);
        
        const series = ref([]);
        
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        
        //renderCalendar();
        function renderCalendar(testyear, testmonth) {
            year.value = testyear;
            month.value = testmonth;
            chartOptions.value.xaxis.categories.splice(0);
            findSeries();
        }

        async function findSeries() {
            loading.value = true;
            selectedMonth.value = String(year.value) + "-" + String(("0" + (month.value)).slice(-2))//this.$moment(this.selectedMonth, 'YYYY-MM');
            
            //console.log('This selected month...', selectedMonth.value);

            const yyyymm = selectedMonth.value.replace('-', '');
            const yyyy = parseInt(selectedMonth.value.split('-')[0]);
            const mm = parseInt(selectedMonth.value.split('-')[1]);
            let lastDay = new Date(yyyy, mm, 0).getDate() + 1;
            //console.log('yyyymm, yyyy, mm, lastDay', yyyymm, yyyy, mm, lastDay)

            const labels = _.range(parseInt('01'), parseInt(lastDay)).map((dt) => {
                //console.log(String(("0" + (mm)).slice(-2)) + "-" + String(("0" + (dt)).slice(-2)));
                return String(("0" + (mm)).slice(-2)) + "-" + String(("0" + (dt)).slice(-2))
            });
            console.log(labels)

            series.value = [
                {
                    name: '가동률',
                    type: 'line',
                    data: [],
                },
                {
                    name: 'C/T준수율',
                    type: 'line',
                    data: [],
                },
                {
                    name: '생산률',
                    type: 'line',
                    data: [],
                },
                {
                    name: 'SHOT 수',
                    type: 'column',
                    data: [],
                },
                {
                    name: 'C/T',
                    type: 'column',
                    data: [],
                },
            ];
            const res = await StatisticApi.findMoldUsageIndicatorByMoldAndMonth(yyyymm, props.id); //this.id
                
            if (res && res.data) {
                _.range(parseInt(yyyymm + '01'), parseInt(yyyymm + '' + lastDay)).forEach((dt) => {
                    let isExists = false;
                    for (let i = 0; i < res.data.length; i++) {
                        const d = res.data[i];
                        if (!d.receivedDate) continue;
                        if (dt === parseInt(d.receivedDate)) {
                            series.value[0].data.push(d.activeRate);
                            series.value[1].data.push(d.ctRate);
                            series.value[2].data.push(d.outputRate);
                            series.value[3].data.push(d.shotCount);
                            series.value[4].data.push(d.ct);
                            isExists = true;
                            break;
                        }
                    }
                    if (!isExists) {
                        series.value[0].data.push(0); // 가동률
                        series.value[1].data.push(0); // C/T 준수율
                        series.value[2].data.push(0); // 생산률
                        series.value[3].data.push(0); // SHOT 수
                        series.value[4].data.push(0); // C/T
                    }
                });
            }
            
            loading.value = false;
        }

        return {
            chartOptions, renderCalendar, series
            
        }
    }
}
</script>