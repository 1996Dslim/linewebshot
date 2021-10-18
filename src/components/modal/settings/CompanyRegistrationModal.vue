<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="field_title_wrap">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>설정관리 > 사업자 관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">사업자 등록</label>
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
                        <div class="box in" style="width: 260px;">
                            <span>업체명</span>
                            <input type="text">
                        </div>
                        <div class="box in">
                            <span>사업자등록번호</span>
                            <input type="text" placeholder="숫자만 입력하세요.">
                        </div>
                        <div class="btn small">중복<br>확인</div>
                    </div>
                    <div class="line">
                        <div class="box in">
                            <span>주소</span>
                            <input type="text" placeholder="우편번호 검색">
                        </div>
                        <div class="box in">
                            <span>상세주소</span>
                            <input type="text" placeholder="상세주소를 입력해 주세요.">
                        </div>
                    </div>
                    <div class="line">
                        <div class="box in">
                            <span>업태</span>
                            <div class="box_input_wrap">
                                <div class="img"></div>
                                <input list="business" type="text" placeholder="-업태 선택-">
                                <datalist id="business">
                                    <option value="test"></option>
                                </datalist>
                            </div>
                        </div>
                        <div class="box in">
                            <span>종목</span>
                            <div class="box_input_wrap">
                                <div class="img"></div>
                                <input list="business" type="text" placeholder="-종목 선택-">
                                <datalist id="business">
                                    <option value="test"></option>
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="box in">
                            <span>1차 산업군</span>
                            <div class="box_input_wrap">
                                <div class="img"></div>
                                <input list="business" type="text" placeholder="-1차 산업군 선택-">
                                <datalist id="business">
                                    <option value="test"></option>
                                </datalist>
                            </div>
                        </div>
                        <div class="box in">
                            <span>2차 산업군</span>
                            <div class="box_input_wrap">
                                <div class="img"></div>
                                <input list="business" type="text" placeholder="-2차 산업군 선택-">
                                <datalist id="business">
                                    <option value="test"></option>
                                </datalist>
                            </div>
                        </div>
                        <div class="box in">
                            <span>세부 산업</span>
                            <div class="box_input_wrap">
                                <div class="img"></div>
                                <input list="business" type="text" placeholder="-세부 산업 선택-">
                                <datalist id="business">
                                    <option value="test"></option>
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div class="line file">
                        <span class="material-icons">
                            attachment
                        </span>
                        <label for="fileup">사업자등록증</label>
                        <div class="box in">
                            <input 
                            @change="handleFileChange"
                            id="fileup" type="file"/>
                            <label 
                            v-bind:style="{color: file_label }" 
                            for="fileup">
                                {{file_name}}
                            </label>
                        </div>
                    </div>
                </div>
                <div class="btnarea">
                    <div class="btn medium">저장</div>
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
        const file_name = ref('가입 시 제출하신 사업자등록증을 첨부해주세요.');
        const file_label = ref('');

        const handleFileChange = (e) => {
            file_name.value = e.target.files[0].name;
            file_label.value = '#26c8fd';
        } 
        return { 
            meuninfo, file_name, file_label,
            handleFileChange
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";

.modal_main {
        width: 1162px !important;
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

.box_input_wrap {
    display: flex;
}

.img {
    width: 24px;
    height: 24px;
    margin: 6.5px 12px;
    background-image: url("~/assets/management/counter/counter_registration.png");
}
</style>