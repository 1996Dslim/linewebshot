<template>
    <!-- <div class="dialog" @click.self="$emit('close-modal')">
        <div class="dialog_main" >
            <div class="dialog_head">
                <div class="title">
                    <div class="dashboardimg"></div>
                    <span>금형관리 > 유지관리</span>
                </div>
                <div class="infobtn">
                    <input type="radio" checked disabled><label >유지관리 조회</label>
                </div>
            </div>
            <div class="dialog_body">
                <Modal></Modal>
            </div>
        </div>
    </div> -->

    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>금형관리 > 유지관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" value="1" checked><label for="value1">유지관리 조회</label>
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
                <Modal :id="id"></Modal>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import Modal from "~/components/modal/mold/MaintenanceRegistrationDetail.vue";

export default {
    name: "ChartModal",
    props: {
        id: Number
    },
    components: {
        Modal,
    },
    setup(props) {
        const id = ref(props.id);

        return {
            id
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";
    
    .modal_main {
        max-width: 1350px
    }
</style>