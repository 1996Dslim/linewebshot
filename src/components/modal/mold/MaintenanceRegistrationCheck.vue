<template>
        <div class="searchfield">
            <div class="box search">
                <span class="material-icons">
                    search
                </span>
                <input type="text" placeholder="Search">
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
                        <tr v-for="(data,index) in statepage.calData" :key="index" @click="openModal">
                            <td>{{ data.moldName }}</td>
                            <td>{{ data.moldCode }}</td>
                            <td>{{ data.moldType }}</td>
                            <td>{{ data.moldState }}</td>
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
                    1 - <span>{{ selected }}</span> of {{ dataslength }}
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
import Modal from "~/components/modal/mold/MaintenanceModal.vue";

import test from "~/assets/data/maintenaceRegistration.json";
import { reactive, ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';

export default {
    components: {
        Modal,
    },
    setup() {
        const datas = test;
        const dataslength = Object.keys(test).length;

        const modal =  ref(false);

        const statepage = reactive({
            selected: 10,
            pageNum: 1,
            startOffset: computed(() => {
                return (statepage.pageNum - 1) * statepage.selected;
            }),

            endOffset: computed(() => {
                 return (statepage.startOffset + statepage.selected);
            }),

            numofpage: computed(() => {
                return Math.ceil(dataslength / statepage.selected);
            }),

            calData: computed(() => {
                return datas.slice(statepage.startOffset, statepage.endOffset);
            })
        })

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

        return {
            statepage, modal, 
            openModal, closeModal, prevPage, nextPage, pagereset
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