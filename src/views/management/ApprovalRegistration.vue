<template>
    <div class="nav">
        <div>장비관리 > 장비승인요청</div>
        <span>승인 요청</span> 
    </div>
    <div class="addarea">
        <div class="btn small" @click="addnum">
            추가
        </div>
    </div>
    
    <div class="addfield" v-for="i in num" :key="i">
        <div class="line">
            <div class="box in">
                <span>장비구분</span>
                <select class="Press" name="" id="">
                    <option value="" selected>카운터</option>
                    <option value="">터미널</option>
                </select>
            </div>
            <div class="box in">
                <div class="approval_wrap">
                    <span>장비코드</span>
                    <select class="Press" name="" id="">
                        <option value="">LCM</option>
                        <option value="" selected>CCM</option>
                    </select>
                    <select class="Press" name="" id="">
                        <option value="" >20</option>
                        <option value="" selected>21</option>
                    </select>
                    <select class="Press" name="" id="">
                        <option v-for="i in 56" :key="i" value="" selected>{{i}}</option>
                    </select>
                    <select class="Press" name="" id="">
                        <option value="" selected disabled hidden>모델코드</option>
                        <option value="" >I01</option>
                        <option value="">P01</option>
                    </select>
                    <input type="text" placeholder="일련번호">
                </div>
                <div class="btn small">중복확인</div>
            </div>
        </div>
        <div class="multfile_box">
            <span>첨부파일</span>
            <input @change="handleFileChange" id = "multfile" type="file" multiple>
            <label class="filewrap">
                <div class="files" v-for="file, index in file_name" :key="index">{{ file.name }} <button></button> </div>
                <div v-if="file">업로드할 파일</div>
            </label>
            <label class="multfile_btn" for="multfile">파일선택</label>
        </div>
    </div>
    <div class="btnarea">
        <div class="btn">목록보기</div>
        <div class="btn">승인요청</div>
    </div>
</template>

<script>
import _ from 'lodash';
//import { firebase, firebaseStorage } from '@/services/firebase';

import { CODES } from '~/config';
import { useStore } from "vuex";
//import ApprovalApi from '~/apis/approval';
//import AttachedFileApi from '~/apis/attachedFile';

import { computed, ref } from '@vue/reactivity'

export default {
    setup() {
        const num = ref(1);
        const file_name = ref();
        const store = useStore();
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const id = ref(null);
        const list = ref([]);
        const targetName = ref('approval');
        const fileOpts = ref({
            accept: 'image/png,image/gif,image/jpeg,image/webp',
            drop: false,
            dropDirectory: false,
            extensions: 'gif,jpg,jpeg,png,webp',
            maximum: 1,
            multiple: true,
            inputId: 'attach_file',
            autoCompress: 1024 * 1024,
        });
        const counterCodes = ref([
            CODES.DEVICE_CODES.COUNTER.PROD_CD,
            CODES.DEVICE_CODES.COUNTER.MODEL_TIMES,
        ]);
        const terminalCodes = ref([
            CODES.DEVICE_CODES.TERMINAL.PROD_CD,
            CODES.DEVICE_CODES.TERMINAL.SERVER_CD,
        ]);
        const years = ref([]);
        const weeks = ref([]);
        const defaultItem = ref({});

        const addnum = () => {
            num.value++;
        }

         const handleFileChange = (e) => {
            file_name.value = e.target.files;
        }

        return {
            file_name, num,
            handleFileChange, addnum
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
.nav {
    margin-bottom: 15px;
    color: #8495fe;
    margin-bottom: 38px;
    div {
        margin-bottom: 13px;
        font-size: 12px;
    }
    span {
        width: 178px;
        height: 24px;
        font-size: 26px;
        font-weight: 500;
        color: #e9ecff;
    }
}

.addfield {
    background-color: #181c38;
    border-color: #181c38;
    margin: 15px 0;
    padding: 20px 39px;

    .box.in {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .approval_wrap {
            display: flex;
            align-items: center;
            span {
                padding-top: 0;
                padding-right: 20px;
            }
        }
        select {
            width: 200px;
            height: 40px;
            background-color: #09152e;
            border: 2px solid #384b93;
            box-sizing: border-box;
            margin: 3px;
            text-align: center;
            border-radius: 5px;
            &:hover {
                border: 2px solid #fff;
            }
        }
        &:nth-child(2) {
            select {
                width: 130px;
            }
            input {
                height: 40px;
                width: 130px;
                background-color: #09152e;
                border: 2px solid #384b93;
                box-sizing: border-box;
                margin: 3px;
                border-radius: 5px;
                &:hover {
                    border: 2px solid #fff;
                }
            }
        }
    }
}

.addarea {
    display: flex;
    background-color: #181c38;
    flex-direction: row-reverse;
    
}
</style>