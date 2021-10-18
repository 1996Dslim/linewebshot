<template>
        <div class="nav">
            <div>장비관리 > 터미널 관리</div>
            <span>터미널 관리</span> 
        </div>
        <div class="min_info">
            <div class="min_info_from">
                <div class="min_info_img"></div>
                <div class="min_info_title">터미널 등록수</div>
                <div class="min_info_num">{{terminalCnt.totalCnt}} EA</div>
            </div>
            <div class="min_info_from">
                <div class="min_info_img"></div>
                <div class="min_info_title">가동수</div>
                <div class="min_info_num">{{ terminalCnt.actCnt }} EA</div>
            </div>
            <div class="min_info_from">
                <div class="min_info_img"></div>
                <div class="min_info_title">가동률</div>
                <div class="min_info_num">{{ terminalCnt.actRate }} %</div>
            </div>
        </div>
        <div class="searchfield">
            <select class="Press" name="" id="">
                <option value="" selected>사용 중</option>
                <option value="">사용 종료</option>
            </select>
            <select v-model="selectCommState" class="Press" name="" id="">
                <option value="" disabled selected style="display: none;">통신상태</option>
                <option value="G">정상</option>
                <option value="Y">확인요청</option>
                <option value="R">문제발생</option>
            </select>
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input v-model="search" type="text" placeholder="결과 내 검색">
            </div>
            <router-link to="/terminal/register" class="title" style="text-decoration: none;">
                <div class="btn">
                    승인요청
                </div>
            </router-link>
            <div class="excel" @click="downloadExcel"></div>
        </div>
        <div class="datatable">
            <div class="table_wrap">
                <table>
                    <thead>
                        <tr>
                            <th>no</th>
                            <th>터미널 ID</th>
                            <th>설치위치</th>
                            <th>진행상태</th>
                            <th>수신상태</th>
                            <th>수신일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal">
                            <td>{{ data.id }}</td>
                            <td>{{ data.terminalId }}</td>
                            <td>{{ data.locationName }}</td>
                            <td>{{ expiredAtFormat(data.expiredAt) }}</td>
                            <td>{{ communicationStateFormat(data.communicationState) }}</td>
                            <td>{{ data.communicatedAt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer">
                <div>
                    Rows per page:
                    <select @change="statepage.pageNum = 1"  v-model.number="statepage.selected" style="width: 60px; height: 32px; padding-left: 15px; box-sizing: border-box;" name="" id="">
                        <option :value=5>5</option>
                        <option :value=10 selected>10</option>
                        <option :value=15>15</option>
                        <option :value=25 >25</option>
                        <option :value=50 >50</option>
                        <option >All</option>
                    </select>
                    1 - <span>{{ statepage.selected }}</span> of {{ dataslength }}
                </div>
            </div>
        </div>

        <ul class="pagenav">
            <li><button @click="prevPage()" class="prebtn" :disabled="statepage.pageNum === 1">&lt;</button></li>
            <li v-for="page in statepage.numofpage" :key="page" :class="`page ${page === statepage.pageNum ? 'active' : ''}`" :value="statepage.page" @click="statepage.pageNum = page"><button>{{ page }}</button></li>
            <li><button @click="nextPage()" class="nextbtn" :disabled="statepage.pageNum === statepage.numofpage">&gt;</button></li>
        </ul>
        <Modal v-if="modal" @close-modal="closeModal">
        </Modal>
</template>

<script>
import Modal from "~/components/modal/indicator/IndicatorModal.vue";

import _ from "lodash";
import { useStore } from "vuex";
import { reactive, ref } from '@vue/reactivity';
import { computed, watchEffect } from '@vue/runtime-core';
import { SETTINGS, CODES } from "~/config";
import TerminalApi from "~/apis/terminal";
import XLSX from 'xlsx';

import test from "~/assets/data/terminal.json";
import Swal from 'sweetalert2';


export default {
    components: {
        Modal,
    },
    setup() {
        const store = useStore();
        const datas = ref([]);
        const dataslength = Object.keys(datas.value).length;
        const search = ref("");
        const modal =  ref(false);
        const selectCommState = ref("");
        const progressState = ref(null);
        const progressStates = ref(CODES.DEVICE_PROGRESS_STATE);
        const terminalCnt = ref({
            totalCnt: 0,
            actCnt: 0,
            actRate: 0,
        })

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        });

        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const communicationStateFormat = (text) => {
            if(text === "G"){
                return '정상';
            }
            else if(text === 'Y') {
                return '확인요청'
            }
            else {
                return '문제발생';
            }
        }

        const expiredAtFormat = (text) => {
            if(text === null){
                return '사용 중';
            }
            else {
                return '사용 종료';
            }
        }

        const timeset = (time) => {
            return time.slice(0,10) + " " + time.slice(11,19);
        }


        const openModal = () => {
            modal.value = true;
        }
        const closeModal = () => {
            modal.value  = false;
        }
        const prevPage = () => {
            statepage.pageNum -= 1;
        }
        const nextPage = () => {
            statepage.pageNum += 1;
        }
        const pagereset = () => {
            statepage.pageNum = 1;
        }

        const headers = ref([
            { text: 'No.', value: 'id', width: 80, sortable: false },
            { text: '터미널 ID', value: 'terminalId', width: 220 },
            { text: '설치위치', value: 'locationName' },
            {
                text: '진행상태',
                value: 'progressState',
                width: 200,
            },
            {
                text: '수신상태',
                value: 'communicationState',
                width: 200,
            },
            {
                text: '수신일시',
                value: 'communicatedAt',
                width: 200,
            },
            { text: '', value: '', sortable: false },
        ]);

        const nowday = new Date();
        const today = String(nowday.getFullYear()).slice(2,4) + ("0" + (nowday.getMonth()+1)).slice(-2) + ("0" + (nowday.getDate())).slice(-2);

        function downloadExcel() {
            if (datas.value.length > 0) {
                let downloadList = [];
                datas.value.forEach((elm, idx) => {
                    let newEl = {};
                    headers.value.forEach(h => {
                        if (h.value === 'createdAt' || h.value === 'communicatedAt') {
                            newEl[h.text] = elm[h.value] ? elm[h.value] : '';
                        } else if (h.value === 'progressState') {
                            newEl[h.text] = elm.expiredAt ? `사용 종료(${elm.expiredAt})` : '사용 중';
                        } else if (h.value === 'communicationState') {
                            newEl[h.text] = elm[h.value]
                        } else if (h.value === 'id') {
                            newEl[h.text] = datas.value.length - idx;
                        } else {
                            newEl[h.text] = elm[h.value];
                        }
                    });
                    downloadList.push(newEl);
                });
                const day = today;
                const dataWS = XLSX.utils.json_to_sheet(downloadList);
                const bookWB = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(bookWB, dataWS, `터미널(${day})`);
                XLSX.writeFile(bookWB, `terminal-${day}.xlsx`);
                return;
            }
            Swal.fire({
                text: '엑셀로 저장 할 데이터가 없습니다.',
            });
        }
        
        function temp(data) {
            statepage.startOffset = (statepage.pageNum - 1) * statepage.selected;
            statepage.endOffset = (statepage.startOffset + statepage.selected);
            statepage.numofpage = Math.ceil(data.length / statepage.selected);
            statepage.calData = data.slice(statepage.startOffset, statepage.endOffset);
        }

        function BFmatch(txt, pat) {
            let pt = 0;
            let pp = 0;
            
            while(pt != txt.length && pp != pat.length) {
                if(txt.charAt(pt) == pat.charAt(pp)) {
                    pt++;
                    pp++;
                }
                else {
                    pt = pt - pp + 1;
                    pp = 0;
                }
            }
            if(pp == pat.length) {
                return true;
            }
            return false;
        }

        //temp(datas.value);
        
        findList();
        function findList() {
            datas.value = [];
            TerminalApi.getTerminals(user.value.companyId).then((res) => {
                console.log(res.data);
                if (res.data) {
                    terminalCnt.value.totalCnt = res.data.registeredCnt;
                    terminalCnt.value.actCnt = res.data.greenCnt;
                    terminalCnt.value.actRate = (
                    (res.data.greenCnt / res.data.registeredCnt) *
                    100
                    ).toFixed(0);
                    datas.value = res.data.list;
                }
            });
        }
    
        watchEffect(() => {
            const dump = [];

            datas.value.forEach((value, index) => {
                if((BFmatch(value.terminalId, search.value) || BFmatch(value.locationName, search.value)) && BFmatch(value.communicationState, selectCommState.value)){
                    dump.push(value)
                }
            });
            console.log(dump);
            temp(dump);
        })

        return {
            statepage, modal, dataslength, search, terminalCnt, selectCommState,
            openModal, closeModal, prevPage, nextPage, pagereset, communicationStateFormat, expiredAtFormat, timeset, downloadExcel
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";
    $color-1: rgb(6, 155, 109); 
    $color-2: rgb(32, 134, 212);
    $color-3: rgb(147, 100, 245);


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

    .min_info {
        height: 52px;
        margin-bottom: 15px;
        display: flex;
        gap: 1em;
        justify-content: space-between;
        height: 52px;
        width: 100%;

        //background-color: orange;

        .min_info_from {
            display: flex;
            justify-content: center;
            align-items: center;
            
            &:nth-child(1) {
                border-bottom: 5px solid rgb(6, 155, 109);
                color: rgb(6, 155, 109);
            }
            &:nth-child(2) {
                border-bottom: 5px solid rgb(32, 134, 212);
                color: rgb(32, 134, 212);
            }
            &:nth-child(3) {
                border-bottom: 5px solid rgb(147, 100, 245);
                color: rgb(147, 100, 245);
            }
            .min_info_img {
                height: 24px;
                width: 24px;
                margin-left: 20px;
            }

            .min_info_title{
                margin: 0 20px;
                
            }

            .min_info_num {
                height: 36px;
                width: 270px;
                text-align: center;
                line-height: 36px;
                background-color: rgb(19, 28, 51);
                border: 1px solid rgb(55, 78, 158);
                margin-right: 20px;
            }
            @for $i from 1 through 3 {
                &:nth-child(#{$i}) .min_info_img  {
                    background-image: url("~/assets/terminal/ico_operation.#{$i}.png");
                }
            }
        }
    }

    .pagenav {
        display: flex;
        align-items: center;
        justify-content: center;
        
        button {
            width: 34px;
            height: 34px;
            background-color: #212c42;
            font-size: 16px;
            font-weight: 400;
            color: #5a7786;
            margin: 0 5px;
            border-radius: 5px;
            outline: 0;
            border: 0;
        }

        .prebtn,
        .nextbtn {
            color: #263cab;
            font-size: 24px;

            &:disabled {
                background-color: #17233e;
            }
        }

        .page {
            &.active {
                button {
                    background-color: royalblue;
                    color: #fff;
                }
            }
        }
    }
</style>