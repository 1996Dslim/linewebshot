<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>Dashboard > 금형별 종합 지표</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">금형 정보</label>
                        <input type="radio" id="value2" v-model="meuninfo" value="2"><label for="value2">지표 차트</label>
                        <input type="radio" id="value3" v-model="meuninfo" value="3"><label for="value3">상세 내역</label>
                    </div>         
                </div>
                <div class="btnarea">
                    <div class="btn" @click="$emit('close-modal')">
                        <span class="material-icons">
                            close
                        </span>
                        <span>닫 기</span>
                    </div>
                </div>
            </div>
            <div class="modal_body">
                <Info v-if="meuninfo === '1'" :id="modalid"/>
                <Chart v-if="meuninfo === '2'" :id="modalid"/>
                <Calendar v-if="meuninfo === '3'" :id="modalid"/>
            </div>
        </div>
    </div>
</template>

<script>
import Info from "~/components/modal/indicator/IndicatorInfo.vue";
import Chart from "~/components/modal/indicator/IndicatorChart.vue";
import Calendar from "~/components/IndicatorCalendar.vue";
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';

export default {
    props: {
        id: {
            type: Number,
        }
    },
    components: {
        Info,
        Chart,
        Calendar
    },
    setup(props) {
        const modalid = ref(props.id);
        const meuninfo = ref('1');
        
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        //console.log(props);

        return { 
            meuninfo, modalid 
            }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
</style>