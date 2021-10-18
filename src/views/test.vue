<template>
    <div class="nav">
            <div>종합지표 > 금형 가동지표</div>
            <span>금형 test</span> 
    </div>

    <div class="head">
        <YearMonth @renderCalendar="renderCalendar"/>
    </div>
    <div>
        <apexchart
        type="bar"
        :height="barChartOptions.chart.height"
        :options="barChartOptions"
        :series="series"
      ></apexchart>
    </div>
    <div style="color: #fff">
        {{barChartOptions.xaxis.categories}}
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
import { computed, onBeforeUpdate, onUpdated } from '@vue/runtime-core';
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
        

        const barChartOptions = ref({
            chart: {
                type: 'bar',
                redrawOnParentResize: true,
                height: 500,
            },
            plotOptions: {
                bar: {
                    columnWidth: '55%',
                    dataLabels: {
                    position: 'top',
                    },
                },
            },
            grid: CHART.GRID_OPTIONS,
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    if (val && !isNaN(val)) {
                        return val + '%';
                    }
                    return '';
                },
                offsetY: -20,
            },
            colors: CHART.X_COLORS,
            xaxis: {
                type: 'category',
                categories: [],
                style: {
                    fontSize: '12px',
                },
                labels: {
                    style: {
                    colors: CHART.LABEL_COLOR.Y,
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
            yaxis: {
                seriesName: 'MoldActRate',
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
                        return Math.round(val * 100) / 100 + ' %';
                    },
                },
                title: {
                    text: '가동률(%)',
                    style: {
                    color: CHART.LABEL_COLOR.Y,
                    },
                    offsetX: 3,
                },
            },
            tooltip: {
                style: {
                    fontSize: '10pt',
                },
            },
        });
        console.log("first", barChartOptions.value);

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
            console.log("button", barChartOptions.value.xaxis.categories.splice(0))
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
                //barChartOptions.value.xaxis.categories.push(String(("0" + (mm)).slice(-2)) + "-" + String(("0" + (dt)).slice(-2)))
                return String(("0" + (mm)).slice(-2)) + "-" + String(("0" + (dt)).slice(-2))
            });

            labels.forEach(dt => {
                barChartOptions.value.xaxis.categories.push(dt);
            })

           
            // Dashboard > 금형 가동지표
            series.value = [
                {
                    name: '가동률',
                    data: [],
                },
            ];
            const res = await StatisticApi.findDailyActiveIndicatorByMonth(yyyymm, user.value.companyId);
            if (res && res.data) {
                _.range(parseInt(yyyymm + '01'), parseInt(yyyymm + '' + (new Date(yyyy, mm, 0).getDate() + 1))).forEach(
                    (dt) => {
                        let isExists = false;
                        for (let i = 0; i < res.data.length; i++) {
                            const d = res.data[i];
                            if (dt === parseInt(d.indicator_date)) {
                                series.value[0].data.push(d.act_rate);
                                isExists = true;
                                break;
                            }
                        }
                        if (!isExists) {
                            series.value[0].data.push(0);
                        }
                    }
                );
            }
            //console.log(series.value);
            // barChartOptions.value = {
            // ...barChartOptions,
            // ...{
            //         xaxis: {
            //             type: 'category',
            //             categories: labels,
            //         },
            //     },
            // }
            //barChartOptions.value.xaxis.categories = labels;
            
            // let { xaxis } = toRefs(barChartOptions);
            // xaxis.value.categories = labels
            //console.log("xaxis",xaxis.value.categories);
            //barChartOptions.xaxis.categories = labels;
            console.log("labels", labels);
            console.log("change",barChartOptions.value.xaxis.categories)
            
        }

        onUpdated(() => {
            barChartOptions.value.xaxis.categories.push()
        })

        return {
            barChartOptions, series,
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