<template>
        <div class="nav">
            <div>금형관리 > 금형관리</div>
            <span>금형관리</span> 
        </div>
        <div class="searchfield">
            <select v-model="modalType" class="Press" name="" id="">
                <option value="injection">사출</option>
                <option value="press">프레스</option>
                <option value="die-casting">다이케스팅</option>
            </select>
            <select v-model="moldState" class="Press" name="" id="">
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

            <div class="moldregistration" @click="openRegistrationModal"></div>
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
                            <th>차수</th>
                            <th>자산코드</th>
                            <th>자산명</th>
                            <th>모델명</th>
                            <th>품명</th>
                            <th>최종 SHOT</th>
                            <th>최종 C/T</th>
                            <th>등록일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data.id)">
                            <td>{{ data.id }}</td>
                            <td>{{ data.moldCode }}</td>
                            <td>{{ data.moldName }}</td>
                            <td>{{ data.manufactureOrder }}</td>
                            <td>{{ data.자산코드 }}</td>
                            <td>{{ data.자산명 }}</td>
                            <td>{{ data.모델명 }}</td>
                            <td>{{ data.품명 }}</td>
                            <td>{{ data.shotCount ? String(data.shotCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "" }}</td>
                            <td>{{ data.lastCt }}</td>
                            <td>{{ new Date(data.createdAt) }}</td>
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
        <Modal v-if="modal" @close-modal="closeModal" :id="detailsMold"></Modal>
        <RegistrationModal v-if="registrationmodal" @close-modal="closeRegistrationModal"></RegistrationModal>
</template>

<script>
import Modal from "~/components/modal/mold/ModlModal.vue";
import RegistrationModal from "~/components/modal/mold/ModlModal.vue" //"~/components/modal/mold/ModlRegistrationModal.vue";
import test from "~/assets/data/modl.json";
import _ from "lodash";
import { SETTINGS, CODES } from "~/config";

import CustomCodeApi from "~/apis/commoncd";
import XLSX from 'xlsx';
import MoldApi from "~/apis/mold";
import { useStore } from "vuex";
import { reactive, ref } from '@vue/reactivity';
import { computed, watchEffect } from '@vue/runtime-core';
import Swal from 'sweetalert2';

export default {
    components: {
        Modal,
        RegistrationModal
    },
    setup() {
        const store = useStore();
        const datas = ref([]);
        const dataslength = computed(() => Object.keys(datas.value).length ) ;
        const search = ref("");
        const modal =  ref(false);
        const modalType = ref("injection");
        const moldState = ref("")
        const registrationmodal =  ref(false);
        const detailsMold = ref();
        const registration = ref("register");

        const nowday = new Date();
        const today = String(nowday.getFullYear()).slice(2,4) + ("0" + (nowday.getMonth()+1)).slice(-2) + ("0" + (nowday.getDate())).slice(-2);
        console.log(today);

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        });

        const customCodes = ref([]);

        const columns = ref([
            { text: 'No.', value: 'id', width: 75, fixed: true },
            { text: '금형코드', value: 'moldCode', fixed: true },
            { text: '금형명', value: 'moldName', fixed: true },
            {
            text: '차수',
            value: 'manufactureOrder',
            width: 60,
            sortable: false,
            fixed: true,
            },
        ]);
        
        const headers = computed(() => {
            let cols = _.cloneDeep(columns.value);
            customCodes.value.forEach(cd => {
                if (cd.searchable) {
                    cols.push({
                        text: cd.code,
                        value: cd.code,
                        sortable: true,
                        filterable: cd.searchable,
                    });
                }
            });
            cols.push({ text: '최종 SHOT', value: 'shotCount' });
            cols.push({
                text: '최종 C/T',
                value: 'lastCt',
                width: 100,
            });
            cols.push({
                text: 'createdAt',
                value: 'createdAt',
                width: 190,
            });
            // cols.push({ text: '', value: 'actions', sortable: false });
            return cols;
        });

        const openModal = (id) => {
            detailsMold.value = id
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

        function downloadExcel() {
            if (datas.value.length > 0) {
                let downloadList = [];
                datas.value.forEach((elm, idx) => {
                    let newEl = {};
                    headers.value.forEach(h => {
                        if (h.value === 'createdAt') {
                            newEl[h.text] = elm[h.value];
                        } else if (h.value === 'id') {
                            newEl[h.text] = datas.value.length - idx;
                        } else if (h.value === 'shotCount') {
                            newEl[h.text] = elm[h.value] ? elm[h.value] : '';
                        } else {
                            newEl[h.text] = elm[h.value];
                        }
                    });
                    downloadList.push(newEl);
                });
                console.log("down", downloadList);
                const day = today;
                const dataWS = XLSX.utils.json_to_sheet(downloadList);
                const bookWB = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(bookWB, dataWS, `금형(${day})`);
                XLSX.writeFile(bookWB, `mold-${day}.xlsx`);
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

        temp(datas.value);

        watchEffect(() => {
            const dump = [];

            datas.value.forEach((value, index) => {
                if((BFmatch(value.moldCode, search.value) || BFmatch(value.moldName, search.value)) && match(value.moldType, modalType.value) && match(value.moldState, moldState.value)){
                    dump.push(value)
                }
            });
            console.log(dump);
            temp(dump);
        })
        
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const timeset = (time) => {
            return time.slice(0,10) + " " + time.slice(11,19);
        }

        findList()
        async function findList() {
            //this.loading = true;
            try {
                const res = await MoldApi.searchMolds(user.value.companyId);
                if (res && res.data) {
                    const items = [];
                    const data = _.cloneDeep(res.data);
                    data.forEach((d) => {
                        const item = d.mold;
                        if (item.moldCustoms && item.moldCustoms.length > 0) {
                            item.moldCustoms.forEach((mc) => {
                                item[mc.customCode.code] = mc.customValue;
                            });
                        }
                        item["lastCt"] = d.lastCt;
                        item["shotCount"] = d.lastShotCount;
                        items.push(item);
                    });
                datas.value = items;
                console.log(datas.value);
                }
            } catch (error) {
                // Swal.fire({
                // icon: "error",
                // text:
                //     this.$t("failedAction", [this.$t("mold")]) +
                //     " " +
                //     this.$t("tryAgain"),
                // });
                console.log(error)
            }
            //this.loading = false;
            }
    

        return {
            statepage, modal, dataslength, registrationmodal, search, detailsMold, registration, modalType, moldState,
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