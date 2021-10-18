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
                                <!-- {{ date.slice(6,8).replace(/(^0+)/, "") }} -->
                                {{ date.slice(8,10) }}
                            </div>
                        </div>
                        <div v-for="area in datas" :key="area">
                            <div class="infoarea start" v-if="area.start === date">
                                <div>정기점검</div>
                                <div>{{area.start}} ~ {{area.end}}</div>
                                <div>진행중</div>
                            </div>
                            <div class="infoarea" v-if="area.start < date && area.end > date"></div>
                            <div class="infoarea end" v-if="area.end === date"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-if="modal" @close-modal="closeModal"/>
</template>

<script>
import daytest from "../assets/data/202108.json";
import daytest1 from "../assets/data/MaintenanceCalendar.json";

import YearMonth from "~/components/YearMonth.vue";
import MaintenanceApi from "~/apis/maintenance";
import Dialog from "~/components/MaintenanceDialog.vue";
import { ref } from '@vue/reactivity';
import Swal from 'sweetalert2';

export default {
    props: {
        id: {
            type: Number,
            required: true,
        },
        moldId: {
            type: Number,
            required: true,
        },
    },
    components: {
        YearMonth,
        Dialog
    },
    emits: ['renderCalendar'],

    setup(props) {
        console.log(props.id, props.moldId)
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        const date = new Date();
        const daydates = ref([]);
        const currentYear = date.getFullYear(); 
        const currentMonth = date.getMonth(); //("0" + (1 + date.getMonth())).slice(-2);
        // const year = currentYear;
        // const month = currentMonth + 1;
        const year = ref(currentYear);
        const month = ref(currentMonth + 1);

        const today = String(date.getFullYear()) + ("0" + (date.getMonth()+1)).slice(-2) + ("0" + (date.getDate())).slice(-2);
        const now = date.getDay();
        //const month_data = daytest1;

        const modal = ref(false);

        const loading = ref(false);
        const selectedMoldId = ref(props.moldId);
        const datas = ref()
        const colors = ref([
            'blue',
            'indigo',
            'deep-purple',
            'cyan',
            'green',
            'orange',
            'grey darken-1',
        ]);

        //console.log(date);
        //renderCalendar(year.value, month.value);

        function renderCalendar(year, month) { 
            daydates.value.splice(0);
            //console.log(year, month)

            const prevLast = new Date(year, month - 1, 0);
            const thisLast = new Date(year, month, 0);
            
            const PLDate = prevLast.getDate();
            const PLMonth = prevLast.getMonth();
            const PLDay = prevLast.getDay();
            
            //console.log("PLMonth", PLMonth);

            const TLDate = thisLast.getDate();
            let TLMonth = thisLast.getMonth() + 1;
            const TLDay = thisLast.getDay();

            const start = ref(String(year) + "-" + String(("0" + (month)).slice(-2)) + "-01")
            const end = ref(String(year) + "-" + String(("0" + (month)).slice(-2)) + "-" + String(("0" + (TLDate)).slice(-2)))

            //console.log("TLMonth",TLMonth);
            //console.log("month", month);
            const prevDates = [];
            const nowDates = [...Array(TLDate + 1).keys()].slice(1);
            const thisDates = [];
            const nextDates = [];
            
            if (PLDay !== 6) {
                for (let i = 0; i < PLDay + 1; i++) {
                    prevDates.unshift(String(TLMonth != 1? year : year-1) + "-" + ("0" + (PLMonth + 1)).slice(-2) + "-" +  ("0" + (PLDate - i)).slice(-2));
                }
            }
            
            for(let i = 0; i < nowDates.length; i++) {
                thisDates.push(String(year) + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + nowDates[i]).slice(-2) );
            }

            if(TLMonth === 12) {
                year += 1;
                TLMonth = 0;
            }

            for (let i = 1; i < 7 - TLDay; i++) {
                nextDates.push(String(year) + "-" +  ("0" + (TLMonth + 1)).slice(-2) + "-" +  ("0" + i).slice(-2))
            }

            const dates = prevDates.concat(thisDates, nextDates);

            for(let i = 0; i < dates.length; i++){
                daydates.value.push(dates[i]);
            }

            //console.log(daydates.value);
            getEvents(start.value, end.value)
        }

        async function getEvents(startdate, enddate) {
            // let start = startdate.value;
            // let end = enddate.value;
            let events = [];
            let params = {
                params: {
                    start: startdate,
                    end: enddate,
                },
            };

            console.log(params)

            loading.value = true;
            try {
                let res = await MaintenanceApi.findByMold(selectedMoldId.value, params);
                console.log(res.data)
                if (res && res.data) {
                    //datas.value = res.datas;
                    res.data.forEach((rd) => {
                        events.push({
                        name: rd.checkItem,
                        start: rd.startDate.slice(0, 10),
                        end: rd.endDate.slice(0, 10),
                        color: colors.value[0],
                        timed: false,
                        data: rd,
                        });
                    });
                }
            } catch (e) {
                Swal.fire({
                    icon: "error",
                    html: "데이터 조회에 실패하였습니다.<br>잠시 후 재시도 바랍니다.",
                });
                console.error(e);
            } finally {
                loading.value = false;
            }
           datas.value = events;
           console.log(datas.value);
        }

        function openModal() {
            modal.value = true;
            console.log(modal)
        }
        function closeModal() {
            modal.value = false;
        }

        return {
            days, daydates, today, now, month, modal, year, datas,
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
