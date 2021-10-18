<template>
        <div class="datatable">
            <div class="table_wrap">
                <table>
                    <thead>
                        <tr>
                            <th>점검종류</th>
                            <th>점검사항</th>
                            <th>처리방법</th>
                            <th>수리시작일</th>
                            <th>수리종료일</th>
                            <th>수리처</th>
                            <th>수리상태</th>
                            <th>첨부파일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data.id)">
                            <td>{{ checkTypeFormat(data.checkType) }}</td>
                            <td>{{ checkItemFormat(data.checkItem) }}</td>
                            <td>{{ conductMethodFormat(data.conductMethod) }}</td>
                            <td>{{ timeset(data.startDate) }}</td>
                            <td>{{ timeset(data.endDate) }}</td>
                            <td>{{ data.repairCompany }}</td>
                            <td>{{ stateFormat(data.state) }}</td>
                            <td>첨부파일</td>
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
        <Modal v-if="modal" @close-modal="closeModal" :id="id"></Modal>
</template>

<script>
import Modal from "~/components/MaintenanceDialog.vue";
//import Modal from "~/components/modal/mold/MaintenanceRegistrationDetail.vue";

import { CODES } from "~/config";

//import AttachedFileApi from "~/apis/attachedFile";
import MaintenanceApi from "~/apis/maintenance";

import test from "~/assets/data/maintenancecheck.json";
import { reactive, ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { useStore } from "vuex";
import Swal from 'sweetalert2';

export default {
    props: {
        id: {
            type: Number,
            required: true,
            default: -1,
        },
        moldId: {
            type: Number,
            required: true,
        },
        target: {
            type: String,
            default: "list",
        },
    },
    components: {
        Modal,
    },
    setup(props) {
        const store = useStore();
        const datas = ref([]);
        const dataslength = Object.keys(datas.value).length;

        const id = ref();
        const modal =  ref(false);
        const loading = ref(false);

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

        const openModal = (num) => {
            id.value = num;
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
            else if(text === 'E'){
                return '기타'
            }
            else {
                return ''
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
            else if(text === 'E'){
                return '기타'
            }
            else {
                return ''
            }
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
            else if(text === 'E'){
                return '기타'
            }
            else {
                return ''
            }
        }

        const stateFormat = (text) => {
            if(text === "I")
                return '진행 중'
            else if(text === "F")
                return '완료'
            else
                return ""
        }

        const timeset = (time) => {
            if(time) {
                return time.slice(0,10);
            }
        }

        function temp(data) {
            statepage.startOffset = (statepage.pageNum - 1) * statepage.selected;
            statepage.endOffset = (statepage.startOffset + statepage.selected);
            statepage.numofpage = Math.ceil(data.length / statepage.selected);
            statepage.calData = data.slice(statepage.startOffset, statepage.endOffset);
        }

        getHistory();
        async function getHistory() {
            //this.tagetView = 'history';
            datas.value = [
                {
                text: '점검종류',
                value: 'checkType',
                },
                {
                text: '점검사항',
                value: 'checkItem',
                },
                {
                text: '처리방법',
                value: 'conductMethod',
                },
                {
                text: '수리시작일',
                value: 'startDate',
                },
                {
                text: '수리종료일',
                value: 'endDate',
                },
                {
                text: '수리처',
                value: 'repairCompany',
                },
                {
                text: '수리상태',
                value: 'state',
                },
                {
                text: '첨부파일',
                value: 'fileCnt',
                },
            ];

            try {
                loading.value = true;
                let res = await MaintenanceApi.findHistoryByMold(props.moldId);
                console.log('Get maintenace history...', res);
                if (res && res.data) {
                    datas.value = res.data;
                    temp(datas.value);
                }
            } catch (e) {
                Swal.fire({
                icon: 'error',
                html:
                    '이력조회 중 오류가 발생하였습니다.<br />동일 현상이 반복될 경우, 관리자에게 문의바랍니다.',
                });
            } finally {
                loading.value = false;
            }
        }

        return {
            statepage, modal, dataslength, id,
            openModal, closeModal, prevPage, nextPage, pagereset, checkTypeFormat, checkItemFormat, conductMethodFormat, timeset, stateFormat
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";
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