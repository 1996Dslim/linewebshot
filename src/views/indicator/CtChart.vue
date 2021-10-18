<template>
    <div class="nav">
            <div>종합지표 > C/T 준수지표</div>
            <span>C/T 준수지표</span> 
    </div>

    <div class="head">
        <YearMonth @renderCalendar="renderCalendar"/>
    </div>
    <div>
        <apexchart
        type="line"
        :height="500"
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
import { reactive, ref, toRefs } from '@vue/reactivity';
import { CHART } from '~/config';
import StatisticApi from "~/apis/statistic";
import { computed, onBeforeUpdate } from '@vue/runtime-core';
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
            toolbar: {
                show: false,
                offsetX: 0,
                offsetY: 0,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true | '<img src="/static/icons/reset.png" width="20">',
                    customIcons: [],
                },
                export: {
                    csv: {
                        filename: undefined,
                        columnDelimiter: ',',
                        headerCategory: 'category',
                        headerValue: 'value',
                        dateFormatter(timestamp) {
                            return new Date(timestamp).toDateString();
                        },
                    },
                    svg: {
                        filename: undefined,
                    },
                    png: {
                        filename: undefined,
                    },
                },
                autoSelected: 'zoom',
            },
            stroke: {
                width: [3, 1, 1, 1, 1],
                curve: 'smooth',
            },
            tooltip: {
                y: {
                    formatter: function (value) {
                        if (value === null || isNaN(value)) {
                            return '-';
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
                    title: {
                    text: '',
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
            ],
        });
        //console.log("first",chartOptions);
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

            // Dashboard > C/T 준수지표
            series.value = [
                {
                    name: '전체 금형 수',
                    type: 'line',
                    data: [],
                },
                {
                    name: '데이터 수신 금형 수',
                    type: 'column',
                    data: [],
                },
                {
                    name: '기준 C/T 범위 내',
                    type: 'column',
                    data: [],
                },
                {
                    name: '기준 C/T 초과',
                    type: 'column',
                    data: [],
                },
                {
                    name: '기준 C/T 미만',
                    type: 'column',
                    data: [],
                },
            ];
            const res = await StatisticApi.findDailyCtComplianceIndicatorByMonth(yyyymm, user.value.companyId);
            if (res && res.data) {
                console.log(res.data.length);
                if (res.data.length === 0) {
                    _.range(parseInt(yyyymm + '01'), parseInt(yyyymm + '' + (new Date(yyyy, mm, 0).getDate() + 1))).forEach(
                    () => {
                        _.range(5).forEach((d) => series.value[d].data.push(null));
                    }
                    );
                } 
                else {
                    let isCurrMonth = yyyymm //=== this.$moment().format('YYYYMM');
                    let endDt = parseInt(yyyymm + '' + (new Date(yyyy, mm, 0).getDate() + 1));
                    console.log(endDt);
                    // if (isCurrMonth) {
                    //     endDt = parseInt(this.$moment().format('YYYYMMDD'));
                    // }
                    let totalCnt = 0;
                    _.range(parseInt(yyyymm + '01'), parseInt(yyyymm + '' + (new Date(yyyy, mm, 0).getDate() + 1))).forEach((dt) => {
                            let isExists = false;
                            for (let i = 0; i < res.data.length; i++) {
                                if (dt === parseInt(res.data[i].shot_last_dt)) {
                                    if (parseInt(res.data[i].total_cnt) > 0) {
                                        totalCnt = parseInt(res.data[i].total_cnt);
                                    }
                                    series.value[0].data.push(totalCnt);
                                    series.value[1].data.push(res.data[i].comm_cnt);
                                    series.value[2].data.push(res.data[i].within);
                                    series.value[3].data.push(res.data[i].over);
                                    series.value[4].data.push(res.data[i].under);
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
                        }
                    );
                }
            }

        };
        
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