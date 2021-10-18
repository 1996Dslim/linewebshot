<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>금형관리 > 유지관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value" v-model="meuninfo" value="1" checked><label for="value">금형 정보</label>
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
                        <input type="text" v-model="search" placeholder="Search">
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
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data.id)">
                                    <td>{{ data.moldName }}</td>
                                    <td>{{ data.moldCode }}</td>
                                    <td>{{ moldTypeFormat(data.moldType) }}</td>
                                    <td>{{ moldStateFormat(data.moldState) }}</td>
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
        <MaintenanceDialog v-if="modal" @close-modal="closeModal" :id="id"></MaintenanceDialog>
    </div>
</template>

<script>
import MaintenanceDialog  from "~/components/modal/mold/MaintenanceRegistrationDialog.vue";
import test from "~/assets/data/maintenaceRegistration.json";

import { computed, reactive, ref } from '@vue/reactivity';
import { useStore } from "vuex";
import MoldApi from '~/apis/mold';
import Swal from 'sweetalert2';
import { watchEffect } from '@vue/runtime-core';

export default {
    components: {
        MaintenanceDialog
    },
    setup() {
        const meuninfo = ref('1');

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
        const loading = ref(false);
        const modal =  ref(false);
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

        //temp(datas.value);

        function temp(data) {
            statepage.startOffset = (statepage.pageNum - 1) * statepage.selected;
            statepage.endOffset = (statepage.startOffset + statepage.selected);
            statepage.numofpage = Math.ceil(data.length / statepage.selected);
            statepage.calData = data.slice(statepage.startOffset, statepage.endOffset);
            console.log(statepage.calData);
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

        watchEffect(() => {
            const dump = [];

            datas.value.forEach((value, index) => {
                if(BFmatch(value.moldCode, search.value) || BFmatch(value.moldName, search.value)){
                    dump.push(value)
                }
            });

            temp(dump);
        })

        findList();

        async function findList() {
            try {
                loading.value = true;
                let res = await MoldApi.searchMolds(user.value.companyId, { isSimple: true,} );
                if (res && res.data) {
                    datas.value = res.data;
                    //temp(datas.value);
                }
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    //text: vm.$t('failedAction', [vm.$t('mold')]) + ' ' + vm.$t('tryAgain'),
                });
            } finally {
                loading.value = false;
            }
        }

        return { 
            meuninfo, statepage, modal, id, dataslength, search,
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