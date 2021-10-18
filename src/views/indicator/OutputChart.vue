<template>
    <div class="nav">
            <div>종합지표 > 금형 생산지표</div>
            <span>금형 생산지표</span> 
    </div>

    <div class="head">
        <YearMonth @renderCalendar="renderCalendar"/>
    </div>
    <div>
        <apexchart
        type="line"
        :height="chartOptions.chart.height"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
    <div style="color: #fff">
        {{chartOptions.chart.height}}
    </div>
</template>

<script>
import YearMonth from "~/components/YearMonth.vue";
//import IndicatorChart from "~/components/modal/indicator/IndicatorChart.vue";
import _ from 'lodash';
import VueApexCharts from 'vue3-apexcharts';
import { reactive, ref } from '@vue/reactivity';
import { CHART } from '~/config';
import StatisticApi from "~/apis/statistic";
import { computed } from '@vue/runtime-core';
import { useStore } from "vuex";

export default {
    components: {
        apexchart: VueApexCharts,
        YearMonth
    },
    setup() {
        const store = useStore();
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
                    width: [1, 1, 3],
                    curve: 'smooth',
                },
            tooltip: {
                y: {
                    formatter: function (value, { seriesIndex }) {
                        if (!value || value === null || isNaN(value)) {
                            value = 0;
                        }
                        if (seriesIndex === 2) {
                            return value + '%';
                        }
                        return new Intl.NumberFormat().format(parseInt(value));
                    },
                },
            },
            xaxis: {
                type: 'category',
                categories: [],   //labels
                style: {
                    fontSize: '12px',
                },
                labels: {
                    style: {
                    colors: CHART.LABEL_COLOR.Y,
                    // fontSize: '12px',
                    },
                },
                axisBorder: {
                    show: true,
                    color: CHART.LABEL_COLOR.Y,
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: [
                {
                    title: {
                        text: '생산량, 조정생산량',
                        style: {
                            color: CHART.LABEL_COLOR.Y,
                            fontSize: '10px',
                        },
                    },
                    labels: {
                        style: {
                            colors: [CHART.LABEL_COLOR.Y],
                        },
                        formatter: (val) => {
                            return new Intl.NumberFormat().format(parseInt(val));
                        },
                    },
                    axisBorder: {
                        show: true,
                        color: CHART.LABEL_COLOR.Y,
                    },
                },
                { show: false },
                {
                    opposite: true,
                    title: {
                        text: '일별생산율',
                        style: {
                            color: CHART.X_COLORS[2],
                            fontSize: '10px',
                        },
                    },
                    labels: {
                        style: {
                            colors: CHART.X_COLORS[2],
                        },
                        formatter: (val) => {
                            return val + '%';
                        },
                    },
                    axisBorder: {
                        show: true,
                        color: CHART.X_COLORS[2],
                    },
                },
            ],
            tooltip: {
                style: {
                    fontSize: '10pt',
                },
            }
        });
        console.log("first",chartOptions);
        const series = ref([]);

        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        function renderCalendar(testyear, testmonth) {
            year.value = testyear;
            month.value = testmonth;
            chartOptions.value.xaxis.categories.splice(0);
            findSeries();
        }

        async function findSeries() {
            loading.value = true;
            selectedMonth.value = String(year.value) + "-" + String(("0" + (month.value)).slice(-2))//this.$moment(this.selectedMonth, 'YYYY-MM');
            
            console.log('This selected month...', selectedMonth.value);

            const yyyymm = selectedMonth.value.replace('-', '');
            const yyyy = parseInt(selectedMonth.value.split('-')[0]);
            const mm = parseInt(selectedMonth.value.split('-')[1]);
            let lastDay = new Date(yyyy, mm, 0).getDate() + 1;

            const labels = _.range(parseInt('01'), parseInt(lastDay)).map((dt) => {
                return String(("0" + (mm)).slice(-2)) + "-" + String(("0" + (dt)).slice(-2))
            });

            labels.forEach(dt => {
                chartOptions.value.xaxis.categories.push(dt);
            })
           
            
            // 금형 > 생산관리 지표 (output indicator), Dashboard > 금형 생산지표
            series.value = [
                    {
                        name: '생산량',
                        type: 'column',
                        data: [],
                    },
                    {
                        name: '조정생산량',
                        type: 'column',
                        data: [],
                    },
                    {
                        name: '일별생산률',
                        type: 'line',
                        data: [],
                    },
                ];
            
            // Dashboard > 금형 생산지표
            const res = await StatisticApi.findMoldOutputIndicatorByMonth(yyyymm, user.value.companyId);
            if (res.data) {
                res.data.forEach((d) => {
                    series.value[0].data.push(d.outputCnt);
                    series.value[1].data.push(isNaN(d.adjustedOutputCnt) ? 0 : d.adjustedOutputCnt);
                    series.value[2].data.push(d.dailyOutputRate ? d.dailyOutputRate : 0);
                });
            }
            
            console.log("last",chartOptions);
        }

        return {
            chartOptions, series,
            renderCalendar
        }
    }
}
</script>


<style lang="scss" scoped>
    .nav {
        margin-bottom: 15px;
        color: #8495fe;
        margin-bottom: 38px;
        div {
            margin-bottom: 13px;
            font-size: 12px;
        }
        span {
            width: 178px;
            height: 24px;
            font-size: 26px;
            font-weight: 500;
            color: #e9ecff;
        }   
    }

    .head {
        border: 1px solid #1d2a80;
    }
</style>