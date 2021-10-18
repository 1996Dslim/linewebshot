<template>
    <div class="day_area_bg">
        <div class="calendar">
            <div class="header">
                <YearMonth @renderCalendar="renderCalendar"/>        
            </div>
            <div class="main">
                <div class="days">
                    <div 
                    v-for="(day, index) in days" 
                    :key="index" :class="`day ${now === index? 'active' : ''}`">
                        {{day}}
                    </div>
                </div>
                <div class="dates">
                    <div 
                    v-for="(date, index) in daydates"
                    :key="index"
                    :class="`date ${date.slice(4,6) != month ? 'active' : ''}`">
                        <div class="num_box">
                            <div :class="`day_num ${today === date ? 'active' : ''}`">
                                {{ date.slice(6,8).replace(/(^0+)/, "") }}
                            </div>
                        </div>

                        <div v-if="target !='mold'">
                            <div v-for="index in month_data" :key="index">
                                <div v-if="date === index.shot_last_dt" class="data" @click="openModal(date)">
                                    <div class="data-box">
                                        <div class="cir"></div>
                                        <div>SHOT: {{index.shot_count}}</div>
                                    </div>
                                    <div class="data-box">
                                        <div class="cir"></div>
                                        <div>C/T: {{ index.most_ct }}</div>
                                    </div>
                                    <div class="data-box">
                                        <div class="cir"></div>
                                        <div>온도: {{ index.most_temp }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div v-for="index in month_data" :key="index">
                                <div v-if="date === index.shotDate" class="data" @click="openModal(date)">
                                    <div class="data-box">
                                        <div class="cir"></div>
                                        <div>SHOT: {{index.adjustedOutput}} / 생산률:0%</div>
                                    </div>
                                    <div class="data-box">
                                        <div class="cir"></div>
                                        <div>조정생산량: {{ index.shotOutput }}</div>
                                    </div>
                                    <div class="data-box">
                                        <div class="cir"></div>
                                        <div>SHOT: {{ index.shotCount }} / C/T: {{ index.cycleTime }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <Chartmodal v-if="modal" @close-modal="closeModal" :series="items" :day="viewDate" :counter="counterId"/>
    <MoldModal v-if="moldModal" @close-modal="closeModal" :id="id" :day="viewDate"/>
</template>

<script>
import _ from "lodash";
import YearMonth from "~/components/YearMonth.vue";
import Chartmodal from "~/components/ChartModal.vue";
import MoldModal from "~/components/ProductionDialog.vue";
import { ref } from '@vue/reactivity';
import StatisticApi from "~/apis/statistic";

export default {
    props: {
        id: {
            type: Number,
        },
        target: {
            type: String,
            required: true,
            default: null,
        },
    },
    components: {
        YearMonth,
        Chartmodal,
        MoldModal
    },
    emits: ['renderCalendar'],

    setup(props) {
        console.log(props.id)
        const id = ref(props.id);
        const target = ref(props.target);
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        const date = new Date();
        const daydates = ref([]);
        const currentYear = date.getFullYear(); 
        const currentMonth = date.getMonth(); //("0" + (1 + date.getMonth())).slice(-2);
        // const year = currentYear;
        // const month = currentMonth + 1;
        const year = ref(currentYear);
        const month = ref(currentMonth + 1);

        const events = ref([]);
        const today = String(date.getFullYear()) + ("0" + (date.getMonth()+1)).slice(-2) + ("0" + (date.getDate())).slice(-2);
        const now = date.getDay();
        const month_data = ref([]);
        const items = ref([]);
        const counterId = ref(null);
        const columns = ref([]);
        const foots = ref();
        const viewDate = ref(null)
        const selectedViewDate = ref(null);
        const cavity = ref(null);

        const modal = ref(false);
        const moldModal = ref(false);

        //console.log(date);
        //renderCalendar(year.value, month.value);

        function renderCalendar(year, month) { 
            daydates.value.splice(0);
            //console.log(year, month)
            const toMonth = ref(String(year) + String(("0" + month).slice(-2)));
            //console.log(toMonth.value);

            const prevLast = new Date(year, month - 1, 0);
            const thisLast = new Date(year, month, 0);
            
            const PLDate = prevLast.getDate();
            const PLMonth = prevLast.getMonth();
            const PLDay = prevLast.getDay();
            
            //console.log("PLMonth", PLMonth);

            const TLDate = thisLast.getDate();
            let TLMonth = thisLast.getMonth() + 1;
            const TLDay = thisLast.getDay();
            
            const start = ref(String(year) + String(("0" + (month)).slice(-2)) + "01")
            const end = ref(String(year) + String(("0" + (month)).slice(-2)) + String(("0" + (TLDate)).slice(-2)))

            //console.log("TLMonth",TLMonth);
            //console.log("month", month);
            const prevDates = [];
            const nowDates = [...Array(TLDate + 1).keys()].slice(1);
            const thisDates = [];
            const nextDates = [];
            
            if (PLDay !== 6) {
                for (let i = 0; i < PLDay + 1; i++) {
                    prevDates.unshift(String(TLMonth != 1? year : year-1) + ("0" + (PLMonth + 1)).slice(-2) + ("0" + (PLDate - i)).slice(-2));
                }
            }
            
            for(let i = 0; i < nowDates.length; i++) {
                thisDates.push(String(year) + ("0" + (month)).slice(-2) + ("0" + nowDates[i]).slice(-2) );
            }

            if(TLMonth === 12) {
                year += 1;
                TLMonth = 0;
            }

            for (let i = 1; i < 7 - TLDay; i++) {
                nextDates.push(String(year) + ("0" + (TLMonth + 1)).slice(-2) + ("0" + i).slice(-2))
            }

            const dates = prevDates.concat(thisDates, nextDates);

            for(let i = 0; i < dates.length; i++){
                daydates.value.push(dates[i]);
            }

            getEvents(toMonth, start, end);
        }

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
            console.log(viewDate.value);
            StatisticApi.getHourlyShotsByMonth(id.value, vwDate).then((res) => {
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
                moldModal.value=true
            });
        }

        function viewTotalIndicatorChart(vDate) {
            // 종합지표 상세 그래프
            items.value = [];
            
            //this.showDetails = true;
            columns.value = [
                { code: "shotHour", name: "시간" },
                { code: "shotCount", name: "SHOT" },
                { code: "ct", name: "CT" },
                { code: "temp", name: "온도" },
            ];
            foots.value = [
                { shotCount: 0, ct: 0, temp: 0 },
                { shotCount: 0, ct: 0, temp: 0 },
            ];
            const vwDate = vDate || viewDate.value;
            StatisticApi.getHourlyShotCtByDate(props.id, vwDate).then((res) => {
                console.log('종합지표 상세 그래프 ----> ', res.data);
                items.value = _.map(
                new Array(24),
                function (el, i) {
                    let item = {
                        shotHour: _.padStart(i + "", 2, "0") + ":00",
                        shotCount: 0,
                        ct: 0,
                        temp: 0,
                    };
                    for (let idx = 0; idx < res.data.length; idx++) {
                        if (res.data[idx].counter_id) {
                            counterId.value = res.data[idx].counter_id;
                        }
                        if (i === parseInt(res.data[idx].shot_last_hh)) {
                            item.shotCount = res.data[idx].shot_cnt;
                            item.ct = res.data[idx].ct;
                            item.temp = res.data[idx].temp_current
                            ? res.data[idx].temp_current / 10
                            : 0;
                            break;
                        }
                    }
                    return item;
                }.bind(this));

                modal.value = true;
                console.log("item", items.value);
                console.log("counterId", counterId.value);
                console.log("item", viewDate.value);
            });
        }

        // async function viewEvent({ event }) {
        //     viewDate.value = event.start;
        //     selectedViewDate.value = new Date(event.start);
        //     viewTotalIndicatorChart();
        // }

        async function getEvents(toMonth, start, end) {
            events.value = [];
            if(target.value != 'mold') {
                //금형 종합지표 > 상세내역 (월 데이터)
                try {
                    const res = await StatisticApi.getDailyShotCtByMonth(props.id, toMonth.value);
                    if (res.data) {
                        month_data.value = res.data;
                        res.data.forEach((s) => {
                        events.value.push({
                            name: `SHOT:${s.shot_count}`,
                            start: s.shot_last_dt,
                            end: s.shot_last_dt,
                            color: "transparent",
                            timed: true,
                            data: s,
                            });
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
                //console.log("events",events.value)
            }
            else {
                // 금형관리 > 생산관리 > 상세내역
                try {
                const res = await StatisticApi.getHourlyShots(props.id, {
                    params: {
                    start: start.value,
                    end: end.value,
                    },
                });
                console.log(res.data)
                if (res.data) {
                    month_data.value = res.data;
                    res.data.forEach((s) => {
                        events.value.push({
                            name: `SHOT_${s.shotDate}`,
                            start: s.shotDate,
                            end: s.shotDate,
                            color: "transparent",
                            timed: true,
                            data: s,
                        });
                    });
                }
                } catch (err) {
                    console.log(err);
                }
            }
        }

        async function openModal(date) {
            viewDate.value = date;
            selectedViewDate.value = date;
            if(target.value === null) {
                viewTotalIndicatorChart();
            }
            else {
                moldModal.value=true;
            }
        }
        function closeModal() {
            modal.value = false;
            moldModal.value = false;
        }

        return {
            days, daydates, month_data, today, now, month, modal, year, items, viewDate, counterId, target, moldModal, id,
            renderCalendar, openModal, closeModal
        }
    }
}
</script>

<style lang="scss" scoped>
.day_area_bg {
    padding: 10px;
    background-color: #0c1139;
    color: #fff;
    
    .calendar .header {
        border: 1px solid #1d2a80;
        margin-bottom: 10px;
    }
    .main {
        // border-top: 1px solid #9e9e9e;
        // border-left: 1px solid #9e9e9e;
        border: 1px solid #9e9e9e !important;
        .days {
            display: flex;
            justify-content: space-between;
            .day {
                text-align: center;
                padding-top: 7px;
                width: 100%;
                height: 30px;
                background-color: #29378c;
                //border-right: 1px solid #9e9e9e;
                border-right: 1px solid #2196f3;
                box-sizing: border-box;
                font-size: 11px;
                &.active {
                    background-color: #90e7f7;
                }
            }
        }
        .dates {
            display: flex;
            flex-wrap: wrap;
            .date {
                width: calc(100%/7);
                min-height: 123px;
                background-color: #001a49;
                //border-right: 1px solid #9e9e9e;
                border-right: 1px solid #2196f3;
                border-bottom: 1px solid #9e9e9e;
                box-sizing: border-box;
                text-align: center;
                &.active {
                    background-color: #0a1c3f;
                }

                .num_box {
                    margin-top: 4px;
                    height: 40px;
                    font-size: 12px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .day_num {
                        //width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 40px;
                        &.active {
                            background-color: rgb(32, 36, 66);
                        }
                    }
                }

                .infoarea {
                    height: 70px;
                    background-color: #2196F3 !important;
                    font-size: 12px;
                    cursor: pointer;
                    &.start {
                        margin-left: 5%;
                        border-top-left-radius: 5px;
                        border-bottom-left-radius: 5px;
                    }
                    &.end {
                        width: 90%;
                        border-top-right-radius: 5px;
                        border-bottom-right-radius: 5px;
                    }
                }

                .data {
                    left: 0;
                    cursor: pointer;
                    .data-box{
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                        font-size: 12px;
                        margin-left: 8px;
                        .cir {
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            background-color: #3076db;
                            margin-right: 10px;
                        }
                        &:first-child .cir{
                            background-color: #029d6d;
                        }
                        &:last-child .cir{
                            background-color: #ff6050;
                        }
                    } 
                }
            }
        }
    }
}


.day_area_bg .main .dates .date .today {
background-color: rgb(66, 32, 32);
border-color: rgb(66, 32, 32);
}
</style>
