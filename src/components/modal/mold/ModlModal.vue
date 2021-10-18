<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>금형관리 > 금형</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">금형 정보</label>
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
                <Info v-if="meuninfo === '1'" :id="id"/>
            </div>
        </div>
    </div>
</template>

<script>
import Info from "~/components/modal/mold/ModlInfo.vue";
import { ref } from '@vue/reactivity';

export default {
    components: {
        Info
    },
    props: {
        id: {
        type: Number,
        },
    },
    setup(props) {
        const meuninfo = ref('1');
        const id = ref(props.id);

        return { 
            meuninfo, id, 
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
</style>