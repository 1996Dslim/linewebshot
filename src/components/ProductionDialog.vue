<template>
    <div class="dialog" @click.self="$emit('close-modal')">
        <div class="dialog_main" >
            <div class="dialog_head">
                <span class="title">상세내역</span>
                <YearMonth/>
                <span class="title">CAVITY : {{cavity}}</span>
            </div>
            <div class="dialog_body">
                <div class="table_div" v-if="items">
                    <table v-for="i in 2" :key="i">
                        <thead>
                            <tr>
                                <th>시간</th>
                                <th>SHOT</th>
                                <th>생산량</th>
                                <th>조정생산량</th>
                                <th>C/T</th>
                            </tr>
                        </thead>
                        <tbody v-if="i === 1">
                            <tr v-for="data, index in amData" :key="index">
                                <td><span>{{ data.shotHour }}</span></td>
                                <td><span>{{ data.shotCount }}</span></td>
                                <td><span>{{ data.shotOutput }}</span></td>
                                <td><input :value="data.adjustedOutput"></td>
                                <td><span>{{ data.ct }}</span></td>
                            </tr>                            
                        </tbody>
                        <tbody v-if="i === 2">
                            <tr v-for="data, index in pmData" :key="index">
                                <td><span>{{ data.shotHour }}</span></td>
                                <td><span>{{ data.shotCount }}</span></td>
                                <td><span>{{ data.shotOutput }}</span></td>
                                <td><input value=0></td>
                                <td><span>{{ data.ct }}</span></td>
                            </tr>                            
                        </tbody>
                        <tfoot>
                            <tr v-if="i === 1">
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr v-if="i === 2">
                                <th>합계</th>
                                <th>{{foots.shotCount}}</th>
                                <th>{{foots.shotOutput}}</th>
                                <th>{{foots.adjustedOutput}}</th>
                                <th>{{foots.ct}}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="btnarea">
                    <div class="btn medium" @click="$emit('close-modal')">
                        <span>닫기</span>
                    </div>
                    <div class="btn medium" @click="$emit('close-modal')">
                        <span>저장</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import YearMonth from "~/components/YearMonth.vue";
import StatisticApi from "~/apis/statistic";
import { computed, onBeforeUpdate, onUpdated } from '@vue/runtime-core';

