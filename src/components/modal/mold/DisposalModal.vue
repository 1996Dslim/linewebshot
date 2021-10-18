<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal-main" >
            <div class="modal-head">
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
            <div class="modal-body">
                <IndicatorInfo v-if="meuninfo === '1'"/>
                <MaintenanceCalendar v-if="meuninfo === '2'"/>
                <MaintenanceCheck v-if="meuninfo === '3'"/>
                <div class="btnarea">
                    <div class="btn" @click="$emit('close-modal')">
                        <span class="material-icons">
                            close
                        </span>
                        <span>닫 기</span>
                    </div>
                </div>
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
    components: {
        IndicatorInfo,
        MaintenanceCalendar,
        MaintenanceCheck
    },
    setup() {
        const meuninfo = ref('1');

        return { meuninfo }
    }
}
</script>


<style lang="scss" scoped>
.modal {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    overflow: hidden;
    z-index: 2;
    .modal-main {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        width: 1476px;
        height: 100%;
        overflow-y: auto;
        .modal-head {
            height: 112px;
            background-color: #131d57;
            border-bottom: 1px solid#0096ff;
            .title {
                display: flex;
                align-items: center;
                height: 56px;
                color: #63bfff;
                font-size: 18px;
                .dashboardimg {
                    width: 56px;
                    height: 56px;
                    background-image: url("~/assets/sidenav/main_menu_1.png");
                    background-size: cover;
                }
            }
            .infobtn {
                padding-left: 79px;
                height: 56px;
                display: flex;
                input[type = "radio"] {
                    display: none;
                    &:checked + label {
                        border-bottom: 3px solid #0096ff;
                        color: #fff;
                    }
                }
                label {
                    width: 100px;
                    height: 56px;
                    line-height: 50px;
                    text-align: center;
                    background-color: #131d57;
                    color: rgb(91 108 201);
                    font-size: 16px;
                    border: 0;
                    outline: none;
                    box-sizing: border-box;
                    &:hover {
                        background-color: rgba(91, 108, 201, 0.2);
                        transition: .3s;
                    }
                }
            }
        }
        .modal-body {
            background-color: #081736;
            padding: 26px 20px 0 20px;
            position: relative;
            .btnarea {
                display: flex;
                justify-content: center;
                text-align: center;
                padding-top: 50px;
                padding-bottom: 104px;
                .btn {
                    width: 150px;
                    height: 52px;
                    box-sizing: border-box;
                    box-shadow: 0px 4px 0 0 rgba(0, 0, 0, 0.2);
                    background-color: #303f9f;
                    color: #fff; 
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>