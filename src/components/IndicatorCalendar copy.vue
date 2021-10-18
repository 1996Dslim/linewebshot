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
                        <div v-for="index in month_data" :key="index">
                            <div v-if="date === index.shot_last_dt" class="data" @click="openModal">
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
                </div>
            </div>
        </div>
    </div>
    <Chartmodal v-if="modal" @close-modal="closeModal"/>
</template>

<script>
import daytest from "../assets/data/202108.json";
import daytest1 from "../assets/data/202109.json";

import YearMonth from "~/components/YearMonth.vue";
import Chartmodal from "~/components/ChartModal.vue";
import { ref } from '@vue/reactivity';
import StatisticApi from "~/apis/statistic";

export default {
    props: {
        id: {
            type: Number,
        }
    },
    components: {
        YearMonth,
        Chartmodal
    },
    emits: ['renderCalendar'],

    setup(props) {
        const countId = ref(props.id);
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        const date = new Date();
        const daydates = ref([]);
        const currentYear = date.getFullYear(); 
        const currentMonth = date.getMonth(); //("0" + (1 + date.getMonth())).slice(-2);
        const year = ref(currentYear);
        const month = ref(currentMonth + 1);

        const today = String(date.getFullYear()) + ("0" + (date.getMonth()+1)).slice(-2) + ("0" + (date.getDate())).slice(-2);
        const now = date.getDay();
        const month_data = ref([]);
        const items = ref([]);
        const columns = ref([]);
        const foots = ref();
        const modal = ref(false);

        //renderCalendar(year.value, month.value);

        function renderCalendar(year, month) { 
            daydates.value.splice(0);
            const toMonth = ref(String(year) + String(("0" + month).slice(-2)));
            console.log(toMonth.value);

            const prevLast = new Date(year, month - 1, 0);
            const thisLast = new Date(year, month, 0);
            
            const PLDate = prevLast.getDate();
            const PLDay = prevLast.getDay();
            
            const TLDate = thisLast.getDate();
            const TLDay = thisLast.getDay();

            const prevDates = [];
            const nowDates = [...Array(TLDate + 1).keys()].slice(1);
            const thisDates = [];
            const nextDates = [];
            
            if (PLDay !== 6) {
                for (let i = 0; i < PLDay + 1; i++) {
                    prevDates.unshift(String(year) + ("0" + (month - 1)).slice(-2) + ("0" + (PLDate - i)).slice(-2));
                }
            }
            
            for(let i = 0; i < nowDates.length; i++) {
                thisDates.push(String(year) + ("0" + (month)).slice(-2) + ("0" + nowDates[i]).slice(-2) );
            }

            for (let i = 1; i < 7 - TLDay; i++) {
                nextDates.push(String(year) + ("0" + (month + 1)).slice(-2) + ("0" + i).slice(-2))
            }

            const dates = prevDates.concat(thisDates, nextDates);

            for(let i = 0; i < dates.length; i++){
                daydates.value.push(dates[i]);
            }
            
            getEvents(toMonth);
        }

        function openModal() {
            modal.value = true;
            console.log(modal)
        }
        function closeModal() {
            modal.value = false;
        }

        async function getEvents(toMonth) {
            const events = [];
            //금형 종합지표 > 상세내역 (월 데이터)
            try {
                const res = await StatisticApi.getDailyShotCtByMonth(countId.value, toMonth.value);
                console.log(res.data)
                if (res.data) {
                    month_data.value = res.data;
                    //res.data.forEach((s) => {
                    // events.push({
                    //     name: `SHOT:${s.shot_count}`,
                    //     start: this.$moment(s.shot_last_dt, "YYYYMMDD").toDate(),
                    //     end: this.$moment(s.shot_last_dt, "YYYYMMDD").toDate(),
                    //     color: "transparent",
                    //     timed: true,
                    //     data: s,
                    //     });
                    //});
                }
            } catch (err) {
                console.log(err);
            }
        }
        viewMoldOutputChart();
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
            console.log("columns",columns.value)
            foots.value = {
                shotCount: 0,
                shotOutput: 0,
                adjustedOutput: 0,
                ct: 0,
            };
            console.log("foots", foots.value);
            //const vwDate = vDate || this.viewDate;
            StatisticApi.getHourlyShotsByMonth(props.id, true).then((res) => {
                console.log("getHourlyShotsByMonth ---> ", res.data);
                if (false) {
                    this.cavity = res.data.cavity;
                    const list = res.data.list;

                    let ctArr = [];
                    this.items = [];
                    for (let i = 0; i < 24; i++) {
                        let item = {
                            shotHour: _.padStart(i + "", 2, "0") + ":00",
                            shotCount: 0,
                            shotOutput: 0,
                            adjustedOutput: 0,
                            ct: null,
                            cavity: null,
                            counterId: this.counterId,
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
                                this.foots.shotCount += parseInt(list[idx].shot_count);
                                this.foots.shotOutput += parseInt(list[idx].shot_output);
                                this.foots.adjustedOutput += parseInt(
                                list[idx].adjusted_output
                                );
                                // this.foots.ct = item.ct > this.foots.ct ? item.ct : this.foots.ct;
                                ctArr.push(item.ct);
                                break;
                            }
                        }
                        this.items.push(item);
                    }
                    // C/T 중 가장 많은 빈도를 가진 값 추출
                    this.foots.ct = ctArr.reduce(
                        (a, b, i, arr) =>
                        arr.filter((v) => v === a).length >=
                        arr.filter((v) => v === b).length
                            ? a
                            : b,
                        null
                    );
                }
                //this.showDetails = true;
            });
        }

        return {
            days, daydates, month_data, today, now, month, modal, year, countId,
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
        border-top: 1px solid #9e9e9e;
        border-left: 1px solid #9e9e9e;
        .days {
            display: flex;
            justify-content: space-between;
            .day {
                text-align: center;
                padding-top: 7px;
                width: 100%;
                height: 30px;
                background-color: #29378c;
                border-right: 1px solid #9e9e9e;
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
                border-right: 1px solid #9e9e9e;
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
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 40px;
                        &.active {
                            background-color: rgb(32, 36, 66);
                        }
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
