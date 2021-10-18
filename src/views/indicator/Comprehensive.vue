<template>
        <div class="nav">
            <div>종합지표 > 종합지표</div>
            <span>종합지표</span> 
        </div>
        <div class="searchfield">
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input v-model="search" type="text" placeholder="결과 내 검색 (금형 코드, 금형 명)">
            </div>
            <div class="header">
                <YearMonth @renderCalendar="renderCalendar"/>      
            </div>
            <select v-model="modalType" class="Press" name="" id="">
                <option value="injection">사출</option>
                <option value="press">프레스</option>
                <option value="die-casting">다이케스팅</option>
            </select>
            <select v-model="moldState" class="Press" name="" id="">
                <option value="mass">양산</option>
                <option value="dev">개발</option>
                <option value="idle">유휴</option>
                <option value="as">A/S</option>
                <option value="disposal">폐기</option>
            </select>
            <div class="excel" @click="downloadExcel"></div>
        </div>
        <div class="datatable">
            <div class="table_wrap">
                <table>
                    <thead>
                        <tr>
                            <th>no</th>
                            <th>금형코드</th>
                            <th>금형명</th>
                            <th>카운터 ID</th>
                            <th>최종SHOT</th>
                            <th>최종C/T</th>
                            <th>가동률</th>
                            <th>C/T준수율</th>
                            <th>생산률</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data.moldId)">
                            <td>{{ data.moldId }}</td>
                            <td>{{ data.moldCode }}</td>
                            <td>{{ data.moldName }}</td>
                            <td>{{ data.counterId }}</td>
                            <td>{{ String(data.shot).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</td>
                            <td>{{ data.ct }}</td>
                            <td>{{ data.activeRate }} %</td>
                            <td>{{ data.ctRate === 0 ? "-" : data.ctRate }}</td>
                            <td>{{ data.outputRate }} %</td>
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
        <Modal v-if="modal" @close-modal="closeModal" :id="detailsIndicator"></Modal>
</template>

<script>
import Modal from "~/components/modal/indicator/IndicatorModal.vue";
import YearMonth from "~/components/YearMonth.vue"

import test from "~/assets/data/tableTest.json";
import XLSX from 'xlsx';
import { reactive, ref } from '@vue/reactivity';
import { computed, onBeforeUpdate, onUpdated, watchEffect } from '@vue/runtime-core';
import StatisticApi from "~/apis/statistic";
import { SETTINGS, CODES } from "~/config";
import { useStore } from "vuex";
import Swal from 'sweetalert2';

export default {
    components: {
        Modal,
        YearMonth
    },
    setup() {
        const store = useStore();
        const datas = ref(test);
        const dataslength = Object.keys(test).length;
        const search = ref("");
        const modal =  ref(false);
        const modalType = ref("injection");
        const moldState = ref("mass")
        const selectedMonth = ref();//new Date().toISOString().substr(0, 7);
        const detailsIndicator = ref();
        const loading = ref(false);
        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        })

        const headers = ref([
            { text: 'No.', value: 'id', width: 80, sortable: false, fixed: true },
            { text: '금형코드', value: 'moldCode', fixed: true },
            { text: '금형명', value: 'moldName', fixed: true },
            { text: '카운터 ID', value: 'counterId', width: 180, fixed: true },
            { text: '최종SHOT', value: 'shot' },
            { text: '최종C/T', value: 'ct' },
            { text: '가동률', value: 'activeRate' },
            { text: 'C/T 준수율', value: 'ctRate' },
            { text: '생산률', value: 'outputRate' },
        ])

        const openModal = (id) => {
            detailsIndicator.value = id;
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

        temp(datas.value);

        watchEffect(() => {
            const dump = [];

            datas.value.forEach((value, index) => {
                if((BFmatch(value.moldName, search.value) || BFmatch(value.moldCode, search.value)) && BFmatch(value.moldType, modalType.value) && BFmatch(value.moldState, moldState.value)){
                    dump.push(value)
                }
            });
            temp(dump);
        })

        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        function renderCalendar(testyear, testmonth) {
            selectedMonth.value = String(testyear)+String("0" + testmonth).slice(-2);
            findList();
        }

        //excel
        function downloadExcel() {
            if (datas.value.length > 0) {
                    let downloadList = [];
                    datas.value.forEach((elm, idx) => {
                        let newEl = {};
                        headers.value.forEach(h => {
                            if (h.value === 'createdAt') {
                                newEl[h.text] = elm[h.value];
                            } else if (h.value === 'shot') {
                                newEl[h.text] = elm[h.value] ? elm[h.value] : '';
                            } else if (h.value === 'id') {
                                newEl[h.text] = datas.value.length - idx;
                            } else {
                                newEl[h.text] = elm[h.value];
                            }
                        });
                        downloadList.push(newEl);
                    });
                console.log("down",downloadList);
                console.log("sekec",selectedMonth.value)
                const day = _.cloneDeep(selectedMonth.value).replace('-', '');
                const dataWS = XLSX.utils.json_to_sheet(downloadList);
                const bookWB = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(bookWB, dataWS, `종합지표(${day})`);
                XLSX.writeFile(bookWB, `종합지표-${day}.xlsx`);
                return;
            }
            Swal.fire({
                text: '엑셀로 저장 할 데이터가 없습니다.',
            });
        }

        async function findList() {
            loading.value = true;
            try {
                    const res = await StatisticApi.findMoldTotalIndicatorByMonth(
                    selectedMonth.value.replace("-", ""),
                    user.value.companyId
                    );
                if (res && res.data) {
                    datas.value = res.data;
                }
            } catch (error) {
                // Swal({
                // icon: "error",
                // text:
                //     this.$t("failedAction", [this.$t("mold")]) +
                //     " " +
                //     this.$t("tryAgain"),
                // });
                console.log(error)
            } finally {
                loading.value = false;
            }
        }

    
        return {
            statepage, modal, dataslength, search, detailsIndicator, modalType, moldState,
            openModal, closeModal, prevPage, nextPage, pagereset, renderCalendar, downloadExcel
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