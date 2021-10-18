<template>
    <div class="day-modal" @click.self="$emit('close-modal')">
        <div class="day-modal-wrap">
            <div class="header">
                <div class="nav">
                    <button class="nav-btn modal-go-prev" @click="preyear">&lt;</button>
                    <div class="year">{{choice.year}}</div>
                    <button class="nav-btn modal-go-next" @click="nextyear">&gt;</button>
                </div>
            </div>
            <div class="day-modal-main">
                <div class="months">
                    <button 
                    :class="`month ${year === nowyear && i-1 === nowmonth ? 'to' : ''}`"
                    v-for="i in 12" :key="i"
                    @click="choicemonth(i)" 
                    >{{i}}월</button>    
                </div>
            </div>
            <div class="btn">
                <button class="white cen" @click="$emit('close-modal')">취소</button>
                <button class="white sub" @click="$emit('close-modal', choice.year, choice.month)">확인</button>
            </div>
            <ul class="slide_pagination" style="display: none;"></ul>
        </div>
    </div>
</template>

   
<script>
import { reactive, ref } from '@vue/reactivity';
export default {
    props: {
        year:Number,
        month:Number
    },
    setup(props) {
        const today = new Date();
        
        const choice = reactive({
            year: props.year,
            month: props.month
        })
        //choice.year = today.getFullYear();
        const nowyear = today.getFullYear();
        const nowmonth = today.getMonth();
        

        const preyear = () => {
            choice.year -= 1;
        }

        const nextyear = () => {
            choice.year += 1;
        }

        function choicemonth(num) {
            choice.month = num;
        }

        return {
            choice, nowyear, nowmonth, choice,
            nextyear, preyear, choicemonth
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
 @import "~/scss/mincalendar.scss";
</style>