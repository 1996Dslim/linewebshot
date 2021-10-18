<template>
        <div class="nav">
            <div>금형관리 > 유지관리</div>
            <span>유지관리</span> 
        </div>
        <div class="searchfield">
            <select v-model="selectModalType" class="Press" name="" id="">
                <option value="injection">사출</option>
                <option value="press">프레스</option>
                <option value="die-casting">다이케스팅</option>
            </select>
            <select v-model="selectMoldState" class="Press" name="" id="">
                <option value="" selected style="display: none;">-금형상태 선택-</option>
                <option value="mass">양산</option>
                <option value="dev">개발</option>
                <option value="idle">유휴</option>
                <option value="as">A/S</option>
                <option value="disposal">폐기</option>
            </select>
            <select v-model="selectState" class="Press" name="" id="">
                <option value="I">진행 중</option>
                <option value="F">완료</option>
            </select>
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input v-model="search" type="text" placeholder="결과 내 검색 (금형 코드, 금형 명)">
            </div>
            <div class="btn" @click="openTableModal">등록</div>
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
                            <th>금형종류</th>
                            <th>금형상태</th>
                            <th>점검종류</th>
                            <th>점검사항</th>
                            <th>진행상태</th>
                            <th>처리방법</th>
                            <th>작성일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data)">
                            <td>{{ data.id }}</td>
                            <td>{{ data.mold.moldCode }}</td>
                            <td>{{ data.mold.moldName }}</td>
                            <td>{{ moldTypeFormat(data.mold.moldType) }}</td>
                            <td>{{ moldStateFormat(data.mold.moldState) }}</td>
                            <td>{{ checkItemFormat(data.checkItem) }}</td>
                            <td>{{ checkTypeFormat(data.checkType) }}</td>
                            <td>{{ stateFormat(data.state) }}</td>
                            <td>{{ conductMethodFormat(data.conductMethod) }}</td>
                            <td>{{ data.createdAt }}</td>
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
        <Modal v-if="modal" @close-modal="closeModal" v-bind="details"></Modal>
        <InputModal v-if="tablemodal" @close-modal="closeTableModal"></InputModal>
</template>

<script>
import Modal from "~/components/modal/mold/MaintenanceModal.vue";
import InputModal from "~/components/modal/mold/MaintenanceRegistrationModal.vue";
import CustomCodeApi from "~/apis/commoncd";
import MaintenanceApi from "~/apis/maintenance";
import XLSX from 'xlsx';

import { reactive, ref } from '@vue/reactivity';
import { computed, watchEffect } from '@vue/runtime-core';
import { useStore } from "vuex";
import Swal from 'sweetalert2';

