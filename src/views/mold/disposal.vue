<template>
        <div class="nav">
            <div>금형관리 > 폐기관리</div>
            <span>폐기관리</span> 
        </div>
        <div class="searchfield">
            <select class="Press" name="" id="">
                <option value="">사출</option>
                <option value="">프레스</option>
                <option value="">다이케스팅</option>
            </select>
            <select class="Press" name="" id="">
                <option value="" selected style="display: none;">금형상태</option>
                <option value="">양산</option>
                <option value="">개발</option>
                <option value="">유휴</option>
                <option value="">A/S</option>
                <option value="">폐기</option>
            </select>
            <select class="Press" name="" id="">
                <option value="" selected >진행 중</option>
                <option value="">완료</option>
            </select>
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input type="text" placeholder="결과 내 검색 (금형 코드, 금형 명)" v-model="search">
            </div>
            <div class="btn" @click="openRegistrationModal">등록</div>
            <div class="excel"></div>
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
                            <th>카운터</th>
                            <th>최종Shot</th>
                            <th>폐기사유</th>
                            <th>진행상태</th>
                            <th>작성일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal">
                            <td>{{ data.moldId }}</td>
                            <td>{{ data.moldName }}</td>
                            <td>{{ data.moldCode }}</td>
                            <td>{{ data.moldType }}</td>
                            <td>{{ data.moldState }}</td>
                            <td>{{ data.counterId }}</td>
                            <td>{{ data.ct }}</td>
                            <td>{{ data.reason }}</td>
                            <td>{{ data.state }}</td>
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
        <Modal v-if="modal" @close-modal="closeModal">
        </Modal>
        <RegistrationModal v-if="Registrationmodal" @close-modal="closeRegistrationModal">
        </RegistrationModal>
</template>

<script>
import Modal from "~/components/modal/mold/ModlModal.vue";
import RegistrationModal from "~/components/modal/mold/DisposalRegistrationModal.vue";
import _ from 'lodash';
import XLSX from 'xlsx';

import { SETTINGS, CODES } from '~/config';

import DisposalApi from '~/apis/disposal';
import CustomCodeApi from '~/apis/commoncd';
import { useStore } from "vuex";

import test from "~/assets/data/tableTest.json";
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
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });
        const datas = ref([]);
        const dataslength = Object.keys(datas.value).length;

        const modal =  ref(false);
        const Registrationmodal =  ref(false);
        const search = ref("");

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        });

        const loading = ref(false);

        const openModal = () => {
            modal.value = true;
        }
        const closeModal = () => {
            modal.value  = false;
        }
        const openRegistrationModal = () => {
            Registrationmodal.value = true;
        }
        const closeRegistrationModal = () => {
            Registrationmodal.value  = false;
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
                if(BFmatch(value.moldName, search.value) || BFmatch(value.moldCode, search.value)){
                    dump.push(value)
                }
            });
            temp(dump);
        })

        findList();
        async function findList() {
            loading.value = true;
            datas.value = [];
            try {
                let res = await DisposalApi.findByCorp(user.value.companyId);
                console.log("disposal res", res.data)
                if (res && res.data) {
                    datas.value = res.data;
                }
            } catch (e) {
            Swal.fire({
                icon: 'error',
                html: '데이터 조회에 실패하였습니다.<br>잠시 후 재시도 바랍니다.',
            });
            console.error(e);
            } finally {
                loading.value = false;
            }
        }

        return {
            statepage, modal, Registrationmodal, dataslength, search,
            openModal, closeModal, prevPage, nextPage, pagereset, openRegistrationModal, closeRegistrationModal
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