export default {
    name: "ChartModal",
    props: {
        id:Number,
        day: {
            type: String,
        },
    },
    components: {
        YearMonth
    },
    setup(props) {
        const temp = 0;
        const time = 0;
        const items = ref([]);
        const columns = ref([]);
        const foots = ref();
        const viewDate = ref(props.day);
        const cavity = ref(null);
        const counterId = ref(null);
        console.log("props.day",props.day);
        // onBeforeUpdate(() => {
        //     time = 0;
        // })

        const amData = computed(() => {
            const am = items.value.slice(0,12);
            return am;
        })
        const pmData = computed(() => {
            const pm = items.value.slice(12,24);
            return pm;
        })

        viewMoldOutputChart()

        function viewMoldOutputChart(vDate) {
                //this.showDetails = false;
                // 생산량 조회
                items.value = [];
                columns.value = [
                    { code: "shotHour", name: "시간" },
                    { code: "shotCount", name: "SHOT" },
                    { code: "shotOutput", name: "생산량" },
                    { code: "adjustedOutput", name: "조정생산량" },
                    { code: "ct", name: "C/T" },
                ];
                foots.value = {
                    shotCount: 0,
                    shotOutput: 0,
                    adjustedOutput: 0,
                    ct: 0,
                };
                const vwDate = vDate || viewDate.value;
                console.log("vwDate",vwDate);
                console.log("vDate.value",viewDate.value);
                StatisticApi.getHourlyShotsByMonth(props.id, vwDate).then((res) => {
                    console.log("getHourlyShotsByMonth ---> ", res.data);
                    if (res.data) {
                        cavity.value = res.data.cavity;
                        const list = res.data.list;

                        let ctArr = [];
                        items.value = [];
                        for (let i = 0; i < 24; i++) {
                            let item = {
                                shotHour: _.padStart(i + "", 2, "0") + ":00",
                                shotCount: 0,
                                shotOutput: 0,
                                adjustedOutput: 0,
                                ct: null,
                                cavity: null,
                                counterId: counterId.value,
                                shotLastHh: null,
                                shotLastAt: null,
                                temperature: null,
                            };
                            for (let idx = 0; idx < list.length; idx++) {
                                if (i === parseInt(list[idx].shot_last_hh)) {
                                    item.shotCount = list[idx].shot_count;
                                    item.shotOutput = list[idx].shot_output;
                                    item.adjustedOutput = list[idx].adjusted_output;
                                    item.ct = list[idx].cycle_time;
                                    item.cavity = list[idx].cavity;
                                    if (list[idx].counter_id) {
                                        item.counterId = list[idx].counter_id;
                                    }
                                    item.shotLastAt = list[idx].shot_last_at;
                                    item.shotLastHh = list[idx].shot_last_hh;
                                    item.temperature = list[idx].temp_current;
                                    foots.value.shotCount += parseInt(list[idx].shot_count);
                                    foots.value.shotOutput += parseInt(list[idx].shot_output);
                                    foots.value.adjustedOutput += parseInt(
                                    list[idx].adjusted_output
                                    );
                                    // this.foots.ct = item.ct > this.foots.ct ? item.ct : this.foots.ct;
                                    ctArr.push(item.ct);
                                    break;
                                }
                            }
                            items.value.push(item);
                        }
                        // C/T 중 가장 많은 빈도를 가진 값 추출
                        foots.value.ct = ctArr.reduce(
                            (a, b, i, arr) =>
                            arr.filter((v) => v === a).length >=
                            arr.filter((v) => v === b).length
                                ? a
                                : b,
                            null
                        );
                    }
                    //this.showDetails = true;
                    console.log(items.value);
                });
            }
        
        return {
            time, temp, items, amData, pmData, foots, cavity
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
    .dialog {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    overflow: hidden;
    z-index: 2;
    .dialog_main {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        width: 1350px;
        height: 900px;
        overflow-y: auto;
        border-radius: 5px;
        .dialog_head {
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: space-between;
            width: 100%;
            background-color: rgb(70, 64, 161);
            padding: 0 19px;
            box-sizing: border-box;
            .title {
                display: block;
                width: 150px;
                font-size: 18px;
                font-weight: 700;
                color: #fff;
            }

            .btn {
                background-color: rgb(48, 63, 159);
                border-color: rgb(48, 63, 159);
                height: 36px;
                min-width: 64px;
                padding: 0 16px;
                box-sizing: border-box;
                span {
                    color: #fff;
                    font-size: .875rem;
                }
            }
        }
        .dialog_body {
            background-color: #081736;
            position: relative;
            .table_div {
                display: flex;
                width: 100%;
                justify-content: center;
                height: auto;
                padding: 20px 15px;
                border: solid 2px #4640a1;
                background-color: #0e1934;
                box-sizing: border-box;
            }
            .btnarea {
                display: flex;
                justify-content: center;
                text-align: center;
                padding: 13px 0;
                gap: 15px;
            }
        }
    }
}

//table
table {
    //width: 100%; 
    //height: 100%;
    background-color: #3a4893;
    border-spacing: 1px;
    color: #fff;
    border-collapse: separate;
}

thead,
tbody,
tfoot {
    background-color: #0a134f;
    //border-bottom: 1px solid #5532e7;
    //border-top: 1px solid #5532e7;
}

th {
    width: 130px;
    height: 42px;
    font-size: 15px;
    text-align: center;
    line-height: 42px;
}

th:nth-child(2) {
    background-color: #077150;
}
th:nth-child(3) {
    background-color: #24559b;
}
th:nth-child(4) {
    background-color: #572497;
}

td {
    text-align: center;
    width: 130px;
    height: 42px;
    font-size: 15px;
}

td:nth-child(2) {
    background-color: #012c3e;
}
td:nth-child(3) {
    background-color: #112349;
}
td:nth-child(4) {
    background-color: #241636;
}

td input {
    color: #ffffff;
    font-size: 10pt;
    text-align: right;
    max-width: 100px;
    width: 120px;
    height: 34px;
    border: solid 1px #572497;
    background-color: #1f1634;
    outline: none;
}

</style>