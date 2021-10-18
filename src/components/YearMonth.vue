<template>
    <div class="ymnav" >
        <button class="nav_btn go_prev" @click="prevMonth()">&lt;</button>
        <div class="year_month" @click="openModal">{{ year }}년 {{ month }}월</div>
        <button class="nav_btn go_next" @click="nextMonth()">&gt;</button>
    </div>
    <MinCalendar v-if="modal" @close-modal="closeModal" :year="year" :month="month"></MinCalendar>
</template>

<script>
import MinCalendar from "~/components/MinCalendar";

import { ref } from 'vue';

export default {
    name: "YearMonth",
    components: {
        MinCalendar
    },
    emits: ["renderCalendar"],
    setup(props, { emit }) {
        const modal =  ref(false);

        const date = new Date();
        const currentYear = date.getFullYear(); 
        const currentMonth = date.getMonth(); //("0" + (1 + date.getMonth())).slice(-2);
        const year = ref(currentYear);
        const month = ref(currentMonth + 1);
        
        emit('renderCalendar', year.value, month.value);
        
        const prevMonth = () => {
            if(month.value === 1){
                month.value = 12;
                year.value = year.value - 1;
            }
            else {
                month.value = month.value - 1;
            }

            emit('renderCalendar', year.value, month.value);
        }
        const nextMonth = () => {
            if(month.value === 12){
                month.value = 1;
                year.value = year.value + 1;
            }
            else {
                month.value = month.value + 1;
            }
            emit('renderCalendar', year.value, month.value);
        }

        //모달
        const openModal = () => {
            modal.value = true;
        }
        const closeModal = (passyear, passmonth) => {
            if(passyear != null && passmonth != null){
                month.value = passmonth;
                year.value = passyear;
                emit('renderCalendar', year.value, month.value);
            }
            modal.value  = false;
        }

        return {
            year, month, modal,
            prevMonth, nextMonth, openModal, closeModal
        }
    }
}
</script>


<style lang="scss" scoped>
    .ymnav {
        //width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        .nav_btn {
            min-width: 50px;
            height: 52px;
            background-color: transparent;
            outline: 0;
            border: 0;
            color: #fff;
            border-radius: 3px;
            &:hover {
            background-color: rgba(88, 97, 88, 0.5);
            transition: .3s;
            }
        }
    }

    .year_month {
        width: 120px;
        text-align: center;
        font-size: 15pt;
        color: #96a7fe;
    }
</style>