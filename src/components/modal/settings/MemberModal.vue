<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="field_title_wrap">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>설정관리 > 사용자 관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">사용자 조회</label>
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
                <div class="field full">                        
                    <div class="title">
                        <div class="field_title_wrap">
                            <div class="info_img"></div>
                            <span class="text">사용자 기본 정보</span>
                        </div>
                    </div>
                    <div class="input_filed">
                        <form action="">
                            <div class="info_input">
                                <div class="line">
                                    <div class="box in">
                                        <span>USERID(이메일)</span>
                                        <input type="text" placeholder="이메일을 입력해 주세요">
                                    </div>
                                    <div class="btn">중복확인</div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>성명</span>
                                        <input type="text" placeholder="성명을 입력해 주세요">
                                    </div>
                                    <div class="box in">
                                        <span>연락처/핸드폰</span>
                                        <input type="text" placeholder="연락처/핸드폰을 입력해 주세요">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>비밀번호</span>
                                        <input type="text" placeholder="비밀번호를 입력해 주세요">
                                    </div>
                                    <div class="box in">
                                        <span>비밀번호 확인</span>
                                        <input type="text" placeholder="비밀번호를 가시 한번 더 입력해 주세요">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>부서명</span>
                                        <input type="text" placeholder="부서명을 입력해 주세요">
                                    </div>
                                    <div class="box in">
                                        <span>직위</span>
                                        <input type="text" placeholder="직위를 입력해 주세요">
                                    </div>
                                    <div class="box in">
                                        <span>담당업무</span>
                                        <input type="text" placeholder="담당업무를 입력해 주세요">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>권한</span>
                                        <input type="text">
                                    </div>
                                    <div class="box in">
                                        <span>계정상태</span>
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>권한 부여자</span>
                                        <input type="text" >
                                    </div>
                                    <div class="box in">
                                        <span>권한 부여일시</span>
                                        <input type="text">
                                    </div>
                                </div>
                            </div>
                            <div class="btnarea">
                                <div class="approve_btn"></div>
                                <div class="delete_btn"></div>
                                <div class="using_btn"></div>
                            </div>
                        </form> 
                    </div>                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { CODES } from '~/config';
import { useStore } from "vuex";

import AccountApi from '~/apis/account';
import AuthApi from '~/apis/auth';

export default {
    setup() {
        const store = useStore();
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });
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
    max-width: 1162px;
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