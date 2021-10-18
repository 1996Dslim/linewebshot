<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>설정관리 > 금형코드 관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">금형코드 등록</label>
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
                <div class="counter_input_box">
                    <div class="line">
                        <div class="box in">
                            <span>금형코드</span>
                            <input type="text">
                        </div>
                        <div class="box in">
                            <span>코드 명</span>
                            <input type="text">
                        </div>
                        <div class="btn small">중복 확인</div>
                    </div>
                    <div class="line">
                        <div class="box in">
                            <span>코드 유형</span>
                            <select class="modal_select" name="" id="">
                                <option value="">Text</option>
                                <option value="">Select</option>
                                <option value="">Radio</option>
                            </select>
                        </div>
                        <div class="box in">
                            <span>화면 표시 여부</span>
                            <input type="checkbox">
                        </div>
                        <div class="box in">
                            <span>검색 허용 여부</span>
                            <input type="checkbox">
                        </div>
                    </div>
                </div>
                <div class="btnarea">
                    <div class="btn medium" @click="$emit('close-modal')">
                        <span>저장</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';

export default {
    setup() {
        const meuninfo = ref('1');

 
        return { 
            meuninfo
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";

.modal_main {
    max-width: 800px;
}
//수정
.counter_input_box {
    background-color: rgb(24, 28, 56);
    border-color: rgb(24, 28, 56);
    padding: 13px 39px 20px;
    .counter_line {
        display: flex;
        height: 52px;
        width: 100%;
        margin-top: 15px;
        background-color: rgb(9, 21, 46);
        border-bottom: rgb(115, 151, 253) solid 1px ;
        color: rgb(115, 151, 253);
        line-height: 52px;
        padding-left: 12px;
        align-items: center;
        span {
            display: block;
            width: 163px;
        }
        .img {
            width: 24px;
            height: 24px;
            background-image: url("~/assets/management/counter/counter_registration.png");
        }
        input[type = number] {
            background-color: rgb(9, 21, 46);
            color: #fff;
            outline: 0;
            border: 0;
            border-bottom: rgb(115, 151, 253) solid 1px ;
            margin-right: 15px;
        }

        .counter_input {
            display: flex;
            max-width: 600px;
            width: 600px;
            padding-left: 30px;
            input {
                width: 90%;
                background-color: rgb(9, 21, 46);
                color: #fff;
                outline: 0;
                border: 0;

                &:disabled {
                    color: rgb(115, 151, 253);
                }
            }
        }
    }
}
</style>