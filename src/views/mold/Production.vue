<template>
        <div class="nav">
            <div>금형관리 > 생산관리</div>
            <span>생산관리</span> 
        </div>
        <div class="searchfield">
            <select v-model="selectModalType" class="Press" name="" id="">
                <option value="injection">사출</option>
                <option value="press">프레스</option>
                <option value="die-casting">다이케스팅</option>
            </select>
            <select v-model="selectMoldState" class="Press" name="" id="">
                <option value="" selected style="display: none;">금형상태</option>
                <option value="mass">양산</option>
                <option value="dev">개발</option>
                <option value="idle">유휴</option>
                <option value="as">A/S</option>
                <option value="disposal">폐기</option>
            </select>
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input v-model="search" type="text" placeholder="결과 내 검색 (금형 코드, 금형 명)">
            </div>
            <div class="excel" @click="downloadExcel"></div>
        </div>
        <div class="datatable">
            <div class="table_wrap">
                <table>
                    <thead>
                        <tr>
                            <th>no.</th>
                            <th>금형코드</th>
                            <th>금형명</th>
                            <th>카운터 ID</th>
                            <th>CAVITY</th>
                            <th>최종 SHOT</th>
                            <th>최동 C/T</th>
                            <th>생산량</th>
                            <th>수신일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data.moldId)">
                            <td>{{ data.moldId }}</td>
                            <td>{{ data.moldCode }}</td>
                            <td>{{ data.moldName }}</td>
                            <td>{{ data.counterId }}</td>
                            <td>{{ data.cavity }}</td>
                            <td>{{ String(data.shotCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')  }}</td>
                            <td>{{ data.ct }}</td>
                            <td>{{ String(data.output).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</td>
                            <td>{{ dayformat(data.lastReceivedAt) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer">
                <div>
                    Rows per page:
                    <select @change="statepage.pageNum = 1" v-model.number="statepage.selected" style="width: 60px; height: 32px; padding-left: 15px; box-sizing: border-box;" name="" id="">
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

        <div class="pagenav">
            <li><button @click="prevPage()" class="prebtn" :disabled="statepage.pageNum === 1">&lt;</button></li>
            <li v-for="page in statepage.numofpage" :key="page" :class="`page ${page === statepage.pageNum ? 'active' : ''}`" :value="statepage.page" @click="statepage.pageNum = page"><button>{{ page }}</button></li>
            <li><button @click="nextPage()" class="nextbtn" :disabled="statepage.pageNum === statepage.numofpage">&gt;</button></li>
        </div>
        <Modal v-if="modal" @close-modal="closeModal" :id="detailsIndicator"></Modal>
</template>

<script>
import Modal from "~/components/modal/mold/ProductionModal.vue";
import _ from "lodash";
import { useStore } from "vuex";
import MoldApi from "~/apis/mold";
import CustomCodeApi from "~/apis/commoncd";
import ProductionApi from "~/apis/production";
import { SETTINGS, CODES } from "~/config";
import XLSX from 'xlsx';

import test from "~/assets/data/production.json";

import { reactive, ref } from '@vue/reactivity';
import { computed, watchEffect } from '@vue/runtime-core';
import Swal from 'sweetalert2';

export default {
    components: {
        Modal
    },
    setup() {
        const detailsIndicator = ref();
        const store = useStore();
        const datas = ref([]);
        const dataslength = Object.keys(datas.value).length;
        const search = ref("");
        const modal =  ref(false);
        const selectModalType = ref("injection");
        const selectMoldState = ref("");
        const moldTypes = ref([]);
        const moldStates = ref([]);
        const loading = ref(false);
        const list = ref([]); 

        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        })

        const openModal = (num) => {
            detailsIndicator.value = num;
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

        const dayformat = (day) => {
            return day.slice(0,4) + "-" + day.slice(4,6) + "-" + day.slice(6,8) + " " + day.slice(8,10) + ":" + day.slice(10,12) + ":" + day.slice(12,14)
        }

        const headers = ref([
            { text: 'No.', value: 'id', width: 80, sortable: false, fixed: true },
            { text: '금형코드', value: 'moldCode', fixed: true },
            { text: '금형명', value: 'moldName', fixed: true },
            { text: '카운터 ID', value: 'counterId', fixed: true },
            { text: 'CAVITY', value: 'cavity', width: 80, sortable: false },
            { text: '최종 SHOT', value: 'shotCount' },
            { text: '최종 C/T', value: 'ct' },
            { text: '생산량', value: 'output' },
            { text: '수신일시', value: 'lastReceivedAt', width: 200 },
        ]);

        const nowday = new Date();
        const today = String(nowday.getFullYear()).slice(2,4) + ("0" + (nowday.getMonth()+1)).slice(-2) + ("0" + (nowday.getDate())).slice(-2);

        function downloadExcel() {
            if (list.value.length > 0) {
                let downloadList = [];
                list.value.forEach((elm, idx) => {
                    let newEl = {};
                    headers.value.forEach(h => {
                        if (h.value === 'lastReceivedAt') {
                            newEl[h.text] = elm[h.value];
                        } else if (h.value === 'shotCount') {
                            newEl[h.text] = elm.shotCount ? elm.shotCount : '';
                        } else if (h.value === 'output') {
                            newEl[h.text] = elm.output ? elm.output : '';
                        } else if (h.value === 'ct') {
                            newEl[h.text] = elm.ct;
                        } else if (h.value === 'id') {
                            newEl[h.text] = list.value.length - idx;
                        } else {
                            newEl[h.text] = elm[h.value];
                        }
                    });
                    downloadList.push(newEl);
                });
                const day = today;
                const dataWS = XLSX.utils.json_to_sheet(downloadList);
                const bookWB = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(bookWB, dataWS, `생산관리(${day})`);
                XLSX.writeFile(bookWB, `생산관리-${day}.xlsx`);
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
        function match(txt, pat) {
            if(pat === ""){
                return true;
            }
            else {
                if(txt === pat){
                    return true;
                }
                else{
                    return false
                }
            }
        }

        temp(list.value);

        watchEffect(() => {
            const dump = [];
            list.value.forEach((value, index) => {
                if((BFmatch(value.moldCode, search.value) || BFmatch(value.moldName, search.value)) && match(value.moldType, selectModalType.value) && match(value.moldState, selectMoldState.value)){
                    dump.push(value)
                }
            });

            temp(dump);
        })

        getMoldCodes();
        findList();
        async function getMoldCodes() {
            CustomCodeApi.getCodes(1).then((res) => {
                console.log("test",res.data)
                res.data.forEach((cd) => {
                    if (cd.code === "MOLD_TYPES") {
                        moldTypes.value = JSON.parse(cd.codeElements);
                        return;
                    }
                    if (cd.code === "MOLD_STATES") {
                        moldStates.value = JSON.parse(cd.codeElements);
                        return;
                    }
                });
            });
        }

        async function findList() {
            loading.value = true;
            list.value = [];
            try {
                const res = await ProductionApi.findMoldsByCorp(user.value.companyId);
                if (res && res.data) {
                    list.value = res.data;
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    html: "데이터 조회에 실패하였습니다.<br>잠시 후 재시도 바랍니다.",
                });
            } finally {
                loading.value = false;
            }
        }

        return {
            statepage, modal, dataslength, search, detailsIndicator, selectModalType, selectMoldState,
            openModal, closeModal, prevPage, nextPage, pagereset, dayformat, downloadExcel
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