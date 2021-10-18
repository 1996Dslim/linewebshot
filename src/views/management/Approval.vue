<template>
        <div class="nav">
            <div>장비관리 > 장비승인요청</div>
            <span>장비승인요청</span> 
        </div>
        <div class="searchfield">
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input v-model="search" type="text" placeholder="결과 내 검색 (장비 ID, 작성자)">
            </div>
            <router-link to="/approval/register" class="title" style="text-decoration: none;">
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
                            <th>장비구분</th>
                            <th>장비 ID</th>
                            <th>진행상태</th>
                            <th>작성자</th>
                            <th>등록일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal">
                            <td>{{ data.id }}</td>
                            <td>{{ data.deviceType }}</td>
                            <td>{{ data.deviceId }}</td>
                            <td>{{ data.expiredAt ? "사용 종료" : "사용 중" }}</td>
                            <td>{{ data.creator.userName }}</td>
                            <td>{{ data.createdAt }}</td>
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

import XLSX from 'xlsx';
import { reactive, ref } from '@vue/reactivity';
import { computed, watchEffect } from '@vue/runtime-core';
import ApprovalApi from "~/apis/approval";
import { SETTINGS, CODES } from "~/config";
import { useStore } from "vuex";
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
        const list = ref([]);

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        })

        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });


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

        const timeset = (time) => {
            return time.slice(0,10) + " " + time.slice(11,19);
        }

        const headers = ref([
            { text: 'No.', value: 'id', width: 80, sortable: false },
            {
                text: '장비구분',
                value: 'deviceType',
                cellClass: 'text-uppercase',
                width: 180,
            },
            { text: '장비 ID', value: 'deviceId', width: 220 },
            { text: '진행상태', value: 'progressState', width: 180 },
            { text: '작성자', value: 'creator.userName', width: 200 },
            { text: '등록일시', value: 'createdAt', width: 200 },
            { text: '', value: 'actions', sortable: false },
        ]); 

        const nowday = new Date();
        const today = String(nowday.getFullYear()).slice(2,4) + ("0" + (nowday.getMonth()+1)).slice(-2) + ("0" + (nowday.getDate())).slice(-2);
        
        function downloadExcel() {
            const progStates = CODES.APPROVAL_PROGRESS_STATE;

            if (datas.value.length > 0) {
                let downloadList = [];
                datas.value.forEach((elm, idx) => {
                    let newEl = {};
                    headers.value.forEach(h => {
                        if (h.value === 'createdAt') {
                            newEl[h.text] = elm[h.value];
                        } else if (h.value === 'deviceType') {
                            newEl[h.text] = elm[h.value].toUpperCase();
                        } else if (h.value === 'progressState') {
                            newEl[h.text] = elm[h.value];
                        } else if (h.value === 'creator.userName') {
                            newEl[h.text] = elm.creator.userName;
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
                XLSX.utils.book_append_sheet(bookWB, dataWS, `장비승인요청(${day})`);
                XLSX.writeFile(bookWB, `장비승인요청-${day}.xlsx`);
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
            ApprovalApi.getApprovalRequestsByCorp(user.value.companyId).then((res) => {
                datas.value = res.data;
                console.log(datas.value)
            });
            //temp(list.value)
        }

        watchEffect(() => {
            const dump = [];

            datas.value.forEach((value, index) => {
                if(BFmatch(value.deviceId, search.value) || BFmatch(value.creator.userName, search.value)){
                    dump.push(value)
                }
            });

            temp(dump);
        })

        return {
            statepage, modal, dataslength, search,
            openModal, closeModal, prevPage, nextPage, pagereset, timeset, downloadExcel
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