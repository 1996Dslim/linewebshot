<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal-main" >
            <div class="modal-head">
                <span class="title">상세 그래프</span>
                <YearMonth/>
                <div class="btn" @click="$emit('close-modal')">
                    <span>닫 기</span>
                </div>
            </div>
            <div class="modal-body" style="height: 500px;">
                <apexchart type="line" 
                :height="chartOptions.chart.height" 
                :options="chartOptions" 
                :series="seriesData"></apexchart>
            </div>
        </div>
    </div>
</template>

<script>
import YearMonth from "~/components/YearMonth.vue";
import _ from 'lodash';
import VueApexCharts from 'vue3-apexcharts';

import { CHART } from '~/config';

import CounterApi from '~/apis/counter';
import { ref } from '@vue/reactivity';

const colors = ['#0ccb8f', '#8453ff', '#d94785'];

export default {
    name: "ChartModal",
    props: {
        series: {
            type: Array,
            default: () => {
                return [];
            },
        },
        title: {
            type: String,
        },
        day: {
            type: String,
        },
        counter: {
            type: String,
        },
    },
    components: {
        YearMonth,
        apexchart: VueApexCharts,
    },
    setup(props) {
        console.log("props.series",props.series)
        console.log("props.day",props.day)
        console.log("props.counter",props.counter)

        const seriesData = ref([
            {
                name: 'SHOT COUNT',
                type: 'line',
                data: [],
            },
            {
                name: 'C/T',
                type: 'column',
                data: [],
            },
            {
                name: '온도',
                type: 'column',
                data: [],
            },
        ]);

        const chartOptions = ref({
            chart: {
                type: 'line',
                stacked: false,
                redrawOnParentResize: true,
                height: '97%',
                width: '97%',
                toolbar: {
                    show: true,
                    offsetY: 10,
                },
            },
            stroke: {
                width: [4, 1, 1],
                curve: 'smooth',
            },
            plotOptions: {
                bar: {
                    columnWidth: '80%',
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
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 5,
            },
            colors: colors,
            tooltip: {
                shared: false,
                intersect: false,
                custom: null
            },
            xaxis: {
                type: 'category',
                categories: [],
                labels: {
                    style: {
                    colors: CHART.LABEL_COLOR.X,
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
                seriesName: 'ShotCount',
                axisBorder: {
                    show: true,
                    color: colors[0],
                },
                axisTicks: {
                    show: true,
                    color: colors[0],
                    width: 4,
                },
                labels: {
                    style: {
                        colors: [colors[0]],
                    },
                    formatter: (val) => {
                        if (val && val === 0) return 0;
                        return new Intl.NumberFormat().format(parseInt(val));
                    },
                },
            },
            {
                seriesName: 'CT',
                opposite: true,
                axisBorder: {
                    show: true,
                    color: colors[1],
                },
                axisTicks: {
                    show: true,
                    color: colors[1],
                    width: 4,
                },
                labels: {
                    style: {
                        colors: [colors[1]],
                    },
                },
            },
            {
                seriesName: 'Temp',
                opposite: true,
                axisBorder: {
                    show: true,
                    color: colors[2],
                },
                axisTicks: {
                    show: true,
                    color: colors[2],
                    width: 4,
                },
                labels: {
                    style: {
                        colors: [colors[2]],
                    },
                },
            },
            ],
        })

        const cate = [];
        console.log("seriesData",seriesData.value);
        props.series.forEach((item) => {
            cate.push(item.shotHour);
            seriesData.value[0].data.push(item.shotCount);
            seriesData.value[1].data.push(item.ct);
            seriesData.value[2].data.push(item.temp);
        });

        chartOptions.value.xaxis.categories = cate;
        //console.log("cata", cata.value)
        console.log("chartOptions",chartOptions.value.xaxis.categories)

        function getRowData(idx, data, vm) {
            if (!data || !data.counter_id) {
                return;
            }

            let dailyShotCnt = 0;
            _.map(new Array(10), function (el, i) {
                let ix = i + 1;
                if (data['shot_' + ix] !== '*') {
                dailyShotCnt += parseInt(data['shot_' + ix]);
                }
            });

            const tmp = '<div style="display: grid; align-items: center; justify-items: center; width: 200px; height: 30px;';
            let titleOut = tmp + ' background-color: ' + colors[idx] + '">';
            let listDiv = '';

            if (idx === 0) {
                titleOut += '<span style="font-size: 12pt; font-weight: 500;"> SHOT';
                titleOut += '(' + vm.$n('' + dailyShotCnt) + ')';
                if (data.ct) {
                    titleOut += ' - C/T(' + data.ct + ')';
                }
                titleOut += '</span></div>';
                listDiv += '<div style="width: 200px; background-color:' + colors[idx] + '; padding: 5px; opacity: 0.7;">';
                listDiv += '<ul>';
                _.map(new Array(10), function (el, i) {
                    let ix = i + 1;
                    if (data['shot_' + ix] !== 0) {
                        listDiv += '<li>' + ix + ': SHOT(' + vm.$n(data['shot_' + ix]) + ')';
                        if (data['ct_' + ix] !== 0) {
                            listDiv += ' - C/T(' + data['ct_' + ix].toFixed(1) + ')</li>';
                        } else {
                            listDiv += '</li>';
                        }
                    }
                });
                listDiv += '</ul></div>';
            } else if (idx === 1) {
                titleOut += '<span style="font-size: 12pt; font-weight: 500;"> C/T';
                if (data.ct) {
                    titleOut += '(' + data.ct + ')';
                }
                titleOut += ' - SHOT(' + vm.$n('' + dailyShotCnt) + ')';
                titleOut += '</span></div>';
                listDiv += '<div style="width: 200px; background-color: ' + colors[idx] + '; padding: 5px; opacity: 0.7;">';
                listDiv += '<ul>';
                _.map(new Array(10), function (el, i) {
                let ix = i + 1;
                    if (data['ct_' + ix] !== 0) {
                        listDiv += '<li>' + ix + ': C/T(' + data['ct_' + ix].toFixed(1) + ')';
                        if (data['shot_' + ix] !== 0) {
                            listDiv += ' - SHOT(' + vm.$n(data['shot_' + ix]) + ')</li>';
                        } else {
                            listDiv += '</li>';
                        }
                    }
                });
                listDiv += '</ul></div>';
            } else if (idx === 2) {
                titleOut += '<span style="font-size: 12pt; font-weight: 500;"> 온도';
                if (data.temp_current) {
                    titleOut += '(' + data.temp_current + ')';
                }
                titleOut += '</span></div>';
                listDiv += '<div style="width: 200px; background-color: ' + colors[idx] + '; padding: 5px; opacity: 0.9;">';
                listDiv += '<ul>';
                _.map(new Array(5), function (el, i) {
                const ix = i + 1;
                    if (data['temp_' + ix] !== 0) {
                        listDiv += '<li>' + ix + ': ' + data['temp_' + ix] + '</li>';
                    }
                });
                listDiv += '</ul></div>';
            }
            return titleOut + listDiv;
        }

        getCdata();
        async function getCdata() {
            try {
                if (props.day && props.counter) {
                    const res = await CounterApi.getCdataByCounterAndData(props.counter, props.day);
                    if (res && res.data) {
                        console.log("chart", res.data);
                        const viewData = res.data;
                        console.log("chartOptions.value.tooltip.custom", chartOptions.value.tooltip.custom)
                        
                        // chartOptions.value.tooltip.custom = function ({ seriesIndex, dataPointIndex }) {
                        //         if (viewData[dataPointIndex] && viewData[dataPointIndex].counter_id) {
                        //             return this.getRowData(seriesIndex, viewData[dataPointIndex], this);
                        //         }
                        //         return '';
                        //     }.bind(this)
                        // console.log("chartOptions.value.tooltip.custom", chartOptions.value.tooltip.custom)
                        // this.chartOptions = {
                        // ...this.chartOptions,
                        // ...{
                        //     tooltip: {
                        //     shared: false,
                        //     intersect: false,
                        //     custom: function ({ seriesIndex, dataPointIndex }) {
                        //         // { series, seriesIndex, dataPointIndex, w }
                        //         if (viewData[dataPointIndex] && viewData[dataPointIndex].counter_id) {
                        //         return this.getRowData(seriesIndex, viewData[dataPointIndex], this);
                        //         }
                        //         return '';
                        //     }.bind(this),
                        //     },
                        // },
                        // };
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        return {
            chartOptions, seriesData
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/chartmodal.scss";
</style>