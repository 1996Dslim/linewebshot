<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>금형관리 > 유지관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">금형 정보</label>
                        <input type="radio" id="value2" v-model="meuninfo" value="2" ><label for="value2">상세내역</label>
                        <input type="radio" id="value3" v-model="meuninfo" value="3" ><label for="value3">이력조회</label>
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
                <IndicatorInfo v-if="meuninfo === '1'" :id="moldId"/>
                <MaintenanceCalendar v-if="meuninfo === '2'" :id="id" :moldId="moldId"/>
                <MaintenanceCheck v-if="meuninfo === '3'" :id="id" :moldId="moldId" :target="'maintenance'"/>
            </div>
        </div>
    </div>
</template>

<script>
import IndicatorInfo from "~/components/modal/indicator/IndicatorInfo.vue";
import MaintenanceCalendar from "~/components/MaintenanceCalendar.vue";
import MaintenanceCheck from "~/components/modal/mold/MaintenanceCheck.vue";

import { ref } from '@vue/reactivity';

export default {
    props: {
        id: Number,
        moldId: Number,
        target: {
            type: String,
            default: "mold",
        },
    },
    components: {
        IndicatorInfo,
        MaintenanceCalendar,
        MaintenanceCheck
    },
    setup(props) {
        const meuninfo = ref('1');
        const moldId = ref(props.moldId);
        const id = ref(props.id);

        return { 
            meuninfo ,moldId, id
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
</style>