<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>금형관리 > 폐기관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="regmeuninfo" value="1" checked><label for="value1">금형 정보</label>
                        <input type="radio" id="value2" v-model="regmeuninfo" value="2" ><label for="value2">금형 폐기</label>
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
                <IndicatorInfo v-if="regmeuninfo === '1'" :id="id"/>
                <DisposalDetail v-if="regmeuninfo === '2'" :id="id"/>  
            </div>
        </div>
    </div>
</template>

<script>
import IndicatorInfo from "~/components/modal/indicator/IndicatorInfo.vue";
import DisposalDetail from "~/components/modal/mold/DisposalRegistrationDetail.vue";

import { ref } from '@vue/reactivity';

export default {
    components: {
        IndicatorInfo,
        DisposalDetail,
    },
    props: {
        id:Number
    },
    setup(props) {
        const id = ref(props.id);
        console.log("de id",id);
        const regmeuninfo = ref('1');

        return { regmeuninfo, id }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
</style>