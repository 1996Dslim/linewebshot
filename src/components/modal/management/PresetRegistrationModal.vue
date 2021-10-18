<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="field_title_wrap">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>장비관리 > 카운터 PreSet</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">카운터 PRESET 등록</label>
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
                    <div class="counter_line">
                        <span>카운터 ID</span>
                        <div class="img"></div>
                        <div class="counter_input">
                            <input list="search_counter_id"  type="text" placeholder="검색하실 [카운터ID]를 입력해 주세요">
                            <datalist id="search_counter_id">
                                <option value="test"></option>
                            </datalist>
                        </div>
                    </div>
                    <div class="counter_line">
                        <span>SHOT 변경</span>
                        <input type="number" value=0 >
                    </div>
                    <div class="counter_line">
                        <span>충격 세기 값</span>
                        <input type="number" value=0 >
                    </div>
                    <div class="counter_line">
                        <span>알람 값 지정</span>
                        <input type="number" value=0 >
                        <label for="cycle">순환여부</label>
                        <input id="cycle" type="checkbox">
                    </div>
                    <div class="counter_line">
                        <span>알림대상자</span>
                        <div class="img"></div>
                        <div class="counter_input">
                            <input list="search_user"  type="text" placeholder="장비관리자 이름을 입력하세요.">
                            <datalist id="search_user">
                                <option value="test"></option>
                            </datalist>
                        </div>
                        <div class="btn">추가</div>
                    </div>
                    <div class="counter_line">
                        <span>작성자</span>
                        <div class="counter_input">
                            <input type="text" value="연구원 01" disabled>
                        </div>
                        <span>작성일자</span>
                        <div class="counter_input">
                            <input type="text" value="2021-09-24" disabled>
                        </div>
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

        return { meuninfo }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";

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