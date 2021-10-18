<template>
    <div class="field full">                        
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img"></div>
                <span class="text">기본정보</span>
            </div>
            <div class="btn medium">저장</div>
        </div>
        <div class="info_input">
            <div class="line">
                <div class="box in" style="width: 100px;  max-width: 255px;">
                    <span>금형 코드</span>
                    <input type="text"  style="color: #fff; min-width: 100px;" >
                </div>
                <div class="btn small">
                    중복<br>확인
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 명</span>
                    <input type="text"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 종류</span>
                    <select class="modal_select" name="" id="" style="height: 32px;">
                        <option value="">사출</option>
                        <option value="">프레스</option>
                        <option value="">다이케스팅</option>
                    </select>
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 상태</span>
                    <select class="modal_select" name="" id="" style="height: 32px;">
                        <option value="" selected>양산</option>
                        <option value="">개발</option>
                        <option value="">유휴</option>
                        <option value="">A/S</option>
                        <option value="">폐기</option>
                    </select>
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>제작차수</span>
                    <input type="number"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>제작처</span>
                    <input type="text"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>제작일자</span>
                    <input type="text"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>CAVITY</span>
                    <input type="number"  style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>보증 SHOT</span>
                    <input type="text"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>점검/알람 SHOT</span>
                    <input type="text"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>기준 C/T (단위: 초)</span>
                    <input type="text"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>C/T 오차범위 (단위: 초)</span>
                    <div style="display: flex;">
                        <span style="color: #fff;">(+-)</span>
                        <input type="text" style="color: #fff; min-width: 100px;">  
                    </div>
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>일별기준시간</span>
                    <input type="number" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>일별기준생산량</span>
                    <input type="text" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록자</span>
                    <input type="text" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록일시</span>
                    <input type="text" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>

    <div class="field full" v-for="frame in frames" :key="frame">                        
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img"></div>
                <span class="text">{{ frame.title }}</span>
            </div>
            <div class="btn medium">저장</div>
        </div>
        <div class="info_input">
            <div v-for="line, i in frame.text" :key="line" class="line">
                <div v-for="box, index in line" :key="box" class="box in" style="width: 100px;">
                    <span>{{ box }}</span>
                    <input type="text" :value= "frame.value[i][index]" style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity';

import { CODES, SETTINGS } from '~/config';
import communication from '~/assets/data/communication.json';
import MoldApi from '~/apis/mold';
import { computed } from '@vue/runtime-core';
import { useStore } from "vuex";
import Swal from 'sweetalert2';

export default {
    setup() {
        const store = useStore();
        const isDuplicateChecked = ref(false);

        const file_name = ref('파일을 첨부해주세요.');
        const file_label = ref('');
        const frames = reactive([
                {
                    title: "추가 정보",
                    linenum: 4,
                    text: [
                        ["자산 코드","자산명","모델명", "품명"],
                        ["FAMILY","금형 중량(g)","양산처", "양산차 수"],
                        ["금형 소재","레진 소재","금형 크기(가로 X 세로 X 높이) ", "제작처 담장자 / 연락처"],
                        ["양산처 담당자 / 연락처","금형제작 비용(원)"]
                    ],
                    value: [
                        [],
                        [],
                        [],
                        []
                    ] 
                }
            ]);
        
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });
            
        const handleFileChange = (e) => {
            file_name.value = e.target.files[0].name;
            file_label.value = '#26c8fd';
        }

        const check = () => {
            console.log(frames[0].value)
            console.log(ID.moldName);
        }

        return {
            file_name, file_label, frames,
            handleFileChange, check
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";

    .line:last-child {
        span,
        label {
            height: 16px;
            color: #26c8fd;
            //font-size: 16px;
            font-weight: 500;
            margin:auto 16px auto 0;
        }
        .box {
            &.in{
                min-height: 52px;
                position: relative;
                label {
                    color: #4f5393;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                    padding-left: 12px;
                    position: absolute;
                }
            }
        }
    }
</style>