export default {
    components: {
        Modal,
        InputModal
    },
    setup() {
        const store = useStore();
        const datas = ref([]);
        const dataslength = Object.keys(datas.value).length;
        const search = ref("");
        const modal =  ref(false);
        const selectModalType = ref("injection");
        const selectMoldState = ref("");
        const selectState = ref("I");
        const tablemodal =  ref(false);

        const loading = ref(false);
        const list = ref([]);
        const moldType = ref([]);
        const moldStates = ref([]);
        const details = ref({ id: -1, moldId: -1 })

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

        const openModal = (item) => {
            if(item) {
                details.value.id = item.id;
                details.value.moldId = item.moldId;
                console.log(details.value)
            }else {
                details
            }
            modal.value = true;
        }
        const closeModal = () => {
            modal.value  = false;
        }
        const openTableModal = () => {
            tablemodal.value = true;
            console.log(tablemodal.value)
        }
        const closeTableModal = () => {
            tablemodal.value  = false;
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

        const moldTypeFormat = (text) => {
            if(text === 'injection'){
                return '사출'
            }
            else if(text === 'press'){
                return '프레스'
            }
            else {
                return '다이케스팅'
            }
        }

        const moldStateFormat = (text) => {
            if(text === 'mass'){
                return '양산'
            }
            else if(text === 'dev'){
                return '개발'
            }
            else if(text === 'idle'){
                return '유휴'
            }
            else if(text === 'as'){
                return 'A/S'
            }
            else {
                return '폐기'
            }
        }

        const checkItemFormat = (text) => {
            if(text === 'N'){
                return '정기점검'
            }
            else if(text === 'D'){
                return '일상점검'
            }
            else if(text === 'A'){
                return 'A/S'
            }
            else {
                return '기타'
            }
        }

        const checkTypeFormat = (text) => {
            if(text === 'C'){
                return '세척'
            }
            else if(text === 'R'){
                return '보수'
            }
            else if(text === 'D'){
                return '금형손상'
            }
            else if(text === 'F'){
                return '이물질'
            }
            else if(text === 'W'){
                return '작동유무'
            }
            else {
                return '기타'
            }
        }

        const stateFormat = (text) => {
            if(text === "I")
                return '진행 중'
            else
                return '완료'
        }

        const conductMethodFormat = (text) => {
            if(text === 'R'){
                return '보수'
            }
            else if(text === 'S'){
                return '간이PM'
            }
            else if(text === 'G'){
                return '구리스유입'
            }
            else {
                return '기타'
            }
        }

        const timeset = (time) => {
            return time.slice(0,10) + " " + time.slice(11,19);
        }


        const headers = ref([
            { text: 'No.', value: 'id', width: 80, sortable: false },
            { text: '금형코드', value: 'mold.moldCode' },
            { text: '금형명', value: 'mold.moldName' },
            { text: '금형종류', value: 'mold.moldType' },
            { text: '금형상태', value: 'mold.moldState' },
            { text: '점검종류', value: 'checkItem' },
            { text: '점검사항', value: 'checkType' },
            { text: '진행상태', value: 'state' },
            { text: '처리방법', value: 'conductMethod' },
            { text: '작성일시', value: 'createdAt', width: 200 },
        ]);

        const nowday = new Date();
        const today = String(nowday.getFullYear()).slice(2,4) + ("0" + (nowday.getMonth()+1)).slice(-2) + ("0" + (nowday.getDate())).slice(-2);

        function downloadExcel() {
            // const mTypes = CODES.MOLD_TYPES[vm.$i18n.locale];
            // const mStates = CODES.MOLD_STATES[vm.$i18n.locale];
            // const checkItems = CODES.CHECK_ITEMS[vm.$i18n.locale];
            // const checkTypes = CODES.CHECK_TYPES[vm.$i18n.locale];
            // const progStates = CODES.PROGRESS_STATE[vm.$i18n.locale];
            // const conductMethods = CODES.CONDUCT_METHODS[vm.$i18n.locale];
            if (datas.value.length > 0) {
                let downloadList = [];
                datas.value.forEach((elm, idx) => {
                    let newEl = {};
                    headers.value.forEach(h => {
                        if (h.value === 'createdAt') {
                            newEl[h.text] = elm[h.value];
                        } else if (h.value === 'mold.moldCode') {
                            newEl[h.text] = elm.mold.moldCode;
                        } else if (h.value === 'mold.moldName') {
                            newEl[h.text] = elm.mold.moldName;
                        } else if (h.value === 'mold.moldType') {
                            newEl[h.text] = elm.mold.moldType;
                        } else if (h.value === 'mold.moldState') {
                            newEl[h.text] = elm.mold.moldState;
                        } else if (h.value === 'checkItem') {
                            newEl[h.text] = elm.checkItem;
                        } else if (h.value === 'checkType') {
                            newEl[h.text] = elm.checkType;
                        } else if (h.value === 'state') {
                            newEl[h.text] = elm.state;
                        } else if (h.value === 'conductMethod') {
                            newEl[h.text] = elm.conductMethod;
                        } else if (h.value === 'id') {
                            newEl[h.text] = datas.value.length - idx;
                        } else {
                            newEl[h.text] = elm[h.value];
                        }
                    });
                    downloadList.push(newEl);
                });
                let day = today;
                let dataWS = XLSX.utils.json_to_sheet(downloadList);
                let bookWB = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(bookWB, dataWS, `유지관리${day}`);
                XLSX.writeFile(bookWB, `유지관리-${day}.xlsx`);
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

        watchEffect(() => {
            const dump = [];

            datas.value.forEach((value, index) => {
                if((BFmatch(value.mold.moldCode, search.value) || BFmatch(value.mold.moldName, search.value))&& match(value.mold.moldType, selectModalType.value) && match(value.mold.moldState, selectMoldState.value) && BFmatch(value.state, selectState.value)){
                    dump.push(value)
                }
            });

            temp(dump);
        })
        getMoldCodes()
        async function getMoldCodes() {
            //const vm = this;
            try {
                let res = await CustomCodeApi.getCodes(1);
                console.log(res.data)
                if (res && res.data) {
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
                }
                console.log(moldType.value, moldStates.value);
            } catch (e) {
                //console.error(e);
            }
        }

        findList();
        async function findList() {
            //const vm = this;
            loading.value = true;
            datas.value = [];
            try {
                let res = await MaintenanceApi.findByCorp(user.value.companyId);
                console.log(res.data);
                if (res && res.data) {
                    datas.value = res.data;
                }
            } catch (e) {
                Swal.fire({
                    icon: "error",
                    html: "데이터 조회에 실패하였습니다.<br>잠시 후 재시도 바랍니다.",
                });
                console.error(e);
            } finally {
                loading.value = false;
            }
        }

        return {
            statepage, modal, dataslength, tablemodal, search, list, details, selectModalType, selectMoldState, selectState,
            openModal, closeModal, prevPage, nextPage, pagereset, openTableModal, closeTableModal, moldTypeFormat, moldStateFormat, checkItemFormat, checkTypeFormat, stateFormat, conductMethodFormat, timeset, downloadExcel
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