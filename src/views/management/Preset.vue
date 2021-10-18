<template>
        <div class="nav">
            <div>장비관리 > 카운터 Preset</div>
            <span>카운터 PreSet</span> 
        </div>
        <div class="searchfield">
            <select v-model="activated" class="Press" name="" id="">
                <option value="N" selected>진행 중</option>
                <option value="Y">완료</option>
            </select>
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input v-model="search" type="text" placeholder="결과 내 검색">
            </div>
            <div class="btn" @click="openModal()">
                PRESET 카운터
            </div>
            <div class="excel" @click="downloadExcel"></div>
        </div>
        <div class="datatable">
            <div class="table_wrap">
                <table>
                    <thead>
                        <tr>
                            <th>no</th>
                            <th>카운터 ID</th>
                            <th>금형명</th>
                            <th>SHOT 변경 값</th>
                            <th>충격센서</th>
                            <th>알림등록</th>
                            <th>진행상태</th>
                            <th>저장일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data)">
                            <td>{{ data.moldId }}</td>
                            <td>{{ data.counterId }}</td>
                            <td>{{ data.moldName }}</td>
                            <td>{{ String(data.presetValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</td>
                            <td>{{ data.shockThreshold }}</td>
                            <td>{{ data.alarmValue }}</td>
                            <td>{{ data.activated === 'N' ? '진행 중' : timeset(data.appliedAt) }}</td>
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
        <Modal v-if="modal" @close-modal="closeModal" :editItem="editedItem"></Modal>
        <RegistrationModal v-if="registrationmodal" @close-modal="closeRegistrationModal"></RegistrationModal>
</template>

<script>
import Modal from "~/components/modal/management/PresetModal.vue";
import RegistrationModal from "~/components/modal/management/PresetRegistrationModal.vue";
import { reactive, ref } from '@vue/reactivity';
import { computed, watchEffect } from '@vue/runtime-core';
import CounterApi from "~/apis/counter";
import { SETTINGS, CODES } from "~/config";
import { useStore } from "vuex";
import XLSX from 'xlsx';

import test from "~/assets/data/preset.json";
import Swal from 'sweetalert2';


export default {
    components: {
        Modal,
        RegistrationModal
    },
    setup() {
        const store = useStore();
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const datas = ref([]);
        const dataslength = Object.keys(datas.value).length;
        const search = ref("");
        const modal =  ref(false);
        const activated = ref("N");
        const registrationmodal =  ref(false);
        const id = ref();
        const target = ref();
        const editedItem = ref({});

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        })

        const openModal = (num) => {
            if(num){
                //id.value = num.moldId;
                editedItem.value = num;
                //target.value = "preset";
            }
            else {
                editedItem.value.id = 'register';
            }
            console.log('>>>>> This edit item...', editedItem.value);
            modal.value = true;
        }
        const closeModal = () => {
            modal.value  = false;
        }
        const openRegistrationModal = () => {
            registrationmodal.value = true;
        }
        const closeRegistrationModal = () => {
            registrationmodal.value  = false;
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
            { text: '카운터 ID', value: 'counterId', width: 220 },
            { text: '금형명', value: 'moldName' },
            { text: 'SHOT 변경 값', value: 'presetValue', width: 200 },
            { text: '충격센서', value: 'shockThreshold', width: 150 },
            { text: '알람등록', value: 'alarmValue', width: 150 },
            { text: '진행상태', value: 'activated', width: 180 },
            { text: '저장일시', value: 'createdAt', width: 200 }, 
        ]);

        const nowday = new Date();
        const today = String(nowday.getFullYear()).slice(2,4) + ("0" + (nowday.getMonth()+1)).slice(-2) + ("0" + (nowday.getDate())).slice(-2);

        function downloadExcel() {
            if (datas.value.length > 0) {
                let downloadList = [];
                datas.value.forEach((elm, idx) => {
                    let newEl = {};
                    headers.value.forEach(h => {
                        if (h.value === 'createdAt') {
                            newEl[h.text] = elm[h.value];
                        } else if (h.value === 'activated') {
                            newEl[h.text] = elm[h.value] === 'N' ? '진행중' : elm.appliedAt;
                        } else if (h.value === 'presetValue' || h.value === 'alarmValue') {
                            newEl[h.text] = elm[h.value] ? elm[h.value] : '';
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
                XLSX.utils.book_append_sheet(bookWB, dataWS, `카운터PreSet(${day})`);
                XLSX.writeFile(bookWB, `counter-preset-${day}.xlsx`);
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

            if(txt === null) {
                return false;
            }
            else {
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
        }

        //temp(datas.value);

        findList();
        function findList() {
            datas.value = [];
            CounterApi.getCounterPresets(user.value.companyId).then((res) => {
                console.log(res.data)
                if (res.data) {
                    datas.value = res.data;
                // this.totalSize = this.list.length;
                }
            });
        }

        watchEffect(() => {
            const dump = [];
            datas.value.forEach((value, index) => {
                if(((BFmatch(value.counterId, search.value) || BFmatch(value.moldName, search.value)) || BFmatch(String(value.presetValue), search.value)) && BFmatch(value.activated, activated.value) ){
                    dump.push(value)
                }
            });

            temp(dump);
        })

        return {
            statepage, modal, dataslength, registrationmodal, search, activated, id, target, editedItem,
            openModal, closeModal, prevPage, nextPage, pagereset, openRegistrationModal, closeRegistrationModal, timeset, downloadExcel
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