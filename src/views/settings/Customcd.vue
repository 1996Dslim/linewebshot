<template>
        <div class="nav">
            <div>설정관리 > 금형코드관리</div>
            <span>금형코드관리</span> 
        </div>
        <div class="searchfield">
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input v-model="search" type="text" placeholder="결과 내 검색 (코드, 코드 명)">
            </div>
            <div class="btn" @click="openModal()">
                금형코드 등록
            </div>
        </div>
        <div class="datatable">
            <div class="table_wrap">
                <table>
                    <thead>
                        <tr>
                            <th>no</th>
                            <th>코드</th>
                            <th>코드 명</th>
                            <th>코드유형</th>
                            <th>화면표시</th>
                            <th>검색허용</th>
                            <th>등록일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal(data)">
                            <td>{{data.id}}</td>
                            <td>{{data.code}}</td>
                            <td>{{data.codeName}}</td>
                            <td>{{data.codeType}}</td>
                            <td>{{data.visible}}</td>
                            <td>{{data.searchable}}</td>
                            <td>{{data.createdAt}}</td>
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
        <RegistrationModal v-if="registrationmodal" @close-modal="closeregistrationModal"></RegistrationModal>
</template>

<script>
import Modal from "~/components/modal/settings/CustomcdModal.vue";
import RegistrationModal from "~/components/modal/settings/CustomcdRegistrationModal.vue";

import test from "~/assets/data/customcd.json";
import { reactive, ref } from '@vue/reactivity';
import { computed, watchEffect } from '@vue/runtime-core';
import _ from "lodash";
import { useStore } from "vuex";
import { SETTINGS, CODES } from "~/config";

import CustomCodeApi from "~/apis/commoncd";
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
        const registrationmodal =  ref(false);

        const editedItem = ref({
            code: "",
            codeName: "",
            codeType: "",
            codeElements: [],
            visible: false,
            searchable: false,
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
            console.log('View code......', item);
            if (item) {
                editedItem.value = _.cloneDeep(item);
            } 
            else {
                editedItem.value = {
                    id: 'register',
                };
            }
            console.log("editedItem", editedItem.value);
            modal.value = true;
        }
        const closeModal = () => {
            modal.value  = false;
        }
        const openregistrationModal = () => {
            registrationmodal.value = true;
        }
        const closeregistrationModal = () => {
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


        temp(datas.value);

        watchEffect(() => {
            const dump = [];

            datas.value.forEach((value, index) => {
                if(BFmatch(value.code, search.value) || BFmatch(value.codeName, search.value)){
                    dump.push(value)
                }
            });
            console.log(dump);
            temp(dump);
        })
        findList();
        function findList() {
            datas.value = [];
            try {
                CustomCodeApi.getCodes(user.value.companyId).then((res) => {
                    datas.value = res.data;
                });
            } catch (error) {
                Swal.fire({
                icon: "error",
                text: "searchingError",
                });
            }
        }

        return {
            statepage, modal, dataslength, registrationmodal, search, editedItem,
            openModal, closeModal, prevPage, nextPage, pagereset, openregistrationModal, closeregistrationModal
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