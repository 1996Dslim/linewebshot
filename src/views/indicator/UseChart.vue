<template>
    <div class="nav">
            <div>종합지표 > 금형 사용지표</div>
            <span>금형 사용지표</span> 
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
                width: [4, 1, 1, 1, 3],
                curve: 'smooth',
            },
            tooltip: {
                y: {
                    formatter: function (value, { seriesIndex }) {
                    if (!value || value === null || isNaN(value)) {
                        return '-';
                    }
                    if (seriesIndex === 4) {
                        // 금형 사용률
                        return value + '%';
                    }
                    return new Intl.NumberFormat().format(parseInt(value));
                    },
                },
            },
            xaxis: {
                type: 'category',
                categories: [],
            },
            yaxis: [
                {
                    min: 0,
                    title: {
                        text: '금형 수',
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
                            if (!val || val === null) return '-';
                            return new Intl.NumberFormat().format(parseInt(val));
                        },
                    },
                    axisBorder: {
                        show: true,
                        color: CHART.LABEL_COLOR.Y,
                    },
                },
                { show: false },
                { show: false },
                { show: false },
                {
                    opposite: true,
                    title: {
                        text: '사용률',
                        // offsetX: -7,
                        style: {
                            color: CHART.X_COLORS[4],
                            fontSize: '10px',
                        },
                    },
                    labels: {
                        // offsetX: -7,
                        style: {
                            colors: CHART.X_COLORS[4],
                        },
                        formatter: (val) => {
                            if (!val || val === null) return '-';
                            return val + '%';
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
            // Dashboard > 금형 사용지표
            series.value = [
                {
                    name: '전체 금형 수',
                    type: 'line',
                    data: [],
                },
                {
                    name: '가동 금형 수',
                    type: 'column',
                    data: [],
                },
                {
                    name: '휴식 금형 수',
                    type: 'column',
                    data: [],
                },
                {
                    name: '보관 금형 수',
                    type: 'column',
                    data: [],
                },
                {
                    name: '금형 사용률',
                    type: 'line',
                    data: [],
                },
            ];
            const res = await StatisticApi.findDailyUsageIndicatorByMonth(yyyymm, user.value.companyId);
            if (res && res.data) {
            const dataSize = res.data.length;
                if (dataSize === 0) {
                    _.range(parseInt(yyyymm + '01'), parseInt(yyyymm + '' + (new Date(yyyy, mm, 0).getDate() + 1))).forEach(
                    () => {
                        _.range(5).forEach((d) => series.value[d].data.push(null));
                    }
                    );
                } 
                else {
                    let isCurrMonth = yyyymm //=== this.$moment().format('YYYYMM');
                    let endDt = parseInt(yyyymm + '' + (new Date(yyyy, mm, 0).getDate() + 1));
                    // if (isCurrMonth) {
                    //     endDt = parseInt(this.$moment().format('YYYYMMDD'));
                    // }
                    let totalCnt = 0;
                    _.range(parseInt(yyyymm + '01'), parseInt(yyyymm + '' + (new Date(yyyy, mm, 0).getDate() + 1))).forEach(
                    (dt) => {
                        let isExists = false;
                        for (let i = 0; i < dataSize; i++) {
                            if (dt === parseInt(res.data[i].indicator_date)) {
                                if (parseInt(res.data[i].total_cnt) > 0) {
                                    totalCnt = parseInt(res.data[i].total_cnt);
                                }
                                series.value[0].data.push(totalCnt);
                                series.value[1].data.push(res.data[i].act_cnt);
                                series.value[2].data.push(res.data[i].idle_cnt);
                                series.value[3].data.push(res.data[i].unused_cnt);
                                series.value[4].data.push(res.data[i].use_rate);
                                isExists = true;
                                break;
                            }
                        }
                        if (!isExists) {
                            if (isCurrMonth && dt > endDt) {
                                series.value[0].data.push(null);
                            } else if (totalCnt > 0) {
                                series.value[0].data.push(totalCnt);
                            } else {
                                series.value[0].data.push(null);
                            }
                            series.value[1].data.push(null);
                            series.value[2].data.push(null);
                            series.value[3].data.push(null);
                            series.value[4].data.push(null);
                        }
                    });
                }
            }
        }

        return {
            series, chartOptions, renderCalendar
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