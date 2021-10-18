<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="field_title_wrap">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>금형관리 > 생산관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">금형 정보</label>
                        <input type="radio" id="value2" v-model="meuninfo" value="2" ><label for="value2">지표차트</label>
                        <input type="radio" id="value3" v-model="meuninfo" value="3" ><label for="value3">상세내역</label>
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
                <IndicatorInfo v-if="meuninfo === '1'" :id="modalid"/>
                <ProductionChart v-if="meuninfo === '2'" :id="modalid"/>
                <ProductionCalendar v-if="meuninfo === '3'" :id="modalid" :target="'mold'"/>
            </div>
        </div>
    </div>
</template>

<script>
import IndicatorInfo from "~/components/modal/indicator/IndicatorInfo.vue";
import ProductionChart from "~/components/modal/mold/ProductionChart.vue";
import ProductionCalendar from "~/components/IndicatorCalendar.vue";
import { ref } from '@vue/reactivity';

export default {
    props: {
        id: {
            type: Number,
        }
    },
    components: {
        IndicatorInfo,
        ProductionChart,
        ProductionCalendar
    },
    setup(props) {
        const modalid = ref(props.id);
        const meuninfo = ref('1');

        return {
             meuninfo, modalid
            }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
</style>