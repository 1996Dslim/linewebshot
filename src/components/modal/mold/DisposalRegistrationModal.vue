<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>금형관리 > 폐기관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value" v-model="meuninfo" value="1"><label for="value">금형 선택</label>
                    </div>         
                </div>
                <div class="btnarea">
                    <div class="btn" @click="$emit('close-modal')">
                        <span class="material-icons">
                            close
                        </span>
                        <span>닫 기</span>
                    </div>
                </div>
            </div>
            <div class="modal_body">
                <div class="searchfield">
                    <div class="box search">
                        <span class="material-icons">
                            search
                        </span>
                        <input type="text" v-model="search" placeholder="결과 내 검색 (금형 코드, 금형 명)">
                    </div>
                </div>
                <div class="datatable">
                    <div class="table_wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>금형코드</th>
                                    <th>금형명</th>
                                    <th>금형종류</th>
                                    <th>금형상태</th>
                                    <th>카운터</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data.mold.id)">
                                    <td>{{ data.mold.moldCode }}</td>
                                    <td>{{ data.mold.moldName }}</td>
                                    <td>{{ moldTypeFormat(data.mold.moldType) }}</td>
                                    <td>{{ moldStateFormat(data.mold.moldState) }}</td>
                                    <td>{{ data.counterId }}</td>
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
                
            </div>
        </div>
        <DisposalDialog v-if="modal" @close-modal="closeModal" :id="id"></DisposalDialog>
    </div>
</template>

<script>
import DisposalDialog  from "~/components/modal/mold/DisposalRegistrationDialog.vue";

import { SETTINGS, CODES } from '~/config';
import MoldApi from '~/apis/mold';
import { useStore } from "vuex";

import { computed, reactive, ref } from '@vue/reactivity';
import { watchEffect } from '@vue/runtime-core';
import Swal from 'sweetalert2';

export default {
    components: {
        DisposalDialog
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
        const meuninfo = ref('1');

        const datas = ref([]);
        const dataslength = Object.keys(datas.value).length;

        const modal =  ref(false);

        const loading = ref(false);
        const id = ref();
        const search = ref("");

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: 0,
            endOffset: 0,
            numofpage: 0,
            calData : []
        })

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
                if(BFmatch(value.mold.moldCode, search.value) || BFmatch(value.mold.moldName, search.value)){
                    dump.push(value)
                }
            });
            temp(dump);
        })

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

        findMolds();
        async function findMolds() {
            loading.value = true;
            datas.value = [];
            try {
                let res = await MoldApi.searchMoldCounters(user.value.companyId);
                if (res && res.data) {
                    datas.value = res.data.filter(rd => !rd.expiredAt);
                }
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    //text:
                        //vm.$t('failedAction', [vm.$t('mold')]) + ' ' + vm.$t('tryAgain'),
                    });
                    console.error(e);
            } finally {
                loading.value = false;
            }
            console.log(datas.value)
        }

        return { 
            meuninfo, statepage, modal, dataslength, id, search,
            openModal, closeModal, prevPage, nextPage, pagereset, moldTypeFormat, moldStateFormat
        }
    }
}
</script>


<style lang="scss" scoped>
@import '~/scss/main.scss';

//페이징
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