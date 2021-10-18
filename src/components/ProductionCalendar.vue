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
                            <div v-if="date === index.shotDate" class="data" @click="openModal">
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
    <Dialog v-if="modal" @close-modal="closeModal"/>
</template>

<script>
import daytest from "../assets/data/202108.json";
import daytest1 from "../assets/data/productioncalendar.json";

import YearMonth from "~/components/YearMonth.vue";
import Dialog from "~/components/ProductionDialog.vue";
import { ref } from '@vue/reactivity';

export default {
    components: {
        YearMonth,
        Dialog
    },
    emits: ['renderCalendar'],

    setup() {
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
        const month_data = daytest1;

        const modal = ref(false);

        renderCalendar(year.value, month.value);

        function renderCalendar(year, month) { 
            daydates.value.splice(0);
            console.log(year, month)

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

            console.log(daydates.value);
        }

        function openModal() {
            modal.value = true;
            console.log(modal)
        }
        function closeModal() {
            modal.value = false;
        }

        return {
            days, daydates, month_data, today, now, month, modal, year, 
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
